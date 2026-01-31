# 署名付き URL アップロード機能 - フロントエンド引継書

## 📋 概要

Cloud Run の HTTP/1.1 リクエストボディサイズ制限（32MB 固定）を回避するため、大容量動画ファイル（〜100MB+）を Cloudflare R2 に直接アップロードする機能を実装します。

## 🏗️ アーキテクチャ変更

### Before (現状)

```
[Browser] ---(multipart/form-data: video file)---> [API Proxy Worker] ---> [Cloud Run]
```

**問題**: Cloud Run で `413 Content Too Large` エラーが発生（32MB 制限）

### After (変更後)

```
1. [Browser] ---(POST /upload/initiate)---> [Worker] ---> [Cloud Run]
                                                           ↓ (署名URL生成)
2. [Browser] <---(upload_url, object_key)---

3. [Browser] ---(PUT: 動画ファイル)---> [R2 Storage] (Cloud Run を経由しない!)

4. [Browser] ---(POST /process: object_key)---> [Worker] ---> [Cloud Run]
                                                               ↓
5. [Browser] <---(signed_url: 処理済み動画)---
```

**メリット**:

- ファイルサイズ制限の回避
- アップロード速度の向上（R2 のエッジに直接アップロード）
- Cloud Run の負荷軽減

---

## 🔧 実装タスク

### タスク 14-1: 型定義の追加

**ファイル**: `app/lib/api/types.ts`

```typescript
// アップロード開始リクエスト
export const UploadInitiateRequestSchema = z.object({
  filename: z.string(),
  content_type: z.string(),
  file_size: z.number(),
});
export type UploadInitiateRequest = z.infer<typeof UploadInitiateRequestSchema>;

// アップロード開始レスポンス
export const UploadInitiateResponseSchema = z.object({
  upload_url: z.string().url(),
  object_key: z.string(),
  expires_in: z.number(),
});
export type UploadInitiateResponse = z.infer<typeof UploadInitiateResponseSchema>;

// 処理リクエスト (新形式)
export const ProcessByKeyRequestSchema = z.object({
  object_key: z.string(),
  score_threshold: z.number().optional(),
});
export type ProcessByKeyRequest = z.infer<typeof ProcessByKeyRequestSchema>;
```

---

### タスク 14-2: API メソッドの追加

**ファイル**: `app/lib/api/posture-estimation.ts`

```typescript
/**
 * 署名付きアップロード URL を取得します。
 */
export async function initiateUpload(
  filename: string,
  contentType: string,
  fileSize: number
): Promise<UploadInitiateResponse> {
  const response = await apiClient.post('/api/v1/upload/initiate', {
    filename,
    content_type: contentType,
    file_size: fileSize,
  });

  return UploadInitiateResponseSchema.parse(response.data);
}

/**
 * R2 にアップロード済みの動画を処理します。
 */
export async function processVideoByKey(
  objectKey: string,
  scoreThreshold?: number
): Promise<VideoProcessResponse> {
  const response = await apiClient.post('/api/v1/process', {
    object_key: objectKey,
    score_threshold: scoreThreshold,
  });

  return VideoProcessResponseSchema.parse(response.data);
}
```

---

### タスク 14-3: アップロードロジックの実装

**ファイル**: `app/lib/services/client/video-uploader.client.ts`

```typescript
interface UploadProgress {
  phase: 'initiating' | 'uploading' | 'processing';
  progress: number; // 0-100
}

export async function uploadVideoWithPresignedUrl(
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<VideoProcessResponse> {
  // Phase 1: 署名付き URL 取得
  onProgress?.({ phase: 'initiating', progress: 0 });

  const initResponse = await initiateUpload(file.name, file.type, file.size);

  // Phase 2: R2 に直接アップロード
  onProgress?.({ phase: 'uploading', progress: 0 });

  await uploadToR2(initResponse.upload_url, file, progress => {
    onProgress?.({ phase: 'uploading', progress });
  });

  // Phase 3: 処理開始
  onProgress?.({ phase: 'processing', progress: 0 });

  const result = await processVideoByKey(initResponse.object_key);

  onProgress?.({ phase: 'processing', progress: 100 });

  return result;
}

/**
 * 署名付き URL を使用して R2 に直接アップロードします。
 */
async function uploadToR2(
  uploadUrl: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', event => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress?.(progress);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Upload failed: ${xhr.status}`));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed: Network error'));
    });

    xhr.open('PUT', uploadUrl);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.send(file);
  });
}
```

---

### タスク 14-4: UI の更新

**ファイル**: `app/components/video/ProgressOverlay.tsx`

```tsx
interface ProgressOverlayProps {
  phase: 'uploading' | 'processing';
  progress: number;
}

export function ProgressOverlay({ phase, progress }: ProgressOverlayProps) {
  const message = phase === 'uploading' ? 'R2 にアップロード中...' : '姿勢推定処理中...';

  return (
    <div className="progress-overlay">
      <div className="progress-content">
        <Spinner />
        <p>{message}</p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span>{progress}%</span>
      </div>
    </div>
  );
}
```

**ファイル**: `app/lib/hooks/useVideoProcessing.ts`

```typescript
// 状態に 'UPLOADING' を追加
type ProcessingStatus = 'IDLE' | 'UPLOADING' | 'PROCESSING' | 'COMPLETED' | 'ERROR';

interface VideoState {
  status: ProcessingStatus;
  uploadProgress: number; // 0-100
  processingProgress: number; // 0-100 (バックエンドからの進捗があれば)
  // ...
}
```

---

## 🔒 セキュリティ考慮事項

1. **署名付き URL の特性**
   - PUT メソッド専用（GET/DELETE は不可）
   - 有効期限: 15分
   - オブジェクトキーはバックエンドが生成（クライアントは指定不可）

2. **CORS 設定**
   - R2 バケットには既に CORS 設定が適用済み
   - `https://dev.kenken-pose-est.online` と `https://kenken-pose-est.online` を許可

3. **Content-Type**
   - ブラウザからの PUT リクエストには `Content-Type` ヘッダーが必須
   - `file.type` をそのまま使用

---

## 🧪 テスト観点

1. **単体テスト**
   - `initiateUpload()` のモックテスト
   - `uploadToR2()` の進捗イベントテスト
   - エラーハンドリング（ネットワークエラー、401/403 エラー）

2. **統合テスト**
   - 小さいファイル（1MB）のアップロード成功
   - 大きいファイル（80MB+）のアップロード成功
   - 進捗表示が正しく動作すること

3. **ブラウザテスト**
   - Dev 環境での E2E 動作確認
   - Chrome / Safari / Firefox での動作確認

---

## 📚 参考リンク

- [XMLHttpRequest upload progress](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/upload)
- [Cloudflare R2 CORS](https://developers.cloudflare.com/r2/buckets/cors/)
- [署名付き URL のセキュリティ](https://docs.aws.amazon.com/AmazonS3/latest/userguide/ShareObjectPreSignedURL.html)

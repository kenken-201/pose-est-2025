import { apiClient } from './client';
import { APP_CONFIG } from '../config/constants';
import { VideoUploadRequestSchema, VideoProcessResponse, VideoProcessResponseSchema } from './types';
import { AppAPIError } from './errors';

/**
 * ヘルスチェック結果の型
 */
export interface HealthCheckResult {
    /** サーバーが正常かどうか */
    healthy: boolean;
    /** レスポンス時間（ミリ秒） */
    latencyMs?: number;
    /** エラー発生時のメッセージ */
    error?: string;
}

/**
 * アップロードオプション
 */
export interface UploadOptions {
    /** リクエストをキャンセルするためのAbortSignal */
    signal?: AbortSignal;
    /** アップロード進捗コールバック（0-100の値） */
    onProgress?: (progress: number) => void;
}

/**
 * 動画をアップロードして姿勢推定処理をリクエストする
 *
 * @param file - アップロードする動画ファイル
 * @param options - アップロードオプション（キャンセル、進捗追跡）
 * @returns 処理結果のレスポンス（処理済み動画URLなど）
 * @throws AppAPIError - バリデーションエラーまたはAPIエラー時
 */
export const uploadVideo = async (
    file: File,
    options?: UploadOptions
): Promise<VideoProcessResponse> => {
    // クライアント側でのバリデーション
    const validation = VideoUploadRequestSchema.safeParse({ file: file });
    if (!validation.success) {
        throw new AppAPIError(
            validation.error.errors[0].message,
            'VALIDATION_ERROR',
            400,
            validation.error.errors
        );
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post(APP_CONFIG.API.ENDPOINTS.UPLOAD, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        signal: options?.signal,
        onUploadProgress: (progressEvent) => {
            if (options?.onProgress && progressEvent.total) {
                const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                options.onProgress(progress);
            }
        },
    });

    // レスポンスの検証と型変換
    return VideoProcessResponseSchema.parse(response.data);
};

/**
 * バックエンドAPIのヘルスチェックを行う
 *
 * @returns ヘルスチェック結果（正常性、レイテンシ、エラー情報）
 */
export const healthCheck = async (): Promise<HealthCheckResult> => {
    const start = Date.now();
    try {
        await apiClient.get(APP_CONFIG.API.ENDPOINTS.HEALTH);
        return { healthy: true, latencyMs: Date.now() - start };
    } catch (error) {
        return {
            healthy: false,
            latencyMs: Date.now() - start,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
};

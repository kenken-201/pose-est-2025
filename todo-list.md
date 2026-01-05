## 詳細な TODO リスト（段階的実装）

### **作業ルール (Strict One-by-One Workflow)**

- **設計ファースト**:
  1.  まず**設計**と**タスク分解**を行う。
  2.  タスクリストを作成したら、**一旦作業をストップ**し、承認を得る。
- **細粒度な実装とレビュー**:
  1.  承認後、**1 つのタスク**のみを実装する（TDD 厳守）。
  2.  そのタスクのテストと動作確認が完了したら、**作業をストップ**し、レビューを受ける。
  3.  承認を得たら、次のタスクへ進む。
- **品質基準**:
  - 各タスク完了時に `./scripts/quality-check.sh` を実行し、全チェック（typecheck, lint, test, build）をパスすること。
  - テストコードには詳細な日本語コメント（JSDoc/ブロックコメント）を付与すること。

### 📁 **フェーズ 1: プロジェクト基本構造セットアップ**

#### ✅ 完了済み:

- [x] Node.js 環境セットアップ
- [x] React Router v7 プロジェクト作成
- [x] 依存関係インストール完了

#### ✅ タスク 1: プロジェクト設定ファイル作成

- [x] `tsconfig.json` 作成（型定義とパス設定）
- [x] `vite.config.ts` 作成（ビルド設定）
- [x] `tailwind.config.js` 作成（スタイル設定）
- [x] `.eslintrc.cjs` 作成（リンター設定）
- [x] `.prettierrc` 作成（フォーマッター設定）

#### ✅ タスク 2: ディレクトリ構造作成

```bash
mkdir -p app/{components/{video,ui,layout},lib/{api,services,utils,hooks,stores},routes,styles}
```

#### ✅ タスク 3: エントリーファイル作成

- [x] `index.html` (ルート HTML)
- [x] `app/main.tsx` (React エントリーポイント)
- [x] `app/App.tsx` (メインアプリコンポーネント)
- [x] `app/styles/globals.css` (グローバルスタイル)

---

### 🏗️ **フェーズ 2: 型定義とユーティリティ**

#### ✅ タスク 4: 型定義ファイル作成

- [x] `app/lib/api/types.ts` - API 通信の型定義
- [x] `app/lib/services/video-processing.types.ts` - サービス層の型定義
- [x] `app/components/video/types.ts` - コンポーネントの型定義
- [x] **型定義のユニットテスト作成** - Zod スキーマのバリデーションテスト

#### ✅ タスク 5: ユーティリティ関数作成

- [x] `app/lib/utils/validation.ts` - バリデーション関数
- [x] `app/lib/utils/file-utils.ts` - ファイル操作ユーティリティ
- [x] `app/lib/utils/logger.ts` - ロギングユーティリティ
- [x] **各ユーティリティ関数のユニットテスト作成**

#### ✅ タスク 6: 設定と定数

- [x] `.env.example` - 環境変数サンプル
- [x] `app/lib/config/constants.ts` - アプリケーション定数
- [x] **Vitest 設定ファイル作成** - `vitest.config.ts`, `vitest.setup.ts`

---

### 🔌 **フェーズ 3: API 層の実装**

#### ✅ タスク 7: HTTP クライアント設定

- [x] 各関数のユニットテスト作成 (TDD)
- [x] `app/lib/api/client.ts` - Axios インスタンスとインターセプター
- [x] `app/lib/api/interceptors.ts` - リクエスト/レスポンスインターセプター

#### ✅ タスク 8: バックエンド API クライアント

- [x] `app/lib/api/posture-estimation.ts` - 姿勢推定 API 呼び出し
- [x] `app/lib/api/mocks.ts` - 開発用モック実装
- [x] ユニットテストの実装 (TDD)データ（オプション）

#### ✅ タスク 9: API エラーハンドリング

- [x] `app/lib/api/errors.ts` - カスタムエラークラス
- [x] インターセプターでのエラー変換処理
- [x] ユニットテストの実装 (TDD)データ（オプション）

---

### **🧠 フェーズ 4: サービス層と状態管理の設計**

#### ** ✅ タスク 4-1: 動画処理サービスと状態管理の設計提案**

- [x] 設計案 (`phase4_design.md`) の作成
- [x] nav: 設計案のレビューと承認

#### ** ✅ タスク 4-2: 状態管理ストア (VideoStore)**

- [x] Zustand ストアの実装 (`app/lib/stores/video.store.ts`)
- [x] ユニットテスト (`test/app/lib/stores/video.store.test.ts`)

#### ** ✅ タスク 4-3: クライアントサービス (VideoUploader)**

- [x] Axios クライアントの実装 (`app/lib/services/client/video-uploader.client.ts`)
- [x] ファイルバリデーション拡充 (`app/lib/utils/file-utils.ts`)
- [x] ユニットテスト (`test/app/lib/services/client/video-uploader.client.test.ts`)

#### ** ✅ タスク 4-4: React Query Hooks (useVideoProcessing)**

- [x] Hook 実装 (`app/lib/hooks/useVideoProcessing.ts`)
- [x] ユニットテスト (`test/app/lib/hooks/useVideoProcessing.test.tsx`)

#### ** ✅ タスク 4-5: サーバーサービス (Implementation)**

- [x] サーバーサイド実装 (`app/lib/services/server/video-processing.server.ts`)
- [x] ユニットテスト (`test/app/lib/services/server/video-processing.server.test.ts`)

---

### **🎨 フェーズ 5: UI コンポーネントの設計と実装**

#### ** ✅ タスク 5-1: UploadDropzone コンポーネント**

- [x] 設計: `phase5_design.md` の作成とレビュー
- [x] テスト作成 (`test/app/components/video/UploadDropzone.test.tsx`)
- [x] 実装 (`app/components/video/UploadDropzone.tsx`)
- [x] `react-dropzone` 統合

#### ** ✅ タスク 5-2: ProgressOverlay コンポーネント**

- [x] テスト作成 (`test/app/components/video/ProgressOverlay.test.tsx`)
- [x] 実装 (`app/components/video/ProgressOverlay.tsx`)
- [x] プログレスバーとスピナー UI

#### ** ✅ タスク 5-3: VideoPlayer コンポーネント**

- [x] テスト作成 (`test/app/components/video/VideoPlayer.test.tsx`)
- [x] 実装 (`app/components/video/VideoPlayer.tsx`)
- [x] `<video>` タグによる再生機能

#### ** ✅ タスク 5-4: ErrorDisplay コンポーネント**

- [x] テスト作成 (`test/app/components/video/ErrorDisplay.test.tsx`)
- [x] 実装 (`app/components/video/ErrorDisplay.tsx`)
- [x] リトライ・Dismiss 機能

#### ** ✅ タスク 5-5: ProcessingContainer 統合コンポーネント**

- [x] テスト作成 (`test/app/components/video/ProcessingContainer.test.tsx`)
- [x] 実装 (`app/components/video/ProcessingContainer.tsx`)
- [x] 全コンポーネント統合と状態管理連携
- [x] 統合テスト（フロー全体の検証）

---

### **🚀 フェーズ 6: ページ統合とルーティング設定**

#### ** ✅ タスク 6-1: React Query Provider セットアップ**

- [x] テスト作成 (`test/app/lib/providers/providers.test.tsx`)
- [x] 実装 (`app/lib/providers/providers.tsx`)
  - `QueryClient` インスタンス作成
  - `QueryClientProvider` ラッパーコンポーネント
- [x] `root.tsx` に Provider 統合

#### ** ✅ タスク 6-2: HomePage 統合**

- [x] テスト作成 (`test/app/routes/home.test.tsx`)
- [x] 実装 (`app/routes/home.tsx`)
  - プレースホルダーを `ProcessingContainer` に置き換え
  - SEO メタデータ維持
- [x] ブラウザ動作確認

#### ** ✅ タスク 6-3: Layout コンポーネント**

- [x] テスト作成 (`test/app/components/layout/MainLayout.test.tsx`)
- [x] 実装 (`app/components/layout/MainLayout.tsx`)
  - 共通ヘッダー（ロゴ、アプリ名）
  - 共通フッター（コピーライト）
  - コンテンツラッパー

#### ** ✅ タスク 6-4: Error Boundary 拡張**

- [x] `root.tsx` の `ErrorBoundary` を `AppAPIError` 対応に拡張
- [x] エラータイプに応じた表示分岐

#### ** ✅ タスク 6-5: ブラウザ統合テスト**

- [x] `npm run dev` で起動確認
- [x] ファイルアップロードフロー確認
- [x] モックを使用したエラー表示確認
- [x] レスポンシブ表示確認

---

### **� フェーズ 7: アプリケーション復旧**

#### ** ✅ タスク 7-1: ルーティングとレイアウトの復旧**

- [x] `root.tsx` の `Outlet` を復旧
- [x] `_index.tsx` の表示確認

#### ** ✅ タスク 7-2: プロバイダーと状態の復旧**

- [x] `root.tsx` の `AppProviders` を復旧
- [x] `useVideoProcessing` hook の初期化確認

#### ** ✅ タスク 7-3: 機能ページの復旧**

- [x] `home.tsx` のルーティング再有効化
- [x] `MainLayout` の表示確認

#### ** ✅ タスク 7-4: 機能コンポーネントの復旧**

- [x] `ProcessingContainer` 再有効化
- [x] アップロードフローの検証

---

### **🔌 フェーズ 7.5: バックエンド API 連携更新**

**Goal**: バックエンド API 仕様 (`pose-est-backend/docs/openapi.yaml`) に準拠したフロントエンド実装を行う。

#### ✅ タスク 7.5-1: 設定と型定義の更新

- [x] **7.5-1a**: `constants.ts` エンドポイント更新 (`/api/v1/process`, `/api/v1/health`)
- [x] **7.5-1b**: `types.ts` Zod スキーマ更新
  - [x] `ApiErrorSchema` をネスト形式 (`{ error: { code, message } }`) に変更
  - [x] `VideoMetaResponseSchema` 新規作成
  - [x] `VideoProcessResponseSchema` を新仕様 (`signed_url`, `video_meta`, etc.) に更新
  - [x] `HealthResponseSchema` 新規作成
- [x] **7.5-1c**: `posture-estimation.ts` 更新 (FormData キー `video` → `file`)
- [x] **7.5-1d**: `errors.ts` 更新 (新エラー形式のパース対応)
- [x] **7.5-1e**: `ProcessingContainer.tsx` 参照更新 (`processedVideoUrl` → `signed_url`)
- [x] **7.5-1f**: モックデータと既存テストの更新
- [x] **テスト実行**: 全テストがパスすることを確認
- [x] **🛑 [Review] 型定義変更の確認**

#### ✅ タスク 7.5-2: エラーコード対応表の実装

- [x] **7.5-2a**: エラーコード型定義の追加 (`BackendErrorCode`, `ClientErrorCode`, `ErrorCode`)
- [x] **7.5-2b**: エラーメッセージマッピングテーブルの実装 (`ERROR_MESSAGES`)
- [x] **7.5-2c**: ユーザー向けメッセージ取得ヘルパーの実装 (`getUserFriendlyMessage`)
- [x] **7.5-2d**: `AppAPIError` に `userMessage` ゲッターを追加
- [x] **7.5-2e**: 単体テストの追加（既知コード、未知コード、userMessage）
- [x] **テスト実行**: 全テストがパスすることを確認
- [x] **🛑 [Review] エラーメッセージ内容の確認**

#### ✅ タスク 7.5-3: ErrorDisplay コンポーネントの拡張

- [x] **7.5-3a**: `ErrorDisplay` の更新 (`userMessage` の優先表示)
- [x] **7.5-3b**: `ErrorDisplay.test.tsx` の更新（日本語メッセージ表示検証）
- [x] **テスト実行**: 全テストがパスすることを確認
- [x] **🛑 [Review] UI/UX 確認**

#### ⬜ タスク 7.5-4: 環境変数とデプロイ設定

- [ ] **7.5-4a**: `.env.example` に環境別設定例を追記（dev/prod ドメイン）
- [ ] **7.5-4b**: `README.md` に環境変数設定手順を追記（Cloudflare Pages 含む）
- [ ] **7.5-4c**: Cloudflare Pages ビルド設定の確認
- [ ] **🛑 [Review] デプロイ設定の確認**

#### ⬜ タスク 7.5-5: 本番環境連携テスト

- [ ] 開発環境 (`dev.kenken-pose-est.online`) へ実際に動画をアップロードして動作確認
- [ ] クロスオリジンリクエスト (CORS) が正しく動作するか確認
- [ ] **🛑 [Review] E2E 動作確認**

---

### **🧪 フェーズ 8: 統合テストと最適化**

#### ** ⬜ タスク 8-1: エラーハンドリングの強化とパフォーマンスレビュー**

- **目的**: ネットワーク異常、ファイル形式エラーなどへの耐性を高め、UX を改善する。
- **AI への依頼**:
  1.  考えられるすべての異常系（ネットワークエラー、タイムアウト、不正なファイル、バックエンドエラーなど）と、その場合のユーザーへの通知方法について、**エラーハンドリング仕様**を提案してください。
  2.  アプリケーションのパフォーマンスボトルネックを特定し、メモ化、コード分割、レンダリング最適化などの**最適化提案**をしてください。
- **完了条件**: エラーハンドリング実装とパフォーマンス最適化が完了し、テストカバレッジを維持。

---

### 🔧 **フェーズ 8: 最適化とデバッグ**

#### ⬜ タスク 8-1: パフォーマンス最適化

- [ ] コンポーネントのメモ化
- [ ] コード分割の設定
- [ ] 画像・動画の遅延ロード

#### ⬜ タスク 8-2: レスポンシブデザイン調整

- [ ] モバイル対応
- [ ] デスクトップ最適化

#### ⬜ タスク 8-3: 開発環境改善

- [ ] ホットリロード設定
- [ ] デバッグツール統合
- [ ] VS Code 設定

---

### 🚢 **フェーズ 9: ビルドとデプロイ準備**

#### ⬜ タスク 9-1: ビルド設定

- [ ] プロダクションビルドテスト
- [ ] 環境変数設定

#### ⬜ タスク 9-2: デプロイ設定

- [ ] Dockerfile 作成
  - docker desktop ではなく、colima を使用する
  - デプロイには Cloudflare Pages を使用する
- [ ] CI/CD 設定（オプション）

---

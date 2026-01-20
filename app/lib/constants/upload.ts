/**
 * ファイルアップロード定数
 *
 * バックエンドの制約に合わせてファイルアップロードの制限を定義します。
 * Cloud Run のリクエストボディサイズ制限が 32MB であるため、
 * 安全な閾値として 30MB を使用します。
 *
 * @see https://cloud.google.com/run/quotas#request_limits
 */

/**
 * 最大ファイルサイズ (バイト単位, 30MB)。
 * UploadDropzone コンポーネントでのバリデーションに使用されます。
 */
export const MAX_FILE_SIZE_BYTES = 30 * 1024 * 1024;

/**
 * ファイルサイズ制限の表示用文字列。
 * UIメッセージやエラーテキストで使用されます。
 */
export const MAX_FILE_SIZE_DISPLAY = '30MB';

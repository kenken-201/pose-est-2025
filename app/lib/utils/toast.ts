import { toast, type ExternalToast } from 'sonner';

/**
 * トースト通知ユーティリティ
 *
 * トーストライブラリ (sonner) をラップし、一貫した成功/エラー通知を提供します。
 */

/**
 * 成功トースト通知を表示します。
 * @param message - 表示するメッセージ
 * @param options - オプションのトースト設定（例：表示時間、説明文）
 */
export const showSuccess = (message: string, options?: ExternalToast) => {
  toast.success(message, options);
};

/**
 * エラートースト通知を表示します。
 * @param message - 表示するメッセージ
 * @param options - オプションのトースト設定
 */
export const showError = (message: string, options?: ExternalToast) => {
  toast.error(message, options);
};

/**
 * 情報トースト通知を表示します。
 * @param message - 表示するメッセージ
 * @param options - オプションのトースト設定
 */
export const showInfo = (message: string, options?: ExternalToast) => {
  toast.info(message, options);
};

/**
 * 特定のトーストまたは全てのトーストを閉じます。
 * @param toastId - 閉じるトーストのID（省略時は全て閉じる）
 */
export const dismissToast = (toastId?: string | number) => {
  toast.dismiss(toastId);
};

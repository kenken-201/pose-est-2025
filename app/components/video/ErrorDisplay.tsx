import type { FC } from 'react';
import { AlertCircle, RotateCcw, X } from 'lucide-react';
import { AppAPIError } from '@/lib/api/errors';

interface ErrorDisplayProps {
  /** 表示するエラーオブジェクト */
  error: Error | AppAPIError | null;
  /** AppAPIError かどうかのフラグ（型ガード結果を親から受け取る） */
  isApiError?: boolean;
  /** 再試行時のコールバック */
  onRetry?: () => void;
  /** 閉じるボタン押下時のコールバック */
  onDismiss?: () => void;
}

/**
 * エラー表示コンポーネント
 *
 * 発生したエラーをユーザーに分かりやすく表示し、
 * 可能であれば再試行や非表示のアクションを提供します。
 */
export const ErrorDisplay: FC<ErrorDisplayProps> = ({
  error,
  isApiError = false,
  onRetry,
  onDismiss,
}) => {
  if (!error) return null;

  // AppAPIError の場合はユーザー向け日本語メッセージを優先
  // 通常のエラーの場合はそのまま表示（フォールバック付き）
  const errorMessage =
    error instanceof AppAPIError
      ? error.userMessage
      : error.message || '不明なエラーが発生しました';

  const errorCode = isApiError && error instanceof AppAPIError ? error.code : undefined;

  return (
    <div
      className="rounded-lg bg-red-50 p-4 border border-red-400 shadow-sm relative animate-in fade-in slide-in-from-top-2 duration-300"
      data-testid="error-display"
      role="alert"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-6 w-6 text-red-600" aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1 pt-0.5">
          <h3 className="text-sm font-bold text-red-900">エラーが発生しました</h3>
          <div className="mt-2 text-sm text-red-800 leading-relaxed">
            <p className="font-medium">{errorMessage}</p>
            {errorCode && (
              <p className="mt-1.5 text-xs text-red-600 font-mono bg-red-100/50 inline-block px-1.5 py-0.5 rounded">
                コード: {errorCode}
              </p>
            )}
          </div>
          {onRetry && (
            <div className="mt-4">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-red-700 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-50 transition-colors"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                再試行する
              </button>
            </div>
          )}
        </div>
        {onDismiss && (
          <div className="ml-4 flex-shrink-0">
            <button
              type="button"
              onClick={onDismiss}
              className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
            >
              <span className="sr-only">閉じる</span>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

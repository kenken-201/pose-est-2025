import type { FC } from 'react';
import { AlertCircle, RotateCcw, X } from 'lucide-react';
import { AppAPIError } from '../../lib/api/errors';

interface ErrorDisplayProps {
    /** 表示するエラーオブジェクト */
    error: Error | AppAPIError | null;
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
    onRetry,
    onDismiss,
}) => {
    if (!error) return null;

    const isApiError = error instanceof AppAPIError;
    const errorMessage = error.message || '不明なエラーが発生しました';
    const errorCode = isApiError ? (error as AppAPIError).code : undefined;

    return (
        <div className="rounded-md bg-red-50 p-4 border border-red-200 relative animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex">
                <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3 flex-1">
                    <h3 className="text-sm font-medium text-red-800">
                        エラーが発生しました
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                        <p>{errorMessage}</p>
                        {errorCode && (
                            <p className="mt-1 text-xs text-red-500 font-mono">
                                コード: {errorCode}
                            </p>
                        )}
                    </div>
                    {onRetry && (
                        <div className="mt-4">
                            <button
                                type="button"
                                onClick={onRetry}
                                className="inline-flex items-center rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                            >
                                <RotateCcw className="mr-1.5 h-4 w-4" />
                                再試行
                            </button>
                        </div>
                    )}
                </div>
                {onDismiss && (
                    <div className="ml-auto pl-3">
                        <div className="-mx-1.5 -my-1.5">
                            <button
                                type="button"
                                onClick={onDismiss}
                                aria-label="閉じる"
                                className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                            >
                                <span className="sr-only">閉じる</span>
                                <X className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

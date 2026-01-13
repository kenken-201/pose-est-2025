import { isRouteErrorResponse } from 'react-router';

interface GlobalErrorProps {
  error: unknown;
}

/**
 * アプリケーション全体のエラー表示コンポーネント
 * root.tsx の ErrorBoundary から呼び出されます
 */
export function GlobalError({ error }: GlobalErrorProps) {
  let message = '予期せぬエラーが発生しました';
  let details: string = '不明なエラー';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? 'ページが見つかりません' : 'エラーが発生しました';
    details = error.data?.message || error.statusText || 'エラーの詳細はありません';
  } else if (error instanceof Error) {
    details = error.message;
    if (import.meta.env.DEV) {
      stack = error.stack;
    }
  } else if (typeof error === 'string') {
    details = error;
  } else if (error && typeof error === 'object' && 'message' in error) {
    details = String((error as { message: unknown }).message);
  } else {
    details = String(error);
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">{message}</h1>
        <p className="text-gray-600 mb-6">{details}</p>
        {stack && <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">{stack}</pre>}
      </div>
    </main>
  );
}

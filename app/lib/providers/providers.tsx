import type { FC, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// QueryClient のインスタンス作成
// クライアントサイドでのみ実行されることを想定（SSRの場合は別途考慮が必要）
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1, // 失敗時は1回だけリトライ
            refetchOnWindowFocus: false, // ウィンドウフォーカス時の再取得を無効化
            staleTime: 5 * 60 * 1000, // 5分間はキャッシュを維持
        },
    },
});

interface AppProvidersProps {
    children: ReactNode;
}

/**
 * アプリケーション全体に提供するプロバイダーコンポーネント
 * 
 * 現在は React Query (TanStack Query) のコンテキストを提供
 */
export const AppProviders: FC<AppProvidersProps> = ({ children }) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

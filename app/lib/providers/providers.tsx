import { type FC, type ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface AppProvidersProps {
    children: ReactNode;
}

/**
 * アプリケーション全体に提供するプロバイダーコンポーネント
 * 
 * リクエストスコープ（またはコンポーネントマウント時）に
 * QueryClient を初期化して、キャッシュの独立性を保ちます。
 */
export const AppProviders: FC<AppProvidersProps> = ({ children }) => {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                retry: 1,
                refetchOnWindowFocus: false,
                staleTime: 5 * 60 * 1000,
            },
        },
    }));

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

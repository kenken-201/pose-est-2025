import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AppProviders } from '@/lib/providers/providers';
import { useQuery } from '@tanstack/react-query';

/**
 * テスト用コンポーネント
 * React Query のフックが正常に動作するか確認する
 */
const TestChild = () => {
    // useQuery の動作確認
    const { data } = useQuery({
        queryKey: ['test-query'],
        queryFn: () => 'success',
        // テスト用にリトライを無効化
        retry: false,
    });

    return <div>Query Status: {data}</div>;
};

/**
 * AppProviders コンポーネントのテスト
 *
 * ユースケース:
 * 1. 子コンポーネントがレンダリングされること
 * 2. React Query のコンテキストが提供されていること
 */
describe('AppProviders', () => {
    it('renders children correctly', () => {
        render(
            <AppProviders>
                <div data-testid="child">Child Content</div>
            </AppProviders>
        );

        expect(screen.getByTestId('child')).toHaveTextContent('Child Content');
    });

    it('provides React Query context', async () => {
        // QueryClientProvider が正しく設定されていれば、useQuery が動作する
        render(
            <AppProviders>
                <TestChild />
            </AppProviders>
        );
        
        // データが解決されるのを待つ
        const statusElement = await screen.findByText('Query Status: success');
        expect(statusElement).toBeInTheDocument();
    });
});

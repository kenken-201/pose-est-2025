import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HomePage, { meta } from '@/routes/_index';

// ProcessingContainer のモック
vi.mock('@/components/video/ProcessingContainer', () => ({
    ProcessingContainer: () => <div data-testid="processing-container">ProcessingContainer Mock</div>,
}));

/**
 * HomePage コンポーネントのテスト
 *
 * ユースケース:
 * 1. ページタイトルとメタデータが正しく設定されていること
 * 2. ProcessingContainer が表示されること
 * 3. ヘッダー情報（アプリ名、説明）が表示されること
 */
describe('HomePage', () => {
    it('has correct meta tags', () => {
        const metaTags = meta();
        
        expect(metaTags).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ title: expect.stringContaining('姿勢推定') }),
                expect.objectContaining({ name: 'description' }),
            ])
        );
    });

    it('renders page title and description', () => {
        render(<HomePage />);
        
        expect(screen.getByText(/KenKen姿勢推定スポーツ分析/i)).toBeInTheDocument();
        expect(screen.getByText(/動画をアップロードして/i)).toBeInTheDocument();
    });

    it('renders ProcessingContainer', () => {
        render(<HomePage />);
        
        expect(screen.getByTestId('processing-container')).toBeInTheDocument();
    });
});

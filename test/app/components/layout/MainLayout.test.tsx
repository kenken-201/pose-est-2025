import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MainLayout } from '@/components/layout/MainLayout';

/**
 * MainLayout コンポーネントのテスト
 *
 * ユースケース:
 * 1. ヘッダーにアプリ名が表示されること
 * 2. 子コンポーネントが正しくレンダリングされること
 * 3. フッターにコピーライトが表示されること
 */
describe('MainLayout', () => {
    it('renders header with app name', () => {
        render(
            <MainLayout>
                <div>Content</div>
            </MainLayout>
        );

        const header = screen.getByRole('banner');
        expect(header).toBeInTheDocument();
        // ヘッダー内のh1要素を確認
        expect(header.querySelector('h1')).toHaveTextContent('KenKen姿勢推定スポーツ分析');
    });

    it('renders children content', () => {
        render(
            <MainLayout>
                <div data-testid="test-content">Test Content</div>
            </MainLayout>
        );

        expect(screen.getByTestId('test-content')).toHaveTextContent('Test Content');
    });

    it('renders footer with copyright', () => {
        render(
            <MainLayout>
                <div>Content</div>
            </MainLayout>
        );

        expect(screen.getByRole('contentinfo')).toBeInTheDocument();
        expect(screen.getByText(/©/)).toBeInTheDocument();
    });
});

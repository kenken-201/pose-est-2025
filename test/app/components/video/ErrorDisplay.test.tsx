import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ErrorDisplay } from '@/components/video/ErrorDisplay';
import { AppAPIError } from '@/lib/api/errors';

/**
 * ErrorDisplay コンポーネントのテスト
 *
 * ユースケース:
 * 1. エラーなし: error propがnullの場合は何も表示されないこと
 * 2. エラー表示: Errorオブジェクトのメッセージが表示されること
 * 3. AppAPIError表示: AppAPIErrorの場合、詳細なメッセージやステータスコードが表示されること
 * 4. インタラクション: リトライ、閉じるボタンが機能すること
 */
describe('ErrorDisplay', () => {
    it('renders nothing when error is null', () => {
        const { container } = render(<ErrorDisplay error={null} />);
        expect(container).toBeEmptyDOMElement();
    });

    it('renders standard Error message', () => {
        const error = new Error('一般的なエラーが発生しました');
        render(<ErrorDisplay error={error} />);
        
        expect(screen.getByText('エラーが発生しました')).toBeInTheDocument();
        expect(screen.getByText('一般的なエラーが発生しました')).toBeInTheDocument();
    });

    it('renders AppAPIError message and code', () => {
        const apiError = new AppAPIError('APIエラー', 'BAD_REQUEST', 400);
        render(<ErrorDisplay error={apiError} />);
        
        expect(screen.getByText('APIエラー')).toBeInTheDocument();
        expect(screen.getByText(/コード: BAD_REQUEST/)).toBeInTheDocument();
    });

    it('calls onRetry when retry button is clicked', () => {
        const onRetry = vi.fn();
        const error = new Error('Retry test');
        render(<ErrorDisplay error={error} onRetry={onRetry} />);
        
        const retryButton = screen.getByRole('button', { name: /再試行/i });
        fireEvent.click(retryButton);
        
        expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it('calls onDismiss when close button is clicked', () => {
        const onDismiss = vi.fn();
        const error = new Error('Dismiss test');
        render(<ErrorDisplay error={error} onDismiss={onDismiss} />);
        
        // 閉じるボタン（通常は×アイコンなど）をRoleまたはLabelで取得
        // ここでは aria-label="閉じる" を想定
        const closeButton = screen.getByLabelText(/閉じる/i);
        fireEvent.click(closeButton);
        
        expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('does not render retry button if onRetry is not provided', () => {
        const error = new Error('No retry');
        render(<ErrorDisplay error={error} />);
        
        expect(screen.queryByRole('button', { name: /再試行/i })).not.toBeInTheDocument();
    });
});

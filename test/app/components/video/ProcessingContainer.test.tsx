import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProcessingContainer } from '@/components/video/ProcessingContainer';
import { ProcessingStatus } from '@/lib/stores/video.store';
import { AppAPIError } from '@/lib/api/errors';

// モックの作成
const mockProcessVideo = vi.fn();
const mockReset = vi.fn();

// useVideoProcessing のモック
vi.mock('@/lib/hooks/useVideoProcessing', () => ({
    useVideoProcessing: () => ({
        processVideo: mockProcessVideo,
        reset: mockReset,
    }),
}));

// useVideoStore のモック（テストごとに状態を変更できるようにする）
const mockStoreState = vi.fn();
vi.mock('@/lib/stores/video.store', () => ({
    useVideoStore: () => mockStoreState(),
    ProcessingStatus: {
        IDLE: 'IDLE',
        UPLOADING: 'UPLOADING',
        PROCESSING: 'PROCESSING',
        COMPLETED: 'COMPLETED',
        ERROR: 'ERROR',
    },
    isAppAPIError: (error: unknown) => error instanceof AppAPIError,
}));

/**
 * ProcessingContainer コンポーネントのテスト
 *
 * ユースケース:
 * 1. IDLE状態: UploadDropzone が表示されること
 * 2. UPLOADING状態: ProgressOverlay が表示されること
 * 3. PROCESSING状態: スピナー付きオーバーレイが表示されること
 * 4. COMPLETED状態: VideoPlayer が表示されること
 * 5. ERROR状態: ErrorDisplay が表示されること
 * 6. インタラクション: ファイル選択時に processVideo が呼ばれること
 * 7. インタラクション: リトライ時に reset が呼ばれること
 * 8. レイアウト安定性: ContainerWrapper により一貫したサイズが維持されること
 */
describe('ProcessingContainer', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders UploadDropzone when status is IDLE', () => {
        mockStoreState.mockReturnValue({
            status: ProcessingStatus.IDLE,
            progress: 0,
            result: null,
            error: null,
        });

        render(<ProcessingContainer />);
        expect(screen.getByText(/動画をドラッグ＆ドロップ/i)).toBeInTheDocument();
        expect(screen.getByTestId('processing-container')).toBeInTheDocument();
    });

    it('renders ProgressOverlay when status is UPLOADING', () => {
        mockStoreState.mockReturnValue({
            status: ProcessingStatus.UPLOADING,
            progress: 50,
            result: null,
            error: null,
        });

        render(<ProcessingContainer />);
        expect(screen.getByText('50%')).toBeInTheDocument();
        expect(screen.getByText(/アップロード中/i)).toBeInTheDocument();
        expect(screen.getByTestId('progress-overlay')).toBeInTheDocument();
    });

    it('renders ProgressOverlay when status is PROCESSING', () => {
        mockStoreState.mockReturnValue({
            status: ProcessingStatus.PROCESSING,
            progress: 100,
            result: null,
            error: null,
        });

        render(<ProcessingContainer />);
        expect(screen.getByText(/動画を処理中/i)).toBeInTheDocument();
    });

    it('renders VideoPlayer when status is COMPLETED', () => {
        mockStoreState.mockReturnValue({
            status: ProcessingStatus.COMPLETED,
            progress: 100,
            result: { signed_url: 'http://example.com/result.mp4', video_meta: {}, total_poses: 0, processing_time_sec: 0 } as any,
            error: null,
        });

        render(<ProcessingContainer />);
        const videoElement = screen.getByTestId('video-player');
        expect(videoElement).toBeInTheDocument();
        expect(videoElement).toHaveAttribute('src', 'http://example.com/result.mp4');
    });

    it('renders ErrorDisplay when status is ERROR', () => {
        mockStoreState.mockReturnValue({
            status: ProcessingStatus.ERROR,
            progress: 0,
            result: null,
            error: new AppAPIError('テストエラー', 'TEST_ERROR', 400),
        });

        render(<ProcessingContainer />);
        expect(screen.getByText('テストエラー')).toBeInTheDocument();
        expect(screen.getByTestId('error-display')).toBeInTheDocument();
    });

    it('calls processVideo when file is selected', async () => {
         mockStoreState.mockReturnValue({
            status: ProcessingStatus.IDLE,
            progress: 0,
            result: null,
            error: null,
        });

        render(<ProcessingContainer />);
        const input = screen.getByTestId('dropzone-input');
        const file = new File(['dummy'], 'test.mp4', { type: 'video/mp4' });

        fireEvent.change(input, { target: { files: [file] } });

        await waitFor(() => {
            expect(mockProcessVideo).toHaveBeenCalledWith(file);
        });
    });

    it('calls reset when retry button is clicked', () => {
        mockStoreState.mockReturnValue({
            status: ProcessingStatus.ERROR,
            progress: 0,
            result: null,
            error: new Error('Retry test'),
        });

        render(<ProcessingContainer />);
        const retryButton = screen.getByRole('button', { name: /再試行/i });
        fireEvent.click(retryButton);

        expect(mockReset).toHaveBeenCalledTimes(1);
    });

    it('has consistent container sizing to prevent layout shift', () => {
        mockStoreState.mockReturnValue({
            status: ProcessingStatus.IDLE,
            progress: 0,
            result: null,
            error: null,
        });

        render(<ProcessingContainer />);
        const container = screen.getByTestId('processing-container');
        
        // ContainerWrapper が適用されていることを確認
        expect(container).toHaveClass('max-w-xl');
        expect(container).toHaveClass('h-64');
    });
});

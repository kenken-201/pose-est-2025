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
const mockUseVideoStore = vi.fn();
vi.mock('@/lib/stores/video.store', () => ({
    useVideoStore: (selector: (state: unknown) => unknown) => mockUseVideoStore(selector),
    ProcessingStatus: {
        IDLE: 'IDLE',
        UPLOADING: 'UPLOADING',
        PROCESSING: 'PROCESSING',
        COMPLETED: 'COMPLETED',
        ERROR: 'ERROR',
    },
}));

describe('ProcessingContainer', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders UploadDropzone when status is IDLE', () => {
        mockUseVideoStore.mockReturnValue({
            status: ProcessingStatus.IDLE,
            progress: 0,
            result: null,
            error: null,
        });

        render(<ProcessingContainer />);
        expect(screen.getByText(/動画をドラッグ＆ドロップ/i)).toBeInTheDocument();
    });

    it('renders ProgressOverlay when status is UPLOADING', () => {
        mockUseVideoStore.mockReturnValue({
            status: ProcessingStatus.UPLOADING,
            progress: 50,
            result: null,
            error: null,
        });

        render(<ProcessingContainer />);
        expect(screen.getByText('50%')).toBeInTheDocument();
        expect(screen.getByText(/アップロード中/i)).toBeInTheDocument();
    });

    it('renders ProgressOverlay when status is PROCESSING', () => {
        mockUseVideoStore.mockReturnValue({
            status: ProcessingStatus.PROCESSING,
            progress: 100,
            result: null,
            error: null,
        });

        render(<ProcessingContainer />);
        expect(screen.getByText(/動画を処理中/i)).toBeInTheDocument();
    });

    it('renders VideoPlayer when status is COMPLETED', () => {
        mockUseVideoStore.mockReturnValue({
            status: ProcessingStatus.COMPLETED,
            progress: 100,
            result: { processedVideoUrl: 'http://example.com/result.mp4' },
            error: null,
        });

        render(<ProcessingContainer />);
        const videoElement = screen.getByTestId('video-player');
        expect(videoElement).toBeInTheDocument();
        expect(videoElement).toHaveAttribute('src', 'http://example.com/result.mp4');
    });

    it('renders ErrorDisplay when status is ERROR', () => {
        mockUseVideoStore.mockReturnValue({
            status: ProcessingStatus.ERROR,
            progress: 0,
            result: null,
            error: new AppAPIError('テストエラー', 'TEST_ERROR', 400),
        });

        render(<ProcessingContainer />);
        expect(screen.getByText('テストエラー')).toBeInTheDocument();
        expect(screen.getByText(/コード: TEST_ERROR/)).toBeInTheDocument();
    });

    it('calls processVideo when file is selected', async () => {
         mockUseVideoStore.mockReturnValue({
            status: ProcessingStatus.IDLE,
            progress: 0,
            result: null,
            error: null,
        });

        render(<ProcessingContainer />);
        const input = screen.getByTestId('dropzone-input');
        const file = new File(['dummy'], 'test.mp4', { type: 'video/mp4' });

        // react-dropzone の input にファイルをアップロード
        // userEvent doesn't work well with hidden file inputs in some environments without proper setup
        // fireEvent.change is a reliable fallback for checking the callback invocation
        fireEvent.change(input, { target: { files: [file] } });

        await waitFor(() => {
            expect(mockProcessVideo).toHaveBeenCalledWith(file);
        });
    });

    it('calls reset when retry button is clicked', () => {
        mockUseVideoStore.mockReturnValue({
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
});

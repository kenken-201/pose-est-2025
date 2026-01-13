import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useVideoProcessing } from '@/lib/hooks/useVideoProcessing';
import { useVideoStore, ProcessingStatus } from '@/lib/stores/video.store';
import { videoUploader } from '@/lib/services/client/video-uploader.client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { VideoProcessResponse } from '@/lib/api/types';
import React from 'react';

// クライアントサービスのモック化
vi.mock('@/lib/services/client/video-uploader.client', () => ({
  videoUploader: {
    uploadVideo: vi.fn(),
  },
}));

// Setup QueryClient wrapper for testing
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

/**
 * 動画処理Hooks (useVideoProcessing) のユニットテスト
 *
 * React QueryのMutationとGlobal Store (Zustand) の連携を検証します。
 * 非同期処理の進行に合わせてストアの状態が正しく更新されるかを確認します。
 */
describe('useVideoProcessing Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    act(() => {
      useVideoStore.getState().reset();
    });
  });

  /**
   * 初期状態の検証
   *
   * Hook使用開始時点で、Storeの状態がIDLEであり、
   * Hook自身のステータスもidleであることを確認します。
   */
  it('should initialize with idle state', () => {
    const { result } = renderHook(() => useVideoProcessing(), { wrapper: createWrapper() });
    const storeState = useVideoStore.getState();

    expect(storeState.status).toBe(ProcessingStatus.IDLE);
    expect(result.current.isIdle).toBe(true);
  });

  /**
   * アップロード開始時の状態遷移の検証
   *
   * プロセス開始時（Mutation実行時）に、
   * Storeの状態がUPLOADINGに更新されることを確認します。
   * アップロード処理が完了する前の状態を確認するため、Promiseを遅延させています。
   */
  it('should update store to UPLOADING on mutation start', async () => {
    // Delay resolution to check loading state
    vi.mocked(videoUploader.uploadVideo).mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useVideoProcessing(), { wrapper: createWrapper() });

    const file = new File([''], 'test.mp4', { type: 'video/mp4' });

    act(() => {
      result.current.processVideo(file);
    });

    await waitFor(() => {
      const state = useVideoStore.getState();
      expect(state.status).toBe(ProcessingStatus.UPLOADING);
    });
  });

  /**
   * 正常終了時の状態遷移の検証
   *
   * アップロード処理が成功した場合、
   * - Storeの状態がCOMPLETEDになること
   * - Storeのresultに、APIからのレスポンス結果が格納されること
   * を確認します。
   */
  it('should update store to COMPLETED on success', async () => {
    const mockResult: VideoProcessResponse = {
      signed_url: 'https://example.com/video.mp4',
      video_meta: {
        width: 1920,
        height: 1080,
        fps: 30,
        duration_sec: 10,
        has_audio: false,
      },
      total_poses: 100,
      processing_time_sec: 2.0,
    };
    vi.mocked(videoUploader.uploadVideo).mockResolvedValue(mockResult);

    const { result } = renderHook(() => useVideoProcessing(), { wrapper: createWrapper() });
    const file = new File([''], 'test.mp4', { type: 'video/mp4' });

    await act(async () => {
      result.current.processVideo(file);
    });

    await waitFor(() => {
      const state = useVideoStore.getState();
      expect(state.status).toBe(ProcessingStatus.COMPLETED);
      expect(state.result).toEqual(mockResult);
    });
  });

  /**
   * エラー発生時の状態遷移の検証
   *
   * アップロード処理が失敗した場合、
   * - Storeの状態がERRORになること
   * - Storeのerrorに、エラーオブジェクトが格納されること
   * を確認します。
   */
  it('should update store to ERROR on failure', async () => {
    const mockError = new Error('Upload failed');
    vi.mocked(videoUploader.uploadVideo).mockRejectedValue(mockError);

    const { result } = renderHook(() => useVideoProcessing(), { wrapper: createWrapper() });
    const file = new File([''], 'test.mp4', { type: 'video/mp4' });

    await act(async () => {
      // catch error to prevent test failure from unhandled rejection
      try {
        await result.current.processVideo(file);
      } catch {
        // Ignore error, we are testing state update
      }
    });

    await waitFor(() => {
      const state = useVideoStore.getState();
      expect(state.status).toBe(ProcessingStatus.ERROR);
      expect(state.error).toEqual(mockError);
    });
  });
});

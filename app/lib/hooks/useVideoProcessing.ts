/**
 * @fileoverview 動画処理カスタムフック
 *
 * React Query と Zustand を統合し、動画アップロード・処理の
 * 非同期状態管理を提供します。
 */
import { useMutation } from '@tanstack/react-query';
import { videoUploader } from '../services/client/video-uploader.client';
import { useVideoStore } from '../stores/video.store';
import { VideoProcessResponse } from '../api/types';
import { AppAPIError } from '../api/errors';

/**
 * 動画処理カスタムフック
 *
 * React QueryのuseMutationを使用して非同期処理を管理し、
 * 進捗や結果をGlobal Store (Zustand) に同期します。
 *
 * @returns 動画処理の状態とアクション
 *
 * @example
 * ```tsx
 * const { processVideo, isLoading, error } = useVideoProcessing();
 * await processVideo(file);
 * ```
 */
export const useVideoProcessing = () => {
    // Critical Fix #2: Use store reference instead of destructuring to avoid stale closures
    const store = useVideoStore;

    const mutation = useMutation<VideoProcessResponse, Error | AppAPIError, File>({
        mutationFn: (file: File) => {
            // 進捗コールバックで状態更新
            return videoUploader.uploadVideo(file, (progress) => {
                store.getState().setUploading(progress);
            });
        },
        // Critical Fix #2: Set initial state BEFORE mutation starts
        onMutate: () => {
            store.getState().setUploading(0);
        },
        onSuccess: (data) => {
            store.getState().setCompleted(data);
        },
        onError: (error) => {
            store.getState().setError(error);
        },
    });

    return {
        processVideo: mutation.mutateAsync,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        isSuccess: mutation.isSuccess,
        error: mutation.error,
        reset: mutation.reset,
        isIdle: mutation.isIdle,
    };
};

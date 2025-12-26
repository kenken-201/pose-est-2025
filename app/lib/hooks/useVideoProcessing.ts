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
 */
export const useVideoProcessing = () => {
    const { setUploading, setCompleted, setError } = useVideoStore();

    const mutation = useMutation<VideoProcessResponse, Error | AppAPIError, File>({
        mutationFn: (file: File) => {
            // Mutation開始時に進捗0%でUploading状態へ
            setUploading(0);
            return videoUploader.uploadVideo(file, (progress) => {
                setUploading(progress);
            });
        },
        onSuccess: (data) => {
            setCompleted(data);
        },
        onError: (error) => {
            setError(error);
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

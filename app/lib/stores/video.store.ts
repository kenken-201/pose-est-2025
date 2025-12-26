import { create } from 'zustand';
import { AppAPIError } from '../api/errors';
import { VideoProcessResponse } from '../api/types';

/**
 * 動画処理のステータス定義
 */
export enum ProcessingStatus {
    IDLE = 'IDLE',
    VALIDATING = 'VALIDATING',
    UPLOADING = 'UPLOADING',
    PROCESSING = 'PROCESSING',
    COMPLETED = 'COMPLETED',
    ERROR = 'ERROR',
}

/**
 * アプリケーション全体の動画処理状態
 */
export interface VideoState {
    status: ProcessingStatus;
    progress: number;
    error: Error | AppAPIError | null;
    result: VideoProcessResponse | null;

    // Actions
    reset: () => void;
    setStatus: (status: ProcessingStatus) => void;
    setUploading: (progress: number) => void;
    setCompleted: (result: VideoProcessResponse) => void;
    setError: (error: Error | AppAPIError) => void;
}

const INITIAL_STATE = {
    status: ProcessingStatus.IDLE,
    progress: 0,
    error: null,
    result: null,
};

/**
 * 動画処理のグローバル状態管理ストア (Zustand)
 * 画面遷移しても状態を維持するために使用
 */
export const useVideoStore = create<VideoState>((set) => ({
    ...INITIAL_STATE,

    reset: () => set(INITIAL_STATE),

    setStatus: (status) => set({ status }),

    setUploading: (progress) =>
        set({
            status: ProcessingStatus.UPLOADING,
            progress,
        }),

    setCompleted: (result) =>
        set({
            status: ProcessingStatus.COMPLETED,
            result,
            progress: 100, // Ensure progress is complete
        }),

    setError: (error) =>
        set({
            status: ProcessingStatus.ERROR,
            error,
        }),
}));

/**
 * @fileoverview 動画処理状態管理ストア
 *
 * アプリケーション全体の動画処理状態を管理するZustandストア。
 * 画面遷移しても状態を維持し、UI コンポーネント間で共有されます。
 */
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
 * Critical Fix #3: 有効な状態遷移の定義
 * 不正な状態遷移を防ぐための状態マシン定義
 */
const VALID_TRANSITIONS: Record<ProcessingStatus, ProcessingStatus[]> = {
    [ProcessingStatus.IDLE]: [ProcessingStatus.VALIDATING, ProcessingStatus.UPLOADING],
    [ProcessingStatus.VALIDATING]: [ProcessingStatus.UPLOADING, ProcessingStatus.ERROR, ProcessingStatus.IDLE],
    [ProcessingStatus.UPLOADING]: [ProcessingStatus.PROCESSING, ProcessingStatus.COMPLETED, ProcessingStatus.ERROR, ProcessingStatus.IDLE],
    [ProcessingStatus.PROCESSING]: [ProcessingStatus.COMPLETED, ProcessingStatus.ERROR],
    [ProcessingStatus.COMPLETED]: [ProcessingStatus.IDLE],
    [ProcessingStatus.ERROR]: [ProcessingStatus.IDLE],
};

/**
 * 状態遷移が有効かどうかを判定する
 *
 * @param from - 現在のステータス
 * @param to - 遷移先のステータス
 * @returns 遷移が有効な場合 true
 */
const canTransition = (from: ProcessingStatus, to: ProcessingStatus): boolean => {
    // resetからの遷移は常に許可
    if (to === ProcessingStatus.IDLE) return true;
    return VALID_TRANSITIONS[from]?.includes(to) ?? false;
};

/**
 * 状態遷移をバリデーションし、無効な場合は警告を出力
 *
 * @param currentStatus - 現在のステータス
 * @param newStatus - 新しいステータス
 * @returns 遷移が有効な場合 true
 */
const validateTransition = (currentStatus: ProcessingStatus, newStatus: ProcessingStatus): boolean => {
    if (!canTransition(currentStatus, newStatus)) {
        console.warn(
            `[VideoStore] Invalid state transition: ${currentStatus} → ${newStatus}. ` +
            `Allowed transitions from ${currentStatus}: ${VALID_TRANSITIONS[currentStatus]?.join(', ') || 'none'}`
        );
        return false;
    }
    return true;
};

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
export const useVideoStore = create<VideoState>((set, get) => ({
    ...INITIAL_STATE,

    reset: () => set(INITIAL_STATE),

    setStatus: (status) => {
        const current = get().status;
        if (validateTransition(current, status)) {
            set({ status });
        }
    },

    setUploading: (progress) => {
        const current = get().status;
        // UPLOADING への遷移または既に UPLOADING 中の進捗更新を許可
        if (current === ProcessingStatus.UPLOADING || validateTransition(current, ProcessingStatus.UPLOADING)) {
            set({
                status: ProcessingStatus.UPLOADING,
                progress,
            });
        }
    },

    setCompleted: (result) => {
        const current = get().status;
        if (validateTransition(current, ProcessingStatus.COMPLETED)) {
            set({
                status: ProcessingStatus.COMPLETED,
                result,
                progress: 100,
            });
        }
    },

    setError: (error) => {
        const current = get().status;
        if (validateTransition(current, ProcessingStatus.ERROR)) {
            set({
                status: ProcessingStatus.ERROR,
                error,
            });
        }
    },
}));

// Important Fix #7: Export type guard for error checking
export const isAppAPIError = (error: unknown): error is AppAPIError => {
    return error instanceof AppAPIError;
};

import { describe, it, expect, beforeEach } from 'vitest';
import { useVideoStore, ProcessingStatus } from '@/lib/stores/video.store';
import { act } from '@testing-library/react';

/**
 * 動画処理の状態管理ストア (useVideoStore) のユニットテスト
 *
 * アプリケーション全体の動画処理状態（ProcessingStatus）や
 * 進捗状況（progress）、処理結果、エラー状態が正しく管理されるか検証します。
 */
describe('VideoStore', () => {
    /**
     * 各テスト実行前にストアの状態をリセット
     * Zustandのストアはグローバルに共有されるため、テスト間の干渉を防ぐために必要です。
     */
    beforeEach(() => {
        act(() => {
            useVideoStore.getState().reset();
        });
    });

    /**
     * 初期状態の検証
     *
     * ストア初期化時に以下の状態であることを確認します:
     * - status: IDLE (待機中)
     * - progress: 0
     * - result: null
     * - error: null
     */
    it('should initialize with IDLE status', () => {
        const state = useVideoStore.getState();
        expect(state.status).toBe(ProcessingStatus.IDLE);
        expect(state.progress).toBe(0);
        expect(state.result).toBeNull();
        expect(state.error).toBeNull();
    });

    /**
     * ステータス更新の検証 (VALIDATING)
     *
     * setStatusアクションを呼び出した場合、
     * ストアのstatusが指定した値（ここではVALIDATING）に正しく更新されるか確認します。
     */
    it('should update status to VALIDATING', () => {
        act(() => {
            useVideoStore.getState().setStatus(ProcessingStatus.VALIDATING);
        });
        expect(useVideoStore.getState().status).toBe(ProcessingStatus.VALIDATING);
    });

    /**
     * アップロード状態更新の検証
     *
     * setUploadingアクションを呼び出した場合、
     * - statusがUPLOADINGになること
     * - progressが指定した値になること
     * を確認します。
     */
    it('should update status to UPLOADING with progress', () => {
        act(() => {
            useVideoStore.getState().setUploading(50);
        });
        const state = useVideoStore.getState();
        expect(state.status).toBe(ProcessingStatus.UPLOADING);
        expect(state.progress).toBe(50);
    });

    /**
     * 完了状態更新の検証
     *
     * setCompletedアクションを呼び出した場合、
     * - statusがCOMPLETEDになること
     * - resultに処理結果が格納されること
     * を確認します。
     */
    it('should update status to COMPLETED with result', () => {
        const mockResult = {
            processedVideoUrl: 'http://example.com/video.mp4',
            metadata: { duration: 10, width: 1920, height: 1080 }
        };

        act(() => {
            useVideoStore.getState().setCompleted(mockResult);
        });

        const state = useVideoStore.getState();
        expect(state.status).toBe(ProcessingStatus.COMPLETED);
        expect(state.result).toEqual(mockResult);
    });

    /**
     * エラー状態更新の検証
     *
     * setErrorアクションを呼び出した場合、
     * - statusがERRORになること
     * - errorにエラーオブジェクトが格納されること
     * を確認します。
     */
    it('should update status to ERROR with error object', () => {
        const mockError = new Error('Test Error');
        
        act(() => {
            useVideoStore.getState().setError(mockError);
        });

        const state = useVideoStore.getState();
        expect(state.status).toBe(ProcessingStatus.ERROR);
        expect(state.error).toEqual(mockError);
    });

    /**
     * リセット機能の検証
     *
     * 状態を変更した後、resetアクションを呼び出すと
     * すべてのステートが初期値に戻ることを確認します。
     */
    it('should reset state to initial values', () => {
        // First change state
        act(() => {
            useVideoStore.getState().setStatus(ProcessingStatus.PROCESSING);
        });
        
        // Then reset
        act(() => {
            useVideoStore.getState().reset();
        });

        const state = useVideoStore.getState();
        expect(state.status).toBe(ProcessingStatus.IDLE);
        expect(state.progress).toBe(0);
        expect(state.result).toBeNull();
        expect(state.error).toBeNull();
    });
});

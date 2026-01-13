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
   * 有効な状態遷移（IDLE → UPLOADING → COMPLETED）を経て、
   * setCompletedアクションを呼び出した場合、
   * - statusがCOMPLETEDになること
   * - resultに処理結果が格納されること
   * を確認します。
   */
  it('should update status to COMPLETED with result (via valid transition)', () => {
    const mockResult = {
      signed_url: 'https://example.com/video.mp4',
      video_meta: { width: 1920, height: 1080, fps: 30, duration_sec: 10, has_audio: false },
      total_poses: 100,
      processing_time_sec: 2.0,
    };

    // 有効な状態遷移: IDLE → UPLOADING → COMPLETED
    act(() => {
      useVideoStore.getState().setUploading(100);
    });
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
   * 有効な状態遷移（IDLE → UPLOADING → ERROR）を経て、
   * setErrorアクションを呼び出した場合、
   * - statusがERRORになること
   * - errorにエラーオブジェクトが格納されること
   * を確認します。
   */
  it('should update status to ERROR with error object (via valid transition)', () => {
    const mockError = new Error('Test Error');

    // 有効な状態遷移: IDLE → UPLOADING → ERROR
    act(() => {
      useVideoStore.getState().setUploading(50);
    });
    act(() => {
      useVideoStore.getState().setError(mockError);
    });

    const state = useVideoStore.getState();
    expect(state.status).toBe(ProcessingStatus.ERROR);
    expect(state.error).toEqual(mockError);
  });

  /**
   * 無効な状態遷移の検証
   *
   * 無効な状態遷移（IDLE → COMPLETED）を試みた場合、
   * 状態が変更されないことを確認します。
   */
  it('should reject invalid state transition (IDLE → COMPLETED)', () => {
    const mockResult = {
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
    // 無効な遷移を試みる
    act(() => {
      useVideoStore.getState().setCompleted(mockResult);
    });

    // 状態は IDLE のまま
    const state = useVideoStore.getState();
    expect(state.status).toBe(ProcessingStatus.IDLE);
    expect(state.result).toBeNull();
  });

  /**
   * リセット機能の検証
   *
   * 状態を変更した後、resetアクションを呼び出すと
   * すべてのステートが初期値に戻ることを確認します。
   */
  it('should reset state to initial values', () => {
    // First change state via valid transition
    act(() => {
      useVideoStore.getState().setUploading(50);
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

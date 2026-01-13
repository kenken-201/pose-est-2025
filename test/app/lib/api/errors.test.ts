import { describe, it, expect } from 'vitest';
import { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import {
  AppAPIError,
  isAppAPIError,
  createErrorFromAxiosError,
  getUserFriendlyMessage,
} from '@/lib/api/errors';

/**
 * APIエラーハンドリングのテスト
 */
describe('API Error Handling', () => {
  /**
   * AppAPIErrorクラスのテスト
   * 正しくプロパティが設定されるか確認します
   */
  describe('AppAPIError', () => {
    it('should create an instance with correct properties', () => {
      const error = new AppAPIError('Test Message', 'TEST_CODE', 400, { detail: 'info' });

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Test Message');
      expect(error.code).toBe('TEST_CODE');
      expect(error.status).toBe(400);
      expect(error.data).toEqual({ detail: 'info' });
    });
  });

  /**
   * タイプガードのテスト
   */
  describe('isAppAPIError', () => {
    it('should return true for AppAPIError instances', () => {
      const error = new AppAPIError('Test', 'TEST', 500);
      expect(isAppAPIError(error)).toBe(true);
    });

    it('should return false for standard Error instances', () => {
      const error = new Error('Test');
      expect(isAppAPIError(error)).toBe(false);
    });

    it('should return false for non-error objects', () => {
      expect(isAppAPIError({ message: 'test' })).toBe(false);
      expect(isAppAPIError(null)).toBe(false);
    });
  });

  /**
   * AxiosErrorからの変換ロジックのテスト
   */
  describe('createErrorFromAxiosError', () => {
    const mockConfig = { url: '/test' } as InternalAxiosRequestConfig;

    it('should parse structured error response correctly', () => {
      const responseData = {
        error: {
          message: 'Invalid input',
          code: 'VALIDATION_ERROR',
          details: { field: 'required' },
        },
      };

      const axiosError = new AxiosError('Request failed', 'ERR_BAD_REQUEST', mockConfig, {}, {
        status: 400,
        data: responseData,
        statusText: 'Bad Request',
        headers: {},
        config: mockConfig,
      } as AxiosResponse);

      const appError = createErrorFromAxiosError(axiosError);

      expect(appError).toBeInstanceOf(AppAPIError);
      expect(appError.code).toBe('VALIDATION_ERROR');
      expect(appError.message).toBe('Invalid input');
      expect(appError.status).toBe(400);
      expect(appError.data).toEqual(responseData.error.details);
    });

    it('should handle network errors', () => {
      const axiosError = new AxiosError('Network Error', 'ERR_NETWORK', mockConfig, {});

      const appError = createErrorFromAxiosError(axiosError);

      expect(appError.code).toBe('NETWORK_ERROR');
      expect(appError.message).toBe('Network error');
      expect(appError.status).toBe(0);
    });

    it('should handle timeout errors', () => {
      const axiosError = new AxiosError(
        'Timeout of 1000ms exceeded',
        'ECONNABORTED',
        mockConfig,
        {}
      );

      const appError = createErrorFromAxiosError(axiosError);

      expect(appError.code).toBe('TIMEOUT_ERROR');
      expect(appError.status).toBe(408);
    });

    it('should handle fallback for unknown errors', () => {
      const axiosError = new AxiosError('Unknown Error', 'UNKNOWN', mockConfig, {}, {
        status: 500,
        data: 'Internal Server Error String', // JSONではないレスポンス
        statusText: 'Internal Server Error',
        headers: {},
        config: mockConfig,
      } as AxiosResponse);

      const appError = createErrorFromAxiosError(axiosError);

      expect(appError.code).toBe('UNKNOWN_ERROR');
      expect(appError.status).toBe(500);
      expect(appError.message).toBe('Unknown Error');
    });
  });

  /**
   * エラーメッセージマッピングのテスト
   */

  describe('Error Message Mapping', () => {
    it('should return correct Japanese message for backend error codes', () => {
      expect(getUserFriendlyMessage('VIDEO_TOO_SHORT')).toContain('動画が短すぎます');
      expect(getUserFriendlyMessage('FILE_TOO_LARGE')).toContain('ファイルサイズが大きすぎます');
      expect(getUserFriendlyMessage('MODEL_INFERENCE_ERROR')).toContain(
        '姿勢推定処理中にエラーが発生しました'
      );
    });

    it('should return correct Japanese message for client error codes', () => {
      expect(getUserFriendlyMessage('NETWORK_ERROR')).toContain(
        'ネットワーク接続を確認してください'
      );
      expect(getUserFriendlyMessage('TIMEOUT_ERROR')).toContain('リクエストがタイムアウトしました');
      expect(getUserFriendlyMessage('VALIDATION_ERROR')).toContain('入力内容に問題があります');
    });

    it('should return fallback message for unknown codes', () => {
      expect(getUserFriendlyMessage('NON_EXISTENT_CODE')).toContain(
        '予期しないエラーが発生しました'
      );
    });

    it('AppAPIError.userMessage getter should return mapped message', () => {
      const error = new AppAPIError('Original Message', 'VIDEO_TOO_LONG', 400);
      expect(error.userMessage).toContain('動画が長すぎます');
      expect(error.message).toBe('Original Message'); // 元の英語メッセージは保持される
    });
  });
});

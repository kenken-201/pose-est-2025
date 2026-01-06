import { describe, it, expect, vi } from 'vitest';
import { handleRequest, handleResponse, handleError } from '@/lib/api/interceptors';
import { logger } from '@/lib/utils/logger';
import { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

/**
 * APIインターセプターのユニットテスト
 * 
 * リクエスト送信時、レスポンス受信時、エラー発生時の
 * インターセプターロジック（主にログ出力）を検証します。
 */
describe('API Interceptors', () => {
    /**
     * リクエストインターセプターのテスト
     * リクエスト情報が正しくログ出力されるか確認します。
     */
    describe('handleRequest', () => {
        it('should log request details and return config', () => {
            const loggerSpy = vi.spyOn(logger, 'debug');
            const config = {
                method: 'get',
                url: '/test',
                headers: {},
            } as InternalAxiosRequestConfig;

            const result = handleRequest(config);

            expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining('API Request'), expect.anything());
            expect(result).toBe(config);
            loggerSpy.mockRestore();
        });
    });

    /**
     * レスポンスインターセプターのテスト
     * 成功レスポンスが正しくログ出力されるか確認します。
     */
    describe('handleResponse', () => {
        it('should log response details and return response', () => {
            const loggerSpy = vi.spyOn(logger, 'debug');
            const response = {
                status: 200,
                config: { url: '/test', method: 'get' },
                data: { id: 1 },
            } as AxiosResponse;

            const result = handleResponse(response);

            expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining('API Response'), expect.anything());
            expect(result).toBe(response);
            loggerSpy.mockRestore();
        });
    });

    /**
     * エラーハンドラーのテスト
     * エラーが適切にログ出力され、Promiseがrejectされるか確認します。
     */
    describe('handleError', () => {
        it('should log error and reject promise', async () => {
            const loggerSpy = vi.spyOn(logger, 'error');
            const error = new AxiosError('Network Error');
            error.config = { url: '/test', method: 'get' } as InternalAxiosRequestConfig;

            await expect(handleError(error)).rejects.toThrow('Network Error');
            
            expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining('API Error'), expect.anything());
            loggerSpy.mockRestore();
        });
    });
});

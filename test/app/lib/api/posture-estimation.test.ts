import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { uploadVideo, healthCheck } from '@/lib/api/posture-estimation';
import { apiClient } from '@/lib/api/client';
import { APP_CONFIG } from '@/lib/config/constants';
import { AppAPIError } from '@/lib/api/errors';

// apiClientのモック
// apiClientはオブジェクトとしてエクスポートされているため、メソッドをスパイします
vi.mock('@/lib/api/client', () => ({
    apiClient: {
        post: vi.fn(),
        get: vi.fn(),
    },
}));

/**
 * 姿勢推定APIクライアントのテスト
 */
describe('Posture Estimation API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    /**
     * uploadVideo関数のテスト
     */
    describe('uploadVideo', () => {
        it('should call upload endpoint with FormData', async () => {
            const file = new File(['content'], 'test.mp4', { type: 'video/mp4' });
            const mockResponse = {
                data: {
                    processedVideoUrl: 'http://example.com/processed.mp4',
                    processingTimeMs: 1000,
                    metadata: {}
                }
            };
            
            // モックの戻り値を設定
            (apiClient.post as Mock).mockResolvedValue(mockResponse);

            const result = await uploadVideo(file);

            // エンドポイントが正しいか検証
            expect(apiClient.post).toHaveBeenCalledWith(
                APP_CONFIG.API.ENDPOINTS.UPLOAD,
                expect.any(FormData),
                expect.objectContaining({
                    headers: expect.objectContaining({
                        'Content-Type': 'multipart/form-data',
                    }),
                })
            );

            // FormDataの中身を検証
            const formDataArg = (apiClient.post as Mock).mock.calls[0][1] as FormData;
            expect(formDataArg.get('video')).toBe(file);

            // レスポンスが正しく返されるか検証
            expect(result).toEqual(mockResponse.data);
        });

        it('should throw AppAPIError when API call fails', async () => {
            const file = new File(['content'], 'test.mp4', { type: 'video/mp4' });
            const error = new Error('API Error');
            
            (apiClient.post as Mock).mockRejectedValue(error);

            await expect(uploadVideo(file)).rejects.toThrow('API Error');
        });

        it('should throw AppAPIError for validation failures', async () => {
            // 無効なファイル形式
            const invalidFile = new File(['content'], 'test.txt', { type: 'text/plain' });

            await expect(uploadVideo(invalidFile)).rejects.toThrow(AppAPIError);
            
            try {
                await uploadVideo(invalidFile);
            } catch (error) {
                expect(error).toBeInstanceOf(AppAPIError);
                expect((error as AppAPIError).code).toBe('VALIDATION_ERROR');
                expect((error as AppAPIError).status).toBe(400);
            }
        });
    });

    /**
     * healthCheck関数のテスト
     */
    describe('healthCheck', () => {
        it('should return healthy result when API responds', async () => {
            (apiClient.get as Mock).mockResolvedValue({ data: { status: 'ok' } });

            const result = await healthCheck();

            expect(result.healthy).toBe(true);
            expect(result.latencyMs).toBeDefined();
            expect(result.error).toBeUndefined();
            expect(apiClient.get).toHaveBeenCalledWith(APP_CONFIG.API.ENDPOINTS.HEALTH);
        });

        it('should return unhealthy result with error message when API fails', async () => {
            (apiClient.get as Mock).mockRejectedValue(new Error('Connection refused'));

            const result = await healthCheck();

            expect(result.healthy).toBe(false);
            expect(result.latencyMs).toBeDefined();
            expect(result.error).toBe('Connection refused');
        });
    });
});

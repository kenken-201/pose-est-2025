import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { uploadVideo, healthCheck } from '@/lib/api/posture-estimation';
import { apiClient } from '@/lib/api/client';
import { APP_CONFIG } from '@/lib/config/constants';

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

            // FormDataの中身を検証（FormDataは直接inspectしにくいので、呼び出し引数をチェック）
            const formDataArg = (apiClient.post as Mock).mock.calls[0][1] as FormData;
            expect(formDataArg.get('video')).toBe(file);

            // レスポンスが正しく返されるか検証
            expect(result).toEqual(mockResponse.data);
        });

        it('should throw error when API call fails', async () => {
            const file = new File(['content'], 'test.mp4', { type: 'video/mp4' });
            const error = new Error('API Error');
            
            (apiClient.post as Mock).mockRejectedValue(error);

            await expect(uploadVideo(file)).rejects.toThrow('API Error');
        });
    });

    /**
     * healthCheck関数のテスト
     */
    describe('healthCheck', () => {
        it('should call health endpoint', async () => {
            (apiClient.get as Mock).mockResolvedValue({ data: { status: 'ok' } });

            await healthCheck();

            expect(apiClient.get).toHaveBeenCalledWith(APP_CONFIG.API.ENDPOINTS.HEALTH);
        });
    });
});

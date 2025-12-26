import { describe, it, expect, vi, beforeEach } from 'vitest';
import { processVideoRequest } from '@/lib/services/server/video-processing.server';
import axios from 'axios';
import { APP_CONFIG } from '@/lib/config/constants';

// Axiosモック
vi.mock('axios');

/**
 * サーバーサイド動画処理サービス (processVideoRequest) のユニットテスト
 *
 * React Router v7 Actionとして呼び出され、受信したリクエストを解析して
 * バックエンドAPIへ適切に転送（プロキシ）できるかを検証します。
 */
describe('VideoProcessing Server Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    /**
     * 正常系リクエスト転送の検証
     *
     * 動画データを含むFormDataを受け取った場合、
     * 正しいバックエンドエンドポイントへ、必要なヘッダーと共に転送されるか確認します。
     * 設定ファイル（APP_CONFIG）からのURL構築も検証します。
     */
    it('should forward request to backend API', async () => {
        const formData = new FormData();
        formData.append('video', new File(['dummy'], 'test.mp4', { type: 'video/mp4' }));

        const mockRequest = new Request('http://localhost:3000/api/upload', {
            method: 'POST',
            body: formData,
        });

        const mockResponse = {
            data: { video_url: 'http://backend/video.mp4' },
            status: 200,
        };

        vi.mocked(axios.post).mockResolvedValue(mockResponse);

        const result = await processVideoRequest(mockRequest);

        expect(axios.post).toHaveBeenCalledWith(
            `${APP_CONFIG.API.BASE_URL}${APP_CONFIG.API.ENDPOINTS.UPLOAD}`, // Expect full URL
            expect.anything(), // body (FormData or Stream)
            expect.anything()  // headers
        );
        expect(result).toEqual(mockResponse.data);
    });

    /**
     * バックエンドエラー時のハンドリング検証
     *
     * バックエンドAPIがエラーを返した場合、そのエラーが適切に
     * 呼び出し元へ伝播されるかを確認します。
     */
    it('should handle backend errors', async () => {
        const formData = new FormData();
        formData.append('video', new File(['dummy'], 'test.mp4', { type: 'video/mp4' }));

        const mockRequest = new Request('http://localhost:3000/api/upload', {
            method: 'POST',
            body: formData,
        });

        vi.mocked(axios.post).mockRejectedValue(new Error('Backend Error'));

        await expect(processVideoRequest(mockRequest)).rejects.toThrow('Backend Error');
    });
});

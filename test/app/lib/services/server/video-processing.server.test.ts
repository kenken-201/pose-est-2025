import { describe, it, expect, vi, beforeEach } from 'vitest';
import { processVideoRequest } from '@/lib/services/server/video-processing.server';
import axios, { AxiosError } from 'axios';
import { APP_CONFIG } from '@/lib/config/constants';
import { AppAPIError } from '@/lib/api/errors';

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
     * テスト用のRequestを作成するヘルパー関数
     */
    const createMockRequest = (includeVideo: boolean = true): Request => {
        const formData = new FormData();
        if (includeVideo) {
            formData.append('video', new File(['dummy'], 'test.mp4', { type: 'video/mp4' }));
        }
        return new Request('http://localhost:3000/api/upload', {
            method: 'POST',
            body: formData,
        });
    };

    /**
     * 正常系リクエスト転送の検証
     *
     * 動画データを含むFormDataを受け取った場合、
     * 正しいバックエンドエンドポイントへ、必要なヘッダーと共に転送されるか確認します。
     * 設定ファイル（APP_CONFIG）からのURL構築も検証します。
     */
    it('should forward request to backend API', async () => {
        const mockResponse = {
            data: { processedVideoUrl: 'http://backend/video.mp4' },
            status: 200,
        };

        vi.mocked(axios.post).mockResolvedValue(mockResponse);

        const result = await processVideoRequest(createMockRequest());

        expect(axios.post).toHaveBeenCalledWith(
            `${APP_CONFIG.API.BASE_URL}${APP_CONFIG.API.ENDPOINTS.UPLOAD}`,
            expect.anything(),
            expect.objectContaining({
                headers: { 'Content-Type': 'multipart/form-data' },
                timeout: APP_CONFIG.API.TIMEOUT_MS,
            })
        );
        expect(result).toEqual(mockResponse.data);
    });

    /**
     * バックエンドエラー時のハンドリング検証 (AppAPIError変換)
     *
     * バックエンドAPIがAxiosエラーを返した場合、AppAPIErrorに変換されて
     * 呼び出し元へ伝播されるかを確認します。
     */
    it('should transform axios errors to AppAPIError', async () => {
        const axiosError = new AxiosError('Network Error', 'ERR_NETWORK');
        vi.mocked(axios.post).mockRejectedValue(axiosError);
        vi.mocked(axios.isAxiosError).mockReturnValue(true);

        await expect(processVideoRequest(createMockRequest())).rejects.toThrow(AppAPIError);
    });

    /**
     * 動画ファイル未指定時のバリデーションエラー検証
     *
     * FormDataに動画ファイルが含まれない場合、AppAPIErrorがスローされるか確認します。
     */
    it('should throw AppAPIError when video file is missing', async () => {
        // 動画なしのRequestを作成
        const requestWithoutVideo = createMockRequest(false);

        await expect(processVideoRequest(requestWithoutVideo)).rejects.toThrow(AppAPIError);
        
        // 別のRequestでメッセージを確認（Request bodyは一度しか消費できないため）
        const anotherRequest = createMockRequest(false);
        try {
            await processVideoRequest(anotherRequest);
        } catch (error) {
            expect((error as AppAPIError).message).toBe('Video file is required');
        }
    });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { videoUploader } from '@/lib/services/client/video-uploader.client';
import { apiClient } from '@/lib/api/client';
import { AppAPIError } from '@/lib/api/errors';
import { APP_CONFIG } from '@/lib/config/constants';

// APIクライアントのモック化
vi.mock('@/lib/api/client', () => ({
    apiClient: {
        post: vi.fn(),
    },
}));

/**
 * 動画アップロードクライアントサービス (videoUploader) のユニットテスト
 *
 * クライアントサイドでの動画アップロード処理、バリデーション、
 * およびAPI通信時の進捗コールバック機能などを検証します。
 */
describe('VideoUploader Client Service', () => {
    // テストごとのモックリセット
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockFile = new File(['dummy content'], 'test.mp4', { type: 'video/mp4' });
    const mockResponse = {
        data: {
            processedVideoUrl: 'http://example.com/video.mp4',
            metadata: { duration: 10, size: 100 }
        }
    };

    /**
     * 正常系のアップロード検証
     *
     * 正しいエンドポイント (APP_CONFIG.API.ENDPOINTS.BFF_UPLOAD) に対して、
     * 正しいFormDataとヘッダーでAPIリクエストが送信されることを確認します。
     */
    it('should upload video successfully using configured endpoint', async () => {
        vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

        const result = await videoUploader.uploadVideo(mockFile);

        // Important Fix #4: Verify APP_CONFIG endpoint is used
        expect(apiClient.post).toHaveBeenCalledWith(
            APP_CONFIG.API.ENDPOINTS.BFF_UPLOAD,
            expect.any(FormData),
            expect.objectContaining({
                headers: { 'Content-Type': 'multipart/form-data' }
            })
        );
        expect(result).toEqual(mockResponse.data);
    });

    /**
     * 進捗コールバック（onProgress）の検証
     *
     * APIクライアントのonUploadProgressイベントが発生した際に
     * 引数として渡されたコールバック関数が正しく計算された進捗率で呼び出されるか確認します。
     */
    it('should call onProgress callback during upload', async () => {
        vi.mocked(apiClient.post).mockImplementation((_, __, config) => {
            // Simulate progress events
            if (config?.onUploadProgress) {
                config.onUploadProgress({ loaded: 50, total: 100, bytes: 50, lengthComputable: true });
            }
            return Promise.resolve(mockResponse);
        });

        const onProgressSpy = vi.fn();
        await videoUploader.uploadVideo(mockFile, onProgressSpy);

        expect(onProgressSpy).toHaveBeenCalledWith(50);
    });

    /**
     * APIエラーハンドリングの検証
     *
     * API通信が失敗した場合、AppAPIErrorが呼び出し元に伝播されるか確認します。
     */
    it('should handle API errors correctly', async () => {
        const mockError = new AppAPIError('Upload failed', 'UPLOAD_ERROR', 500);
        vi.mocked(apiClient.post).mockRejectedValue(mockError);

        await expect(videoUploader.uploadVideo(mockFile)).rejects.toThrow(AppAPIError);
    });

    /**
     * ファイルバリデーションの検証 (不正なMIMEタイプ)
     *
     * 不正なファイルタイプ（例：テキストファイル）が渡された場合、
     * APIリクエストを行う前にバリデーションエラーが発生することを確認します。
     */
    it('should validate file inputs before upload', async () => {
        const invalidFile = new File([], 'test.txt', { type: 'text/plain' });
        
        await expect(videoUploader.uploadVideo(invalidFile)).rejects.toThrow('Invalid file type');
    });

    /**
     * Important Fix #8: 0バイトファイルのバリデーション検証
     *
     * 空のファイル（0バイト）が渡された場合、
     * バリデーションエラーが発生することを確認します。
     */
    it('should reject 0-byte files', async () => {
        const emptyFile = new File([], 'empty.mp4', { type: 'video/mp4' });
        
        await expect(videoUploader.uploadVideo(emptyFile)).rejects.toThrow('File is empty');
    });
});

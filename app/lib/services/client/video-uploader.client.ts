/**
 * @fileoverview 動画アップロードクライアントサービス
 *
 * クライアントサイドから BFF (React Router v7 Resource Route) への
 * 動画アップロードを処理するサービスを提供します。
 */
import { apiClient } from '../../api/client';
import { VideoProcessResponse } from '../../api/types';
import { validateVideoFile } from '../../utils/file-utils';
import { AppAPIError } from '../../api/errors';
import { APP_CONFIG } from '../../config/constants';

/**
 * 動画アップロードサービスクライアント
 *
 * BFF（React Router v7 Resource Route）に対して動画をアップロードし、
 * API経由で処理を開始します。アップロード進捗の監視が可能です。
 */
export const videoUploader = {
    /**
     * 動画をアップロードして処理を開始する
     *
     * @param file - アップロードする動画ファイル
     * @param onProgress - 進捗コールバック（0-100）
     * @returns 処理結果
     * @throws AppAPIError - バリデーションエラーまたはAPIエラー
     *
     * @example
     * ```typescript
     * const result = await videoUploader.uploadVideo(file, (progress) => {
     *     console.log(`Upload: ${progress}%`);
     * });
     * ```
     */
    async uploadVideo(
        file: File,
        onProgress?: (percent: number) => void
    ): Promise<VideoProcessResponse> {
        // 1. クライアントサイドバリデーション
        const validation = validateVideoFile(file);
        if (!validation.valid) {
            throw new AppAPIError(
                validation.error || 'Invalid video file',
                'VALIDATION_ERROR',
                400
            );
        }

        const formData = new FormData();
        formData.append('video', file);

        // 2. アップロードリクエスト (Direct to Backend)
        // Fix: Use Direct Backend Endpoint instead of missing BFF route
        const response = await apiClient.post<VideoProcessResponse>(
            APP_CONFIG.API.ENDPOINTS.UPLOAD,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    if (onProgress && progressEvent.total) {
                        const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                        onProgress(percent);
                    }
                },
            }
        );

        return response.data;
    },
};

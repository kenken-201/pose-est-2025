import { apiClient } from './client';
import { APP_CONFIG } from '../config/constants';
import { VideoUploadRequestSchema, VideoProcessResponse, VideoProcessResponseSchema } from './types';

/**
 * 動画をアップロードして姿勢推定処理をリクエストする
 *
 * @param file - アップロードする動画ファイル
 * @returns 処理結果のレスポンス（処理済み動画URLなど）
 * @throws APIError - バリデーションエラーまたはAPIエラー時
 */
export const uploadVideo = async (file: File): Promise<VideoProcessResponse> => {
    // クライアント側でのバリデーション
    const validation = VideoUploadRequestSchema.safeParse({ video: file });
    if (!validation.success) {
        throw new Error(validation.error.errors[0].message);
    }

    const formData = new FormData();
    formData.append('video', file);

    const response = await apiClient.post(APP_CONFIG.API.ENDPOINTS.UPLOAD, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    // レスポンスの検証と型変換
    return VideoProcessResponseSchema.parse(response.data);
};

/**
 * バックエンドAPIのヘルスチェックを行う
 *
 * @returns サーバーが正常ならtrue
 */
export const healthCheck = async (): Promise<boolean> => {
    try {
        await apiClient.get(APP_CONFIG.API.ENDPOINTS.HEALTH);
        return true;
    } catch {
        return false;
    }
};

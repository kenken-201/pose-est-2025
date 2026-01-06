import { VideoProcessResponse } from './types';
import { logger } from '../utils/logger';

/**
 * ローカル開発用の動画アップロードモック関数
 *
 * 実際のAPIを叩かずに、遅延後にダミーの成功レスポンスを返します。
 * UIや結合テストの開発に使用します。
 */
export const mockUploadVideo = async (file: File): Promise<VideoProcessResponse> => {
    logger.debug('Mock uploading video:', { name: file.name });

    // 2秒間の疑似的な処理遅延
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return {
        signed_url: URL.createObjectURL(file), // ブラウザで再生可能な一時URL
        video_meta: {
            width: 1920,
            height: 1080,
            fps: 30,
            duration_sec: 10,
            has_audio: false,
        },
        total_poses: 150,
        processing_time_sec: 2.5,
    };
};

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
        processedVideoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        processingTimeMs: 1540,
        metadata: {
            originalName: file.name,
            size: file.size,
            mock: true,
        },
    };
};

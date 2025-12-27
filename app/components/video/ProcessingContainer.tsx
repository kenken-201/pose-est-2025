import type { FC } from 'react';
import { useVideoStore, ProcessingStatus } from '../../lib/stores/video.store';
import { useVideoProcessing } from '../../lib/hooks/useVideoProcessing';
import { UploadDropzone } from './UploadDropzone';
import { ProgressOverlay } from './ProgressOverlay';
import { VideoPlayer } from './VideoPlayer';
import { ErrorDisplay } from './ErrorDisplay';
import { AppAPIError } from '../../lib/api/errors';

/**
 * 動画処理コンテナコンポーネント
 *
 * 動画のアップロードから処理、結果表示までのUIフローを統合管理します。
 * useVideoStore の状態に応じて適切な子コンポーネントを表示します。
 */
export const ProcessingContainer: FC = () => {
    // ストアから状態を取得
    const { status, progress, result, error } = useVideoStore();
    
    // フックからアクションを取得
    const { processVideo, reset } = useVideoProcessing();

    // IDLE状態: アップロード用のドロップゾーンを表示
    if (status === ProcessingStatus.IDLE) {
        return (
            <div className="w-full max-w-xl mx-auto">
                <UploadDropzone 
                    onFileSelect={processVideo}
                    accept={{
                        'video/mp4': ['.mp4'],
                        'video/quicktime': ['.mov'],
                        'video/webm': ['.webm']
                    }} 
                />
            </div>
        );
    }

    // ERROR状態: エラー表示とリトライボタン
    if (status === ProcessingStatus.ERROR) {
        return (
            <div className="w-full max-w-xl mx-auto">
                <ErrorDisplay 
                    error={error as AppAPIError | Error} 
                    onRetry={reset} 
                />
            </div>
        );
    }

    // COMPLETED状態: 処理結果の動画プレイヤーを表示
    if (status === ProcessingStatus.COMPLETED && result) {
        return (
            <div className="w-full max-w-3xl mx-auto space-y-4">
                <div className="bg-green-50 p-4 rounded-lg flex items-center justify-between">
                    <p className="text-green-800 font-medium">動画の処理が完了しました！</p>
                    <button 
                        onClick={reset}
                        className="text-sm text-green-700 hover:text-green-900 underline"
                    >
                        新しい動画をアップロード
                    </button>
                </div>
                <VideoPlayer 
                    src={result.processedVideoUrl} 
                    controls 
                    autoPlay 
                />
            </div>
        );
    }

    // UPLOADING または PROCESSING 状態: 進捗オーバーレイを表示
    // (UploadDropzoneの上に重ねるか、単独で表示するかはデザイン次第だが、ここでは単独表示エリアを確保)
    return (
        <div className="w-full max-w-xl mx-auto relative h-64 bg-gray-50 rounded-lg border border-gray-200">
             <ProgressOverlay 
                status={status} 
                progress={progress} 
            />
        </div>
    );
};

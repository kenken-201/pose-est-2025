import type { FC, ReactNode } from 'react';
import { useVideoStore, ProcessingStatus, isAppAPIError } from '@/lib/stores/video.store';
import { useVideoProcessing } from '@/lib/hooks/useVideoProcessing';
import { UploadDropzone } from './UploadDropzone';
import { ProgressOverlay } from './ProgressOverlay';
import { VideoPlayer } from './VideoPlayer';
import { ErrorDisplay } from './ErrorDisplay';
import { VIDEO_CONTAINER_SIZE } from '@/lib/constants/ui';

/**
 * レイアウト安定化のためのラッパーコンポーネント
 * Layout Shift (CLS) を防ぐために一貫したサイズを維持
 */
const ContainerWrapper: FC<{ 
    children: ReactNode; 
    fullWidth?: boolean;
}> = ({ children, fullWidth = false }) => (
    <div 
        className={`
            w-full mx-auto relative
            ${fullWidth ? VIDEO_CONTAINER_SIZE.maxWidthResult : VIDEO_CONTAINER_SIZE.maxWidth}
            ${VIDEO_CONTAINER_SIZE.height}
        `}
        data-testid="processing-container"
    >
        {children}
    </div>
);

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
            <ContainerWrapper>
                <UploadDropzone 
                    onFileSelect={processVideo}
                    accept={{
                        'video/mp4': ['.mp4'],
                        'video/quicktime': ['.mov'],
                        'video/webm': ['.webm']
                    }} 
                />
            </ContainerWrapper>
        );
    }

    // ERROR状態: エラー表示とリトライボタン
    if (status === ProcessingStatus.ERROR) {
        return (
            <ContainerWrapper>
                <div className="h-full flex items-center justify-center">
                    <ErrorDisplay 
                        error={error}
                        isApiError={error ? isAppAPIError(error) : false}
                        onRetry={reset} 
                    />
                </div>
            </ContainerWrapper>
        );
    }

    // COMPLETED状態: 処理結果の動画プレイヤーを表示
    if (status === ProcessingStatus.COMPLETED && result?.processedVideoUrl) {
        return (
            <div className={`w-full ${VIDEO_CONTAINER_SIZE.maxWidthResult} mx-auto space-y-4`}>
                <div className="bg-green-50 p-4 rounded-lg flex items-center justify-between">
                    <p className="text-green-800 font-medium">動画の処理が完了しました！</p>
                    <button 
                        onClick={reset}
                        className="text-sm text-green-700 hover:text-green-900 underline"
                        type="button"
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
    return (
        <ContainerWrapper>
            <div className="h-full bg-gray-50 rounded-lg border border-gray-200">
                <ProgressOverlay 
                    status={status} 
                    progress={progress} 
                />
            </div>
        </ContainerWrapper>
    );
};

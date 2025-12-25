import { ProcessingStatus } from '../../lib/services/video-processing.types';

/**
 * 動画アップロードゾーンのProps
 */
export interface VideoUploadZoneProps {
    onFileSelect: (file: File) => void;
    isDragActive?: boolean;
    disabled?: boolean;
    maxSize?: number; // bytes
    acceptedTypes?: Record<string, string[]>;
    className?: string;
}

/**
 * 動画プレーヤーのProps
 */
export interface VideoPlayerProps {
    url: string;
    poster?: string;
    autoPlay?: boolean;
    loop?: boolean;
    muted?: boolean;
    controls?: boolean;
    className?: string;
    onEnded?: () => void;
    onError?: (error: unknown) => void;
}

/**
 * 処理状況オーバーレイのProps
 */
export interface ProcessingOverlayProps {
    status: ProcessingStatus;
    progress?: number;
    message?: string;
    onCancel?: () => void;
    className?: string;
}

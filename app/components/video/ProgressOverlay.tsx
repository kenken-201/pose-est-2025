import type { FC } from 'react';
import { Loader2 } from 'lucide-react';
import { ProcessingStatus } from '@/lib/stores/video.store';

interface ProgressOverlayProps {
  /** 処理ステータス */
  status: ProcessingStatus;
  /** 進捗率 (0-100) */
  progress: number;
  /** カスタムメッセージ (オプション) */
  message?: string;
}

/**
 * 処理進捗表示オーバーレイコンポーネント
 *
 * UPLOADING状態: プログレスバーを表示
 * PROCESSING状態: スピナーによるローディング表示
 * その他: 何も表示しない
 */
export const ProgressOverlay: FC<ProgressOverlayProps> = ({ status, progress, message }) => {
  // アクティブな状態でなければ何もレンダリングしない
  const isActive = status === ProcessingStatus.UPLOADING || status === ProcessingStatus.PROCESSING;

  if (!isActive) {
    return null;
  }

  return (
    <div
      className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-lg animate-in fade-in duration-200"
      role="status"
      aria-live="polite"
      aria-busy={isActive}
      data-testid="progress-overlay"
    >
      <div className="w-64 space-y-4 text-center">
        {status === ProcessingStatus.UPLOADING ? (
          <>
            <div className="flex justify-between text-sm font-medium text-gray-700">
              <span>{message || 'アップロード中...'}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="アップロード進捗"
              className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden"
            >
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" aria-hidden="true" />
            </div>
            <p className="text-sm font-medium text-gray-700 animate-pulse">
              {message || '動画を処理中...'}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

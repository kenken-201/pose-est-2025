import type { FC } from 'react';

interface VideoPlayerProps {
    /** 動画ファイルのURL */
    src: string | null;
    /** コントロールを表示するかどうか */
    controls?: boolean;
    /** 自動再生するかどうか */
    autoPlay?: boolean;
    /** クラス名（オプション） */
    className?: string;
    /** 再生終了時のコールバック */
    onEnded?: () => void;
}

/**
 * 動画再生プレイヤーコンポーネント
 *
 * 処理済み動画の結果表示などに使用します。
 * 標準の <video> タグをラッパーしています。
 */
export const VideoPlayer: FC<VideoPlayerProps> = ({
    src,
    controls = true,
    autoPlay = false,
    className = '',
    onEnded,
}) => {
    if (!src) {
        return null;
    }

    return (
        <video
            data-testid="video-player"
            src={src}
            controls={controls}
            autoPlay={autoPlay}
            onEnded={onEnded}
            className={`max-w-full rounded-lg shadow-lg ${className}`}
        >
            <p>
                お使いのブラウザは動画タグをサポートしていません。
                <a href={src}>動画をダウンロード</a>してください。
            </p>
        </video>
    );
};

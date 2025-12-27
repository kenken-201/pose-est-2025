/**
 * @fileoverview UI共通定数
 *
 * コンポーネント間で共有するレイアウトサイズやスタイル定数を定義します。
 * Layout Shift (CLS) を防ぐために、一貫したサイズを使用します。
 */

/**
 * 動画処理コンテナのサイズ定数
 * UploadDropzone, ProgressOverlay, ProcessingContainer で共有
 */
export const VIDEO_CONTAINER_SIZE = {
    /** 最大幅クラス (Tailwind) */
    maxWidth: 'max-w-xl',
    /** 高さクラス (Tailwind) */
    height: 'h-64',
    /** 結果表示時の最大幅クラス */
    maxWidthResult: 'max-w-3xl',
} as const;

/**
 * アニメーション関連の定数
 */
export const ANIMATION_DURATION = {
    /** 標準的なトランジション時間 (ms) */
    default: 200,
    /** 進捗バーのイージング時間 (ms) */
    progress: 300,
} as const;

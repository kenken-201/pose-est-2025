/**
 * @fileoverview 動画関連UIコンポーネントのProps型定義
 *
 * このファイルでは、動画アップロード、再生、処理状況表示に関する
 * Reactコンポーネントで使用するPropsの型を定義しています。
 */

import { ProcessingStatus } from '../../lib/services/video-processing.types';

/**
 * 動画アップロードゾーンコンポーネントのProps
 *
 * ドラッグ&ドロップまたはクリックで動画ファイルを選択するUIコンポーネント用です。
 * react-dropzoneライブラリと組み合わせて使用します。
 *
 * @example
 * ```tsx
 * <VideoUploadZone
 *   onFileSelect={(file) => handleUpload(file)}
 *   maxSize={100 * 1024 * 1024}
 *   disabled={isProcessing}
 * />
 * ```
 */
export interface VideoUploadZoneProps {
  /**
   * ファイルが選択された時に呼ばれるコールバック関数
   * @param file - 選択された動画ファイル
   */
  onFileSelect: (file: File) => void;

  /** ドラッグ中かどうか（スタイリング用、外部から制御する場合） */
  isDragActive?: boolean;

  /** コンポーネントを無効化するかどうか（処理中など） */
  disabled?: boolean;

  /** 最大ファイルサイズ（バイト）、超過した場合はエラー */
  maxSize?: number;

  /** 受け入れるファイルタイプ（MIMEタイプと拡張子のマッピング） */
  acceptedTypes?: Record<string, string[]>;

  /** 追加のCSSクラス名 */
  className?: string;
}

/**
 * 動画プレーヤーコンポーネントのProps
 *
 * 処理前/処理後の動画を再生するためのコンポーネント用です。
 * react-playerまたはHTML5 videoタグのラッパーとして使用します。
 *
 * @example
 * ```tsx
 * <VideoPlayer
 *   url={processedVideoUrl}
 *   controls
 *   onEnded={() => showCompletionMessage()}
 * />
 * ```
 */
export interface VideoPlayerProps {
  /** 再生する動画のURL */
  url: string;

  /** 動画読み込み前に表示するサムネイル画像のURL */
  poster?: string;

  /** 自動再生するかどうか（ブラウザのポリシーに注意） */
  autoPlay?: boolean;

  /** ループ再生するかどうか */
  loop?: boolean;

  /** ミュート状態で開始するかどうか */
  muted?: boolean;

  /** 再生コントロール（再生/停止/シークバー等）を表示するかどうか */
  controls?: boolean;

  /** 追加のCSSクラス名 */
  className?: string;

  /** 動画再生が終了した時に呼ばれるコールバック */
  onEnded?: () => void;

  /** 動画読み込みや再生でエラーが発生した時に呼ばれるコールバック */
  onError?: (error: unknown) => void;
}

/**
 * 処理状況オーバーレイコンポーネントのProps
 *
 * 動画処理中に画面全体を覆い、ユーザーの操作をブロックするオーバーレイ用です。
 * 処理の進捗状況やキャンセルボタンを表示します。
 *
 * @example
 * ```tsx
 * {isProcessing && (
 *   <ProcessingOverlay
 *     status="PROCESSING"
 *     progress={45}
 *     message="姿勢推定を実行中..."
 *     onCancel={() => cancelProcessing()}
 *   />
 * )}
 * ```
 */
export interface ProcessingOverlayProps {
  /** 現在の処理ステータス */
  status: ProcessingStatus;

  /** 処理の進捗率（0-100） */
  progress?: number;

  /** ユーザーに表示するメッセージ */
  message?: string;

  /** キャンセルボタンが押された時に呼ばれるコールバック（undefinedの場合はボタン非表示） */
  onCancel?: () => void;

  /** 追加のCSSクラス名 */
  className?: string;
}

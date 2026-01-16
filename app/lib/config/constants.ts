/**
 * @fileoverview アプリケーション全体で使用される定数と設定値
 *
 * 環境変数から値を読み込み、デフォルト値にフォールバックする設計になっています。
 * 本番環境では環境変数を適切に設定してください。
 */

/**
 * 環境変数から数値を安全に取得するヘルパー関数
 * @param key - 環境変数のキー（VITE_プレフィックス付き）
 * @param defaultValue - 環境変数が未設定の場合のデフォルト値
 * @returns パースされた数値、またはデフォルト値
 */
const getEnvNumber = (key: string, defaultValue: number): number => {
  // 1. window.ENV チェック (クライアント実行時)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof window !== 'undefined' && (window as any).ENV?.[key]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parsed = parseInt((window as any).ENV[key], 10);
    return isNaN(parsed) ? defaultValue : parsed;
  }
  // 2. import.meta.env チェック (ビルド時/SSR時)
  if (typeof import.meta !== 'undefined' && import.meta.env?.[key]) {
    const parsed = parseInt(import.meta.env[key], 10);
    return isNaN(parsed) ? defaultValue : parsed;
  }
  return defaultValue;
};

/**
 * 環境変数から文字列を安全に取得するヘルパー関数
 * @param key - 環境変数のキー（VITE_プレフィックス付き）
 * @param defaultValue - 環境変数が未設定の場合のデフォルト値
 * @returns 環境変数の値、またはデフォルト値
 */
const getEnvString = (key: string, defaultValue: string): string => {
  // 1. window.ENV チェック (クライアント実行時)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof window !== 'undefined' && (window as any).ENV?.[key]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (window as any).ENV[key];
  }
  // 2. import.meta.env チェック (ビルド時/SSR時)
  if (typeof import.meta !== 'undefined' && import.meta.env?.[key]) {
    return import.meta.env[key];
  }
  return defaultValue;
};

/**
 * アプリケーション設定オブジェクト
 *
 * @property APP_NAME - アプリケーション名
 * @property API - API通信関連の設定
 * @property UPLOAD - ファイルアップロード関連の設定
 * @property UI - UI表示関連の設定
 */
export const APP_CONFIG = {
  /** アプリケーション名 */
  APP_NAME: 'KenKen Pose Est',

  /** API通信関連の設定 */
  API: {
    /** バックエンドAPIのベースURL */
    get BASE_URL() {
      return getEnvString('VITE_API_BASE_URL', 'http://localhost:8000');
    },
    /** APIリクエストのタイムアウト時間（ミリ秒） */
    get TIMEOUT_MS() {
      return getEnvNumber('VITE_API_TIMEOUT', 30000);
    },
    /** APIエンドポイントのパス定義 */
    ENDPOINTS: {
      /** 動画処理エンドポイント (Backend) */
      UPLOAD: '/api/v1/process',
      /** ヘルスチェックエンドポイント */
      HEALTH: '/api/v1/health',
      /** BFFアップロードエンドポイント (Client → BFF) */
      BFF_UPLOAD: '/api/upload',
    },
  },

  /** ファイルアップロード関連の設定 */
  UPLOAD: {
    /** アップロード可能な最大ファイルサイズ（バイト） */
    get MAX_SIZE_BYTES() {
      return getEnvNumber('VITE_MAX_VIDEO_SIZE', 100 * 1024 * 1024);
    },
    /** 受け入れ可能なMIMEタイプと拡張子のマッピング */
    ACCEPTED_TYPES: {
      'video/mp4': ['.mp4'],
      'video/quicktime': ['.mov'],
      'video/webm': ['.webm'],
    } as Record<string, string[]>,
  },

  /** UI表示関連の設定 */
  UI: {
    /** Toast通知の表示時間（ミリ秒） */
    TOAST_DURATION_MS: 5000,
  },
} as const;

/** APP_CONFIGの型定義（読み取り専用） */
export type AppConfig = typeof APP_CONFIG;

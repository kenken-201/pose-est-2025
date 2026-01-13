import { AxiosError } from 'axios';
import { ApiErrorSchema } from './types';

/**
 * アプリケーション独自のAPIエラークラス
 *
 * AxiosのエラーをWrapし、統一された形式でエラーハンドリング可能にします。
 */
export class AppAPIError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly data?: unknown;

  constructor(message: string, code: string, status: number, data?: unknown) {
    super(message);
    this.name = 'AppAPIError';
    this.code = code;
    this.status = status;
    this.data = data;
    // TypeScript ES5ターゲット時のinstanceof互換性のため
    Object.setPrototypeOf(this, AppAPIError.prototype);
  }

  /** ユーザー向けに表示可能なメッセージを取得 */
  get userMessage(): string {
    return getUserFriendlyMessage(this.code);
  }
}

/** バックエンドAPIから返却されるエラーコード */
export type BackendErrorCode =
  | 'VIDEO_TOO_SHORT'
  | 'VIDEO_TOO_LONG'
  | 'INVALID_VIDEO_FORMAT'
  | 'FILE_TOO_LARGE'
  | 'INVALID_PARAMETER'
  | 'MODEL_INFERENCE_ERROR'
  | 'STORAGE_SERVICE_UNAVAILABLE';

/** クライアント側で生成されるエラーコード */
export type ClientErrorCode =
  | 'NETWORK_ERROR'
  | 'TIMEOUT_ERROR'
  | 'CLIENT_ERROR'
  | 'VALIDATION_ERROR'
  | 'UNKNOWN_ERROR';

/** 全エラーコードの統合型 */
export type ErrorCode = BackendErrorCode | ClientErrorCode;

/** エラーコード → ユーザー向けメッセージのマッピング */
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  // Backend errors
  VIDEO_TOO_SHORT: '動画が短すぎます。3秒以上の動画をアップロードしてください。',
  VIDEO_TOO_LONG: '動画が長すぎます。7分以内の動画をアップロードしてください。',
  INVALID_VIDEO_FORMAT:
    '動画ファイルを読み込めませんでした。対応形式（MP4, MOV, WebM）をご確認ください。',
  FILE_TOO_LARGE: 'ファイルサイズが大きすぎます。100MB以下の動画をアップロードしてください。',
  INVALID_PARAMETER: 'パラメータが不正です。設定を確認してください。',
  MODEL_INFERENCE_ERROR:
    '姿勢推定処理中にエラーが発生しました。しばらく時間をおいて再度お試しください。',
  STORAGE_SERVICE_UNAVAILABLE:
    'サービスが一時的に利用できません。しばらく時間をおいて再度お試しください。',
  // Client errors
  NETWORK_ERROR: 'ネットワーク接続を確認してください。',
  TIMEOUT_ERROR: 'リクエストがタイムアウトしました。しばらく時間をおいて再度お試しください。',
  CLIENT_ERROR: 'リクエストの送信に失敗しました。ページを再読み込みしてお試しください。',
  VALIDATION_ERROR: '入力内容に問題があります。ファイルを確認してください。',
  UNKNOWN_ERROR: '予期しないエラーが発生しました。',
};

/**
 * エラーコードからユーザー向けメッセージを取得する
 *
 * @param code - エラーコード
 * @returns ユーザー向けの日本語メッセージ
 */
export const getUserFriendlyMessage = (code: string): string => {
  return ERROR_MESSAGES[code as ErrorCode] ?? ERROR_MESSAGES.UNKNOWN_ERROR;
};

/**
 * AppAPIErrorのタイプガード
 */
export const isAppAPIError = (error: unknown): error is AppAPIError => {
  return error instanceof AppAPIError;
};

/**
 * AxiosErrorからAppAPIErrorを生成するファクトリー関数
 *
 * - レスポンスボディが構造化されたエラー（ApiErrorSchema）の場合はそれを優先
 * - Network ErrorやTimeoutなども専用コードに変換
 */
export const createErrorFromAxiosError = (error: AxiosError): AppAPIError => {
  if (error.response) {
    // サーバーからのレスポンスがある場合
    const data = error.response.data;
    const status = error.response.status;

    // レスポンスが既定のエラー形式かチェック
    const parseResult = ApiErrorSchema.safeParse(data);
    if (parseResult.success) {
      return new AppAPIError(
        parseResult.data.error.message,
        parseResult.data.error.code,
        status,
        parseResult.data.error.details
      );
    }

    // 定義されていない形式のエラーレスポンス
    return new AppAPIError(error.message, 'UNKNOWN_ERROR', status, data);
  } else if (error.request) {
    // リクエストは送信されたがレスポンスがない場合（ネットワークエラーやタイムアウト）

    // Axiosのタイムアウトコードチェック
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return new AppAPIError('Request timeout', 'TIMEOUT_ERROR', 408);
    }

    // ネットワークエラー
    return new AppAPIError('Network error', 'NETWORK_ERROR', 0);
  } else {
    // リクエスト設定時のエラーなど
    return new AppAPIError(error.message, 'CLIENT_ERROR', 400);
  }
};

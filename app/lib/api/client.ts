import axios, { AxiosInstance } from 'axios';
import { APP_CONFIG } from '../config/constants';
import { handleRequest, handleResponse, handleError } from './interceptors';

/**
 * アプリケーション共通のAxiosインスタンス
 *
 * 環境変数から読み込んだ設定（Base URL, Timeout）を適用し、
 * ログ出力やエラーハンドリング用のインターセプターを設定しています。
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: APP_CONFIG.API.BASE_URL,
  timeout: APP_CONFIG.API.TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
});

// インターセプターの適用
apiClient.interceptors.request.use(handleRequest, handleError);
apiClient.interceptors.response.use(handleResponse, handleError);

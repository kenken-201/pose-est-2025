import axios from 'axios';
import { APP_CONFIG } from '../../config/constants';
import { VideoProcessResponse } from '../../api/types';
import { createErrorFromAxiosError, AppAPIError } from '../../api/errors';

/**
 * @fileoverview サーバーサイド動画処理サービス
 *
 * React Router v7 Action から呼び出され、クライアントからのリクエストを
 * バックエンドAPIへ転送するプロキシサービスを提供します。
 */

/**
 * 動画処理リクエストをバックエンドに転送する (Server-side)
 *
 * React Router v7 Actionから呼び出され、multipart/form-dataを解析し、
 * バックエンドAPIへ転送します。
 *
 * @param request - React Router v7 ActionのRequestオブジェクト
 * @returns 処理結果
 * @throws AppAPIError - バックエンド通信エラー時
 */
export const processVideoRequest = async (request: Request): Promise<VideoProcessResponse> => {
  // 1. React Router v7のFormData解析
  const formData = await request.formData();
  const video = formData.get('video');

  if (!video || !(video instanceof File)) {
    throw new AppAPIError('Video file is required', 'VALIDATION_ERROR', 400);
  }

  // 2. バックエンドへの転送用FormData作成
  // Note: Node.js環境でのaxios + FormDataの扱いに注意が必要だが、
  // React Router v7のFileオブジェクトは標準Blob互換のため、そのままappendできる場合が多い。
  // 環境によっては 'form-data' パッケージが必要になることもある。
  const backendFormData = new FormData();
  backendFormData.append('video', video);

  // 3. バックエンドAPI呼び出し
  // サーバーサイドからの呼び出しなので、完全なURLが必要
  const url = `${APP_CONFIG.API.BASE_URL}${APP_CONFIG.API.ENDPOINTS.UPLOAD}`;

  try {
    const response = await axios.post<VideoProcessResponse>(url, backendFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: APP_CONFIG.API.TIMEOUT_MS, // Critical Fix #6: Add timeout
    });

    return response.data;
  } catch (error) {
    // Critical Fix #1: Transform axios errors to AppAPIError
    if (axios.isAxiosError(error)) {
      throw createErrorFromAxiosError(error);
    }
    throw error;
  }
};

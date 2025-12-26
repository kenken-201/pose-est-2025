import axios from 'axios';
import { APP_CONFIG } from '../../config/constants';
import { VideoProcessResponse } from '../../api/types';

/**
 * 動画処理リクエストをバックエンドに転送する (Server-side)
 *
 * Remix Actionから呼び出され、multipart/form-dataを解析し、
 * バックエンドAPIへ転送します。
 *
 * @param request - Remix ActionのRequestオブジェクト
 * @returns 処理結果
 */
export const processVideoRequest = async (request: Request): Promise<VideoProcessResponse> => {
    // 1. RemixのFormData解析
    const formData = await request.formData();
    const video = formData.get('video');

    if (!video || !(video instanceof File)) {
        throw new Error('Video file is required');
    }

    // 2. バックエンドへの転送用FormData作成
    // Note: Node.js環境でのaxios + FormDataの扱いに注意が必要だが、
    // RemixのFileオブジェクトは標準Blob互換のため、そのままappendできる場合が多い。
    // 環境によっては 'form-data' パッケージが必要になることもある。
    const backendFormData = new FormData();
    backendFormData.append('video', video);

    // 3. バックエンドAPI呼び出し
    // サーバーサイドからの呼び出しなので、完全なURLが必要であればBASE_URLを使う
    const url = `${APP_CONFIG.API.BASE_URL}${APP_CONFIG.API.ENDPOINTS.UPLOAD}`;

    const response = await axios.post<VideoProcessResponse>(url, backendFormData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};

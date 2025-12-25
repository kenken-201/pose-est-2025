/**
 * @fileoverview ファイル操作関連のユーティリティ関数
 *
 * ファイルサイズのフォーマット、拡張子の取得、ファイルタイプの判定など、
 * ファイル操作に関する汎用的なヘルパー関数を提供します。
 */

/**
 * ファイルサイズを人間が読みやすい形式に変換する
 *
 * バイト数を受け取り、適切な単位（Bytes, KB, MB, GB, TB）に変換して
 * 文字列として返します。小数点以下2桁まで表示します。
 *
 * @param bytes - 変換するファイルサイズ（バイト単位）
 * @returns フォーマットされたファイルサイズ文字列（例: "1.5 MB"）
 *
 * @example
 * ```typescript
 * formatFileSize(0);           // "0 Bytes"
 * formatFileSize(1024);        // "1 KB"
 * formatFileSize(1536);        // "1.5 KB"
 * formatFileSize(1048576);     // "1 MB"
 * formatFileSize(1073741824);  // "1 GB"
 * ```
 */
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * ファイル名から拡張子を取得する
 *
 * ファイル名の最後のドット以降の文字列を拡張子として返します。
 * ドットがない場合は空文字列を返します。
 *
 * @param filename - 拡張子を取得するファイル名
 * @returns ファイルの拡張子（ドットなし、小文字変換なし）
 *
 * @example
 * ```typescript
 * getFileExtension('video.mp4');       // "mp4"
 * getFileExtension('archive.tar.gz');  // "gz"
 * getFileExtension('.gitignore');      // "gitignore"
 * getFileExtension('noextension');     // ""
 * ```
 */
export const getFileExtension = (filename: string): string => {
    // ビット演算を使用して、ドットが見つからない場合（-1）を適切に処理
    // -1 - 1 = -2, -2 >>> 0 = 4294967294, + 2 で文字列の終端を超えるため空文字を返す
    return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
};

/**
 * ファイルが動画ファイルかどうかを判定する
 *
 * ファイルのMIMEタイプが "video/" で始まるかどうかで判定します。
 * MIMEタイプはブラウザが自動的に設定するため、
 * 拡張子偽装された場合は検出できない点に注意してください。
 *
 * @param file - 判定対象のFileオブジェクト
 * @returns 動画ファイルの場合はtrue、それ以外はfalse
 *
 * @example
 * ```typescript
 * const mp4File = new File([''], 'video.mp4', { type: 'video/mp4' });
 * isVideoFile(mp4File);  // true
 *
 * const txtFile = new File([''], 'doc.txt', { type: 'text/plain' });
 * isVideoFile(txtFile);  // false
 * ```
 */
export const isVideoFile = (file: File): boolean => {
    return file.type.startsWith('video/');
};

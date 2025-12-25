/**
 * ファイルサイズを人間が読みやすい形式に変換する
 */
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * ファイル拡張子を取得する
 */
export const getFileExtension = (filename: string): string => {
    return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
};

/**
 * 動画ファイルかどうかを判定する (簡易版)
 */
export const isVideoFile = (file: File): boolean => {
    return file.type.startsWith('video/');
};

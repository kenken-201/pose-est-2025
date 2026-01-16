import { useState, type FC } from 'react';

/**
 * ファイル拒否エラーの型定義
 */
export interface FileError {
  code: string;
  message: string;
}

/**
 * エラーコードの日本語化
 */
const getLocalizedErrorMessage = (code: string): string => {
  switch (code) {
    case 'file-too-large':
      return 'ファイルサイズが大きすぎます';
    case 'file-invalid-type':
      return '対応していないファイル形式です';
    case 'too-many-files':
      return 'ファイルは1つのみ選択できます';
    default:
      return 'ファイルを受け付けられませんでした';
  }
};

interface UploadDropzoneProps {
  /** ファイル選択時のコールバック */
  onFileSelect: (file: File) => void;
  /** ファイル拒否時のコールバック（オプション） */
  onFileRejected?: (errors: FileError[]) => void;
  /** 無効化フラグ */
  disabled?: boolean;
  /** 許可するMIMEタイプ (例: { 'video/mp4': ['.mp4'] }) */
  accept?: Record<string, string[]>;
  /** 最大ファイルサイズ (バイト) */
  maxSize?: number;
}

/**
 * 動画アップロード用ドロップゾーンコンポーネント
 *
 * ドラッグ&ドロップ機能を無効化し、クリックによるファイル選択のみを提供します。
 * これにより、誤ってファイルをドロップしてブラウザで開いてしまう事故を防ぎます。
 * react-dropzone は使用せず、標準の input 要素で実装しているため、
 * イベントの干渉などがなく確実に動作します。
 */
export const UploadDropzone: FC<UploadDropzoneProps> = ({
  onFileSelect,
  onFileRejected,
  disabled = false,
  accept,
  maxSize,
}) => {
  const [localError, setLocalError] = useState<string | null>(null);

  // デバッグ用: input の ID
  const inputId = 'upload-dropzone-file-input';

  const handleManualFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    // eslint-disable-next-line no-console
    console.log('[UploadDropzone] handleManualFileSelect called', e.target.files);

    const files = e.target.files;
    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];

    // バリデーション
    const errors: FileError[] = [];

    // 1. サイズチェック
    if (maxSize && file.size > maxSize) {
      errors.push({
        code: 'file-too-large',
        message: getLocalizedErrorMessage('file-too-large'),
      });
    }

    // 2. タイプチェック
    if (accept) {
      const acceptedTypes = Object.keys(accept);
      const fileType = file.type;
      const fileName = file.name.toLowerCase();

      const isValidType = acceptedTypes.some(type => {
        if (fileType === type) return true;
        const extensions = accept[type];
        return extensions.some(ext => {
          const cleanExt = ext.startsWith('.') ? ext : `.${ext}`;
          return fileName.endsWith(cleanExt.toLowerCase());
        });
      });

      if (!isValidType) {
        errors.push({
          code: 'file-invalid-type',
          message: getLocalizedErrorMessage('file-invalid-type'),
        });
      }
    }

    if (errors.length > 0) {
      setLocalError(errors[0].message);
      if (onFileRejected) {
        onFileRejected(errors);
      }
    } else {
      setLocalError(null);
      onFileSelect(file);
    }

    // inputをリセット（同じファイルを再度選択できるように）
    e.target.value = '';
  };

  // ラベルクリック時にエラーをクリア
  const handleLabelClick = () => {
    setLocalError(null);
  };

  // accept属性用の文字列を生成 (MIMEタイプと拡張子の両方を含める)
  const acceptString = accept
    ? Object.entries(accept)
        .flatMap(([mimeType, exts]) => [
          mimeType,
          ...exts.map(ext => (ext.startsWith('.') ? ext : `.${ext}`)),
        ])
        .join(',')
    : undefined;

  // eslint-disable-next-line no-console
  console.log('[UploadDropzone] Rendered/Mounted');

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        data-testid="upload-dropzone"
        className={`
          flex flex-col items-center justify-center p-8
          bg-white rounded-2xl shadow-sm border border-gray-100
          transition-all duration-200
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
          ${localError ? 'ring-2 ring-red-100' : ''}
        `}
      >
        {/* 
          input要素: visually hidden (display:none ではなく sr-only スタイル)
          label の htmlFor で紐付けることで、ラベルクリック時にネイティブでファイル選択が開く
        */}
        <input
          type="file"
          id={inputId}
          onChange={handleManualFileSelect}
          className="sr-only"
          accept={acceptString}
          disabled={disabled}
          data-testid="dropzone-input"
        />

        <div className="flex flex-col items-center text-center space-y-4">
          <div className={`p-4 rounded-full ${localError ? 'bg-red-50' : 'bg-blue-50'}`}>
            <svg
              className={`w-8 h-8 ${localError ? 'text-red-500' : 'text-blue-600'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {localError ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              )}
            </svg>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {localError ? 'ファイルを選択し直してください' : '動画をアップロード'}
            </h3>
            <p className="text-sm text-gray-500 max-w-xs mx-auto">
              {localError ? (
                <span
                  className="text-red-500 font-medium"
                  data-testid="dropzone-error"
                  role="alert"
                >
                  {localError}
                </span>
              ) : (
                'MP4, MOV, WebMに対応（最大 500MB）'
              )}
            </p>
          </div>

          {/* 
            label 要素: htmlFor で input と紐付け
            ブラウザネイティブの機能でファイル選択ダイアログを開く
            button ではなく label を使うことで、JS の click() に依存しない
          */}
          <label
            htmlFor={disabled ? undefined : inputId}
            onClick={handleLabelClick}
            className={`
              px-6 py-2.5 rounded-lg text-sm font-medium text-white shadow-sm transition-all
              inline-block select-none
              ${
                disabled
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow active:scale-95 cursor-pointer'
              }
            `}
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-disabled={disabled}
          >
            ファイルを選択
          </label>
        </div>
      </div>
    </div>
  );
};

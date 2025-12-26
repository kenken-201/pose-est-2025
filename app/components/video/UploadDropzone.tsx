import type { FC } from 'react';
import { useDropzone } from 'react-dropzone';


interface UploadDropzoneProps {
    /** ファイル選択時のコールバック */
    onFileSelect: (file: File) => void;
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
 * ドラッグ&ドロップまたはクリックによるファイル選択を提供します。
 * 選択されたファイルは onFileSelect コールバックを通じて親コンポーネントに渡されます。
 */
export const UploadDropzone: FC<UploadDropzoneProps> = ({
    onFileSelect,
    disabled = false,
    accept,
    maxSize,
}) => {
    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            onFileSelect(acceptedFiles[0]);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        disabled,
        accept,
        maxSize,
        multiple: false, // 単一ファイルのみ許可
    });

    return (
        <div
            {...getRootProps()}
            data-testid="upload-dropzone"
            className={`
                flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer
                transition-colors duration-200 ease-in-out
                ${
                    disabled
                        ? 'opacity-50 cursor-not-allowed border-gray-300 bg-gray-100'
                        : isDragActive
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:bg-gray-50'
                }
            `}
        >
            <input {...getInputProps()} data-testid="dropzone-input" />
            
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                    className={`w-10 h-10 mb-3 ${disabled ? 'text-gray-400' : 'text-gray-500'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                </svg>
                
                {isDragActive ? (
                    <p className="mb-2 text-sm text-blue-500 font-semibold">
                        ここにドロップしてください
                    </p>
                ) : (
                    <>
                        <p className={`mb-2 text-sm ${disabled ? 'text-gray-400' : 'text-gray-500'}`}>
                            <span className="font-semibold">動画をドラッグ＆ドロップ</span>
                        </p>
                        <p className={`text-xs ${disabled ? 'text-gray-400' : 'text-gray-500'}`}>
                            またはクリックして選択
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

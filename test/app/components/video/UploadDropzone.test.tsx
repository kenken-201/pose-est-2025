import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { UploadDropzone } from '@/components/video/UploadDropzone';

/**
 * UploadDropzone コンポーネントのテスト
 *
 * ユースケース:
 * 1. 初期描画: アップロードを促すメッセージが表示される
 * 2. ドラッグ&ドロップ: ファイルドロップ時に onFileSelect が呼ばれる
 * 3. クリック選択: ファイル選択ダイアログ経由でファイルが選択される
 * 4. バリデーション: 許可されていないファイル形式やサイズ超過時の挙動
 * 5. 無効化状態: disabled=true の場合、操作を受け付けない
 */
describe('UploadDropzone', () => {
    const defaultProps = {
        onFileSelect: vi.fn(),
    };

    it('renders default upload message', () => {
        render(<UploadDropzone {...defaultProps} />);
        expect(screen.getByText(/動画をドラッグ＆ドロップ/i)).toBeInTheDocument();
        expect(screen.getByText(/またはクリックして選択/i)).toBeInTheDocument();
    });

    it('handles file drop correctly', async () => {
        const onFileSelect = vi.fn();
        render(<UploadDropzone {...defaultProps} onFileSelect={onFileSelect} />);

        const file = new File(['dummy'], 'test.mp4', { type: 'video/mp4' });
        const input = screen.getByTestId('dropzone-input');

        // Note: react-dropzone testing usually requires mocking dataTransfer or using fireEvent.change on the input
        await userEvent.upload(input, file);

        await waitFor(() => {
            expect(onFileSelect).toHaveBeenCalledWith(file);
        });
    });

    it('shows active state when dragging file', async () => {
        render(<UploadDropzone {...defaultProps} />);
        
        const dropzone = screen.getByTestId('upload-dropzone');
        
        fireEvent.dragEnter(dropzone, {
            dataTransfer: {
                files: [new File([''], 'test.mp4', { type: 'video/mp4' })],
                items: [
                    {
                        kind: 'file',
                        type: 'video/mp4',
                        getAsFile: () => new File([''], 'test.mp4', { type: 'video/mp4' }),
                    },
                ],
                types: ['Files'],
            },
        });

        await waitFor(() => {
            expect(screen.getByText(/ここにドロップしてください/i)).toBeInTheDocument();
        });
    });

    it('does not trigger onFileSelect when disabled', async () => {
        const onFileSelect = vi.fn();
        render(<UploadDropzone {...defaultProps} onFileSelect={onFileSelect} disabled={true} />);

        const file = new File(['dummy'], 'test.mp4', { type: 'video/mp4' });
        const input = screen.getByTestId('dropzone-input');

        await userEvent.upload(input, file);

        expect(onFileSelect).not.toHaveBeenCalled();
        expect(screen.getByTestId('upload-dropzone')).toHaveClass('opacity-50', 'cursor-not-allowed');
    });

    it('accepts specific file types', async () => {
        const onFileSelect = vi.fn();
        const accept = { 'video/mp4': ['.mp4'] };
        render(<UploadDropzone {...defaultProps} onFileSelect={onFileSelect} accept={accept} />);

        const validFile = new File([''], 'test.mp4', { type: 'video/mp4' });
        const input = screen.getByTestId('dropzone-input');

        await userEvent.upload(input, validFile);
        
        expect(onFileSelect).toHaveBeenCalledWith(validFile);
    });
});

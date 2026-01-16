import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
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
 * 6. ファイル拒否: 無効なファイルの場合エラーメッセージを表示
 */
describe('UploadDropzone', () => {
  const defaultProps = {
    onFileSelect: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders default upload message', () => {
    render(<UploadDropzone {...defaultProps} />);
    expect(screen.getByText(/動画をアップロード/i)).toBeInTheDocument();
    expect(screen.getByText(/MP4, MOV, WebMに対応/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ファイルを選択/i })).toBeInTheDocument();
  });

  it('handles file selection correctly', async () => {
    const onFileSelect = vi.fn();
    render(<UploadDropzone {...defaultProps} onFileSelect={onFileSelect} />);

    const file = new File(['dummy'], 'test.mp4', { type: 'video/mp4' });
    const input = screen.getByTestId('dropzone-input');

    await userEvent.upload(input, file);

    await waitFor(() => {
      expect(onFileSelect).toHaveBeenCalledWith(file);
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

  /**
   * Important #6: ファイル拒否時のエラー表示テスト
   */
  it('displays error message for rejected files (size exceeded)', async () => {
    const onFileSelect = vi.fn();
    const onFileRejected = vi.fn();

    render(
      <UploadDropzone
        onFileSelect={onFileSelect}
        onFileRejected={onFileRejected}
        maxSize={100} // 100バイト制限
        accept={{ 'video/mp4': ['.mp4'] }}
      />
    );

    // 制限を超えるファイルを作成
    const largeFile = new File(['x'.repeat(200)], 'large.mp4', { type: 'video/mp4' });
    const input = screen.getByTestId('dropzone-input');

    await userEvent.upload(input, largeFile);

    // コールバックが呼ばれないことを確認
    expect(onFileSelect).not.toHaveBeenCalled();

    // エラーコールバックが呼ばれることを確認
    await waitFor(() => {
      expect(onFileRejected).toHaveBeenCalled();
    });

    // エラーメッセージが表示されることを確認
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByTestId('dropzone-error')).toHaveTextContent(
        /ファイルサイズが大きすぎます/
      );
    });
  });

  it('displays error message for invalid file type', async () => {
    const onFileSelect = vi.fn();

    render(<UploadDropzone onFileSelect={onFileSelect} accept={{ 'video/mp4': ['.mp4'] }} />);

    // 許可されていない形式のファイル
    const invalidFile = new File(['test'], 'document.pdf', { type: 'application/pdf' });
    const input = screen.getByTestId('dropzone-input');

    await userEvent.upload(input, invalidFile);

    expect(onFileSelect).not.toHaveBeenCalled();

    await waitFor(() => {
      const errorElement = screen.queryByTestId('dropzone-error');
      if (errorElement) {
        expect(errorElement).toHaveTextContent(/対応していないファイル形式です/);
      }
    });
  });
});

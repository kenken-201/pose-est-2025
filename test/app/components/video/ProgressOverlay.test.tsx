import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProgressOverlay } from '@/components/video/ProgressOverlay';
import { ProcessingStatus } from '@/lib/stores/video.store';

/**
 * ProgressOverlay コンポーネントのテスト
 *
 * ユースケース:
 * 1. UPLOADING状態: プログレスバーと進捗率(%)が表示されること
 * 2. PROCESSING状態: スピナーと処理中メッセージが表示されること
 * 3. 待機状態 (IDLE/COMPLETED/ERROR): コンポーネントが表示されないこと
 * 4. カスタムメッセージ: messageプロパティが正しく表示されること
 */
describe('ProgressOverlay', () => {
  it('renders progress bar and percentage when UPLOADING', () => {
    render(<ProgressOverlay status={ProcessingStatus.UPLOADING} progress={45} />);

    expect(screen.getByText('45%')).toBeInTheDocument();
    expect(screen.getByText(/アップロード中/i)).toBeInTheDocument();

    // プログレスバーの存在確認 (role="progressbar" を期待)
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    // スタイルまたは属性で進捗が反映されているか確認は実装依存だが、ここでは存在確認まで
  });

  it('renders spinner and message when PROCESSING', () => {
    render(<ProgressOverlay status={ProcessingStatus.PROCESSING} progress={100} />);

    expect(screen.getByText(/動画を処理中/i)).toBeInTheDocument();
    // 処理中は進捗100%でもプログレスバーではなくスピナー表示などを想定
    // "アップロード中" が表示されていないことを確認
    expect(screen.queryByText(/アップロード中/i)).not.toBeInTheDocument();
  });

  it('renders nothing when IDLE, COMPLETED, or ERROR', () => {
    const { rerender, container } = render(
      <ProgressOverlay status={ProcessingStatus.IDLE} progress={0} />
    );
    expect(container).toBeEmptyDOMElement();

    rerender(<ProgressOverlay status={ProcessingStatus.COMPLETED} progress={100} />);
    expect(container).toBeEmptyDOMElement();

    rerender(<ProgressOverlay status={ProcessingStatus.ERROR} progress={0} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('displays custom message if provided', () => {
    const customMessage = 'カスタムメッセージ';
    render(
      <ProgressOverlay
        status={ProcessingStatus.PROCESSING}
        progress={100}
        message={customMessage}
      />
    );

    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });
});

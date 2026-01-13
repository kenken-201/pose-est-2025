import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { VideoPlayer } from '@/components/video/VideoPlayer';

/**
 * VideoPlayer コンポーネントのテスト
 *
 * ユースケース:
 * 1. 正常描画: src属性が正しく設定されたvideoタグが描画されること
 * 2. 再生制御: controls, autoPlay プロパティが正しく反映されること
 * 3. イベントハンドリング: 動画終了時(onEnded)にコールバックが呼ばれること
 * 4. カスタムクラス: className が正しく適用されること
 *
 * @note src が必須になったため、null チェックのテストは削除
 *       親コンポーネントで条件付きレンダリングする設計に変更
 */
describe('VideoPlayer', () => {
  const mockSrc = 'http://example.com/video.mp4';

  it('renders video element with correct source', () => {
    render(<VideoPlayer src={mockSrc} />);

    const videoElement = screen.getByTestId('video-player') as HTMLVideoElement;
    expect(videoElement).toBeInTheDocument();
    expect(videoElement).toHaveAttribute('src', mockSrc);
  });

  it('applies controls and autoPlay attributes', () => {
    render(<VideoPlayer src={mockSrc} controls autoPlay />);

    const videoElement = screen.getByTestId('video-player') as HTMLVideoElement;
    expect(videoElement).toHaveAttribute('controls');
    expect(videoElement).toHaveAttribute('autoplay');
  });

  it('calls onEnded callback when video finishes', () => {
    const onEnded = vi.fn();
    render(<VideoPlayer src={mockSrc} onEnded={onEnded} />);

    const videoElement = screen.getByTestId('video-player');
    fireEvent.ended(videoElement);

    expect(onEnded).toHaveBeenCalledTimes(1);
  });

  it('supports custom className', () => {
    render(<VideoPlayer src={mockSrc} className="custom-class" />);

    const videoElement = screen.getByTestId('video-player');
    expect(videoElement).toHaveClass('custom-class');
  });
});

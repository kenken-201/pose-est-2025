import { HydratedRouter } from 'react-router-dom';
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';

// グローバルなドラッグ＆ドロップ無効化（ブラウザのファイルオープン防止）
// Hydration前に即座に登録することで、ページロード直後のドロップも防止する
// キャプチャフェーズ（true）で登録し、イベントが子要素に伝播する前に処理
// Note: preventDefault() のみ使用。stopPropagation は使わない。
// これによりブラウザのデフォルト動作（ファイルを開く）は防止しつつ、
// アプリケーション内のドロップゾーンには正常にイベントが伝播する。
if (typeof window !== 'undefined') {
  window.addEventListener(
    'dragover',
    (e) => {
      e.preventDefault();
    },
    true // キャプチャフェーズで登録
  );

  window.addEventListener(
    'drop',
    (e) => {
      e.preventDefault();
    },
    true // キャプチャフェーズで登録
  );
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>
  );
});

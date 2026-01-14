import { HydratedRouter } from 'react-router-dom';
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';

// グローバルなドラッグ＆ドロップ無効化（ブラウザのファイルオープン防止）は
// app/root.tsx で React イベントとして制御する方針に変更。

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>
  );
});


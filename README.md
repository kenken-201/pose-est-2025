# KenKen 姿勢推定スポーツ分析 (Pose Estimation Sports Analysis)

動画をアップロードしてAIによる姿勢推定とスポーツフォーム分析を行うWebアプリケーションです。

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![Coverage](https://img.shields.io/badge/coverage-94%25-brightgreen.svg)

## 🚀 Tech Stack

### Frontend

- **Framework:** [React Router v7](https://reactrouter.com/) (SSR Enabled)
- **State Management:**
  - Server State: [TanStack Query (React Query)](https://tanstack.com/query/latest)
  - Client State: [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- **Styling:** [TailwindCSS](https://tailwindcss.com/)
- **Components:** [Lucide React](https://lucide.dev/) (Icons)

### Testing

- **Unit Testing:** [Vitest](https://vitest.dev/)
- **Integration Testing:** [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

### Infrastructure (Planned)

- **Hosting:** Cloudflare Pages (Functions)
- **Backend:** (Future Implementation)

## 🛠 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm

### Installation

環境構築セットアップスクリプトを実行してください:

```bash
./scripts/setup.sh
```

### Development

開発サーバーを起動:

```bash
npm run dev
```

アプリケーションは `http://localhost:3000` で起動します。

## ✅ Testing & Quality Checks

### 一括品質チェック（推奨）

以下のスクリプトで、TypeCheck, Lint, Test, Buildを一括実行できます:

```bash
./scripts/quality-check.sh        # 全チェック実行
./scripts/quality-check.sh --fix  # Lint自動修正付き
```

### 個別実行

- `npm run typecheck` : TypeScript型チェック
- `npm run lint:fix` : コードスタイルの修正
- `npm run test` : テスト実行
- `npm run test:coverage` : カバレッジレポート生成
- `npm run build` : プロダクションビルド

## 📁 Project Structure

```
app/
├── components/         # UI 構成要素
│   ├── layout/         # MainLayout など
│   ├── ui/             # LoadingSpinner など汎用パーツ
│   └── video/          # ProcessingContainer, UploadDropzone など機能パーツ
├── lib/
│   ├── api/            # APIクライアント設定
│   ├── hooks/          # カスタムフック (useVideoProcessing)
│   ├── providers/      # AppProviders (React Query)
│   ├── services/       # ビジネスロジック
│   ├── stores/         # Zustand ストア
│   └── utils/          # 汎用ユーティリティ
├── routes/             # React Router ルーティング定義
│   └── _index.tsx      # トップページ
├── root.tsx            # アプリケーションルート
└── entry.client.tsx    # クライアントサイドエントリー
```

## デモ

ページ表示時は以下のような想定です。（現在はlocalhostでしか動かない）
<img width="1071" height="691" alt="スクリーンショット 2025-12-27 20 19 41" src="https://github.com/user-attachments/assets/cc8b76f6-81be-4e1f-8326-b60a85700e30" />

## 🚢 Deployment

本プロジェクトは **Cloudflare Pages** へのデプロイを想定しています。
SSRモードが有効になっているため、`@react-router/cloudflare` アダプターを使用します。

```bash
npm run build
npm run start # (Production Preview)
```

## © License

All rights reserved.

# GitHub Actions ワークフロー修正指示書

## 📋 概要

現状の `deploy-workers.yml` には以下の問題があり、CI/CD でのデプロイが失敗する可能性が高いです。

1. **実行ディレクトリの不整合**: `package.json` がある `pose-est-front` ディレクトリで実行されていません。
2. **React Router v7 ビルド構成**: `wrangler deploy` がソースコードからのバンドルを試み失敗します（手動デプロイ失敗と同様）。ビルド済みファイルを使用する設定が必要です。

## 🛠️ 修正手順

`pose-est-front/.github/workflows/deploy-workers.yml` を以下の内容に完全に置き換えてください。

### 主な変更点

- `defaults.run.working-directory` を設定
- `npm run build` で生成された `build/server/wrangler.json` をベースに、環境別 (`Preview` / `Production`) の設定ファイルを `jq` で動的に生成
- `wrangler-action` で生成した設定ファイルを使用 (`-c` オプション)

### 修正後の `deploy-workers.yml`

```yaml
name: Deploy Workers

on:
  push:
    branches: [main, develop]
    paths:
      - 'pose-est-front/**'
      - '.github/workflows/deploy-workers.yml'
  pull_request:
    branches: [main, develop]
    paths:
      - 'pose-est-front/**'
      - '.github/workflows/deploy-workers.yml'

defaults:
  run:
    working-directory: pose-est-front

jobs:
  deploy:
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          cache-dependency-path: pose-est-front/package-lock.json

      - name: Install Dependencies
        run: npm ci

      # -----------------------------------------------------------------------
      # Preview (Develop / PR) Build & Deploy
      # -----------------------------------------------------------------------
      - name: Build (Preview)
        if: github.ref != 'refs/heads/main'
        run: npm run build
        env:
          VITE_CF_BEACON_TOKEN: ${{ secrets.VITE_CF_BEACON_TOKEN }}
          VITE_API_BASE_URL: https://api-dev.kenken-pose-est.online
          VITE_APP_NAME: 'KenKen Pose Est (Dev)'

      - name: Generate Wrangler Config (Preview)
        if: github.ref != 'refs/heads/main'
        run: |
          # 生成された wrangler.json を Dev 用に調整
          # name はデフォルトで pose-est-frontend-dev になっているはずだが念のため確認
          jq '.name = "pose-est-frontend-dev" | .vars.VITE_API_BASE_URL = "https://api-dev.kenken-pose-est.online" | .vars.VITE_APP_NAME = "KenKen Pose Est (Dev)"' build/server/wrangler.json > build/server/wrangler-preview.json
          cat build/server/wrangler-preview.json

      - name: Deploy (Preview)
        if: github.ref != 'refs/heads/main'
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          workingDirectory: pose-est-front
          command: deploy -c build/server/wrangler-preview.json

      # -----------------------------------------------------------------------
      # Production (Main) Build & Deploy
      # -----------------------------------------------------------------------
      - name: Build (Production)
        if: github.ref == 'refs/heads/main'
        run: npm run build
        env:
          VITE_CF_BEACON_TOKEN: ${{ secrets.VITE_CF_BEACON_TOKEN }}
          VITE_API_BASE_URL: https://api.kenken-pose-est.online
          VITE_APP_NAME: 'KenKen Pose Est'

      - name: Generate Wrangler Config (Production)
        if: github.ref == 'refs/heads/main'
        run: |
          # 生成された wrangler.json を Prod 用に調整
          # name を pose-est-frontend-prod に変更し、vars を上書き
          jq '.name = "pose-est-frontend-prod" | .vars.VITE_API_BASE_URL = "https://api.kenken-pose-est.online" | .vars.VITE_APP_NAME = "KenKen Pose Est"' build/server/wrangler.json > build/server/wrangler-prod.json
          cat build/server/wrangler-prod.json

      - name: Deploy (Production)
        if: github.ref == 'refs/heads/main'
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          workingDirectory: pose-est-front
          command: deploy -c build/server/wrangler-prod.json
```

### 補足

- **`cache-dependency-path`**: Package directory パスに合わせて修正しています。
- **`jq` コマンド**: `build/server/wrangler.json` (React Router ビルド成果物) をベースに、デプロイ先環境に合わせて `name` と `vars` を書き換えた一時的な設定ファイルを作成しています。
- **`wrangler deploy -c ...`**: 生成した設定ファイルを明示的に指定することで、確実に意図した環境へデプロイします。

cat > debug-rr7.sh << 'EOF'
#!/bin/bash

echo "🔍 React Router v7 デバッグ開始..."

echo "1. パッケージバージョン確認..."
npm list @react-router/dev react-router-dom

echo "2. ファイル構造確認..."
find app -name "*.tsx" -o -name "*.ts" | sort

echo "3. 型定義生成..."
npx react-router typegen 2>&1

echo "4. 型定義ディレクトリ確認..."
ls -la app/+types/ 2>/dev/null || echo "型定義ディレクトリがありません"

echo "5. TypeScript設定確認..."
cat tsconfig.json | grep -A5 -B5 "include\|exclude"

echo "6. Vite設定確認..."
head -20 vite.config.ts

echo "✅ デバッグ情報収集完了"
EOF

chmod +x debug-rr7.sh
./debug-rr7.sh
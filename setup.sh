# ディレクトリ構造の確認
find app -type d | tree --fromfile

# 各ディレクトリに空のインデックスファイルを作成（型定義用）
touch app/components/video/index.ts
touch app/components/ui/index.ts
touch app/components/layout/index.ts
touch app/lib/api/index.ts
touch app/lib/services/index.ts
touch app/lib/utils/index.ts
touch app/lib/hooks/index.ts
touch app/lib/stores/index.ts
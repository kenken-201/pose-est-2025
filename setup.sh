# 完全にクリーンアップ
rm -rf node_modules package-lock.json

# npm設定を確実に
npm config set registry https://registry.npmjs.org/
npm config delete proxy
npm config delete https-proxy

# キャッシュクリア
npm cache clean --force

# インストール
npm install

# 1. キャッシュクリア
npm cache clean --force

# 2. node_modulesとlockファイル削除
rm -rf node_modules package-lock.json

# 3. npmの設定確認と修正
npm config set registry https://registry.npmjs.org/
npm config set fetch-retry-maxtimeout 60000
npm config set fetch-retry-mintimeout 10000

# 4. ネットワーク確認
curl -I https://registry.npmjs.org/

# 5. 段階的インストール（最も確実）
npm init -y
npm install react --save-exact
npm install react-dom --save-exact
npm install react-router-dom --save-exact
npm install axios --save-exact

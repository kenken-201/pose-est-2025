

export function meta() {
  return [
    { title: "KenKen姿勢推定スポーツ分析" },
    { name: "description", content: "動画をアップロードしてAI姿勢推定を実行" },
  ];
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            KenKen姿勢推定スポーツ分析
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            動画をアップロードして、AIによる姿勢推定とスポーツフォーム分析を実行
          </p>
          
          <div className="bg-white rounded-xl shadow-card p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">機能概要</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-blue-600 font-bold text-lg mb-2">1. 動画アップロード</div>
                <p className="text-gray-700">MP4, AVI, MOV, WebM形式対応</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-green-600 font-bold text-lg mb-2">2. AI姿勢推定</div>
                <p className="text-gray-700">リアルタイムで骨格情報を抽出</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-purple-600 font-bold text-lg mb-2">3. 結果表示</div>
                <p className="text-gray-700">推定結果を動画に重畳表示</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">
              🎉 React Router v7 ファイルベースルーティング動作確認！
            </h3>
            <p className="text-blue-700 mb-4">
              以下のコマンドで型定義を生成してください：
            </p>
            <code className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg font-mono text-sm">
              npm run typegen
            </code>
          </div>
        </div>
      </main>
    </div>
  );
}

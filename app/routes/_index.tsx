export function meta() {
  return [
    { title: "KenKen姿勢推定スポーツ分析" },
    { name: "description", content: "動画をアップロードしてAI姿勢推定を実行" },
  ];
}

/**
 * 最小限のテストページ
 * ProcessingContainer なしで表示されるか確認
 */
export default function IndexPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            KenKen姿勢推定スポーツ分析
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            テストページ - ProcessingContainer なし
          </p>
          <div className="bg-green-100 p-6 rounded-lg">
            <p className="text-green-800 font-medium">
              ✅ このメッセージが表示されれば、ルーティングは正常です
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

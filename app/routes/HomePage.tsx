export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          KenKen姿勢推定スポーツ分析
        </h1>
        <p className="text-gray-600 mb-8">
          依存関係インストール成功！次の実装ステップへ進みましょう。
        </p>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">次のTODO:</h2>
          <ol className="text-left list-decimal list-inside space-y-2">
            <li>Tailwind CSSの設定</li>
            <li>APIクライアントの実装</li>
            <li>動画アップロードコンポーネントの作成</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

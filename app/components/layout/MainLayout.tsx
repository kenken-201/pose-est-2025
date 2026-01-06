import type { FC, ReactNode } from 'react';

interface MainLayoutProps {
    children: ReactNode;
}

/**
 * メインレイアウトコンポーネント
 *
 * アプリケーション全体で共通のヘッダーとフッターを提供します。
 */
export const MainLayout: FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* ヘッダー */}
            <header role="banner" className="bg-white shadow-sm border-b border-gray-200">
                <div className="container mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold text-gray-900">
                        KenKen姿勢推定スポーツ分析
                    </h1>
                </div>
            </header>

            {/* メインコンテンツ */}
            <main className="flex-1">
                {children}
            </main>

            {/* フッター */}
            <footer role="contentinfo" className="bg-gray-50 border-t border-gray-200 mt-auto">
                <div className="container mx-auto px-4 py-6">
                    <p className="text-center text-sm text-gray-600">
                        © 2025 KenKen姿勢推定スポーツ分析. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

import type { Route } from "./+types/root";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import { AppProviders } from "./lib/providers/providers";

import "./styles/globals.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <AppProviders>
      <Outlet />
    </AppProviders>
  );
}

// HydrateFallback removed

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "予期せぬエラーが発生しました";
  let details: string = "不明なエラー";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "ページが見つかりません" : "エラーが発生しました";
    details = error.data?.message || error.statusText || "エラーの詳細はありません";
  } else if (error instanceof Error) {
    details = error.message;
    if (import.meta.env.DEV) {
      stack = error.stack;
    }
  } else if (typeof error === "string") {
    details = error;
  } else if (error && typeof error === "object" && "message" in error) {
    details = String((error as { message: unknown }).message);
  } else {
    details = String(error);
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">{message}</h1>
        <p className="text-gray-600 mb-6">{details}</p>
        {stack && (
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
            {stack}
          </pre>
        )}
      </div>
    </main>
  );
}

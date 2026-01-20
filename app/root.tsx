import type { Route } from './+types/root';
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from 'react-router';

import { Suspense } from 'react';
import { AppProviders } from './lib/providers/providers';
import { GlobalError } from './components/common/GlobalError';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

import './styles/globals.css';

export async function loader({ context }: Route.LoaderArgs) {
  return {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    ENV: {
      VITE_API_BASE_URL: (context as any).cloudflare.env.VITE_API_BASE_URL,
      VITE_API_TIMEOUT: (context as any).cloudflare.env.VITE_API_TIMEOUT,
      VITE_MAX_VIDEO_SIZE: (context as any).cloudflare.env.VITE_MAX_VIDEO_SIZE,
      VITE_CF_BEACON_TOKEN: (context as any).cloudflare.env.VITE_CF_BEACON_TOKEN,
    },
    /* eslint-enable @typescript-eslint/no-explicit-any */
  };
}

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  // useLoaderData フックでローダーデータを取得
  // Layout コンポーネントでは props として受け取れないため、フックを使用
  const loaderData = useLoaderData<typeof loader>();

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
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(loaderData?.ENV || {})}`,
          }}
        />
        <ScrollRestoration />
        <Scripts />
        {/* Cloudflare Web Analytics */}
        {loaderData?.ENV?.VITE_CF_BEACON_TOKEN && (
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={JSON.stringify({
              token: loaderData.ENV.VITE_CF_BEACON_TOKEN,
            })}
          />
        )}
      </body>
    </html>
  );
}

import { Toaster } from 'sonner';

export default function App() {
  return (
    <AppProviders>
      <Toaster richColors position="bottom-right" closeButton theme="light" />
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <Outlet />
      </Suspense>
    </AppProviders>
  );
}

// HydrateFallback removed

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <GlobalError error={error} />;
}

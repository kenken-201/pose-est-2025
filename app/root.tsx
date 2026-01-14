import type { Route } from './+types/root';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';

import { Suspense } from 'react';
import { AppProviders } from './lib/providers/providers';
import { GlobalError } from './components/common/GlobalError';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

import './styles/globals.css';

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
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
        {/* Cloudflare Web Analytics */}
        {import.meta.env.VITE_CF_BEACON_TOKEN && (
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={JSON.stringify({
              token: import.meta.env.VITE_CF_BEACON_TOKEN,
            })}
          />
        )}
      </body>
    </html>
  );
}

export default function App() {
  return (
    <AppProviders>
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

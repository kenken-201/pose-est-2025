declare module 'virtual:react-router/server-build' {
  import { ServerBuild } from 'react-router';
  export const routes: ServerBuild['routes'];
  export const assets: ServerBuild['assets'];
  export const entry: ServerBuild['entry'];
  export const future: ServerBuild['future'];
  export const publicPath: ServerBuild['publicPath'];
  export const assetsBuildDirectory: ServerBuild['assetsBuildDirectory'];
  export const isSpaMode: ServerBuild['isSpaMode'];
  export const ssr: ServerBuild['ssr'];
  export const prerender: ServerBuild['prerender'];
  export const routeDiscovery: ServerBuild['routeDiscovery'];
}

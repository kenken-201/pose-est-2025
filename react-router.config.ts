import type { Config } from "@react-router/dev/config";

export default {
  ssr: false,  // SPA モード
  // SPA モードではプリレンダリングを無効化
  prerender: false,
} satisfies Config;

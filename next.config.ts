import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 禁用 Turbopack — 中文路徑會觸發 Turbopack 的 UTF-8 boundary bug
  experimental: {},

  // edge-tts-universal 使用 ws (WebSocket) 原生模組，
  // webpack 打包會破壞 bufferutil/utf-8-validate 的 native binding，
  // 必須排除在 server-side bundling 之外。
  serverExternalPackages: [
    "edge-tts-universal",
    "ws",
    "isomorphic-ws",
  ],
};

export default nextConfig;

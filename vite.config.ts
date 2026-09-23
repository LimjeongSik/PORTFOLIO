import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

import { chatApiPlugin } from "./vite-plugin-chat-api";

import type { Plugin } from "vite";

/**
 * 첫 화면의 한글 폰트를 HTML에서 미리 받게 한다.
 *
 * `@font-face`는 **글자가 실제로 그려질 때** 비로소 받아진다. 이 사이트는 CSR이라 그 시점이
 * 엔트리 JS를 다 받아 React가 첫 렌더를 마친 뒤인데, 그때 히어로 제목은 이미 시스템 폰트로
 * 그려져 있다 — 폰트가 도착하는 순간 큰 제목의 폭이 통째로 달라진다.
 *
 * 파일명은 해시가 붙어 빌드 뒤에야 알 수 있으므로 번들에서 찾아 넣는다. 본문(400)과
 * 표제(700)만 — 셋을 다 걸면 엔트리 JS와 대역폭을 다툰다.
 */
function preloadCriticalAssets(): Plugin {
    const fonts = /pretendard-(400|700)\.core-[^/]*\.woff2$/;
    return {
        name: "preload-critical-assets",
        apply: "build",
        enforce: "post",
        transformIndexHtml(_html, ctx) {
            const files = Object.keys(ctx.bundle ?? {});
            return files
                .filter((file) => fonts.test(file))
                .map((file) => ({
                    tag: "link",
                    attrs: {
                        rel: "preload",
                        as: "font",
                        type: "font/woff2",
                        href: `/${file}`,
                        crossorigin: "",
                    },
                    injectTo: "head-prepend" as const,
                }));
        },
    };
}

export default defineConfig({
    plugins: [react(), tailwindcss(), svgr(), chatApiPlugin(), preloadCriticalAssets()],
    resolve: {
        tsconfigPaths: true,
    },
    build: {
        rolldownOptions: {
            output: {
                // Vite 8(rolldown)에서 manualChunks는 제거됨 — codeSplitting.groups를 쓴다.
                // 라이브러리는 앱 코드보다 훨씬 드물게 바뀌므로, 갈라두면 앱을 배포해도
                // 사용자 캐시에 남은 vendor 청크를 그대로 재사용한다.
                codeSplitting: {
                    groups: [
                        {
                            name: "react-vendor",
                            test: /node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom)[\\/]/,
                        },
                        {
                            name: "assistant-vendor",
                            test: /node_modules[\\/](@assistant-ui|assistant-stream|@ai-sdk|ai|zod)[\\/]/,
                        },
                    ],
                },
            },
        },
    },
});

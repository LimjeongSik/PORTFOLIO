import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

import { chatApiPlugin } from "./vite-plugin-chat-api";

import type { Plugin } from "vite";

/**
 * 첫 화면에 쓰이는 한글 폰트와 무대 청크를 HTML에서 미리 받게 한다.
 *
 * `@font-face`는 **글자가 실제로 그려질 때** 비로소 받아진다. 이 사이트는 CSR이라 그 시점이
 * "엔트리 JS(압축 206KB)를 다 받아 React가 첫 렌더를 마친 뒤"인데, 그때 히어로 제목은 이미
 * 시스템 폰트로 그려져 있다 — 폰트가 도착하는 순간 7rem 글자의 폭이 통째로 달라지고, 그게
 * 인트로 애니메이션 한가운데 떨어져 글자가 튄다.
 *
 * 그래서 `<link rel="preload">`로 HTML 파싱 시점에 받기 시작하게 한다. 파일명은 해시가 붙어
 * 빌드 뒤에야 알 수 있으므로 손으로 적을 수 없고, 번들에서 찾아 넣는다.
 *
 * 본문(400)과 표제(700)만 미리 받는다 — 500은 첫 화면에서 버튼 라벨 정도라 늦게 와도 티가
 * 안 나는데, 셋을 다 걸면 229KB가 엔트리 JS와 대역폭을 다툰다.
 *
 * 무대 청크(three + Stage)는 `modulepreload`로 건다. 첫 화면의 인트로가 무대를 기다리므로
 * (`lib/stage`) 이 청크가 늦으면 **기다리는 시간이 그대로 길어진다**. 그런데 동적 import는
 * 엔트리 JS가 다 평가된 뒤에야 받기 시작하므로, 손대지 않으면 내려받기가 직렬로 붙는다.
 * `modulepreload`는 HTML 파싱 시점에 받아 두기만 하고 **평가는 하지 않는다** — 평가는 여전히
 * import가 실행될 때다.
 */
function preloadCriticalAssets(): Plugin {
    const fonts = /pretendard-(400|700)\.core-[^/]*\.woff2$/;
    const stage = /assets\/(Stage|three-vendor)-[^/]*\.js$/;
    return {
        name: "preload-critical-assets",
        apply: "build",
        enforce: "post",
        transformIndexHtml(_html, ctx) {
            const files = Object.keys(ctx.bundle ?? {});
            return [
                ...files
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
                    })),
                ...files
                    .filter((file) => stage.test(file))
                    .map((file) => ({
                        tag: "link",
                        attrs: { rel: "modulepreload", href: `/${file}`, crossorigin: "" },
                        injectTo: "head" as const,
                    })),
            ];
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
                        { name: "gsap-vendor", test: /node_modules[\\/](gsap|@gsap)[\\/]/ },
                        // 홈과 프로젝트 상세가 같은 무대 장치를 쓰므로 three는 둘이 나눠 받는다.
                        { name: "three-vendor", test: /node_modules[\\/]three[\\/]/ },
                        {
                            name: "motion-vendor",
                            test: /node_modules[\\/](motion|motion-dom|motion-utils)[\\/]/,
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

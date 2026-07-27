import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

export default defineConfig({
    plugins: [react(), tailwindcss(), svgr()],
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
                        {
                            name: "motion-vendor",
                            test: /node_modules[\\/](motion|motion-dom|motion-utils)[\\/]/,
                        },
                    ],
                },
            },
        },
    },
});

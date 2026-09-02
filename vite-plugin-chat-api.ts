import { loadEnv } from "vite";

import { sendWebResponse, toWebRequest } from "./api/_lib/node-adapter.js";

import type { Plugin } from "vite";

/**
 * 개발 서버에서 `/api/chat`을 처리한다.
 *
 * 프로덕션은 Vercel 서버리스 함수(`api/chat.ts`)가 받지만, 개발 중에는 그게 없다.
 * `vercel dev`로 Vite 8(rolldown)을 감싸는 대신, 여기서 같은 핸들러를 태워
 * `bun run dev` 하나로 개발이 끝나게 한다. 핸들러는 `ssrLoadModule`로 불러오므로
 * 서버 코드를 고쳐도 재시작할 필요가 없다.
 */
export function chatApiPlugin(): Plugin {
    return {
        name: "portfolio:chat-api",
        apply: "serve",
        config(_config, { mode }) {
            // .env.local의 API 키는 VITE_ 접두사가 없어 클라이언트 번들에는 들어가지 않는다.
            // 서버 핸들러가 process.env로 읽을 수 있게 여기서만 주입한다.
            const env = loadEnv(mode, process.cwd(), "");
            for (const key of ["GOOGLE_GENERATIVE_AI_API_KEY", "GEMINI_MODEL"]) {
                if (env[key] && !process.env[key]) process.env[key] = env[key];
            }
        },
        configureServer(server) {
            server.middlewares.use("/api/chat", async (req, res) => {
                try {
                    const { handleChat } = (await server.ssrLoadModule(
                        "/api/_lib/handler.ts",
                    )) as typeof import("./api/_lib/handler.ts");

                    await sendWebResponse(res, await handleChat(toWebRequest(req)));
                } catch (error) {
                    server.config.logger.error(`[chat-api] ${String(error)}`);
                    if (!res.headersSent) {
                        res.statusCode = 500;
                        res.setHeader("content-type", "application/json; charset=utf-8");
                    }
                    res.end(JSON.stringify({ error: "서버에서 처리하지 못했습니다." }));
                }
            });
        },
    };
}

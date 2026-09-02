/**
 * Vercel 서버리스 함수 진입점. 로직은 `_lib/handler.ts`에 있고,
 * 개발 서버(Vite 미들웨어)도 같은 함수를 태운다.
 * `api/` 안에서 `_`로 시작하는 파일은 Vercel이 라우트로 만들지 않는다.
 *
 * 상대 import에 `.js`를 붙이는 건 오타가 아니다 — Vercel은 이 파일들을 번들하지 않고
 * 하나씩 트랜스파일해 Node ESM으로 돌리므로, 확장자가 없으면 런타임에
 * `ERR_MODULE_NOT_FOUND`가 난다(TS와 Vite는 `.js`를 `.ts`로 해석해 준다).
 *
 * 인자가 Web `Request`가 아니라 Node의 `IncomingMessage`인 것도 같은 이유다 —
 * Vercel의 Node 런타임이 그렇게 넘긴다. 변환은 `_lib/node-adapter.ts`가 맡는다.
 */
import { handleChat } from "./_lib/handler.js";
import { sendWebResponse, toWebRequest } from "./_lib/node-adapter.js";

import type { IncomingMessage, ServerResponse } from "node:http";

/**
 * Node 런타임은 응답을 기본적으로 모았다가 한 번에 보낸다. 답이 흘러나오게 하려면
 * 스트리밍을 켜야 하고, 실행 시간도 기본값(10초)으로는 모델이 말을 마치기 전에 끊긴다.
 */
export const config = {
    runtime: "nodejs",
    supportsResponseStreaming: true,
};

export default async function handler(req: IncomingMessage, res: ServerResponse) {
    const response = await handleChat(toWebRequest(req));
    await sendWebResponse(res, response);
}

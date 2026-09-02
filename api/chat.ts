/**
 * Vercel 서버리스 함수 진입점. 로직은 `_lib/handler.ts`에 있고,
 * 개발 서버(Vite 미들웨어)도 같은 함수를 태운다.
 * `api/` 안에서 `_`로 시작하는 파일은 Vercel이 라우트로 만들지 않는다.
 *
 * 상대 import에 `.js`를 붙이는 건 오타가 아니다 — Vercel은 이 파일들을 번들하지 않고
 * 하나씩 트랜스파일해 Node ESM으로 돌리므로, 확장자가 없으면 런타임에
 * `ERR_MODULE_NOT_FOUND`가 난다(TS와 Vite는 `.js`를 `.ts`로 해석해 준다).
 */
export { handleChat as default } from "./_lib/handler.js";

/**
 * Vercel 서버리스 함수 진입점. 로직은 `_lib/handler.ts`에 있고,
 * 개발 서버(Vite 미들웨어)도 같은 함수를 태운다.
 * `api/` 안에서 `_`로 시작하는 파일은 Vercel이 라우트로 만들지 않는다.
 */
export { handleChat as default } from "./_lib/handler";

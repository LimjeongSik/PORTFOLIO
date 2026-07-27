import { useEffect, useState } from "react";

/**
 * CSS 미디어쿼리 결과를 구독한다.
 * 레이아웃은 Tailwind 브레이크포인트로 처리하고, 이 훅은 CSS로 표현할 수 없는
 * 분기(모션 variants 전환 등)에만 사용한다.
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

    useEffect(() => {
        const list = window.matchMedia(query);
        const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);

        // 구독 이전에 값이 바뀌었을 수 있으므로 한 번 맞춰준다.
        setMatches(list.matches);
        list.addEventListener("change", onChange);

        return () => list.removeEventListener("change", onChange);
    }, [query]);

    return matches;
}

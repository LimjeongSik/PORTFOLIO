import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

import { scrollToSection } from "@/lib/scroll";

const STORE = "scroll-positions";

function load(): Record<string, number> {
    try {
        return JSON.parse(sessionStorage.getItem(STORE) ?? "{}");
    } catch {
        return {};
    }
}

function save(positions: Record<string, number>) {
    try {
        sessionStorage.setItem(STORE, JSON.stringify(positions));
    } catch {
        // 저장이 막힌 브라우저에서는 이번 탭 안에서만 기억한다.
    }
}

/** 해시는 주소창에서 누구나 적을 수 있다 — `/#%`처럼 깨진 이스케이프면 원문 그대로 쓴다. */
function decodeHash(raw: string) {
    try {
        return decodeURIComponent(raw);
    } catch {
        return raw;
    }
}

function jump(top: number) {
    window.scrollTo({ top, behavior: "instant" });
}

/**
 * 라우트가 바뀔 때의 스크롤.
 *
 * - 뒤로·앞으로 가기(POP)는 그 히스토리 항목에서 보던 자리로 돌아간다.
 * - 해시가 있으면 그 구간으로 간다(`/#projects`). 같은 해시를 다시 눌러도 `key`가 바뀌므로 다시 간다.
 * - 새 페이지로 들어가면 맨 위에서 시작한다.
 *
 * 복원을 브라우저에 맡기지 않는다(`scrollRestoration = "manual"`). 브라우저는 popstate 순간 —
 * 아직 **이전 페이지가 그려져 있을 때** — 위치를 되돌리므로, 긴 상세에서 홈으로 돌아오면
 * 그 값이 홈 높이에 잘려 맨 아래로 떨어졌다(사용자 지적). 여기서는 항목(`key`)마다 위치를
 * 적어 두고, 새 화면이 커밋된 뒤에 되돌린다.
 */
export function ScrollManager() {
    const { pathname, hash, key } = useLocation();
    const navigationType = useNavigationType();
    const positions = useRef<Record<string, number>>(load());
    // 새로 연 탭의 첫 항목은 key가 늘 "default"라 주소(해시 포함)와 함께 적는다. 해시를 빼면
    // `/`에서 스크롤해 둔 위치가 새로 연 `/#projects`를 덮어 그 구간으로 가지 않는다.
    const entry = `${pathname}${hash}@${key}`;
    const currentKey = useRef(entry);

    useEffect(() => {
        const previous = window.history.scrollRestoration;
        window.history.scrollRestoration = "manual";
        return () => {
            window.history.scrollRestoration = previous;
        };
    }, []);

    // 보고 있는 항목의 위치를 계속 적어 둔다. 항목과 위치는 이벤트가 난 그 순간에 붙잡는다 —
    // 다음 프레임에 읽으면 그 사이에 이동이 일어났을 때 앞 페이지의 위치가 새 항목에 적힌다.
    // 라우트가 바뀌며 높이가 잘려 생기는 스크롤 이벤트는 다음 프레임에 오므로, 그때는
    // `currentKey`가 이미 새 항목을 가리킨다. 저장소에 쓰는 일만 프레임당 한 번으로 묶는다.
    useEffect(() => {
        let frame = 0;
        const record = () => {
            positions.current[currentKey.current] = window.scrollY;
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => save(positions.current));
        };
        window.addEventListener("scroll", record, { passive: true });
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("scroll", record);
        };
    }, []);

    useLayoutEffect(() => {
        currentKey.current = entry;
        let frame = 0;

        const saved = positions.current[entry];
        if (navigationType === "POP" && saved !== undefined) {
            // 이미지가 늦게 자리를 잡아 아직 그만큼 길지 않으면 몇 프레임 더 시도한다.
            let tries = 0;
            const restore = () => {
                jump(saved);
                if (Math.abs(window.scrollY - saved) > 2 && tries++ < 60) {
                    frame = requestAnimationFrame(restore);
                }
            };
            restore();
        } else if (hash) {
            const id = decodeHash(hash.slice(1));
            frame = requestAnimationFrame(() => scrollToSection(id));
        } else {
            jump(0);
        }

        return () => cancelAnimationFrame(frame);
    }, [entry, hash, navigationType]);

    return null;
}

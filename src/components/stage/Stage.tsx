import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import {
    buildDrum,
    buildGallery,
    buildHall,
    buildMonolith,
    buildStair,
    galleryStation,
    HOME_PATH,
    HOME_ZONES,
} from "@/components/home/stage/world";
import {
    buildDetailWorld,
    DETAIL_ZONES,
    detailOrigin,
    detailPath,
} from "@/components/project/stage/world";
import { buildDust } from "@/components/stage/pieces";
import { mountStage } from "@/components/stage/rig";

import { projects } from "@/data/projects";
import { BASE_MOOD } from "@/lib/atmosphere";
import { setStageHandle } from "@/lib/stage";

import type { StageHandle, World } from "@/components/stage/rig";

/**
 * 이 사이트의 유일한 3D 무대.
 *
 * **라우터 바깥**(`App`)에 산다. 홈과 상세가 각자의 캔버스를 들면 페이지를 넘길 때마다
 * 우주가 한 번 꺼졌다 켜지는데, 여기서 넘어가는 것은 지면이 아니라 **시점**이어야 하기
 * 때문이다(사용자 지시, 2026-09-08). 캔버스 하나가 계속 돌고, 라우트가 갈리면 카메라가
 * 그 자리로 날아간다(`lib/stage`의 hold/release).
 *
 * 홈의 다섯 장소는 늘 지어 두고, 상세의 여섯 장소는 **열려 있는 프로젝트의 것만** 짓는다.
 * 그 세계는 홈 갤러리에서 그 프로젝트가 서 있던 자리에 통째로 겹쳐 놓이므로, 목록에서
 * 눌러 들어가는 비행이 몇 걸음으로 끝난다. 겹쳐 있어도 뒤섞이지 않는 것은 `data-stage-zone`이
 * DOM에 없는 구간을 타임라인이 통째로 버리기 때문이다.
 */
export default function Stage() {
    const hostRef = useRef<HTMLDivElement>(null);
    const handleRef = useRef<StageHandle | null>(null);
    const { pathname } = useLocation();
    const pathRef = useRef(pathname);
    pathRef.current = pathname;

    /** 이 주소에서 살아 있어야 할 상세 세계. 홈이면 없다. */
    const detailFor = useCallback((path: string): World | null => {
        const slug = path.startsWith("/projects/") ? path.slice("/projects/".length) : "";
        const index = projects.findIndex((project) => project.slug === slug);
        const project = projects[index];
        if (!project) {
            return null;
        }
        // 갤러리에서 보던 축 그대로, 고리보다 한참 안쪽에 세운다 — 들어가는 것이 전진이 되게.
        const origin = detailOrigin(galleryStation(index));
        return {
            mood: project.theme,
            build: (ctx) => buildDetailWorld(ctx, project, origin),
            extras: (ctx) => [buildDust(ctx, detailPath(origin), 520)],
        };
    }, []);

    useEffect(() => {
        const host = hostRef.current;
        if (!host) {
            return;
        }
        const handle = mountStage({
            host,
            detailZones: DETAIL_ZONES,
            home: {
                zones: HOME_ZONES,
                mood: BASE_MOOD,
                build: (ctx) => [
                    buildHall(ctx),
                    buildMonolith(ctx),
                    buildDrum(ctx),
                    buildStair(ctx),
                    buildGallery(ctx),
                ],
                extras: (ctx) => [buildDust(ctx, HOME_PATH)],
            },
        });
        // WebGL을 못 얻은 환경에서는 아예 등록하지 않는다 — 전환이 없는 비행을 기다리지
        // 않도록, "무대가 있다"는 신호는 실제로 그리는 무대에만 준다.
        if (!handle) {
            return;
        }
        handleRef.current = handle;
        setStageHandle(handle);
        /* 주소로 상세를 바로 열면 무대(three 청크)가 늦게 붙는다 — 아래 레이아웃 이펙트는
           그때 손잡이가 없어 그냥 지나갔으므로, 여기서 지금 주소의 세계를 한 번 세운다. */
        handle.setDetail(detailFor(pathRef.current));
        return () => {
            setStageHandle(null);
            handleRef.current = null;
            handle.dispose();
        };
    }, [detailFor]);

    /**
     * 열려 있는 프로젝트의 장소를 갈아 끼운다. 홈으로 돌아오면 걷어낸다 — 상세 세계는
     * 홈 갤러리와 같은 자리에 겹쳐 있어서, 남겨 두면 갤러리 안에 회랑이 박힌다.
     *
     * **레이아웃 이펙트**여야 한다. 라우트가 갈리는 그 프레임 안에서 세계까지 교대해야,
     * 카메라가 아직 붙들려 있는 동안(`hold`) 한 번에 갈아 끼워진 화면이 그려진다. 평범한
     * 이펙트로 두면 그 사이 두어 프레임 동안 **어느 세계도 없는** 화면이 지나간다.
     */
    useLayoutEffect(() => {
        handleRef.current?.setDetail(detailFor(pathname));
    }, [pathname, detailFor]);

    return (
        <div ref={hostRef} aria-hidden className="pointer-events-none fixed inset-0 z-0 bg-paper" />
    );
}

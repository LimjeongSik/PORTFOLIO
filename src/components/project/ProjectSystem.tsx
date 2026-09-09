import { Reveal } from "@/components/ui/Reveal";

import { LABEL, LEDE, NOTE, SHOWCASE, TITLE } from "@/lib/typography";

import type { ReactNode } from "react";

interface ProjectSystemProps {
    /** 구간 이름표 — 이 프로젝트가 무엇을 눌러 보게 하는가 */
    label: string;
    title: string;
    lede: string;
    /** 아래에 한 줄로 붙는 각주 */
    note?: string;
    children: ReactNode;
    /** 이 구간이 무대의 `system` 자리를 여는가. 한 지면에 둘 이상 있으면 첫 것만 연다. */
    zone?: boolean;
}

/**
 * 구조를 눌러 보는 구간의 껍데기.
 *
 * 안에 들어가는 그림은 프로젝트마다 다르다 — SafeOps는 좌표 한 건이 지나는 관문,
 * 침례교는 부팅과 Provider 중첩, 아이머그는 열쇠 넷의 시계와 웹↔앱 통로. **그 그림이
 * 프로젝트의 값어치**이므로 하나로 합치지 않는다. 대신 머리글·폭·줄간·각주는 여기서
 * 한 번만 정해, 어느 프로젝트를 열어도 같은 지면으로 읽히게 한다.
 */
export function ProjectSystem({ label, title, lede, note, children, zone }: ProjectSystemProps) {
    return (
        <section
            data-stage-zone={zone ? "system" : undefined}
            /* 무대의 자리를 여는 구간에만 여유를 준다 — 카메라가 아치를 통과할 스크롤이다. */
            className={`relative py-24 sm:py-32 ${zone ? "flex min-h-[160svh] flex-col justify-center" : ""}`}
        >
            <div className={SHOWCASE}>
                <Reveal>
                    <header className="max-w-[36rem]">
                        <h2 className={LABEL}>{label}</h2>
                        <p className={`mt-5 ${TITLE}`}>{title}</p>
                        <p className={`mt-5 ${LEDE}`}>{lede}</p>
                    </header>
                </Reveal>

                <div className="mt-14">{children}</div>

                {note ? (
                    <p className={`mt-12 border-t border-line pt-6 ${NOTE} max-w-[42rem]`}>
                        {note}
                    </p>
                ) : null}
            </div>
        </section>
    );
}

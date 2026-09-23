import { CONTAINER, RAIL } from "@/lib/typography";

import type { ReactNode } from "react";

interface SectionProps {
    id: string;
    title: string;
    children: ReactNode;
}

/**
 * 홈과 상세가 같이 쓰는 한 구간. 넓은 화면에서는 이름이 왼쪽 레일에 붙어 서고
 * 내용은 오른쪽 기둥을 따라 흐른다 — 이력서처럼 훑어 내려가며 읽히게 하려는 것이다.
 */
export function Section({ id, title, children }: SectionProps) {
    const headingId = `${id}-title`;

    return (
        <section id={id} aria-labelledby={headingId} className="border-line border-t">
            <div
                className={`${CONTAINER} grid gap-8 py-16 sm:py-24 lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-16`}
            >
                <h2 id={headingId} className={`${RAIL} self-start lg:sticky lg:top-24`}>
                    {title}
                </h2>
                <div className="min-w-0">{children}</div>
            </div>
        </section>
    );
}

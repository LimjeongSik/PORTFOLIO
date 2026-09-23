import { BODY, HEADING, MEASURE, SMALL } from "@/lib/typography";

import type { ReactNode } from "react";

interface FigureProps {
    title: string;
    lede: string;
    note?: string;
    children: ReactNode;
}

/** 프로젝트마다의 설명 그림 한 장 — 제목, 한 문단, 그림, 각주. */
export function Figure({ title, lede, note, children }: FigureProps) {
    return (
        <article>
            <h3 className={`${HEADING} ${MEASURE}`}>{title}</h3>
            <p className={`mt-4 ${MEASURE} ${BODY}`}>{lede}</p>
            <div className="mt-10">{children}</div>
            {note ? <p className={`mt-8 ${MEASURE} ${SMALL}`}>{note}</p> : null}
        </article>
    );
}

/** 그림 안에서 고르는 버튼(예시 · 건수). 고른 것만 잉크로 채운다. */
export function Choice({
    on,
    onClick,
    children,
}: {
    on: boolean;
    onClick: () => void;
    children: ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={on}
            className={`rounded-full border px-4 py-1.5 text-[0.875rem] tabular-nums transition-colors ${
                on
                    ? "border-ink bg-ink text-paper"
                    : "border-line text-ink/80 hover:border-ink/40 hover:text-ink"
            }`}
        >
            {children}
        </button>
    );
}

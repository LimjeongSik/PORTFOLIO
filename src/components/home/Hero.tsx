import { Link } from "react-router-dom";

import { TextLink } from "@/components/ui/TextLink";

import { experiences } from "@/data/experience";
import { profile } from "@/data/profile";
import { shortCompany, withRo } from "@/lib/text";
import { CONTAINER, DISPLAY, LEAD, MEASURE } from "@/lib/typography";

import type { CSSProperties } from "react";

/** 등장 순서. `.rise`가 이 값만큼 늦게 떠오른다(`styles/index.css`). */
const order = (i: number) => ({ "--i": i }) as CSSProperties;

export function Hero() {
    // 쉼표에서 줄을 나눠 문장의 호흡대로 끊는다.
    const lines = profile.tagline.split(/(?<=,)\s+/);
    const current = experiences[0];

    return (
        <section aria-label="소개" className={`${CONTAINER} pt-20 pb-20 sm:pt-32 sm:pb-28`}>
            <p className="rise text-[1rem] font-medium text-muted" style={order(0)}>
                {profile.role} {profile.name}
            </p>
            <h1 className={`mt-5 ${DISPLAY}`}>
                {lines.map((line, index) => (
                    <span key={line} className="rise block" style={order(index + 1)}>
                        {line}
                    </span>
                ))}
            </h1>
            {current ? (
                <p className={`rise mt-8 ${MEASURE} ${LEAD}`} style={order(lines.length + 1)}>
                    지금은 {shortCompany(current.company)}에서 {withRo(current.position)} 일하고
                    있습니다.
                </p>
            ) : null}
            <div
                className="rise mt-10 flex flex-wrap gap-x-7 gap-y-3 text-[1rem] font-medium text-ink"
                style={order(lines.length + 2)}
            >
                <Link
                    to="/#projects"
                    className="underline decoration-ink/25 decoration-1 underline-offset-[0.3em] transition-colors hover:decoration-current"
                >
                    프로젝트 보기
                </Link>
                <TextLink href={`mailto:${profile.email}`}>메일 보내기</TextLink>
            </div>
        </section>
    );
}

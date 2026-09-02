import { useState } from "react";
import { Link } from "react-router-dom";

import { experiences } from "@/data/experience";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";
import { closeAssistant } from "@/lib/assistant/bridge";

import type { ReactNode } from "react";

/** 채팅 폭(약 22rem)에 맞춘 공통 판. 지면 토큰을 그대로 쓰므로 프로젝트 테마를 따라간다. */
function Panel({ children }: { children: ReactNode }) {
    return (
        <div className="mt-2 flex flex-col gap-2 rounded-2xl border border-line bg-paper/60 p-3">
            {children}
        </div>
    );
}

function PanelLabel({ children }: { children: ReactNode }) {
    return (
        <p className="font-mono text-[0.625rem] tracking-[0.18em] text-muted uppercase">
            {children}
        </p>
    );
}

export function ProjectCards({ slugs }: { slugs: string[] }) {
    const picked = slugs
        .map((slug) => projects.find((project) => project.slug === slug))
        .filter((project): project is (typeof projects)[number] => project !== undefined);

    if (picked.length === 0) return null;

    return (
        <Panel>
            <PanelLabel>projects</PanelLabel>
            <ul className="flex flex-col gap-1.5">
                {picked.map((project) => (
                    <li key={project.slug}>
                        <Link
                            to={`/projects/${project.slug}`}
                            onClick={closeAssistant}
                            className="flex items-center gap-3 rounded-xl border border-line/70 bg-surface/60 p-2 transition-colors hover:border-espresso/40"
                        >
                            <img
                                src={project.icon ?? project.thumbnail}
                                alt=""
                                className="h-10 w-10 shrink-0 rounded-lg object-cover"
                            />
                            <span className="min-w-0">
                                <span className="block truncate font-display text-sm font-semibold text-ink">
                                    {project.title}
                                </span>
                                <span className="block truncate text-xs text-muted">
                                    {project.tech.slice(0, 3).join(" · ")}
                                </span>
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </Panel>
    );
}

export function SkillCard() {
    return (
        <Panel>
            <PanelLabel>skills</PanelLabel>
            <dl className="flex flex-col gap-2">
                {skillGroups.map((group) => (
                    <div key={group.label}>
                        <dt className="font-mono text-[0.6875rem] text-espresso">{group.label}</dt>
                        <dd className="text-xs leading-relaxed text-ink">
                            {group.items.join(", ")}
                        </dd>
                    </div>
                ))}
            </dl>
        </Panel>
    );
}

export function ExperienceCard() {
    return (
        <Panel>
            <PanelLabel>experience</PanelLabel>
            <ol className="flex flex-col gap-2">
                {experiences.map((item) => (
                    <li
                        key={`${item.company}-${item.period}`}
                        className="border-line border-l pl-3"
                    >
                        <p className="font-display text-sm font-semibold text-ink">
                            {item.company}
                        </p>
                        <p className="text-xs text-muted">
                            {item.position} · <span className="tabular-nums">{item.period}</span>
                        </p>
                    </li>
                ))}
            </ol>
        </Panel>
    );
}

export function ProfileCard() {
    return (
        <Panel>
            <div className="flex items-center gap-3">
                <img src={profile.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
                <div className="min-w-0">
                    <p className="font-display text-sm font-semibold text-ink">{profile.name}</p>
                    <p className="text-xs text-muted">{profile.role}</p>
                </div>
            </div>
            <dl className="flex flex-col gap-1 font-mono text-[0.6875rem] text-muted">
                <div className="flex gap-2">
                    <dt className="w-12 shrink-0 text-espresso">email</dt>
                    <dd className="truncate text-ink">{profile.email}</dd>
                </div>
                <div className="flex gap-2">
                    <dt className="w-12 shrink-0 text-espresso">phone</dt>
                    <dd className="tabular-nums text-ink">{profile.phone}</dd>
                </div>
                <div className="flex gap-2">
                    <dt className="w-12 shrink-0 text-espresso">based</dt>
                    <dd className="text-ink">{profile.location}</dd>
                </div>
            </dl>
        </Panel>
    );
}

/**
 * 연락처는 값을 보여주고 복사는 버튼에 맡긴다.
 *
 * 모델이 툴을 부르는 시점에는 사용자의 클릭·입력에서 이미 시간이 지나 있어
 * (transient activation이 없어) `clipboard.writeText`가 거부되거나, 문서에 포커스가
 * 없으면 아예 응답하지 않고 매달린다. 버튼을 누르는 순간에는 그 자격이 있다.
 */
export function ContactNote({ label, value }: { label: string; value: string }) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // 복사가 막힌 브라우저에서도 값은 화면에 그대로 있다.
        }
    };

    return (
        <div className="mt-2 flex items-center gap-2 rounded-2xl border border-line bg-paper/60 px-3 py-2">
            <span className="font-mono text-[0.625rem] tracking-[0.16em] text-muted uppercase">
                {label}
            </span>
            <span className="min-w-0 flex-1 truncate font-mono text-xs text-ink">{value}</span>
            <button
                type="button"
                onClick={copy}
                className="shrink-0 rounded-full border border-line px-2.5 py-1 font-mono text-[0.625rem] text-espresso transition-colors hover:border-espresso/50"
            >
                {copied ? "복사됨" : "복사"}
            </button>
        </div>
    );
}

/** 화면을 움직인 툴은 카드 대신 한 줄 흔적만 남긴다. */
export function ActionNote({ children }: { children: ReactNode }) {
    return (
        <p className="mt-1.5 flex items-center gap-1.5 font-mono text-[0.6875rem] text-muted">
            <span aria-hidden className="inline-block h-1 w-1 rounded-full bg-espresso" />
            {children}
        </p>
    );
}

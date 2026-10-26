import { Figure } from "@/components/project/Figure";

import { BODY, SMALL } from "@/lib/typography";

import type { ProjectRebuild, ProjectRebuildVersion } from "@/types/content";

function Version({ version }: { version: ProjectRebuildVersion }) {
    return (
        <div className="rounded-xl bg-surface px-5 py-5">
            <p className="text-[1.0625rem] font-bold text-ink">{version.label}</p>
            <p className="mt-0.5 text-[0.875rem] text-muted tabular-nums">{version.period}</p>
            <dl className="mt-4 flex flex-col gap-2">
                {(
                    [
                        ["팀", version.team],
                        ["기술", version.stack],
                        ["현장", version.status],
                    ] as const
                ).map(([label, value]) => (
                    <div key={label} className="grid grid-cols-[2.5rem_minmax(0,1fr)]">
                        <dt className="text-[0.875rem] leading-[1.75] text-muted">{label}</dt>
                        <dd className={SMALL}>{value}</dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}

/** 운영해 본 판과 다시 만든 판. 현장에서 겪은 문제마다 새 판에서 바꾼 자리를 짝지어 둔다. */
export function Rebuild({ rebuild }: { rebuild: ProjectRebuild }) {
    const [before, after] = rebuild.versions;
    return (
        <Figure title={rebuild.title} lede={rebuild.lede} note={rebuild.note}>
            <div className="grid gap-4 md:grid-cols-2">
                <Version version={before} />
                <Version version={after} />
            </div>

            <ul className="mt-12 flex flex-col">
                {rebuild.items.map((item) => (
                    <li
                        key={item.seen}
                        className="border-line grid gap-x-10 gap-y-3 border-t py-7 md:grid-cols-2"
                    >
                        <div>
                            <p className="text-[0.8125rem] text-muted">{before.label}, 현장에서</p>
                            <p className="mt-1 text-[1.0625rem] leading-[1.6] font-bold text-ink">
                                {item.seen}
                            </p>
                        </div>
                        <div>
                            <p className="text-[0.8125rem] text-muted">{after.label}에서</p>
                            <p className={`mt-1 ${BODY}`}>{item.changed}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </Figure>
    );
}

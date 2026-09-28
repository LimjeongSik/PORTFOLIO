import { SMALL } from "@/lib/typography";

import type { ProjectCodeChange } from "@/types/content";

function Pane({ label, code, faded }: { label: string; code: string; faded?: boolean }) {
    return (
        <div className="min-w-0">
            <p className="text-[0.8125rem] font-bold text-muted">{label}</p>
            <pre
                className={`mt-1.5 overflow-x-auto rounded-lg px-4 py-3 font-mono text-[0.8125rem] leading-[1.7] ${
                    faded ? "bg-surface text-ink/70" : "bg-surface text-ink ring-1 ring-ink/15"
                }`}
            >
                <code>{code}</code>
            </pre>
        </div>
    );
}

/** 사례 하나의 코드 근거. 전 · 후를 위아래로 놓아 같은 자리가 어떻게 바뀌었는지 읽게 한다. */
export function CodeChange({ change }: { change: ProjectCodeChange }) {
    return (
        <figure className="min-w-0">
            <figcaption className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                <span className="font-mono text-[0.8125rem] break-all text-ink">{change.file}</span>
                {change.commit ? (
                    <span className="font-mono text-[0.75rem] text-muted">{change.commit}</span>
                ) : null}
            </figcaption>
            <div className="mt-3 flex flex-col gap-3">
                {change.before === undefined ? (
                    <Pane label="추가" code={change.after} />
                ) : (
                    <>
                        <Pane label="전" code={change.before} faded />
                        <Pane label="후" code={change.after} />
                    </>
                )}
            </div>
            <p className={`mt-3 ${SMALL}`}>{change.note}</p>
        </figure>
    );
}

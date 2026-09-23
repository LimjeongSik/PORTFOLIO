import { Figure } from "@/components/project/Figure";

import { BODY, MEASURE, SMALL } from "@/lib/typography";

import type { ProjectPipeline, ProjectPipelineVerdict } from "@/types/content";

const VERDICT: Record<ProjectPipelineVerdict, string> = {
    pass: "통과",
    drop: "버림",
    skip: "미도달",
};

const CHIP: Record<ProjectPipelineVerdict, string> = {
    pass: "border-line text-ink",
    drop: "border-ink bg-ink text-paper",
    skip: "border-dashed border-line text-muted",
};

/** 좌표 하나가 지나는 관문과, 흔한 상황마다 어디서 걸리는지. */
export function Pipeline({ pipeline }: { pipeline: ProjectPipeline }) {
    return (
        <Figure title={pipeline.title} lede={pipeline.lede} note={pipeline.note}>
            <ol className="grid gap-x-10 gap-y-6 md:grid-cols-2">
                {pipeline.stages.map((stage, index) => (
                    <li key={stage.name} className="grid grid-cols-[1.75rem_minmax(0,1fr)]">
                        <span className="text-[0.875rem] leading-[1.9] text-muted tabular-nums">
                            {index + 1}
                        </span>
                        <div>
                            <p className="text-[1rem] font-bold text-ink">{stage.name}</p>
                            <p className={`mt-1 ${SMALL}`}>{stage.detail}</p>
                        </div>
                    </li>
                ))}
            </ol>

            <ul className="mt-12 flex flex-col">
                {pipeline.cases.map((item) => (
                    <li key={item.label} className="border-line border-t py-7">
                        <p className="text-[1.0625rem] font-bold text-ink">{item.label}</p>
                        <p className={`mt-1 ${MEASURE} ${SMALL}`}>{item.hint}</p>
                        <ol className="mt-4 flex flex-wrap gap-1.5" aria-label="관문별 판정">
                            {pipeline.stages.map((stage, index) => {
                                const verdict = item.verdicts[index] ?? "skip";
                                return (
                                    <li
                                        key={stage.name}
                                        className={`rounded-full border px-3 py-1 text-[0.8125rem] ${CHIP[verdict]}`}
                                    >
                                        {stage.name} {VERDICT[verdict]}
                                    </li>
                                );
                            })}
                        </ol>
                        <p className={`mt-4 ${MEASURE} ${BODY}`}>{item.outcome}</p>
                    </li>
                ))}
            </ul>
        </Figure>
    );
}

import { Figure } from "@/components/project/Figure";

import { SMALL } from "@/lib/typography";

import type { ProjectRuntimeMap, ProjectRuntimeNode } from "@/types/content";

function Caution({ node }: { node: ProjectRuntimeNode }) {
    if (!node.caution) {
        return null;
    }
    return (
        <p className="mt-3 rounded-lg bg-surface px-4 py-3 text-[0.9375rem] leading-[1.75] text-ink">
            <strong className="mr-1.5 font-bold">주의</strong>
            {node.caution}
        </p>
    );
}

/** 들여쓰기 한 칸. 좁은 화면에서는 여덟 겹이 본문 폭을 다 먹지 않게 줄인다. */
const indent = (depth: number) => ({ marginLeft: `min(${depth * 0.875}rem, ${depth * 2}vw)` });

/** 앱이 뜨는 순서와 Provider의 중첩. 자리를 바꾸면 조용히 깨지는 곳에 주의를 단다. */
export function Runtime({ runtime }: { runtime: ProjectRuntimeMap }) {
    return (
        <Figure title={runtime.title} lede={runtime.lede} note={runtime.note}>
            <div className="grid gap-14 lg:grid-cols-2 lg:gap-12">
                <div>
                    <p className="text-[0.9375rem] font-bold text-ink">부팅 순서</p>
                    <ol className="mt-5 flex flex-col gap-6">
                        {runtime.boot.map((node, index) => (
                            <li key={node.name} className="grid grid-cols-[1.75rem_minmax(0,1fr)]">
                                <span className="text-[0.875rem] leading-[1.9] text-muted tabular-nums">
                                    {index + 1}
                                </span>
                                <div>
                                    <p className="font-mono text-[0.875rem] leading-[1.9] font-medium text-ink">
                                        {node.name}
                                    </p>
                                    <p className={`mt-1 ${SMALL}`}>{node.role}</p>
                                    <Caution node={node} />
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>

                <div>
                    <p className="text-[0.9375rem] font-bold text-ink">Provider 중첩, 바깥부터</p>
                    <ol className="mt-5 flex flex-col">
                        {runtime.tree.map((node, depth) => (
                            <li
                                key={node.name}
                                className="border-line border-l py-3 pl-4"
                                style={indent(depth)}
                            >
                                <p className="font-mono text-[0.875rem] leading-[1.9] font-medium text-ink">
                                    {node.name}
                                </p>
                                <p className={`mt-0.5 ${SMALL}`}>{node.role}</p>
                                <Caution node={node} />
                            </li>
                        ))}
                        <li
                            className="border-ink border-l-2 py-3 pl-4 font-mono text-[0.875rem] font-medium text-ink"
                            style={indent(runtime.tree.length)}
                        >
                            {runtime.payload}
                        </li>
                    </ol>
                </div>
            </div>
        </Figure>
    );
}

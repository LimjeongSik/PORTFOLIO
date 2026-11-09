import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";

import { aiLede, aiTools } from "@/data/ai";
import { BODY, DASH, HEADING, MEASURE, META, SMALL } from "@/lib/typography";

/** 이름 | 내용 두 칸 — 경력 목록과 같은 축이라 홈을 훑어 내려갈 때 줄이 맞는다. */
const ROW = "grid gap-x-10 gap-y-3 sm:grid-cols-[9.5rem_minmax(0,1fr)]";

export function AiUsage() {
    return (
        <Section id="ai" title="AI 활용">
            <p className={`${MEASURE} ${BODY}`}>{aiLede}</p>
            <ol className="mt-12 flex flex-col">
                {aiTools.map((tool) => (
                    <li
                        key={tool.name}
                        className={`${ROW} border-line border-t py-10 first:border-t-0 first:pt-0`}
                    >
                        <p className={`${META} sm:pt-1.5`}>{tool.status}</p>
                        <div className={MEASURE}>
                            <h3 className={HEADING}>{tool.name}</h3>
                            <p className={`mt-1 ${META}`}>{tool.kind}</p>
                            <p className={`mt-5 ${BODY}`}>{tool.summary}</p>
                            <p className={`mt-3 ${BODY}`}>{tool.usage}</p>
                            <ul className="mt-5 flex flex-col gap-2.5">
                                {tool.points.map((line) => (
                                    <li key={line} className={`${DASH} ${SMALL}`}>
                                        {line}
                                    </li>
                                ))}
                            </ul>
                            {tool.repo ? (
                                <p className="mt-5">
                                    <TextLink
                                        href={tool.repo}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={META}
                                    >
                                        {tool.repo.replace(/^https?:\/\//, "")}
                                    </TextLink>
                                </p>
                            ) : null}
                        </div>
                    </li>
                ))}
            </ol>
        </Section>
    );
}

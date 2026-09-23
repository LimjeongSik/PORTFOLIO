import { Section } from "@/components/ui/Section";

import { activities } from "@/data/activities";
import { experiences } from "@/data/experience";
import { BODY, DASH, HEADING, MEASURE, META, SMALL } from "@/lib/typography";

/** 기간 | 내용 두 칸. 시간순이 곧 이 목록의 구조라 날짜가 왼쪽에 선다. */
const ROW = "grid gap-x-10 gap-y-3 sm:grid-cols-[9.5rem_minmax(0,1fr)]";

export function Experience() {
    return (
        <Section id="experience" title="경력">
            <ol className="flex flex-col">
                {experiences.map((item) => (
                    <li
                        key={`${item.company}-${item.period}`}
                        className={`${ROW} border-line border-t py-10 first:border-t-0 first:pt-0`}
                    >
                        <p className={`${META} sm:pt-1.5`}>{item.period}</p>
                        <div className={MEASURE}>
                            <h3 className={HEADING}>{item.company}</h3>
                            <p className={`mt-1 ${META}`}>{item.position}</p>
                            <p className={`mt-5 ${BODY}`}>{item.summary}</p>
                            <ul className="mt-5 flex flex-col gap-2.5">
                                {item.achievements.map((line) => (
                                    <li key={line} className={`${DASH} ${SMALL}`}>
                                        {line}
                                    </li>
                                ))}
                            </ul>
                            <p className={`mt-5 ${META}`}>{item.stack.join(", ")}</p>
                        </div>
                    </li>
                ))}
            </ol>

            {activities.length > 0 ? (
                <div className="mt-6 border-line border-t pt-10">
                    <h3 className="text-[0.9375rem] font-bold text-ink">활동</h3>
                    <ul className="mt-8 flex flex-col gap-10">
                        {activities.map((item) => (
                            <li key={`${item.title}-${item.period}`} className={ROW}>
                                <p className={`${META} sm:pt-1`}>{item.period}</p>
                                <div className={MEASURE}>
                                    <p className="text-[1.0625rem] font-bold text-ink">
                                        {item.title}
                                    </p>
                                    <p className={`mt-1 ${META}`}>{item.host}</p>
                                    <p className={`mt-4 ${BODY}`}>{item.note}</p>
                                    {item.takeaways?.length ? (
                                        <ul className="mt-4 flex flex-col gap-2.5">
                                            {item.takeaways.map((line) => (
                                                <li key={line} className={`${DASH} ${SMALL}`}>
                                                    {line}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : null}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : null}
        </Section>
    );
}

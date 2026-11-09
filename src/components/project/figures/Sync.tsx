import { Figure } from "@/components/project/Figure";

import { BODY, MEASURE, SMALL } from "@/lib/typography";

import type { ProjectSync } from "@/types/content";

/** 상황마다 서버가 알리는 것과 화면이 하는 것을 나란히 둔다. */
export function Sync({ sync }: { sync: ProjectSync }) {
    return (
        <Figure title={sync.title} lede={sync.lede} note={sync.note}>
            <ul className="flex flex-col">
                {sync.events.map((event) => (
                    <li key={event.label} className="border-line border-t py-7 first:border-t-0">
                        <p className="text-[1.0625rem] font-bold text-ink">{event.label}</p>
                        <p className={`mt-1 ${MEASURE} ${SMALL}`}>{event.hint}</p>
                        <dl className="mt-5 grid gap-x-10 gap-y-5 md:grid-cols-2">
                            <div>
                                <dt className="text-[0.8125rem] font-bold text-muted">서버</dt>
                                <dd className={`mt-1 ${BODY}`}>{event.server}</dd>
                            </div>
                            <div>
                                <dt className="text-[0.8125rem] font-bold text-muted">화면</dt>
                                <dd className={`mt-1 ${BODY}`}>{event.client}</dd>
                            </div>
                        </dl>
                    </li>
                ))}
            </ul>
        </Figure>
    );
}

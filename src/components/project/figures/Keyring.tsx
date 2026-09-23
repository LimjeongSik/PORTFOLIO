import { Figure } from "@/components/project/Figure";

import { SMALL } from "@/lib/typography";

import type { ProjectKey, ProjectKeyring } from "@/types/content";

function renewal(key: ProjectKey) {
    return key.renewAt > 0
        ? `남은 시간이 ${key.renewAt}초 아래로 떨어질 때`
        : "스스로 갱신하지 않음";
}

/** 여는 곳이 다른 열쇠 넷 — 무엇을 열고, 언제 어디서 새로 받는지. */
export function Keyring({ keyring }: { keyring: ProjectKeyring }) {
    return (
        <Figure title={keyring.title} lede={keyring.lede} note={keyring.note}>
            <ul className="flex flex-col">
                {keyring.keys.map((key) => (
                    <li
                        key={key.name}
                        className="grid gap-x-10 gap-y-4 border-line border-t py-7 md:grid-cols-[14rem_minmax(0,1fr)]"
                    >
                        <div>
                            <p className="text-[1.0625rem] font-bold text-ink">{key.name}</p>
                            <p className="mt-1 font-mono text-[0.8125rem] break-all text-muted">
                                {key.header}
                            </p>
                        </div>
                        <div>
                            <dl className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-4 gap-y-1.5 text-[0.9375rem] leading-[1.7]">
                                <dt className="text-muted">여는 곳</dt>
                                <dd className="text-ink">{key.opens}</dd>
                                <dt className="text-muted">갱신</dt>
                                <dd className="text-ink">{renewal(key)}</dd>
                                {key.renewVia ? (
                                    <>
                                        <dt className="text-muted">경로</dt>
                                        <dd className="font-mono text-[0.8125rem] leading-[1.95] text-ink">
                                            {key.renewVia}
                                        </dd>
                                    </>
                                ) : null}
                            </dl>
                            <p className={`mt-4 max-w-[38rem] ${SMALL}`}>{key.note}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </Figure>
    );
}

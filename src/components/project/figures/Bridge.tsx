import { Figure } from "@/components/project/Figure";

import { DASH, SMALL } from "@/lib/typography";

import type { ProjectBridgeCall, ProjectBridgeMap, ProjectBridgeSide } from "@/types/content";

const DIRECTION: Record<ProjectBridgeSide, string> = {
    app: "앱에서 웹으로",
    web: "웹에서 앱으로",
};

function Code({ label, children }: { label?: string; children: string }) {
    return (
        <p className="flex gap-3 overflow-x-auto rounded-lg bg-surface px-4 py-2.5 font-mono text-[0.8125rem] leading-[1.7] whitespace-nowrap text-ink">
            {label ? <span className="text-muted">{label}</span> : null}
            <code>{children}</code>
        </p>
    );
}

function Call({ call }: { call: ProjectBridgeCall }) {
    return (
        <li className="border-line border-t py-7">
            <p className="text-[1.0625rem] font-bold text-ink">{call.label}</p>
            <div className="mt-3 flex flex-col gap-1.5">
                {call.call ? <Code>{call.call}</Code> : null}
                {call.ios ? <Code label="iOS">{call.ios}</Code> : null}
                {call.android ? <Code label="Android">{call.android}</Code> : null}
            </div>
            <ul className="mt-4 flex flex-col gap-1.5">
                {call.effects.map((effect) => (
                    <li key={effect} className={`${DASH} ${SMALL}`}>
                        {effect}
                    </li>
                ))}
            </ul>
        </li>
    );
}

/** 웹이 앱 WebView 안에서 돌 때 양쪽이 주고받는 말. 방향별로 모은다. */
export function Bridge({ bridge }: { bridge: ProjectBridgeMap }) {
    const sides: ProjectBridgeSide[] = ["app", "web"];

    return (
        <Figure title={bridge.title} lede={bridge.lede} note={bridge.note}>
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-12">
                {sides.map((side) => {
                    const calls = bridge.calls.filter((call) => call.from === side);
                    if (calls.length === 0) {
                        return null;
                    }
                    return (
                        <div key={side} className="min-w-0">
                            <p className="text-[0.9375rem] font-bold text-ink">{DIRECTION[side]}</p>
                            <ul className="mt-4 flex flex-col">
                                {calls.map((call) => (
                                    <Call key={call.label} call={call} />
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </div>
        </Figure>
    );
}

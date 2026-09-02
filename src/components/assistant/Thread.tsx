import { ComposerPrimitive, MessagePrimitive, ThreadPrimitive } from "@assistant-ui/react";

import { useMediaQuery } from "@/hooks/useMediaQuery";

import { profile } from "@/data/profile";

const SUGGESTIONS = [
    "어떤 프로젝트를 했나요?",
    "상태 관리는 어떻게 다루나요?",
    "경력이 어떻게 되나요?",
    "연락처 알려주세요",
];

function UserMessage() {
    return (
        <MessagePrimitive.Root className="flex justify-end">
            <div className="max-w-[85%] rounded-2xl rounded-br-md bg-espresso px-3 py-2 text-sm text-paper">
                <MessagePrimitive.Parts />
            </div>
        </MessagePrimitive.Root>
    );
}

function AssistantMessage() {
    return (
        <MessagePrimitive.Root className="flex flex-col">
            <div className="max-w-[92%] text-sm leading-relaxed whitespace-pre-wrap text-ink">
                <MessagePrimitive.Parts />
            </div>
            <MessagePrimitive.Error>
                <p className="mt-1 rounded-lg border border-line bg-surface px-2.5 py-1.5 font-mono text-[0.6875rem] text-muted">
                    답을 받아오지 못했습니다. 잠시 뒤 다시 물어봐 주세요.
                </p>
            </MessagePrimitive.Error>
        </MessagePrimitive.Root>
    );
}

export function Thread() {
    // 좁은 화면에서 자동 포커스는 열자마자 키보드를 밀어 올려 패널을 절반 가린다.
    const pointerIsFine = useMediaQuery("(pointer: fine)");

    return (
        <ThreadPrimitive.Root className="flex min-h-0 flex-1 flex-col">
            <ThreadPrimitive.Viewport className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
                <ThreadPrimitive.Empty>
                    <div className="flex flex-col gap-3">
                        <p className="text-sm leading-relaxed text-ink">
                            안녕하세요. {profile.name}의 포트폴리오를 안내합니다.
                            <br />
                            궁금한 걸 물어보시면 답하면서 화면도 같이 옮겨 드릴게요.
                        </p>
                        <ul className="flex flex-col gap-1.5">
                            {SUGGESTIONS.map((prompt) => (
                                <li key={prompt}>
                                    <ThreadPrimitive.Suggestion
                                        prompt={prompt}
                                        send
                                        className="w-full rounded-xl border border-line bg-surface/50 px-3 py-2 text-left text-xs text-muted transition-colors hover:border-espresso/40 hover:text-ink"
                                    >
                                        {prompt}
                                    </ThreadPrimitive.Suggestion>
                                </li>
                            ))}
                        </ul>
                    </div>
                </ThreadPrimitive.Empty>

                <ThreadPrimitive.Messages components={{ UserMessage, AssistantMessage }} />
            </ThreadPrimitive.Viewport>

            <ComposerPrimitive.Root className="flex items-end gap-2 border-line border-t px-3 py-3">
                <ComposerPrimitive.Input
                    rows={1}
                    autoFocus={pointerIsFine}
                    placeholder="무엇이 궁금하신가요?"
                    className="max-h-24 min-h-9 flex-1 resize-none rounded-xl border border-line bg-paper px-3 py-2 text-sm text-ink placeholder:text-muted"
                />
                <ThreadPrimitive.If running={false}>
                    <ComposerPrimitive.Send
                        aria-label="보내기"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-espresso text-paper transition-opacity disabled:opacity-40"
                    >
                        <svg
                            viewBox="0 0 16 16"
                            className="h-4 w-4"
                            aria-hidden="true"
                            fill="currentColor"
                        >
                            <path d="M1.7 14.3 15 8 1.7 1.7l1.9 5.1 6.6 1.2-6.6 1.2-1.9 5.1Z" />
                        </svg>
                    </ComposerPrimitive.Send>
                </ThreadPrimitive.If>
                <ThreadPrimitive.If running>
                    <ComposerPrimitive.Cancel
                        aria-label="중지"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-line text-ink"
                    >
                        <span aria-hidden className="h-2.5 w-2.5 rounded-xs bg-current" />
                    </ComposerPrimitive.Cancel>
                </ThreadPrimitive.If>
            </ComposerPrimitive.Root>
        </ThreadPrimitive.Root>
    );
}

import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    AssistantRuntimeProvider,
    AuiConfig,
    AuiProvider,
    Tools,
    useAui,
} from "@assistant-ui/react";
import { AssistantChatTransport, useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { lastAssistantMessageIsCompleteWithToolCalls } from "ai";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { Thread } from "@/components/assistant/Thread";

import { setAssistantClose, setAssistantNavigate } from "@/lib/assistant/bridge";
import { assistantToolkit } from "@/lib/assistant/toolkit";

import type { ReactNode } from "react";

/** 런타임 위에 툴킷을 얹는 한 겹. 모델이 부를 수 있는 도구와 그 렌더러가 여기서 등록된다. */
function ToolScope({ children }: { children: ReactNode }) {
    const aui = useAui();
    const config = AuiConfig({ tools: Tools({ toolkit: assistantToolkit }) });

    return (
        <AuiProvider extends={aui} config={config}>
            {children}
        </AuiProvider>
    );
}

interface AssistantWidgetProps {
    panelId: string;
    open: boolean;
    onClose: () => void;
}

/**
 * 대화 패널과 런타임.
 *
 * 버튼은 `AssistantLauncher`가 들고 있고 이 컴포넌트는 방문자가 처음 열 때 받아 온다
 * (assistant-ui + AI SDK 묶음이 534KB라 첫 화면과 함께 내려보낼 것이 아니다).
 * 한 번 마운트되면 닫아도 언마운트하지 않는다 — 언마운트하면 대화가 통째로 사라진다.
 */
export function AssistantWidget({ panelId, open, onClose }: AssistantWidgetProps) {
    const navigate = useNavigate();
    const reduced = useReducedMotion();

    // 라우트가 바뀌면 이 컴포넌트도 다시 그려진다. transport를 렌더마다 새로 만들면
    // 그때마다 연결이 갈아끼워져 진행 중이던 답변이 끊긴다 — 한 번 만들어 계속 쓴다.
    const [transport] = useState(() => new AssistantChatTransport({ api: "/api/chat" }));

    const runtime = useChatRuntime({
        transport,
        // 툴은 브라우저에서 실행되므로, 결과를 들고 서버로 한 번 더 다녀와야
        // 모델이 그 결과를 보고 말을 잇는다. 없으면 카드만 뜨고 답이 끊긴다.
        sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    });

    // 패널을 닫아도 런타임과 대화는 그대로 살아 있다. 대화가 길이 상한에 걸리면
    // 다시 열어도 같은 기록을 또 보내 계속 실패하므로, 비우는 길을 따로 둔다.
    const startNewThread = useCallback(() => {
        void runtime.threads.switchToNewThread();
    }, [runtime]);

    // 툴은 React 밖에서 실행되므로, 라우터와 패널 제어를 모듈 다리에 걸어둔다.
    useEffect(() => {
        setAssistantNavigate((to) => navigate(to));
        setAssistantClose(onClose);
        return () => {
            setAssistantNavigate(null);
            setAssistantClose(null);
        };
    }, [navigate, onClose]);

    useEffect(() => {
        if (!open) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, onClose]);

    return (
        <AssistantRuntimeProvider runtime={runtime}>
            <ToolScope>
                <AnimatePresence>
                    {open ? (
                        <motion.section
                            key="panel"
                            id={panelId}
                            aria-label="포트폴리오 안내 대화"
                            initial={reduced ? false : { opacity: 0, y: 12, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
                            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                            className="flex h-[min(32rem,70vh)] w-[min(22rem,calc(100vw-2rem))] origin-bottom-right flex-col overflow-hidden rounded-3xl border border-line bg-paper/95 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.45)] backdrop-blur-md"
                        >
                            <header className="flex items-center justify-between border-line border-b px-4 py-3">
                                <div>
                                    <p className="font-display text-sm font-semibold text-ink">
                                        포트폴리오 안내
                                    </p>
                                    <p className="font-mono text-[0.625rem] tracking-[0.16em] text-muted uppercase">
                                        ask anything
                                    </p>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <button
                                        type="button"
                                        onClick={startNewThread}
                                        className="rounded-full border border-line px-2.5 py-1 font-mono text-[0.625rem] text-muted transition-colors hover:text-ink"
                                    >
                                        새 대화
                                    </button>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        aria-label="대화 닫기"
                                        className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-muted transition-colors hover:text-ink"
                                    >
                                        <svg
                                            viewBox="0 0 16 16"
                                            aria-hidden="true"
                                            className="h-3.5 w-3.5"
                                            stroke="currentColor"
                                            strokeWidth="1.6"
                                        >
                                            <path d="M3.5 3.5 12.5 12.5M12.5 3.5 3.5 12.5" />
                                        </svg>
                                    </button>
                                </div>
                            </header>
                            <Thread />
                        </motion.section>
                    ) : null}
                </AnimatePresence>
            </ToolScope>
        </AssistantRuntimeProvider>
    );
}

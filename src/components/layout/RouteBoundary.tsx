import { Component } from "react";

import type { ErrorInfo, ReactNode } from "react";

type Props = {
    children: ReactNode;
    /** 지금 경로. 이 값이 바뀌면 실패를 턴다 — 넘어진 자리를 떠났다는 뜻이므로. */
    resetKey: string;
    /** 실패한 `lazy`를 새것으로 갈아 끼운다 — 이걸 하지 않으면 다시 그려도 같은 에러가 난다. */
    onRetry: () => void;
};

type State = {
    failed: boolean;
    resetKey: string;
};

/**
 * 라우트가 그려지다 넘어졌을 때 받아 내는 자리.
 *
 * 여기 있는 이유는 거의 하나다 — **상세 청크를 못 받았을 때.** 회선이 끊기거나 배포가
 * 갈리면 `import()`가 거부되고, React는 그 결과를 `lazy`에 `Rejected`로 굳혀 이후 렌더마다
 * 같은 에러를 다시 던진다. 프로미스 캐시(`routes/lazy.ts`)를 비워 두어도 그건 남는다.
 * 그래서 되살리는 방법은 새 `lazy`를 만들어 마운트하는 것뿐이고, 그 신호를 줄 곳이
 * 실패를 실제로 받아 내는 여기다.
 *
 * 에러 바운더리는 클래스로만 만들 수 있다(훅에 대응하는 API가 없다).
 */
export class RouteBoundary extends Component<Props, State> {
    state: State = { failed: false, resetKey: this.props.resetKey };

    static getDerivedStateFromError(): Partial<State> {
        return { failed: true };
    }

    /**
     * 자리를 옮기면 실패를 턴다.
     *
     * 이 바운더리는 `<Routes>` 바깥에 있어 라우트가 갈려도 마운트된 채 남는다. 실패를
     * 그대로 들고 있으면 뒤로가기로도, 홈 링크로도 이 화면을 벗어날 수 없다 —
     * 그 이동조차 클라이언트 라우팅이라 같은 바운더리가 계속 그려지기 때문이다.
     */
    static getDerivedStateFromProps(props: Props, state: State): Partial<State> | null {
        if (props.resetKey === state.resetKey) {
            return null;
        }
        return { failed: false, resetKey: props.resetKey };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        // 화면에는 사정을 짧게만 적으므로, 원인은 콘솔에 남겨 둔다.
        console.error("라우트를 그리지 못했다", error, info.componentStack);
    }

    private retry = () => {
        // 순서가 중요하다: 새 `lazy`를 받아 둔 뒤에 다시 그려야 한다. 둘 다 같은 배치에
        // 묶이므로, 지운 상태로 옛 `lazy`를 한 번 더 그리는 일은 생기지 않는다.
        this.props.onRetry();
        this.setState({ failed: false });
    };

    render() {
        if (!this.state.failed) {
            return this.props.children;
        }

        // 전환은 `<main>`을 잡아 움직인다(PageDissolve). 실패한 자리에도 그게 있어야
        // 잠기고 떠오르는 절반이 어색해지지 않는다.
        return (
            <main className="flex min-h-screen items-center justify-center px-6">
                <div className="max-w-md text-center">
                    <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-muted uppercase">
                        Failed to load
                    </p>
                    <h1 className="mt-4 font-display text-2xl text-ink">
                        이 페이지를 불러오지 못했어요
                    </h1>
                    <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
                        연결이 끊겼거나, 받는 도중에 새 버전이 배포된 것 같아요. 다시 시도하면 대개
                        해결됩니다.
                    </p>

                    <div className="mt-8 flex flex-wrap justify-center gap-2">
                        <button
                            type="button"
                            onClick={this.retry}
                            className="rounded-full border border-espresso bg-espresso px-4 py-2 text-[0.8125rem] text-paper transition-colors duration-300"
                        >
                            다시 시도
                        </button>
                        {/* 링크가 아니라 버튼인 이유: `<a>`는 PageDissolve가 가로채
                            클라이언트 이동으로 바꾼다. 배포가 갈려 청크 주소가 사라진
                            경우라면 문서를 통째로 다시 받아야 풀리므로 진짜 이동을 시킨다. */}
                        <button
                            type="button"
                            onClick={() => window.location.assign("/")}
                            className="rounded-full border border-line px-4 py-2 text-[0.8125rem] text-muted transition-colors duration-300 hover:border-espresso hover:text-ink"
                        >
                            홈으로
                        </button>
                    </div>
                </div>
            </main>
        );
    }
}

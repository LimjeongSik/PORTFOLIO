import { lazy, Suspense, useEffect } from "react";

import { AssistantLauncher } from "@/components/assistant/AssistantLauncher";
import { Cursor } from "@/components/layout/Cursor";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageDissolve } from "@/components/layout/PageDissolve";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { useLenis } from "@/hooks/useLenis";

import { dismissBoot } from "@/lib/boot";
import { onStageReady } from "@/lib/stage";

/* three는 압축 후 146KB이다. 첫 페인트를 이 청크에 묶지 않으려고 따로 떼어 늦게 받는다 —
   무대가 없어도 지면색은 이미 칠해져 있어서 늦게 붙는 것이 티나지 않는다. */
const Stage = lazy(() => import("@/components/stage/Stage"));

function App() {
    useLenis();

    /* `index.html`이 그려 둔 하늘을 무대가 첫 프레임을 그릴 때 걷는다. 히어로가 아니라 여기서
       거는 이유는 주소로 프로젝트 상세를 바로 열었을 때도 걷혀야 하기 때문이다. */
    useEffect(() => onStageReady(dismissBoot), []);

    return (
        <>
            {/* 3D 무대는 **라우터 바깥**에 산다. 페이지를 넘길 때 넘어가는 것은 지면이 아니라
                시점이어야 하므로, 캔버스는 파괴되지 않고 카메라만 그 자리로 날아간다. */}
            {/* 미루지 않는다 — 무대를 세우는 동안 히어로 인트로가 기다리므로(`lib/stage`의
                `onStageSettled`), 그 무거운 일은 아무것도 움직이지 않는 화면 위에서 끝난다.
                미뤘더니 이번엔 청크 내려받기까지 같이 밀려 배경이 2초 뒤에 떴다(사용자 지적). */}
            <Suspense fallback={null}>
                <Stage />
            </Suspense>
            <ScrollToTop />
            <Cursor />
            <Navbar />
            {/* 라우트는 PageDissolve가 들고 있다 — 이동할 때 본문을 지면색으로 잠갔다가
                다시 띄우기 위해서다. Navbar·Footer는 잠기지 않고 지면에 남는다. */}
            <PageDissolve />
            <Footer />
            <AssistantLauncher />
        </>
    );
}

export default App;

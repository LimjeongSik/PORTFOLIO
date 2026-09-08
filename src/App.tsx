import { lazy, Suspense } from "react";

import { AssistantLauncher } from "@/components/assistant/AssistantLauncher";
import { Cursor } from "@/components/layout/Cursor";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageDissolve } from "@/components/layout/PageDissolve";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { useLenis } from "@/hooks/useLenis";

/* three는 압축 후 100KB를 넘는다. 첫 페인트를 이 청크에 묶지 않으려고 따로 떼어 늦게 받는다 —
   무대가 없어도 지면색은 이미 칠해져 있어서 늦게 붙는 것이 티나지 않는다. */
const Stage = lazy(() => import("@/components/stage/Stage"));

function App() {
    useLenis();

    return (
        <>
            {/* 3D 무대는 **라우터 바깥**에 산다. 페이지를 넘길 때 넘어가는 것은 지면이 아니라
                시점이어야 하므로, 캔버스는 파괴되지 않고 카메라만 그 자리로 날아간다. */}
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

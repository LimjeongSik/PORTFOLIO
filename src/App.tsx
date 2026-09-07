import { AssistantLauncher } from "@/components/assistant/AssistantLauncher";
import { Cursor } from "@/components/layout/Cursor";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageDissolve } from "@/components/layout/PageDissolve";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { useLenis } from "@/hooks/useLenis";

function App() {
    useLenis();

    return (
        <>
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

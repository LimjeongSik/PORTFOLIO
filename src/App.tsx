import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import { AssistantLauncher } from "@/components/assistant/AssistantLauncher";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { useLenis } from "@/hooks/useLenis";

import { Home } from "@/routes/Home";

// 홈은 첫 진입 경로라 그대로 두고(지연 로드하면 요청만 한 단계 늘어난다),
// 상세 페이지는 카드에서 이동할 때 받도록 분리한다.
const ProjectDetail = lazy(() =>
    import("@/routes/ProjectDetail").then((module) => ({ default: module.ProjectDetail })),
);

function App() {
    useLenis();

    return (
        <>
            <ScrollToTop />
            <Navbar />
            <Suspense fallback={<div className="min-h-screen" />}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/projects/:slug" element={<ProjectDetail />} />
                </Routes>
            </Suspense>
            <Footer />
            <AssistantLauncher />
        </>
    );
}

export default App;

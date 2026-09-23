import { Route, Routes } from "react-router-dom";

import { AssistantLauncher } from "@/components/assistant/AssistantLauncher";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ScrollManager } from "@/components/layout/ScrollManager";

import { Home } from "@/routes/Home";
import { ProjectDetail } from "@/routes/ProjectDetail";

function App() {
    return (
        <>
            <ScrollManager />
            <Header />
            <main className="pt-15">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/projects/:slug" element={<ProjectDetail />} />
                    <Route path="*" element={<Home />} />
                </Routes>
            </main>
            <Footer />
            <AssistantLauncher />
        </>
    );
}

export default App;

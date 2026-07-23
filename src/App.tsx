import { Route, Routes } from "react-router-dom";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { useLenis } from "@/hooks/useLenis";

import { Home } from "@/routes/Home";
import { ProjectDetail } from "@/routes/ProjectDetail";

function App() {
    useLenis();

    return (
        <>
            <ScrollToTop />
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projects/:slug" element={<ProjectDetail />} />
            </Routes>
            <Footer />
        </>
    );
}

export default App;

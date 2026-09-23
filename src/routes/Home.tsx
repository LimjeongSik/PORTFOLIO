import { About } from "@/components/home/About";
import { Experience } from "@/components/home/Experience";
import { Hero } from "@/components/home/Hero";
import { ProjectIndex } from "@/components/home/ProjectIndex";
import { Skills } from "@/components/home/Skills";

export function Home() {
    return (
        <>
            <Hero />
            <ProjectIndex />
            <Experience />
            <Skills />
            <About />
        </>
    );
}

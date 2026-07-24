import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";

import { navItems } from "@/data/nav";
import { profile } from "@/data/profile";

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [active, setActive] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    const isHome = location.pathname === "/";

    const { scrollYProgress } = useScroll();
    const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        // 홈 진입/이탈 시 이전 활성 섹션을 초기화한다.
        // (상세페이지에 갔다 돌아왔을 때 pill이 이전 위치에 남는 버그 방지)
        setActive("");
        if (!isHome) {
            return;
        }
        const sections = navItems
            .map((item) => document.getElementById(item.id))
            .filter((el): el is HTMLElement => el !== null);

        // 감지 밴드 안에 들어온 섹션을 집합으로 추적한다.
        // 밴드에 아무 섹션도 없으면(=Hero 영역) active를 비워,
        // 소개→Hero로 스크롤을 올렸을 때 pill이 남는 버그를 방지한다.
        const visible = new Set<string>();

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        visible.add(entry.target.id);
                    } else {
                        visible.delete(entry.target.id);
                    }
                }
                // navItems 순서대로 가장 먼저 걸린 섹션을 활성화, 없으면 초기화.
                const next = navItems.find((item) => visible.has(item.id));
                setActive(next?.id ?? "");
            },
            { rootMargin: "-45% 0px -50% 0px" },
        );

        for (const section of sections) {
            observer.observe(section);
        }
        return () => observer.disconnect();
    }, [isHome]);

    const goToSection = (id: string) => {
        setMenuOpen(false);
        if (!isHome) {
            navigate(`/#${id}`);
            return;
        }
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <header
            className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
                scrolled ? "bg-paper/80 backdrop-blur-md" : "bg-transparent"
            }`}
        >
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                <Link
                    to="/"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="font-display text-lg font-bold tracking-tight text-ink"
                >
                    {profile.name}
                    <span className="text-espresso">.</span>
                </Link>

                <nav className="hidden items-center gap-1 md:flex">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => goToSection(item.id)}
                            className={`relative rounded-full px-4 py-2 text-sm transition-colors ${
                                active === item.id && isHome
                                    ? "text-paper"
                                    : "text-muted hover:text-ink"
                            }`}
                        >
                            {active === item.id && isHome ? (
                                <motion.span
                                    layoutId="nav-active"
                                    className="absolute inset-0 rounded-full bg-espresso"
                                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                                />
                            ) : null}
                            <span className="relative">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <button
                    type="button"
                    aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((prev) => !prev)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink md:hidden"
                >
                    <span className="relative flex h-3 w-4 flex-col justify-between">
                        <span
                            className={`h-0.5 w-full origin-center bg-current transition-transform ${
                                menuOpen ? "translate-y-1.25 rotate-45" : ""
                            }`}
                        />
                        <span
                            className={`h-0.5 w-full bg-current transition-opacity ${
                                menuOpen ? "opacity-0" : ""
                            }`}
                        />
                        <span
                            className={`h-0.5 w-full origin-center bg-current transition-transform ${
                                menuOpen ? "-translate-y-1.25 -rotate-45" : ""
                            }`}
                        />
                    </span>
                </button>
            </div>

            <motion.div className="h-px origin-left bg-espresso" style={{ scaleX: progress }} />

            <AnimatePresence>
                {menuOpen ? (
                    <motion.nav
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden border-t border-line bg-paper/95 backdrop-blur-md md:hidden"
                    >
                        <ul className="flex flex-col px-6 py-4">
                            {navItems.map((item) => (
                                <li key={item.id}>
                                    <button
                                        type="button"
                                        onClick={() => goToSection(item.id)}
                                        className="w-full py-3 text-left text-base text-ink"
                                    >
                                        {item.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </motion.nav>
                ) : null}
            </AnimatePresence>
        </header>
    );
}

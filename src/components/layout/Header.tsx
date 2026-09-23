import { Link } from "react-router-dom";

import { navItems } from "@/data/nav";
import { profile } from "@/data/profile";
import { CONTAINER } from "@/lib/typography";

/** 위에 붙어 있는 한 줄. 이름은 홈으로, 나머지는 홈의 구간으로 간다. */
export function Header() {
    return (
        <header className="fixed inset-x-0 top-0 z-50 border-line/80 border-b bg-paper/90 backdrop-blur-md">
            <div className={`${CONTAINER} flex h-15 items-center justify-between gap-6`}>
                <Link to="/" className="text-[0.9375rem] font-bold tracking-[-0.01em] text-ink">
                    {profile.name}
                </Link>
                <nav aria-label="주요 메뉴">
                    <ul className="flex items-center gap-4 sm:gap-7">
                        {navItems.map((item) => (
                            <li key={item.id}>
                                <Link
                                    to={`/#${item.id}`}
                                    className="text-[0.875rem] text-muted transition-colors hover:text-ink"
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header>
    );
}

import { profile } from "@/data/profile";
import { CONTAINER, META } from "@/lib/typography";

export function Footer() {
    return (
        <footer className="border-line border-t">
            <div
                className={`${CONTAINER} flex flex-col gap-2 py-10 sm:flex-row sm:items-center sm:justify-between`}
            >
                <p className={META}>
                    {profile.name} · {profile.role}
                </p>
                <a
                    href={`mailto:${profile.email}`}
                    className={`${META} transition-colors hover:text-ink`}
                >
                    {profile.email}
                </a>
            </div>
        </footer>
    );
}

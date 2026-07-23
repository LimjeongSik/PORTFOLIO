import { profile } from "@/data/profile";
import { socials } from "@/data/socials";

export function Footer() {
    return (
        <footer className="border-t border-line">
            <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="font-display text-base font-medium text-ink">
                        {profile.name}
                        <span className="text-espresso">.</span>
                    </p>
                    <p className="mt-1 font-mono text-xs text-muted">{profile.email}</p>
                </div>
                <div className="flex flex-wrap gap-4">
                    {socials.map((social) => (
                        <a
                            key={social.label}
                            href={social.href}
                            target="_blank"
                            rel="noreferrer"
                            className="font-mono text-xs text-muted transition-colors hover:text-ink"
                        >
                            {social.label}
                        </a>
                    ))}
                </div>
                <p className="font-mono text-xs text-muted">© {profile.name} · Built with React</p>
            </div>
        </footer>
    );
}

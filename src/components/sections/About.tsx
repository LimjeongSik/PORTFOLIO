import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

import { profile } from "@/data/profile";

const details: { label: string; value: string; href?: string }[] = [
    { label: "연락처", value: profile.phone },
    { label: "이메일", value: profile.email, href: `mailto:${profile.email}` },
    { label: "생년월일", value: profile.birth },
    { label: "직군", value: profile.role },
    { label: "위치", value: profile.location },
];

const stats: { to: number; suffix: string; label: string }[] = [
    { to: 6, suffix: "+", label: "년 경력" },
    { to: 24, suffix: "+", label: "프로젝트" },
    { to: 20, suffix: "+", label: "기술 스택" },
];

export function About() {
    return (
        <section id="about" className="scroll-mt-20 px-6 py-24 sm:py-32">
            <div className="mx-auto max-w-6xl">
                <SectionHeading index="01" eyebrow="Profile" title="프로필" />

                <div className="mt-14 flex flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:gap-8 sm:text-left">
                    <Reveal className="group w-32 shrink-0 sm:w-36">
                        <div className="overflow-hidden rounded-2xl border border-line bg-surface">
                            <img
                                src={profile.avatar}
                                alt={profile.name}
                                className="aspect-4/5 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                        </div>
                    </Reveal>

                    <Reveal delay={0.05}>
                        <h3 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
                            {profile.name}
                        </h3>
                        <p className="mt-3 text-lg text-espresso">{profile.role}</p>
                    </Reveal>
                </div>

                <Reveal delay={0.1}>
                    <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-y border-line py-8 sm:grid-cols-4">
                        {details.map((item) => (
                            <div key={item.label}>
                                <dt className="font-mono text-xs tracking-wider text-muted uppercase">
                                    {item.label}
                                </dt>
                                <dd className="mt-2 text-base text-ink">
                                    {item.href ? (
                                        <a
                                            href={item.href}
                                            className="transition-colors hover:text-espresso"
                                        >
                                            {item.value}
                                        </a>
                                    ) : (
                                        item.value
                                    )}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </Reveal>

                <div className="mt-12 max-w-3xl space-y-5">
                    {profile.intro.map((paragraph, index) => (
                        <Reveal key={paragraph} delay={index * 0.08}>
                            <p className="text-base leading-relaxed text-ink/90 sm:text-lg">
                                {paragraph}
                            </p>
                        </Reveal>
                    ))}
                </div>

                <Reveal delay={0.1}>
                    <div className="mt-12 grid max-w-xl grid-cols-3 gap-4 border-t border-line pt-8">
                        {stats.map((stat) => (
                            <div key={stat.label}>
                                <p className="font-display text-3xl font-bold text-ink sm:text-4xl">
                                    <CountUp to={stat.to} suffix={stat.suffix} />
                                </p>
                                <p className="mt-1 font-mono text-xs text-muted">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

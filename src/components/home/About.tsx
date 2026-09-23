import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";

import { profile } from "@/data/profile";
import { BODY, MEASURE } from "@/lib/typography";

export function About() {
    const contacts = [
        {
            label: "이메일",
            value: <TextLink href={`mailto:${profile.email}`}>{profile.email}</TextLink>,
        },
        {
            label: "전화",
            value: (
                <TextLink href={`tel:${profile.phone.replace(/\D/g, "")}`}>
                    {profile.phone}
                </TextLink>
            ),
        },
        { label: "생년월일", value: profile.birth },
        { label: "지역", value: profile.location },
    ];

    return (
        <Section id="about" title="소개">
            <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_13rem] md:gap-14">
                <div className={MEASURE}>
                    <div className="flex flex-col gap-6">
                        {profile.intro.map((paragraph) => (
                            <p key={paragraph} className={BODY}>
                                {paragraph}
                            </p>
                        ))}
                    </div>
                    <dl className="mt-12 flex flex-col">
                        {contacts.map((item) => (
                            <div
                                key={item.label}
                                className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-6 border-line border-t py-3.5"
                            >
                                <dt className="text-[0.875rem] leading-[1.8] text-muted">
                                    {item.label}
                                </dt>
                                <dd className="text-[1rem] leading-[1.7] text-ink tabular-nums">
                                    {item.value}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
                <img
                    src={profile.avatar}
                    alt={`${profile.name} 사진`}
                    loading="lazy"
                    className="order-first aspect-[4/5] w-40 rounded-2xl border border-line bg-paper object-cover object-top md:order-none md:w-full"
                />
            </div>
        </Section>
    );
}

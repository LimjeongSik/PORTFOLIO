import { Section } from "@/components/ui/Section";

import { skillGroups } from "@/data/skills";

export function Skills() {
    return (
        <Section id="skills" title="기술">
            <dl className="flex flex-col">
                {skillGroups.map((group) => (
                    <div
                        key={group.label}
                        className="grid gap-x-10 gap-y-1 border-line border-t py-4 first:border-t-0 first:pt-0 sm:grid-cols-[9.5rem_minmax(0,1fr)]"
                    >
                        <dt className="text-[0.875rem] leading-[1.9] text-muted">{group.label}</dt>
                        <dd className="text-[1.0625rem] leading-[1.75] text-ink">
                            {group.items.join(", ")}
                        </dd>
                    </div>
                ))}
            </dl>
        </Section>
    );
}

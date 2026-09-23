import { Figure } from "@/components/project/Figure";

import { META, SMALL } from "@/lib/typography";

import type { ProjectAnatomy } from "@/types/content";

/**
 * 한 화면을 세로로 이어 붙인 스크롤샷과, 위에서부터의 설계 근거.
 * 스크롤샷은 폰 크기 창 안에 두고 그 안에서 직접 굴려 본다.
 */
export function Anatomy({ anatomy }: { anatomy: ProjectAnatomy }) {
    return (
        <Figure title={anatomy.title} lede={anatomy.lede}>
            <div className="grid items-start gap-10 md:grid-cols-[17rem_minmax(0,1fr)] md:gap-14">
                <div className="md:sticky md:top-24">
                    <section
                        // biome-ignore lint/a11y/noNoninteractiveTabindex: 안에서 굴리는 창이라 키보드로도 굴릴 수 있어야 한다
                        tabIndex={0}
                        aria-label="홈 화면 전체 캡처"
                        className="mx-auto aspect-9/19.5 w-full max-w-[17rem] overflow-y-auto overscroll-contain rounded-[1.75rem] bg-surface ring-1 ring-line"
                    >
                        <img src={anatomy.src} alt="" loading="lazy" className="block w-full" />
                    </section>
                    <p className={`mt-3 text-center ${META}`}>창 안을 스크롤해 보세요</p>
                </div>
                <ol className="flex flex-col gap-8">
                    {anatomy.notes.map((note, index) => (
                        <li key={note.title} className="grid grid-cols-[1.75rem_minmax(0,1fr)]">
                            <span className="text-[0.875rem] leading-[1.9] text-muted tabular-nums">
                                {index + 1}
                            </span>
                            <div>
                                <p className="text-[1rem] leading-[1.6] font-bold text-ink">
                                    {note.title}
                                </p>
                                <p className={`mt-2 ${SMALL}`}>{note.body}</p>
                            </div>
                        </li>
                    ))}
                    <li className="border-line border-t pt-5 font-mono text-[0.75rem] leading-[1.8] text-muted">
                        {anatomy.footnote}
                    </li>
                </ol>
            </div>
        </Figure>
    );
}

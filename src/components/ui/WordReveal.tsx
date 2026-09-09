import { useRef } from "react";

import { useReducedMotion } from "motion/react";

import { gsap, useGSAP } from "@/lib/gsap";

interface WordRevealProps {
    children: string;
    className?: string;
}

/**
 * 문단이 화면을 지나가는 동안 단어가 하나씩 밝아진다.
 *
 * 등장 애니메이션이 아니라 **스크럽**이다 — 스크롤을 되감으면 글자도 같이 어두워진다.
 * 읽는 속도를 스크롤이 정하게 만드는 장치라, 긴 본문이 지루해지지 않는다.
 */
export function WordReveal({ children, className }: WordRevealProps) {
    const root = useRef<HTMLParagraphElement>(null);
    const reduced = useReducedMotion();

    useGSAP(
        () => {
            if (reduced) {
                return;
            }
            gsap.fromTo(
                ".word-reveal-item",
                /* 바닥이 0.16이면 아직 지나가지 않은 단어가 지면에서 사실상 사라져,
                   문단을 훑어보려는 눈이 갈 곳을 잃는다. 밝아지는 폭은 그대로 두고 바닥만
                   읽을 수 있는 데까지 올린다 — 쓸리는 연출은 같고 글자만 남는다. */
                { opacity: 0.34 },
                {
                    opacity: 1,
                    ease: "none",
                    stagger: 0.6,
                    scrollTrigger: {
                        trigger: root.current,
                        start: "top 82%",
                        end: "bottom 58%",
                        scrub: true,
                    },
                },
            );
        },
        { scope: root, dependencies: [reduced, children] },
    );

    return (
        <p ref={root} className={className}>
            {children.split(" ").map((word, index) => (
                <span
                    // biome-ignore lint/suspicious/noArrayIndexKey: 같은 단어가 반복될 수 있어 인덱스가 유일한 키다
                    key={`${word}-${index}`}
                    className="word-reveal-item inline-block whitespace-pre"
                >
                    {word}{" "}
                </span>
            ))}
        </p>
    );
}

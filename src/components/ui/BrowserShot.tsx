import { motion } from "motion/react";

import type { MotionStyle } from "motion/react";

interface BrowserShotProps {
    src: string;
    alt: string;
    /** 주소창에 적힐 호스트. 없으면 빈 주소창만 선다. */
    url?: string;
    /** 크기·위치는 부르는 쪽이 정한다 — 여기서는 창의 크롬만 책임진다. */
    className?: string;
    style?: MotionStyle;
    loading?: "eager" | "lazy";
    draggable?: boolean;
}

/**
 * 웹 화면 스크린샷을 브라우저 창에 담아 보여 준다 — `PhoneShot`의 웹판.
 *
 * 앱 카드는 상태바부터 탭 바까지 한 화면이 통째로 서 있어 "앱"으로 바로 읽히는데, 웹 화면을
 * 맨판으로 두면 페이지 중간에서 잘린 캡처 한 장으로 읽혔다(사용자 지적). 신호등 세 점과
 * 주소창이 있는 크롬 한 줄이 "웹"을 말한다.
 *
 * 크롬의 크기는 창 폭에 묶는다(`cqw`). 카드에서는 작고 갤러리에서는 크게 쓰이는데, 고정
 * 픽셀이면 작은 창에서는 크롬이 화면을 먹고 큰 창에서는 실처럼 가늘어진다.
 */
export function BrowserShot({
    src,
    alt,
    url,
    className = "",
    style,
    loading = "lazy",
    draggable,
}: BrowserShotProps) {
    return (
        <motion.div
            style={style}
            className={`@container overflow-hidden rounded-xl bg-[#0b0f19] ring-1 ring-white/15 ${className}`}
        >
            <BrowserChrome url={url} />
            <img
                src={src}
                alt={alt}
                loading={loading}
                decoding="async"
                draggable={draggable}
                className="block w-full"
            />
        </motion.div>
    );
}

/**
 * 창의 머리 한 줄 — 신호등 세 점과 주소창. **`@container` 안에 두어야 한다**: 크기가 전부
 * 가장 가까운 컨테이너의 폭(`cqw`)에 묶여 있다. 화면을 여러 장 겹쳐 두는 전시(`ProjectShowcase`)가
 * 이미지 한 장짜리 `BrowserShot` 대신 이것만 가져다 쓴다.
 */
export function BrowserChrome({ url }: { url?: string }) {
    return (
        <div aria-hidden className="flex h-[5.4cqw] items-center gap-[0.9cqw] px-[2cqw]">
            <span className="size-[1.25cqw] rounded-full bg-[#ff5f57]" />
            <span className="size-[1.25cqw] rounded-full bg-[#febc2e]" />
            <span className="size-[1.25cqw] rounded-full bg-[#28c840]" />
            <span className="mx-auto flex h-[3.2cqw] w-[46%] items-center justify-center truncate rounded-full bg-white/8 font-mono text-[1.6cqw] text-white/55">
                {url}
            </span>
            {/* 주소창이 가운데 오도록 점 셋만큼 오른쪽을 비운다 */}
            <span className="w-[5.5cqw]" />
        </div>
    );
}

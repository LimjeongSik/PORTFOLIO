import { motion } from "motion/react";

import type { MotionStyle } from "motion/react";

interface PhoneShotProps {
    src: string;
    alt: string;
    /** 크기·위치는 부르는 쪽이 정한다 — 여기서는 기기 테두리만 책임진다. */
    className?: string;
    style?: MotionStyle;
    loading?: "eager" | "lazy";
}

/**
 * 앱 화면 스크린샷을 기기에 담아 보여 준다.
 *
 * 맨판에 붙인 스크린샷은 밝은 앱일수록 지면에 녹아 "이미지 한 장"으로 읽힌다.
 * 어두운 테두리와 세로로 눌린 모서리(14% / 6.5% — 실제 기기의 곡률 비)가 폰의 실루엣을
 * 만들어, 배경이 밝든 어둡든 같은 무게로 서 있게 한다.
 *
 * 테두리는 감싸는 div가 아니라 이미지 자신에게 준다. 그래야 부르는 쪽이 지금까지 쓰던
 * 크기·위치 클래스(폭 %, 높이 %, absolute)를 그대로 쓸 수 있고, 이미지는 border-radius가
 * 만드는 안쪽 곡률로 알아서 잘린다.
 */
export function PhoneShot({ src, alt, className = "", style, loading = "lazy" }: PhoneShotProps) {
    return (
        <motion.img
            src={src}
            alt={alt}
            loading={loading}
            decoding="async"
            style={{ borderRadius: "14% / 6.5%", ...style }}
            className={`border-[5px] border-[#0b0f19] bg-[#0b0f19] ring-1 ring-white/15 ${className}`}
        />
    );
}

import type { ReactNode, RefObject } from "react";

interface RoomyProps {
    children: ReactNode;
    /** 이 구간이 쓰는 스크롤 길이(svh). 화면 하나가 100이다. */
    length: number;
    /** 무드 존이 잡을 자리 */
    zoneRef?: RefObject<HTMLDivElement | null>;
    /** 3D 무대가 이 구간의 진행률을 재려고 찾는 이름 */
    zone?: string;
}

/**
 * 구간에 여유를 준다 — 내용은 화면 한가운데 붙어 있고, 그동안 뒤의 3D 공간이 다음 대형으로
 * 옮겨 간다.
 *
 * 섹션 컴포넌트를 고치지 않고 바깥에서 감싸는 이유: 스크롤 길이는 **그 섹션이 무엇을
 * 말하는가**가 아니라 **공간이 대형을 바꾸는 데 얼마나 걸리는가**의 문제라, 홈을 조립하는
 * 자리에서 정하는 게 맞다.
 *
 * 내용이 화면보다 길면 붙이지 않는다. 뷰포트보다 큰 요소를 `sticky top-0`으로 두면 아랫부분이
 * 영영 보이지 않는다 — 그런 구간은 `length`만 넉넉히 주고 평소대로 흐르게 둔다.
 */
export function Roomy({ children, length, zoneRef, zone }: RoomyProps) {
    return (
        <div ref={zoneRef} data-stage-zone={zone} style={{ minHeight: `${length}svh` }}>
            <div className="sticky top-0 flex min-h-svh items-center">
                <div className="w-full">{children}</div>
            </div>
        </div>
    );
}

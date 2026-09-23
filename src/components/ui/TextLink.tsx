import type { AnchorHTMLAttributes } from "react";

/** 본문 속 링크 — 밑줄이 링크임을 말하고, hover에서는 밑줄만 짙어진다. */
export function TextLink({ className = "", ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
    return (
        <a
            {...props}
            className={`underline decoration-ink/25 decoration-1 underline-offset-[0.3em] transition-colors hover:decoration-current ${className}`}
        />
    );
}

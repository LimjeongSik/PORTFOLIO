import type { ReactNode } from "react";

interface TagProps {
    children: ReactNode;
}

export function Tag({ children }: TagProps) {
    return (
        <span className="inline-flex items-center rounded-full border border-line bg-sand/40 px-3 py-1 font-mono text-xs text-espresso">
            {children}
        </span>
    );
}

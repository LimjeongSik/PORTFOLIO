/** 주소창에 적을 호스트. 링크가 없거나 깨졌으면 비운다. */
export function hostOf(href: string | undefined) {
    if (!href) {
        return undefined;
    }
    try {
        return new URL(href).host;
    } catch {
        return undefined;
    }
}

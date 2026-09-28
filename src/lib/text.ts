/** 요약의 첫 문장 — 목록 한 줄에 쓴다. */
export function firstSentence(text: string) {
    const end = text.search(/[.!?](\s|$)/);
    return end < 0 ? text : text.slice(0, end + 1);
}

/** 받침이 있으면 "으로", 없거나 ㄹ 받침이면 "로". 한글이 아닌 끝글자는 "로"로 둔다. */
export function withRo(word: string) {
    const code = word.charCodeAt(word.length - 1) - 0xac00;
    if (code < 0 || code > 11171) {
        return `${word}로`;
    }
    const final = code % 28;
    return final === 0 || final === 8 ? `${word}로` : `${word}으로`;
}

/** "센티언트 시스템즈 (Sentient Systems)" → "센티언트 시스템즈" */
export function shortCompany(company: string) {
    return company.replace(/\s*\([^)]*\)\s*$/, "");
}

/** 요약의 첫 문장 — 목록 한 줄에 쓴다. */
export function firstSentence(text: string) {
    const end = text.search(/[.!?](\s|$)/);
    return end < 0 ? text : text.slice(0, end + 1);
}

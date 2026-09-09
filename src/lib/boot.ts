/**
 * `index.html`이 그려 둔 하늘(별과 별똥별)을 걷는다.
 *
 * 무대가 첫 프레임을 그리는 순간에 부른다 — 캔버스가 지면색에서 떠오르는 것과 같은 창에서
 * 별이 흐려지므로, 교대하는 순간이 보이지 않고 그 자리를 진짜 먼지가 넘겨받는다.
 *
 * 두 번 불러도 안전하다. 흐려진 뒤에는 문서에서 아예 뺀다 — 화면을 덮은 `fixed` 한 겹이
 * 남아 있으면 합성기가 계속 들고 있는다.
 */
const FADE = 700;

export function dismissBoot() {
    const boot = document.getElementById("boot");
    if (!boot || boot.dataset.gone !== undefined) {
        return;
    }
    boot.dataset.gone = "";
    window.setTimeout(() => boot.remove(), FADE + 120);
}

// ── Popup Layer ───────────────────────────────────────

export function getPopupLayer() {
    // 首选overlay内的slot
    var slot = document.getElementById('om-popup-slot');
    if (slot) return slot;
    // 回退：overlay本身
    var ov = document.querySelector('.om-overlay');
    if (ov) return ov;
    // 最后回退：body
    return document.body;
}

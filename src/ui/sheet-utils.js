import { getPopupLayer } from './popup-layer.js';

// ── Bottom Sheet 通用创建/关闭 ───────────────────────────
export function createSheet(contentHtml) {
    var ov = document.createElement('div');
    ov.className = 'om-sheet-overlay';
    ov.innerHTML = '<div class="om-sheet"><div class="om-sheet-handle"></div><div class="om-sheet-content">' + contentHtml + '</div></div>';
    getPopupLayer().appendChild(ov);
    ov.addEventListener('click', function (e) { if (e.target === ov) closeSheet(ov); });
    return ov;
}

export function closeSheet(ov) {
    if (ov && ov.parentNode) ov.parentNode.removeChild(ov);
}

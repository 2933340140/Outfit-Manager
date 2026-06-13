// ── 通用工具函数 ──────────────────────────────────────

export function genId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function esc(s) {
    return s ? String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') : '';
}

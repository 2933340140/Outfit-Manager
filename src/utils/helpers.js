// ── 通用工具函数 ──────────────────────────────────────

export function genId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function esc(s) {
    return s ? String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') : '';
}

// ── 多图工具 ─────────────────────────────────────────
/** 获取穿搭的第一张图片（主图） */
export function getFirstImage(o) {
    if (!o) return null;
    if (o.images && o.images.length > 0) return o.images[0];
    if (o.imageData) return o.imageData; // backward compat
    return null;
}

/** 获取穿搭所有图片数组 */
export function getAllImages(o) {
    if (!o) return [];
    if (o.images && o.images.length > 0) return o.images;
    if (o.imageData) return [o.imageData];
    return [];
}

/** 判断穿搭是否有图片 */
export function hasImages(o) {
    if (!o) return false;
    if (o.images && o.images.length > 0) return true;
    return !!o.imageData;
}

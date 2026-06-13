// ── 图片压缩（支持 WebP + JPEG fallback） ──────────────
import { MAX_IMG_WIDTH, IMG_QUALITY } from '../constants.js';

export function compressImage(dataUrl, cb) {
    var img = new Image();
    img.onload = function () {
        var w = img.width, h = img.height, canvas = document.createElement('canvas');
        if (w > MAX_IMG_WIDTH) {
            canvas.width = MAX_IMG_WIDTH;
            canvas.height = Math.round(h * MAX_IMG_WIDTH / w);
        } else {
            canvas.width = w;
            canvas.height = h;
        }
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);

        // Try WebP first, fallback to JPEG
        try {
            var webpData = canvas.toDataURL('image/webp', IMG_QUALITY);
            if (webpData && webpData.indexOf('data:image/webp') === 0) {
                cb(webpData);
                return;
            }
        } catch (e) {
            // WebP not supported
        }
        cb(canvas.toDataURL('image/jpeg', IMG_QUALITY));
    };
    img.onerror = function () { cb(dataUrl); };
    img.src = dataUrl;
}

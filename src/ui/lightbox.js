import { getPopupLayer } from './popup-layer.js';

function esc(s) {
    var d = document.createElement('div');
    d.appendChild(document.createTextNode(s));
    return d.innerHTML;
}

// ── 全屏 Lightbox ─────────────────────────────────────────
export function openLightbox(outfits, startId) {
    if (!outfits || outfits.length === 0) return;
    var idx = 0;
    for (var i = 0; i < outfits.length; i++) { if (outfits[i].id === startId) { idx = i; break; } }

    var lb = document.createElement('div');
    lb.id = 'om-lightbox';
    lb.className = 'om-lightbox';
    lb.style.cssText = 'position:absolute !important;inset:0 !important;z-index:2 !important;pointer-events:auto !important;background:rgba(0,0,0,.92) !important;display:flex !important;align-items:center !important;justify-content:center !important;';

    function render() {
        var o = outfits[idx];
        lb.innerHTML =
            '<button class="om-lb-close" id="om-lb-close"><i class="fa-solid fa-xmark"></i></button>' +
            '<div class="om-lb-name">' + esc(o.name) + '</div>' +
            (outfits.length > 1 ? '<button class="om-lb-nav om-lb-prev" id="om-lb-prev"><i class="fa-solid fa-chevron-left"></i></button>' : '') +
            '<img class="om-lb-img" src="' + o.imageData + '" draggable="false" />' +
            (outfits.length > 1 ? '<button class="om-lb-nav om-lb-next" id="om-lb-next"><i class="fa-solid fa-chevron-right"></i></button>' : '') +
            (outfits.length > 1 ? '<div class="om-lb-counter">' + (idx + 1) + ' / ' + outfits.length + '</div>' : '');
        lb.querySelector('#om-lb-close').addEventListener('click', closeLb);
        var prev = lb.querySelector('#om-lb-prev'); var next = lb.querySelector('#om-lb-next');
        if (prev) prev.addEventListener('click', function (e) { e.stopPropagation(); idx = (idx - 1 + outfits.length) % outfits.length; render(); });
        if (next) next.addEventListener('click', function (e) { e.stopPropagation(); idx = (idx + 1) % outfits.length; render(); });
    }
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    function closeLb() { if (lb.parentNode) lb.parentNode.removeChild(lb); document.removeEventListener('keydown', keyH); }
    function keyH(e) {
        if (e.key === 'Escape') closeLb();
        else if (e.key === 'ArrowLeft' && outfits.length > 1) { idx = (idx - 1 + outfits.length) % outfits.length; render(); }
        else if (e.key === 'ArrowRight' && outfits.length > 1) { idx = (idx + 1) % outfits.length; render(); }
    }
    document.addEventListener('keydown', keyH);
    render();
    getPopupLayer().appendChild(lb);
    lb.style.setProperty('pointer-events', 'auto', 'important');
}

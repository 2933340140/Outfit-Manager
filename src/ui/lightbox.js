import { getPopupLayer } from './popup-layer.js';
import { getFirstImage, getAllImages } from '../utils/helpers.js';

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
    var imgIdx = 0;

    var lb = document.createElement('div');
    lb.id = 'om-lightbox';
    lb.className = 'om-lightbox';
    lb.style.cssText = 'position:absolute !important;inset:0 !important;z-index:2 !important;pointer-events:auto !important;background:rgba(0,0,0,.92) !important;display:flex !important;align-items:center !important;justify-content:center !important;';

    function getImages() { return getAllImages(outfits[idx]); }

    function render() {
        var o = outfits[idx];
        var imgs = getImages();
        var totalImgs = imgs.length;
        // Clamp imgIdx
        if (imgIdx >= totalImgs) imgIdx = totalImgs - 1;
        if (imgIdx < 0) imgIdx = 0;
        var currentSrc = imgs[imgIdx] || getFirstImage(o) || '';

        // Outfit navigation arrows (multiple outfits)
        var outfitPrevBtn = outfits.length > 1 ? '<button class="om-lb-nav om-lb-prev" id="om-lb-prev" title="上一套"><i class="fa-solid fa-chevron-left"></i></button>' : '';
        var outfitNextBtn = outfits.length > 1 ? '<button class="om-lb-nav om-lb-next" id="om-lb-next" title="下一套"><i class="fa-solid fa-chevron-right"></i></button>' : '';

        // Inner image navigation arrows (multiple images within outfit)
        var imgPrevBtn = totalImgs > 1 ? '<button class="om-lb-img-nav om-lb-img-prev" id="om-lb-img-prev" title="上一张"><i class="fa-solid fa-chevron-left"></i></button>' : '';
        var imgNextBtn = totalImgs > 1 ? '<button class="om-lb-img-nav om-lb-img-next" id="om-lb-img-next" title="下一张"><i class="fa-solid fa-chevron-right"></i></button>' : '';

        // Counters
        var imgCounter = totalImgs > 1 ? '<div class="om-lb-img-counter">' + (imgIdx + 1) + ' / ' + totalImgs + '</div>' : '';
        var outfitCounter = outfits.length > 1 ? '<div class="om-lb-counter">' + (idx + 1) + ' / ' + outfits.length + '</div>' : '';

        lb.innerHTML =
            '<button class="om-lb-close" id="om-lb-close"><i class="fa-solid fa-xmark"></i></button>' +
            '<div class="om-lb-name">' + esc(o.name) + '</div>' +
            outfitPrevBtn +
            imgPrevBtn +
            '<img class="om-lb-img" src="' + currentSrc + '" draggable="false" />' +
            imgNextBtn +
            outfitNextBtn +
            imgCounter +
            outfitCounter;

        // Close
        lb.querySelector('#om-lb-close').addEventListener('click', closeLb);

        // Outfit navigation
        var prev = lb.querySelector('#om-lb-prev'); var next = lb.querySelector('#om-lb-next');
        if (prev) prev.addEventListener('click', function (e) { e.stopPropagation(); idx = (idx - 1 + outfits.length) % outfits.length; imgIdx = 0; render(); });
        if (next) next.addEventListener('click', function (e) { e.stopPropagation(); idx = (idx + 1) % outfits.length; imgIdx = 0; render(); });

        // Inner image navigation
        var imgPrev = lb.querySelector('#om-lb-img-prev'); var imgNext = lb.querySelector('#om-lb-img-next');
        if (imgPrev) imgPrev.addEventListener('click', function (e) { e.stopPropagation(); imgIdx = (imgIdx - 1 + totalImgs) % totalImgs; render(); });
        if (imgNext) imgNext.addEventListener('click', function (e) { e.stopPropagation(); imgIdx = (imgIdx + 1) % totalImgs; render(); });
    }
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    function closeLb() { if (lb.parentNode) lb.parentNode.removeChild(lb); document.removeEventListener('keydown', keyH); }
    function keyH(e) {
        if (e.key === 'Escape') { closeLb(); return; }
        var imgs = getImages();
        if (e.key === 'ArrowLeft') {
            if (imgs.length > 1) { imgIdx = (imgIdx - 1 + imgs.length) % imgs.length; }
            else if (outfits.length > 1) { idx = (idx - 1 + outfits.length) % outfits.length; imgIdx = 0; }
            render();
        } else if (e.key === 'ArrowRight') {
            if (imgs.length > 1) { imgIdx = (imgIdx + 1) % imgs.length; }
            else if (outfits.length > 1) { idx = (idx + 1) % outfits.length; imgIdx = 0; }
            render();
        }
    }
    document.addEventListener('keydown', keyH);
    render();
    getPopupLayer().appendChild(lb);
    lb.style.setProperty('pointer-events', 'auto', 'important');
}

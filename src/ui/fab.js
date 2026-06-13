// src/ui/fab.js — Floating Action Button (悬浮球)
import { FAB_ID } from '../constants.js';
import { load } from '../core/db.js';
import { getPopupLayer } from './popup-layer.js';
import { openPopup } from './popup.js';

// ── FAB（悬浮球）────────────────────────────────────────
var fabResizeHandler = null;

export function injectFab() {
    if (document.querySelector('.om-overlay')) return;
    if (document.getElementById(FAB_ID)) return;
    var d = load(); if (d.showBall === false) return;
    var container = document.createElement('div'); container.id = FAB_ID;
    var MAIN_SIZE = 38;
    var accent = 'var(--SmartThemeQuoteColor,#7c6daf)';

    function posFab() {
        var vh = window.innerHeight || document.documentElement.clientHeight;
        var vw = window.innerWidth || document.documentElement.clientWidth;
        var mainTop = vh - 80 - MAIN_SIZE; var mainLeft = vw - 16 - MAIN_SIZE;
        if (mainTop < 10) mainTop = 10; if (mainLeft < 10) mainLeft = 10;
        container.setAttribute('style',
            'position:fixed !important;top:' + mainTop + 'px !important;left:' + mainLeft + 'px !important;' +
            'z-index:2147483647 !important;display:flex !important;align-items:center !important;' +
            'pointer-events:none !important;margin:0 !important;padding:0 !important;');
    }

    var mainBtn = document.createElement('div'); mainBtn.id = 'om-fab-main-btn';
    mainBtn.innerHTML = '<i class="fa-solid fa-shirt" style="pointer-events:none;font-size:1.1em;"></i>';

    function styleMainBtn() {
        mainBtn.setAttribute('style',
            'width:' + MAIN_SIZE + 'px !important;height:' + MAIN_SIZE + 'px !important;border-radius:50% !important;' +
            'background:' + accent + ' !important;color:#fff !important;border:none !important;cursor:pointer !important;' +
            'display:flex !important;align-items:center !important;justify-content:center !important;' +
            'font-size:1.2em !important;box-shadow:0 4px 16px rgba(0,0,0,.35) !important;opacity:.9 !important;' +
            'visibility:visible !important;pointer-events:auto !important;margin:0 !important;padding:0 !important;' +
            'flex-shrink:0 !important;transition:transform .2s !important;position:relative !important;z-index:1 !important;');
    }
    styleMainBtn();

    container.appendChild(mainBtn);

    // 拖拽 + 点击判断
    var _dragState = { sx: 0, sy: 0, ox: 0, oy: 0, moved: false };
    mainBtn.addEventListener('touchstart', function (e) {
        var t = e.touches[0];
        _dragState.sx = t.clientX; _dragState.sy = t.clientY;
        var rect = container.getBoundingClientRect();
        _dragState.ox = rect.left; _dragState.oy = rect.top;
        _dragState.moved = false;
    }, { passive: true });
    mainBtn.addEventListener('touchmove', function (e) {
        var t = e.touches[0];
        var dx = t.clientX - _dragState.sx, dy = t.clientY - _dragState.sy;
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) _dragState.moved = true;
        if (_dragState.moved) {
            var nx = _dragState.ox + dx, ny = _dragState.oy + dy;
            var vw = window.innerWidth, vh = window.innerHeight;
            nx = Math.max(0, Math.min(nx, vw - MAIN_SIZE));
            ny = Math.max(0, Math.min(ny, vh - MAIN_SIZE));
            container.style.setProperty('left', nx + 'px', 'important');
            container.style.setProperty('top', ny + 'px', 'important');
        }
    }, { passive: true });
    mainBtn.addEventListener('touchend', function (e) {
        if (!_dragState.moved) {
            _dragState.handled = true;
            e.preventDefault(); // 阻止后续 click 事件
            // 延迟打开，等触摸事件完全结束
            setTimeout(function () { openPopup(); }, 50);
        }
    });
    // PC端点击
    mainBtn.addEventListener('click', function (e) {
        if (_dragState.handled) { _dragState.handled = false; return; }
        if (_dragState.moved) { _dragState.moved = false; return; }
        openPopup();
    });

    posFab();
    if (fabResizeHandler) window.removeEventListener('resize', fabResizeHandler);
    fabResizeHandler = posFab;
    window.addEventListener('resize', fabResizeHandler);
    document.body.appendChild(container);
}

export function closeFab() {
    var fab = document.getElementById(FAB_ID);
    if (fab && fab.parentNode) fab.parentNode.removeChild(fab);
}

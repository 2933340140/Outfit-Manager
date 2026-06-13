// ── 侧栏按钮 ──────────────────────────────────────────────
import { SCRIPT_NAME, BTN_ID } from '../constants.js';
import { load } from '../core/db.js';
import { getById, currentOwner, getViewActiveIds } from '../core/data.js';
import { esc } from '../utils/helpers.js';
import { openPopup } from './popup.js';

export function updateBtn() {
    var btn = document.getElementById(BTN_ID); if (!btn) return;
    var d = load();
    var names = []; d.activeIds.forEach(function (id) { var o = getById(d, id); if (o) names.push(o.name); });
    var span = btn.querySelector('span');
    if (span) {
        if (names.length === 0) span.textContent = SCRIPT_NAME;
        else if (names.length === 1) span.textContent = names[0];
        else span.textContent = '衣柜(' + names.length + '套)';
    }
    btn.style.color = names.length > 0 ? 'var(--SmartThemeQuoteColor)' : '';
}

export function findMenu() {
    var m = document.getElementById('extensionsMenu'); if (m) return m;
    m = document.getElementById('extensions_menu'); if (m) return m;
    var items = document.querySelectorAll('.list-group-item.interactable');
    for (var i = 0; i < items.length; i++) { var t = items[i].textContent || ''; if (t.indexOf('CSS') !== -1 || t.indexOf('头像框') !== -1 || t.indexOf('变量管理') !== -1) return items[i].parentElement; }
    return null;
}

export function injectBtn() {
    if (document.getElementById(BTN_ID)) return;
    var menu = findMenu(); if (!menu) return;
    var d = load(); var names = []; d.activeIds.forEach(function (id) { var o = getById(d, id); if (o) names.push(o.name); });
    var btn = document.createElement('div');
    btn.id = BTN_ID; btn.className = 'list-group-item flex-container flexGap5 interactable'; btn.title = SCRIPT_NAME;
    if (names.length > 0) btn.style.color = 'var(--SmartThemeQuoteColor)';
    btn.innerHTML = '<i class="fa-solid fa-shirt"></i><span>' + esc(names.length === 1 ? names[0] : names.length > 1 ? '衣柜(' + names.length + '套)' : SCRIPT_NAME) + '</span>';
    btn.addEventListener('click', openPopup);
    menu.appendChild(btn);
}

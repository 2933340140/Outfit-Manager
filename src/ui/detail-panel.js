import { load, save } from '../core/db.js';
import { currentOwner, getViewActiveIds, setViewActiveIds, getById } from '../core/data.js';
import { esc, genId } from '../utils/helpers.js';
import { getDarkMode } from './theme.js';
import { getPopupLayer } from './popup-layer.js';
import { toast } from '../utils/toast.js';

var detailPanelOpen = false;

// ── 选择详情面板 ─────────────────────────────────────────
export function toggleDetailPanel() {
    if (detailPanelOpen) { closeDetailPanel(); return; }
    var d = load();

    // 收集所有owner的激活穿搭，按owner分组
    var groups = [];
    var userNames = [];
    (d.activeIds || []).forEach(function (id) { var o = getById(d, id); if (o) userNames.push({ id: id, name: o.name }); });
    if (userNames.length > 0) groups.push({ owner: 'User', items: userNames });
    if (d.chars) {
        for (var cn in d.chars) {
            var cd = d.chars[cn];
            var charNames = [];
            (cd.activeIds || []).forEach(function (id) {
                for (var k = 0; k < (cd.outfits || []).length; k++) { if (cd.outfits[k].id === id) { charNames.push({ id: id, name: cd.outfits[k].name }); break; } }
            });
            if (charNames.length > 0) groups.push({ owner: cn, items: charNames });
        }
    }
    if (groups.length === 0) return;
    openDetailPanel(groups, d);
}

function openDetailPanel(groups, d) {
    closeDetailPanel();
    var bottombar = document.getElementById('om-bottombar'); if (!bottombar) return;
    detailPanelOpen = true;
    var panel = document.createElement('div');
    panel.id = 'om-detail-panel';
    panel.className = 'om-detail-panel';
    panel.style.cssText = 'position:absolute;bottom:100%;left:0;right:0;z-index:10;';

    var html = '<div class="om-detail-handle"></div>';
    groups.forEach(function (g) {
        html += '<div class="om-detail-title" style="margin-top:4px">' + esc(g.owner) + '</div>';
        html += '<div class="om-detail-tags">';
        g.items.forEach(function (w) {
            html += '<span class="om-detail-tag" data-id="' + w.id + '">' + esc(w.name) +
                '<button class="om-detail-tag-x" data-id="' + w.id + '">&#x2715;</button></span>';
        });
        html += '</div>';
    });
    panel.innerHTML = html;
    bottombar.appendChild(panel);
    panel.querySelectorAll('.om-detail-tag-x').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            var dd = load(); var id = btn.dataset.id;
            // 从所有owner中查找并移除
            var ai1 = (dd.activeIds || []).indexOf(id); if (ai1 !== -1) dd.activeIds.splice(ai1, 1);
            if (dd.chars) { for (var cn in dd.chars) { var cai = (dd.chars[cn].activeIds || []).indexOf(id); if (cai !== -1) dd.chars[cn].activeIds.splice(cai, 1); } }
            save(dd); updateBtn(); renderBottomStatus(); renderGrid();
            closeDetailPanel();
        });
    // 点击标签弹出可编辑框
    panel.querySelectorAll('.om-detail-tag').forEach(function (tag) {
        tag.addEventListener('click', function (e) {
            e.stopPropagation();
            if (e.target.closest('.om-detail-tag-x')) return;
            var id = tag.dataset.id;
            var dd = load(); var o = getById(dd, id); if (!o) return;
            closeDetailPanel();
            var darkMode = getDarkMode();
            // remove any stale modals before creating new one
            var mp_check = getPopupLayer(); var existings = mp_check.querySelectorAll('.om-modal'); existings.forEach(function(el) { el.remove(); });
            var modal = document.createElement('div'); modal.className = 'om-modal';
            var bg = darkMode ? '#1e1e24' : '#ececef'; var fg = darkMode ? '#eee' : '#111';
            modal.innerHTML = '<div class="om-modal-box" style="max-width:500px;background:' + bg + ';color:' + fg + '"><div class="om-modal-title" style="font-size:1.1em"><i class="fa-solid fa-pen-to-square"></i> ' + esc('编辑：' + o.name) + '</div>' +
                '<textarea id="om-edit-desc" style="width:100%;min-height:180px;margin-top:12px;background:rgba(127,127,127,.08);border:1px solid rgba(127,127,127,.3);border-radius:10px;padding:12px;font-size:.9em;line-height:1.75;color:' + fg + ';resize:vertical;font-family:inherit">' + (o.description || '') + '</textarea>' +
                '<div class="om-btn-row" style="margin-top:12px;gap:10px"><button class="om-btn om-btn-safe" id="om-edit-save"><i class="fa-solid fa-check"></i> 确认</button><button class="om-btn" id="om-edit-wardrobe" style="background:var(--SmartThemeQuoteColor,#7c6daf);color:#fff"><i class="fa-solid fa-box"></i> 保存到衣橱</button><button class="om-btn om-btn-outline" id="om-edit-close">关闭</button></div></div>';
            var mp = getPopupLayer(); modal.style.cssText = 'position:absolute !important;inset:0 !important;z-index:2 !important;background:rgba(0,0,0,.45) !important;display:flex !important;align-items:center !important;justify-content:center !important;padding:20px !important;box-sizing:border-box !important;pointer-events:auto !important;';
            mp.appendChild(modal);
            modal.addEventListener('click', function(ev) { if (ev.target === modal) modal.remove(); });
            modal.querySelector('#om-edit-save').addEventListener('click', function(e) {                     e.stopPropagation();                     var newDesc = modal.querySelector('#om-edit-desc').value;                     var dd2 = load(); var o2 = getById(dd2, id);                     if (o2) { o2.description = newDesc; save(dd2); }                     modal.remove();                     if (o2) { renderGrid(); renderBottomStatus(); updateBtn(); }                     toast('穿搭描述已更新');                 });
            modal.querySelector('#om-edit-close').addEventListener('click', function(e) { e.stopPropagation(); modal.remove(); });
            modal.querySelector('#om-edit-wardrobe').addEventListener('click', function(e) {                     e.stopPropagation();                     var newDesc = modal.querySelector('#om-edit-desc').value;                     var dd2 = load(); var o2 = getById(dd2, id);                     if (o2) {                         var saved = { id: genId(), name: o2.name, category: '世界书', type: 'outfit', style: o2.style || '', season: o2.season || '', sceneTag: o2.sceneTag || '', description: newDesc, imageData: o2.imageData || null, createdAt: Date.now() };                         dd2.outfits.push(saved);                         save(dd2); renderGrid(); updateBtn();                     }                     modal.remove(); toast('已保存到衣橱');                 });
        });
    });
    });
    // 点击底栏外关闭
    setTimeout(function () {
        document.addEventListener('click', outsideDetailClick, true);
    }, 10);
}

function outsideDetailClick(e) {
    var panel = document.getElementById('om-detail-panel');
    var statusEl = document.getElementById('om-bottom-status');
    if (panel && !panel.contains(e.target) && statusEl && !statusEl.contains(e.target)) {
        closeDetailPanel();
    }
}

export function closeDetailPanel() {
    detailPanelOpen = false;
    var p = document.getElementById('om-detail-panel'); if (p && p.parentNode) p.parentNode.removeChild(p);
    document.removeEventListener('click', outsideDetailClick, true);
}

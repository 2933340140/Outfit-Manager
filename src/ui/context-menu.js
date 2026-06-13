import { load, save } from '../core/db.js';
import { getById, isActive, getViewActiveIds, setViewActiveIds } from '../core/data.js';
import { esc, hasImages } from '../utils/helpers.js';
import { toast } from '../utils/toast.js';
import { getDarkMode } from './theme.js';
import { createSheet, closeSheet } from './sheet-utils.js';
import { openEditSheet } from './sheets.js';
import { openLightbox } from './lightbox.js';
import { renderGrid, renderCatbar } from './popup.js';
import { renderBottomStatus } from './bottom-status.js';
import { generateSingleDescription } from '../ai/vision.js';
import { _cleanOutfitResult } from '../ai/generator.js';

// ── 长按操作菜单 Bottom Sheet ─────────────────────────────
export function openContextMenu(outfit, imgOutfits) {
    if (!outfit) return;
    var d = load();
    var isOn = isActive(d, outfit.id);

    var sheet = createSheet([
        '<div class="om-ctx-outfit-name"><i class="fa-solid fa-shirt" style="margin-right:6px;opacity:.5;"></i>' + esc(outfit.name) + '</div>',
        isOn
            ? '<div class="om-ctx-item" id="om-ctx-wear"><i class="fa-solid fa-circle-xmark"></i>取消选择</div>'
            : '<div class="om-ctx-item" id="om-ctx-wear"><i class="fa-solid fa-circle-check"></i>选择穿搭</div>',
        hasImages(outfit) ? '<div class="om-ctx-item" id="om-ctx-view"><i class="fa-solid fa-expand"></i>查看大图</div>' : '',
        '<div class="om-ctx-item" id="om-ctx-edit"><i class="fa-solid fa-pen"></i>编辑</div>',
        hasImages(outfit) ? '<div class="om-ctx-item" id="om-ctx-aidesc"><i class="fa-solid fa-wand-magic-sparkles"></i>AI 生成描述</div>' : '',
        '<div class="om-ctx-item danger" id="om-ctx-del"><i class="fa-solid fa-trash"></i>删除</div>',
    ].join(''));

    var wearEl = sheet.querySelector('#om-ctx-wear');
    if (wearEl) wearEl.addEventListener('click', function () {
        closeSheet(sheet);
        var dd = load();
        var aids = getViewActiveIds(dd);
        var idx = aids.indexOf(outfit.id);
        if (idx !== -1) aids.splice(idx, 1); else aids.push(outfit.id);
        setViewActiveIds(dd, aids);
        save(dd); updateBtn(); renderBottomStatus(); renderGrid();
        closeDetailPanel();
    });

    var viewEl = sheet.querySelector('#om-ctx-view');
    if (viewEl) viewEl.addEventListener('click', function () {
        closeSheet(sheet);
        openLightbox(imgOutfits, outfit.id);
    });

    var editEl = sheet.querySelector('#om-ctx-edit');
    if (editEl) editEl.addEventListener('click', function () {
        closeSheet(sheet);
        openEditSheet(outfit, outfit.category || '');
    });

    var aidescEl = sheet.querySelector('#om-ctx-aidesc');
    if (aidescEl) aidescEl.addEventListener('click', function () {
        var dd = load();
        if (!dd.apiVision.endpoint || !dd.apiVision.key || !dd.apiVision.model) {
            toast('请先在设置中配置"描述生成 API"', true); closeSheet(sheet); return;
        }
        aidescEl.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>生成中...';
        aidescEl.style.pointerEvents = 'none';
        generateSingleDescription(outfit, function (err, desc) {
            closeSheet(sheet);
            if (err) { toast('生成失败：' + err, true); return; }
            var dd2 = load(); var o = getById(dd2, outfit.id);
            if (o) { o.description = desc; save(dd2); }
            toast('✅ 描述已生成：' + outfit.name);
            renderGrid();
        });
    });

    var delEl = sheet.querySelector('#om-ctx-del');
    if (delEl) delEl.addEventListener('click', function () {
        closeSheet(sheet);
        if (!confirm('确定删除「' + outfit.name + '」？')) return;
        var dd = load();
        dd.outfits = dd.outfits.filter(function (o) { return o.id !== outfit.id; });
        // 也从chars中查找并删除
        if (dd.chars) { for (var cn in dd.chars) { dd.chars[cn].outfits = (dd.chars[cn].outfits || []).filter(function (o) { return o.id !== outfit.id; }); var cai = (dd.chars[cn].activeIds || []).indexOf(outfit.id); if (cai !== -1) dd.chars[cn].activeIds.splice(cai, 1); } }
        var ai = (dd.activeIds || []).indexOf(outfit.id); if (ai !== -1) dd.activeIds.splice(ai, 1);
        save(dd); updateBtn(); renderBottomStatus(); renderGrid(); toast('已删除');
    });
}

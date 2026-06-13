// ── Main Popup: openPopup, closePopup, renderViewbar, renderCharDropdown,
//    addCharPrompt, renderCatbar, renderGrid ────────────────────────────

import { def, SCRIPT_NAME } from '../constants.js';
import { load, save, getSTContextSafe } from '../core/db.js';
import { getCharData, currentOwner, getViewOutfits, getViewCategories, getViewActiveIds, setViewActiveIds, getById, getViewById, isActive } from '../core/data.js';
import { genId, esc, getFirstImage, hasImages } from '../utils/helpers.js';
import { toast } from '../utils/toast.js';
import { compressImage } from '../utils/image.js';
import { getDarkMode, setDarkMode } from './theme.js';
import { getPopupLayer } from './popup-layer.js';
import { injectStyles } from './styles.js';
import { getWorldBookStyles, getActiveWorldBookNames, getSelectedWorldBookNames, refreshWorldBookStyles, getWorldBookStyleCache, createWorldBookOutfit, worldBookStyleMatchesScene, materializeWorldBookStyle, setWorldBookStylesLoaded } from '../worldbook/worldbook.js';
import { parseAutoTagResult } from '../ai/auto-tag.js';
import { _cleanOutfitResult, tryGenerateAIDescription } from '../ai/generator.js';
import { callVisionAPI, openModelPicker, batchGenerateDescriptions, generateSingleDescription } from '../ai/vision.js';
import { openContextMenu } from './context-menu.js';
import { openEditSheet, openBatchAddSheet, openRandomRoll, openPresetsSheet, openSettingsSheet } from './sheets.js';
import { openBatchDescModal, exportData, importData } from './modals.js';
import { openBatchParseModal, openBatchAutoTagModal } from './sheets.js';
import { toggleDetailPanel, closeDetailPanel } from './detail-panel.js';
import { renderQuickScenes } from './quick-scenes.js';
import { renderBottomStatus } from './bottom-status.js';
import { injectFab, closeFab } from './fab.js';
import { updateBtn } from './ui-bar.js';

// ── Module-level state ──────────────────────────────────────────────
var curCat = '__all__';
var curType = '__all__';
var batchMode = false;
var batchSelected = [];
var searchQuery = '';
var searchOpen = false;
var detailPanelOpen = false;
var charPanelExpanded = false;
var collapsedGroups = {};
var wbMode = false;

// ── State accessors ─────────────────────────────────────────────────
export function getCurCat() { return curCat; }
export function setCurCat(v) { curCat = v; }
export function getCurType() { return curType; }
export function setCurType(v) { curType = v; }
export function getBatchMode() { return batchMode; }
export function setBatchMode(v) { batchMode = v; }
export function getBatchSelected() { return batchSelected; }
export function setBatchSelected(v) { batchSelected = v; }
export function getSearchQuery() { return searchQuery; }
export function setSearchQuery(v) { searchQuery = v; }
export function getSearchOpen() { return searchOpen; }
export function setSearchOpen(v) { searchOpen = v; }
export function getWbMode() { return wbMode; }
export function setWbMode(v) { wbMode = v; }
export function getCharPanelExpanded() { return charPanelExpanded; }
export function setCharPanelExpanded(v) { charPanelExpanded = v; }
export function getCollapsedGroups() { return collapsedGroups; }

// ── 打开全屏主界面 ────────────────────────────────────────
export function openPopup() {
    if (document.querySelector('.om-overlay')) return;
    // 防止悬浮球点击事件穿透到面板下方的元素
    var shield = document.createElement('div');
    shield.setAttribute('style', 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:2147483646;');
    shield.addEventListener('touchstart', function (e) { e.preventDefault(); e.stopPropagation(); }, { passive: false });
    shield.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); }, { passive: false });
    document.body.appendChild(shield);
    setTimeout(function () { if (shield.parentNode) shield.parentNode.removeChild(shield); }, 400);

    injectStyles();
    batchMode = false; batchSelected = []; searchQuery = ''; searchOpen = false; detailPanelOpen = false;

    var ov = document.createElement('div');
    var darkMode = getDarkMode();
    ov.className = 'om-overlay ' + (darkMode ? 'om-dark' : 'om-light');
    ov.setAttribute('style', 'position:fixed !important;top:0 !important;left:0 !important;right:0 !important;bottom:0 !important;z-index:2147483646 !important;');

    ov.innerHTML =
        '<div class="om-box">' +
        // 顶栏
        '<div class="om-head">' +
        '<div class="om-head-title"><i class="fa-solid fa-shirt"></i>' + SCRIPT_NAME + '</div>' +
        '<div class="om-head-actions">' +
        '<button class="om-icon-btn" id="om-search-toggle" title="搜索"><i class="fa-solid fa-magnifying-glass"></i></button>' +
        '<button class="om-theme-btn" id="om-theme-toggle"><i class="fa-solid fa-circle-half-stroke"></i></button>' +
        '<button class="om-icon-btn" id="om-x" title="关闭"><i class="fa-solid fa-xmark"></i></button>' +
        '</div></div>' +
        // 搜索栏（默认隐藏）
        '<div class="om-search-bar" id="om-search-bar">' +
        '<div class="om-search-wrap"><i class="fa-solid fa-magnifying-glass"></i>' +
        '<input class="om-search-inp" id="om-search-inp" type="text" placeholder="搜索名称或标签…" autocomplete="off" /></div>' +
        '<button class="om-search-clear" id="om-search-clear" title="关闭搜索"><i class="fa-solid fa-xmark"></i></button>' +
        '</div>' +
        // 视角切换栏（User / Char）
        '<div class="om-viewbar" id="om-viewbar"></div>' +
        // 分类栏
        '<div class="om-catbar" id="om-catbar"></div>' +
        // 场景快捷栏
        '<div class="om-quick-scenes" id="om-quick-scenes"></div>' +
        // 网格区
        '<div class="om-grid-area" id="om-grid-area"></div>' +
        // 底栏
        '<div class="om-bottombar" id="om-bottombar" style="position:relative;">' +
        '<div class="om-bottom-status" id="om-bottom-status"></div>' +
        '<button class="om-batch-toggle-btn" id="om-batch-toggle">多选</button>' +
        '<button class="om-bottom-btn" id="om-bottom-presets" title="预设"><i class="fa-solid fa-bookmark"></i></button>' +
        '<button class="om-bottom-btn" id="om-bottom-roll" title="随机搭配"><i class="fa-solid fa-dice"></i></button>' +
        '<button class="om-bottom-btn" id="om-bottom-settings" title="设置"><i class="fa-solid fa-sliders"></i></button>' +
        '</div>' +
        '</div>' +
        '<div id="om-popup-slot" style="position:absolute;inset:0;z-index:999;pointer-events:none;"></div>';

    document.body.appendChild(ov);
    renderQuickScenes(load());

    // 绑定顶栏
    ov.querySelector('#om-x').addEventListener('click', closePopup);
    ov.querySelector('#om-theme-toggle').addEventListener('click', function () {
        darkMode = !darkMode;
        setDarkMode(darkMode);
        var overlay = document.querySelector('.om-overlay');
        if (overlay) {
            overlay.classList.toggle('om-dark', darkMode);
            overlay.classList.toggle('om-light', !darkMode);
        }
        var btn = ov.querySelector('#om-theme-toggle');
        if (btn) btn.innerHTML = darkMode
            ? '<i class="fa-solid fa-circle-half-stroke"></i>'
            : '<i class="fa-regular fa-sun"></i>';
    });
    ov.querySelector('#om-search-toggle').addEventListener('click', function () {
        searchOpen = !searchOpen;
        var bar = document.getElementById('om-search-bar');
        bar.classList.toggle('open', searchOpen);
        if (searchOpen) { setTimeout(function () { var i = document.getElementById('om-search-inp'); if (i) i.focus(); }, 50); }
        else { searchQuery = ''; renderGrid(); }
    });
    ov.querySelector('#om-search-clear').addEventListener('click', function () {
        searchOpen = false;
        searchQuery = '';
        var bar = document.getElementById('om-search-bar');
        bar.classList.remove('open');
        renderGrid();
    });
    var sinp = ov.querySelector('#om-search-inp');
    sinp.addEventListener('input', function () { searchQuery = sinp.value; renderGrid(); });
    sinp.addEventListener('keydown', function (e) { if (e.key === 'Escape') { searchOpen = false; searchQuery = ''; ov.querySelector('#om-search-bar').classList.remove('open'); renderGrid(); } });

    // 绑定底栏
    ov.querySelector('#om-bottom-status').addEventListener('click', function () { toggleDetailPanel(); });
    ov.querySelector('#om-batch-toggle').addEventListener('click', function () {
        batchMode = !batchMode; batchSelected = [];
        ov.querySelector('#om-batch-toggle').classList.toggle('on', batchMode);
        renderGrid();
    });
    ov.querySelector('#om-bottom-presets').addEventListener('click', function () { openPresetsSheet(); });
    ov.querySelector('#om-bottom-settings').addEventListener('click', function () { openSettingsSheet(); });
    ov.querySelector('#om-bottom-roll').addEventListener('click', function () { openRandomRoll(); });

    renderViewbar();
    renderCatbar();
    renderGrid();
    renderBottomStatus();
    setTimeout(function () { renderQuickScenes(load()); }, 300);
    setTimeout(function () { renderQuickScenes(load()); }, 1200);
    closeFab();
}

// ── 关闭主界面 ────────────────────────────────────────────
export function closePopup() {
    var ov = document.querySelector('.om-overlay'); if (ov) ov.parentNode.removeChild(ov);
    injectFab();
}

// ── 视角切换栏渲染 ─────────────────────────────────────────
export function renderViewbar() {
    var vbar = document.getElementById('om-viewbar'); if (!vbar) return;
    var d = load();
    var isUser = d.currentView !== 'char';
    vbar.style.position = 'relative';

    var html = '<button class="om-viewtab' + (isUser ? ' on' : '') + '" data-v="user"><i class="fa-solid fa-user" style="margin-right:4px"></i>User</button>' +
        '<button class="om-viewtab' + (!isUser ? ' on' : '') + '" data-v="char"><i class="fa-solid fa-masks-theater" style="margin-right:4px"></i>角色</button>' +
        '<button class="om-viewtab" id="om-wb-toggle" title="混合世界书风格"><i class="fa-solid fa-book" style="margin-right:4px"></i>世界书</button>';

    if (!isUser) {
        html += '<input type="text" class="om-char-input" id="om-char-input" placeholder="' + (d.currentChar ? esc(d.currentChar) : '搜索角色…') + '" autocomplete="off" />' +
            '<button class="om-char-add-btn" id="om-char-add" title="添加角色">+</button>';
    }

    vbar.innerHTML = html;

    vbar.querySelectorAll('.om-viewtab').forEach(function (tab) {
        tab.addEventListener('click', function () {
            var dd = load();
            dd.currentView = tab.dataset.v;
            save(dd);
            charPanelExpanded = false;
            renderViewbar(); renderCatbar(); renderGrid(); renderBottomStatus();
        });
    });

    var wbBtn = vbar.querySelector('#om-wb-toggle'); if (wbBtn) { wbBtn.classList.toggle('on', wbMode); wbBtn.addEventListener('click', function() { wbMode = !wbMode; vbar.querySelector('#om-wb-toggle').classList.toggle('on', wbMode); renderGrid(); }); }

    if (!isUser) {
        var inp = vbar.querySelector('#om-char-input');
        inp.addEventListener('focus', function () {
            charPanelExpanded = true;
            renderCharDropdown(vbar, load(), '');
        });
        inp.addEventListener('input', function () {
            charPanelExpanded = true;
            renderCharDropdown(vbar, load(), this.value.trim().toLowerCase());
        });
        vbar.querySelector('#om-char-add').addEventListener('click', function () { addCharPrompt(); });
        if (charPanelExpanded) renderCharDropdown(vbar, d, '');
    }
}

// ── 角色下拉列表 ───────────────────────────────────────────
export function renderCharDropdown(vbar, d, query) {
    var old = vbar.querySelector('.om-char-dropdown');
    if (old) old.parentNode.removeChild(old);

    var favs = d.charFavorites || [];
    var groups = d.charGroups || {};
    var allNames = d.charNames || [];
    var matchedGroupKeys = {};
    if (query) { for (var gg in groups) { if (gg.toLowerCase().indexOf(query) !== -1) matchedGroupKeys[gg] = true; } }

    function visible(cn) {
        if (!query) return true;
        if (cn.toLowerCase().indexOf(query) !== -1) return true;
        for (var gg2 in matchedGroupKeys) { if ((groups[gg2] || []).indexOf(cn) !== -1) return true; }
        return false;
    }

    var inGroup = {};
    for (var gn in groups) { (groups[gn] || []).forEach(function (n) { inGroup[n] = true; }); }

    function makeRow(cn) {
        if (!visible(cn)) return '';
        var isFav = favs.indexOf(cn) !== -1;
        var isActive = d.currentChar === cn;
        var cd = d.chars && d.chars[cn] ? d.chars[cn] : { outfits: [] };
        var count = (cd.outfits || []).length;
        return '<div class="om-char-row' + (isActive ? ' active' : '') + '" data-cn="' + esc(cn) + '">' +
            '<i class="fa-' + (isFav ? 'solid' : 'regular') + ' fa-star om-char-star' + (isFav ? ' on' : '') + '" data-cn="' + esc(cn) + '"></i>' +
            '<span class="om-char-rname">' + esc(cn) + '</span>' +
            '<span class="om-char-count">' + count + '套</span>' +
            '<div class="om-char-actions">' +
            '<button class="om-char-act om-char-rename" data-cn="' + esc(cn) + '" title="重命名"><i class="fa-solid fa-pen"></i></button>' +
            '<button class="om-char-act om-char-move-group" data-cn="' + esc(cn) + '" title="分组"><i class="fa-solid fa-folder"></i></button>' +
            '<button class="om-char-act om-char-delete" data-cn="' + esc(cn) + '" title="删除" style="color:#e57373"><i class="fa-solid fa-trash"></i></button>' +
            '</div></div>';
    }

    function makeSection(title, iconClass, names, gkey) {
        var visNames = names.filter(visible);
        if (visNames.length === 0) return '';
        var isCollapsed = collapsedGroups[gkey];
        var html = '<div class="om-char-group-hdr" data-gkey="' + esc(gkey) + '">' +
            '<i class="fa-solid fa-chevron-down om-g-arrow' + (isCollapsed ? ' collapsed' : '') + '"></i>' +
            '<i class="' + iconClass + ' om-g-icon"></i> ' + esc(title) +
            ' <span style="opacity:.4">(' + visNames.length + ')</span></div>';
        if (!isCollapsed) { visNames.forEach(function (cn) { html += makeRow(cn); }); }
        return html;
    }

    var listHtml = '';
    var favNames = allNames.filter(function (n) { return favs.indexOf(n) !== -1; });
    listHtml += makeSection('收藏', 'fa-solid fa-star', favNames, '__fav__');
    for (var gn2 in groups) {
        var gNames = (groups[gn2] || []).filter(function (n) { return allNames.indexOf(n) !== -1; });
        listHtml += makeSection(gn2, 'fa-solid fa-folder', gNames, 'g_' + gn2);
    }
    var ungrouped = allNames.filter(function (n) { return !inGroup[n] && favs.indexOf(n) === -1; });
    if (ungrouped.length > 0) {
        var ugLabel = (favNames.length > 0 || Object.keys(groups).length > 0) ? '未分组' : '全部角色';
        listHtml += makeSection(ugLabel, 'fa-regular fa-folder-open', ungrouped, '__ungrouped__');
    }
    if (allNames.length === 0) listHtml = '<div class="om-char-empty">还没有角色，点 + 添加</div>';

    var dropdown = document.createElement('div');
    dropdown.className = 'om-char-dropdown';
    dropdown.innerHTML = listHtml;
    vbar.appendChild(dropdown);

    // 分组折叠
    dropdown.querySelectorAll('.om-char-group-hdr').forEach(function (hdr) {
        hdr.addEventListener('click', function () {
            collapsedGroups[hdr.dataset.gkey] = !collapsedGroups[hdr.dataset.gkey];
            renderCharDropdown(vbar, load(), query);
        });
    });
    // 选中角色
    dropdown.querySelectorAll('.om-char-row').forEach(function (row) {
        row.addEventListener('click', function (e) {
            if (e.target.closest('.om-char-star') || e.target.closest('.om-char-actions')) return;
            var dd = load(); dd.currentChar = row.dataset.cn; save(dd);
            charPanelExpanded = false;
            renderViewbar(); renderCatbar(); renderGrid(); renderBottomStatus();
        });
    });
    // 收藏
    dropdown.querySelectorAll('.om-char-star').forEach(function (star) {
        star.addEventListener('click', function (e) {
            e.stopPropagation();
            var dd = load(); if (!dd.charFavorites) dd.charFavorites = [];
            var cn = star.dataset.cn; var idx = dd.charFavorites.indexOf(cn);
            if (idx !== -1) dd.charFavorites.splice(idx, 1); else dd.charFavorites.push(cn);
            save(dd); renderCharDropdown(vbar, load(), query);
        });
    });
    // 重命名
    dropdown.querySelectorAll('.om-char-rename').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.stopPropagation(); var cn = btn.dataset.cn;
            var nw = prompt('重命名角色「' + cn + '」：', cn);
            if (!nw || !nw.trim() || nw.trim() === cn) return; nw = nw.trim();
            var dd = load();
            if (dd.charNames.indexOf(nw) !== -1) { toast('角色「' + nw + '」已存在', true); return; }
            var idx = dd.charNames.indexOf(cn); if (idx !== -1) dd.charNames[idx] = nw;
            if (dd.chars && dd.chars[cn]) { dd.chars[nw] = dd.chars[cn]; delete dd.chars[cn]; }
            if (dd.charFavorites) { var fi = dd.charFavorites.indexOf(cn); if (fi !== -1) dd.charFavorites[fi] = nw; }
            if (dd.charGroups) { for (var g in dd.charGroups) { var gi = dd.charGroups[g].indexOf(cn); if (gi !== -1) dd.charGroups[g][gi] = nw; } }
            if (dd.currentChar === cn) dd.currentChar = nw;
            save(dd); renderViewbar(); renderCatbar(); renderGrid(); toast('已重命名为「' + nw + '」');
        });
    });
    // 分组移动
    dropdown.querySelectorAll('.om-char-move-group').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.stopPropagation(); var cn = btn.dataset.cn; var dd = load();
            if (!dd.charGroups) dd.charGroups = {};
            var gNamesList = Object.keys(dd.charGroups);
            if (gNamesList.length === 0) {
                var gname = prompt('还没有分组，输入新分组名称：');
                if (!gname || !gname.trim()) return;
                dd.charGroups[gname.trim()] = [cn]; save(dd); renderCharDropdown(vbar, load(), query);
                toast('已创建分组并移入'); return;
            }
            var currentGroup = '';
            for (var g in dd.charGroups) { if ((dd.charGroups[g] || []).indexOf(cn) !== -1) { currentGroup = g; break; } }
            var msg = '将「' + cn + '」移到：\n0. 不分组' + (currentGroup ? '（当前：' + currentGroup + '）' : '') + '\n';
            gNamesList.forEach(function (g, i) { msg += (i + 1) + '. ' + g + '\n'; });
            msg += (gNamesList.length + 1) + '. 新建分组';
            var choice = prompt(msg); if (choice === null) return;
            var ci = parseInt(choice);
            for (var g2 in dd.charGroups) { var ri = dd.charGroups[g2].indexOf(cn); if (ri !== -1) dd.charGroups[g2].splice(ri, 1); }
            if (ci > 0 && ci <= gNamesList.length) { dd.charGroups[gNamesList[ci - 1]].push(cn); toast('已移入「' + gNamesList[ci - 1] + '」'); }
            else if (ci === gNamesList.length + 1) { var ng = prompt('新分组名称：'); if (ng && ng.trim()) { dd.charGroups[ng.trim()] = [cn]; toast('已创建分组并移入'); } }
            else { toast('已移出分组'); }
            save(dd); renderCharDropdown(vbar, load(), query);
        });
    });
    // 删除
    dropdown.querySelectorAll('.om-char-delete').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.stopPropagation(); var cn = btn.dataset.cn;
            if (!confirm('删除角色「' + cn + '」及其所有穿搭？')) return;
            var dd = load();
            if (dd.chars) delete dd.chars[cn];
            var idx = dd.charNames.indexOf(cn); if (idx !== -1) dd.charNames.splice(idx, 1);
            if (dd.charFavorites) { var fi = dd.charFavorites.indexOf(cn); if (fi !== -1) dd.charFavorites.splice(fi, 1); }
            if (dd.charGroups) { for (var g in dd.charGroups) { var gi = dd.charGroups[g].indexOf(cn); if (gi !== -1) dd.charGroups[g].splice(gi, 1); } }
            if (dd.currentChar === cn) dd.currentChar = '';
            save(dd); renderViewbar(); renderCatbar(); renderGrid(); renderBottomStatus(); toast('已删除角色「' + cn + '」');
        });
    });
    // 点击外部关闭
    function closeOnOutside(e) {
        if (!vbar.contains(e.target)) {
            charPanelExpanded = false;
            var dd2 = vbar.querySelector('.om-char-dropdown');
            if (dd2) dd2.parentNode.removeChild(dd2);
            document.removeEventListener('click', closeOnOutside, true);
        }
    }
    setTimeout(function () { document.addEventListener('click', closeOnOutside, true); }, 50);
}

// ── 添加角色提示 ───────────────────────────────────────────
export function addCharPrompt() {
    var name = prompt('输入角色名：');
    if (!name || !name.trim()) return; name = name.trim();
    var dd = load();
    if (!dd.charNames) dd.charNames = [];
    if (dd.charNames.indexOf(name) !== -1) { toast('角色「' + name + '」已存在', true); return; }
    dd.charNames.push(name); dd.currentChar = name; save(dd);
    charPanelExpanded = false;
    renderViewbar(); renderCatbar(); renderGrid(); renderBottomStatus();
    toast('✅ 已添加角色「' + name + '」');
}

export function renderCharPanel() { /* 兼容 */ }

// ── 分类栏渲染 ────────────────────────────────────────────
export function renderCatbar() {
    var catbar = document.getElementById('om-catbar'); if (!catbar) return;
    var d = load(); var cats = getViewCategories(d); var allOutfits = getViewOutfits(d);
    var outfitCats = {}; var itemCats = {};
    allOutfits.forEach(function (o) { var c = o.category || ''; if (!o.type || o.type === 'outfit') { if (c) outfitCats[c] = true; } else { if (c) itemCats[c] = true; } });
    if (cats.length === 0) { catbar.style.display = 'none'; return; }
    catbar.style.display = '';
    var html = '<button class="om-catbtn om-typebtn"' + (curType === '__all__' ? ' on' : '') + ' data-t="__all__">全部</button>';
    html += '<button class="om-catbtn om-typebtn"' + (curType === 'outfit' ? ' on' : '') + ' data-t="outfit"><i class="fa-solid fa-shirt"></i> 套装</button>';
    html += '<button class="om-catbtn om-typebtn"' + (curType === 'item' ? ' on' : '') + ' data-t="item"><i class="fa-solid fa-box"></i> 单品</button>';
    html += '<span style="width:1px;height:20px;background:rgba(127,127,127,.2);flex-shrink:0;margin:0 2px;align-self:center"></span>';
    cats.forEach(function (c) {
        var show = true;
        if (curType === 'outfit' && !outfitCats[c]) show = false;
        if (curType === 'item' && !itemCats[c]) show = false;
        if (show) html += '<button class="om-catbtn"' + (curCat === c ? ' on' : '') + ' data-c="' + esc(c) + '">' + esc(c) + '</button>';
    });
    catbar.innerHTML = html;
    catbar.querySelectorAll('.om-typebtn').forEach(function (btn) { btn.addEventListener('click', function () { curType = btn.dataset.t; curCat = '__all__'; renderCatbar(); renderGrid(); }); });
    catbar.querySelectorAll('.om-catbtn:not(.om-typebtn)').forEach(function (btn) { btn.addEventListener('click', function () { curCat = btn.dataset.c; renderCatbar(); renderGrid(); }); });
    if (!catbar._wheelBound) {
        catbar.addEventListener('wheel', function (e) { if (Math.abs(e.deltaY) > 0) { e.preventDefault(); catbar.scrollLeft += e.deltaY; } }, { passive: false });
        var _drag = { down: false, startX: 0, scrollL: 0 };
        catbar.addEventListener('mousedown', function (e) { _drag.down = true; _drag.startX = e.pageX; _drag.scrollL = catbar.scrollLeft; catbar.style.cursor = 'grabbing'; catbar.style.userSelect = 'none'; });
        document.addEventListener('mousemove', function (e) { if (!_drag.down) return; catbar.scrollLeft = _drag.scrollL - (e.pageX - _drag.startX); });
        document.addEventListener('mouseup', function () { if (_drag.down) { _drag.down = false; catbar.style.cursor = ''; catbar.style.userSelect = ''; } });
        catbar._wheelBound = true;
    }
}

// ── 网格区渲染 ────────────────────────────────────────────
export function renderGrid() {
    var area = document.getElementById('om-grid-area'); if (!area) return;
    var d = load();

    // 如果是角色视角但没选角色，显示提示
    if (d.currentView === 'char' && !d.currentChar) {
        area.innerHTML = '<div class="om-empty"><i class="fa-solid fa-masks-theater"></i><span>请先选择或添加一个角色</span></div>';
        return;
    }

    // 当前视角的穿搭
    var allOutfits = getViewOutfits(d);

    // 按分类过滤
    var list = curCat === '__all__' ? allOutfits : allOutfits.filter(function (o) { return o.category === curCat; });
    if (curType !== '__all__') list = list.filter(function (o) { return curType === 'outfit' ? (!o.type || o.type === 'outfit') : o.type === 'item'; });
    if (searchQuery) {
        var q = searchQuery.toLowerCase();
        list = list.filter(function (o) {
            return (o.name && o.name.toLowerCase().indexOf(q) !== -1) ||
                (o.category && o.category.toLowerCase().indexOf(q) !== -1) ||
                (o.sceneTag && o.sceneTag.toLowerCase().indexOf(q) !== -1) ||
                (o.description && o.description.toLowerCase().indexOf(q) !== -1);
        });
    }
    var imgOutfits = list.filter(function (o) { return hasImages(o); });

    var html = '';

    // 批量操作栏
    if (batchMode) {
        html += '<div class="om-batch-bar">' +
            '<span class="om-batch-info">已选&nbsp;<b id="om-batch-count">' + batchSelected.length + '</b>&nbsp;套</span>' +
            '<div class="om-batch-divider" style="width:1px;height:16px;background:rgba(127,127,127,.25);flex-shrink:0;margin:0 2px;"></div>' +
            '<div class="om-batch-acts">' +
            '<button class="om-batch-btn" id="om-batch-selall">全选</button>' +
            '<button class="om-batch-btn" id="om-batch-none">取消</button>' +
            '<button class="om-batch-btn" id="om-batch-cat"><i class="fa-solid fa-folder"></i> 分类</button>' +
            '<button class="om-batch-btn" id="om-batch-tag"><i class="fa-solid fa-tag"></i> 标签</button>' +
            '<button class="om-batch-btn" id="om-batch-aidesc"><i class="fa-solid fa-wand-magic-sparkles"></i> AI描述</button>' +
            '<button class="om-batch-btn" id="om-batch-paste"><i class="fa-solid fa-paste"></i> 批量粘贴</button>' +
            '<button class="om-batch-btn" id="om-batch-parse"><i class="fa-solid fa-list-check"></i> 单品解析</button>' +
            '<button class="om-batch-btn" id="om-batch-autotag"><i class="fa-solid fa-wand-magic-sparkles"></i> 一键识别</button>' +
            '<button class="om-batch-btn danger" id="om-batch-del"><i class="fa-solid fa-trash"></i> 删除</button>' +
            '</div></div>';
    }

    html += '<div class="om-grid">';

    // 添加卡（仅非批量模式）
    if (!batchMode) {
        html += '<div class="om-add-card" id="om-addcard"><i class="fa-solid fa-plus"></i><span>添加穿搭</span></div>';
        html += '<div class="om-batch-add-card" id="om-batchaddcard"><i class="fa-solid fa-images"></i><span>批量添加</span></div>';
    }

    // 世界书模式：混入虚拟穿搭
    if (wbMode && curCat !== '__all__') {
        // Only mix in when viewing a specific category, not ''all''
        var wbMatching = getWorldBookStyles().filter(function(ws) {
            return ws.scene === curCat || ws.style === curCat;
        });
        wbMatching.forEach(function(ws, wi) {
            list.push({ id: 'wb_grid_' + wi, name: ws.name, category: curCat, type: 'outfit', style: ws.style, season: ws.season, sceneTag: ws.scene, description: ws.desc, images: [], isVirtual: true });
        });
    }
    if (list.length === 0) {
        html += '</div><div class="om-empty"><i class="fa-solid fa-shirt"></i><span>' +
            (searchQuery ? '没有匹配「' + esc(searchQuery) + '」的穿搭' : (curCat !== '__all__' ? '该分类暂无穿搭' : '还没有穿搭，点击左上角添加')) +
            '</span></div>';
    } else {
        list.forEach(function (o) {
            var on = isActive(d, o.id);
            var bsel = batchSelected.indexOf(o.id) !== -1;
            var checkBox = batchMode ? '<div class="om-card-check' + (bsel ? ' checked' : '') + '" data-id="' + o.id + '"><i class="fa-solid fa-check"></i></div>' : '';
            var badge = (on && !batchMode) ? '<div class="om-badge-on"><i class="fa-solid fa-check"></i></div>' : '';

            var imgContent = '';
            if (hasImages(o)) {
                imgContent = '<img src="' + getFirstImage(o) + '" alt="' + esc(o.name) + '" />';
            } else {
                var descPreview = (o.description && o.description.trim()) ? o.description.trim() : '';
                imgContent = '<div class="om-card-noimg">' +
                    '<div class="om-noimg-name">' + esc(o.name) + '</div>' +
                    (descPreview ? '<div class="om-noimg-desc">' + esc(descPreview) + '</div>' : '') +
                    '<i class="fa-regular fa-file-lines om-noimg-icon"></i>' +
                    '</div>';
            }

            var menuBtn = batchMode ? '' : '<button class="om-card-menu" data-id="' + o.id + '" title="操作"><i class="fa-solid fa-ellipsis-vertical"></i></button>';
            var tagText = (o.sceneTag && o.sceneTag.trim()) ? o.sceneTag.trim() : '';
            html += '<div class="om-card' + (on ? ' on' : '') + (bsel ? ' batch-sel' : '') + (hasImages(o) ? '' : ' no-img') + '" data-id="' + o.id + '">' +
                '<div class="om-card-img">' +
                checkBox + imgContent + badge + menuBtn +
                '</div>' +
                '<div class="om-card-info">' +
                '<div class="om-card-name">' + esc(o.name) + '</div>' +
                (tagText ? '<div class="om-card-tag">' + esc(tagText) + '</div>' : '') +
                '</div>' +
                '</div>';
        });
        html += '</div>';
    }

    area.innerHTML = html;

    // 添加卡点击
    var ac = area.querySelector('#om-addcard');
    if (ac) ac.addEventListener('click', function () { openEditSheet(null, curCat !== '__all__' ? curCat : ''); });
    var bac = area.querySelector('#om-batchaddcard');
    if (bac) bac.addEventListener('click', function () { openBatchAddSheet(curCat !== '__all__' ? curCat : ''); });

    // 批量操作
    if (batchMode) {
        var selall = area.querySelector('#om-batch-selall');
        var selnone = area.querySelector('#om-batch-none');
        var btagBtn = area.querySelector('#om-batch-tag');
        var bdelBtn = area.querySelector('#om-batch-del');

        if (selall) selall.addEventListener('click', function () { batchSelected = list.map(function (o) { return o.id; }); renderGrid(); });
        if (selnone) selnone.addEventListener('click', function () { batchSelected = []; renderGrid(); });
        var bcatBtn = area.querySelector('#om-batch-cat');
        if (bcatBtn) bcatBtn.addEventListener('click', function () {
            if (batchSelected.length === 0) { toast('请先选择穿搭', true); return; }
            var dd = load();
            var cats = getViewCategories(dd);
            if (cats.length === 0) { toast('还没有分类，请先在设置中添加', true); return; }
            var msg = '选择分类（输入序号）：\n' + cats.map(function (n, i) { return (i + 1) + '. ' + n; }).join('\n');
            var choice = prompt(msg);
            if (choice === null) return;
            var ci = parseInt(choice) - 1;
            if (ci < 0 || ci >= cats.length) { toast('无效选择', true); return; }
            var targetCat = cats[ci];
            dd.outfits.forEach(function (o) { if (batchSelected.indexOf(o.id) !== -1) o.category = targetCat; });
            save(dd); toast('✅ 已将 ' + batchSelected.length + ' 套移到「' + targetCat + '」'); batchSelected = []; renderGrid();
        });
        if (btagBtn) btagBtn.addEventListener('click', function () {
            if (batchSelected.length === 0) { toast('请先选择穿搭', true); return; }
            var tag = prompt('为所选 ' + batchSelected.length + ' 套穿搭设置场景标签：'); if (tag === null) return; tag = tag.trim();
            var dd = load(); dd.outfits.forEach(function (o) { if (batchSelected.indexOf(o.id) !== -1) o.sceneTag = tag; });
            save(dd); toast('✅ 已设置标签：' + (tag || '（已清空）')); batchSelected = []; renderGrid();
        });
        if (bdelBtn) bdelBtn.addEventListener('click', function () {
            if (batchSelected.length === 0) { toast('请先选择穿搭', true); return; }
            if (!confirm('确定删除已选 ' + batchSelected.length + ' 套穿搭？')) return;
            var dd = load();
            dd.outfits = dd.outfits.filter(function (o) { return batchSelected.indexOf(o.id) === -1; });
            if (dd.chars) { for (var cn in dd.chars) { dd.chars[cn].outfits = (dd.chars[cn].outfits || []).filter(function (o) { return batchSelected.indexOf(o.id) === -1; }); } }
            batchSelected.forEach(function (id) {
                var ai = (dd.activeIds || []).indexOf(id); if (ai !== -1) dd.activeIds.splice(ai, 1);
                if (dd.chars) { for (var cn2 in dd.chars) { var cai = (dd.chars[cn2].activeIds || []).indexOf(id); if (cai !== -1) dd.chars[cn2].activeIds.splice(cai, 1); } }
            });
            save(dd); updateBtn(); renderBottomStatus(); toast('已删除 ' + batchSelected.length + ' 套穿搭'); batchSelected = []; renderGrid();
        });

        var bpasteBtn = area.querySelector('#om-batch-paste');
        if (bpasteBtn) bpasteBtn.addEventListener('click', function () {
            if (batchSelected.length === 0) { toast('请先选择穿搭', true); return; }
            var darkMode = getDarkMode();
            var modal = document.createElement('div'); modal.className = 'om-modal';
            var bg = darkMode ? '#1e1e24' : '#ececef'; var fg = darkMode ? '#eee' : '#111';
            modal.innerHTML = '<div class="om-modal-box" style="max-width:600px;background:' + bg + ';color:' + fg + '"><div class="om-modal-title"><i class="fa-solid fa-paste"></i> 批量粘贴描述</div><div style="font-size:.78em;opacity:.6;margin-bottom:8px">将 AI 返回的所有描述一起粘贴到下方，按 <code>--- 第N套 ---</code> 自动分割分配给已选 ' + batchSelected.length + ' 套穿搭</div><textarea id="om-paste-area" rows="14" style="width:100%;background:rgba(127,127,127,.08);border:1px solid rgba(127,127,127,.2);border-radius:8px;color:inherit;padding:10px;font-size:.85em;resize:vertical;font-family:inherit;box-sizing:border-box"></textarea><div id="om-paste-result" style="margin-top:8px;font-size:.8em"></div><div class="om-btn-row" style="margin-top:10px"><button class="om-btn om-btn-safe" id="om-paste-go">分配并保存</button><button class="om-btn om-btn-outline" id="om-paste-copyprompt" style="font-size:.75em;padding:3px 8px;margin-right:4px"><i class="fa-solid fa-copy"></i> 复制提示词</button><button class="om-btn om-btn-outline" id="om-paste-cancel">取消</button></div></div>';
            var mp = getPopupLayer(); modal.style.cssText = 'position:absolute !important;inset:0 !important;z-index:1 !important;background:rgba(0,0,0,.45) !important;display:flex !important;align-items:center !important;justify-content:center !important;padding:20px !important;box-sizing:border-box !important;pointer-events:auto !important;';
            mp.appendChild(modal); modal.addEventListener('click', function (e) { if (e.target === modal) mp.removeChild(modal); });
            modal.querySelector('#om-paste-cancel').addEventListener('click', function () { mp.removeChild(modal); });
            modal.querySelector('#om-paste-copyprompt').addEventListener('click', function (e) { e.stopPropagation(); var prompt = '请逐一分析以下穿搭照片，对每张照片严格按以下格式返回（不要额外解释，直接输出）：\n\n--- 第1套 ---\n名称：<5-15字简短名称>\n分类：<睡衣/制服/常服/外出服>\n风格：<学院/简约/运动/甜美/通勤/休闲/街头/优雅/舒适>\n季节：<春/夏/秋/冬/全年>\n场景：<外出/家居/办公/约会/运动/睡前>\n描述：<100-200字服装描述>\n\n--- 第2套 ---\n...'; navigator.clipboard.writeText(prompt).then(function() { toast('提示词已复制！粘贴到外部AI对话框即可'); }).catch(function() { toast('复制失败，请手动复制', true); }); });
            modal.querySelector('#om-paste-go').addEventListener('click', function () {
                var text = modal.querySelector('#om-paste-area').value.trim();
                if (!text) { toast('请先粘贴内容', true); return; }
                var blocks = text.split(/---\s*第\s*\d+\s*套\s*---/i).filter(function(b) { return b.trim(); });
                if (blocks.length === 0) { blocks = text.split(/\n\s*\n\s*\n/).filter(function(b) { return b.trim(); }); }
                if (blocks.length === 0) { blocks = [text]; }
                var dd = load(); var updated = 0;
                var ids = batchSelected.slice();
                for (var i = 0; i < Math.min(blocks.length, ids.length); i++) {
                    var o = getById(dd, ids[i]); if (!o) continue;
                    var block = blocks[i].trim();
                    function findKey(kp) { var allKeys = ['名称','分类','类型','风格','季节','场景','描述']; var stopKeys = allKeys.filter(function(k){ return k !== kp; }); var stopPat = stopKeys.map(function(k){ return k + '\\s*[\\uff1a：]'; }).join('|'); var m = block.match(new RegExp(kp + '\\s*[\\uff1a：]\\s*([\\s\\S]*?)(?=' + stopPat + '|---|$)', 'i')); return m ? m[1].trim() : ''; }
                    var nm = findKey('名称'); if (nm) o.name = nm;
                    var cat = findKey('分类'); if (cat) { o.category = cat; var vcl = getViewCategories(dd); if (vcl.indexOf(cat) === -1) vcl.push(cat); }
                    var st = findKey('风格'); if (st) o.style = st;
                    var sn = findKey('季节'); if (sn) o.season = sn;
                    var sc = findKey('场景'); if (sc) o.sceneTag = sc;
                    var desc = findKey('描述'); if (desc) o.description = desc;
                    if (!nm && !cat && !st && !sn && !sc && !desc) { o.description = block; }
                    updated++;
                }
                save(dd); mp.removeChild(modal); renderGrid(); renderCatbar(); toast('✅ 已更新 ' + updated + ' 套');
            });
        });
        var bparseBtn2 = area.querySelector('#om-batch-parse');
        if (bparseBtn2) bparseBtn2.addEventListener('click', function () { if (batchSelected.length === 0) { toast('请先选择穿搭', true); return; } var ddx = load(); if (!ddx.apiVision.endpoint || !ddx.apiVision.key || !ddx.apiVision.model) { toast('请先配置 API', true); return; } openBatchParseModal(batchSelected.slice()); });
        var bautotagBtn2 = area.querySelector('#om-batch-autotag');
        if (bautotagBtn2) bautotagBtn2.addEventListener('click', function () { if (batchSelected.length === 0) { toast('请先选择穿搭', true); return; } var ddx2 = load(); if (!ddx2.apiVision.endpoint || !ddx2.apiVision.key || !ddx2.apiVision.model) { toast('请先配置 API', true); return; } openBatchAutoTagModal(batchSelected.slice()); });
        var baidescBtn = area.querySelector('#om-batch-aidesc');
        if (baidescBtn) baidescBtn.addEventListener('click', function () {
            if (batchSelected.length === 0) { toast('请先选择穿搭', true); return; }
            var dd = load();
            if (!dd.apiVision.endpoint || !dd.apiVision.key || !dd.apiVision.model) {
                toast('请先在设置中配置"描述生成 API"', true); return;
            }
            var hasImg = batchSelected.some(function (id) { var o = getById(dd, id); return o && hasImages(o); });
            if (!hasImg) { toast('所选穿搭中没有带图片的', true); return; }
            openBatchDescModal(batchSelected.slice());
        });

        area.querySelectorAll('.om-card').forEach(function (card) {
            card.addEventListener('click', function (e) {
                if (e.target.closest('.om-card-check')) return;
                var id = card.dataset.id;
                var chk = card.querySelector('.om-card-check');
                var idx = batchSelected.indexOf(id);
                if (idx !== -1) batchSelected.splice(idx, 1); else batchSelected.push(id);
                if (chk) chk.classList.toggle('checked', batchSelected.indexOf(id) !== -1);
                card.classList.toggle('batch-sel', batchSelected.indexOf(id) !== -1);
                var cnt = area.querySelector('#om-batch-count');
                if (cnt) cnt.textContent = batchSelected.length;
            });
        });
        area.querySelectorAll('.om-card-check').forEach(function (chk) {
            chk.addEventListener('click', function (e) {
                e.stopPropagation();
                var id = chk.dataset.id;
                var idx = batchSelected.indexOf(id);
                if (idx !== -1) batchSelected.splice(idx, 1); else batchSelected.push(id);
                chk.classList.toggle('checked', batchSelected.indexOf(id) !== -1);
                var card = chk.closest('.om-card');
                if (card) card.classList.toggle('batch-sel', batchSelected.indexOf(id) !== -1);
                var cnt = area.querySelector('#om-batch-count');
                if (cnt) cnt.textContent = batchSelected.length;
            });
        });
    } else {
        // 非批量：单击 = 选择/取消，点击⋯按钮 = 操作菜单
        area.querySelectorAll('.om-card').forEach(function (card) {
            var id = card.dataset.id;

            card.addEventListener('click', function (e) {
                if (e.target.closest('.om-card-menu') || e.target.closest('.om-badge-on')) return;
                var dd = load();
                var aids = getViewActiveIds(dd);
                var idx = aids.indexOf(id);
                if (idx !== -1) aids.splice(idx, 1); else aids.push(id);
                setViewActiveIds(dd, aids);
                save(dd); updateBtn(); renderBottomStatus();

                // 更新卡片样式
                card.classList.toggle('on', isActive(dd, id));
                var badge = card.querySelector('.om-badge-on');
                if (isActive(dd, id)) {
                    if (!badge) { var b = document.createElement('div'); b.className = 'om-badge-on'; b.innerHTML = '<i class="fa-solid fa-check"></i>'; card.querySelector('.om-card-img').appendChild(b); }
                } else {
                    if (badge) badge.parentNode.removeChild(badge);
                }
                closeDetailPanel();
                var n = aids.length;
                var o = getById(dd, id);
                if (idx !== -1) toast('已取消：' + (o ? o.name : ''));
                else if (n === 1) toast('✅ 已选：' + (o ? o.name : ''));
                else toast('✅ 衣柜模式，共' + n + '套');
            });
        });

        // 菜单按钮点击事件（独立绑定，stopPropagation防止触发卡片选择）
        area.querySelectorAll('.om-card-menu').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                var id = btn.dataset.id;
                var o = getById(load(), id);
                openContextMenu(o, imgOutfits);
            });
        });
    }
}

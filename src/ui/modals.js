// src/ui/modals.js — Export/Import functions and Batch AI Description modal
import { def } from '../constants.js';
import { load, save, getSTContextSafe } from '../core/db.js';
import { getCharData, currentOwner, getViewOutfits, getViewCategories, getById } from '../core/data.js';
import { genId, esc } from '../utils/helpers.js';
import { toast } from '../utils/toast.js';
import { getDarkMode } from './theme.js';
import { getPopupLayer } from './popup-layer.js';
import { renderGrid, renderCatbar, renderViewbar } from './popup.js';
import { renderBottomStatus } from './bottom-status.js';
import { updateBtn } from './ui-bar.js';
import { batchGenerateDescriptions } from '../ai/vision.js';

// ── 导出 ──────────────────────────────────────────────────
export function doExport(data, filename) {
    try {
        var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url; a.download = filename; document.body.appendChild(a); a.click();
        setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(url); }, 500);
    } catch (e) { toast('导出失败：' + e.message, true); }
}

export function exportData() {
    var d = load();
    var darkMode = getDarkMode();
    var isCharView = d.currentView === 'char' && d.currentChar;
    var modal = document.createElement('div');
    modal.className = 'om-modal ' + (darkMode ? 'om-dark' : 'om-light');
    modal.style.setProperty('z-index', '2147483647', 'important');

    var charBtns = '';
    if (isCharView) {
        charBtns =
            '<button class="om-modal-btn" id="om-exp-char-one"><i class="fa-solid fa-user" style="margin-right:8px"></i>导出「' + esc(d.currentChar) + '」<br><small style="opacity:.6;font-weight:400">当前角色的穿搭+分类</small></button>';
    }
    if (d.charNames && d.charNames.length > 0) {
        charBtns +=
            '<button class="om-modal-btn" id="om-exp-char-all"><i class="fa-solid fa-users" style="margin-right:8px"></i>导出全部角色<br><small style="opacity:.6;font-weight:400">所有角色的穿搭+分类</small></button>';
    }

    modal.innerHTML = '<div class="om-modal-box">' +
        '<div class="om-modal-title"><i class="fa-solid fa-download" style="margin-right:6px"></i>导出数据</div>' +
        '<button class="om-modal-btn" id="om-exp-all"><i class="fa-solid fa-database" style="margin-right:8px"></i>导出完整备份<br><small style="opacity:.6;font-weight:400">User+角色+预设+设置</small></button>' +
        '<button class="om-modal-btn" id="om-exp-user"><i class="fa-solid fa-shirt" style="margin-right:8px"></i>仅导出 User 穿搭<br><small style="opacity:.6;font-weight:400">User的穿搭+分类</small></button>' +
        charBtns +
        '<button class="om-modal-cancel" id="om-exp-cancel">取消</button></div>';
    var _mp = getPopupLayer();
    modal.style.cssText = 'position:absolute !important;inset:0 !important;z-index:1 !important;background:rgba(0,0,0,.45) !important;display:flex !important;align-items:center !important;justify-content:center !important;padding:20px !important;box-sizing:border-box !important;pointer-events:auto !important;';
    _mp.appendChild(modal);
    modal.addEventListener('click', function (e) { if (e.target === modal) _mp.removeChild(modal); });
    modal.querySelector('#om-exp-cancel').addEventListener('click', function () { _mp.removeChild(modal); });

    // 导出完整备份
    document.getElementById('om-exp-all').addEventListener('click', function () {
        _mp.removeChild(modal);
        doExport(d, 'outfit-mgr-backup-' + new Date().toISOString().slice(0, 10) + '.json');
        toast('✅ 已导出完整数据');
    });

    // 导出User穿搭
    document.getElementById('om-exp-user').addEventListener('click', function () {
        _mp.removeChild(modal);
        doExport({ type: 'user', outfits: d.outfits, categories: d.categories }, 'outfit-mgr-user-' + new Date().toISOString().slice(0, 10) + '.json');
        toast('✅ 已导出 User 穿搭');
    });

    // 导出当前角色
    var expCharOne = document.getElementById('om-exp-char-one');
    if (expCharOne) expCharOne.addEventListener('click', function () {
        _mp.removeChild(modal);
        var cd = getCharData(d, d.currentChar);
        doExport({ type: 'char', charName: d.currentChar, outfits: cd.outfits, categories: cd.categories }, 'outfit-mgr-char-' + d.currentChar + '-' + new Date().toISOString().slice(0, 10) + '.json');
        toast('✅ 已导出「' + d.currentChar + '」');
    });

    // 导出全部角色
    var expCharAll = document.getElementById('om-exp-char-all');
    if (expCharAll) expCharAll.addEventListener('click', function () {
        _mp.removeChild(modal);
        var charExport = { type: 'chars_all', charNames: d.charNames, chars: {} };
        (d.charNames || []).forEach(function (cn) { charExport.chars[cn] = getCharData(d, cn); });
        doExport(charExport, 'outfit-mgr-all-chars-' + new Date().toISOString().slice(0, 10) + '.json');
        toast('✅ 已导出全部角色（' + d.charNames.length + '个）');
    });
}

export function importData() {
    var modal = document.createElement('div');
    modal.className = 'om-modal';
    modal.style.setProperty('z-index', '2147483647', 'important');
    modal.innerHTML = '<div class="om-modal-box">' +
        '<div class="om-modal-title"><i class="fa-solid fa-upload" style="margin-right:6px"></i>导入数据</div>' +
        '<div class="om-hint" style="margin-bottom:10px">选择之前导出的 .json 文件。</div>' +
        '<button class="om-modal-btn" id="om-imp-merge"><i class="fa-solid fa-code-merge" style="margin-right:8px"></i>合并导入<br><small style="opacity:.6;font-weight:400">追加到现有数据，不覆盖</small></button>' +
        '<button class="om-modal-btn" id="om-imp-replace"><i class="fa-solid fa-arrows-rotate" style="margin-right:8px"></i>覆盖导入<br><small style="opacity:.6;font-weight:400">替换现有穿搭（预设保留）</small></button>' +
        '<input type="file" id="om-imp-file" accept=".json" style="display:none" />' +
        '<button class="om-modal-cancel" id="om-imp-cancel">取消</button></div>';
    var _mp2 = getPopupLayer();
    modal.style.cssText = 'position:absolute !important;inset:0 !important;z-index:1 !important;background:rgba(0,0,0,.45) !important;display:flex !important;align-items:center !important;justify-content:center !important;padding:20px !important;box-sizing:border-box !important;pointer-events:auto !important;';
    _mp2.appendChild(modal);
    modal.addEventListener('click', function (e) { if (e.target === modal) _mp2.removeChild(modal); });
    modal.querySelector('#om-imp-cancel').addEventListener('click', function () { _mp2.removeChild(modal); });
    var fileInp = document.getElementById('om-imp-file');
    var importMode = 'merge';
    function triggerImport(mode) { importMode = mode; fileInp.click(); }
    document.getElementById('om-imp-merge').addEventListener('click', function () { triggerImport('merge'); });
    document.getElementById('om-imp-replace').addEventListener('click', function () { triggerImport('replace'); });
    fileInp.addEventListener('change', function () {
        var file = fileInp.files[0]; if (!file) return;
        var reader = new FileReader();
        reader.onload = function (e) {
            try { var imported = JSON.parse(e.target.result); _mp2.removeChild(modal); processImport(imported, importMode); }
            catch (err) { toast('文件解析失败，请确认是有效的 JSON 文件', true); }
        };
        reader.onerror = function () { toast('文件读取失败', true); };
        reader.readAsText(file, 'utf-8');
    });
}

export function processImport(imported, mode) {
    var dd = load();
    try {
        // 1. 预设导入
        if (imported.type === 'preset' && imported.preset) {
            var p = imported.preset; p.id = genId();
            if (!Array.isArray(dd.presets)) dd.presets = [];
            dd.presets.push(p); save(dd); renderGrid(); toast('✅ 已导入预设：' + p.name); return;
        }

        // 2. 单个角色导入
        if (imported.type === 'char' && imported.charName) {
            var cn = imported.charName;
            if (!dd.chars) dd.chars = {};
            if (!dd.charNames) dd.charNames = [];
            var srcO = (imported.outfits || []).map(function (o) { return Object.assign({}, o, { id: genId() }); });
            var srcC = imported.categories || [];
            if (mode === 'replace') {
                dd.chars[cn] = { outfits: srcO, categories: srcC, activeIds: [] };
            } else {
                var cd = getCharData(dd, cn);
                srcO.forEach(function (o) { cd.outfits.push(o); });
                srcC.forEach(function (c) { if (cd.categories.indexOf(c) === -1) cd.categories.push(c); });
            }
            if (dd.charNames.indexOf(cn) === -1) dd.charNames.push(cn);
            save(dd); renderViewbar(); renderCatbar(); renderGrid(); renderBottomStatus();
            toast('✅ 已导入角色「' + cn + '」（' + srcO.length + '套穿搭）');
            return;
        }

        // 3. 全部角色导入
        if (imported.type === 'chars_all' && imported.chars) {
            if (!dd.chars) dd.chars = {};
            if (!dd.charNames) dd.charNames = [];
            var importedNames = imported.charNames || Object.keys(imported.chars);
            var totalOutfits = 0;
            importedNames.forEach(function (cn) {
                var src = imported.chars[cn]; if (!src) return;
                var srcO2 = (src.outfits || []).map(function (o) { return Object.assign({}, o, { id: genId() }); });
                var srcC2 = src.categories || [];
                if (mode === 'replace') {
                    dd.chars[cn] = { outfits: srcO2, categories: srcC2, activeIds: [] };
                } else {
                    var cd2 = getCharData(dd, cn);
                    srcO2.forEach(function (o) { cd2.outfits.push(o); });
                    srcC2.forEach(function (c) { if (cd2.categories.indexOf(c) === -1) cd2.categories.push(c); });
                }
                if (dd.charNames.indexOf(cn) === -1) dd.charNames.push(cn);
                totalOutfits += srcO2.length;
            });
            save(dd); renderViewbar(); renderCatbar(); renderGrid(); renderBottomStatus();
            toast('✅ 已导入 ' + importedNames.length + ' 个角色（共 ' + totalOutfits + ' 套穿搭）');
            return;
        }

        // 4. User穿搭导入（type='user' 或旧格式无type）
        var srcOutfits = imported.outfits || [], srcCats = imported.categories || [], srcPresets = imported.presets || [];
        if (mode === 'replace') {
            dd.outfits = srcOutfits.map(function (o) { return Object.assign({}, o, { id: genId() }); });
            dd.categories = srcCats.slice(); dd.activeIds = [];
        } else {
            srcOutfits.forEach(function (o) { dd.outfits.push(Object.assign({}, o, { id: genId() })); });
            srcCats.forEach(function (c) { if (dd.categories.indexOf(c) === -1) dd.categories.push(c); });
            if (srcPresets.length > 0) {
                if (!Array.isArray(dd.presets)) dd.presets = [];
                srcPresets.forEach(function (p2) { if (p2) dd.presets.push(Object.assign({}, p2, { id: genId() })); });
            }
        }

        // 如果是完整备份（含chars），也导入角色数据
        if (imported.chars) {
            if (!dd.chars) dd.chars = {};
            if (!dd.charNames) dd.charNames = [];
            var impNames = imported.charNames || Object.keys(imported.chars);
            impNames.forEach(function (cn) {
                var src2 = imported.chars[cn]; if (!src2) return;
                dd.chars[cn] = {
                    outfits: (src2.outfits || []).map(function (o) { return Object.assign({}, o, { id: genId() }); }),
                    categories: src2.categories || [],
                    activeIds: []
                };
                if (dd.charNames.indexOf(cn) === -1) dd.charNames.push(cn);
            });
        }

        save(dd); renderViewbar(); renderCatbar(); renderGrid(); renderBottomStatus(); updateBtn();
        toast('✅ 导入成功：' + dd.outfits.length + ' 套穿搭');
    } catch (err) { toast('导入处理失败：' + err.message, true); }
}

// ── 批量 AI 生成描述弹窗 ──────────────────────────────────
export function openBatchDescModal(ids) {
    var d = load();
    var darkMode = getDarkMode();
    var withImg = ids.filter(function (id) { var o = getById(d, id); return o && o.imageData; });
    var skipCount = ids.length - withImg.length;
    var willSkipDesc = withImg.filter(function (id) { var o = getById(d, id); return o && o.description && o.description.trim() && !d.apiVision.overwrite; }).length;

    var modal = document.createElement('div');
    modal.className = 'om-modal';
    modal.style.setProperty('z-index', '2147483647', 'important');
    modal.innerHTML = '<div class="om-modal-box" style="background:' + (darkMode ? '#1e1e24' : '#ececef') + ';color:' + (darkMode ? '#eee' : '#111') + '">' +
        '<div class="om-modal-title"><i class="fa-solid fa-wand-magic-sparkles" style="margin-right:6px;color:var(--SmartThemeQuoteColor,#7c6daf)"></i>AI 批量生成描述</div>' +
        '<div style="font-size:.82em;opacity:.7;margin-bottom:8px">' +
        '共选中 ' + ids.length + ' 套，其中 ' + withImg.length + ' 套有图片' +
        (skipCount > 0 ? '，' + skipCount + ' 套无图片将跳过' : '') +
        (willSkipDesc > 0 ? '<br>' + willSkipDesc + ' 套已有描述将跳过（可在设置中开启覆盖）' : '') +
        '</div>' +
        '<div style="font-size:.78em;opacity:.5;margin-bottom:6px">逐张发送，并发 ' + (d.apiVision.concurrency || 3) + ' 个请求，共需 ' + (withImg.length - willSkipDesc) + ' 次 API 调用</div>' +
        '<div id="om-batch-progress" style="display:none;margin:10px 0">' +
        '<div style="font-size:.82em;margin-bottom:6px" id="om-batch-prog-text">准备中...</div>' +
        '<div style="height:6px;background:rgba(127,127,127,.15);border-radius:3px;overflow:hidden">' +
        '<div id="om-batch-prog-bar" style="height:100%;width:0%;background:var(--SmartThemeQuoteColor,#7c6daf);border-radius:3px;transition:width .3s"></div></div></div>' +
        '<div id="om-batch-result" style="display:none;margin:8px 0;font-size:.82em;max-height:120px;overflow-y:auto"></div>' +
        '<div class="om-btn-row" style="margin-top:10px" id="om-batch-actions">' +
        '<button class="om-btn om-btn-safe" id="om-batch-start"><i class="fa-solid fa-play"></i> 开始生成</button>' +
        '<button class="om-btn om-btn-outline" id="om-batch-close">取消</button></div></div>';

    var _mp = getPopupLayer();
    modal.style.cssText = 'position:absolute !important;inset:0 !important;z-index:1 !important;background:rgba(0,0,0,.45) !important;display:flex !important;align-items:center !important;justify-content:center !important;padding:20px !important;box-sizing:border-box !important;pointer-events:auto !important;';
    _mp.appendChild(modal);
    modal.addEventListener('click', function (e) { if (e.target === modal && !modal.dataset.running) { _mp.removeChild(modal); } });
    modal.querySelector('#om-batch-close').addEventListener('click', function () { if (!modal.dataset.running) _mp.removeChild(modal); });

    modal.querySelector('#om-batch-start').addEventListener('click', function () {
        modal.dataset.running = '1';
        modal.querySelector('#om-batch-progress').style.display = 'block';
        modal.querySelector('#om-batch-start').disabled = true;
        modal.querySelector('#om-batch-start').textContent = '生成中...';
        modal.querySelector('#om-batch-close').textContent = '请等待...';

        batchGenerateDescriptions(ids,
            function (done, total, msg) {
                // 进度回调
                var pct = total > 0 ? Math.round(done / total * 100) : 0;
                var bar = modal.querySelector('#om-batch-prog-bar');
                var txt = modal.querySelector('#om-batch-prog-text');
                if (bar) bar.style.width = pct + '%';
                if (txt) txt.textContent = msg;
            },
            function (err, doneCount, errors) {
                // 完成回调
                delete modal.dataset.running;
                var bar = modal.querySelector('#om-batch-prog-bar');
                if (bar) bar.style.width = '100%';
                var resultEl = modal.querySelector('#om-batch-result');
                resultEl.style.display = 'block';
                if (err && !doneCount) {
                    resultEl.innerHTML = '<div style="color:#e57373"><i class="fa-solid fa-circle-exclamation"></i> ' + esc(err) + '</div>';
                } else {
                    var successCount = (doneCount || 0) - (errors ? errors.length : 0);
                    var html2 = '<div style="color:#4caf50;font-weight:600">✅ 成功生成 ' + successCount + ' 条描述</div>';
                    if (errors && errors.length > 0) {
                        html2 += '<div style="color:#ff8c42;margin-top:4px">⚠️ ' + errors.length + ' 个失败：</div>';
                        errors.forEach(function (e) {
                            html2 += '<div style="opacity:.6;font-size:.9em;margin-left:8px">· ' + esc(e.name) + '：' + esc(e.error) + '</div>';
                        });
                    }
                    resultEl.innerHTML = html2;
                }
                var actionsEl = modal.querySelector('#om-batch-actions');
                actionsEl.innerHTML = '<button class="om-btn om-btn-safe" id="om-batch-done">完成</button>';
                modal.querySelector('#om-batch-done').addEventListener('click', function () {
                    _mp.removeChild(modal);
                    renderGrid();
                });
            }
        );
    });
}

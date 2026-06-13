// ── Bottom Sheet Functions ───────────────────────────────
import { FAB_ID, SCENE_DEFS, LINGERIE_REGEX } from '../constants.js';
import { load, save, getSTContextSafe } from '../core/db.js';
import { getCharData, currentOwner, getViewOutfits, getViewCategories, getViewActiveIds, setViewActiveIds, getById, getViewById, isActive } from '../core/data.js';
import { genId, esc, getFirstImage, getAllImages, hasImages } from '../utils/helpers.js';
import { toast } from '../utils/toast.js';
import { compressImage } from '../utils/image.js';
import { getDarkMode } from './theme.js';
import { createSheet, closeSheet } from './sheet-utils.js';
import { getPopupLayer } from './popup-layer.js';
import { renderGrid, renderCatbar, getCurCat, setCurCat, getCurType, setCurType, getBatchMode, setBatchMode, getBatchSelected, setBatchSelected, getSearchQuery, getWbMode } from './popup.js';
import { renderBottomStatus } from './bottom-status.js';
import { updateBtn } from './ui-bar.js';
import { injectFab } from './fab.js';
import { getWorldBookStyles, getSelectedWorldBookNames, refreshWorldBookStyles, getWorldBookStyleCache, createWorldBookOutfit, worldBookStyleMatchesScene, materializeWorldBookStyle, setWorldBookStylesLoaded } from '../worldbook/worldbook.js';
import { parseAutoTagResult } from '../ai/auto-tag.js';
import { _cleanOutfitResult, tryGenerateAIDescription } from '../ai/generator.js';
import { callVisionAPI, openModelPicker, batchGenerateDescriptions, generateSingleDescription, fetchModelList, normalizeEndpoint } from '../ai/vision.js';
import { autoDetectApiConfig } from '../ai/api-detect.js';
import { openLightbox } from './lightbox.js';
import { BUILTIN_TEMPLATES, importSTPreset, getActiveTemplate, setActiveTemplate, saveCustomTemplate, deleteCustomTemplate, getAllTemplates, applySTPresetToApiConfig, saveToSTPreset, importExternalPreset } from '../ai/presets.js';

// ── exportData / importData stubs ────────────────────────
// These are still in index.js; register them at boot via registerSheetCallbacks().
var _exportData = function () { toast('导出功能尚未加载', true); };
var _importData = function () { toast('导入功能尚未加载', true); };

/**
 * Register external callbacks that sheets.js cannot import directly yet.
 * Called once from index.js at boot.
 */
export function registerSheetCallbacks(cbs) {
    if (cbs.exportData) _exportData = cbs.exportData;
    if (cbs.importData) _importData = cbs.importData;
}

// ── Sheet functions ──────────────────────────────────────

function getAllTagSuggestions(d) {
    var tags = [];
    d.outfits.forEach(function (o) { if (o.sceneTag && o.sceneTag.trim()) { var t = o.sceneTag.trim(); if (tags.indexOf(t) === -1) tags.push(t); } });
    return tags;
}

function batchParseItems(outfitIds, prompt, progressCb, doneCb) {
    var d = load(); var apiCfg = d.apiVision; if (!apiCfg.endpoint || !apiCfg.key || !apiCfg.model) { doneCb('API 未配置'); return; }
    var targets = []; outfitIds.forEach(function (id) { var o = getById(d, id); if (!o || !getFirstImage(o)) return; targets.push(o); });
    if (targets.length === 0) { doneCb('没有需要解析的穿搭'); return; }
    var done = 0; var total = targets.length; var errors = []; var queue = targets.slice();
    var CONCURRENCY = 2;
    function processNext() { if (queue.length === 0) return; var o = queue.shift(); callVisionAPI(apiCfg, { name: o.name, dataUrl: getFirstImage(o) }, prompt, function (err, text) { done++; if (err) errors.push({ name: o.name, error: err }); else if (text) o.description = text; else errors.push({ name: o.name, error: '返回为空' }); progressCb(done, total, '已完成 ' + done + '/' + total); if (done >= total) { save(d); doneCb(errors.length > 0 ? '完成，但有 ' + errors.length + ' 个错误' : null, done, errors); } else processNext(); }); }
    progressCb(0, total, '开始（并发' + CONCURRENCY + '）'); for (var i = 0; i < Math.min(CONCURRENCY, total); i++) processNext();
}

function openBatchParseModal(ids) {
    var d = load(); var isDark = getDarkMode(); var withImg = ids.filter(function (id) { var o = getById(d, id); return o && hasImages(o); });
    if (withImg.length === 0) { toast('所选穿搭中没有带图片的', true); return; }
    var bg = isDark ? '#1e1e24' : '#ececef'; var fg = isDark ? '#eee' : '#111';
    var modal = document.createElement('div'); modal.className = 'om-modal';
    modal.innerHTML = '<div class="om-modal-box" style="background:' + bg + ';color:' + fg + '"><div class="om-modal-title">AI 批量单品解析</div><div style="font-size:.82em;opacity:.7;margin-bottom:8px">共 ' + withImg.length + ' 套</div><div id="om-bp-progress" style="display:none;margin:10px 0"><div id="om-bp-prog-text" style="font-size:.82em;margin-bottom:6px"></div><div style="height:6px;background:rgba(127,127,127,.15);border-radius:3px"><div id="om-bp-prog-bar" style="height:100%;width:0%;background:var(--SmartThemeQuoteColor,#7c6daf);border-radius:3px;transition:width .3s"></div></div></div><div id="om-bp-result" style="display:none;margin:8px 0;font-size:.82em;max-height:120px;overflow-y:auto"></div><div class="om-btn-row" id="om-bp-actions"><button class="om-btn om-btn-safe" id="om-bp-start">开始</button><button class="om-btn om-btn-outline" id="om-bp-close">取消</button></div></div>';
    var mp = getPopupLayer(); modal.style.cssText = 'position:absolute !important;inset:0 !important;z-index:1 !important;background:rgba(0,0,0,.45) !important;display:flex !important;align-items:center !important;justify-content:center !important;padding:20px !important;box-sizing:border-box !important;pointer-events:auto !important;';
    mp.appendChild(modal); modal.addEventListener('click', function (e) { if (e.target === modal && !modal.dataset.running) mp.removeChild(modal); });
    modal.querySelector('#om-bp-close').addEventListener('click', function () { if (!modal.dataset.running) mp.removeChild(modal); });
    modal.querySelector('#om-bp-start').addEventListener('click', function () { modal.dataset.running = '1'; modal.querySelector('#om-bp-progress').style.display = 'block'; modal.querySelector('#om-bp-start').disabled = true;
        var prompt = d.apiVision.parsePrompt || '请逐件列出单品'; batchParseItems(ids, prompt, function (done, total, msg) { var pct = total > 0 ? Math.round(done / total * 100) : 0; modal.querySelector('#om-bp-prog-bar').style.width = pct + '%'; modal.querySelector('#om-bp-prog-text').textContent = msg; },
        function (err, doneCount, errors) { delete modal.dataset.running; modal.querySelector('#om-bp-prog-bar').style.width = '100%'; var re = modal.querySelector('#om-bp-result'); re.style.display = 'block'; var sc = (doneCount || 0) - (errors ? errors.length : 0); var errDetail = errors && errors.length > 0 ? '<div style="color:#ff8c42;margin-top:4px">' + errors.length + ' 个失败：' + errors.map(function(e){return e.name+': '+e.error;}).join('<br>') + '</div>' : ''; re.innerHTML = '<div style="color:#4caf50;font-weight:600">成功 ' + sc + ' 条</div>' + errDetail; modal.querySelector('#om-bp-actions').innerHTML = '<button class="om-btn om-btn-safe" id="om-bp-done">完成</button>'; modal.querySelector('#om-bp-done').addEventListener('click', function () { mp.removeChild(modal); renderGrid(); }); }); });
}

function batchAutoTagItems(outfitIds, prompt, progressCb, doneCb) {
    var d = load(); var apiCfg = d.apiVision; if (!apiCfg.endpoint || !apiCfg.key || !apiCfg.model) { doneCb('API 未配置'); return; }
    var targets = []; outfitIds.forEach(function (id) { var o = getById(d, id); if (!o || !getFirstImage(o)) return; targets.push(o); });
    if (targets.length === 0) { doneCb('没有需要识别的穿搭'); return; }
    var done = 0; var total = targets.length; var errors = []; var queue = targets.slice();
    var ITEM_DELAY = 800;
    function processNext() { if (queue.length === 0) return; var o = queue.shift(); callVisionAPI(apiCfg, { name: o.name, dataUrl: getFirstImage(o) }, prompt, function (err, text) { done++; if (err) { errors.push({ name: o.name, error: err }); } else if (text) { var parsed = parseAutoTagResult(text); if (parsed.name) o.name = parsed.name; if (parsed.type) o.type = parsed.type; if (parsed.style) o.style = parsed.style; if (parsed.season) o.season = parsed.season; if (parsed.scene) o.sceneTag = parsed.scene; if (parsed.description) o.description = parsed.description; if (!parsed.name && !parsed.style && !parsed.season && !parsed.scene) { o.description = text; } } else { errors.push({ name: o.name, error: '返回为空' }); } progressCb(done, total, '已完成 ' + done + '/' + total + (errors.length > 0 ? ' (' + errors.length + '失败)' : '')); if (done >= total) { save(d); doneCb(errors.length > 0 ? '完成，但有 ' + errors.length + ' 个错误' : null, done, errors); } else { setTimeout(processNext, ITEM_DELAY); } }); }
    progressCb(0, total, '开始处理 ' + total + ' 套（遇限速自动重试）'); processNext();
}

function openBatchAutoTagModal(ids) {
    var d = load(); var isDark = getDarkMode(); var withImg = ids.filter(function (id) { var o = getById(d, id); return o && hasImages(o); });
    if (withImg.length === 0) { toast('所选穿搭中没有带图片的', true); return; }
    var bg = isDark ? '#1e1e24' : '#ececef'; var fg = isDark ? '#eee' : '#111';
    var modal = document.createElement('div'); modal.className = 'om-modal';
    modal.innerHTML = '<div class="om-modal-box" style="background:' + bg + ';color:' + fg + '"><div class="om-modal-title">AI 批量一键识别</div><div style="font-size:.82em;opacity:.7;margin-bottom:8px">共 ' + withImg.length + ' 套</div><div id="om-at-progress" style="display:none;margin:10px 0"><div id="om-at-prog-text" style="font-size:.82em;margin-bottom:6px"></div><div style="height:6px;background:rgba(127,127,127,.15);border-radius:3px"><div id="om-at-prog-bar" style="height:100%;width:0%;background:var(--SmartThemeQuoteColor,#7c6daf);border-radius:3px;transition:width .3s"></div></div></div><div id="om-at-result" style="display:none;margin:8px 0;font-size:.82em;max-height:120px;overflow-y:auto"></div><div class="om-btn-row" id="om-at-actions"><button class="om-btn om-btn-safe" id="om-at-start">开始</button><button class="om-btn om-btn-outline" id="om-at-close">取消</button></div></div>';
    var mp = getPopupLayer(); modal.style.cssText = 'position:absolute !important;inset:0 !important;z-index:1 !important;background:rgba(0,0,0,.45) !important;display:flex !important;align-items:center !important;justify-content:center !important;padding:20px !important;box-sizing:border-box !important;pointer-events:auto !important;';
    mp.appendChild(modal); modal.addEventListener('click', function (e) { if (e.target === modal && !modal.dataset.running) mp.removeChild(modal); });
    modal.querySelector('#om-at-close').addEventListener('click', function () { if (!modal.dataset.running) mp.removeChild(modal); });
    modal.querySelector('#om-at-start').addEventListener('click', function () { modal.dataset.running = '1'; modal.querySelector('#om-at-progress').style.display = 'block'; modal.querySelector('#om-at-start').disabled = true;
        var prompt = d.apiVision.autoTagPrompt || '请分析'; batchAutoTagItems(ids, prompt, function (done, total, msg) { var pct = total > 0 ? Math.round(done / total * 100) : 0; modal.querySelector('#om-at-prog-bar').style.width = pct + '%'; modal.querySelector('#om-at-prog-text').textContent = msg; },
        function (err, doneCount, errors) { delete modal.dataset.running; modal.querySelector('#om-at-prog-bar').style.width = '100%'; var re = modal.querySelector('#om-at-result'); re.style.display = 'block'; var sc = (doneCount || 0) - (errors ? errors.length : 0); var errDetail = errors && errors.length > 0 ? '<div style="color:#ff8c42;margin-top:4px">' + errors.length + ' 个失败：' + errors.map(function(e){return e.name+': '+e.error;}).join('<br>') + '</div>' : ''; re.innerHTML = '<div style="color:#4caf50;font-weight:600">成功 ' + sc + ' 条</div>' + errDetail; modal.querySelector('#om-at-actions').innerHTML = '<button class="om-btn om-btn-safe" id="om-at-done">完成</button>'; modal.querySelector('#om-at-done').addEventListener('click', function () { mp.removeChild(modal); renderGrid(); }); }); });
}

function generateSingleParse(outfit, parsePrompt, cb) {
    var d = load(); var apiCfg = d.apiVision;
    if (!apiCfg.endpoint || !apiCfg.key || !apiCfg.model) { cb('API 未配置'); return; }
    if (!getFirstImage(outfit)) { cb('没有图片'); return; }
    callVisionAPI(apiCfg, { name: outfit.name, dataUrl: getFirstImage(outfit) }, parsePrompt, function (err, text) { if (err) { cb(err); return; } cb(null, text); });
}


function openBatchAddSheet(defaultCat) {
    var d = load(); var viewCats = getViewCategories(d);
    var catOpts = '<option value="">无分类</option>' + viewCats.map(function (c) { return '<option value="' + esc(c) + '">' + esc(c) + '</option>'; }).join('');
    if (defaultCat) catOpts = catOpts.replace('value="' + esc(defaultCat) + '"', 'value="' + esc(defaultCat) + '" selected');
    var sheet = createSheet([
        '<div class="om-sheet-title"><i class="fa-solid fa-images"></i>批量添加穿搭</div>',
        '<div class="om-field"><label>名称前缀</label><input type="text" id="om-ba-prefix" placeholder="如：睡衣 -> 睡衣 1、睡衣 2..." /></div>',
        '<div class="om-field"><label>类型</label><div class="om-type-radios"><label class="om-radio-label"><input type="radio" name="om-ba-type" value="outfit" checked /> 套装</label><label class="om-radio-label"><input type="radio" name="om-ba-type" value="item" /> 单品</label></div></div>',
        '<div class="om-field"><label>分类</label><div class="om-frow"><select id="om-ba-cat">' + catOpts + '</select><button class="om-btn om-btn-outline" id="om-ba-newcat" style="white-space:nowrap;font-size:.8em;padding:7px 10px">+ 新建</button></div></div>',
        '<div class="om-field"><label>风格</label><input type="text" id="om-ba-style" placeholder="学院 / 简约 / 运动" />',
        '<div class="om-field"><label>季节</label><input type="text" id="om-ba-season" placeholder="春 / 夏 / 秋 / 冬 / 全年" />',
        '<div class="om-field"><label>场景标签</label><input type="text" id="om-ba-scene" placeholder="家居 / 外出 / 睡觉" />',
        '<div class="om-field"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px"><label style="margin:0">粘贴AI描述 <span class="om-hint">可选：按 --- 第N套 --- 分割，与照片顺序一一对应</span></label><button class="om-btn om-btn-outline" id="om-ba-copyprompt" style="font-size:.75em;padding:4px 10px;flex-shrink:0" title="复制提示词到剪贴板"><i class="fa-solid fa-copy"></i> 复制提示词</button></div><textarea id="om-ba-desctext" rows="8" placeholder="将外部AI返回的描述粘贴到这里...&#10;格式示例：&#10;--- 第1套 ---&#10;名称：粉色睡裙&#10;分类：睡衣&#10;风格：甜美&#10;季节：夏&#10;场景：睡前&#10;描述：粉色丝绸吊带睡裙...&#10;&#10;--- 第2套 ---&#10;..." style="width:100%;background:rgba(127,127,127,.08);border:1px solid rgba(127,127,127,.2);border-radius:8px;color:inherit;padding:10px;font-size:.8em;resize:vertical;font-family:inherit;box-sizing:border-box"></textarea></div>',
        '<div class="om-field"><label>选择照片</label><div class="om-imgarea" id="om-ba-dropzone" style="min-height:120px;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:8px;padding:12px"><div class="om-imgph" id="om-ba-placeholder"><i class="fa-regular fa-images"></i><span>点击或拖拽多张照片</span></div></div><input type="file" id="om-ba-file" accept="image/*" multiple style="display:none" /></div>',
        '<div class="om-field" id="om-ba-preview-area" style="display:none"><label>已选择 <span id="om-ba-count">0</span> 张</label><div id="om-ba-preview" style="display:flex;flex-wrap:wrap;gap:6px;max-height:120px;overflow-y:auto"></div></div>',
        '<div class="om-btn-row"><button class="om-btn om-btn-safe" id="om-ba-create">创建 <span id="om-ba-btn-count">0</span> 套</button><button class="om-btn om-btn-outline" id="om-ba-cancel">取消</button></div>'
    ]);
    var batchFiles = []; var batchDataUrls = [];
    function updatePreview() {
        var cnt = batchFiles.length; sheet.querySelector('#om-ba-count').textContent = cnt; sheet.querySelector('#om-ba-btn-count').textContent = cnt;
        sheet.querySelector('#om-ba-preview-area').style.display = cnt > 0 ? '' : 'none';
        sheet.querySelector('#om-ba-placeholder').style.display = cnt > 0 ? 'none' : '';
        sheet.querySelector('#om-ba-create').disabled = cnt === 0;
        sheet.querySelector('#om-ba-preview').innerHTML = batchDataUrls.map(function (url) { return '<img src="' + url + '" style="width:40px;height:40px;object-fit:cover;border-radius:4px" />'; }).join('');
    }
    function addFiles(files) { for (var i = 0; i < files.length; i++) { var f2 = files[i]; if (!f2 || f2.type.indexOf('image') !== 0) continue; batchFiles.push(f2); } var loaded = 0; var total = batchFiles.length; batchDataUrls = new Array(total); for (var j = 0; j < batchFiles.length; j++) { (function (idx) { var reader = new FileReader(); reader.onload = function (e) { compressImage(e.target.result, function (c) { batchDataUrls[idx] = c; loaded++; if (loaded >= total) updatePreview(); }); }; reader.readAsDataURL(batchFiles[idx]); })(j); } if (total === 0) updatePreview(); }
    sheet.querySelector('#om-ba-dropzone').addEventListener('click', function () { sheet.querySelector('#om-ba-file').click(); });
    sheet.querySelector('#om-ba-file').addEventListener('change', function () { if (this.files.length > 0) addFiles(this.files); });
    sheet.querySelector('#om-ba-dropzone').addEventListener('dragover', function (e) { e.preventDefault(); });
    sheet.querySelector('#om-ba-dropzone').addEventListener('drop', function (e) { e.preventDefault(); if (e.dataTransfer && e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files); });
    sheet.querySelector('#om-ba-create').addEventListener('click', function () {
        var prefix = sheet.querySelector('#om-ba-prefix').value.trim();
        var cat = sheet.querySelector('#om-ba-cat').value;
        var typeEl = sheet.querySelector('input[name="om-ba-type"]:checked');
        var baType = typeEl ? typeEl.value : 'outfit';
        var style = sheet.querySelector('#om-ba-style').value.trim();
        var season = sheet.querySelector('#om-ba-season').value.trim();
        var scene = sheet.querySelector('#om-ba-scene').value.trim();
        var descText = sheet.querySelector('#om-ba-desctext') ? sheet.querySelector('#om-ba-desctext').value.trim() : '';
        var descBlocks = [];
        if (descText) {
            descBlocks = descText.split(/---\s*第\s*\d+\s*套\s*---/i).filter(function(b) { return b.trim(); });
            if (descBlocks.length === 0) { descBlocks = descText.split(/\n\s*\n\s*\n/).filter(function(b) { return b.trim(); }); }
            if (descBlocks.length === 0) { descBlocks = [descText]; }
        }
        var dd = load(); var created = 0;
        batchDataUrls.forEach(function (url, i) {
            var name = prefix ? prefix + ' ' + (i + 1) : ('穿搭 ' + (i + 1));
            var desc = '', nm = name, oc = cat, ost = style, osn = season, osc = scene, otype = baType;
            if (descBlocks[i]) {
                var block = descBlocks[i].trim();
                function findKey(kp) { var allKeys = ['名称','分类','类型','风格','季节','场景','描述']; var stopKeys = allKeys.filter(function(k){ return k !== kp; }); var stopPat = stopKeys.map(function(k){ return k + '\\s*[\\uff1a：]'; }).join('|'); var m = block.match(new RegExp(kp + '\\s*[\\uff1a：]\\s*([\\s\\S]*?)(?=' + stopPat + '|---|$)', 'i')); return m ? m[1].trim() : ''; }
                var pn = findKey('名称'); if (pn) nm = pn;
                var pcat = findKey('分类'); if (pcat) oc = pcat;
                var ptype = findKey('类型'); if (ptype && (ptype === '套装' || ptype === '单品')) otype = ptype;
                var pst = findKey('风格'); if (pst) ost = pst;
                var psn = findKey('季节'); if (psn) osn = psn;
                var psc = findKey('场景'); if (psc) osc = psc;
                var pdesc = findKey('描述'); if (pdesc) desc = pdesc;
            }
            var vcs = getViewCategories(dd); if (oc && vcs.indexOf(oc) === -1) vcs.push(oc); var o = { id: genId(), name: nm, category: oc, type: otype, style: ost, season: osn, sceneTag: osc, description: desc, images: url ? [url] : [], createdAt: Date.now() };
            if (dd.currentView === 'char' && dd.currentChar) getCharData(dd, dd.currentChar).outfits.push(o);
            else dd.outfits.push(o);
            created++;
        });
        save(dd); closeSheet(sheet); renderCatbar(); renderGrid(); renderBottomStatus(); toast('已创建 ' + created + ' 套');
    });
    sheet.querySelector('#om-ba-cancel').addEventListener('click', function () { closeSheet(sheet); });
    sheet.querySelector('#om-ba-copyprompt').addEventListener('click', function (e) { e.stopPropagation(); var prompt = '请逐一分析以下穿搭照片，对每张照片严格按以下格式返回（不要额外解释，直接输出）：\n\n--- 第1套 ---\n名称：<5-15字简短名称>\n分类：<睡衣/制服/常服/外出服>\n风格：<学院/简约/运动/甜美/通勤/休闲/街头/优雅/舒适>\n季节：<春/夏/秋/冬/全年>\n场景：<外出/家居/办公/约会/运动/睡前>\n描述：<100-200字服装描述>\n\n--- 第2套 ---\n...'; navigator.clipboard.writeText(prompt).then(function() { toast('提示词已复制！粘贴到外部AI对话框即可'); }).catch(function() { toast('复制失败，请手动复制', true); }); });
    sheet.querySelector('#om-ba-newcat').addEventListener('click', function () {
        var name = prompt('新分类名称：'); if (!name || !name.trim()) return; name = name.trim();
        var dd = load(); var vc = getViewCategories(dd); if (vc.indexOf(name) === -1) { vc.push(name); save(dd); renderCatbar(); }
        var sel = sheet.querySelector('#om-ba-cat'); var ex = false;
        for (var i = 0; i < sel.options.length; i++) { if (sel.options[i].value === name) { ex = true; break; } }
        if (!ex) { var opt = document.createElement('option'); opt.value = name; opt.textContent = name; sel.appendChild(opt); }
        sel.value = name;
    });
}

function openRandomRoll() {
    var d = load(); var allOutfits = getViewOutfits(d);
    var rollCtx = getSTContextSafe();
    var selectedWBNames = getSelectedWorldBookNames(rollCtx, d);
    if ((!d.selectedWorldBookNames || d.selectedWorldBookNames.length === 0) && selectedWBNames.length > 0) {
        d.selectedWorldBookNames = selectedWBNames.slice();
        save(d);
    }
    if (allOutfits.length === 0 && selectedWBNames.length === 0) { toast('还没有任何穿搭，也没有选择世界书', true); return; }
    var styles = []; var seasons = []; var scenes = [];
    allOutfits.forEach(function (o) { if (o.style && o.style.trim() && styles.indexOf(o.style.trim()) === -1) styles.push(o.style.trim()); if (o.season && o.season.trim() && seasons.indexOf(o.season.trim()) === -1) seasons.push(o.season.trim()); if (o.sceneTag && o.sceneTag.trim() && scenes.indexOf(o.sceneTag.trim()) === -1) scenes.push(o.sceneTag.trim()); });
    var sopts = styles.map(function (s) { return '<option value="' + esc(s) + '">' + esc(s) + '</option>'; }).join('');
    var seopts = seasons.map(function (s) { return '<option value="' + esc(s) + '">' + esc(s) + '</option>'; }).join('');
    var scopts = scenes.map(function (s) { return '<option value="' + esc(s) + '">' + esc(s) + '</option>'; }).join('');
    var sheet = createSheet([
        '<div class="om-sheet-title"><i class="fa-solid fa-dice"></i>随机搭配</div>',
        '<div class="om-field"><label style="font-weight:600;font-size:.85em;margin-bottom:4px">世界书风格</label>',
        '<div style="display:flex;flex-direction:column;gap:4px;font-size:.82em">',
        '<div id="om-roll-wb-list" style="display:flex;flex-direction:column;gap:4px;font-size:.82em"><i class="fa-solid fa-spinner fa-spin"></i> 加载世界书...</div>',
        '<label style="display:flex;align-items:center;gap:6px;cursor:pointer;margin-top:2px"><input type="checkbox" id="om-roll-wb-only" /> 仅roll世界书（不含衣柜）</label>',
        '</div></div>',
        '<div class="om-field"><label>风格</label><select id="om-roll-style"><option value="">不限</option>' + sopts + '</select></div>',
        '<div class="om-field"><label>季节</label><select id="om-roll-season"><option value="">不限</option>' + seopts + '</select></div>',
        '<div class="om-field"><label>场景</label><select id="om-roll-scene"><option value="">不限</option>' + scopts + '</select></div>',
        '<div class="om-field"><label>搭配模式</label><select id="om-roll-mode"><option value="mixed">套装优先 + 单品填充</option><option value="outfit">仅套装</option><option value="items">仅单品随机组合</option></select></div>',
        '<div class="om-field" id="om-roll-result-area" style="display:none;margin-top:12px"><div style="font-weight:600;font-size:.95em;margin-bottom:8px;color:var(--SmartThemeQuoteColor,#7c6daf)">搭配结果</div><div id="om-roll-result" style="background:rgba(127,127,127,.08);border-radius:10px;padding:14px;font-size:.85em;line-height:1.7;white-space:pre-wrap"></div><div class="om-btn-row" style="margin-top:10px"><button class="om-btn om-btn-safe" id="om-roll-apply">应用这套搭配</button></div></div>',
        '<div class="om-btn-row" style="margin-top:10px"><button class="om-btn om-btn-safe" id="om-roll-go">随机搭配！</button><button class="om-btn om-btn-outline" id="om-roll-cancel">取消</button></div>'
    ]);
    var lastResult = null;
    var worldBookStyleCache = getWorldBookStyleCache();
    // Populate world book checkboxes dynamically
    (function populateWBList() {
        var container = sheet.querySelector('#om-roll-wb-list');
        if (!container) return;
        try {
            var ctx = getSTContextSafe();
            var dd = load();
            var selectedDefaults = getSelectedWorldBookNames(ctx, dd);
            var wbNames = selectedDefaults.slice();
            if (wbNames.length === 0) {
                container.innerHTML = '<span style="opacity:.5">没有找到默认 uu 世界书，请先在酒馆中创建或选择世界书。</span>';
                return;
            }
            var selected = selectedDefaults.slice();
            var h = '';
            wbNames.forEach(function(name, idx) {
                var checked = selected.indexOf(name) !== -1 ? ' checked' : '';
                h += '<label style="display:flex;align-items:center;gap:6px;cursor:pointer"><input type="checkbox" class="om-roll-wb-book" value="' + name.replace(/"/g,'&quot;') + '"' + checked + ' /> ' + name.replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</label>';
            });
            container.innerHTML = h;
            dd.selectedWorldBookNames = selected;
            save(dd);
            // Save selection on change
            container.querySelectorAll('.om-roll-wb-book').forEach(function(cb) {
                cb.addEventListener('change', function() {
                    var dd2 = load();
                    dd2.selectedWorldBookNames = [];
                    container.querySelectorAll('.om-roll-wb-book:checked').forEach(function(c) { dd2.selectedWorldBookNames.push(c.value); });
                    save(dd2);
                });
            });
            // Load world books if cache is empty
            var needLoad = false;
            wbNames.forEach(function(n) { if (!worldBookStyleCache[n]) needLoad = true; });
            if (needLoad) {
                refreshWorldBookStyles(wbNames, function() {
                    container.querySelectorAll('.om-roll-wb-book').forEach(function(cb) {
                        if (worldBookStyleCache[cb.value]) {
                            var count = worldBookStyleCache[cb.value].length;
                            var txt = cb.parentElement.textContent;
                            if (!/\(\d/.test(txt)) {
                                cb.parentElement.appendChild(document.createTextNode(' (' + count + '套'));
                            }
                        }
                    });
                });
            } else {
                container.querySelectorAll('.om-roll-wb-book').forEach(function(cb) {
                    if (worldBookStyleCache[cb.value]) {
                        var count = worldBookStyleCache[cb.value].length;
                        cb.parentElement.appendChild(document.createTextNode(' (' + count + '套)'));
                    }
                });
            }
        } catch(e) { container.innerHTML = '<span style="opacity:.5">加载世界书失败</span>'; }
    })();
    function doRoll() { var ss = sheet.querySelector('#om-roll-style').value; var sn = sheet.querySelector('#om-roll-season').value; var sc = sheet.querySelector('#om-roll-scene').value; var sm = sheet.querySelector('#om-roll-mode').value; var useWBOnly = sheet.querySelector('#om-roll-wb-only') ? sheet.querySelector('#om-roll-wb-only').checked : false; var pool = useWBOnly ? [] : allOutfits.slice(); var wbList = sheet.querySelector('#om-roll-wb-list'); if (wbList) { var wbChecks = wbList.querySelectorAll('input[type=checkbox].om-roll-wb-book:checked'); wbChecks.forEach(function(cb) { var wbName = cb.value; if (worldBookStyleCache[wbName]) { worldBookStyleCache[wbName].forEach(function(ws, wi) { pool.push(createWorldBookOutfit(ws, 'wb_dyn_' + wbName.replace(/[^a-zA-Z0-9]/g,'_'), wi)); }); }});} var f = pool.filter(function (o) { if (ss && (!o.style || o.style.trim() !== ss)) return false; if (sn && (!o.season || o.season.trim() !== sn)) return false; if (sc && (!o.sceneTag || o.sceneTag.trim() !== sc)) return false; return true; }); if (f.length === 0) { toast('没有匹配的穿搭', true); return; } var r = { outfits: [], items: [] }; var fo = f.filter(function (o) { return !o.type || o.type === 'outfit'; }); var fi = f.filter(function (o) { return o.type === 'item'; }); if (sm === 'outfit') { if (fo.length === 0) { toast('没有匹配的套装', true); return; } r.outfits = [fo[Math.floor(Math.random() * fo.length)]]; } else if (sm === 'items') { var g = {}; fi.forEach(function (it) { var c = it.category || '其他'; if (!g[c]) g[c] = []; g[c].push(it); }); for (var k in g) r.items.push(g[k][Math.floor(Math.random() * g[k].length)]); } else { if (fo.length > 0) r.outfits = [fo[Math.floor(Math.random() * fo.length)]]; var g2 = {}; fi.forEach(function (it) { var c2 = it.category || '其他'; if (!g2[c2]) g2[c2] = []; g2[c2].push(it); }); for (var k2 in g2) r.items.push(g2[k2][Math.floor(Math.random() * g2[k2].length)]); } lastResult = r; var h = '<div>'; if (r.outfits.length > 0) { h += '<div style="font-weight:600;margin-bottom:8px">套装</div>'; r.outfits.forEach(function (o) { h += '<div style="display:flex;gap:10px;align-items:flex-start;margin-bottom:12px;padding:8px;background:rgba(127,127,127,.06);border-radius:8px">'; if (getFirstImage(o)) h += '<img src="' + getFirstImage(o) + '" style="width:80px;height:106px;object-fit:cover;border-radius:6px;flex-shrink:0" />'; h += '<div style="min-width:0"><div style="font-weight:600;margin-bottom:2px">' + esc(o.name) + '</div>'; if (o.style) h += '<div style="font-size:.8em;opacity:.7">风格：' + esc(o.style) + '</div>'; if (o.season) h += '<div style="font-size:.8em;opacity:.7">季节：' + esc(o.season) + '</div>'; if (o.sceneTag) h += '<div style="font-size:.8em;opacity:.7">场景：' + esc(o.sceneTag) + '</div>'; if (o.description) h += '<div style="font-size:.82em;opacity:.85;margin-top:6px;line-height:1.6;padding:8px;background:rgba(127,127,127,.05);border-radius:6px;white-space:pre-wrap">' + esc(o.description) + '</div>'; h += '</div></div>'; }); } if (r.items.length > 0) { h += '<div style="font-weight:600;margin:8px 0">单品</div>'; r.items.forEach(function (o) { h += '<div style="display:flex;gap:10px;align-items:flex-start;margin-bottom:8px;padding:6px 8px;background:rgba(127,127,127,.04);border-radius:6px">'; if (getFirstImage(o)) h += '<img src="' + getFirstImage(o) + '" style="width:60px;height:80px;object-fit:cover;border-radius:4px;flex-shrink:0" />'; h += '<div><span style="font-size:.75em;opacity:.5">' + esc(o.category || '其他') + '</span><br>' + esc(o.name) + '</div>'; if (o.description) h += '<div style="font-size:.75em;opacity:.7;margin-top:2px;line-height:1.4">' + esc(o.description) + '</div>'; h += '</div></div>'; }); } h += '</div>'; sheet.querySelector('#om-roll-result').innerHTML = h; sheet.querySelector('#om-roll-result-area').style.display = ''; }
    sheet.querySelector('#om-roll-go').addEventListener('click', doRoll);
    sheet.querySelector('#om-roll-cancel').addEventListener('click', function () { closeSheet(sheet); });
    sheet.querySelector('#om-roll-apply').addEventListener('click', function () { if (!lastResult) return; var dd = load(); dd.activeIds = []; if (dd.chars) for (var cn in dd.chars) dd.chars[cn].activeIds = []; var ids = []; lastResult.outfits.forEach(function (o) { if (o.isVirtual) { var no = { id: genId(), name: o.name, category: o.category || '', type: 'outfit', style: o.style || '', season: o.season || '', sceneTag: o.sceneTag || '', description: o.description || '', images: [], createdAt: Date.now(), isVirtual: true }; dd.virtualOutfits[no.id] = no; ids.push(no.id); } else { ids.push(o.id); } }); lastResult.items.forEach(function (o) { ids.push(o.id); }); if (dd.currentView === 'char' && dd.currentChar) getCharData(dd, dd.currentChar).activeIds = ids; else dd.activeIds = ids; save(dd); closeSheet(sheet); toast('已应用！(' + ids.length + '件)'); renderGrid(); renderBottomStatus(); updateBtn(); });

}

function openEditSheet(outfit, defaultCat) {
    var d = load();
    var editImages = outfit ? (outfit.images ? outfit.images.slice() : []) : [];
    var viewCats = getViewCategories(d);
    var catOpts = '<option value="">无分类</option>' +
        viewCats.map(function (c) { return '<option value="' + esc(c) + '"' + (outfit && outfit.category === c ? ' selected' : '') + '>' + esc(c) + '</option>'; }).join('');

    var sheet = createSheet([
        '<div class="om-sheet-title"><i class="fa-solid fa-' + (outfit ? 'pen' : 'plus') + '"></i>' + (outfit ? '编辑穿搭' : '添加穿搭') + '</div>',
        '<div class="om-field"><label>穿搭名称 *</label><input type="text" id="om-dn" placeholder="如：白色蕾丝连衣裙" value="' + esc(outfit ? outfit.name : '') + '" /></div>',
        '<div class="om-field"><label>分类</label><div class="om-frow"><select id="om-dcat">' + catOpts + '</select><button class="om-btn om-btn-outline" id="om-dnewcat" style="white-space:nowrap;font-size:.8em;padding:7px 10px">+ 新建</button></div></div>',
        '<div class="om-field"><label>类型</label><div class="om-type-radios"><label class="om-radio-label"><input type="radio" name="om-dtype" value="套装"' + (!outfit || outfit.type !== '单品' ? ' checked' : '') + ' /> 套装</label><label class="om-radio-label" style="margin-left:16px"><input type="radio" name="om-dtype" value="单品"' + (outfit && outfit.type === '单品' ? ' checked' : '') + ' /> 单品</label></div></div>',
        '<div class="om-field"><label>风格</label><input type="text" id="om-dstyle" placeholder="学院 / 简约 / 运动 / 甜美 / 通勤 / 休闲 / 街头 / 优雅 / 舒适" value="' + esc(outfit ? outfit.style || '' : '') + '" /></div>',
        '<div class="om-field"><label>季节</label><input type="text" id="om-dseason" placeholder="春 / 夏 / 秋 / 冬 / 全年" value="' + esc(outfit ? outfit.season || '' : '') + '" /></div>',
        '<div class="om-field"><label>文字描述 <span class="om-hint">AI 注入用，越详细越好</span></label><textarea id="om-ddesc" rows="4" placeholder="如：白色蕾丝镂空连衣裙，领口略低，裙摆及膝……">' + esc(outfit ? outfit.description || '' : '') + '</textarea>' +
        '<button class="om-btn om-btn-outline" id="om-daidesc" style="font-size:.78em;margin-top:5px;align-self:flex-start"><i class="fa-solid fa-wand-magic-sparkles"></i> AI 生成描述</button>' +
        '<button class="om-btn om-btn-outline" id="om-dautotag" style="font-size:.78em;margin-top:5px;align-self:flex-start"><i class="fa-solid fa-wand-magic-sparkles"></i> AI 一键识别</button></div>',
        '<div class="om-field"><label>场景标签 <span class="om-hint">多套时 AI 据此选穿搭，如：外出 / 家居 / 睡前</span></label>',
        '<div class="om-suggest-wrap"><input type="text" id="om-dscene" placeholder="外出 / 家居 / 睡前 / 运动" value="' + esc(outfit ? outfit.sceneTag || '' : '') + '" autocomplete="off" />',
        '<div class="om-suggest-list" id="om-scene-suggest" style="display:none"></div></div></div>',
        '<div class="om-field"><label>参考图片 <span class="om-hint">可选，自动压缩</span></label>',
        '<div id="om-dimg-thumbs" style="display:flex;gap:6px;overflow-x:auto;padding:4px 0;min-height:60px;align-items:center">' + editImages.map(function (d, i) { return '<div class="om-thumb" data-idx="' + i + '" style="position:relative;flex-shrink:0"><img src="' + d + '" style="width:60px;height:60px;object-fit:cover;border-radius:6px;cursor:pointer" /><span class="om-thumb-x" data-idx="' + i + '" style="position:absolute;top:-4px;right:-4px;width:18px;height:18px;background:#e53935;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;cursor:pointer;line-height:1;z-index:1">&times;</span></div>'; }).join('') + '<div id="om-dimg-add" style="width:60px;height:60px;border:2px dashed rgba(127,127,127,.3);border-radius:6px;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;font-size:24px;color:rgba(127,127,127,.5)"><i class="fa-solid fa-plus"></i></div></div>',
        '<input type="file" id="om-dfile" accept="image/*" multiple style="display:none" />',
        '<div class="om-img-actions"><button class="om-btn om-btn-outline" id="om-dpick" style="font-size:.8em"><i class="fa-solid fa-image"></i> 选择图片</button><button class="om-btn om-btn-outline" id="om-durl" style="font-size:.8em"><i class="fa-solid fa-link"></i> 粘贴URL导入</button></div></div>',
        '<div class="om-edit-foot"><button class="om-btn om-btn-outline" id="om-dcancel">取消</button><button class="om-btn om-btn-safe" id="om-dsave">保存</button></div>',
    ].join(''));

    // 设置默认分类
    if (defaultCat) {
        var sel = sheet.querySelector('#om-dcat'); if (sel) sel.value = defaultCat;
    }

    // 场景标签建议
    var sceneInput = sheet.querySelector('#om-dscene');
    var suggestList = sheet.querySelector('#om-scene-suggest');
    var allTags = getAllTagSuggestions(d);
    function showSuggestions(val) {
        var v = val.trim().toLowerCase();
        var filtered = v ? allTags.filter(function (t) { return t.toLowerCase().indexOf(v) !== -1 && t.toLowerCase() !== v; }) : allTags;
        if (filtered.length === 0) { suggestList.style.display = 'none'; return; }
        suggestList.innerHTML = filtered.map(function (t) { return '<div class="om-suggest-item" data-val="' + esc(t) + '">' + esc(t) + '</div>'; }).join('');
        suggestList.style.display = 'block';
    }
    sceneInput.addEventListener('focus', function () { showSuggestions(this.value); });
    sceneInput.addEventListener('input', function () { showSuggestions(this.value); });
    sceneInput.addEventListener('blur', function () { setTimeout(function () { suggestList.style.display = 'none'; }, 150); });
    suggestList.addEventListener('mousedown', function (e) {
        var item = e.target.closest('.om-suggest-item');
        if (item) { sceneInput.value = item.dataset.val; suggestList.style.display = 'none'; }
    });

    // 图片处理 - 多图管理
    var fileInp = sheet.querySelector('#om-dfile');
    var thumbsContainer = sheet.querySelector('#om-dimg-thumbs');

    function renderThumbs() {
        var h = editImages.map(function (d, i) {
            return '<div class="om-thumb" data-idx="' + i + '" style="position:relative;flex-shrink:0"><img src="' + d + '" style="width:60px;height:60px;object-fit:cover;border-radius:6px;cursor:pointer" /><span class="om-thumb-x" data-idx="' + i + '" style="position:absolute;top:-4px;right:-4px;width:18px;height:18px;background:#e53935;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;cursor:pointer;line-height:1;z-index:1">&times;</span></div>';
        }).join('');
        h += '<div id="om-dimg-add" style="width:60px;height:60px;border:2px dashed rgba(127,127,127,.3);border-radius:6px;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;font-size:24px;color:rgba(127,127,127,.5)"><i class="fa-solid fa-plus"></i></div>';
        thumbsContainer.innerHTML = h;
        bindThumbEvents();
    }

    function bindThumbEvents() {
        thumbsContainer.querySelectorAll('.om-thumb-x').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                removeImage(parseInt(btn.dataset.idx));
            });
        });
        thumbsContainer.querySelectorAll('.om-thumb img').forEach(function (img) {
            img.addEventListener('click', function (e) {
                e.stopPropagation();
                openLightbox(img.src);
            });
        });
        var addBtn = thumbsContainer.querySelector('#om-dimg-add');
        if (addBtn) addBtn.addEventListener('click', function () { fileInp.click(); });
    }

    function addImage(dataUrl) {
        editImages.push(dataUrl);
        renderThumbs();
    }

    function removeImage(idx) {
        editImages.splice(idx, 1);
        renderThumbs();
    }

    function handleFiles(files) {
        for (var i = 0; i < files.length; i++) {
            (function (f) {
                if (!f || f.type.indexOf('image') !== 0) return;
                var r = new FileReader();
                r.onload = function (e) { compressImage(e.target.result, function (c) { addImage(c); }); };
                r.readAsDataURL(f);
            })(files[i]);
        }
    }

    // URL导入
    sheet.querySelector('#om-durl').addEventListener('click', function () {
        var url = prompt('粘贴图片URL：');
        if (!url || !url.trim()) return;
        url = url.trim();
        toast('正在加载图片...');
        var img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function () {
            var canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            var dataUrl = canvas.toDataURL('image/jpeg', 0.9);
            compressImage(dataUrl, function (c) {
                addImage(c);
                toast('图片已添加');
            });
        };
        img.onerror = function () {
            // 尝试通过 fetch 代理
            fetch(url).then(function (r) { return r.blob(); }).then(function (blob) {
                var r = new FileReader();
                r.onload = function (e) { compressImage(e.target.result, function (c) { addImage(c); toast('图片已添加'); }); };
                r.readAsDataURL(blob);
            }).catch(function () { toast('无法加载图片（可能被CORS阻止）', true); });
        };
        img.src = url;
    });

    sheet.querySelector('#om-dpick').addEventListener('click', function () { fileInp.click(); });
    fileInp.addEventListener('change', function () { if (fileInp.files.length > 0) handleFiles(fileInp.files); fileInp.value = ''; });
    bindThumbEvents();

    // 拖拽到缩略图区域
    thumbsContainer.addEventListener('dragover', function (e) { e.preventDefault(); thumbsContainer.style.outline = '2px solid var(--SmartThemeQuoteColor,#7c6daf)'; });
    thumbsContainer.addEventListener('dragleave', function () { thumbsContainer.style.outline = ''; });
    thumbsContainer.addEventListener('drop', function (e) { e.preventDefault(); thumbsContainer.style.outline = ''; if (e.dataTransfer && e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files); });

    // AI 生成描述按钮
    sheet.querySelector('#om-daidesc').addEventListener('click', function () {
        if (editImages.length === 0) { toast('请先上传图片', true); return; }
        var dd = load();
        if (!dd.apiVision.endpoint || !dd.apiVision.key || !dd.apiVision.model) { toast('请先在设置中配置"描述生成 API"', true); return; }
        var btn = sheet.querySelector('#om-daidesc');
        btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 生成中...';
        var tmpOutfit = { name: sheet.querySelector('#om-dn').value || '穿搭', images: editImages.slice() };
        generateSingleDescription(tmpOutfit, function (err, desc) {
            btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> AI 生成描述';
            if (err) { toast('生成失败：' + err, true); return; }
            sheet.querySelector('#om-ddesc').value = desc;
            toast('描述已生成');
        });
    });

    sheet.querySelector('#om-dautotag').addEventListener('click', function () { if (editImages.length === 0) { toast('请先上传图片', true); return; } var ddx = load(); if (!ddx.apiVision.endpoint || !ddx.apiVision.key || !ddx.apiVision.model) { toast('请先配置 API', true); return; } var btnx = this; btnx.disabled = true; btnx.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 识别中...'; callVisionAPI(ddx.apiVision, { name: sheet.querySelector('#om-dn').value || '穿搭', dataUrl: editImages[0] }, ddx.apiVision.autoTagPrompt, function (err, text) { btnx.disabled = false; btnx.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> AI 一键识别'; if (err) { toast('识别失败：' + err, true); return; } var parsed = parseAutoTagResult(text); if (parsed.name) sheet.querySelector('#om-dn').value = parsed.name; if (parsed.type) { var radios = sheet.querySelectorAll('input[name="om-dtype"]'); radios.forEach(function (r) { r.checked = r.value === parsed.type; }); } if (parsed.style) sheet.querySelector('#om-dstyle').value = parsed.style; if (parsed.season) sheet.querySelector('#om-dseason').value = parsed.season; if (parsed.scene) sheet.querySelector('#om-dscene').value = parsed.scene; if (parsed.description) sheet.querySelector('#om-ddesc').value = parsed.description; toast('一键识别完成'); }); });
    sheet.querySelector('#om-dnewcat').addEventListener('click', function () {
        var name = prompt('新分类名称：'); if (!name || !name.trim()) return; name = name.trim();
        var dd = load(); var vc = getViewCategories(dd); if (vc.indexOf(name) === -1) { vc.push(name); save(dd); renderCatbar(); }
        var sel = sheet.querySelector('#om-dcat'); var ex = false;
        for (var i = 0; i < sel.options.length; i++) { if (sel.options[i].value === name) { ex = true; break; } }
        if (!ex) { var opt = document.createElement('option'); opt.value = name; opt.textContent = name; sel.appendChild(opt); }
        sel.value = name; toast('分类「' + name + '」已添加');
    });

    sheet.querySelector('#om-dcancel').addEventListener('click', function () { closeSheet(sheet); });
    sheet.querySelector('#om-dsave').addEventListener('click', function () {
        var name = sheet.querySelector('#om-dn').value.trim();
        if (!name) { toast('请输入穿搭名称', true); return; }
        var cat = sheet.querySelector('#om-dcat').value;
        var desc = sheet.querySelector('#om-ddesc').value.trim();
        var scene = sheet.querySelector('#om-dscene').value.trim();
        var otype = (sheet.querySelector('input[name="om-dtype"]:checked') || {}).value || '套装';
        var style = sheet.querySelector('#om-dstyle') ? sheet.querySelector('#om-dstyle').value.trim() : '';
        var season = sheet.querySelector('#om-dseason') ? sheet.querySelector('#om-dseason').value.trim() : '';
        var dd = load();
        if (outfit) {
            // 编辑已有穿搭 - 在所有数据中查找
            var found = false;
            for (var i = 0; i < dd.outfits.length; i++) {
                if (dd.outfits[i].id === outfit.id) {
                    Object.assign(dd.outfits[i], { name: name, category: cat, type: otype, style: style, season: season, description: desc, sceneTag: scene, images: editImages }); found = true; break;
                }
            }
            if (!found && dd.chars) {
                for (var cn in dd.chars) {
                    var co = dd.chars[cn].outfits || [];
                    for (var j = 0; j < co.length; j++) {
                        if (co[j].id === outfit.id) { Object.assign(co[j], { name: name, category: cat, type: otype, style: style, season: season, description: desc, sceneTag: scene, images: editImages }); found = true; break; }
                    }
                    if (found) break;
                }
            }
        } else {
            // 新增穿搭 - 放入当前视角
            var newOutfit = { id: genId(), name: name, category: cat, type: otype, style: style, season: season, description: desc, sceneTag: scene, images: editImages, createdAt: Date.now() };
            if (dd.currentView === 'char' && dd.currentChar) {
                getCharData(dd, dd.currentChar).outfits.push(newOutfit);
            } else {
                dd.outfits.push(newOutfit);
            }
        }
        save(dd); closeSheet(sheet); toast('✨ 已保存：' + name); renderCatbar(); renderGrid(); renderBottomStatus(); updateBtn();
    });
}

// ── 预设 Bottom Sheet ─────────────────────────────────────

function openPresetsSheet() {
    var d = load();
    var activePresetId = d.activePresetId || null;
    var presetListHtml = (!d.presets || d.presets.length === 0)
        ? '<div class="om-empty"><i class="fa-solid fa-bookmark"></i><span>还没有预设</span></div>'
        : d.presets.map(function (p, idx) {
            var isCurrent = (activePresetId && p.id === activePresetId);
            return '<div class="om-preset-item' + (isCurrent ? ' current' : '') + '" data-idx="' + idx + '">' +
                '<div class="om-preset-name">' + esc(p.name) + (isCurrent ? ' <span style="font-size:.7em;opacity:.5;font-weight:400">（当前）</span>' : '') + '</div>' +
                '<div class="om-preset-count">包含 ' + (p.outfits || []).length + ' 套穿搭</div>' +
                '<button class="om-btn-sm om-preset-ren" data-idx="' + idx + '" title="重命名"><i class="fa-solid fa-pen"></i></button>' +
                '<button class="om-btn-sm om-preset-del" data-idx="' + idx + '" title="删除"><i class="fa-solid fa-trash"></i></button>' +
                '</div>';
        }).join('');

    // 保存区：如果有当前预设，显示"覆盖保存"按钮
    var currentPreset = null;
    if (activePresetId && d.presets) {
        for (var pi = 0; pi < d.presets.length; pi++) {
            if (d.presets[pi].id === activePresetId) { currentPreset = d.presets[pi]; break; }
        }
    }
    var saveSection = '';
    if (currentPreset) {
        saveSection =
            '<div class="om-sec-title">保存</div>' +
            '<div class="om-btn-row" style="margin-bottom:10px">' +
            '<button class="om-btn om-btn-safe" id="om-preset-overwrite" style="flex:1"><i class="fa-solid fa-floppy-disk"></i> 保存到「' + esc(currentPreset.name) + '」</button>' +
            '</div>' +
            '<div class="om-divider"></div>' +
            '<div class="om-sec-title">另存为新预设</div>' +
            '<div class="om-cat-add-row"><input type="text" id="om-preset-name-inp" placeholder="新预设名称…" /><button class="om-btn om-btn-outline" id="om-preset-save">保存</button></div>';
    } else {
        saveSection =
            '<div class="om-sec-title">保存当前状态为预设</div>' +
            '<div class="om-hint" style="margin-bottom:8px">将当前所有穿搭数据 + 分类一起打包保存</div>' +
            '<div class="om-cat-add-row"><input type="text" id="om-preset-name-inp" placeholder="预设名称…" /><button class="om-btn om-btn-safe" id="om-preset-save">保存</button></div>';
    }

    var sheet = createSheet([
        '<div class="om-sheet-title"><i class="fa-solid fa-bookmark"></i>预设管理</div>',
        '<div class="om-sec-title">已保存的预设 <span class="om-hint">点击名称加载</span></div>',
        presetListHtml,
        '<div class="om-divider"></div>',
        saveSection,
    ].join(''));

    // 覆盖保存到当前预设
    var overwriteBtn = sheet.querySelector('#om-preset-overwrite');
    if (overwriteBtn) overwriteBtn.addEventListener('click', function () {
        var dd = load();
        for (var i = 0; i < dd.presets.length; i++) {
            if (dd.presets[i].id === activePresetId) {
                dd.presets[i].outfits = JSON.parse(JSON.stringify(dd.outfits));
                dd.presets[i].categories = JSON.parse(JSON.stringify(dd.categories));
                dd.presets[i].activeIds = JSON.parse(JSON.stringify(dd.activeIds));
                dd.presets[i].updatedAt = Date.now();
                break;
            }
        }
        save(dd); closeSheet(sheet); toast('✅ 已保存到「' + currentPreset.name + '」'); openPresetsSheet();
    });

    // 保存为新预设
    var inp = sheet.querySelector('#om-preset-name-inp');
    sheet.querySelector('#om-preset-save').addEventListener('click', function () {
        var name = inp.value.trim(); if (!name) { toast('请输入预设名称', true); return; }
        var dd = load();
        if (!Array.isArray(dd.presets)) dd.presets = [];
        var newId = genId();
        dd.presets.push({ id: newId, name: name, createdAt: Date.now(), outfits: JSON.parse(JSON.stringify(dd.outfits)), categories: JSON.parse(JSON.stringify(dd.categories)), activeIds: JSON.parse(JSON.stringify(dd.activeIds)) });
        save(dd); dd = load(); dd.activePresetId = newId; save(dd); inp.value = ''; closeSheet(sheet); toast('✨ 预设「' + name + '」已保存'); openPresetsSheet();
    });
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') sheet.querySelector('#om-preset-save').click(); });

    // 加载预设
    sheet.querySelectorAll('.om-preset-item').forEach(function (item) {
        item.addEventListener('click', function (e) {
            if (e.target.closest('.om-preset-ren') || e.target.closest('.om-preset-del')) return;
            var dd = load(); var p = dd.presets[parseInt(item.dataset.idx)]; if (!p) return;
            if (!confirm('加载预设「' + p.name + '」？这将覆盖当前所有穿搭数据。')) return;
            dd.outfits = JSON.parse(JSON.stringify(p.outfits || []));
            dd.categories = JSON.parse(JSON.stringify(p.categories || []));
            dd.activeIds = JSON.parse(JSON.stringify(p.activeIds || []));
            dd.activePresetId = p.id;
            save(dd); closeSheet(sheet); renderCatbar(); renderGrid(); renderBottomStatus(); updateBtn(); toast('✅ 已加载「' + p.name + '」');
        });
    });
    sheet.querySelectorAll('.om-preset-ren').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            var dd = load(); var p = dd.presets[parseInt(btn.dataset.idx)]; if (!p) return;
            var nw = prompt('重命名：', p.name); if (!nw || !nw.trim()) return;
            p.name = nw.trim(); save(dd); closeSheet(sheet); openPresetsSheet(); toast('已重命名');
        });
    });
    sheet.querySelectorAll('.om-preset-del').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            var dd = load(); var p = dd.presets[parseInt(btn.dataset.idx)]; if (!p) return;
            if (!confirm('删除预设「' + p.name + '」？')) return;
            if (p.id === activePresetId) { dd.activePresetId = null; }
            dd.presets.splice(parseInt(btn.dataset.idx), 1); save(dd); closeSheet(sheet); openPresetsSheet(); toast('已删除');
        });
    });
}

// ── 设置 Bottom Sheet ─────────────────────────────────────

function openSettingsSheet() {
    var d = load();
    var imgCount = d.outfits.filter(function (o) { return hasImages(o); }).length;

    var tplList = getAllTemplates();
    var activeTpl = getActiveTemplate();
    var tplOpts = tplList.map(function (t) {
        var isCustom = t.id.indexOf('custom_') === 0;
        return '<option value="' + esc(t.id) + '"' + (t.id === activeTpl.id ? ' selected' : '') + '>' + esc(t.name) + (isCustom ? ' (自定义)' : '') + '</option>';
    }).join('');

    var sheet = createSheet([
        '<div class="om-sheet-title"><i class="fa-solid fa-sliders"></i>设置</div>',

        '<div class="om-sec-title">发送内容</div>',
        '<div class="om-setting-row"><label>发送给 AI 的内容类型</label><select id="om-mode">',
        '<option value="text"' + (d.mode === 'text' ? ' selected' : '') + '>仅文字描述</option>',
        '<option value="image"' + (d.mode === 'image' ? ' selected' : '') + '>仅图片</option>',
        '<option value="both"' + (d.mode === 'both' ? ' selected' : '') + '>文字 + 图片</option>',
        '</select></div>',

        '<div class="om-setting-row"><label style="display:flex;align-items:center;gap:8px;cursor:pointer"><input type="checkbox" id="om-auto-roll"' + (!d.autoRollDisabled ? ' checked' : '') + ' /> 启动时自动随机穿搭（从世界书）</label></div>' +
        '<div class="om-setting-row"><label>注入位置 <span class="om-hint">Gemini/DeepSeek 建议选\"用户消息\"</span></label><select id="om-inject-pos">',
        '<option value="system"' + (d.injectPosition === 'system' ? ' selected' : '') + '>系统提示末尾</option>',
        '<option value="context"' + (d.injectPosition === 'context' ? ' selected' : '') + '>上下文末尾</option>',
        '<option value="user"' + (d.injectPosition === 'user' || !d.injectPosition ? ' selected' : '') + '>用户消息末尾（推荐）</option>',
        '</select></div>',

        '<div class="om-divider"></div>',
        '<div class="om-sec-title"><i class="fa-solid fa-wand-magic-sparkles" style="margin-right:4px"></i>提示词预设</div>',
        '<div class="om-setting-row"><label>当前模板</label><select id="om-preset-tpl-sel">' + tplOpts + '</select></div>',
        '<div class="om-setting-row" style="display:flex;gap:6px;flex-wrap:wrap">',
        '<button class="om-btn om-btn-outline" id="om-preset-import-st" style="font-size:.8em"><i class="fa-solid fa-download"></i> 导入酒馆预设</button>',
        '<button class="om-btn om-btn-outline" id="om-preset-save-st" style="font-size:.8em"><i class="fa-solid fa-upload"></i> 保存到酒馆预设</button>',
        '<button class="om-btn om-btn-outline" id="om-preset-import-ext" style="font-size:.8em"><i class="fa-solid fa-file-import"></i> 导入外部预设</button>',
        '<button class="om-btn om-btn-outline" id="om-preset-new-tpl" style="font-size:.8em"><i class="fa-solid fa-plus"></i> 新建自定义模板</button>',
        '<input type="file" id="om-preset-ext-file" accept=".json" style="display:none" />',
        '</div>',
        '<div id="om-preset-custom-form" style="display:none;margin:8px 0;padding:12px;background:rgba(127,127,127,.08);border-radius:10px">',
        '<div style="font-weight:600;font-size:.9em;margin-bottom:8px">新建自定义模板</div>',
        '<div class="om-setting-row"><label>模板名称</label><input type="text" id="om-ctpl-name" placeholder="如：我的甜美风" /></div>',
        '<div class="om-setting-row"><label>系统提示词</label><textarea id="om-ctpl-sys" rows="4" placeholder="定义AI角色和输出格式..."></textarea></div>',
        '<div class="om-setting-row"><label>用户提示前缀</label><textarea id="om-ctpl-user" rows="2" placeholder="如：请为以下场景设计穿搭："></textarea></div>',
        '<div class="om-setting-row"><label>Temperature: <span id="om-ctpl-temp-val">0.8</span></label><input type="range" id="om-ctpl-temp" min="0" max="2" step="0.05" value="0.8" style="width:100%" /></div>',
        '<div class="om-setting-row"><label>Max Tokens</label><input type="number" id="om-ctpl-tokens" value="600" min="50" max="4000" style="background:rgba(127,127,127,.08);border:1px solid rgba(127,127,127,.2);border-radius:8px;color:inherit;padding:7px 10px;font-size:.85em;width:100px;box-sizing:border-box;font-family:inherit" /></div>',
        '<div class="om-btn-row" style="margin-top:6px"><button class="om-btn om-btn-safe" id="om-ctpl-save">保存模板</button><button class="om-btn om-btn-outline" id="om-ctpl-cancel">取消</button></div>',
        '</div>',
        '<div id="om-preset-edit-area" style="display:none;margin:8px 0;padding:12px;background:rgba(127,127,127,.08);border-radius:10px">',
        '<div style="font-weight:600;font-size:.9em;margin-bottom:8px"><span id="om-ptpl-edit-title"></span></div>',
        '<div class="om-setting-row"><label>系统提示词</label><textarea id="om-ptpl-sys" rows="4"></textarea></div>',
        '<div class="om-setting-row"><label>用户提示前缀</label><textarea id="om-ptpl-user" rows="2"></textarea></div>',
        '<div class="om-setting-row"><label>Temperature: <span id="om-ptpl-temp-val"></span></label><input type="range" id="om-ptpl-temp" min="0" max="2" step="0.05" style="width:100%" /></div>',
        '<div class="om-setting-row"><label>Max Tokens</label><input type="number" id="om-ptpl-tokens" min="50" max="4000" style="background:rgba(127,127,127,.08);border:1px solid rgba(127,127,127,.2);border-radius:8px;color:inherit;padding:7px 10px;font-size:.85em;width:100px;box-sizing:border-box;font-family:inherit" /></div>',
        '<div class="om-btn-row" style="margin-top:6px"><button class="om-btn om-btn-safe" id="om-ptpl-save">保存修改</button><button class="om-btn om-btn-outline" id="om-ptpl-cancel">取消</button></div>',
        '</div>',

        '<div class="om-divider"></div>',
        '<div class="om-sec-title">单套模式模板 <span class="om-hint">（User选了1套时生效）</span></div>',
        '<div class="om-hint" style="margin-bottom:6px">{{description}} → 替换为穿搭的文字描述</div>',
        '<div class="om-setting-row"><textarea id="om-tpl-single" rows="3">' + esc(d.singleTemplate) + '</textarea></div>',

        '<div class="om-divider"></div>',
        '<div class="om-sec-title">衣柜模式模板 <span class="om-hint">（User选了多套时生效）</span></div>',
        '<div class="om-hint" style="margin-bottom:6px">{{wardrobe}} → 替换为所有已选穿搭的列表</div>',
        '<div class="om-setting-row"><textarea id="om-tpl-multi" rows="5">' + esc(d.multiTemplate) + '</textarea></div>',

        '<div class="om-divider"></div>',
        '<div class="om-sec-title">角色单套模板 <span class="om-hint">（角色选了1套时生效）</span></div>',
        '<div class="om-hint" style="margin-bottom:6px">{{charName}} → 角色名 / {{description}} → 描述</div>',
        '<div class="om-setting-row"><textarea id="om-tpl-char-single" rows="3">' + esc(d.charSingleTemplate || '【{{charName}}的穿搭】\n{{description}}') + '</textarea></div>',

        '<div class="om-divider"></div>',
        '<div class="om-sec-title">角色衣柜模板 <span class="om-hint">（角色选了多套时生效）</span></div>',
        '<div class="om-hint" style="margin-bottom:6px">{{charName}} → 角色名 / {{wardrobe}} → 穿搭列表</div>',
        '<div class="om-setting-row"><textarea id="om-tpl-char-multi" rows="5">' + esc(d.charMultiTemplate || '【{{charName}}的穿搭】\n{{wardrobe}}') + '</textarea></div>',

        '<div class="om-divider"></div>',
        '<div class="om-sec-title">图片模式补充提示</div>',
        '<div class="om-setting-row"><label>单套+图片</label><textarea id="om-imgprompt" rows="2">' + esc(d.imagePrompt) + '</textarea></div>',
        '<div class="om-setting-row" style="margin-top:6px"><label>衣柜+图片</label><textarea id="om-multi-imgprompt" rows="2">' + esc(d.multiImagePrompt) + '</textarea></div>',

        '<div class="om-divider"></div>',
        '<div class="om-sec-title"><i class="fa-solid fa-wand-magic-sparkles" style="margin-right:4px"></i>描述生成 API <span class="om-hint">（用于批量生成穿搭文字描述，需要 Vision 模型）</span></div>',
        '<div class="om-setting-row om-row-inline"><label>使用酒馆主 API（推荐）</label><input type="checkbox" class="om-chk" id="om-use-main-api"' + (d.useMainApi !== false ? ' checked' : '') + ' /></div>',
        '<div id="om-custom-api-fields" style="display:' + (d.useMainApi !== false ? 'none' : 'block') + '">',
        '<div class="om-setting-row"><label>API 地址</label><input type="text" id="om-api-v-endpoint" placeholder="https://api.openai.com 或中转站地址" value="' + esc(d.apiVision.endpoint) + '" style="background:rgba(127,127,127,.08);border:1px solid rgba(127,127,127,.2);border-radius:8px;color:inherit;padding:7px 10px;font-size:.85em;width:100%;box-sizing:border-box;font-family:inherit" /></div>',
        '<div class="om-setting-row"><label>API Key</label><input type="password" id="om-api-v-key" placeholder="sk-..." value="' + esc(d.apiVision.key) + '" style="background:rgba(127,127,127,.08);border:1px solid rgba(127,127,127,.2);border-radius:8px;color:inherit;padding:7px 10px;font-size:.85em;width:100%;box-sizing:border-box;font-family:inherit" /></div>',
        '<div class="om-setting-row"><label>模型名称</label><div style="display:flex;gap:6px;align-items:center"><input type="text" id="om-api-v-model" placeholder="gpt-4o / gemini-2.0-flash / claude-sonnet-4-20250514" value="' + esc(d.apiVision.model) + '" style="flex:1;background:rgba(127,127,127,.08);border:1px solid rgba(127,127,127,.2);border-radius:8px;color:inherit;padding:7px 10px;font-size:.85em;box-sizing:border-box;font-family:inherit" /><button class="om-btn om-btn-outline" id="om-api-v-model-fetch" style="font-size:.75em;white-space:nowrap;padding:7px 10px;flex-shrink:0"><i class="fa-solid fa-rotate"></i> 拉取</button></div></div>',
        '<div class="om-setting-row"><label>并发数 <span class="om-hint">同时发送的请求数，越大越快但可能触发限速（1-5）</span></label><input type="number" id="om-api-v-batch" min="1" max="5" value="' + (d.apiVision.concurrency || 3) + '" style="background:rgba(127,127,127,.08);border:1px solid rgba(127,127,127,.2);border-radius:8px;color:inherit;padding:7px 10px;font-size:.85em;width:80px;box-sizing:border-box;font-family:inherit" /></div>',
        '<div class="om-setting-row"><label>描述生成 Prompt</label><textarea id="om-api-v-prompt" rows="3" style="background:rgba(127,127,127,.08);border:1px solid rgba(127,127,127,.2);border-radius:8px;color:inherit;padding:7px 10px;font-size:.85em;width:100%;box-sizing:border-box;resize:vertical;font-family:inherit">' + esc(d.apiVision.prompt) + '</textarea></div>',
        '<div class="om-setting-row om-row-inline"><label>覆盖已有描述</label><input type="checkbox" class="om-chk" id="om-api-v-overwrite"' + (d.apiVision.overwrite ? ' checked' : '') + ' /></div>',
        '</div>',
        '<div class="om-btn-row" style="margin-top:6px"><button class="om-btn om-btn-outline" id="om-api-v-test" style="font-size:.8em"><i class="fa-solid fa-flask-vial"></i> 测试连接</button></div>',

        '<div class="om-divider"></div>',
        '<div class="om-sec-title">分类管理</div>',
        '<button class="om-btn om-btn-outline" id="om-open-cats" style="width:100%;text-align:left"><i class="fa-solid fa-tags" style="margin-right:7px"></i>管理分类…</button>',

        '<div class="om-divider"></div>',
        '<div class="om-sec-title">数据</div>',
        '<div class="om-storage-info">' + d.outfits.length + ' 套穿搭 / ' + imgCount + ' 张图片 / ' + (d.presets ? d.presets.length : 0) + ' 个预设 | 酒馆共享存储</div>',
        '<div class="om-btn-row" style="margin-top:8px">',
        '<button class="om-btn om-btn-outline" id="om-exp"><i class="fa-solid fa-download"></i> 导出</button>',
        '<button class="om-btn om-btn-outline" id="om-imp"><i class="fa-solid fa-upload"></i> 导入</button>',
        '<button class="om-btn om-btn-danger" id="om-clear">清空穿搭</button>',
        '</div>',

        '<div class="om-divider"></div>',
        '<div class="om-sec-title">悬浮球</div>',
        '<div class="om-setting-row om-row-inline"><label>显示悬浮球</label><input type="checkbox" class="om-chk" id="om-show-ball"' + (d.showBall !== false ? ' checked' : '') + ' /></div>',
        '<div class="om-divider"></div>',
        '<div class="om-sec-title">调试</div>',
        '<div class="om-setting-row om-row-inline"><label>注入时显示 Toast 提示</label><input type="checkbox" class="om-chk" id="om-debug"' + (d.debug ? ' checked' : '') + ' /></div>',
    ].join(''));

    sheet.querySelector('#om-mode').addEventListener('change', function () { var dd = load(); dd.mode = this.value; save(dd); });

    // ── 提示词预设事件 ─────────────────────────────────────
    sheet.querySelector('#om-preset-tpl-sel').addEventListener('change', function () {
        setActiveTemplate(this.value);
        toast('已切换模板：' + this.options[this.selectedIndex].textContent);
    });
    sheet.querySelector('#om-preset-import-st').addEventListener('click', function () {
        var dd = load();
        applySTPresetToApiConfig(dd);
        save(dd);
        toast('已尝试导入酒馆预设参数，请检查 API 配置');
    });
    sheet.querySelector('#om-preset-save-st').addEventListener('click', function () {
        var dd = load();
        var ok = saveToSTPreset(dd.apiVision || {});
        if (!ok) toast('保存失败，请检查酒馆版本是否支持', true);
    });
    // 导入外部预设文件
    var extFileInput = sheet.querySelector('#om-preset-ext-file');
    sheet.querySelector('#om-preset-import-ext').addEventListener('click', function () {
        extFileInput.click();
    });
    extFileInput.addEventListener('change', function () {
        if (this.files && this.files[0]) {
            importExternalPreset(this.files[0], function (tpl) {
                if (tpl) {
                    closeSheet(sheet);
                    openSettingsSheet();
                }
            });
            this.value = ''; // reset
        }
    });
    // 新建自定义模板
    sheet.querySelector('#om-preset-new-tpl').addEventListener('click', function () {
        sheet.querySelector('#om-preset-custom-form').style.display = 'block';
        sheet.querySelector('#om-preset-edit-area').style.display = 'none';
    });
    sheet.querySelector('#om-ctpl-temp').addEventListener('input', function () {
        sheet.querySelector('#om-ctpl-temp-val').textContent = this.value;
    });
    sheet.querySelector('#om-ctpl-save').addEventListener('click', function () {
        var name = sheet.querySelector('#om-ctpl-name').value.trim();
        if (!name) { toast('请输入模板名称', true); return; }
        var sys = sheet.querySelector('#om-ctpl-sys').value.trim();
        var user = sheet.querySelector('#om-ctpl-user').value.trim();
        var temp = parseFloat(sheet.querySelector('#om-ctpl-temp').value) || 0.8;
        var tokens = parseInt(sheet.querySelector('#om-ctpl-tokens').value) || 600;
        var tpl = saveCustomTemplate(name, sys, user, temp, tokens);
        setActiveTemplate(tpl.id);
        closeSheet(sheet);
        openSettingsSheet();
        toast('模板「' + name + '」已保存并选中');
    });
    sheet.querySelector('#om-ctpl-cancel').addEventListener('click', function () {
        sheet.querySelector('#om-preset-custom-form').style.display = 'none';
    });
    // 编辑已有模板（双击下拉框）
    sheet.querySelector('#om-preset-tpl-sel').addEventListener('dblclick', function () {
        var selId = this.value;
        var all = getAllTemplates();
        var tpl = null;
        for (var i = 0; i < all.length; i++) { if (all[i].id === selId) { tpl = all[i]; break; } }
        if (!tpl) return;
        sheet.querySelector('#om-ptpl-edit-title').textContent = '编辑：' + tpl.name;
        sheet.querySelector('#om-ptpl-sys').value = tpl.systemPrompt || '';
        sheet.querySelector('#om-ptpl-user').value = tpl.userPromptPrefix || '';
        sheet.querySelector('#om-ptpl-temp').value = tpl.temperature || 0.8;
        sheet.querySelector('#om-ptpl-temp-val').textContent = tpl.temperature || 0.8;
        sheet.querySelector('#om-ptpl-tokens').value = tpl.maxTokens || 600;
        sheet.querySelector('#om-preset-edit-area').style.display = 'block';
        sheet.querySelector('#om-preset-custom-form').style.display = 'none';
        sheet.querySelector('#om-preset-edit-area').dataset.tplId = selId;
        sheet.querySelector('#om-preset-edit-area').dataset.isCustom = selId.indexOf('custom_') === 0 ? '1' : '';
    });
    sheet.querySelector('#om-ptpl-temp').addEventListener('input', function () {
        sheet.querySelector('#om-ptpl-temp-val').textContent = this.value;
    });
    sheet.querySelector('#om-ptpl-save').addEventListener('click', function () {
        var area = sheet.querySelector('#om-preset-edit-area');
        var tplId = area.dataset.tplId;
        var isCustom = area.dataset.isCustom === '1';
        if (isCustom) {
            var dd = load();
            if (dd.customTemplates) {
                for (var i = 0; i < dd.customTemplates.length; i++) {
                    if (dd.customTemplates[i].id === tplId) {
                        dd.customTemplates[i].systemPrompt = sheet.querySelector('#om-ptpl-sys').value.trim();
                        dd.customTemplates[i].userPromptPrefix = sheet.querySelector('#om-ptpl-user').value.trim();
                        dd.customTemplates[i].temperature = parseFloat(sheet.querySelector('#om-ptpl-temp').value) || 0.8;
                        dd.customTemplates[i].maxTokens = parseInt(sheet.querySelector('#om-ptpl-tokens').value) || 600;
                        break;
                    }
                }
                save(dd);
            }
        }
        closeSheet(sheet);
        openSettingsSheet();
        toast('模板已更新');
    });
    sheet.querySelector('#om-ptpl-cancel').addEventListener('click', function () {
        sheet.querySelector('#om-preset-edit-area').style.display = 'none';
    });
    // ── 预设事件结束 ─────────────────────────────────────
    sheet.querySelector('#om-inject-pos').addEventListener('change', function () { var dd = load(); dd.injectPosition = this.value; save(dd); });
    sheet.querySelector('#om-auto-roll').addEventListener('change', function () { var dd = load(); dd.autoRollDisabled = !this.checked; save(dd); });
    sheet.querySelector('#om-tpl-single').addEventListener('input', function () { var dd = load(); dd.singleTemplate = this.value; save(dd); });
    sheet.querySelector('#om-tpl-multi').addEventListener('input', function () { var dd = load(); dd.multiTemplate = this.value; save(dd); });
    sheet.querySelector('#om-tpl-char-single').addEventListener('input', function () { var dd = load(); dd.charSingleTemplate = this.value; save(dd); });
    sheet.querySelector('#om-tpl-char-multi').addEventListener('input', function () { var dd = load(); dd.charMultiTemplate = this.value; save(dd); });
    sheet.querySelector('#om-imgprompt').addEventListener('input', function () { var dd = load(); dd.imagePrompt = this.value; save(dd); });
    sheet.querySelector('#om-multi-imgprompt').addEventListener('input', function () { var dd = load(); dd.multiImagePrompt = this.value; save(dd); });

    // API Vision 配置
    sheet.querySelector('#om-api-v-endpoint').addEventListener('input', function () { var dd = load(); dd.apiVision.endpoint = this.value.trim(); save(dd); });
    sheet.querySelector('#om-api-v-key').addEventListener('input', function () { var dd = load(); dd.apiVision.key = this.value.trim(); save(dd); });
    sheet.querySelector('#om-api-v-model').addEventListener('input', function () { var dd = load(); dd.apiVision.model = this.value.trim(); save(dd); });
    sheet.querySelector('#om-api-v-batch').addEventListener('change', function () { var dd = load(); dd.apiVision.concurrency = Math.max(1, Math.min(5, parseInt(this.value) || 3)); save(dd); });
    sheet.querySelector('#om-api-v-prompt').addEventListener('input', function () { var dd = load(); dd.apiVision.prompt = this.value; save(dd); });
    sheet.querySelector('#om-api-v-overwrite').addEventListener('change', function () { var dd = load(); dd.apiVision.overwrite = this.checked; save(dd); });
    sheet.querySelector('#om-use-main-api').addEventListener('change', function () { var dd = load(); dd.useMainApi = this.checked; if (this.checked) { autoDetectApiConfig(dd); } save(dd); var fields = sheet.querySelector('#om-custom-api-fields'); if (fields) fields.style.display = this.checked ? 'none' : 'block'; });
    sheet.querySelector('#om-api-v-test').addEventListener('click', function () {
        var dd = load();
        if (!dd.apiVision.endpoint || !dd.apiVision.key || !dd.apiVision.model) { toast('请先填写 API 地址、Key 和模型名称', true); return; }
        toast('正在测试...');
        fetch(normalizeEndpoint(dd.apiVision.endpoint, 'chat'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + dd.apiVision.key },
            body: JSON.stringify({ model: dd.apiVision.model, messages: [{ role: 'user', content: '回复OK' }], max_tokens: 10 })
        }).then(function (r) {
            if (!r.ok) return r.text().then(function (t) { throw new Error('HTTP ' + r.status); });
            return r.json();
        }).then(function () { toast('✅ 描述 API 连接成功！'); })
        .catch(function (e) { toast('❌ 连接失败：' + e.message, true); });
    });
    // Vision 模型拉取按钮
    var vModelFetch = sheet.querySelector('#om-api-v-model-fetch');
    if (vModelFetch) vModelFetch.addEventListener('click', function () {
        var dd = load();
        if (!dd.apiVision.endpoint || !dd.apiVision.key) { toast('请先填写 API 地址和 Key', true); return; }
        openModelPicker(dd.apiVision, function (model) {
            dd = load(); dd.apiVision.model = model; save(dd);
            var inp = sheet.querySelector('#om-api-v-model'); if (inp) inp.value = model;
        }, getDarkMode());
    });

    sheet.querySelector('#om-show-ball').addEventListener('change', function () {
        var dd = load(); dd.showBall = this.checked; save(dd);
        var oldFab = document.getElementById(FAB_ID); if (oldFab) oldFab.parentNode.removeChild(oldFab);
        if (dd.showBall) injectFab();
    });
    sheet.querySelector('#om-debug').addEventListener('change', function () { var dd = load(); dd.debug = this.checked; save(dd); });
    sheet.querySelector('#om-exp').addEventListener('click', function () { _exportData(); });
    sheet.querySelector('#om-imp').addEventListener('click', function () { _importData(); });
    sheet.querySelector('#om-clear').addEventListener('click', function () {
        var dd = load();
        var label = dd.currentView === 'char' && dd.currentChar ? '「' + dd.currentChar + '」的穿搭' : 'User 的穿搭';
        if (!confirm('确定清空' + label + '？（其他数据不受影响）')) return;
        if (dd.currentView === 'char' && dd.currentChar) {
            var cd = getCharData(dd, dd.currentChar);
            cd.outfits = []; cd.categories = []; cd.activeIds = [];
        } else {
            dd.outfits = []; dd.categories = []; dd.activeIds = [];
        }
        save(dd); closeSheet(sheet); renderCatbar(); renderGrid(); renderBottomStatus(); updateBtn(); toast('已清空');
    });
    sheet.querySelector('#om-open-cats').addEventListener('click', function () {
        closeSheet(sheet); openCatsSheet();
    });
}

// ── 分类管理 Bottom Sheet ─────────────────────────────────

function openCatsSheet() {
    var d = load();
    var cats = getViewCategories(d);
    var viewOutfits = getViewOutfits(d);
    var viewLabel = d.currentView === 'char' && d.currentChar ? d.currentChar + '的' : 'User的';
    var listHTML = cats.length === 0
        ? '<div class="om-empty"><i class="fa-solid fa-tags"></i><span>还没有分类</span></div>'
        : cats.map(function (cat, idx) {
            var n = viewOutfits.filter(function (o) { return o.category === cat; }).length;
            return '<div class="om-cat-item"><span class="om-cat-name">' + esc(cat) + '</span><span class="om-cat-count">' + n + '套</span>' +
                '<button class="om-btn-sm om-cat-ren" data-idx="' + idx + '" title="重命名"><i class="fa-solid fa-pen"></i></button>' +
                '<button class="om-btn-sm om-cat-del" data-idx="' + idx + '" title="删除"><i class="fa-solid fa-trash"></i></button></div>';
        }).join('');

    var sheet = createSheet([
        '<div class="om-sheet-title"><i class="fa-solid fa-tags"></i>' + esc(viewLabel) + '分类管理</div>',
        listHTML,
        '<div class="om-divider"></div>',
        '<div class="om-cat-add-row"><input type="text" id="om-newcat" placeholder="新分类名称…" /><button class="om-btn om-btn-safe" id="om-newadd">添加</button></div>',
    ].join(''));

    var inp = sheet.querySelector('#om-newcat');
    sheet.querySelector('#om-newadd').addEventListener('click', function () {
        var name = inp.value.trim(); if (!name) return;
        var dd = load(); var vc = getViewCategories(dd);
        if (vc.indexOf(name) === -1) { vc.push(name); save(dd); inp.value = ''; closeSheet(sheet); renderCatbar(); openCatsSheet(); toast('分类「' + name + '」已添加'); }
        else toast('分类已存在', true);
    });
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') sheet.querySelector('#om-newadd').click(); });

    sheet.querySelectorAll('.om-cat-ren').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var dd = load(); var vc = getViewCategories(dd); var vo = getViewOutfits(dd);
            var idx = parseInt(btn.dataset.idx); var old = vc[idx];
            var nw = prompt('重命名（原：' + old + '）：', old); if (!nw || !nw.trim() || nw.trim() === old) return;
            nw = nw.trim(); vc[idx] = nw;
            vo.forEach(function (o) { if (o.category === old) o.category = nw; });
            save(dd); closeSheet(sheet); renderCatbar(); openCatsSheet(); toast('已重命名');
        });
    });
    sheet.querySelectorAll('.om-cat-del').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var dd = load(); var vc = getViewCategories(dd); var vo = getViewOutfits(dd);
            var idx = parseInt(btn.dataset.idx); var name = vc[idx];
            if (!confirm('删除分类「' + name + '」？（穿搭不会被删除）')) return;
            vc.splice(idx, 1);
            vo.forEach(function (o) { if (o.category === name) o.category = ''; });
            if (getCurCat() === name) setCurCat('__all__');
            save(dd); closeSheet(sheet); renderCatbar(); openCatsSheet(); toast('已删除');
        });
    });
}

// ── Exports ───────────────────────────────────────────────
export {
    getAllTagSuggestions,
    batchParseItems,
    openBatchParseModal,
    batchAutoTagItems,
    openBatchAutoTagModal,
    generateSingleParse,
    openBatchAddSheet,
    openRandomRoll,
    openEditSheet,
    openPresetsSheet,
    openSettingsSheet,
    openCatsSheet
};

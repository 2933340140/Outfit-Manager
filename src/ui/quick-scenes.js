import { SCENE_DEFS, LINGERIE_REGEX } from '../constants.js';
import { getWorldBookStyles, getSelectedWorldBookNames, refreshWorldBookStyles, worldBookStyleMatchesScene, createWorldBookOutfit, materializeWorldBookStyle } from '../worldbook/worldbook.js';
import { tryGenerateAIDescription } from '../ai/generator.js';
import { genId } from '../utils/helpers.js';
import { toast } from '../utils/toast.js';
import { load, save, getSTContextSafe } from '../core/db.js';
import { getDarkMode } from './theme.js';

var worldBookStyleCache = {};

export function renderQuickScenes(d) {
    var el = document.getElementById('om-quick-scenes');
    if (!el) return;
    el.innerHTML = '<span class="om-quick-title">场景</span><div class="om-quick-panel"><span style="font-size:.76em;opacity:.62;white-space:nowrap">加载中</span></div>';
    var ctx = typeof SillyTavern !== 'undefined' && SillyTavern.getContext ? SillyTavern.getContext() : null;
    var selectedWBNames = [];
    try {
        selectedWBNames = getSelectedWorldBookNames(ctx, d);
    } catch (err) {
        var errPanel = el.querySelector('.om-quick-panel');
        if (errPanel) errPanel.innerHTML = '<span style="font-size:.76em;opacity:.7;white-space:nowrap">世界书读取失败</span>';
        console.warn('[OutfitManager] quick scenes failed to read world books', err);
        return;
    }
    if ((!d.selectedWorldBookNames || d.selectedWorldBookNames.length === 0) && selectedWBNames.length > 0) {
        d.selectedWorldBookNames = selectedWBNames.slice();
        save(d);
    }
    var missingWB = selectedWBNames.some(function (name) { return !worldBookStyleCache[name]; });
    if (missingWB && renderQuickScenes._loadingKey !== selectedWBNames.join('|')) {
        renderQuickScenes._loadingKey = selectedWBNames.join('|');
        refreshWorldBookStyles(selectedWBNames, function () { renderQuickScenes(load()); });
    }
    function isLingerieStyle(ws) {
        return LINGERIE_REGEX.test(String((ws && ws.source) || '')) || /内衣|文胸|内裤|抹胸|蕾丝性感|法式三角杯|聚拢|丝绸奢华|基础纯棉|少女可爱/.test(String((ws && ws.name) || ''));
    }
    function modernMatches(scene) {
        return getWorldBookStyles(selectedWBNames).filter(function(ws) { return !isLingerieStyle(ws) && worldBookStyleMatchesScene(ws, scene); });
    }
    function lingerieMatches(scene) {
        if (scene === '家居' || scene === '睡前') return [];
        return getWorldBookStyles(selectedWBNames).filter(function(ws) { return isLingerieStyle(ws); });
    }
    var sceneDefs = [
        { key: '外出', label: '外出' },
        { key: '约会', label: '约会' },
        { key: '办公', label: '通勤' },
        { key: '家居', label: '家居' },
        { key: '运动', label: '运动' },
        { key: '睡前', label: '睡前' }
    ];


    var panelHtml = sceneDefs.length === 0
        ? '<span style="font-size:.76em;opacity:.62;white-space:nowrap">暂无场景</span>'
        : sceneDefs.map(function(def) {
        return '<button class="om-quick-scene-btn" data-scene="' + esc(def.key) + '">' + esc(def.label) + '</button>';
    }).join('');
    el.innerHTML = '<span class="om-quick-title">场景</span><div class="om-quick-panel">' + panelHtml + '</div>';
    el.querySelectorAll('.om-quick-scene-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var scene = this.dataset.scene;
            var darkMode = getDarkMode();
            // Create modal with loading state first
            var modal2 = document.createElement("div"); modal2.className = "om-modal";
            var bgg = darkMode ? "#1e1e24" : "#ececef"; var fgg = darkMode ? "#eee" : "#111";
            modal2.innerHTML = '<div class="om-modal-box" style="max-width:500px;background:' + bgg + ';color:' + fgg + '"><div class="om-modal-title" style="font-size:1.1em"><i class="fa-solid fa-shirt"></i> ' + esc(scene) + '</div><div id="om-roll-progress" style="padding:30px 0;text-align:center;opacity:.7"><i class="fa-solid fa-spinner fa-spin" style="margin-right:8px"></i>AI 生成中...</div><div class="om-btn-row" style="margin-top:12px;gap:10px" id="om-roll-actions"><button class="om-btn om-btn-outline" id="om-roll-close">关闭</button></div></div>';
            var mp2 = getPopupLayer(); modal2.style.cssText = "position:absolute !important;inset:0 !important;z-index:2 !important;background:rgba(0,0,0,.45) !important;display:flex !important;align-items:center !important;justify-content:center !important;padding:20px !important;box-sizing:border-box !important;pointer-events:auto !important;";
            mp2.appendChild(modal2);
            modal2.querySelector("#om-roll-close").addEventListener("click", function() { mp2.removeChild(modal2); });
            modal2.addEventListener("click", function(e) { if (e.target === modal2) mp2.removeChild(modal2); });
            // Helper to populate modal with outfits
            function showOutfits(sc, outfits) {
                var bodyHtml = outfits.length === 0
                    ? '<div style="padding:20px;text-align:center;opacity:.6">没有可用的穿搭</div>'
                    : outfits.map(function (o, idx) {
                        var label = isLingerieStyle(o) ? "内衣" : "外穿";
                        return '<div style="margin-bottom:12px"><div style="font-weight:700;margin-bottom:6px">' + label + "：" + esc(o.name) + '</div><textarea class="om-roll-desc" data-idx="' + idx + '" style="width:100%;min-height:100px;background:rgba(127,127,127,.08);border:1px solid rgba(127,127,127,.3);border-radius:10px;padding:12px;font-size:.9em;line-height:1.75;color:' + fgg + ';resize:vertical;font-family:inherit">' + (o.description || "") + '</textarea></div>';
                    }).join("");
                var titleEl = modal2.querySelector(".om-modal-title");
                if (titleEl) titleEl.innerHTML = '<i class="fa-solid fa-shirt"></i> ' + esc(sc) + "搭配结果";
                var progEl = document.getElementById("om-roll-progress");
                if (progEl) progEl.outerHTML = '<div style="max-height:360px;overflow-y:auto;margin-top:12px">' + bodyHtml + '</div>';
                // Add action buttons
                var acts = document.getElementById("om-roll-actions");
                if (acts) {
                    acts.innerHTML = '<button class="om-btn om-btn-safe" id="om-roll-confirm"><i class="fa-solid fa-check"></i> 确认</button><button class="om-btn" id="om-roll-wardrobe" style="background:var(--SmartThemeQuoteColor,#7c6daf);color:#fff"><i class="fa-solid fa-box"></i> 保存到衣橱</button><button class="om-btn om-btn-outline" id="om-roll-close2">关闭</button>';
                    modal2.querySelector("#om-roll-confirm").addEventListener("click", function() {
                        var textareas = modal2.querySelectorAll(".om-roll-desc");
                        textareas.forEach(function(ta) {
                            var i = parseInt(ta.dataset.idx);
                            if (i >= 0 && i < outfits.length) outfits[i].description = ta.value;
                        });
                        var dd = load(); dd.activeIds = [];
                        if (dd.chars) for (var cn in dd.chars) dd.chars[cn].activeIds = [];
                        outfits.forEach(function (p) { var rid = genId(); p.id = rid; dd.virtualOutfits[rid] = p; dd.activeIds.push(rid); });
                        save(dd); renderGrid(); renderBottomStatus(); updateBtn(); toast("已换上 " + outfits.length + " 套（" + sc + "）");
                        mp2.removeChild(modal2);
                    });
                    modal2.querySelector("#om-roll-wardrobe").addEventListener("click", function() {
                        var dd3 = load();
                        outfits.forEach(function(p) {
                            var saved = { id: genId(), name: p.name, category: "世界书", type: "outfit", style: p.style || "", season: p.season || "", sceneTag: p.sceneTag || "", description: modal2.querySelector('.om-roll-desc[data-idx="' + outfits.indexOf(p) + '"]') ? modal2.querySelector('.om-roll-desc[data-idx="' + outfits.indexOf(p) + '"]').value : (p.description || ""), images: [], createdAt: Date.now() };
                            dd3.outfits.push(saved);
                        });
                        save(dd3); renderGrid(); updateBtn(); mp2.removeChild(modal2); toast("已保存到衣橱");
                    });
                    modal2.querySelector("#om-roll-close2").addEventListener("click", function() { mp2.removeChild(modal2); });
                }
            }
            // Try AI generation, fallback to world book
            tryGenerateAIDescription(scene, function(aiOutfits) {
                var outfits = [];
                if (aiOutfits && aiOutfits.length > 0) {
                    outfits = aiOutfits;
                } else {
                    var modernPool = modernMatches(scene);
                    var lingeriePool = lingerieMatches(scene);
                    if (modernPool.length > 0) outfits.push(createWorldBookOutfit(modernPool[Math.floor(Math.random() * modernPool.length)], "wb_qs_" + scene + "_modern", 0));
                    if (lingeriePool.length > 0) outfits.push(createWorldBookOutfit(lingeriePool[Math.floor(Math.random() * lingeriePool.length)], "wb_qs_" + scene + "_inner", 1));
                }
                showOutfits(scene, outfits);
            });
        });
    });
}

function esc(s) {
    var d = document.createElement('div');
    d.appendChild(document.createTextNode(s));
    return d.innerHTML;
}

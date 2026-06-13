/**
 * generator.js
 * AI outfit generation helpers and tryGenerateAIDescription.
 */

import { getSTContextSafe, load } from '../core/db.js';
import { LINGERIE_REGEX } from '../constants.js';
import { getWorldBookStyles, getSelectedWorldBookNames, refreshWorldBookStyles, getWorldBookStyleCache, worldBookStyleMatchesScene } from '../worldbook/worldbook.js';
import { genId } from '../utils/helpers.js';

// ── Module-private helpers ─────────────────────────────────────

function _isLingerieStyle(ws) {
    return /内衣/.test(String((ws && ws.source) || '')) || /内衣|文胸|内裤|抹胸|蕾丝性感|法式三角杯|聚拢|丝绸奢华|基础纯棉|少女可爱/.test(String((ws && ws.name) || ''));
}

function _cleanStoryText(text) {
    return String(text || '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/\.[\w-]+\s*\{[\s\S]*?\}/g, '')
        .replace(/#[\w-]+\s*\{[\s\S]*?\}/g, '')
        .replace(/<[^>]+>/g, '')
        .replace(/\{\{[\s\S]*?\}\}/g, '')
        .replace(/^\s*(?:text-align|font-size|font-weight|margin|letter-spacing|white-space|opacity|display|color|background|padding|border|width|height|line-height|position)\s*:[^;\n]+;?\s*$/gmi, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

function _getChatContext(ctx) {
    var chat = ctx && ctx.chat ? ctx.chat : [];
    var recent = chat.slice(-15);
    var lines = [];
    for (var i = 0; i < recent.length; i++) {
        var msg = recent[i];
        var role = msg && msg.is_user ? "用户" : (msg && msg.name ? msg.name : "角色");
        var text = msg && msg.mes ? _cleanStoryText(msg.mes) : '';
        if (text.length > 800) text = text.slice(0, 800) + '...';
        if (text) lines.push(role + "：" + text);
    }
    return lines.join("\n");
}

function _getPendingUserInput() {
    try {
        var input = document.querySelector('#send_textarea');
        return input ? _cleanStoryText(input.value) : '';
    } catch (e) {
        return '';
    }
}

export function _cleanOutfitResult(text) {
    return String(text || '')
        .replace(/<horae[\s\S]*?(?:<\/horae>|$)/gi, '')
        .replace(/<content[\s\S]*?(?:<\/content>|$)/gi, '')
        .replace(/<details[\s\S]*?(?:<\/details>|$)/gi, '')
        .replace(/<status[\s\S]*?(?:<\/status>|$)/gi, '')
        .replace(/\n?<\s*(?:horae?|content|details|status)[\s\S]*$/i, '')
        .replace(/<[^>\n]+>\s*$/g, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

function _getCharacterInfo(ctx) {
    try {
        var chId = ctx && ctx.this_chid;
        var chars = ctx && ctx.characters;
        if (chars && chId !== undefined && chId !== null && chars[chId]) {
            var c = chars[chId];
            return "角色名：" + (c.name || '') + "\n角色描述：" + (c.description || '').slice(0, 200);
        }
    } catch(e) {}
    return "";
}

// ── Main generation function ──────────────────────────────────

export function tryGenerateAIDescription(scene, callback) {
    console.log("[OM-AI] tryGenerateAIDescription start, scene:", scene);
    var ctx = getSTContextSafe();
    var genFn = null;
    if (ctx && typeof ctx.generateRaw === "function") genFn = ctx.generateRaw;
    if (!genFn) { console.log("[OM-AI] generateRaw not found, fallback"); callback(null); return; }
    console.log("[OM-AI] generateRaw OK, loading world books...");

    var d = load();
    var selectedWBNames = [];
    try { selectedWBNames = getSelectedWorldBookNames(ctx, d); } catch (e) {}
    console.log("[OM-AI] selectedWBNames:", selectedWBNames.length);
    var modernRefs = [];
    var lingerieRefs = [];
    if (selectedWBNames.length > 0) {
        var allStyles = getWorldBookStyles(selectedWBNames);
        modernRefs = allStyles.filter(function(ws) { return !_isLingerieStyle(ws) && worldBookStyleMatchesScene(ws, scene); });
        lingerieRefs = allStyles.filter(function(ws) { return _isLingerieStyle(ws) && worldBookStyleMatchesScene(ws, scene); });
    }
    console.log("[OM-AI] styles filtered: modern=" + modernRefs.length + ", lingerie=" + lingerieRefs.length);

    var styleGuide = "";
    if (modernRefs.length > 0) {
        styleGuide += "【外穿参考风格指导】\n"
        modernRefs.forEach(function(entry) {
            var raw = entry.raw || entry.desc || "";
            styleGuide += raw + "\n";
        });
    }
    if (lingerieRefs.length > 0) {
        styleGuide += "\n【内衣参考风格指导】\n"
        lingerieRefs.forEach(function(entry) {
            var raw = entry.raw || entry.desc || "";
            styleGuide += raw + "\n";
        });
    }
    if (!styleGuide) { console.log("[OM-AI] styleGuide empty, fallback"); callback(null); return; }
    console.log("[OM-AI] styleGuide built, len=" + styleGuide.length);

    // System prompt: rules + format + example
    var sysPrompt = "你是穿搭助手，必须遵循以下规则：\n- 要根据正文以及前文故事情节判断此时user是否需要更换服饰。\n- 根据user的性格人设，随机生成user的穿搭服饰，需遵循各个风格的穿搭指导，并符合当前人物所处的情境，季节（冬秋季时需要在原来的基础上增衣保暖，春夏季需保持清凉），职业（避免出现在工作时穿着不当的情况）和喜好，避免ooc。发挥想象即可，穿搭风格均不限。\n- 严禁照抄例子，例子仅供穿搭参考。\n- 只输出穿搭结果，禁止输出或续写任何 <horae>、<content>、<details>、<status> 等状态标签或剧情标签。\n输出格式：第一行只输出风格名（从上述参考风格中选一个最符合的），然后换行输出具体穿搭描述，不能抄已有的例子，不要额外说明。\n输出例子：<甜酷风>\n上衣：黑色露肩印花短款T恤（露锁骨设计）\n下装：灰紫色层层蛋糕蓬蓬短裙（不规则蕾丝纱质裙摆）\n配饰：黑色猫耳发筯、骷髅元素链条choker、金属多层手链、黑色链条腋下包\n鞋袜：黑灰条纹过膝堆堆长袜、厚底黑色圆头松糕鞋";

    // User prompt: style guide section + context section
    var charInfo = _getCharacterInfo(ctx);
    var pendingInput = _getPendingUserInput();
    var chatCtx = _getChatContext(ctx);
    var userPrompt = "=========穿搭风格指导=========\n" + styleGuide + "\n";
    userPrompt += "=========当前正文和故事情节=========\n";
    if (pendingInput) userPrompt += "当前用户输入：\n" + pendingInput + "\n";
    if (charInfo) userPrompt += charInfo + "\n";
    if (chatCtx) userPrompt += chatCtx + "\n";
    userPrompt += "\n场景：" + scene + "\n请根据上述规则生成user的穿搭。";

    console.log("[OM-AI] ===== SYSTEM PROMPT =====");
    console.log(sysPrompt);
    console.log("[OM-AI] ===== USER PROMPT =====");
    console.log(userPrompt);
    console.log("[OM-AI] calling generateRaw, prompt len=" + (sysPrompt.length + userPrompt.length));

    var done = false;
    var tid = setTimeout(function() {
        if (!done) { done = true; console.log("[OM-AI] TIMEOUT 30s, fallback"); callback(null); }
    }, 30000);

    genFn({ prompt: userPrompt, systemPrompt: sysPrompt, quietToLoud: false, responseLength: 1200 }).then(function(result) {
        if (done) return; done = true; clearTimeout(tid);
        console.log("[OM-AI] generateRaw resolved, result len=" + (result ? result.length : 0));
        if (!result || typeof result !== "string" || result.trim().length < 5) { console.log("[OM-AI] result too short, fallback"); callback(null); return; }
        var desc = _cleanOutfitResult(result);
        if (!desc || desc.length < 5) { console.log("[OM-AI] cleaned result too short, fallback"); callback(null); return; }
        var outfit = { id: genId(), name: scene + "搭配", category: "世界书", type: "outfit", description: desc, style: "", season: "", sceneTag: scene, images: [], createdAt: Date.now() };
        console.log("[OM-AI] success, outfit desc len=" + desc.length);
        callback([outfit]);
    }).catch(function(err) {
        if (done) return; done = true; clearTimeout(tid);
        console.log("[OM-AI] generateRaw rejected:", err);
        callback(null);
    });
}

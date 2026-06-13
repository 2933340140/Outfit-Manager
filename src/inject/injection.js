// ── API Injection Core ──────────────────────────────────────
// position: 'system' | 'context' | 'user'
//   system  = append to the end of the first system message (legacy behavior)
//   context = insert a system message before the last user message (like author's note)
//   user    = append to the end of the last user message text

import { load, getSTContextSafe } from '../core/db.js';
import { currentOwner, getViewOutfits, getViewActiveIds, getById } from '../core/data.js';
import { toast } from '../utils/toast.js';
import { WB_CLOTHING_PATTERN } from '../constants.js';
import { getFirstImage, getAllImages, hasImages } from '../utils/helpers.js';

export function injectText(p, text, position) {
    if (!p.messages || !Array.isArray(p.messages)) {
        // 兼容 prompt 模式
        if (typeof p.prompt === 'string') p.prompt = text + '\n\n' + p.prompt;
        return;
    }

    if (position === 'user') {
        // 追加到最后一条 user 消息末尾
        for (var j = p.messages.length - 1; j >= 0; j--) {
            if (p.messages[j].role === 'user') {
                var c = p.messages[j].content;
                if (typeof c === 'string') p.messages[j].content = c + '\n\n' + text;
                else if (Array.isArray(c)) c.push({ type: 'text', text: '\n\n' + text });
                break;
            }
        }
    } else if (position === 'context') {
        // 在最后一条 user 消息之前插入 system 消息
        var lastUserIdx = -1;
        for (var k = p.messages.length - 1; k >= 0; k--) {
            if (p.messages[k].role === 'user') { lastUserIdx = k; break; }
        }
        var sysMsg = { role: 'system', content: text };
        if (lastUserIdx > 0) p.messages.splice(lastUserIdx, 0, sysMsg);
        else if (lastUserIdx === 0) p.messages.unshift(sysMsg);
        else p.messages.push(sysMsg);
    } else {
        // system: 追加到第一条 system message 末尾
        var si = -1; for (var i = 0; i < p.messages.length; i++) { if (p.messages[i].role === 'system') { si = i; break; } }
        if (si !== -1) {
            var sm = p.messages[si];
            if (typeof sm.content === 'string') sm.content += '\n\n' + text;
            else if (Array.isArray(sm.content)) sm.content.push({ type: 'text', text: '\n\n' + text });
        } else { p.messages.unshift({ role: 'system', content: text }); }
    }
}

export function injectImages(p, imgs) {
    if (!p.messages || !Array.isArray(p.messages)) return;
    for (var j = p.messages.length - 1; j >= 0; j--) {
        if (p.messages[j].role === 'user') {
            var c = p.messages[j].content;
            var blocks = imgs.map(function (img) { return { type: 'image_url', image_url: { url: img } }; });
            if (typeof c === 'string') p.messages[j].content = [{ type: 'text', text: c }].concat(blocks);
            else if (Array.isArray(c)) blocks.forEach(function (b) { c.push(b); });
            break;
        }
    }
}

// ★ v19新增：按owner交错注入 文字标签+图片，让AI知道每张图属于谁
// ★ v21改进：在末尾注入图片提示词模板（风格引导）
export function injectImageBlocks(p, ownerImageGroups, imgPrompt, multiImgPrompt) {
    if (!p.messages || !Array.isArray(p.messages)) return;
    for (var j = p.messages.length - 1; j >= 0; j--) {
        if (p.messages[j].role === 'user') {
            var c = p.messages[j].content;
            // 确保content是数组格式
            if (typeof c === 'string') {
                c = [{ type: 'text', text: c }];
                p.messages[j].content = c;
            }

            // 添加总标题
            if (ownerImageGroups.length > 1) {
                c.push({ type: 'text', text: '\n\n=== 穿搭图片参考 ===' });
            }

            var hasMulti = false;
            ownerImageGroups.forEach(function (grp) {
                if (grp.isMulti) {
                    hasMulti = true;
                    // 同一owner多套衣柜
                    c.push({ type: 'text', text: '\n[' + grp.name + '的可选穿搭 - 共' + grp.outfits.length + '套]' });
                    grp.outfits.forEach(function (o, i) {
                        c.push({ type: 'text', text: '\n(' + (i + 1) + ') ' + o.name + (o.sceneTag ? ' [场景：' + o.sceneTag + ']' : '') + '：' });
                        getAllImages(o).forEach(function(img) { c.push({ type: 'image_url', image_url: { url: img } }); });
                    });
                } else {
                    // 单套
                    var o = grp.outfits[0];
                    c.push({ type: 'text', text: '\n[' + grp.name + '当前穿着]' });
                    getAllImages(o).forEach(function(img) { c.push({ type: 'image_url', image_url: { url: img } }); });
                }
            });

            // 注入图片提示词模板（风格引导）
            var prompt = hasMulti ? multiImgPrompt : imgPrompt;
            if (prompt) {
                c.push({ type: 'text', text: '\n' + prompt });
            }

            if (ownerImageGroups.length > 1) {
                c.push({ type: 'text', text: '\n=== 穿搭图片结束 ===' });
            }
            break;
        }
    }
}

export function setupInjection() {
    var origFetch = window.fetch;
    window.fetch = function (input, init) {
        try {
            if (init && init.body && typeof init.body === 'string') {
                var nb = tryInjectBody(init.body);
                if (nb) { init = Object.assign({}, init, { body: nb }); return origFetch.call(this, input, init); }
            }
        } catch (e) {}
        return origFetch.apply(this, arguments);
    };
    var origSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (body) {
        try { if (body && typeof body === 'string') { var nb = tryInjectBody(body); if (nb) return origSend.call(this, nb); } } catch (e) {}
        return origSend.apply(this, arguments);
    };
}

// ★ 剔除世界书穿搭条目（避免OM穿搭与世界书条目重复/冲突）
export function stripWorldBookEntries(p) {
    var re = /<[^>]*?(?:穿搭|睡衣|随机穿搭|内衣|Cosplay)[^>]*?>[\s\S]*?<\/[^>]*?(?:穿搭|睡衣|随机穿搭|内衣|Cosplay)[^>]*?>/g;
    // 处理 messages 格式
    if (p.messages && Array.isArray(p.messages)) {
        for (var si = 0; si < p.messages.length; si++) {
            var c = p.messages[si].content;
            if (typeof c === 'string') {
                p.messages[si].content = c.replace(re, '').replace(/\n{3,}/g, '\n\n');
            } else if (Array.isArray(c)) {
                for (var bi = 0; bi < c.length; bi++) {
                    if (c[bi].type === 'text' && typeof c[bi].text === 'string') {
                        c[bi].text = c[bi].text.replace(re, '').replace(/\n{3,}/g, '\n\n');
                    }
                }
            }
        }
    }
    // 处理 prompt 格式（旧版/长上下文可能用）
    if (typeof p.prompt === 'string') {
        p.prompt = p.prompt.replace(re, '').replace(/\n{3,}/g, '\n\n');
    }
}

export function tryInjectBody(bodyStr) {
    var p; try { p = JSON.parse(bodyStr); } catch (e) { return null; }
    if (!p || (!p.messages && p.prompt === undefined)) return null;
    var d = load();
    var pos = d.injectPosition || 'user';
    var useImg = (d.mode === 'image' || d.mode === 'both');
    var useText = (d.mode === 'text' || d.mode === 'both');

    // 收集所有owner及其激活穿搭
    var owners = [];
    // User
    var userOutfits = [];
    (d.activeIds || []).forEach(function (id) { var found = false; for (var i = 0; i < d.outfits.length; i++) { if (d.outfits[i].id === id) { userOutfits.push(d.outfits[i]); found = true; break; } } if (!found && d.virtualOutfits && d.virtualOutfits[id]) { var vo = d.virtualOutfits[id]; vo.id = id; userOutfits.push(vo); } });
    if (userOutfits.length > 0) owners.push({ name: 'User', outfits: userOutfits, tplSingle: d.singleTemplate, tplMulti: d.multiTemplate });
    // Chars
    if (d.chars) {
        for (var cn in d.chars) {
            var cd = d.chars[cn];
            var cos = [];
            (cd.activeIds || []).forEach(function (id) { for (var k = 0; k < (cd.outfits || []).length; k++) { if (cd.outfits[k].id === id) { cos.push(cd.outfits[k]); break; } } });
            if (cos.length > 0) owners.push({ name: cn, outfits: cos, tplSingle: d.charSingleTemplate, tplMulti: d.charMultiTemplate });
        }
    }

    if (owners.length === 0) return null;
    // ★ 有穿搭时剔除世界书条目，避免与OM穿搭冲突
    stripWorldBookEntries(p);


    // ★ v19核心改动：先收集所有文本和图片，合并成一条再注入
    var allTextParts = [];
    // 图片模式：按owner收集，保留归属信息
    var ownerImageGroups = []; // [{ name, outfits: [{name, images, sceneTag}], isMulti }]

    owners.forEach(function (ow) {
        var active = ow.outfits;
        var isMulti = active.length > 1;

        if (isMulti) {
            var lines = active.map(function (o, i) {
                var scene = o.sceneTag ? '【场景：' + o.sceneTag + '】' : '';
                var desc = (o.description && o.description.trim()) ? o.description.trim() : o.name;
                return '[' + (i + 1) + '] ' + o.name + ' ' + scene + '\n描述：' + desc;
            });
            if (useText) {
                var wt = (ow.tplMulti || '[服装信息]\n{{charName}}的穿搭：\n{{wardrobe}}')
                    .replace(/\{\{charName\}\}/g, ow.name)
                    .replace('{{wardrobe}}', lines.join('\n\n'));
                allTextParts.push(wt);
            }
            if (useImg) {
                var imgOutfits = active.filter(function (o) { return hasImages(o); });
                if (imgOutfits.length > 0) ownerImageGroups.push({ name: ow.name, outfits: imgOutfits, isMulti: true });
            }
        } else {
            var o = active[0];
            if (useText) {
                var desc2 = (o.description && o.description.trim()) ? o.description.trim() : o.name;
                var st = (ow.tplSingle || '[服装信息]\n{{charName}}当前穿着：\n{{description}}')
                    .replace(/\{\{charName\}\}/g, ow.name)
                    .replace('{{description}}', desc2);
                allTextParts.push(st);
            }
            if (useImg && hasImages(o)) { ownerImageGroups.push({ name: ow.name, outfits: [o], isMulti: false }); }
        }
    });

    var injected = false;

    // 合并所有文本为一条，用分隔线隔开
    if (allTextParts.length > 0) {
        var mergedText;
        if (allTextParts.length === 1) {
            mergedText = allTextParts[0];
        } else {
            // 多个owner时加总包裹
            mergedText = '=== 当前场景服装信息（必须严格遵守，不可自行编造服装）===\n\n' + allTextParts.join('\n\n---\n\n') + '\n\n=== 服装信息结束 ===';
        }
        injectText(p, mergedText, pos);
        injected = true;
    }

    // ★ 图片注入：按owner交错注入文字标签+图片，让AI知道哪张图属于谁
    if (ownerImageGroups.length > 0) {
        var imgPrompt = d.imagePrompt || '';
        var multiImgPrompt = d.multiImagePrompt || '';
        injectImageBlocks(p, ownerImageGroups, imgPrompt, multiImgPrompt);
        injected = true;
    }

    if (d.debug) {
        var summary = owners.map(function (ow) { return ow.name + ':' + ow.outfits.length + '套'; }).join(' + ');
        toast(summary + ' [' + d.mode + '|' + pos + ']');
    }

    var finalStr = JSON.stringify(p); return finalStr;
}

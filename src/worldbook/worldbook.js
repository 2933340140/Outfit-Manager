import { getSTContextSafe } from '../core/db.js';
import { genId } from '../utils/helpers.js';

// ── World book state ──────────────────────────────────────────────
var worldBookStyleCache = {};
var worldBookStylesLoaded = false;
var worldBookClothingPattern = /(?:名称|风格|季节|场景|描述|核心风格|生成规则)\s*[：:]/;
var worldBookClothingPartPattern = /^\s*(?:[-*]\s*)?(上衣|内搭|下装|裙装|外搭|外套|连衣裙|旗袍|礼服|服装|配饰|鞋袜|鞋子|袜子|假发|角色|文胸|内裤|配件|文胸与内裤一体|内裤部分)\s*[：:]/m;

// ── Cache accessors ───────────────────────────────────────────────
export function getWorldBookStyleCache() { return worldBookStyleCache; }
export function setWorldBookStylesLoaded(v) { worldBookStylesLoaded = v; }

// ── World book functions ──────────────────────────────────────────
export function getWorldBookStyles(names) {
    var all = [];
    var keys = Array.isArray(names) && names.length ? names : Object.keys(worldBookStyleCache);
    keys.forEach(function (k) { if (worldBookStyleCache[k]) all = all.concat(worldBookStyleCache[k]); });
    return all;
}

export function getActiveWorldBookNames(ctx, d) {
    var names = [];
    function add(name) { if (name && names.indexOf(name) === -1) names.push(name); }
    try {
        if (ctx && ctx.chatMetadata && ctx.chatMetadata.world_info) {
            if (Array.isArray(ctx.chatMetadata.world_info)) ctx.chatMetadata.world_info.forEach(add);
            else add(ctx.chatMetadata.world_info);
        }
        if (typeof document !== 'undefined') {
            var allNames = ctx && ctx.getWorldInfoNames ? ctx.getWorldInfoNames() : [];
            document.querySelectorAll('#world_info option:checked').forEach(function (opt) {
                var idx = parseInt(opt.value, 10);
                add(allNames[idx] || opt.textContent || opt.value);
            });
        }
        if (names.length === 0 && d && Array.isArray(d.selectedWorldBookNames)) d.selectedWorldBookNames.forEach(add);
    } catch (e) {}
    return names;
}

export function getKnownWorldBookNames(ctx) {
    try { return ctx && ctx.getWorldInfoNames ? ctx.getWorldInfoNames().filter(Boolean) : []; }
    catch (e) { return []; }
}

export function getDefaultSelectedWorldBookNames(ctx, d) {
    var allNames = getKnownWorldBookNames(ctx);
    var uuNames = allNames.filter(function (name) { return /uu/i.test(name); });
    if (uuNames.length > 0) return uuNames;
    var activeNames = getActiveWorldBookNames(ctx, d);
    var activeUU = activeNames.filter(function (name) { return /uu/i.test(name); });
    return activeUU.length > 0 ? activeUU : activeNames;
}

export function getSelectedWorldBookNames(ctx, d) {
    var selected = d && Array.isArray(d.selectedWorldBookNames) ? d.selectedWorldBookNames.filter(Boolean) : [];
    var selectedUU = selected.filter(function (name) { return /uu/i.test(name); });
    if (selectedUU.length > 0) return selectedUU;
    return getDefaultSelectedWorldBookNames(ctx, d);
}

export function createWorldBookOutfit(ws, idPrefix, idx) {
    var mw = materializeWorldBookStyle(ws);
    return { id: (idPrefix || 'wb_dyn') + '_' + idx, name: mw.name, category: '世界书', type: 'outfit', style: '', season: '', sceneTag: '', description: mw.desc, images: [], isVirtual: true, source: mw.source || ws.source || '' };
}

export function getWorldBookStyleSceneKeys(ws) {
    var name = String((ws && (ws.name || ws.style)) || '').replace(/[💫🚫]/g, '').trim();
    var map = {
        '纯欲风': ['外出', '约会'],
        '甜酷风': ['外出', '约会'],
        '休闲风': ['外出'],
        '千禧y2k风': ['外出', '约会'],
        '运动风(街头潮牌版)': ['运动'],
        '运动风(街头潮牌版': ['运动'],
        '运动风(街头潮牌版': ['运动'],
        '日系复古风': ['外出', '约会'],
        '日系保暖': ['外出', '约会'],
        '办公室海妖风': ['外出', '约会'],
        '通勤休闲风': ['外出', '办公'],
        '学院风': ['外出'],
        '韩系日常风': ['外出', '办公', '约会'],
        '韩系女团风': ['外出', '约会'],
        '现代哥特风': ['外出', '约会'],
        '旗袍': ['外出', '约会'],
        '新中式': ['外出', '约会'],
        '御姐辣妹风': ['外出', '约会'],
        '财阀千金风': ['外出', '约会'],
        '小香风': ['外出', '约会'],
        '轻熟职场风': ['外出', '办公', '约会'],
        '多巴胺风': ['外出', '约会'],
        '欧美风': ['外出', '约会'],
        'bm风': ['外出', '约会'],
        '轻亚风': ['外出', '约会'],
        '睡衣': ['家居', '睡前'],
        '基础纯棉': ['外出', '运动'],
        '蕾丝性感': ['约会'],
        '法式三角杯': ['约会'],
        '聚拢调整': ['外出', '约会'],
        '少女可爱': ['外出', '约会'],
        '丝绸奢华': ['约会'],
        '抹胸式': ['外出', '约会']
    };
    return map[name] || null;
}

export function worldBookStyleMatchesScene(ws, scene) {
    if (!scene) return true;
    var mappedScenes = getWorldBookStyleSceneKeys(ws);
    var text = [ws.name, ws.style, ws.scene, ws.desc, ws.raw, ws.source].join('\n');
    var titleText = [ws.name, ws.style].join('\n');
    var sceneKey = /通勤|上班|办公|职场/.test(scene) ? '办公' : scene;
    if (mappedScenes) return mappedScenes.indexOf(sceneKey) !== -1;
    if (sceneKey === '外出') return !/内衣|睡衣|睡前|家居|基础纯棉|洛丽塔|Lolita|Cos装|高定礼服|办公室/.test(text);
    if (sceneKey === '办公') return /通勤|职场|办公|上班|韩系日常/.test(text) && !/非(?:日常)?通勤|非.*办公|非.*职场/.test(text) && !/洛丽塔|Lolita|Cos装|高定礼服|旗袍|新中式|财阀|御姐|辣妹|女团|哥特|多巴胺|欧美|bm风|轻亚|纯欲|学院/.test(titleText);
    if (sceneKey === '约会' && /非.*约会|仅适用于.*(?:办公|职场|运动|睡前|家居)/.test(text)) return false;
    if (sceneKey === '家居' && /非.*家居|仅适用于.*(?:办公|职场|晚宴|漫展|茶会)/.test(text)) return false;
    if (sceneKey === '运动' && /非.*运动|仅适用于.*(?:办公|职场|晚宴|漫展|茶会)/.test(text)) return false;
    if (sceneKey === '睡前' && /非.*睡前|仅适用于.*(?:办公|职场|晚宴|漫展|茶会)/.test(text)) return false;
    var map = {
        '约会': /约会|纯欲|财阀|千金|韩系|女团|御姐|辣妹|旗袍|新中式|小香|欧美|轻熟|多巴胺|优雅|名媛/,
        '办公': /办公|职场|通勤|上班|轻熟|韩系日常|休闲/,
        '家居': /家居|睡衣|休闲|基础纯棉|内衣/,
        '运动': /运动/,
        '睡前': /睡衣|睡前|内衣|基础纯棉/
    };
    return map[sceneKey] ? map[sceneKey].test(text) : false;
}

export function refreshWorldBookStyles(names, cb) {
    if (typeof names === 'function') { cb = names; names = null; }
    try {
        var ctx = typeof SillyTavern !== 'undefined' && SillyTavern.getContext ? SillyTavern.getContext() : null;
        names = Array.isArray(names) ? names : getActiveWorldBookNames(ctx, load());
        names = names.filter(function (name, idx) { return name && names.indexOf(name) === idx; });
        if (names.length === 0) { worldBookStylesLoaded = true; if (cb) cb(); return; }
        var loaded = 0;
        if (typeof toast !== 'undefined') toast('正在加载 ' + names.length + ' 个世界书...', false, 2000);
        names.forEach(function (name) {
            loadWorldBookByName(ctx, name).then(function (data) {
                worldBookStyleCache[name] = parseWorldBookStyles(data, name);
            }).catch(function () {
                worldBookStyleCache[name] = worldBookStyleCache[name] || [];
            }).finally(function () {
                loaded++;
                if (loaded >= names.length) {
                    worldBookStylesLoaded = true;
                    if (typeof toast !== 'undefined') toast('已加载 ' + getWorldBookStyles(names).length + ' 套世界书穿搭', false, 3000);
                    if (cb) cb();
                }
            });
        });
    } catch (e) { worldBookStylesLoaded = true; if (cb) cb(); }
}

export function loadWorldBookByName(ctx, name) {
    if (ctx && typeof ctx.loadWorldInfo === 'function') return Promise.resolve(ctx.loadWorldInfo(name));
    return fetch('/api/worldinfo/get', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name })
    }).then(function (r) { return r.json(); });
}

export function parseWorldBookStyles(data, sourceName) {
    var entries = [];
    if (data && Array.isArray(data.entries)) entries = data.entries;
    else if (data && data.entries && typeof data.entries === 'object') entries = Object.keys(data.entries).map(function (k) { return data.entries[k]; });
    return entries.map(function (entry) {
        if (!entry || entry.disable === true || entry.enabled === false) return null;
        var comment = entry.comment || '';
        var key = Array.isArray(entry.key) ? entry.key.join(' / ') : (entry.key || '');
        var full = entry.content || comment || key || '';
        if ((full + '\n' + comment + '\n' + key).length < 8) return null;
        var haystack = full + '\n' + comment + '\n' + key;
        if (isWorldBookMetaEntry(haystack)) return null;
        if (!worldBookClothingPattern.test(haystack) && haystack.indexOf('睡衣') === -1) return null;
        if (!worldBookClothingPartPattern.test(full) && haystack.indexOf('睡衣') === -1) return null;
        return parseWorldBookEntry(full, comment, key, sourceName);
    }).filter(Boolean);
}

export function isWorldBookMetaEntry(text) {
    var firstLine = (text || '').split('\n').filter(function (l) { return l.trim(); })[0] || '';
    if (/更新必看|不要开|省tk|省token/i.test(text || '')) return true;
    if (/🚫/.test(text || '')) return true;
    if (/^<随机(?:穿搭|内衣|服饰|服装)/.test(firstLine)) return true;
    if (/^随机(?:穿搭|内衣)/.test(firstLine)) return true;
    return false;
}

export function parseWorldBookEntry(full, comment, key, sourceName) {
    var result = { name: comment || key || '未命名', style: '', season: '', scene: '世界书', desc: full, raw: full, source: sourceName };
    function extract(label) {
        var labels = ['名称', '分类', '风格', '季节', '场景', '描述'];
        var stops = labels.filter(function (k) { return k !== label; }).map(function (k) { return '(?:^|\\n)\\s*(?:[-*]\\s*)?' + k + '\\s*[：:]'; }).join('|');
        var m = full.match(new RegExp('(?:^|\\n)\\s*(?:[-*]\\s*)?' + label + '\\s*[：:]\\s*([\\s\\S]*?)(?=' + stops + '|$)', 'm'));
        return m ? m[1].trim() : '';
    }
    result.name = extract('名称') || result.name;
    result.style = extract('风格') || result.style;
    result.season = extract('季节') || result.season;
    result.scene = extract('场景') || result.scene;
    result.desc = extract('描述') || result.desc;
    if (!result.name) result.name = full.split('\n').filter(function (l) { return l.trim(); })[0] || '未命名';
    if (!result.style) result.style = result.name;
    return result;
}

export function materializeWorldBookStyle(ws) {
    var copy = {};
    for (var k in ws) copy[k] = ws[k];
    copy.desc = generateWorldBookConcreteOutfit(ws.raw || ws.desc || '', ws.name || ws.style || '世界书穿搭') || ws.desc || '';
    return copy;
}

export function generateWorldBookConcreteOutfit(text, styleName) {
    var buckets = {};
    String(text || '').split('\n').forEach(function (line) {
        var m = line.match(/^\s*(?:[-*]\s*)?(上衣|内搭|下装|裙装|外搭|外套|连衣裙|旗袍|礼服|服装|配饰|鞋袜|鞋子|袜子|假发|角色|文胸|内裤|配件|文胸与内裤一体|内裤部分)\s*[：:]\s*(.+?)\s*$/);
        if (!m) return;
        var label = m[1], value = m[2].replace(/\s+/g, ' ').trim();
        if (!value || /仅供|参考|禁止|不得|生成规则/.test(value)) return;
        if (!buckets[label]) buckets[label] = [];
        if (buckets[label].indexOf(value) === -1) buckets[label].push(value);
    });
    function pick(label) {
        var arr = buckets[label] || [];
        return arr.length ? arr[Math.floor(Math.random() * arr.length)] : '';
    }
    function pickAny(labels) {
        for (var i = 0; i < labels.length; i++) {
            var v = pick(labels[i]);
            if (v) return { label: labels[i], value: v };
        }
        return null;
    }
    var lines = [];
    var dress = pickAny(['裙装', '连衣裙', '旗袍', '礼服', '服装']);
    var bra = pickAny(['文胸与内裤一体', '文胸']);
    var panty = pickAny(['内裤', '内裤部分']);
    if (bra || panty) {
        if (bra) lines.push(bra.label + '：' + bra.value);
        if (panty) lines.push(panty.label + '：' + panty.value);
        var lingerieExtra = pickAny(['配件', '配饰', '鞋袜']);
        if (lingerieExtra) lines.push(lingerieExtra.label + '：' + lingerieExtra.value);
        return lines.length > 0 ? lines.join('\n') : '';
    }
    if (dress) lines.push(dress.label + '：' + dress.value);
    else {
        var top = pickAny(['上衣', '内搭']);
        var bottom = pick('下装');
        if (top) lines.push(top.label + '：' + top.value);
        if (bottom) lines.push('下装：' + bottom);
    }
    var outer = pickAny(['外搭', '外套']);
    var accessories = pick('配饰');
    var shoes = pickAny(['鞋袜', '鞋子', '袜子']);
    var wig = pick('假发');
    var role = pick('角色');
    if (outer) lines.push(outer.label + '：' + outer.value);
    if (role) lines.push('角色：' + role);
    if (wig) lines.push('假发：' + wig);
    if (accessories) lines.push('配饰：' + accessories);
    if (shoes) lines.push(shoes.label + '：' + shoes.value);
    if (lines.length === 0 && /睡衣/i.test(styleName)) {
        var parts = [];
        String(text || '').split('\n').forEach(function (l) {
            var t = l.replace(/^\s*(?:[-*]\s*)(?:\d+\.\s*)?/, '').trim();
            if (t.length > 20 && !/不可以|例子|仅供参考|指导|刻画|禁止/i.test(t)) {
                parts.push(t);
            }
        });
        if (parts.length > 0) return parts[Math.floor(Math.random() * parts.length)];
    }
    return lines.length > 0 ? lines.join('\n') : '';
}

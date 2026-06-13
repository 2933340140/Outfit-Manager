/**
 * auto-tag.js
 * Parses AI auto-tag results into structured metadata.
 */

export function parseAutoTagResult(text) {
    var result = { name: '', type: '', style: '', season: '', scene: '', description: '' };
    if (!text || !text.trim()) return result;
    var clean = text.replace(/\*\*/g, '').replace(/^#+\s*/gm, '').replace(/^\s*[-*]\s*/gm, '').trim();
    var parts = clean.split(/---+\n*/); var metaPart = parts[0] || '';
    if (parts.length > 1) result.description = parts.slice(1).join('\n').trim();
    else result.description = metaPart;
    function findKey(kp) {
        var m = metaPart.match(new RegExp(kp + '\s*[：:]\s*(.+?)(?:\n|$)', 'im'));
        if (m) return m[1].trim();
        return '';
    }
    result.name = findKey('名称') || findKey('名字');
    if (!result.name) { var fl = metaPart.split('\n')[0].replace(/^[#*\-\s]+/, '').trim(); if (fl && fl.length >= 2 && fl.length <= 30 && fl.indexOf('：') === -1 && fl.indexOf(':') === -1) result.name = fl; }
    var tr = findKey('类型'); if (tr) { if (tr.indexOf('套装') !== -1 || tr.indexOf('搭配') !== -1 || tr.indexOf('整套') !== -1 || tr.indexOf('outfit') !== -1) result.type = 'outfit'; else if (tr.indexOf('单品') !== -1 || tr.indexOf('单件') !== -1 || tr.indexOf('item') !== -1) result.type = 'item'; }
    result.style = findKey('风格');
    result.season = findKey('季节');
    result.scene = findKey('场景');
    if (!result.name && !result.style && !result.season && !result.scene) result.description = text.trim();
    return result;
}

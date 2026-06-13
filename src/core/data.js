// ── 视角数据访问 ─────────────────────────────────────

export function getCharData(d, charName) {
    if (!d.chars) d.chars = {};
    if (!d.virtualOutfits) d.virtualOutfits = {};
    if (!d.chars[charName]) d.chars[charName] = { outfits: [], categories: [], activeIds: [] };
    return d.chars[charName];
}

export function currentOwner(d) {
    if (d.currentView === 'char' && d.currentChar) return d.currentChar;
    return 'user';
}

export function getViewOutfits(d) {
    if (d.currentView === 'char' && d.currentChar) return getCharData(d, d.currentChar).outfits;
    return d.outfits;
}

export function getViewCategories(d) {
    if (d.currentView === 'char' && d.currentChar) return getCharData(d, d.currentChar).categories;
    return d.categories;
}

export function getViewActiveIds(d) {
    if (d.currentView === 'char' && d.currentChar) return getCharData(d, d.currentChar).activeIds;
    return d.activeIds;
}

export function setViewActiveIds(d, ids) {
    if (d.currentView === 'char' && d.currentChar) { getCharData(d, d.currentChar).activeIds = ids; }
    else { d.activeIds = ids; }
}

export function getById(d, id) {
    for (var i = 0; i < d.outfits.length; i++) { if (d.outfits[i].id === id) return d.outfits[i]; }
    if (d.chars) {
        for (var cn in d.chars) {
            var co = d.chars[cn].outfits || [];
            for (var j = 0; j < co.length; j++) { if (co[j].id === id) return co[j]; }
        }
    }
    if (d.virtualOutfits && d.virtualOutfits[id]) return d.virtualOutfits[id];
    return null;
}

export function getViewById(d, id) {
    var list = getViewOutfits(d);
    for (var i = 0; i < list.length; i++) { if (list[i].id === id) return list[i]; }
    return null;
}

export function isActive(d, id) {
    return getViewActiveIds(d).indexOf(id) !== -1;
}

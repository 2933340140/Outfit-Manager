// ── v17→v18 数据迁移 ────────────────────────────────

export function migrateV17(d) {
    if (!d.outfits) return;
    var userOutfits = [];
    var moved = {};
    d.outfits.forEach(function (o) {
        if (o.owner && o.owner !== 'user') {
            var cn = o.owner;
            if (!moved[cn]) moved[cn] = [];
            delete o.owner;
            moved[cn].push(o);
        } else {
            delete o.owner;
            userOutfits.push(o);
        }
    });
    d.outfits = userOutfits;
    if (!d.chars) d.chars = {};
    if (!d.virtualOutfits) d.virtualOutfits = {};
    if (!d.charNames) d.charNames = [];
    for (var cn in moved) {
        if (!d.chars[cn]) d.chars[cn] = { outfits: [], categories: [], activeIds: [] };
        d.chars[cn].outfits = d.chars[cn].outfits.concat(moved[cn]);
        if (d.charNames.indexOf(cn) === -1) d.charNames.push(cn);
    }
    if (d.charActiveIds) {
        for (var cn2 in d.charActiveIds) {
            if (!d.chars[cn2]) d.chars[cn2] = { outfits: [], categories: [], activeIds: [] };
            d.chars[cn2].activeIds = d.charActiveIds[cn2];
        }
        delete d.charActiveIds;
    }
}

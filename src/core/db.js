// ── 数据持久化层 ─────────────────────────────────────
import { DB_NAME, DB_VERSION, STORE_NAME, DATA_KEY, SHARED_SETTINGS_KEY, SHARED_DATA_KEY, def } from '../constants.js';
import { migrateV17 } from './migrate.js';
import { autoDetectApiConfig } from '../ai/api-detect.js';

var dbInstance = null;
var dataCache = null;

// ── SillyTavern Context ─────────────────────────────
export function getSTContextSafe() {
    try { return (typeof SillyTavern !== 'undefined' && SillyTavern.getContext) ? SillyTavern.getContext() : null; }
    catch (e) { return null; }
}

// ── Shared Settings ─────────────────────────────────
export function getSharedSettingsRoot() {
    var ctx = getSTContextSafe();
    if (!ctx) return null;
    if (!ctx.extensionSettings) ctx.extensionSettings = {};
    if (!ctx.extensionSettings[SHARED_SETTINGS_KEY]) ctx.extensionSettings[SHARED_SETTINGS_KEY] = {};
    return ctx.extensionSettings[SHARED_SETTINGS_KEY];
}

export function loadFromSharedSettings() {
    var root = getSharedSettingsRoot();
    if (!root || !root[SHARED_DATA_KEY]) return null;
    return root[SHARED_DATA_KEY];
}

export function saveToSharedSettings(d) {
    var root = getSharedSettingsRoot();
    if (!root) return;
    root[SHARED_DATA_KEY] = d;
    var ctx = getSTContextSafe();
    if (ctx && ctx.saveSettingsDebounced) ctx.saveSettingsDebounced();
}

export function hasWardrobeData(d) {
    if (!d) return false;
    if (d.outfits && d.outfits.length > 0) return true;
    if (d.chars) { for (var cn in d.chars) { if (d.chars[cn].outfits && d.chars[cn].outfits.length > 0) return true; } }
    if (d.activeIds && d.activeIds.length > 0) return true;
    return false;
}

// ── IndexedDB ───────────────────────────────────────
export function openDB(cb) {
    if (dbInstance) return cb(dbInstance);
    var req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = function (e) {
        var db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
    };
    req.onsuccess = function (e) { dbInstance = e.target.result; cb(dbInstance); };
    req.onerror = function () { cb(null); };
}

export function loadFromDB(cb) {
    openDB(function (db) {
        var finish = function (d) {
            d = ensureDefaults(d);
            dataCache = d;
            // 迁移到shared settings
            if (!loadFromSharedSettings() && hasWardrobeData(d)) saveToSharedSettings(d);
            cb(d);
        };

        // 优先shared settings
        var shared = loadFromSharedSettings();
        if (shared && hasWardrobeData(shared)) return finish(shared);

        if (!db) return finish(loadFromLS());

        var tx = db.transaction(STORE_NAME, 'readonly');
        var store = tx.objectStore(STORE_NAME);
        var req2 = store.get(DATA_KEY);
        req2.onsuccess = function () {
            var d = req2.result || null;
            if (!d || !hasWardrobeData(d)) {
                var ls = loadFromLS();
                if (ls && hasWardrobeData(ls)) d = ls;
            }
            finish(d);
        };
        req2.onerror = function () { finish(loadFromLS()); };
    });
}

export function saveToDB(d, cb) {
    saveToSharedSettings(d);
    try { localStorage.setItem('outfit_mgr_v4', JSON.stringify(d)); } catch (e) {}
    try { localStorage.setItem('outfit_mgr_v4_backup', JSON.stringify(d)); } catch (e) {}
    openDB(function (db) {
        if (!db) { if (cb) cb(); return; }
        var tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).put(d, DATA_KEY);
        tx.oncomplete = function () { if (cb) cb(); };
        tx.onerror = function () { if (cb) cb(); };
    });
}

export function load() {
    if (dataCache) return dataCache;
    var shared = loadFromSharedSettings();
    if (shared) return shared;
    return loadFromLS() || def();
}

export function save(d) { dataCache = d; saveToDB(d); }

export function loadFromLS() {
    try {
        var r = localStorage.getItem('outfit_mgr_v4');
        if (r) return JSON.parse(r);
        var b = localStorage.getItem('outfit_mgr_v4_backup');
        if (b) return JSON.parse(b);
        return null;
    } catch (e) { return null; }
}

export function getDataCache() { return dataCache; }
export function setDataCache(d) { dataCache = d; }

// ── 默认值确保 ──────────────────────────────────────
export function ensureDefaults(d) {
    var dd = def();
    if (!d) return dd;
    for (var k in dd) { if (d[k] === undefined) d[k] = dd[k]; }
    if (d.activeId && !d.activeIds) d.activeIds = [d.activeId];
    if (!Array.isArray(d.activeIds)) d.activeIds = [];
    if (!Array.isArray(d.presets)) d.presets = [];
    if (!d.chars) d.chars = {};
    if (!d.virtualOutfits) d.virtualOutfits = {};
    if (!d.selectedWorldBookNames || !Array.isArray(d.selectedWorldBookNames)) d.selectedWorldBookNames = [];
    if (!d.charNames) d.charNames = [];
    if (!d.apiVision) d.apiVision = def().apiVision;
    else {
        var dv = def().apiVision;
        for (var vk in dv) { if (d.apiVision[vk] === undefined) d.apiVision[vk] = dv[vk]; }
        if (d.apiVision.batchSize && !d.apiVision.concurrency) { d.apiVision.concurrency = Math.min(d.apiVision.batchSize, 5); }
        delete d.apiVision.batchSize;
        if (d.useMainApi !== false) { d.useMainApi = true; autoDetectApiConfig(d); }
    }
    migrateV17(d);
    return d;
}

// ── 穿搭管理扩展 Entry Point ──────────────────────────
import { injectStyles } from './ui/styles.js';
import { setupInjection } from './inject/injection.js';
import { injectBtn, updateBtn } from './ui/ui-bar.js';
import { injectFab } from './ui/fab.js';
import { loadFromDB, save, getSTContextSafe, hasWardrobeData } from './core/db.js';
import { autoDetectApiConfig } from './ai/api-detect.js';
import { getSelectedWorldBookNames, refreshWorldBookStyles, getWorldBookStyles, worldBookStyleMatchesScene, createWorldBookOutfit, materializeWorldBookStyle, setWorldBookStylesLoaded } from './worldbook/worldbook.js';
import { toast } from './utils/toast.js';
import { genId } from './utils/helpers.js';
import { SCENE_DEFS } from './constants.js';

// Boot sequence
injectStyles();
setupInjection();

setTimeout(injectBtn, 500);
setInterval(injectBtn, 2000);
setTimeout(injectFab, 1500);
setInterval(function () {
    var fab = document.getElementById('om-fab-main');
    if (!fab) injectFab();
}, 3000);

loadFromDB(function (dd) {
    // Auto-detect API config
    if (dd.useMainApi) autoDetectApiConfig(dd);

    // Sync world book names
    var ctx = getSTContextSafe();
    if (ctx) {
        var selNames = getSelectedWorldBookNames(ctx, dd);
        if (selNames.length > 0 && (!dd.selectedWorldBookNames || dd.selectedWorldBookNames.length === 0)) {
            dd.selectedWorldBookNames = selNames;
            save(dd);
        }
    }

    // Auto-roll on startup
    if ((!dd.activeIds || dd.activeIds.length === 0) && !dd.autoRollDisabled && dd.selectedWorldBookNames.length > 0) {
        refreshWorldBookStyles(dd.selectedWorldBookNames, function () {
            var styles = getWorldBookStyles(dd.selectedWorldBookNames);
            if (styles.length > 0) {
                var pick = styles[Math.floor(Math.random() * styles.length)];
                var virtual = createWorldBookOutfit(pick, 'wb', 0);
                dd.virtualOutfits[virtual.id] = virtual;
                dd.activeIds = [virtual.id];
                save(dd);
                setTimeout(function () {
                    toast('今日穿搭：「' + virtual.name + '」（' + (pick.style || '') + '·' + (pick.scene || '') + '）');
                }, 3500);
            }
        });
    } else if (dd.activeIds && dd.activeIds.length > 0) {
        // Show existing active outfit reminder
        setTimeout(function () {
            var names = [];
            dd.activeIds.forEach(function (id) {
                var o = null;
                for (var i = 0; i < dd.outfits.length; i++) { if (dd.outfits[i].id === id) { o = dd.outfits[i]; break; } }
                if (!o && dd.virtualOutfits && dd.virtualOutfits[id]) o = dd.virtualOutfits[id];
                if (o && o.name) names.push(o.name);
            });
            if (names.length > 0) toast('今日穿搭：「' + names.join('、') + '」');
        }, 3500);
    }

    updateBtn();
});

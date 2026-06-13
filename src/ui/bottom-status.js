import { load } from '../core/db.js';
import { currentOwner, getViewActiveIds, setViewActiveIds, getById } from '../core/data.js';
import { renderQuickScenes } from './quick-scenes.js';
import { esc } from '../utils/helpers.js';

export function renderBottomStatus() {
    var el = document.getElementById('om-bottom-status'); if (!el) return;
    var d = load();

    // 收集所有owner的激活穿搭
    var allActive = [];
    // User
    (d.activeIds || []).forEach(function (id) { var o = getById(d, id); if (o) allActive.push({ owner: 'User', name: o.name, id: id }); });
    // Chars
    if (d.chars) {
        for (var cn in d.chars) {
            var cd = d.chars[cn];
            (cd.activeIds || []).forEach(function (id) {
                var o = null; for (var k = 0; k < (cd.outfits || []).length; k++) { if (cd.outfits[k].id === id) { o = cd.outfits[k]; break; } }
                if (o) allActive.push({ owner: cn, name: o.name, id: id });
            });
        }
    }

    var dotClass, text;
    if (allActive.length === 0) { dotClass = 'gray'; text = '未选择穿搭'; }
    else {
        dotClass = 'green';
        var parts = [];
        var userCount = allActive.filter(function (a) { return a.owner === 'User'; }).length;
        if (userCount > 0) parts.push('User ' + userCount + '套');
        if (d.chars) {
            for (var cn2 in d.chars) {
                var cnt = allActive.filter(function (a) { return a.owner === cn2; }).length;
                if (cnt > 0) parts.push(cn2 + ' ' + cnt + '套');
            }
        }
        text = parts.join(' · ');
        if (allActive.length > 1) dotClass = 'orange';
    }

    var clearBtn = allActive.length > 0 ? '<button class="om-status-clear" id="om-status-clearall">全部取消</button>' : '';
    var activeName = allActive.length === 1 ? allActive[0].name : '';
    var statusDisplay = activeName ? '穿着：' + esc(activeName) : text;
    el.innerHTML = '<div class="om-status-dot ' + dotClass + '"></div><span class="om-status-text" title="' + esc(activeName) + '">' + esc(statusDisplay) + '</span>' + clearBtn;
    renderQuickScenes(load());

    var clr = el.querySelector('#om-status-clearall');
    if (clr) clr.addEventListener('click', function (e) {
        e.stopPropagation();
        var dd = load(); dd.activeIds = [];
        if (dd.chars) { for (var cn3 in dd.chars) { dd.chars[cn3].activeIds = []; } }
        save(dd);
        updateBtn(); renderBottomStatus(); renderGrid(); closeDetailPanel();
        toast('已取消全部选择');
    });
}

// ── Vision API 调用核心 ──────────────────────────────
import { load, save } from '../core/db.js';
import { getById } from '../core/data.js';
import { esc, getFirstImage, hasImages } from '../utils/helpers.js';
import { toast } from '../utils/toast.js';
import { getPopupLayer } from '../ui/popup-layer.js';

// 统一处理 API 地址，兼容各种填法
export function normalizeEndpoint(raw, path) {
    // path: 'chat' | 'models'
    var url = raw.replace(/\/+$/, '');
    // 去掉已有的 /v1/chat/completions 或 /v1/models 后缀
    url = url.replace(/\/v1\/chat\/completions\/?$/, '').replace(/\/v1\/models\/?$/, '');
    // 去掉末尾的 /v1（用户可能多写了）
    url = url.replace(/\/v1\/?$/, '');
    if (path === 'models') return url + '/v1/models';
    return url + '/v1/chat/completions';
}

// 拉取模型列表
export function fetchModelList(apiCfg, cb) {
    if (!apiCfg.endpoint || !apiCfg.key) { cb('请先填写 API 地址和 Key'); return; }
    var url = normalizeEndpoint(apiCfg.endpoint, 'models');
    fetch(url, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + apiCfg.key }
    }).then(function (r) {
        if (!r.ok) return r.text().then(function (t) { throw new Error('HTTP ' + r.status); });
        return r.json();
    }).then(function (data) {
        var models = [];
        var list = data.data || data.models || data;
        if (Array.isArray(list)) {
            list.forEach(function (m) {
                var id = m.id || m.name || m;
                if (typeof id === 'string' && id) models.push(id);
            });
        }
        models.sort(function (a, b) { return a.toLowerCase().localeCompare(b.toLowerCase()); });
        cb(null, models);
    }).catch(function (e) { cb(e.message || String(e)); });
}

// 模型选择下拉弹窗
// isDark: boolean — 由调用方传入当前深色模式状态
export function openModelPicker(apiCfg, onSelect, isDark) {
    toast('正在拉取模型列表...');
    fetchModelList(apiCfg, function (err, models) {
        if (err) { toast('拉取失败：' + err, true); return; }
        if (!models || models.length === 0) { toast('未获取到模型列表', true); return; }
        var modal = document.createElement('div');
        modal.className = 'om-modal';
        modal.style.cssText = 'position:absolute !important;inset:0 !important;z-index:1 !important;background:rgba(0,0,0,.45) !important;display:flex !important;align-items:center !important;justify-content:center !important;padding:20px !important;box-sizing:border-box !important;pointer-events:auto !important;';
        var searchHtml = '<input type="text" id="om-model-search" placeholder="搜索模型..." style="width:100%;background:rgba(127,127,127,.08);border:1px solid rgba(127,127,127,.2);border-radius:8px;color:inherit;padding:8px 10px;font-size:.85em;box-sizing:border-box;font-family:inherit;margin-bottom:8px" />';
        var listHtml = models.map(function (m) {
            return '<div class="om-model-item" data-model="' + esc(m) + '" style="padding:10px 12px;cursor:pointer;border-radius:8px;font-size:.85em;transition:.12s;word-break:break-all">' + esc(m) + '</div>';
        }).join('');
        modal.innerHTML = '<div class="om-modal-box" style="background:' + (isDark ? '#1e1e24' : '#ececef') + ';color:' + (isDark ? '#eee' : '#111') + ';max-height:75vh">' +
            '<div class="om-modal-title"><i class="fa-solid fa-list" style="margin-right:6px"></i>选择模型 <span style="font-weight:400;font-size:.75em;opacity:.5">（共 ' + models.length + ' 个）</span></div>' +
            searchHtml +
            '<div id="om-model-list" style="overflow-y:auto;max-height:50vh;display:flex;flex-direction:column;gap:2px">' + listHtml + '</div>' +
            '<button class="om-modal-cancel" id="om-model-cancel">取消</button></div>';
        var _mp = getPopupLayer();
        _mp.appendChild(modal);
        modal.addEventListener('click', function (e) { if (e.target === modal) _mp.removeChild(modal); });
        modal.querySelector('#om-model-cancel').addEventListener('click', function () { _mp.removeChild(modal); });
        // 搜索过滤
        modal.querySelector('#om-model-search').addEventListener('input', function () {
            var q = this.value.toLowerCase();
            modal.querySelectorAll('.om-model-item').forEach(function (item) {
                item.style.display = item.dataset.model.toLowerCase().indexOf(q) !== -1 ? '' : 'none';
            });
        });
        setTimeout(function () { modal.querySelector('#om-model-search').focus(); }, 50);
        // 选择模型
        modal.querySelectorAll('.om-model-item').forEach(function (item) {
            item.addEventListener('mouseenter', function () { item.style.background = 'rgba(127,127,127,.12)'; });
            item.addEventListener('mouseleave', function () { item.style.background = ''; });
            item.addEventListener('click', function () {
                _mp.removeChild(modal);
                onSelect(item.dataset.model);
                toast('✅ 已选择：' + item.dataset.model);
            });
        });
    });
}

export function callVisionAPI(apiCfg, image, systemPrompt, cb, retryCount) {
    // image: {name, dataUrl} → 单张图片单个请求
    retryCount = retryCount || 0;
    var maxRetries = 4;
    if (!apiCfg.endpoint || !apiCfg.key || !apiCfg.model) { cb('API 未配置完整'); return; }
    var endpoint = normalizeEndpoint(apiCfg.endpoint, 'chat');
    var content = [
        { type: 'image_url', image_url: { url: image.dataUrl } },
        { type: 'text', text: '请描述这套穿搭：' + image.name }
    ];
    var body = {
        model: apiCfg.model,
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: content }
        ],
        max_tokens: 1024
    };
    try {
        fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiCfg.key },
            body: JSON.stringify(body)
        }).then(function (r) {
            if (!r.ok) {
                if (r.status === 429 && retryCount < maxRetries) {
                    var delay = (retryCount + 1) * 5000;
                    setTimeout(function () { callVisionAPI(apiCfg, image, systemPrompt, cb, retryCount + 1); }, delay);
                    return;
                }
                return r.text().then(function (t) { cb('HTTP ' + r.status + ': ' + (t || '').substring(0, 200)); });
            }
            return r.json();
        }).then(function (data) {
            var text = '';
            if (data.choices && data.choices[0]) {
                var msg = data.choices[0].message;
                text = msg ? (msg.content || '') : '';
            } else if (data.candidates && data.candidates[0]) {
                var parts = data.candidates[0].content && data.candidates[0].content.parts;
                if (parts) text = parts.map(function (p) { return p.text || ''; }).join('');
            }
            cb(null, text.trim());
        }).catch(function (e) { cb('请求失败：' + (e.message || '网络错误')); });
    } catch (e) { cb('请求异常：' + e.message); }
}

export function batchGenerateDescriptions(outfitIds, progressCb, doneCb) {
    var d = load();
    var apiCfg = d.apiVision;
    if (!apiCfg.endpoint || !apiCfg.key || !apiCfg.model) { doneCb('请先在设置中配置"描述生成 API"'); return; }
    var targets = [];
    outfitIds.forEach(function (id) {
        var o = getById(d, id);
        if (!o || !hasImages(o)) return;
        if (!apiCfg.overwrite && o.description && o.description.trim()) return;
        targets.push(o);
    });
    if (targets.length === 0) { doneCb('没有需要生成描述的穿搭（可能都已有描述或无图片）'); return; }

    var concurrency = Math.max(1, Math.min(5, apiCfg.concurrency || 3));
    var done = 0; var total = targets.length; var errors = [];
    var queue = targets.slice(); // 待处理队列

    function processNext() {
        if (queue.length === 0) return;
        var o = queue.shift();
        var image = { name: o.name, dataUrl: getFirstImage(o) };
        callVisionAPI(apiCfg, image, apiCfg.prompt, function (err, text) {
            done++;
            if (err) {
                errors.push({ name: o.name, error: err });
            } else if (text) {
                o.description = text;
            } else {
                errors.push({ name: o.name, error: '返回内容为空' });
            }
            progressCb(done, total, '已完成 ' + done + '/' + total);
            if (done >= total) {
                save(d);
                doneCb(errors.length > 0 ? '完成，但有 ' + errors.length + ' 个错误' : null, done, errors);
            } else {
                processNext();
            }
        });
    }

    progressCb(0, total, '开始生成，并发数 ' + concurrency + '...');
    // 启动 N 个并发
    for (var i = 0; i < Math.min(concurrency, total); i++) {
        processNext();
    }
}

// 单个穿搭生成描述
export function generateSingleDescription(outfit, cb) {
    var d = load();
    var apiCfg = d.apiVision;
    if (!apiCfg.endpoint || !apiCfg.key || !apiCfg.model) { cb('请先在设置中配置"描述生成 API"'); return; }
    if (!hasImages(outfit)) { cb('该穿搭没有图片'); return; }
    callVisionAPI(apiCfg, { name: outfit.name, dataUrl: getFirstImage(outfit) }, apiCfg.prompt, function (err, text) {
        if (err) { cb(err); return; }
        cb(null, text);
    });
}

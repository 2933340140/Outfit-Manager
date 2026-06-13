// ── 预设系统：酒馆预设导入 + 内置提示词模板 ─────────
import { getSTContextSafe } from '../core/db.js';
import { load, save } from '../core/db.js';
import { toast } from '../utils/toast.js';

// ── 内置穿搭提示词模板 ──────────────────────────────
export var BUILTIN_TEMPLATES = [
    {
        id: 'default',
        name: '默认（平衡风格）',
        description: '平衡细节与叙事，适合大多数场景',
        systemPrompt: '你是一位穿搭助手。根据角色性格、场景和季节，为角色设计一套合适的穿搭。输出格式：第一行为风格名称，之后为100-200字的穿搭描述。描述要具体到颜色、材质、款式细节。禁止编造图中没有的服装。',
        userPromptPrefix: '请为以下场景设计穿搭：',
        temperature: 0.8,
        maxTokens: 600,
    },
    {
        id: 'sweet',
        name: '甜美风',
        description: '少女感、柔和色调、蝴蝶结/蕾丝元素',
        systemPrompt: '你是一位擅长甜美风格的穿搭设计师。为角色设计甜美可爱的穿搭，注重柔和色调（粉色、浅蓝、奶白）、蝴蝶结、蕾丝、荷叶边等少女元素。输出格式：第一行为风格名称，之后为100-200字的甜美风穿搭描述，突出可爱感和细节。',
        userPromptPrefix: '请设计一套甜美风穿搭：',
        temperature: 0.9,
        maxTokens: 600,
    },
    {
        id: 'japanese',
        name: '日系风',
        description: '日式时尚、层次感、oversized搭配',
        systemPrompt: '你是一位精通日本时尚的穿搭设计师。为角色设计日系风格穿搭，注重层次感、宽松剪裁、oversized搭配、冷淡色调或大地色系。参考原宿风、无印良品风、日系简约等风格。输出格式：第一行为风格名称，之后为100-200字的日系穿搭描述。',
        userPromptPrefix: '请设计一套日系风穿搭：',
        temperature: 0.85,
        maxTokens: 600,
    },
    {
        id: 'formal',
        name: '正式场合',
        description: '商务正装、晚宴、优雅得体',
        systemPrompt: '你是一位精通正装礼仪的穿搭顾问。为角色设计适合正式场合的穿搭（商务会议、晚宴、颁奖典礼等），注重面料质感（羊毛、真丝、缎面）、剪裁合身、配色稳重。输出格式：第一行为场合和风格名称，之后为100-200字的正装穿搭描述。',
        userPromptPrefix: '请设计一套正式场合穿搭：',
        temperature: 0.7,
        maxTokens: 600,
    },
    {
        id: 'street',
        name: '街头风',
        description: '潮流街头、运动休闲、大胆配色',
        systemPrompt: '你是一位街头时尚达人。为角色设计潮流街头风格的穿搭，注重大胆配色、oversized轮廓、运动元素混搭、品牌球鞋、帽子配饰等。可以融合工装、运动、嘻哈等元素。输出格式：第一行为风格标签，之后为100-200字的街头风穿搭描述。',
        userPromptPrefix: '请设计一套街头风穿搭：',
        temperature: 0.95,
        maxTokens: 600,
    },
    {
        id: 'comfort',
        name: '居家舒适',
        description: '家居服、睡衣、舒适面料',
        systemPrompt: '你是一位注重舒适的穿搭设计师。为角色设计居家舒适的穿搭，注重柔软面料（棉、法兰绒、针织）、宽松版型、温暖感。适合居家、休息、睡眠场景。输出格式：第一行为风格名称，之后为100-200字的舒适穿搭描述。',
        userPromptPrefix: '请设计一套居家舒适穿搭：',
        temperature: 0.8,
        maxTokens: 500,
    },
];

// ── 从 SillyTavern 导入当前预设参数 ─────────────────
export function importSTPreset() {
    var ctx = getSTContextSafe();
    if (!ctx) { toast('无法访问 SillyTavern 上下文', true); return null; }

    var result = {
        name: '酒馆当前预设',
        apiSettings: {},
        systemPrompt: '',
        imported: false,
    };

    // 读取 API 参数 — 尝试多种来源
    var cs = ctx.chatCompletionSettings;
    if (cs && cs.api_url) {
        result.apiSettings = {
            endpoint: cs.api_url || '',
            key: cs.api_key || '',
            model: cs.model || '',
            temperature: cs.temperature !== undefined ? cs.temperature : null,
            maxTokens: cs.openai_max_tokens || cs.max_tokens || null,
            topP: cs.top_p !== undefined ? cs.top_p : null,
            frequencyPenalty: cs.frequency_penalty !== undefined ? cs.frequency_penalty : null,
            presencePenalty: cs.presence_penalty !== undefined ? cs.presence_penalty : null,
        };
        result.imported = true;
    }

    // 备选：从主 API 连接配置读取（Text Completion / KoboldAI 等）
    if (!result.imported) {
        try {
            // 尝试 main_api 相关设置
            if (ctx.main_api) result.mainApi = ctx.main_api;
            if (ctx.settings && ctx.settings.api_url) {
                result.apiSettings = {
                    endpoint: ctx.settings.api_url || '',
                    key: ctx.settings.api_key || '',
                    model: ctx.settings.model || '',
                };
                result.imported = true;
            }
        } catch (e) { /* ignore */ }
    }

    // 尝试读取预设管理器的扩展字段
    try {
        if (ctx.getPresetManager) {
            var pm = ctx.getPresetManager();
            if (pm) {
                // 尝试读取已保存的穿搭管理器配置
                var savedConfig = pm.readPresetExtensionField({ path: 'outfit_manager' });
                if (savedConfig) {
                    result.savedConfig = savedConfig;
                }
                result.imported = true;
            }
        }
    } catch (e) {
        // PresetManager 可能不可用，忽略
    }

    return result;
}

// ── 获取用户选择的预设模板 ───────────────────────────
export function getActiveTemplate() {
    var d = load();
    var tplId = d.activePromptTemplate || 'default';

    // 先查内置模板
    for (var i = 0; i < BUILTIN_TEMPLATES.length; i++) {
        if (BUILTIN_TEMPLATES[i].id === tplId) return BUILTIN_TEMPLATES[i];
    }

    // 再查用户自定义模板
    if (d.customTemplates) {
        for (var j = 0; j < d.customTemplates.length; j++) {
            if (d.customTemplates[j].id === tplId) return d.customTemplates[j];
        }
    }

    return BUILTIN_TEMPLATES[0]; // fallback
}

// ── 保存用户选择的预设模板 ───────────────────────────
export function setActiveTemplate(templateId) {
    var d = load();
    d.activePromptTemplate = templateId;
    save(d);
}

// ── 保存自定义模板 ──────────────────────────────────
export function saveCustomTemplate(name, systemPrompt, userPromptPrefix, temperature, maxTokens) {
    var d = load();
    if (!d.customTemplates) d.customTemplates = [];
    var tpl = {
        id: 'custom_' + Date.now().toString(36),
        name: name,
        description: '自定义模板',
        systemPrompt: systemPrompt || '',
        userPromptPrefix: userPromptPrefix || '',
        temperature: temperature || 0.8,
        maxTokens: maxTokens || 600,
    };
    d.customTemplates.push(tpl);
    save(d);
    return tpl;
}

// ── 删除自定义模板 ──────────────────────────────────
export function deleteCustomTemplate(templateId) {
    var d = load();
    if (!d.customTemplates) return;
    d.customTemplates = d.customTemplates.filter(function (t) { return t.id !== templateId; });
    if (d.activePromptTemplate === templateId) d.activePromptTemplate = 'default';
    save(d);
}

// ── 获取所有可用模板（内置+自定义） ─────────────────
export function getAllTemplates() {
    var d = load();
    var all = BUILTIN_TEMPLATES.slice();
    if (d.customTemplates) {
        d.customTemplates.forEach(function (t) { all.push(t); });
    }
    return all;
}

// ── 将酒馆预设参数应用到 API 配置 ────────────────────
export function applySTPresetToApiConfig(d) {
    var stPreset = importSTPreset();

    // 检查是否真正导入了 API 设置
    if (!stPreset) { toast('无法访问酒馆上下文', true); return false; }

    var s = stPreset.apiSettings || {};
    if (!s.endpoint && !s.key && !s.model) {
        toast('未检测到酒馆 API 配置，请手动填写下方的 API 地址和 Key', true);
        return false;
    }

    if (s.endpoint) d.apiVision.endpoint = s.endpoint;
    if (s.key) d.apiVision.key = s.key;
    if (s.model) d.apiVision.model = s.model;

    // 保存额外的预设参数
    d.stPresetParams = {
        temperature: s.temperature,
        maxTokens: s.maxTokens,
        topP: s.topP,
        frequencyPenalty: s.frequencyPenalty,
        presencePenalty: s.presencePenalty,
    };

    toast('已导入酒馆 API 配置：' + (s.model || s.endpoint || 'OK'));
    return true;
}

// ── 将预设保存到酒馆的预设管理器 ─────────────────────
export function saveToSTPreset(config) {
    var ctx = getSTContextSafe();
    if (!ctx || !ctx.getPresetManager) {
        toast('无法访问酒馆预设管理器', true);
        return false;
    }
    try {
        var pm = ctx.getPresetManager();
        if (pm && pm.writePresetExtensionField) {
            pm.writePresetExtensionField({
                path: 'outfit_manager',
                value: config,
            });
            toast('已保存到酒馆当前预设');
            return true;
        }
    } catch (e) {
        // ignore
    }
    toast('保存到酒馆预设失败', true);
    return false;
}

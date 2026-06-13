// ── API 自动检测（支持所有酒馆 API 类型） ─────────────

export function autoDetectApiConfig(d) {
    try {
        if (typeof SillyTavern === 'undefined' || !SillyTavern.getContext) return;
        var ctx = SillyTavern.getContext();
        var mainApi = ctx.mainApi || '';

        if (mainApi === 'openai') {
            // Chat Completion 模式
            var cs = ctx.chatCompletionSettings || {};
            // URL: 优先自定义URL，其次反代
            if (cs.chat_completion_source === 'custom' && cs.custom_url) {
                d.apiVision.endpoint = cs.custom_url;
            } else if (cs.reverse_proxy) {
                d.apiVision.endpoint = cs.reverse_proxy;
            }
            // Model: 使用官方API获取当前模型
            if (ctx.getChatCompletionModel) {
                try { d.apiVision.model = ctx.getChatCompletionModel(cs) || ''; } catch (e) {}
            }
            // Key: ST不暴露key给扩展，需要用户手动填写
            // 但可以标记已检测到API类型
            d._detectedApiType = 'chat_completion';
            d._detectedSource = cs.chat_completion_source || 'openai';

        } else if (mainApi === 'textgenerationwebui') {
            // Text Completion 模式（Ollama, vLLM, Tabby, KoboldCpp 等）
            var ts = ctx.textCompletionSettings || {};
            if (ctx.getTextGenServer) {
                try { d.apiVision.endpoint = ctx.getTextGenServer() || ''; } catch (e) {}
            }
            // 尝试读取模型名
            var modelField = getModelFieldForTextGenType(ts.type);
            if (modelField && ts[modelField]) d.apiVision.model = ts[modelField];
            else if (ts.custom_model) d.apiVision.model = ts.custom_model;
            d._detectedApiType = 'text_completion';
            d._detectedSource = ts.type || 'unknown';

        } else if (mainApi === 'novel') {
            d._detectedApiType = 'novelai';
            d._detectedSource = 'novel';
            // NovelAI 不适合做 Vision API

        } else if (mainApi === 'kobold' || mainApi === 'koboldhorde') {
            d._detectedApiType = 'kobold';
            d._detectedSource = mainApi;
        }

    } catch (e) {
        // 静默失败
    }
}

function getModelFieldForTextGenType(type) {
    var map = {
        mancer: 'mancer_model', vllm: 'vllm_model', aphrodite: 'aphrodite_model',
        tabby: 'tabby_model', togetherai: 'togetherai_model', llamacpp: 'llamacpp_model',
        ollama: 'ollama_model', infermaticai: 'infermaticai_model', dreamgen: 'dreamgen_model',
        openrouter: 'openrouter_model', featherless: 'featherless_model',
        generic: 'generic_model',
    };
    return map[type] || null;
}

// ── API 自动检测 ─────────────────────────────────────

export function autoDetectApiConfig(d) {
    try {
        if (typeof SillyTavern !== 'undefined' && SillyTavern.getContext) {
            var ctx = SillyTavern.getContext();
            if (ctx.chatCompletionSettings) {
                var cs = ctx.chatCompletionSettings;
                if (cs.api_url) d.apiVision.endpoint = cs.api_url;
                if (cs.api_key) d.apiVision.key = cs.api_key;
                if (cs.model) d.apiVision.model = cs.model;
            }
        }
    } catch (e) {}
}

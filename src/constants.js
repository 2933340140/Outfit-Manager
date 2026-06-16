// ── 常量 ──────────────────────────────────────────────

export const SCRIPT_NAME = '穿搭管理';
export const BTN_ID = 'outfit-mgr-ext-btn-v4';
export const DB_NAME = 'outfit_mgr_db';
export const DB_VERSION = 1;
export const STORE_NAME = 'data';
export const DATA_KEY = 'main';
export const SHARED_SETTINGS_KEY = 'Outfit-Manager';
export const SHARED_DATA_KEY = 'wardrobeData';
export const MAX_IMG_WIDTH = 1200;   // upgraded from 800
export const IMG_QUALITY = 0.85;     // upgraded from 0.75
export const FAB_ID = 'om-fab-main';

// ── 场景定义 ────────────────────────────────────────────
export const SCENE_DEFS = [
    { key: '外出', label: '外出' },
    { key: '约会', label: '约会' },
    { key: '办公', label: '通勤' },
    { key: '家居', label: '家居' },
    { key: '运动', label: '运动' },
    { key: '睡前', label: '睡前' },
];

// ── 内衣风格检测 ─────────────────────────────────────────
export const LINGERIE_REGEX = /内衣|文胸|内裤|抹胸|蕾丝性感|法式三角杯|聚拢|丝绸奢华|基础纯棉|少女可爱/;

// ── 世界书服装条目检测 ───────────────────────────────────
export const WB_CLOTHING_PATTERN = /穿搭|睡衣|随机穿搭|内衣|Cosplay/i;
export const WB_CLOTHING_PART_PATTERN = /上装|下装|外套|鞋袜|配饰|包包/i;

// ── 默认数据结构 ─────────────────────────────────────────
export function def() {
    return {
        outfits: [],
        categories: [],
        activeIds: [],
        virtualOutfits: {},
        presets: [],
        activePresetId: null,
        chars: {},
        charNames: [],
        charFavorites: [],
        charGroups: {},
        currentView: 'user',
        selectedWorldBookNames: [],
        currentChar: '',
        showBall: true,
        mode: 'text',
        injectPosition: 'user',
        autoRollDisabled: false,
        singleTemplate: '[User当前穿着]\n{{description}}\n（禁止编造其他服装。严禁集中罗列服装信息，服装细节必须分散融入不同的动作、触感、环境互动中，每次只带出一两个细节。）',
        multiTemplate: '[User的可选穿搭]\n{{wardrobe}}\n（禁止编造以上之外的服装。根据场景标签匹配穿搭，若回复中出现场景转换则对应切换穿搭。严禁集中罗列服装信息，服装细节必须分散融入动作、触感、环境互动中，每次只带出一两个细节。）',
        charSingleTemplate: '[{{charName}}当前穿着]\n{{description}}\n（禁止编造其他服装。严禁集中罗列服装信息，服装细节必须分散融入不同的动作、触感、环境互动中，每次只带出一两个细节。）',
        charMultiTemplate: '[{{charName}}的可选穿搭]\n{{wardrobe}}\n（禁止编造以上之外的服装。根据场景标签匹配穿搭，若回复中出现场景转换则对应切换穿搭。严禁集中罗列服装信息，服装细节必须分散融入动作、触感、环境互动中，每次只带出一两个细节。）',
        imagePrompt: '图中为角色当前穿着，禁止编造其他服装。严禁集中罗列，服装细节必须分散融入动作、触感、环境互动中，每次只带出一两个细节。',
        multiImagePrompt: '以上图片为可选穿搭，根据场景标签匹配，场景转换则切换穿搭，禁止编造其他服装。严禁集中罗列，细节分散融入动作和互动中。',
        itemSingleTemplate: '[User单品衣柜]\n{{wardrobe}}\n（以上为当前可用的单品库存，禁止编造以上之外的服装单品。）',
        itemMultiTemplate: '[User穿搭+单品]\n{{outfits}}\n\n[单品衣柜]\n{{items}}\n（以上为当前穿搭和可用单品库存，禁止编造以上之外的服装。）',
        debug: false,
        useMainApi: true,
        lastAutoEnabledEntry: null,
        apiVision: {
            endpoint: '',
            key: '',
            model: '',
            concurrency: 1,
            prompt: '请用中文详细描述这张穿搭图片中的服装。包括：服装类型、颜色、材质、款式细节、搭配方式等。只描述服装本身，不描述人物外貌。每套穿搭的描述控制在100-200字。',
            overwrite: false,
            parsePrompt: '请逐件列出图中可见单品。格式：类别：描述。类别包括上装/下装/外套/鞋袜/配饰/包包。只列图中实际可见的。每件一行15-30字。',
            autoTagPrompt: '分析这张穿搭照片，用以下格式回复（简洁，不要解释）：\n名称：<5-15字>\n类型：套装 或 单品\n风格：选一个（学院/简约/运动/甜美/通勤/休闲/街头/优雅/舒适）\n季节：选一个（春/夏/秋/冬/全年）\n场景：选一个（外出/家居/办公/约会/运动/睡前）\n---\n<描述100-200字>',
        },
    };
}

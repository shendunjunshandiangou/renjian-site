// 全局配置 —— 环境相关项集中在此；改站名/域名/模块只动这个文件
export const SITE = {
  name: '人间样本',
  nameEn: 'RENJIAN SPECIMENS',
  seal: 'SPECIMEN',
  tagline: '用数据、影像、文字与声音记录世界',
  description:
    '这里是一座小小的标本馆。每一次旅行、每一次与模型的对话、每一段钢琴练习，都被编号、归档、钉在软木板上——然后继续生长。',
  url: 'https://shendunjunshandiangou.github.io/renjian-site',
  email: 'hi@renjian.me',
  established: 'EST. 2023',
};

// 页脚社交链接（占位，上线前替换为真实地址或删除）
export const SOCIAL: { label: string; href: string }[] = [
  { label: 'GitHub', href: 'https://github.com/' },
  { label: '豆瓣', href: 'https://www.douban.com/' },
];

// 站点部署在子路径下（astro.config.mjs 的 base）。
// 所有内部链接必须经过 url()，否则会指向根路径而 404。
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
export const url = (path: string = '/') => {
  const p = path.replace(/^\//, '');
  return p ? `${BASE}/${p}` : BASE || '/';
};

export type ModuleSlug = 'travel' | 'ai-lab' | 'math-notes' | 'reading' | 'music';

export interface ModuleDef {
  slug: ModuleSlug;
  no: string;
  name: string;
  en: string;
  prefix: string;
  desc: string;
  illu: string; // src/assets/illustrations/ 下的文件名（不含扩展名）
  fitContain: boolean; // 竖幅插图用 contain
}

export const MODULES: ModuleDef[] = [
  { slug: 'travel', no: '01 / TRAVEL', name: '行旅志', en: 'Field Notes', prefix: 'RS-T', desc: '摄影与旅行记录。在陌生城市里采集天气、光线和人的表情。', illu: 'illu-travel', fitContain: false },
  { slug: 'ai-lab', no: '02 / AI-LAB', name: 'AI工坊', en: 'Experiments', prefix: 'RS-A', desc: '与模型共生的实验笔记：提示词、生成图像、小型工具与失败记录。', illu: 'illu-ai-lab', fitContain: true },
  { slug: 'math-notes', no: '03 / MATH', name: '数理札记', en: 'Notebooks', prefix: 'RS-M', desc: '统计、概率与思维模型。把日常问题拆开，看看里面的齿轮。', illu: 'illu-math', fitContain: true },
  { slug: 'reading', no: '04 / READING', name: '纸上回声', en: 'Echoes', prefix: 'RS-R', desc: '古诗词与阅读笔记。千年前的句子落在今天的纸上，仍有回声。', illu: 'illu-reading', fitContain: false },
  { slug: 'music', no: '05 / MUSIC', name: '声音档案', en: 'Recordings', prefix: 'RS-S', desc: '钢琴练习与声音采集。错音、雨声、地铁进站的轰鸣，一并留存。', illu: 'illu-music', fitContain: false },
];

export const NOTES_CARD = {
  no: '06 / NOTES', name: '随想', en: 'Fragments', prefix: 'RS-N',
  desc: '散落在各处的只言片语，从各模块摘取，按时间流不断生长。',
  illu: 'illu-notes',
};

export const NAV = [
  { href: url('/'), label: '首页' },
  ...MODULES.map((m) => ({ href: url(`/${m.slug}`), label: m.name })),
  { href: url('/notes'), label: '随想' },
  { href: url('/about'), label: '关于' },
];

export const STATUS_LABEL = { seed: '种子', growing: '生长中', evergreen: '已长成' } as const;
export const STATUS_CLASS = { seed: 'seed', growing: 'grow', evergreen: 'done' } as const;

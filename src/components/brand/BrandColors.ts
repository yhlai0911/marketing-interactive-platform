// 品牌色常數 — 源自 content/metadata.yaml
export const BRAND = {
  primary: "#1B3A5C",    // 深藍 — 標題、專業元素
  accent: "#D4A843",     // 琥珀金 — 品牌、任務
  story: "#2D5016",      // 抹茶綠 — 故事、洞察
  danger: "#C0392B",     // 危機紅 — 警告、cliffhanger
  neutral: "#7F8C8D",    // 中性灰
} as const;

// 角色專屬色
export const CHARACTER_COLORS: Record<string, string> = {
  chen: "#2C3E50",       // 陳建宏 — 深沉穩重的創業家
  profLin: "#1B3A5C",    // 林教授 — 學者藍
  xiaoYa: "#D4A843",     // 小雅 — 活力琥珀金
  laoLi: "#34495E",      // 老李 — 資深穩重灰藍
  wantai: "#C0392B",     // 萬泰金控 — 競爭紅
  narrator: "#7F8C8D",   // 旁白
};

// 角色中文名
export const CHARACTER_NAMES: Record<string, string> = {
  chen: "陳建宏",
  profLin: "林教授",
  xiaoYa: "小雅",
  laoLi: "老李",
  wantai: "萬泰金控",
  narrator: "旁白",
};

// 角色職稱（用於課堂模式顯示）
export const CHARACTER_ROLES: Record<string, string> = {
  chen: "CEO / 創辦人",
  profLin: "行銷顧問",
  xiaoYa: "CMO",
  laoLi: "業務總監",
  wantai: "競爭對手",
  narrator: "",
};

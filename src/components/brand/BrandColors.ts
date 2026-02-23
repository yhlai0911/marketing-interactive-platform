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
  linmei: "#D4A843",
  profchen: "#1B3A5C",
  jason: "#2C3E50",
  yuki: "#E74C3C",
  bingcheng: "#C0392B",
  narrator: "#7F8C8D",
};

// 角色中文名
export const CHARACTER_NAMES: Record<string, string> = {
  linmei: "林美",
  profchen: "陳教授",
  jason: "方志豪",
  yuki: "小雪",
  bingcheng: "冰城帝國",
  narrator: "旁白",
};

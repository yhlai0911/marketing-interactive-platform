import type { FormulaItem } from "@/components/visuals/FormulaQuickRef";

export const week01Formulas: FormulaItem[] = [
  {
    name: "匯率基本表示",
    formula: "S(TWD/USD) = 32.5",
    description: "表示 1 美元 = 32.5 台幣。斜線前是「計價貨幣」，斜線後是「被報價貨幣」。",
    example: "S(TWD/JPY) = 0.22 表示 1 日圓 = 0.22 台幣",
  },
  {
    name: "匯率變動影響",
    formula: "新匯率 = S₀ × (1 - x%)",
    description: "若外幣貶值 x%，新匯率 = 原匯率 × (1 - x%)。營收變化 = Q × P(外幣) × S₀ × x%，其中 Q = 銷售量，P = 外幣定價，S₀ = 原始匯率。",
    example: "日圓貶值 10%：0.21 × 0.9 = 0.189",
  },
  {
    name: "交叉匯率",
    formula: "S(TWD/JPY) = {S(TWD/USD)}/{S(JPY/USD)}",
    description: "透過第三貨幣（通常是美元）計算兩種貨幣之間的匯率。斜線中間的貨幣可以「約分」消掉。",
    example: "S(TWD/USD) = 32.5, S(JPY/USD) = 150 → S(TWD/JPY) = 32.5/150 = 0.2167",
  },
  {
    name: "市場規模預測（複合成長）",
    formula: "FV = PV × (1 + g)ⁿ",
    description: "其中 g = 年複合成長率，n = 年數。用於估算市場規模的未來值。",
    example: "現在市場 100 億，年成長 8%，5 年後 = 100 × 1.08⁵ ≈ 147 億",
  },
];

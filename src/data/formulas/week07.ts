import type { FormulaItem } from "@/components/visuals/FormulaQuickRef";

export const week07Formulas: FormulaItem[] = [
  {
    name: "6 個月遠期匯率 CIP",
    formula: "F(6m) = S₀ × {1 + i_d × 6/12}/{1 + i_f × 6/12}",
    description: "用拋補利率平價計算 6 個月期的遠期匯率。分子分母分別乘以期間比例（6/12）。",
  },
  {
    name: "遠期避險收入",
    formula: "遠期收入 = 外幣金額 × F",
    description: "用遠期合約鎖定匯率，不論未來匯率如何變動，都以 F 換匯。確定性高，但放棄了匯率有利變動的好處。",
  },
  {
    name: "選擇權避險（日圓賣權）",
    formula: "S_T < K → 有效匯率 = K - c ; S_T >= K → 有效匯率 = S_T - c",
    description: "K = 履約價，c = 權利金。最低有效匯率（下限）= K - c。保底又保彈性，但需付權利金。",
    example: "K = 0.230, c = 0.004 → 最低有效匯率 = 0.226",
  },
  {
    name: "權利金總額",
    formula: "權利金 = 名目金額 × c",
    description: "選擇權的「保險費」，無論是否行使都要支付。是選擇權避險的主要成本。",
    example: "避險 5,000 萬日圓, c = 0.004 → 權利金 = 5,000 萬 × 0.004 = 20 萬 TWD",
  },
  {
    name: "利率交換 IRS 淨效果",
    formula: "(TORF + spread) - TORF + swap rate = swap rate + spread",
    description: "貸款付 TORF + spread，IRS 收 TORF、付固定 swap rate。淨效果：浮動利率轉為固定利率。",
  },
  {
    name: "三種盾牌比較",
    formula: "遠期：鎖定 | 選擇權：保底+彈性 | 不避險：全賭市場",
    description: "遠期：確定性高，上下都鎖，零現金成本。選擇權：保底保彈性，付權利金。不避險：零成本，承擔全部市場風險。",
  },
];

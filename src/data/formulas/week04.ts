import type { FormulaItem } from "@/components/visuals/FormulaQuickRef";

export const week04Formulas: FormulaItem[] = [
  {
    name: "遠期溢價/折價",
    formula: "遠期溢價 = {F - S}/{S} × 100%",
    description: "F > S：外幣有遠期溢價（市場預期外幣升值）；F < S：外幣有遠期折價（市場預期外幣貶值）。",
  },
  {
    name: "拋補利率平價 CIP（精確式）",
    formula: "{F}/{S} = {1 + i_d}/{1 + i_f}",
    description: "遠期匯率由兩國利率差決定。這是無套利條件，在實務上幾乎總是成立。",
  },
  {
    name: "拋補利率平價 CIP（近似式）",
    formula: "{F - S}/{S} ≈ i_d - i_f",
    description: "遠期溢價 ≈ 兩國利率差。高利率國家的貨幣通常有遠期折價。",
    example: "台灣利率 1.5%, 日本利率 -0.1% → 日圓遠期溢價 ≈ 1.6%",
  },
  {
    name: "費雪效果",
    formula: "(1 + i) = (1 + r)(1 + π)",
    description: "名目利率 = 實質利率 + 通膨率（近似：i ≈ r + π）。名目利率反映了通膨預期。",
  },
  {
    name: "國際費雪效果 IFE",
    formula: "{S₁ - S₀}/{S₀} ≈ i_d - i_f",
    description: "高利率國家貨幣傾向貶值，低利率國家貨幣傾向升值。利率差 ≈ 預期匯率變動。",
  },
  {
    name: "未拋補利率平價 UIP",
    formula: "{E(S₁) - S}/{S} ≈ i_d - i_f",
    description: "與 CIP 形式相同，但 E(S₁) 是預期匯率（不確定），非遠期匯率（已鎖定）。UIP 實證上常不成立。",
  },
  {
    name: "遠期匯率無偏假說",
    formula: "F = E(S₁)",
    description: "若 CIP 和 UIP 同時成立，遠期匯率等於預期的未來即期匯率。",
  },
  {
    name: "平價條件網核心等式",
    formula: "π_d - π_f ≈ i_d - i_f ≈ {F - S}/{S} ≈ {E(S₁) - S}/{S}",
    description: "通膨差 ≈ 利率差 ≈ 遠期溢價 ≈ 預期匯率變動。四個等式構成完整的國際平價條件網。",
  },
];

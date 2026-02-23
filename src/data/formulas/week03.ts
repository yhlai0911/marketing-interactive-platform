import type { FormulaItem } from "@/components/visuals/FormulaQuickRef";

export const week03Formulas: FormulaItem[] = [
  {
    name: "一價法則",
    formula: "P_d = S × P_f  →  S = {P_d}/{P_f}",
    description: "P_d = 國內價格，P_f = 國外價格，S = 匯率（國內/外國貨幣）。同一商品在不同國家應以相同貨幣計算的價格一致。",
  },
  {
    name: "絕對購買力平價",
    formula: "S = {P_d}/{P_f}",
    description: "匯率應等於兩國物價水準的比率。這是一價法則在「整體物價」層面的推廣。",
    example: "台灣大麥克 75 TWD, 美國 5.69 USD → PPP 匯率 = 75/5.69 = 13.18",
  },
  {
    name: "PPP 偏差",
    formula: "PPP 偏差% = {S(actual) - S(PPP)}/{S(PPP)} × 100",
    description: "正值 = 外幣高估（比 PPP 預測的貴）；負值 = 外幣低估（比 PPP 預測的便宜）。",
  },
  {
    name: "相對購買力平價（精確式）",
    formula: "{S₁}/{S₀} = {1 + π_d}/{1 + π_f}",
    description: "匯率的變動反映兩國通膨率的差異。π_d > π_f → 本國貨幣貶值（S 上升）；π_d < π_f → 本國貨幣升值（S 下降）。",
  },
  {
    name: "相對購買力平價（近似式）",
    formula: "{S₁ - S₀}/{S₀} ≈ π_d - π_f",
    description: "當通膨率 < 5% 時可用近似式。匯率變動率 ≈ 兩國通膨差。",
    example: "台灣通膨 2%, 日本通膨 0.5% → 預期台幣對日圓貶值約 1.5%",
  },
  {
    name: "通膨的複利效果",
    formula: "Sₙ = S₀ × (1 + π_d - π_f)ⁿ",
    description: "長期的匯率變動可以用通膨差的複利來估算。n = 年數。",
  },
];

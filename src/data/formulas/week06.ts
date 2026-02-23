import type { FormulaItem } from "@/components/visuals/FormulaQuickRef";

export const week06Formulas: FormulaItem[] = [
  {
    name: "外幣借款有效成本（精確公式）",
    formula: "r(eff) = (1 + r_f) × {E(S₁)}/{S₀} - 1",
    description: "r_f = 外幣名目利率，E(S₁)/S₀ = 預期匯率變動倍數。有效成本同時反映名目利率和匯率風險。",
    example: "日圓利率 0.8%, 預期日圓升值 1.6% → r(eff) = 1.008 × 1.016 - 1 = 2.41%",
  },
  {
    name: "外幣借款有效成本（近似公式）",
    formula: "r(eff) ≈ r_f + Δs",
    description: "Δs = 預期匯率變動率。當匯率變動 < 5% 時可使用近似式。",
    example: "日圓利率 0.8% + 預期升值 1.6% ≈ 有效成本 2.4%",
  },
  {
    name: "IFE 預期匯率變動",
    formula: "Δs ≈ i_d - i_f",
    description: "用基準利率（不是企業借款利率）推算匯率預期。i_d = 本國基準利率，i_f = 外國基準利率。",
  },
  {
    name: "債券有效成本 All-in Cost",
    formula: "發行淨額 = 面額 × (1 - 發行費用率)",
    description: "有效成本 = 使淨額的現值等於所有未來現金流現值的內部報酬率（IRR）。考慮發行費用後的真實融資成本。",
  },
  {
    name: "自然避險判斷",
    formula: "收入幣別 = 債務幣別 → 自然避險",
    description: "收入幣別 = 債務幣別 → 無匯率風險；收入幣別 ≠ 債務幣別 → 幣別錯配 → 有匯率風險。",
    example: "台積電美元營收 + 美元債務 = 自然避險；珍途日圓營收 + 台幣債務 = 幣別錯配",
  },
  {
    name: "國際融資三維決策框架",
    formula: "成本 (越低越好) + 風險 (越低越好) + 彈性 (越高越好)",
    description: "成本 = 有效成本（含匯率調整）；風險 = 匯率風險 + 利率風險；彈性 = 審核速度 + 金額彈性。三者無法同時最優，需要取捨。",
  },
];

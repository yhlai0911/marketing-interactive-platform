import type { FormulaItem } from "@/components/visuals/FormulaQuickRef";

export const week05Formulas: FormulaItem[] = [
  {
    name: "淨現值 NPV",
    formula: "NPV = -C₀ + Σ {CFₜ}/{(1+k)ᵗ}",
    description: "C₀ = 初始投資，CFₜ = 第 t 年淨現金流，k = 必要報酬率。NPV > 0 代表投資創造價值。",
  },
  {
    name: "母公司觀點 NPV",
    formula: "NPV(母) = -C₀·S₀ + Σ {CF*ₜ · E(Sₜ)}/{(1+k_d)ᵗ}",
    description: "CF*ₜ = 子公司外幣現金流，E(Sₜ) = 預期匯率，k_d = 母國折現率。需考慮匯率變動和扣繳稅。",
  },
  {
    name: "IFE 匯率預測法",
    formula: "E(Sₜ) = S₀ × ({1 + i_d}/{1 + i_f})ᵗ",
    description: "用兩國利率差預測未來匯率。另有遠期匯率法（E(Sₜ) = Fₜ）和相對 PPP 法可替代。",
  },
  {
    name: "調整現值法 APV",
    formula: "APV = Base NPV + PV(融資附帶效果)",
    description: "基礎 NPV 用 k_u（未槓桿權益成本）折現。融資附帶效果包含優惠貸款利差節省和利息稅盾。",
  },
  {
    name: "優惠貸款利差節省",
    formula: "利差節省 = 貸款金額 × (市場利率 - 優惠利率) × PVIFA",
    description: "東道國政府提供的優惠貸款，其低於市場利率的部分具有額外價值。",
  },
  {
    name: "利息稅盾",
    formula: "稅盾 = 貸款金額 × 優惠利率 × 稅率 × PVIFA",
    description: "利息費用可以抵稅，形成「稅盾」效果，降低實質借款成本。",
  },
  {
    name: "年金現值因子 PVIFA",
    formula: "PVIFA(r, n) = {1 - (1+r)⁻ⁿ}/{r}",
    description: "用於計算固定金額年金的現值。r = 折現率，n = 期數。",
  },
  {
    name: "折現率關係",
    formula: "k_d ≈ k_f + (i_d - i_f)",
    description: "母國折現率 ≈ 外國折現率 + 兩國無風險利率差異。確保不同幣別的折現率在風險等級上一致。",
  },
];

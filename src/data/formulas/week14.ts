import type { FormulaItem } from "@/components/visuals/FormulaQuickRef";

export const week14Formulas: FormulaItem[] = [
  {
    name: "國際投資組合風險",
    formula: "σ²_p = Σ w²_i σ²_i + Σ Σ w_i w_j σ_i σ_j ρ_ij",
    description: "國際投資組合的總風險由各資產的個別風險（第一項）和資產間的共變異數（第二項）組成。當跨國資產的相關係數 ρ_ij 低於國內資產間的相關係數時，國際分散化可以更有效地降低投資組合風險。Solnik (1974) 發現純美國投資組合的系統性風險約 27%，加入國際股票後可降至約 12%。",
    example: "60% 台股(σ=25%) + 40% 日股(σ=22%)，ρ=0.45 → σ_p = 23.24%，比純台股低 7%",
  },
  {
    name: "ADR 定價公式",
    formula: "P_ADR = P_原股 × ADR ratio / S",
    description: "ADR（美國存託憑證）的理論價格遵循一價法則。P_原股為母國市場的股價（以當地貨幣計），ADR ratio 為每張 ADR 代表的原股數量，S 為直接報價匯率（1 USD = S 單位當地貨幣）。當 ADR 市價偏離理論價格時，套利者可透過買低賣高使價格回歸。",
    example: "原股 TWD 480，ratio 1:5，S = 32 → P_ADR = 480 × 5 / 32 = USD 75。若市價 $77 則溢價 2.67%",
  },
  {
    name: "ADR 套利條件",
    formula: "溢價套利：P_ADR市價 > P_ADR理論 → 買原股、發行 ADR、在美國賣出",
    description: "當 ADR 市場價格偏離理論價格時，存在套利機會。溢價時（ADR 太貴）：在母國市場買入原股 → 存入保管銀行 → 轉換為 ADR → 在美國市場賣出。折價時反向操作。實務上套利受限於交易成本、時區差異、資本管制和 ADR 轉換的 2-5 個工作日延遲。",
    example: "ADR 理論價 $75，市價 $77 → 套利利潤 = $2/ADR（扣除交易成本前）",
  },
  {
    name: "WACC 公式",
    formula: "WACC = w_e × r_e + w_d × r_d × (1 − t)",
    description: "加權平均資本成本。交叉上市可透過三個管道降低 WACC：(1) 擴大投資人基礎 → β 降低 → r_e 下降；(2) 流動性改善 → 流動性溢酬降低；(3) Bonding Effect → 治理溢酬降低。Hail & Leuz (2009) 發現在美國交叉上市後，權益資本成本平均下降 0.7–1.3%。",
    example: "交叉上市前 WACC = 0.6×12% + 0.4×5%×0.8 = 8.8%；上市後 r_e 降至 10.5% → WACC = 7.9%，降 90bp",
  },
  {
    name: "匯率調整報酬",
    formula: "R_USD ≈ R_TWD + R_S",
    description: "國際投資人的實際報酬率近似等於當地貨幣報酬率加上匯率變動率。R_TWD 為以台幣計價的資產報酬，R_S 為匯率變動率（台幣相對美元的升貶幅度）。即使原股價格不變，匯率變動也會影響 ADR 持有人的報酬。台幣升值對 ADR 持有人有利，貶值則不利。",
    example: "珍途原股漲 10%，但 TWD 對 USD 貶值 8% → 美國投資人實際報酬 ≈ 10% − 8% = 2%",
  },
];

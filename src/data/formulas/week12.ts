import type { FormulaItem } from "@/components/visuals/FormulaQuickRef";

export const week12Formulas: FormulaItem[] = [
  {
    name: "母公司可匯回現金流",
    formula: "CF_parent = [EBIT × (1 − t_local) + Dep] × (1 − t_WHT) × S_t",
    description: "計算海外子公司的營業現金流經過當地稅、扣繳稅和匯率轉換後，母公司實際可收到的金額。EBIT × (1−t_local) 為繳完當地稅的營業利潤，加回折舊（非現金支出），再乘以 (1−t_WHT) 扣除匯出預扣稅，最後乘以匯率轉換為母國貨幣。",
    example: "EBIT = 1,000 萬泰銖，Dep = 500 萬，t_local = 20%，t_WHT = 10%，S_t = 0.90 TWD/THB → CF = [1,000 × 0.8 + 500] × 0.9 × 0.90 = 10,530 千台幣",
  },
  {
    name: "調整現值法（APV）",
    formula: "APV = Base NPV + Side Effects（稅盾 + 優惠融資 + 匯出限制）",
    description: "國際資本預算的黃金標準。先用無槓桿資金成本 k_u 折現母公司觀點的現金流得到基礎 NPV，再逐一加入各種副效果（稅盾、優惠融資、匯出限制損失），分開計算再加總。APV 特別適合國際投資，因為可以分別處理不同國家的稅制和融資條件。",
    example: "曼谷工廠：Base NPV = +5,000 千台幣 + 稅盾 2,100 + BOI 優惠 3,200 + 匯出限制 0 = APV ≈ +10,300 千台幣",
  },
  {
    name: "債務稅盾現值",
    formula: "PV(Tax Shield) = Σ (t_c × r_d × D_t) / (1 + r_d)^t",
    description: "舉債融資產生的利息可以抵稅，形成稅盾效果。t_c 為企業所得稅率，r_d 為債務利率，D_t 為第 t 期的債務餘額。稅盾現值以債務成本 r_d 折現，反映稅盾的確定性與債務同級。",
    example: "泰銖貸款 2,800 萬泰銖，利率 5.5%，稅率 20% → 年稅盾 = 2,800 × 5.5% × 20% = 30.8 萬泰銖/年，十年現值 ≈ 2,100 千台幣",
  },
  {
    name: "國際 WACC（含 CRP）",
    formula: "WACC = w_e × k_e + w_d × k_d × (1 − t_c)，其中 k_e = R_f + β(R_m − R_f) + CRP",
    description: "國際投資中的加權平均資金成本。股權成本 k_e 必須加入國家風險溢酬（CRP），反映新興市場的額外風險。融資幣別的選擇會影響 k_d——用當地貨幣借款可降低匯率風險，但利率可能較高。",
    example: "珍途：k_e = 4.5% + 1.0 × 6.0% + 1.56% = 12.06%，k_d = 5.5%，w_e = 60%，w_d = 40% → WACC = 0.6 × 12.06% + 0.4 × 5.5% × 0.8 = 9.00%",
  },
  {
    name: "匯率預測（PPP 法）",
    formula: "S_t = S_0 × (1 − d)^t",
    description: "基於購買力平價（PPP）的匯率預測。S_0 為當前匯率，d 為預期年貶值率（等於兩國通膨差異）。適用於長期趨勢預測。實務上應搭配多情境分析，因為匯率預測的不確定性極高。",
    example: "S_0 = 0.90 TWD/THB，預期泰銖年貶值 2% → 第 5 年 S_5 = 0.90 × 0.98^5 = 0.813；第 10 年 S_10 = 0.90 × 0.98^10 = 0.735",
  },
];

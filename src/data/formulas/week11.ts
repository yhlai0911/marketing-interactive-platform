import type { FormulaItem } from "@/components/visuals/FormulaQuickRef";

export const week11Formulas: FormulaItem[] = [
  {
    name: "國家風險溢酬（CRP）— Damodaran 法",
    formula: "CRP = 主權利差 × (σ_equity / σ_bond)",
    description: "用該國美元公債與美國公債的利差（主權利差），乘以該國股票市場與債券市場的波動度比率，得到反映股權投資額外風險的國家風險溢酬。波動度比率通常在 1.2 到 1.5 之間。",
    example: "泰國：主權利差 1.2% × 波動度比率 1.3 = CRP 1.56%",
  },
  {
    name: "含 CRP 的權益資金成本",
    formula: "k_e = R_f + β × (R_m − R_f) + CRP",
    description: "在傳統 CAPM 公式上加入國家風險溢酬。CRP 提高了折現率，使同一投資案在高風險國家的 NPV 更低、投資門檻更高。",
    example: "泰國 k_e = 4.5% + 1.0 × 6.0% + 1.56% = 12.06%；越南 k_e = 4.5% + 6.0% + 3.75% = 14.25%",
  },
  {
    name: "ICRG 國家風險綜合評分",
    formula: "ICRG = 政治風險 (50%) + 金融風險 (25%) + 經濟風險 (25%)",
    description: "International Country Risk Guide（ICRG）將國家風險分為政治、金融、經濟三大面向，滿分 100。政治風險佔權重最大（50%），反映制度環境對投資的重大影響。分數越高表示風險越低。",
  },
  {
    name: "NDF 結算金額",
    formula: "結算金額 = 名目本金 × (約定匯率 − 到期匯率) / 到期匯率",
    description: "無本金交割遠期合約（NDF）用於不可自由兌換的貨幣（如越南盾）。到期時不交割本金，只結算匯率差額，以美元或其他可兌換貨幣支付。",
    example: "名目 100 萬 VND，約定匯率 0.0040 USD/VND，到期 0.0038 → 結算 = 100萬 × (0.0040 − 0.0038) / 0.0038 ≈ 526.3 USD（賺）",
  },
];

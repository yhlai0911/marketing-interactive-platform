import type { FormulaItem } from "@/components/visuals/FormulaQuickRef";

export const week08Formulas: FormulaItem[] = [
  {
    name: "淨交易曝險",
    formula: "淨交易曝險 = Σ 外幣應收 - Σ 外幣應付",
    description: "盤點所有外幣收付項目後，計算淨曝險金額。正值 = 淨多方（擔心外幣貶值），負值 = 淨空方（擔心外幣升值）。",
  },
  {
    name: "自然避險效果",
    formula: "自然避險效果 = {總收入 - 淨曝險}/{總收入} × 100%",
    description: "衡量外幣收入中有多少比例被外幣支出自然抵消。比例越高，剩餘需要主動避險的金額越小。",
  },
  {
    name: "避險比率",
    formula: "h = {已避險金額}/{總曝險金額} × 100%",
    description: "衡量曝險中已被避險工具覆蓋的比例。100% = 全面避險，0% = 完全不避險。",
    example: "曝險 5,000 萬 JPY, 遠期避險 3,000 萬 → h = 60%",
  },
  {
    name: "遠期避險損益",
    formula: "避險損益 = 避險金額 × (F - S_T)",
    description: "F = 遠期匯率，S_T = 到期時即期匯率。F > S_T 時避險獲利（鎖在較高匯率）；F < S_T 時避險有機會成本。",
  },
  {
    name: "避險效果 HE",
    formula: "HE = 1 - {|實際收入 - 預期收入|}/{|不避險收入 - 預期收入|}",
    description: "HE = 1 表示完美避險（實際收入 = 預期收入）。HE = 0 表示避險無效。HE 越高越好。",
  },
  {
    name: "選擇權有效匯率",
    formula: "行使(S_T < K)：K - c | 不行使(S_T >= K)：S_T - c",
    description: "K = 履約價，c = 權利金。行使時收入確定（K - c），不行使時隨市場浮動但扣除已付權利金。",
  },
];

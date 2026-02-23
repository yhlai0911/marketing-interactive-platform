import type { FormulaItem } from "@/components/visuals/FormulaQuickRef";

export const week02Formulas: FormulaItem[] = [
  {
    name: "直接報價與間接報價",
    formula: "S(direct) = {1}/{S(indirect)}",
    description: "直接報價與間接報價互為倒數。直接報價以本國貨幣表示一單位外幣的價格。",
    example: "S(TWD/JPY) = 0.22 ↔ S(JPY/TWD) = 1/0.22 = 4.545",
  },
  {
    name: "買賣價差百分比",
    formula: "Spread% = {S(ask) - S(bid)}/{S(ask)} × 100",
    description: "你要買外幣 → 用 Ask（付比較多）；你要賣外幣 → 用 Bid（收比較少）。Spread 越大，交易成本越高。",
    example: "Bid = 0.219, Ask = 0.222 → Spread% = (0.222 - 0.219)/0.222 × 100 = 1.35%",
  },
  {
    name: "交叉匯率（透過美元中轉）",
    formula: "S(TWD/EUR) = S(TWD/USD) × S(USD/EUR)",
    description: "約分口訣：斜線中間的貨幣可以消掉。TWD/USD × USD/EUR = TWD/EUR。",
  },
  {
    name: "含 Bid-Ask 的交叉匯率",
    formula: "Cross Bid = Bid₁ × Bid₂ ; Cross Ask = Ask₁ × Ask₂",
    description: "交叉後的 Spread 一定大於原本任一對的 Spread，因為兩次交易的成本會疊加。",
  },
];

import type { FormulaItem } from "@/components/visuals/FormulaQuickRef";

export const week03Formulas: FormulaItem[] = [
  {
    name: "SWOT 分析矩陣（含交叉策略）",
    formula: "內部（S 優勢 / W 劣勢）× 外部（O 機會 / T 威脅）→ SO・ST・WO・WT 四策略",
    description: "先區分內外、再區分好壞。四種交叉策略：SO（用優勢抓住機會，積極進攻）、ST（用優勢抵禦威脅，防禦強化）、WO（改善劣勢以把握機會，改善突破）、WT（避開劣勢遇上威脅，策略收縮）。內部因素 = 企業自己能控制的；外部因素 = 不能控制的環境變化。",
    example: "富誠 SO 策略：用「團隊銀行業經驗」（S）搶攻「年輕世代偏好數位理財」（O），推出理財教育內容行銷",
  },
  {
    name: "PEST 總體環境分析",
    formula: "P（政治/法規）+ E（經濟）+ S（社會/文化）+ T（科技）",
    description: "分析外部宏觀環境趨勢的工具。P = 政策法規監管環境；E = 利率通膨購買力；S = 人口結構生活方式價值觀變遷；T = 技術創新數位化趨勢。PEST 只看外部大環境，不看企業內部（與 SWOT 的 O/T 類似但更系統化）。",
    example: "金融 PEST：P = 金管會開放純網銀、E = 低利率環境、S = 少子高齡化退休理財需求增、T = AI 智能投資顧問崛起",
  },
  {
    name: "行銷策略規劃六步驟",
    formula: "經營宗旨 → 分析市場機會(SWOT) → 選擇目標市場(STP) → 擬定行銷組合(4P/7P) → 規劃執行 → 成果考核（循環）",
    description: "完整的行銷策略規劃流程。傳統三階段簡化為：環境分析 → 策略規劃(STP) → 行銷組合(4P)。六步驟形成循環，考核結果回饋修正第一步。企業常犯的錯誤是跳過環境分析和策略規劃，直接做促銷。",
    example: "富誠先做 SWOT/PEST 分析（第三週），再做 STP（第四到六週），最後設計 4P 組合（第十一到十四週）",
  },
];

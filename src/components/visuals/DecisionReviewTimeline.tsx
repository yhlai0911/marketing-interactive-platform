"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND } from "@/components/brand/BrandColors";

interface Decision {
  week: number;
  title: string;
  decision: string;
  result: string;
  verdict: "success" | "caution";
  lesson: string;
  detail: string;
}

const DECISIONS: Decision[] = [
  {
    week: 1,
    title: "進軍東京 NPV 分析",
    decision: "運用 NPV 系統化分析東京旗艦店投資案，納入匯率、成本、預期營收等因素進行評估。",
    result: "旗艦店順利開張",
    verdict: "success",
    lesson: "系統化分析的價值",
    detail:
      "林美團隊以 NPV > 0 的量化結果說服董事會通過東京擴張案。陳教授強調：直覺很重要，但數字讓決策有底氣。",
  },
  {
    week: 2,
    title: "首筆日圓交易",
    decision: "仔細比對銀行買賣價、交叉匯率，找出最有利的交易路徑完成首筆日圓採購。",
    result: "正確計算成本",
    verdict: "success",
    lesson: "報價影響利潤",
    detail:
      "透過理解 bid-ask spread 與交叉匯率計算，珍途在首次外匯交易中避免了不必要的成本，省下約 12 萬日圓的匯差。",
  },
  {
    week: 3,
    title: "PPP 分析定價 ¥650",
    decision: "利用購買力平價（PPP）理論，將台灣定價轉換為適合日本市場的 ¥650 售價。",
    result: "被市場接受",
    verdict: "success",
    lesson: "PPP 作長期參考",
    detail:
      "¥650 定價既符合 PPP 的理論均衡水準，也貼合日本消費者的心理預期。開業首週銷量超過預期 20%。",
  },
  {
    week: 4,
    title: "CIP 驗算遠期匯率",
    decision: "運用拋補利率平價（CIP）驗算銀行報出的遠期匯率是否合理，確認無套利空間。",
    result: "遠期預測準確",
    verdict: "success",
    lesson: "CIP 高度可靠",
    detail:
      "CIP 計算出的理論遠期匯率與銀行報價僅差 0.0002，驗證了無套利條件在成熟市場高度成立。這為後續避險決策建立了信心基礎。",
  },
  {
    week: 5,
    title: "NPV/APV 資本預算",
    decision: "同時使用 NPV 和 APV 兩種方法評估東京店的長期資本預算，APV 額外考慮融資利益。",
    result: "回報符合預期",
    verdict: "success",
    lesson: "APV 看融資益處",
    detail:
      "APV 分析揭示了日圓低利貸款帶來的稅盾效果，使調整後的專案價值比基礎 NPV 高出約 8%。這項發現直接影響了 Week 6 的融資決策。",
  },
  {
    week: 6,
    title: "日圓貸款自然避險",
    decision: "選擇以日圓計價的 Mizuho 貸款，建立日圓負債以匹配日圓營收，實現自然避險。",
    result: "34% 自然避險",
    verdict: "success",
    lesson: "自然避險優先",
    detail:
      "日圓貸款的利息與本金支出自動抵銷了 34.3% 的日圓營收曝險，減少了需要額外避險的金額。陳教授指出：最好的避險不花一分錢。",
  },
  {
    week: 7,
    title: "50% 遠期避險",
    decision: "對剩餘淨曝險採取 50% 遠期合約避險，保留另一半暴露於市場。",
    result: "損失 60 萬",
    verdict: "caution",
    lesson: "部分避險 = 部分保護",
    detail:
      "日圓意外升值，未避險的 50% 反而帶來匯兌收益，但已鎖定的 50% 以較低遠期匯率結算，整體產生約 60 萬台幣的機會成本。這引發了團隊對避險比例的激烈討論。",
  },
];

export default function DecisionReviewTimeline() {
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);

  const successCount = DECISIONS.filter((d) => d.verdict === "success").length;
  const cautionCount = DECISIONS.filter((d) => d.verdict === "caution").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto"
    >
      <h4
        className="text-center font-bold text-lg mb-1"
        style={{ color: BRAND.primary }}
      >
        七週決策回顧
      </h4>
      <p className="text-center text-xs text-gray-500 mb-6">
        Decision Review Timeline — Week 1 ~ 7 核心決策與教訓
      </p>

      {/* Timeline */}
      <div className="relative pl-8 pr-2">
        {/* Vertical line */}
        <div
          className="absolute left-[18px] top-0 bottom-0 w-0.5"
          style={{ backgroundColor: `${BRAND.primary}25` }}
        />

        {DECISIONS.map((d, idx) => {
          const isExpanded = expandedWeek === d.week;
          const isCaution = d.verdict === "caution";
          const nodeColor = isCaution ? BRAND.accent : BRAND.story;
          const nodeBg = isCaution ? `${BRAND.accent}20` : `${BRAND.story}20`;

          return (
            <motion.div
              key={d.week}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative mb-4 last:mb-0"
            >
              {/* Node circle */}
              <motion.div
                className="absolute -left-[22px] top-3 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer z-10 border-2"
                style={{
                  backgroundColor: isExpanded ? nodeColor : nodeBg,
                  borderColor: nodeColor,
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setExpandedWeek(isExpanded ? null : d.week)
                }
              >
                <span
                  className="text-xs font-bold"
                  style={{
                    color: isExpanded ? "#fff" : nodeColor,
                  }}
                >
                  {isCaution ? "!" : "\u2713"}
                </span>
              </motion.div>

              {/* Card */}
              <motion.div
                className="ml-4 rounded-lg border cursor-pointer transition-all overflow-hidden"
                style={{
                  borderColor: isExpanded
                    ? nodeColor
                    : `${BRAND.neutral}30`,
                  backgroundColor: isExpanded
                    ? isCaution
                      ? `${BRAND.accent}06`
                      : `${BRAND.story}06`
                    : "#fff",
                }}
                onClick={() =>
                  setExpandedWeek(isExpanded ? null : d.week)
                }
                layout
              >
                {/* Header */}
                <div className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${BRAND.primary}12`,
                        color: BRAND.primary,
                      }}
                    >
                      W{d.week}
                    </span>
                    <span
                      className="text-sm font-bold"
                      style={{ color: BRAND.primary }}
                    >
                      {d.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-medium"
                      style={{ color: nodeColor }}
                    >
                      {d.result}
                    </span>
                    <span
                      className="text-lg"
                      style={{ color: nodeColor }}
                    >
                      {isCaution ? "\u25B3" : "\u2713"}
                    </span>
                  </div>
                </div>

                {/* Expanded detail */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-1">
                        <div className="grid grid-cols-1 gap-3">
                          {/* Decision */}
                          <div>
                            <div
                              className="text-xs font-bold mb-1"
                              style={{ color: BRAND.primary }}
                            >
                              決策內容
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed">
                              {d.decision}
                            </p>
                          </div>

                          {/* Detail */}
                          <div>
                            <div
                              className="text-xs font-bold mb-1"
                              style={{ color: nodeColor }}
                            >
                              結果詳情
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed">
                              {d.detail}
                            </p>
                          </div>

                          {/* Lesson */}
                          <div
                            className="p-2.5 rounded-lg"
                            style={{ backgroundColor: `${BRAND.accent}10` }}
                          >
                            <div
                              className="text-xs font-bold mb-0.5"
                              style={{ color: BRAND.accent }}
                            >
                              教訓
                            </div>
                            <p
                              className="text-xs font-medium"
                              style={{ color: BRAND.accent }}
                            >
                              {d.lesson}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-6 text-center text-sm p-3 rounded-lg"
        style={{ backgroundColor: `${BRAND.accent}15`, color: "#374151" }}
      >
        <span className="font-bold" style={{ color: BRAND.accent }}>
          綜合評估：
        </span>{" "}
        {DECISIONS.length} 次決策，
        <span className="font-bold" style={{ color: BRAND.story }}>
          {successCount} 次正確
        </span>
        ，
        <span className="font-bold" style={{ color: BRAND.accent }}>
          {cautionCount} 次值得檢討
        </span>
        ——整體軌跡良好，但 Week 7 的教訓提醒我們：
        <span className="font-bold" style={{ color: BRAND.primary }}>
          避險不是預測市場，而是管理風險
        </span>
        。
      </motion.div>
    </motion.div>
  );
}

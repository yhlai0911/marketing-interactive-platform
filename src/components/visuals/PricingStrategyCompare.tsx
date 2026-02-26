"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BRAND = {
  primary: "#1A3C5E",
  accent: "#C9A84C",
  story: "#2A6B5A",
  danger: "#C0392B",
  neutral: "#6B7280",
};

interface PricingPlan {
  key: "A" | "B" | "C";
  name: string;
  fee: string;
  message: string;
  color: string;
  isHighlighted: boolean;
  pros: string[];
  risks: string[];
  brandConsistency: number; // 1-5
  brandLabel: string;
  detail: string;
}

const PLANS: PricingPlan[] = [
  {
    key: "A",
    name: "方案 A：跟進降價",
    fee: "0.15%",
    message: "我們也很便宜",
    color: BRAND.danger,
    isHighlighted: false,
    pros: ["短期留住價格敏感客戶", "媒體容易報導「最低價」"],
    risks: [
      "利潤被壓縮，服務品質恐下降",
      "品牌定位從「有溫度」淪為「也很廉價」",
      "陷入價格戰——萬泰可以更低",
    ],
    brandConsistency: 1,
    brandLabel: "低",
    detail:
      "跟進萬泰的 0.15% 低價策略。這是最直覺的反應，但富誠的核心優勢不在成本——砍價只會削弱「有溫度的 FinTech」品牌定位，且萬泰作為大型金控，打價格戰的本錢遠超富誠。",
  },
  {
    key: "B",
    name: "方案 B：維持現價",
    fee: "0.3%",
    message: "我們就是比較貴",
    color: BRAND.primary,
    isHighlighted: false,
    pros: ["維持利潤空間", "不主動改變品牌定位"],
    risks: [
      "缺乏主動論述，被動挨打",
      "消費者只看到「比萬泰貴一倍」",
      "未回應市場的價格質疑",
    ],
    brandConsistency: 3,
    brandLabel: "中",
    detail:
      "維持 0.3% 管理費不變，不做任何調整。雖然保住了利潤，但在萬泰大量行銷攻勢下顯得被動。消費者會問「你比人家貴一倍，憑什麼？」如果沒有主動回答這個問題，就是放任市場替你回答。",
  },
  {
    key: "C",
    name: "方案 C：價值定價",
    fee: "0.3% + 退費",
    message: "每分錢都有價值",
    color: BRAND.story,
    isHighlighted: true,
    pros: [
      "主動回應「貴在哪裡」的質疑",
      "退費機制強化「與客戶站同一邊」的品牌承諾",
      "讓價格成為品牌宣言",
    ],
    risks: [
      "退費機制設計需精準避免逆選擇",
      "溝通成本較高——需教育市場",
    ],
    brandConsistency: 5,
    brandLabel: "高",
    detail:
      "維持 0.3% 管理費，但加入「目標達成退費」機制——當客戶的退休儲蓄目標達成率超過預期時，退還部分管理費。這把「價格」轉化為「承諾」：我們敢用自己的收入擔保服務品質。定價即品牌宣言。",
  },
];

function ConsistencyBar({ level, color }: { level: number; color: string }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <motion.div
          key={n}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 + n * 0.08, type: "spring" }}
          className="w-5 h-5 rounded-sm"
          style={{
            backgroundColor: n <= level ? color : `${BRAND.neutral}20`,
          }}
        />
      ))}
    </div>
  );
}

export default function PricingStrategyCompare() {
  const [expandedPlan, setExpandedPlan] = useState<"A" | "B" | "C" | null>(null);

  const togglePlan = (key: "A" | "B" | "C") => {
    setExpandedPlan(expandedPlan === key ? null : key);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Title */}
      <h3 className="text-base font-bold mb-1" style={{ color: BRAND.primary }}>
        三方案定價策略比較
      </h3>
      <p className="text-xs mb-5" style={{ color: BRAND.neutral }}>
        面對萬泰的價格戰，富誠有三條路——點擊方案查看深入分析
      </p>

      {/* Three columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {PLANS.map((plan, i) => (
          <motion.div
            key={plan.key}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12, type: "spring", stiffness: 100 }}
            className="rounded-xl cursor-pointer transition-all h-full flex flex-col"
            style={{
              border: plan.isHighlighted
                ? `2.5px solid ${BRAND.accent}`
                : `1.5px solid ${plan.color}40`,
              backgroundColor: expandedPlan === plan.key ? `${plan.color}06` : "#fff",
              boxShadow: plan.isHighlighted
                ? `0 0 16px ${BRAND.accent}25`
                : "none",
            }}
            onClick={() => togglePlan(plan.key)}
          >
            <div className="p-4 flex flex-col flex-1">
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold"
                    style={{ backgroundColor: plan.color, color: "#fff" }}
                  >
                    {plan.key}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold" style={{ color: plan.color }}>
                      {plan.name}
                    </h4>
                  </div>
                </div>
                {plan.isHighlighted && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-bold"
                    style={{
                      backgroundColor: `${BRAND.accent}20`,
                      color: BRAND.accent,
                    }}
                  >
                    富誠的選擇
                  </span>
                )}
              </div>

              {/* Fee display */}
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1, type: "spring" }}
                className="text-center py-3 rounded-lg mb-3"
                style={{ backgroundColor: `${plan.color}10` }}
              >
                <p className="text-xs" style={{ color: BRAND.neutral }}>
                  管理費
                </p>
                <p className="text-xl font-black" style={{ color: plan.color }}>
                  {plan.fee}
                </p>
              </motion.div>

              {/* Message */}
              <div
                className="rounded-md px-3 py-2 mb-3 text-center"
                style={{
                  backgroundColor: `${plan.color}08`,
                  border: `1px dashed ${plan.color}40`,
                }}
              >
                <p className="text-xs font-bold italic" style={{ color: plan.color }}>
                  &ldquo;{plan.message}&rdquo;
                </p>
              </div>

              {/* Pros & Risks */}
              <div className="space-y-2 mb-3 flex-1">
                <div>
                  <p className="text-xs font-semibold" style={{ color: BRAND.story }}>
                    優點
                  </p>
                  {plan.pros.map((p, j) => (
                    <p
                      key={j}
                      className="text-xs flex items-start gap-1.5 mt-0.5"
                      style={{ color: "#374151" }}
                    >
                      <span
                        className="shrink-0 mt-1 w-1 h-1 rounded-full"
                        style={{ backgroundColor: BRAND.story }}
                      />
                      {p}
                    </p>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-semibold" style={{ color: BRAND.danger }}>
                    風險
                  </p>
                  {plan.risks.map((r, j) => (
                    <p
                      key={j}
                      className="text-xs flex items-start gap-1.5 mt-0.5"
                      style={{ color: "#374151" }}
                    >
                      <span
                        className="shrink-0 mt-1 w-1 h-1 rounded-full"
                        style={{ backgroundColor: BRAND.danger }}
                      />
                      {r}
                    </p>
                  ))}
                </div>
              </div>

              {/* Brand Consistency */}
              <div className="pt-3" style={{ borderTop: `1px solid ${plan.color}15` }}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs" style={{ color: BRAND.neutral }}>
                    品牌一致性
                  </p>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor:
                        plan.brandConsistency >= 4
                          ? `${BRAND.story}15`
                          : plan.brandConsistency >= 3
                            ? `${BRAND.accent}15`
                            : `${BRAND.danger}15`,
                      color:
                        plan.brandConsistency >= 4
                          ? BRAND.story
                          : plan.brandConsistency >= 3
                            ? BRAND.accent
                            : BRAND.danger,
                    }}
                  >
                    {plan.brandLabel}
                  </span>
                </div>
                <ConsistencyBar level={plan.brandConsistency} color={plan.color} />
              </div>

              {/* Expand arrow */}
              <div className="text-center mt-3">
                <motion.span
                  animate={{ rotate: expandedPlan === plan.key ? 180 : 0 }}
                  className="inline-block text-xs"
                  style={{ color: plan.color }}
                >
                  &#9660;
                </motion.span>
              </div>

              {/* Expanded detail */}
              <AnimatePresence>
                {expandedPlan === plan.key && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="mt-3 rounded-lg p-3"
                      style={{
                        backgroundColor: `${plan.color}08`,
                        borderLeft: `3px solid ${plan.color}`,
                      }}
                    >
                      <p className="text-xs leading-relaxed" style={{ color: "#374151" }}>
                        {plan.detail}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Insight */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-xl p-4"
        style={{
          backgroundColor: `${BRAND.accent}08`,
          border: `2px solid ${BRAND.accent}`,
        }}
      >
        <p className="text-sm font-bold mb-1" style={{ color: BRAND.accent }}>
          定價即品牌宣言
        </p>
        <p className="text-xs leading-relaxed" style={{ color: "#374151" }}>
          價格不只決定營收——它向市場傳遞「我是誰」的訊號。方案 A 說「我也可以很廉價」，方案 B
          說「我不回應」，方案 C 說「我的每分錢都有價值，我敢用退費來證明」。富誠選擇方案
          C，因為它最符合「有溫度的 FinTech」品牌定位——定價本身就是品牌策略的延伸。
        </p>
      </motion.div>
    </div>
  );
}

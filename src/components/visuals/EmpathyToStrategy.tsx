"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BRAND = {
  primary: "#1A3C5E",
  accent: "#C9A84C",
  story: "#2A6B5A",
  danger: "#C0392B",
  neutral: "#6B7280",
};

interface StrategyPath {
  id: number;
  source: string;
  sourceEnglish: string;
  sourceIcon: string;
  strategy: string;
  strategyEnglish: string;
  strategyIcon: string;
  color: string;
  example: string;
  exampleTitle: string;
  insight: string;
}

const PATHS: StrategyPath[] = [
  {
    id: 1,
    source: "痛苦",
    sourceEnglish: "Pains",
    sourceIcon: "😣",
    strategy: "產品設計",
    strategyEnglish: "Product",
    strategyIcon: "📦",
    color: BRAND.danger,
    exampleTitle: "富誠 FinTech 的做法",
    example:
      "林志翔的痛苦是「不懂、不信、不動」。富誠據此設計：(1) 白話理財教學（解決不懂）、(2) 透明費用結構（解決不信）、(3) 三分鐘快速開戶（解決不動）。",
    insight:
      "痛苦 → 產品功能：每一個痛點都是產品設計的指引。客戶怕什麼，你就解決什麼。",
  },
  {
    id: 2,
    source: "聽到什麼",
    sourceEnglish: "Hear",
    sourceIcon: "👂",
    strategy: "通路策略",
    strategyEnglish: "Place",
    strategyIcon: "📱",
    color: BRAND.story,
    exampleTitle: "富誠 FinTech 的做法",
    example:
      "林志翔聽到同事推薦、YouTube KOL 分析、LINE 群轉發。富誠據此佈局：(1) 與理財 YouTuber 合作（KOL 行銷）、(2) LINE 官方帳號推播（社群觸及）、(3) Dcard 理財版口碑經營。",
    insight:
      "聽到什麼 → 去哪說：客戶在哪裡接收資訊，你就在那裡出現。",
  },
  {
    id: 3,
    source: "說做落差",
    sourceEnglish: "Say-Do Gap",
    sourceIcon: "🔄",
    strategy: "推力設計",
    strategyEnglish: "Nudge",
    strategyIcon: "👆",
    color: BRAND.accent,
    exampleTitle: "富誠 FinTech 的做法",
    example:
      "林志翔嘴上說「我應該理財」，實際卻每天打電動不行動。富誠據此設計推力：(1) 「同齡人已存到 20 萬」社會比較（從眾效應）、(2) 每月自動扣款 3,000 元（預設選項）、(3) 首月免手續費限時優惠（稀缺感）。",
    insight:
      "說做落差 → 行為推力：客戶知道該做但不做，就用行為經濟學的推力幫他一把。",
  },
];

export default function EmpathyToStrategy() {
  const [activePath, setActivePath] = useState<number | null>(null);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h3
        className="text-center text-lg font-bold mb-1"
        style={{ color: BRAND.primary }}
      >
        從同理心地圖到行銷策略
      </h3>
      <p className="text-center text-xs text-gray-500 mb-5">
        三條策略路徑：點擊查看富誠 FinTech 的具體應用
      </p>

      {/* 三條路徑卡片 */}
      <div className="space-y-3">
        {PATHS.map((path, i) => {
          const isActive = activePath === path.id;

          return (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.12 }}
              className="rounded-xl overflow-hidden cursor-pointer border transition-all"
              style={{
                borderColor: isActive ? path.color : "#e5e7eb",
                boxShadow: isActive
                  ? `0 2px 12px ${path.color}25`
                  : "none",
              }}
              onClick={() =>
                setActivePath(isActive ? null : path.id)
              }
            >
              {/* 路徑流程行 */}
              <div
                className="px-4 py-4"
                style={{
                  backgroundColor: isActive
                    ? `${path.color}10`
                    : "#fafafa",
                }}
              >
                {/* 流程圖：來源 → 策略 */}
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {/* 來源節點 */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl">{path.sourceIcon}</span>
                    <div>
                      <span
                        className="text-sm font-bold block leading-tight"
                        style={{ color: path.color }}
                      >
                        {path.source}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {path.sourceEnglish}
                      </span>
                    </div>
                  </div>

                  {/* 箭頭 */}
                  <svg
                    viewBox="0 0 40 20"
                    className="w-10 h-5 flex-shrink-0"
                  >
                    <motion.line
                      x1={2}
                      y1={10}
                      x2={30}
                      y2={10}
                      stroke={isActive ? path.color : "#d1d5db"}
                      strokeWidth={2}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.3 }}
                    />
                    <polygon
                      points="30,5 38,10 30,15"
                      fill={isActive ? path.color : "#d1d5db"}
                    />
                  </svg>

                  {/* 策略節點 */}
                  <div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                    style={{
                      backgroundColor: isActive
                        ? path.color
                        : `${path.color}15`,
                    }}
                  >
                    <span className="text-lg">{path.strategyIcon}</span>
                    <div>
                      <span
                        className="text-sm font-bold block leading-tight"
                        style={{
                          color: isActive ? "white" : path.color,
                        }}
                      >
                        {path.strategy}
                      </span>
                      <span
                        className="text-[10px]"
                        style={{
                          color: isActive
                            ? "rgba(255,255,255,0.75)"
                            : "#9ca3af",
                        }}
                      >
                        {path.strategyEnglish}
                      </span>
                    </div>
                  </div>

                  {/* 展開指示 */}
                  <div className="text-xs text-gray-400 ml-auto flex-shrink-0">
                    {isActive ? "▲" : "▼"}
                  </div>
                </div>

                {/* 一句話洞察 */}
                <p
                  className="text-xs mt-2 text-center"
                  style={{ color: isActive ? path.color : BRAND.neutral }}
                >
                  {path.insight}
                </p>
              </div>

              {/* 展開的具體範例 */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="px-4 py-4 border-t"
                      style={{
                        borderColor: `${path.color}25`,
                        backgroundColor: `${path.color}05`,
                      }}
                    >
                      <h5
                        className="text-xs font-bold mb-2"
                        style={{ color: path.color }}
                      >
                        {path.exampleTitle}
                      </h5>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {path.example}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* 底部統整 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-5 p-4 rounded-lg"
        style={{
          backgroundColor: `${BRAND.primary}08`,
          borderLeft: `4px solid ${BRAND.primary}`,
        }}
      >
        <h4
          className="text-sm font-bold mb-1"
          style={{ color: BRAND.primary }}
        >
          同理心地圖的策略價值
        </h4>
        <p className="text-sm text-gray-700">
          同理心地圖不只是「了解客戶」的工具，更是行銷策略的起點。
          每一個維度都對應一個策略方向：痛苦指引產品設計、聽到什麼指引通路佈局、
          說做落差指引行為推力。先理解，再行動。
        </p>
      </motion.div>
    </div>
  );
}

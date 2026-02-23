"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND } from "@/components/brand/BrandColors";

function fmtNum(n: number): string {
  return n.toLocaleString("zh-TW", { maximumFractionDigits: 0 });
}

interface Subsidiary {
  id: string;
  name: string;
  flag: string;
  netPosition: number; // positive = net receiver, negative = net payer
}

interface PaymentFlow {
  from: string;
  to: string;
  amount: number; // in $K
}

const SUBSIDIARIES: Subsidiary[] = [
  { id: "taipei", name: "台北總部", flag: "\u{1F1F9}\u{1F1FC}", netPosition: 270 },
  { id: "tokyo", name: "東京", flag: "\u{1F1EF}\u{1F1F5}", netPosition: -60 },
  { id: "bangkok", name: "曼谷", flag: "\u{1F1F9}\u{1F1ED}", netPosition: -40 },
  { id: "hongkong", name: "香港", flag: "\u{1F1ED}\u{1F1F0}", netPosition: -170 },
];

// Before netting: 8 cross-border payments
const BEFORE_FLOWS: PaymentFlow[] = [
  { from: "taipei", to: "tokyo", amount: 200 },
  { from: "taipei", to: "bangkok", amount: 150 },
  { from: "tokyo", to: "taipei", amount: 180 },
  { from: "tokyo", to: "hongkong", amount: 120 },
  { from: "bangkok", to: "taipei", amount: 250 },
  { from: "bangkok", to: "tokyo", amount: 100 },
  { from: "hongkong", to: "taipei", amount: 310 },
  { from: "hongkong", to: "bangkok", amount: 210 },
];

const TOTAL_BEFORE = BEFORE_FLOWS.reduce((sum, f) => sum + f.amount, 0); // 1,520
const TOTAL_AFTER = SUBSIDIARIES.reduce(
  (sum, s) => sum + Math.abs(s.netPosition),
  0
) / 2; // net settlement = 270 (half of sum of absolute net positions)
const SAVINGS_PCT = ((TOTAL_BEFORE - TOTAL_AFTER) / TOTAL_BEFORE * 100);

export default function NettingFlowDiagram() {
  const [view, setView] = useState<"before" | "after">("before");

  const getSubLabel = (sub: Subsidiary) => {
    if (sub.netPosition > 0) return `淨收 $${fmtNum(sub.netPosition)}K`;
    if (sub.netPosition < 0) return `淨付 $${fmtNum(Math.abs(sub.netPosition))}K`;
    return "淨額 $0";
  };

  const getPositionColor = (net: number) => {
    if (net > 0) return BRAND.story;
    if (net < 0) return BRAND.danger;
    return BRAND.neutral;
  };

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
        多邊淨額清算系統
      </h4>
      <p className="text-center text-xs text-gray-500 mb-5">
        珍途四個據點的跨境支付 — 淨額清算前後比較
      </p>

      {/* Toggle */}
      <div className="flex justify-center gap-2 mb-5">
        <button
          onClick={() => setView("before")}
          className="px-4 py-1.5 rounded-full text-xs font-medium transition-colors border"
          style={{
            borderColor: view === "before" ? BRAND.danger : "#d1d5db",
            backgroundColor: view === "before" ? BRAND.danger : "#fff",
            color: view === "before" ? "#fff" : "#6b7280",
          }}
        >
          清算前（8 筆支付）
        </button>
        <button
          onClick={() => setView("after")}
          className="px-4 py-1.5 rounded-full text-xs font-medium transition-colors border"
          style={{
            borderColor: view === "after" ? BRAND.story : "#d1d5db",
            backgroundColor: view === "after" ? BRAND.story : "#fff",
            color: view === "after" ? "#fff" : "#6b7280",
          }}
        >
          清算後（淨額結算）
        </button>
      </div>

      {/* Subsidiary Cards — always visible */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {SUBSIDIARIES.map((sub, i) => (
          <motion.div
            key={sub.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            className="p-3 rounded-xl border-2 text-center"
            style={{
              borderColor:
                view === "after"
                  ? getPositionColor(sub.netPosition)
                  : BRAND.primary,
              backgroundColor:
                view === "after"
                  ? `${getPositionColor(sub.netPosition)}10`
                  : `${BRAND.primary}08`,
            }}
          >
            <div className="text-xl mb-1">{sub.flag}</div>
            <div className="text-sm font-bold" style={{ color: BRAND.primary }}>
              {sub.name}
            </div>
            <AnimatePresence mode="wait">
              {view === "after" && (
                <motion.div
                  key="net"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-xs font-bold mt-1"
                  style={{ color: getPositionColor(sub.netPosition) }}
                >
                  {getSubLabel(sub)}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Flow Details */}
      <AnimatePresence mode="wait">
        {view === "before" ? (
          <motion.div
            key="before"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-1.5 mb-5"
          >
            <div className="text-xs font-bold text-gray-500 mb-2 text-center">
              8 筆跨境支付明細
            </div>
            {BEFORE_FLOWS.map((flow, i) => {
              const fromSub = SUBSIDIARIES.find((s) => s.id === flow.from)!;
              const toSub = SUBSIDIARIES.find((s) => s.id === flow.to)!;
              return (
                <motion.div
                  key={`${flow.from}-${flow.to}`}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="flex items-center gap-2 p-2 rounded-lg bg-white border shadow-sm"
                >
                  <span className="text-sm">{fromSub.flag}</span>
                  <span className="text-xs text-gray-600 w-14 text-right">
                    {fromSub.name}
                  </span>
                  <svg
                    width="20"
                    height="12"
                    viewBox="0 0 20 12"
                    fill="none"
                    className="flex-shrink-0"
                  >
                    <path
                      d="M0 6h16M12 2l4 4-4 4"
                      stroke={BRAND.danger}
                      strokeWidth="1.5"
                    />
                  </svg>
                  <span className="text-sm">{toSub.flag}</span>
                  <span className="text-xs text-gray-600 w-14">
                    {toSub.name}
                  </span>
                  <span
                    className="ml-auto text-sm font-bold"
                    style={{ color: BRAND.danger }}
                  >
                    ${fmtNum(flow.amount)}K
                  </span>
                </motion.div>
              );
            })}
            <div
              className="text-center text-sm font-bold pt-2"
              style={{ color: BRAND.danger }}
            >
              總支付金額：${fmtNum(TOTAL_BEFORE)}K（{BEFORE_FLOWS.length} 筆交易）
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="after"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-2 mb-5"
          >
            <div className="text-xs font-bold text-gray-500 mb-2 text-center">
              淨額結算 — 各據點淨部位
            </div>
            {SUBSIDIARIES.map((sub, i) => {
              const isReceiver = sub.netPosition > 0;
              const barWidth = Math.abs(sub.netPosition) / 270 * 100;
              const posColor = getPositionColor(sub.netPosition);
              return (
                <motion.div
                  key={sub.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="flex items-center gap-3 p-2.5 rounded-lg border bg-white shadow-sm"
                  style={{ borderColor: `${posColor}40` }}
                >
                  <span className="text-lg">{sub.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold" style={{ color: BRAND.primary }}>
                        {sub.name}
                      </span>
                      <span
                        className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                        style={{
                          backgroundColor: `${posColor}15`,
                          color: posColor,
                        }}
                      >
                        {isReceiver ? "淨收方" : "淨付方"}
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${barWidth}%` }}
                        transition={{ delay: 0.3 + 0.1 * i, duration: 0.5 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: posColor }}
                      />
                    </div>
                  </div>
                  <span className="font-bold text-sm" style={{ color: posColor }}>
                    {sub.netPosition > 0 ? "+" : ""}${fmtNum(sub.netPosition)}K
                  </span>
                </motion.div>
              );
            })}
            <div
              className="text-center text-sm font-bold pt-2"
              style={{ color: BRAND.story }}
            >
              淨結算金額：${fmtNum(TOTAL_AFTER)}K（僅需結算淨差額）
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Savings Summary */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mb-5"
      >
        <div className="text-xs text-gray-500 mb-2 text-center">交易量對比</div>
        <div className="relative h-8 rounded-full overflow-hidden bg-gray-100">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="absolute top-0 left-0 h-full flex items-center justify-center"
            style={{ backgroundColor: `${BRAND.danger}30` }}
          >
            <span className="text-xs font-medium text-gray-700">
              清算前 ${fmtNum(TOTAL_BEFORE)}K
            </span>
          </motion.div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(TOTAL_AFTER / TOTAL_BEFORE) * 100}%` }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="absolute top-0 left-0 h-full flex items-center justify-center rounded-full"
            style={{ backgroundColor: BRAND.story }}
          >
            <span className="text-xs font-medium text-white">
              清算後 ${fmtNum(TOTAL_AFTER)}K
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="p-3 rounded-lg text-center"
          style={{ backgroundColor: `${BRAND.danger}10` }}
        >
          <div className="text-xs text-gray-500 mb-1">清算前</div>
          <div className="font-bold text-sm" style={{ color: BRAND.danger }}>
            {BEFORE_FLOWS.length} 筆
          </div>
          <div className="text-xs text-gray-400 mt-0.5">${fmtNum(TOTAL_BEFORE)}K</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="p-3 rounded-lg text-center"
          style={{ backgroundColor: `${BRAND.story}10` }}
        >
          <div className="text-xs text-gray-500 mb-1">清算後</div>
          <div className="font-bold text-sm" style={{ color: BRAND.story }}>
            淨額結算
          </div>
          <div className="text-xs text-gray-400 mt-0.5">${fmtNum(TOTAL_AFTER)}K</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="p-3 rounded-lg text-center"
          style={{ backgroundColor: `${BRAND.accent}15` }}
        >
          <div className="text-xs text-gray-500 mb-1">節省比例</div>
          <div className="font-bold text-sm" style={{ color: BRAND.accent }}>
            {SAVINGS_PCT.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-400 mt-0.5">交易成本降低</div>
        </motion.div>
      </div>

      {/* Core Insight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="text-center text-sm p-3 rounded-lg mb-3"
        style={{ backgroundColor: `${BRAND.story}10`, color: "#374151" }}
      >
        <span className="font-bold" style={{ color: BRAND.story }}>
          多邊淨額清算效益：
        </span>{" "}
        將 {BEFORE_FLOWS.length} 筆跨境支付（${fmtNum(TOTAL_BEFORE)}K）簡化為淨額結算（${fmtNum(TOTAL_AFTER)}K），
        減少{" "}
        <span className="font-bold" style={{ color: BRAND.accent }}>
          {SAVINGS_PCT.toFixed(1)}%
        </span>{" "}
        的交易量，大幅降低匯兌成本與銀行手續費
      </motion.div>

      {/* Analogy */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="text-center text-sm p-3 rounded-lg"
        style={{ backgroundColor: `${BRAND.accent}15`, color: "#374151" }}
      >
        <span className="font-bold" style={{ color: BRAND.accent }}>
          實務要點：
        </span>{" "}
        多邊淨額清算需要設立「清算中心」（通常由財務中心或再發票中心擔任），
        定期（如每月）彙整所有子公司間的應收應付，計算淨部位後僅結算差額
      </motion.div>
    </motion.div>
  );
}

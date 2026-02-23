"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND } from "@/components/brand/BrandColors";

function fmtNum(n: number): string {
  return n.toLocaleString("zh-TW", { maximumFractionDigits: 0 });
}

function fmtPct(n: number): string {
  return (n * 100).toFixed(1) + "%";
}

interface Scenario {
  key: string;
  label: string;
  price: number; // $/kg transfer price
  color: string;
  badge: string | null; // warning badge text, null = compliant
  isCompliant: boolean;
}

const QUANTITY = 100_000; // kg shipped per year
const TW_TAX_RATE = 0.20;
const JP_TAX_RATE = 0.30;
const TW_COST_PER_KG = 4; // Taiwan production cost
const JP_SELLING_PRICE = 18; // Japan retail price per kg

const SCENARIOS: Scenario[] = [
  {
    key: "low",
    label: "低價策略",
    price: 6,
    color: BRAND.danger,
    badge: "稅務稽查風險",
    isCompliant: false,
  },
  {
    key: "arms",
    label: "常規交易價格",
    price: 10,
    color: BRAND.story,
    badge: null,
    isCompliant: true,
  },
  {
    key: "high",
    label: "高價策略",
    price: 15,
    color: BRAND.accent,
    badge: "子公司虧損風險",
    isCompliant: false,
  },
];

function calcScenario(price: number) {
  const twRevenue = price * QUANTITY;
  const twCost = TW_COST_PER_KG * QUANTITY;
  const twProfit = twRevenue - twCost;
  const twTax = twProfit * TW_TAX_RATE;

  const jpRevenue = JP_SELLING_PRICE * QUANTITY;
  const jpCost = price * QUANTITY;
  const jpProfit = jpRevenue - jpCost;
  const jpTax = Math.max(jpProfit * JP_TAX_RATE, 0); // no negative tax

  const groupTax = twTax + jpTax;
  const groupProfit = twProfit + jpProfit;
  const effectiveRate = groupProfit > 0 ? groupTax / groupProfit : 0;

  return {
    twRevenue,
    twCost,
    twProfit,
    twTax,
    jpRevenue,
    jpCost,
    jpProfit,
    jpTax,
    groupTax,
    groupProfit,
    effectiveRate,
  };
}

export default function TransferPricingScenarios() {
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  const results = SCENARIOS.map((s) => ({
    ...s,
    calc: calcScenario(s.price),
  }));

  // Find the arm's length result for comparison
  const armsResult = results.find((r) => r.key === "arms")!;

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
        移轉定價情境分析
      </h4>
      <p className="text-center text-xs text-gray-500 mb-1">
        珍途台灣總部出口原料至日本子公司 — 三種定價策略比較
      </p>
      <p className="text-center text-xs text-gray-400 mb-5">
        年出貨量 {fmtNum(QUANTITY)} kg｜台灣生產成本 ${TW_COST_PER_KG}/kg｜日本售價 ${JP_SELLING_PRICE}/kg
      </p>

      {/* Scenario Cards */}
      <div className="space-y-3 mb-5">
        {results.map((r, i) => {
          const isExpanded = expandedKey === r.key;
          const taxDiff = r.calc.groupTax - armsResult.calc.groupTax;

          return (
            <motion.div
              key={r.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 * i }}
            >
              <button
                onClick={() => setExpandedKey(isExpanded ? null : r.key)}
                className="w-full text-left"
              >
                <div
                  className="relative p-4 rounded-xl border-2 transition-all"
                  style={{
                    borderColor: isExpanded ? r.color : `${r.color}40`,
                    backgroundColor: isExpanded ? `${r.color}08` : "#fff",
                  }}
                >
                  {/* Header row */}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: r.color }}
                    >
                      ${r.price}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-sm font-bold"
                          style={{ color: r.color }}
                        >
                          {r.label}
                        </span>
                        {r.badge && (
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{
                              backgroundColor: `${BRAND.danger}15`,
                              color: BRAND.danger,
                            }}
                          >
                            {r.badge}
                          </span>
                        )}
                        {r.isCompliant && (
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{
                              backgroundColor: `${BRAND.story}15`,
                              color: BRAND.story,
                            }}
                          >
                            OECD 合規
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        移轉價格 ${r.price}/kg
                      </div>
                    </div>
                    {/* Group Tax */}
                    <div className="flex-shrink-0 text-right">
                      <div className="text-xs text-gray-500">集團稅負</div>
                      <div
                        className="font-bold text-sm"
                        style={{ color: r.color }}
                      >
                        ${fmtNum(r.calc.groupTax)}
                      </div>
                      <div className="text-xs text-gray-400">
                        有效稅率 {fmtPct(r.calc.effectiveRate)}
                      </div>
                    </div>
                    {/* Expand arrow */}
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      className="flex-shrink-0 text-gray-400"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="6,9 12,15 18,9" />
                      </svg>
                    </motion.div>
                  </div>

                  {/* Tax bar visualization */}
                  <div className="flex gap-1 h-3 rounded-full overflow-hidden bg-gray-100">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(r.calc.twTax / r.calc.groupProfit) * 100}%`,
                      }}
                      transition={{ delay: 0.3 + 0.1 * i, duration: 0.5 }}
                      className="h-full rounded-l-full"
                      style={{ backgroundColor: BRAND.primary }}
                      title={`台灣稅 $${fmtNum(r.calc.twTax)}`}
                    />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(r.calc.jpTax / r.calc.groupProfit) * 100}%`,
                      }}
                      transition={{ delay: 0.4 + 0.1 * i, duration: 0.5 }}
                      className="h-full rounded-r-full"
                      style={{ backgroundColor: BRAND.danger }}
                      title={`日本稅 $${fmtNum(r.calc.jpTax)}`}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>台灣稅 20%: ${fmtNum(r.calc.twTax)}</span>
                    <span>日本稅 30%: ${fmtNum(r.calc.jpTax)}</span>
                  </div>

                  {/* Tax difference from arm's length */}
                  {!r.isCompliant && (
                    <div className="mt-2 text-xs text-center">
                      <span style={{ color: taxDiff < 0 ? BRAND.story : BRAND.danger }}>
                        比常規交易{taxDiff < 0 ? "少繳" : "多繳"} ${fmtNum(Math.abs(taxDiff))} 稅
                        {taxDiff < 0 && " — 移轉利潤至低稅國"}
                      </span>
                    </div>
                  )}
                </div>
              </button>

              {/* Expanded Detail */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mx-2 mb-1 p-3 rounded-b-xl bg-gray-50 border border-t-0 border-gray-200">
                      {/* Two-column: Taiwan vs Japan */}
                      <div className="grid grid-cols-2 gap-3">
                        {/* Taiwan */}
                        <div
                          className="p-2.5 rounded-lg"
                          style={{ backgroundColor: `${BRAND.primary}08` }}
                        >
                          <div
                            className="text-xs font-bold mb-2"
                            style={{ color: BRAND.primary }}
                          >
                            台灣母公司（稅率 20%）
                          </div>
                          <div className="space-y-1 text-xs text-gray-600">
                            <div className="flex justify-between">
                              <span>營收</span>
                              <span>${fmtNum(r.calc.twRevenue)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>成本</span>
                              <span>-${fmtNum(r.calc.twCost)}</span>
                            </div>
                            <div className="flex justify-between border-t pt-1 font-bold">
                              <span>利潤</span>
                              <span>${fmtNum(r.calc.twProfit)}</span>
                            </div>
                            <div
                              className="flex justify-between font-bold"
                              style={{ color: BRAND.primary }}
                            >
                              <span>稅額</span>
                              <span>${fmtNum(r.calc.twTax)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Japan */}
                        <div
                          className="p-2.5 rounded-lg"
                          style={{ backgroundColor: `${BRAND.danger}08` }}
                        >
                          <div
                            className="text-xs font-bold mb-2"
                            style={{ color: BRAND.danger }}
                          >
                            日本子公司（稅率 30%）
                          </div>
                          <div className="space-y-1 text-xs text-gray-600">
                            <div className="flex justify-between">
                              <span>營收</span>
                              <span>${fmtNum(r.calc.jpRevenue)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>成本</span>
                              <span>-${fmtNum(r.calc.jpCost)}</span>
                            </div>
                            <div className="flex justify-between border-t pt-1 font-bold">
                              <span>利潤</span>
                              <span
                                style={{
                                  color: r.calc.jpProfit < 0 ? BRAND.danger : undefined,
                                }}
                              >
                                {r.calc.jpProfit < 0 ? "-" : ""}${fmtNum(Math.abs(r.calc.jpProfit))}
                              </span>
                            </div>
                            <div
                              className="flex justify-between font-bold"
                              style={{ color: BRAND.danger }}
                            >
                              <span>稅額</span>
                              <span>${fmtNum(r.calc.jpTax)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Warning for high price */}
                      {r.key === "high" && r.calc.jpProfit < 0 && (
                        <div
                          className="mt-2 p-2 rounded-lg text-xs text-center"
                          style={{
                            backgroundColor: `${BRAND.accent}15`,
                            color: BRAND.accent,
                          }}
                        >
                          高價策略使子公司虧損，此為教學示範極端情境
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Comparison Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-3 gap-2 mb-5"
      >
        {results.map((r) => (
          <div
            key={r.key}
            className="p-3 rounded-lg text-center border"
            style={{
              borderColor: r.isCompliant ? r.color : `${r.color}40`,
              backgroundColor: r.isCompliant ? `${r.color}10` : "#fff",
            }}
          >
            <div className="text-xs text-gray-500 mb-1">{r.label}</div>
            <div className="font-bold text-lg" style={{ color: r.color }}>
              {fmtPct(r.calc.effectiveRate)}
            </div>
            <div className="text-xs text-gray-400">有效稅率</div>
          </div>
        ))}
      </motion.div>

      {/* Key Insight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center text-sm p-3 rounded-lg mb-3"
        style={{ backgroundColor: `${BRAND.story}10`, color: "#374151" }}
      >
        <span className="font-bold" style={{ color: BRAND.story }}>
          OECD 常規交易原則：
        </span>{" "}
        移轉價格必須反映「獨立企業間在可比較條件下的交易價格」。
        低價策略雖可降低集團稅負，但面臨稅務稽查與罰款風險
      </motion.div>

      {/* Regulatory Warning */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="text-center text-sm p-3 rounded-lg"
        style={{ backgroundColor: `${BRAND.danger}10`, color: "#374151" }}
      >
        <span className="font-bold" style={{ color: BRAND.danger }}>
          合規要點：
        </span>{" "}
        各國稅務機關可依據 BEPS 行動計畫（特別是 Action 8-10）進行移轉定價調整。
        企業須備妥「主檔案」、「當地檔案」及「國別報告」三層文據
      </motion.div>
    </motion.div>
  );
}

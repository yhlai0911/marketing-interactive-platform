"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import { BRAND } from "@/components/brand/BrandColors";

function fmtNum(n: number): string {
  return n.toLocaleString("zh-TW", { maximumFractionDigits: 0 });
}

// === APV Components ===
// Base NPV (ku=10%, unlevered)
const YEARS = [0, 1, 2, 3, 4, 5];
const NCF_JPY = [-10000, 1800, 2500, 3000, 3000, 4200]; // 萬 JPY
const KU = 0.10; // unlevered cost of capital

// Loan subsidy
const LOAN_AMOUNT = 4000; // 萬 JPY (JFC subsidized loan)
const MARKET_RATE = 0.05; // market rate 5%
const SUBSIDY_RATE = 0.02; // JFC rate 2%

// Tax shield
const INTEREST_PAYMENT = LOAN_AMOUNT * SUBSIDY_RATE; // 80 萬/yr
const TAX_RATE = 0.25; // corporate tax rate 25%

interface APVComponent {
  key: string;
  label: string;
  value: number;
  color: string;
  icon: string;
  description: string;
  detail: string;
}

export default function APVBreakdownChart() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [showWaterfall, setShowWaterfall] = useState(true);

  const apvCalc = useMemo(() => {
    // Base NPV (ku=10%)
    const pvFactors = YEARS.map((t) => (t === 0 ? 1 : 1 / Math.pow(1 + KU, t)));
    const pvs = NCF_JPY.map((cf, i) => cf * pvFactors[i]);
    const totalPV = pvs.filter((_, i) => i > 0).reduce((a, b) => a + b, 0);
    const baseNPV = totalPV + pvs[0]; // totalPV + (-10000)

    // Loan subsidy: spread savings PV
    const annualSaving = (MARKET_RATE - SUBSIDY_RATE) * LOAN_AMOUNT; // 120 萬/yr
    // PVIFA(5%, 5yr) = sum of 1/(1.05)^t for t=1..5
    const pvifaMarket = Array.from({ length: 5 }, (_, i) => 1 / Math.pow(1 + MARKET_RATE, i + 1)).reduce((a, b) => a + b, 0);
    const loanSubsidy = annualSaving * pvifaMarket;

    // Tax shield: interest × tax rate, discounted at subsidy rate
    const annualShield = INTEREST_PAYMENT * TAX_RATE; // 20 萬/yr
    const pvifaSubsidy = Array.from({ length: 5 }, (_, i) => 1 / Math.pow(1 + SUBSIDY_RATE, i + 1)).reduce((a, b) => a + b, 0);
    const taxShield = annualShield * pvifaSubsidy;

    // Total APV
    const totalAPV = baseNPV + loanSubsidy + taxShield;

    // WACC-based NPV for comparison (k=8%)
    const waccFactors = YEARS.map((t) => (t === 0 ? 1 : 1 / Math.pow(1.08, t)));
    const waccPVs = NCF_JPY.map((cf, i) => cf * waccFactors[i]);
    const waccNPV = waccPVs.reduce((a, b) => a + b, 0);

    return {
      pvFactors,
      pvs,
      totalPV,
      baseNPV: Math.round(baseNPV),
      annualSaving,
      pvifaMarket,
      loanSubsidy: Math.round(loanSubsidy),
      annualShield,
      pvifaSubsidy,
      taxShield: Math.round(taxShield),
      totalAPV: Math.round(totalAPV),
      waccNPV: Math.round(waccNPV),
    };
  }, []);

  const components: APVComponent[] = [
    {
      key: "base",
      label: "Base NPV",
      value: apvCalc.baseNPV,
      color: BRAND.primary,
      icon: "1",
      description: "未槓桿折現率 ku=10%，比 WACC 8% 保守",
      detail: `以純股權成本 10% 折現未來現金流：PV = ${fmtNum(Math.round(apvCalc.totalPV))} 萬，減去初始投資 10,000 萬 = +${fmtNum(apvCalc.baseNPV)} 萬 JPY`,
    },
    {
      key: "loan",
      label: "優惠貸款利差",
      value: apvCalc.loanSubsidy,
      color: BRAND.accent,
      icon: "2",
      description: `JFC 優惠貸款 ${fmtNum(LOAN_AMOUNT)} 萬 at 2% vs 市場 5%，年省 ${fmtNum(apvCalc.annualSaving)} 萬`,
      detail: `每年節省利差 = (5%-2%) x ${fmtNum(LOAN_AMOUNT)} = ${fmtNum(apvCalc.annualSaving)} 萬 JPY/年，以市場利率 5% 折現 5 年 (PVIFA=${apvCalc.pvifaMarket.toFixed(3)}) = +${fmtNum(apvCalc.loanSubsidy)} 萬 JPY`,
    },
    {
      key: "tax",
      label: "利息稅盾",
      value: apvCalc.taxShield,
      color: BRAND.story,
      icon: "3",
      description: `利息 ${fmtNum(INTEREST_PAYMENT)} 萬/yr x ${TAX_RATE * 100}% 稅率 = ${fmtNum(apvCalc.annualShield)} 萬/yr 稅盾`,
      detail: `每年稅盾 = ${fmtNum(INTEREST_PAYMENT)} x 25% = ${fmtNum(apvCalc.annualShield)} 萬 JPY/年，以借款利率 2% 折現 5 年 (PVIFA=${apvCalc.pvifaSubsidy.toFixed(3)}) = +${fmtNum(apvCalc.taxShield)} 萬 JPY`,
    },
  ];

  // Waterfall chart data
  const waterfallData = useMemo(() => {
    let cumulative = 0;
    const data = components.map((c) => {
      const start = cumulative;
      cumulative += c.value;
      return {
        name: c.label,
        start,
        value: c.value,
        total: cumulative,
        color: c.color,
      };
    });
    // Add total bar
    data.push({
      name: "Total APV",
      start: 0,
      value: apvCalc.totalAPV,
      total: apvCalc.totalAPV,
      color: BRAND.primary,
    });
    return data;
  }, [apvCalc, components]);

  // Stacked chart data (simplified)
  const stackedData = [
    { name: "Base NPV", value: apvCalc.baseNPV, color: BRAND.primary },
    { name: "優惠貸款", value: apvCalc.loanSubsidy, color: BRAND.accent },
    { name: "稅盾", value: apvCalc.taxShield, color: BRAND.story },
    { name: "Total APV", value: apvCalc.totalAPV, color: `${BRAND.primary}` },
  ];

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
        APV 價值分解圖
      </h4>
      <p className="text-center text-xs text-gray-500 mb-5">
        調整現值法 — 拆解投資案的價值來源
      </p>

      {/* Chart Mode Toggle */}
      <div className="flex justify-center gap-2 mb-4">
        <button
          onClick={() => setShowWaterfall(true)}
          className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors border"
          style={{
            borderColor: showWaterfall ? BRAND.primary : "#d1d5db",
            backgroundColor: showWaterfall ? BRAND.primary : "#fff",
            color: showWaterfall ? "#fff" : "#6b7280",
          }}
        >
          瀑布圖
        </button>
        <button
          onClick={() => setShowWaterfall(false)}
          className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors border"
          style={{
            borderColor: !showWaterfall ? BRAND.primary : "#d1d5db",
            backgroundColor: !showWaterfall ? BRAND.primary : "#fff",
            color: !showWaterfall ? "#fff" : "#6b7280",
          }}
        >
          堆疊圖
        </button>
      </div>

      {/* Chart */}
      <AnimatePresence mode="wait">
        {showWaterfall ? (
          <motion.div
            key="waterfall"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-[260px] mb-5"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={waterfallData}
                margin={{ left: 10, right: 10, top: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={10} />
                <YAxis
                  tickFormatter={(v: number) => `${fmtNum(v)}`}
                  fontSize={10}
                  domain={[0, "auto"]}
                />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "start") return [null, null];
                    return [`+${fmtNum(Number(value))} 萬 JPY`, "金額"];
                  }}
                  labelFormatter={(label) => `${label}`}
                />
                <ReferenceLine y={0} stroke="#9ca3af" />
                {/* Invisible base bar */}
                <Bar dataKey="start" stackId="a" fill="transparent" />
                {/* Visible value bar */}
                <Bar dataKey="value" stackId="a" radius={[4, 4, 0, 0]} animationDuration={800}>
                  {waterfallData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        ) : (
          <motion.div
            key="stacked"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-[260px] mb-5"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stackedData}
                margin={{ left: 10, right: 10, top: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={10} />
                <YAxis
                  tickFormatter={(v: number) => `${fmtNum(v)}`}
                  fontSize={10}
                />
                <Tooltip
                  formatter={(value) => [
                    `+${fmtNum(Number(value))} 萬 JPY`,
                    "金額",
                  ]}
                />
                <ReferenceLine y={0} stroke="#9ca3af" />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} animationDuration={800}>
                  {stackedData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Total APV Display */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center p-4 rounded-xl mb-5"
        style={{ backgroundColor: `${BRAND.primary}10` }}
      >
        <div className="text-xs text-gray-500 mb-1">Total APV</div>
        <div className="text-3xl font-bold" style={{ color: BRAND.primary }}>
          +{fmtNum(apvCalc.totalAPV)} 萬 JPY
        </div>
        <div className="text-xs text-gray-500 mt-1">
          = {fmtNum(apvCalc.baseNPV)} + {fmtNum(apvCalc.loanSubsidy)} + {fmtNum(apvCalc.taxShield)}
        </div>
      </motion.div>

      {/* Expandable Info Cards */}
      <div className="space-y-2 mb-5">
        {components.map((comp, i) => {
          const isExpanded = expandedCard === comp.key;
          return (
            <motion.div
              key={comp.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
            >
              <button
                onClick={() =>
                  setExpandedCard(isExpanded ? null : comp.key)
                }
                className="w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left"
                style={{
                  borderColor: isExpanded ? comp.color : "#e5e7eb",
                  backgroundColor: isExpanded ? `${comp.color}08` : "#fff",
                }}
              >
                {/* Number Badge */}
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: comp.color }}
                >
                  {comp.icon}
                </div>
                {/* Label & Value */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold" style={{ color: comp.color }}>
                    {comp.label}
                  </div>
                  <div className="text-xs text-gray-500">{comp.description}</div>
                </div>
                {/* Value */}
                <div className="flex-shrink-0 text-right">
                  <div className="font-bold text-sm" style={{ color: comp.color }}>
                    +{fmtNum(comp.value)}
                  </div>
                  <div className="text-xs text-gray-400">萬 JPY</div>
                </div>
                {/* Expand Indicator */}
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  className="flex-shrink-0 text-gray-400"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6,9 12,15 18,9" />
                  </svg>
                </motion.div>
              </button>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="p-3 mx-3 mb-1 rounded-b-lg text-xs text-gray-600 leading-relaxed"
                      style={{ backgroundColor: `${comp.color}05` }}
                    >
                      {comp.detail}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* WACC vs APV Comparison */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="p-3 rounded-lg text-center border"
          style={{ backgroundColor: `${BRAND.accent}08` }}
        >
          <div className="text-xs text-gray-500 mb-1">WACC 法 (k=8%)</div>
          <div className="font-bold text-lg" style={{ color: BRAND.accent }}>
            +{fmtNum(apvCalc.waccNPV)} 萬
          </div>
          <div className="text-xs text-gray-400 mt-0.5">單一折現率</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="p-3 rounded-lg text-center border"
          style={{ backgroundColor: `${BRAND.primary}08` }}
        >
          <div className="text-xs text-gray-500 mb-1">APV 法</div>
          <div className="font-bold text-lg" style={{ color: BRAND.primary }}>
            +{fmtNum(apvCalc.totalAPV)} 萬
          </div>
          <div className="text-xs text-gray-400 mt-0.5">分離價值來源</div>
        </motion.div>
      </div>

      {/* Analogy */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="text-center text-sm p-3 rounded-lg mb-3"
        style={{ backgroundColor: `${BRAND.story}10`, color: "#374151" }}
      >
        <div className="font-bold mb-1" style={{ color: BRAND.story }}>
          WACC = 瑞士刀 / APV = 手術刀
        </div>
        <div className="text-xs text-gray-600">
          WACC 用一個折現率搞定一切（方便但不夠精細），APV 分別拆解每個價值來源（精確但需更多資訊）
        </div>
      </motion.div>

      {/* Key Insight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center text-sm p-3 rounded-lg"
        style={{ backgroundColor: `${BRAND.accent}15`, color: "#374151" }}
      >
        <span className="font-bold" style={{ color: BRAND.accent }}>
          APV 結論：
        </span>{" "}
        東京店總價值 +{fmtNum(apvCalc.totalAPV)} 萬中，基礎營運貢獻{" "}
        <span className="font-bold" style={{ color: BRAND.primary }}>
          {Math.round((apvCalc.baseNPV / apvCalc.totalAPV) * 100)}%
        </span>
        ，JFC 優惠貸款貢獻{" "}
        <span className="font-bold" style={{ color: BRAND.accent }}>
          {Math.round((apvCalc.loanSubsidy / apvCalc.totalAPV) * 100)}%
        </span>
        ，稅盾貢獻{" "}
        <span className="font-bold" style={{ color: BRAND.story }}>
          {Math.round((apvCalc.taxShield / apvCalc.totalAPV) * 100)}%
        </span>
      </motion.div>
    </motion.div>
  );
}

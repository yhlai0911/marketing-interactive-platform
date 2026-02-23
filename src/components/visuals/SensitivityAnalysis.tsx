"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
} from "recharts";
import { BRAND } from "@/components/brand/BrandColors";

function fmtNum(n: number, digits = 0): string {
  return n.toLocaleString("zh-TW", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}

// === Base parameters ===
const NCF_JPY = [1800, 2500, 3000, 3000, 4200]; // 萬 JPY, Year 1-5
const INITIAL_INVESTMENT = 10000; // 萬 JPY
const S0 = 0.232; // TWD/JPY spot
const INF_D = 0.02; // Taiwan inflation
const INF_F = 0.005; // Japan inflation
const BASE_KD = 0.095; // parent discount rate

// IFE expected exchange rates
function expectedRate(t: number): number {
  return S0 * Math.pow((1 + INF_D) / (1 + INF_F), t);
}

// Withholding tax presets
const TAX_PRESETS = [
  { label: "0%", value: 0 },
  { label: "10%", value: 10 },
  { label: "15%", value: 15 },
  { label: "20.42%", value: 20.42 },
];

export default function SensitivityAnalysis() {
  const [jpyChange, setJpyChange] = useState(0); // %
  const [withholdingRate, setWithholdingRate] = useState(10); // %
  const [discountAdj, setDiscountAdj] = useState(0); // +/- %

  // Calculate parent NPV for given parameters
  function calcParentNPV(delta: number, tau: number, kdAdj: number): number {
    const kd = BASE_KD + kdAdj / 100;
    const tauDec = tau / 100;
    // Initial investment converted at adjusted spot
    const initialTWD = INITIAL_INVESTMENT * S0 * (1 + delta / 100);
    // PV of future cash flows
    let pvSum = 0;
    for (let t = 1; t <= 5; t++) {
      const eSt = expectedRate(t) * (1 + delta / 100);
      const ncfTWD = NCF_JPY[t - 1] * (1 - tauDec) * eSt;
      const df = 1 / Math.pow(1 + kd, t);
      pvSum += ncfTWD * df;
    }
    return pvSum - initialTWD;
  }

  // Current scenario NPV
  const currentNPV = useMemo(() => {
    return calcParentNPV(jpyChange, withholdingRate, discountAdj);
  }, [jpyChange, withholdingRate, discountAdj]);

  // Chart data: NPV vs JPY change (-20% to +20%)
  const chartData = useMemo(() => {
    const points: { jpyChange: number; label: string; npv: number; positive: number; negative: number }[] = [];
    for (let d = -20; d <= 20; d += 1) {
      const npv = calcParentNPV(d, withholdingRate, discountAdj);
      points.push({
        jpyChange: d,
        label: `${d}%`,
        npv: Math.round(npv),
        positive: npv >= 0 ? Math.round(npv) : 0,
        negative: npv < 0 ? Math.round(npv) : 0,
      });
    }
    return points;
  }, [withholdingRate, discountAdj]);

  // Find break-even point (binary search)
  const breakEven = useMemo(() => {
    let lo = -20;
    let hi = 20;
    for (let iter = 0; iter < 50; iter++) {
      const mid = (lo + hi) / 2;
      const npv = calcParentNPV(mid, withholdingRate, discountAdj);
      if (npv > 0) {
        lo = mid;
      } else {
        hi = mid;
      }
    }
    return (lo + hi) / 2;
  }, [withholdingRate, discountAdj]);

  // Color based on NPV
  function npvColor(npv: number): string {
    if (npv > 100) return BRAND.story;
    if (npv > 0) return BRAND.accent;
    return BRAND.danger;
  }

  const currentColor = npvColor(currentNPV);

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
        敏感度分析
      </h4>
      <p className="text-center text-xs text-gray-500 mb-5">
        匯率變動如何影響母公司 NPV？
      </p>

      {/* Main NPV Display */}
      <motion.div
        key={`${jpyChange}-${withholdingRate}-${discountAdj}`}
        initial={{ scale: 0.98 }}
        animate={{ scale: 1 }}
        className="text-center p-5 rounded-xl mb-5 transition-colors duration-300"
        style={{ backgroundColor: `${currentColor}10` }}
      >
        <div className="text-xs text-gray-500 mb-1">
          母公司 NPV（含 {withholdingRate}% 扣繳稅）
        </div>
        <motion.div
          key={Math.round(currentNPV)}
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          className="text-4xl font-bold"
          style={{ color: currentColor }}
        >
          {currentNPV >= 0 ? "+" : ""}
          {fmtNum(Math.round(currentNPV))} 萬 TWD
        </motion.div>
        <div className="text-xs text-gray-500 mt-1">
          {currentNPV > 100
            ? "投資可行"
            : currentNPV > 0
              ? "勉強可行，風險偏高"
              : "投資不可行"}
        </div>
      </motion.div>

      {/* JPY Change Slider */}
      <div className="mb-4 px-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-gray-600">日圓變動幅度</label>
          <span
            className="text-sm font-bold"
            style={{
              color: jpyChange > 0 ? BRAND.story : jpyChange < 0 ? BRAND.danger : BRAND.neutral,
            }}
          >
            {jpyChange > 0 ? "+" : ""}
            {jpyChange}%
            {jpyChange > 0 ? "（日圓升值）" : jpyChange < 0 ? "（日圓貶值）" : "（基準情境）"}
          </span>
        </div>
        <input
          type="range"
          min={-20}
          max={20}
          step={0.5}
          value={jpyChange}
          onChange={(e) => setJpyChange(parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>日圓貶值 20%</span>
          <span className="text-center">0%</span>
          <span>日圓升值 20%</span>
        </div>
      </div>

      {/* Secondary Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 px-4">
        {/* Withholding Tax Buttons */}
        <div>
          <div className="text-xs text-gray-500 mb-2">扣繳稅率</div>
          <div className="flex flex-wrap gap-1.5">
            {TAX_PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => setWithholdingRate(preset.value)}
                className="px-2.5 py-1 rounded-full text-xs font-medium transition-colors border"
                style={{
                  borderColor:
                    withholdingRate === preset.value
                      ? BRAND.danger
                      : "#d1d5db",
                  backgroundColor:
                    withholdingRate === preset.value
                      ? BRAND.danger
                      : "#fff",
                  color:
                    withholdingRate === preset.value
                      ? "#fff"
                      : "#6b7280",
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Discount Rate Adjustment */}
        <div>
          <div className="text-xs text-gray-500 mb-2">
            折現率調整（基準 {(BASE_KD * 100).toFixed(1)}%）
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDiscountAdj(Math.max(discountAdj - 0.5, -2))}
              className="w-7 h-7 rounded-full border flex items-center justify-center text-sm hover:bg-gray-50"
            >
              -
            </button>
            <span
              className="text-sm font-bold min-w-[60px] text-center"
              style={{ color: BRAND.primary }}
            >
              {(BASE_KD * 100 + discountAdj).toFixed(1)}%
            </span>
            <button
              onClick={() => setDiscountAdj(Math.min(discountAdj + 0.5, 2))}
              className="w-7 h-7 rounded-full border flex items-center justify-center text-sm hover:bg-gray-50"
            >
              +
            </button>
            {discountAdj !== 0 && (
              <span className="text-xs text-gray-400">
                ({discountAdj > 0 ? "+" : ""}{discountAdj}%)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Line Chart */}
      <div className="w-full h-[260px] mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ left: 10, right: 10, top: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="label"
              fontSize={10}
              interval={3}
            />
            <YAxis
              tickFormatter={(v: number) => `${fmtNum(v)}`}
              fontSize={10}
            />
            <Tooltip
              formatter={(value) => [
                `${Number(value) >= 0 ? "+" : ""}${fmtNum(Number(value))} 萬 TWD`,
                "母公司 NPV",
              ]}
              labelFormatter={(label) => `日圓變動 ${label}`}
            />
            {/* Zero reference line */}
            <ReferenceLine
              y={0}
              stroke={BRAND.danger}
              strokeWidth={2}
              strokeDasharray="6 3"
              label={{
                value: "NPV = 0",
                position: "insideTopRight",
                fontSize: 10,
                fill: BRAND.danger,
              }}
            />
            {/* Break-even reference line */}
            <ReferenceLine
              x={`${Math.round(breakEven)}%`}
              stroke={BRAND.accent}
              strokeDasharray="4 4"
              label={{
                value: `Break-even ${breakEven.toFixed(1)}%`,
                position: "insideTop",
                fontSize: 9,
                fill: BRAND.accent,
              }}
            />
            {/* Current position reference */}
            <ReferenceLine
              x={`${Math.round(jpyChange)}%`}
              stroke={currentColor}
              strokeWidth={2}
            />
            {/* Positive area */}
            <Area
              type="monotone"
              dataKey="positive"
              fill={`${BRAND.story}20`}
              stroke="none"
            />
            {/* Negative area */}
            <Area
              type="monotone"
              dataKey="negative"
              fill={`${BRAND.danger}20`}
              stroke="none"
            />
            {/* NPV line */}
            <Line
              type="monotone"
              dataKey="npv"
              stroke={BRAND.primary}
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 5,
                fill: BRAND.primary,
                stroke: "#fff",
                strokeWidth: 2,
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-3 rounded-lg text-center"
          style={{ backgroundColor: `${BRAND.accent}10` }}
        >
          <div className="text-xs text-gray-500 mb-1">損益平衡點</div>
          <div className="font-bold text-sm" style={{ color: BRAND.accent }}>
            {breakEven >= 0 ? "" : "+"}
            {(-breakEven).toFixed(1)}% 貶值
          </div>
          <div className="text-xs text-gray-400 mt-0.5">NPV 歸零</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-3 rounded-lg text-center"
          style={{ backgroundColor: `${BRAND.story}10` }}
        >
          <div className="text-xs text-gray-500 mb-1">最佳情境 (+20%)</div>
          <div className="font-bold text-sm" style={{ color: BRAND.story }}>
            +{fmtNum(Math.round(calcParentNPV(20, withholdingRate, discountAdj)))}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">萬 TWD</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-3 rounded-lg text-center"
          style={{ backgroundColor: `${BRAND.danger}10` }}
        >
          <div className="text-xs text-gray-500 mb-1">最差情境 (-20%)</div>
          <div className="font-bold text-sm" style={{ color: BRAND.danger }}>
            {fmtNum(Math.round(calcParentNPV(-20, withholdingRate, discountAdj)))}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">萬 TWD</div>
        </motion.div>
      </div>

      {/* Dynamic Insight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-sm p-3 rounded-lg mb-3"
        style={{ backgroundColor: `${BRAND.danger}10`, color: "#374151" }}
      >
        <span className="font-bold" style={{ color: BRAND.danger }}>
          風險警示：
        </span>{" "}
        在 {withholdingRate}% 扣繳稅下，日圓只要貶值超過{" "}
        <span className="font-bold" style={{ color: BRAND.danger }}>
          {Math.abs(breakEven).toFixed(1)}%
        </span>
        ，母公司 NPV 就翻負 — 匯率風險不可忽視
      </motion.div>

      {/* Core Insight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center text-sm p-3 rounded-lg"
        style={{ backgroundColor: `${BRAND.accent}15`, color: "#374151" }}
      >
        <span className="font-bold" style={{ color: BRAND.accent }}>
          核心洞察：
        </span>{" "}
        國際資本預算的最大變數是匯率 — 子公司賺錢不等於母公司賺錢。
        敏感度分析幫助決策者量化「安全邊際」有多薄
      </motion.div>
    </motion.div>
  );
}

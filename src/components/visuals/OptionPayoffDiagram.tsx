"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { BRAND } from "@/components/brand/BrandColors";

// === Parameters ===
const NOTIONAL = 5000; // 萬 JPY
const S0 = 0.232; // TWD/JPY spot
const F = 0.2337; // Forward rate
const K = 0.23; // Strike price (put option)
const C = 0.004; // Option premium per JPY
const PREMIUM_TOTAL = NOTIONAL * C; // 20 萬 TWD

// Range for chart
const ST_MIN = 0.19;
const ST_MAX = 0.26;
const ST_STEP = 0.001;

function fmtNum(n: number, digits = 0): string {
  return n.toLocaleString("zh-TW", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}

function fmtRate(n: number): string {
  return n.toFixed(4);
}

// Calculate effective income for each strategy
function calcUnhedged(st: number): number {
  return NOTIONAL * st;
}

function calcForward(): number {
  return NOTIONAL * F;
}

function calcOption(st: number): number {
  if (st < K) {
    return NOTIONAL * (K - C);
  }
  return NOTIONAL * (st - C);
}

type LineToggle = {
  unhedged: boolean;
  forward: boolean;
  option: boolean;
};

export default function OptionPayoffDiagram() {
  const [lineToggle, setLineToggle] = useState<LineToggle>({
    unhedged: true,
    forward: true,
    option: true,
  });
  const [showPremiumZone, setShowPremiumZone] = useState(false);

  // Generate chart data
  const chartData = useMemo(() => {
    const points: {
      st: number;
      stLabel: string;
      unhedged: number;
      forward: number;
      option: number;
      protectionArea: number | null;
      premiumGap: number | null;
    }[] = [];

    for (let st = ST_MIN; st <= ST_MAX + 0.0001; st += ST_STEP) {
      const stRound = Math.round(st * 10000) / 10000;
      const unhedged = calcUnhedged(stRound);
      const forward = calcForward();
      const option = calcOption(stRound);

      // Protection area: where option > unhedged (when st < K)
      const protectionArea = stRound < K ? option - unhedged : null;

      // Premium gap: the cost of premium for st >= K
      const premiumGap = stRound >= K ? unhedged - option : null;

      points.push({
        st: stRound,
        stLabel: fmtRate(stRound),
        unhedged: Math.round(unhedged),
        forward: Math.round(forward),
        option: Math.round(option),
        protectionArea: protectionArea !== null ? Math.round(protectionArea) : null,
        premiumGap: premiumGap !== null ? Math.round(premiumGap) : null,
      });
    }
    return points;
  }, []);

  function toggleLine(key: keyof LineToggle) {
    setLineToggle((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const lineConfigs = [
    {
      key: "unhedged" as const,
      label: "未避險",
      color: BRAND.danger,
      dash: "0",
    },
    {
      key: "forward" as const,
      label: "遠期合約",
      color: BRAND.primary,
      dash: "6 3",
    },
    {
      key: "option" as const,
      label: "外匯選擇權",
      color: BRAND.story,
      dash: "0",
    },
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
        選擇權損益圖
      </h4>
      <p className="text-center text-xs text-gray-500 mb-4">
        Option Payoff Diagram -- JPY Put Option 保護效果
      </p>

      {/* Line Toggles */}
      <div className="flex justify-center flex-wrap gap-2 mb-3">
        {lineConfigs.map((cfg) => (
          <button
            key={cfg.key}
            onClick={() => toggleLine(cfg.key)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all border"
            style={{
              backgroundColor: lineToggle[cfg.key] ? cfg.color : "#fff",
              color: lineToggle[cfg.key] ? "#fff" : cfg.color,
              borderColor: cfg.color,
              opacity: lineToggle[cfg.key] ? 1 : 0.5,
            }}
          >
            {cfg.label}
          </button>
        ))}
        <button
          onClick={() => setShowPremiumZone(!showPremiumZone)}
          className="px-3 py-1.5 rounded-full text-xs font-medium transition-all border"
          style={{
            backgroundColor: showPremiumZone ? BRAND.accent : "#fff",
            color: showPremiumZone ? "#fff" : BRAND.accent,
            borderColor: BRAND.accent,
          }}
        >
          保費成本區
        </button>
      </div>

      {/* Main Chart */}
      <div className="w-full h-[320px] mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ left: 15, right: 15, top: 15, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="st"
              type="number"
              domain={[ST_MIN, ST_MAX]}
              tickFormatter={(v: number) => fmtRate(v)}
              fontSize={9}
              label={{
                value: "市場匯率 S_T (TWD/JPY)",
                position: "insideBottom",
                offset: -2,
                fontSize: 10,
                fill: BRAND.neutral,
              }}
            />
            <YAxis
              tickFormatter={(v: number) => `${fmtNum(v)}`}
              fontSize={9}
              label={{
                value: "收入（萬 TWD）",
                angle: -90,
                position: "insideLeft",
                offset: 5,
                fontSize: 10,
                fill: BRAND.neutral,
              }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0]?.payload;
                if (!d) return null;
                const exercised = d.st < K;
                return (
                  <div className="bg-white shadow-lg rounded-lg p-3 border text-xs">
                    <div className="font-bold mb-1" style={{ color: BRAND.primary }}>
                      S<sub>T</sub> = {fmtRate(d.st)}
                    </div>
                    {lineToggle.unhedged && (
                      <div style={{ color: BRAND.danger }}>
                        未避險：{fmtNum(d.unhedged)} 萬
                      </div>
                    )}
                    {lineToggle.forward && (
                      <div style={{ color: BRAND.primary }}>
                        遠期合約：{fmtNum(d.forward)} 萬
                      </div>
                    )}
                    {lineToggle.option && (
                      <div style={{ color: BRAND.story }}>
                        選擇權：{fmtNum(d.option)} 萬
                        <span className="text-gray-400 ml-1">
                          ({exercised ? "行使" : "不行使"})
                        </span>
                      </div>
                    )}
                  </div>
                );
              }}
            />

            {/* Strike price reference line */}
            <ReferenceLine
              x={K}
              stroke={BRAND.accent}
              strokeDasharray="6 3"
              strokeWidth={1.5}
              label={{
                value: `K = ${K}`,
                position: "insideTopRight",
                fontSize: 9,
                fill: BRAND.accent,
              }}
            />

            {/* Current spot reference */}
            <ReferenceLine
              x={S0}
              stroke={BRAND.neutral}
              strokeDasharray="3 3"
              label={{
                value: `S₀ = ${S0}`,
                position: "insideTopLeft",
                fontSize: 9,
                fill: BRAND.neutral,
              }}
            />

            {/* Protection area (option > unhedged when st < K) */}
            {lineToggle.option && lineToggle.unhedged && (
              <Area
                type="monotone"
                dataKey="protectionArea"
                fill={`${BRAND.story}25`}
                stroke="none"
                connectNulls={false}
              />
            )}

            {/* Premium cost zone */}
            {showPremiumZone && lineToggle.option && lineToggle.unhedged && (
              <Area
                type="monotone"
                dataKey="premiumGap"
                fill={`${BRAND.accent}20`}
                stroke="none"
                connectNulls={false}
              />
            )}

            {/* Unhedged line */}
            {lineToggle.unhedged && (
              <Line
                type="monotone"
                dataKey="unhedged"
                stroke={BRAND.danger}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: BRAND.danger, stroke: "#fff", strokeWidth: 2 }}
              />
            )}

            {/* Forward line */}
            {lineToggle.forward && (
              <Line
                type="monotone"
                dataKey="forward"
                stroke={BRAND.primary}
                strokeWidth={2}
                strokeDasharray="6 3"
                dot={false}
                activeDot={{ r: 4, fill: BRAND.primary, stroke: "#fff", strokeWidth: 2 }}
              />
            )}

            {/* Option line */}
            {lineToggle.option && (
              <Line
                type="monotone"
                dataKey="option"
                stroke={BRAND.story}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4, fill: BRAND.story, stroke: "#fff", strokeWidth: 2 }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Zone Labels */}
      <div className="flex justify-center gap-6 mb-5">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center px-4 py-2 rounded-lg"
          style={{ backgroundColor: `${BRAND.story}10` }}
        >
          <div className="text-xs font-bold" style={{ color: BRAND.story }}>
            行使區（S<sub>T</sub> &lt; K）
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            Put 保護生效，收入鎖定 {fmtNum(Math.round(NOTIONAL * (K - C)))} 萬
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center px-4 py-2 rounded-lg"
          style={{ backgroundColor: `${BRAND.accent}10` }}
        >
          <div className="text-xs font-bold" style={{ color: BRAND.accent }}>
            不行使區（S<sub>T</sub> &ge; K）
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            享受升值收益，僅損失保費 {fmtNum(PREMIUM_TOTAL)} 萬
          </div>
        </motion.div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {/* Put Option Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-3 rounded-lg border"
          style={{ borderColor: BRAND.story, backgroundColor: `${BRAND.story}08` }}
        >
          <div className="text-xs font-bold mb-2" style={{ color: BRAND.story }}>
            Put Option 規格
          </div>
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>履約價 K</span>
              <span className="font-bold">{K}</span>
            </div>
            <div className="flex justify-between">
              <span>權利金 c</span>
              <span className="font-bold">{C} /JPY</span>
            </div>
            <div className="flex justify-between">
              <span>總保費</span>
              <span className="font-bold" style={{ color: BRAND.accent }}>
                {fmtNum(PREMIUM_TOTAL)} 萬 TWD
              </span>
            </div>
            <div className="flex justify-between">
              <span>名目金額</span>
              <span className="font-bold">{fmtNum(NOTIONAL)} 萬 JPY</span>
            </div>
          </div>
        </motion.div>

        {/* Insurance Analogy */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-3 rounded-lg border"
          style={{ borderColor: BRAND.accent, backgroundColor: `${BRAND.accent}08` }}
        >
          <div className="text-xs font-bold mb-2" style={{ color: BRAND.accent }}>
            保險類比
          </div>
          <div className="space-y-1.5 text-xs text-gray-600">
            <div className="flex items-start gap-1.5">
              <span className="font-bold" style={{ color: BRAND.accent }}>保費</span>
              <span>= {fmtNum(PREMIUM_TOTAL)} 萬 TWD</span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="font-bold" style={{ color: BRAND.accent }}>保底匯率</span>
              <span>= K - c = {(K - C).toFixed(3)}</span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="font-bold" style={{ color: BRAND.accent }}>最低收入</span>
              <span>= {fmtNum(Math.round(NOTIONAL * (K - C)))} 萬 TWD</span>
            </div>
          </div>
        </motion.div>

        {/* Key Insight */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="p-3 rounded-lg border"
          style={{ borderColor: BRAND.primary, backgroundColor: `${BRAND.primary}08` }}
        >
          <div className="text-xs font-bold mb-2" style={{ color: BRAND.primary }}>
            選擇權 vs 遠期
          </div>
          <div className="space-y-1.5 text-xs text-gray-600">
            <div>
              <span className="font-bold" style={{ color: BRAND.story }}>選擇權</span>
              ：下方保護 + 上方保留
            </div>
            <div>
              <span className="font-bold" style={{ color: BRAND.primary }}>遠期</span>
              ：雙向鎖定，零成本
            </div>
            <div className="pt-1 border-t border-gray-200">
              <span className="font-bold" style={{ color: BRAND.danger }}>代價</span>
              ：保費 = 保險的價格
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Insight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center text-sm p-3 rounded-lg"
        style={{ backgroundColor: `${BRAND.accent}15`, color: "#374151" }}
      >
        <span className="font-bold" style={{ color: BRAND.accent }}>
          核心公式：
        </span>{" "}
        下方保護 + 上方保留 ={" "}
        <span className="font-bold" style={{ color: BRAND.danger }}>
          付保費的代價
        </span>
        。選擇權就是匯率的「保險」，保費越便宜不一定越好 — 要看保底匯率是否足夠。
      </motion.div>
    </motion.div>
  );
}

"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { BRAND } from "@/components/brand/BrandColors";

function fmtNum(n: number, digits = 1): string {
  return n.toLocaleString("zh-TW", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}

// === Parameters ===
const NOTIONAL = 5000; // 萬 JPY
const S0 = 0.232; // TWD/JPY spot
const F = 0.2337; // Forward rate
const K = 0.23; // Strike price (put option)
const C = 0.004; // Option premium per JPY
const EXPECTED_TWD = NOTIONAL * S0; // 1,160 萬 TWD

type Strategy = {
  id: string;
  label: string;
  shortLabel: string;
  color: string;
  calc: (st: number) => number;
};

const STRATEGIES: Strategy[] = [
  {
    id: "A",
    label: "A. 不避險",
    shortLabel: "不避險",
    color: BRAND.danger,
    calc: (st) => NOTIONAL * st,
  },
  {
    id: "B",
    label: "B. 50% 遠期",
    shortLabel: "50%遠期",
    color: BRAND.accent,
    calc: (st) => 2500 * F + 2500 * st,
  },
  {
    id: "C",
    label: "C. 100% 遠期",
    shortLabel: "100%遠期",
    color: BRAND.primary,
    calc: () => NOTIONAL * F,
  },
  {
    id: "D",
    label: "D. 100% 選擇權",
    shortLabel: "選擇權",
    color: BRAND.story,
    calc: (st) => {
      if (st < K) {
        // Exercise put: sell at K, minus premium
        return NOTIONAL * (K - C);
      }
      // Don't exercise: sell at market, minus premium
      return NOTIONAL * (st - C);
    },
  },
];

const PRESET_SCENARIOS = [
  { label: "日圓貶值 10%", pct: -10 },
  { label: "日圓升值 1.5%", pct: 1.5 },
];

function calcST(pctChange: number): number {
  return S0 * (1 + pctChange / 100);
}

function calcHE(actualIncome: number, unhedgedIncome: number): number | null {
  const denominator = Math.abs(unhedgedIncome - EXPECTED_TWD);
  if (denominator < 0.01) return null; // undefined when unhedged ≈ expected
  return 1 - Math.abs(actualIncome - EXPECTED_TWD) / denominator;
}

export default function FourStrategyComparison() {
  const [activePreset, setActivePreset] = useState(0);
  const [customPct, setCustomPct] = useState(-10);
  const [useCustom, setUseCustom] = useState(false);

  const currentPct = useCustom ? customPct : PRESET_SCENARIOS[activePreset].pct;
  const st = calcST(currentPct);

  const results = useMemo(() => {
    return STRATEGIES.map((s) => {
      const income = s.calc(st);
      const diff = income - EXPECTED_TWD;
      const unhedged = STRATEGIES[0].calc(st);
      const he = s.id === "A" ? null : calcHE(income, unhedged);
      return { ...s, income, diff, he };
    });
  }, [st]);

  const bestIdx = useMemo(() => {
    let maxIncome = -Infinity;
    let idx = 0;
    results.forEach((r, i) => {
      if (r.income > maxIncome) {
        maxIncome = r.income;
        idx = i;
      }
    });
    return idx;
  }, [results]);

  const worstIdx = useMemo(() => {
    let minIncome = Infinity;
    let idx = 0;
    results.forEach((r, i) => {
      if (r.income < minIncome) {
        minIncome = r.income;
        idx = i;
      }
    });
    return idx;
  }, [results]);

  const chartData = useMemo(() => {
    return results.map((r) => ({
      name: r.shortLabel,
      income: Math.round(r.income * 10) / 10,
      fill: r.color,
    }));
  }, [results]);

  const scenarioLabel = useCustom
    ? `自訂：${currentPct > 0 ? "+" : ""}${currentPct}%`
    : PRESET_SCENARIOS[activePreset].label;

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
        四策略損益比較
      </h4>
      <p className="text-center text-xs text-gray-500 mb-4">
        Four-Strategy Comparison — 不同避險策略的收入比較
      </p>

      {/* Scenario Toggle */}
      <div className="flex flex-wrap justify-center gap-2 mb-3">
        {PRESET_SCENARIOS.map((s, i) => (
          <button
            key={s.label}
            onClick={() => {
              setActivePreset(i);
              setUseCustom(false);
            }}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all border"
            style={{
              backgroundColor:
                !useCustom && activePreset === i ? BRAND.primary : "#fff",
              color:
                !useCustom && activePreset === i ? "#fff" : BRAND.primary,
              borderColor: BRAND.primary,
            }}
          >
            {s.label}
          </button>
        ))}
        <button
          onClick={() => setUseCustom(true)}
          className="px-3 py-1.5 rounded-full text-xs font-medium transition-all border"
          style={{
            backgroundColor: useCustom ? BRAND.accent : "#fff",
            color: useCustom ? "#fff" : BRAND.accent,
            borderColor: BRAND.accent,
          }}
        >
          自訂滑桿
        </button>
      </div>

      {/* Custom Slider */}
      {useCustom && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="px-4 pb-3"
        >
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium" style={{ color: BRAND.primary }}>
              JPY 變動幅度
            </label>
            <span
              className="text-xs font-bold"
              style={{
                color:
                  customPct > 0
                    ? BRAND.story
                    : customPct < 0
                    ? BRAND.danger
                    : BRAND.neutral,
              }}
            >
              {customPct > 0 ? "+" : ""}
              {customPct}% (S
              <sub>T</sub> = {st.toFixed(4)})
            </span>
          </div>
          <input
            type="range"
            min={-15}
            max={10}
            step={0.5}
            value={customPct}
            onChange={(e) => setCustomPct(parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>貶值 15%</span>
            <span>0%</span>
            <span>升值 10%</span>
          </div>
        </motion.div>
      )}

      {/* Scenario Info */}
      <div
        className="text-center text-xs mb-3 py-1.5 rounded-full mx-8"
        style={{ backgroundColor: `${BRAND.primary}08`, color: BRAND.primary }}
      >
        情境：{scenarioLabel} | S<sub>T</sub> = {st.toFixed(4)} TWD/JPY | 預期收入 ={" "}
        {fmtNum(EXPECTED_TWD)} 萬 TWD
      </div>

      {/* Result Table */}
      <div className="overflow-x-auto mb-4">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th
                className="px-3 py-2 text-left text-xs font-bold border-b-2"
                style={{ borderColor: BRAND.primary, color: BRAND.primary }}
              >
                策略
              </th>
              <th
                className="px-3 py-2 text-center text-xs font-bold border-b-2"
                style={{ borderColor: BRAND.primary, color: BRAND.primary }}
              >
                收入（萬 TWD）
              </th>
              <th
                className="px-3 py-2 text-center text-xs font-bold border-b-2"
                style={{ borderColor: BRAND.primary, color: BRAND.primary }}
              >
                vs 預期
              </th>
              <th
                className="px-3 py-2 text-center text-xs font-bold border-b-2"
                style={{ borderColor: BRAND.primary, color: BRAND.primary }}
              >
                HE
              </th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, idx) => {
              const isBest = idx === bestIdx;
              const isWorst = idx === worstIdx && bestIdx !== worstIdx;
              const rowBg = isBest
                ? `${BRAND.story}10`
                : isWorst
                ? `${BRAND.danger}10`
                : "transparent";

              return (
                <tr
                  key={r.id}
                  className="border-b border-gray-100"
                  style={{ backgroundColor: rowBg }}
                >
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block"
                        style={{ backgroundColor: r.color }}
                      />
                      <span
                        className="text-sm font-medium"
                        style={{ color: r.color }}
                      >
                        {r.label}
                      </span>
                      {isBest && (
                        <span
                          className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                          style={{
                            backgroundColor: `${BRAND.story}20`,
                            color: BRAND.story,
                          }}
                        >
                          最佳
                        </span>
                      )}
                      {isWorst && (
                        <span
                          className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                          style={{
                            backgroundColor: `${BRAND.danger}20`,
                            color: BRAND.danger,
                          }}
                        >
                          最差
                        </span>
                      )}
                    </div>
                  </td>
                  <td
                    className="px-3 py-2.5 text-center font-bold text-sm"
                    style={{ color: r.color }}
                  >
                    {fmtNum(r.income)}
                  </td>
                  <td className="px-3 py-2.5 text-center text-sm font-medium">
                    <span
                      style={{
                        color:
                          r.diff >= 0 ? BRAND.story : BRAND.danger,
                      }}
                    >
                      {r.diff >= 0 ? "+" : ""}
                      {fmtNum(r.diff)}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-center text-sm">
                    {r.he !== null ? (
                      <span
                        className="font-medium"
                        style={{
                          color: r.he >= 0.5 ? BRAND.story : BRAND.accent,
                        }}
                      >
                        {(r.he * 100).toFixed(1)}%
                      </span>
                    ) : (
                      <span className="text-gray-400">--</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-5"
      >
        <div
          className="text-sm font-bold text-center mb-2"
          style={{ color: BRAND.primary }}
        >
          收入比較圖
        </div>
        <div className="w-full h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ left: 10, right: 10, top: 10, bottom: 5 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis
                type="number"
                domain={[
                  (dataMin: number) => Math.floor(Math.min(dataMin, EXPECTED_TWD) - 30),
                  (dataMax: number) => Math.ceil(Math.max(dataMax, EXPECTED_TWD) + 30),
                ]}
                tickFormatter={(v: number) => `${fmtNum(v, 0)}`}
                fontSize={10}
              />
              <YAxis
                type="category"
                dataKey="name"
                fontSize={11}
                width={70}
              />
              <Tooltip
                formatter={(value) => [
                  `${fmtNum(Number(value))} 萬 TWD`,
                  "收入",
                ]}
              />
              <ReferenceLine
                x={EXPECTED_TWD}
                stroke={BRAND.neutral}
                strokeDasharray="4 4"
                label={{
                  value: `預期 ${fmtNum(EXPECTED_TWD, 0)}`,
                  position: "insideTopRight",
                  fontSize: 9,
                  fill: BRAND.neutral,
                }}
              />
              <Bar
                dataKey="income"
                radius={[0, 4, 4, 0]}
                barSize={32}
                shape={
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  ((props: any) => {
                    const { x, y, width, height, index } = props;
                    return (
                      <rect
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        rx={4}
                        fill={chartData[index]?.fill ?? BRAND.neutral}
                      />
                    );
                  }) as never
                }
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* HE Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-3 gap-3 mb-4"
      >
        {results.slice(1).map((r) => (
          <div
            key={r.id}
            className="p-3 rounded-lg text-center"
            style={{ backgroundColor: `${r.color}10` }}
          >
            <div className="text-xs text-gray-500 mb-1">{r.shortLabel}</div>
            <div className="font-bold text-lg" style={{ color: r.color }}>
              {r.he !== null ? `${(r.he * 100).toFixed(1)}%` : "--"}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">避險效果 HE</div>
          </div>
        ))}
      </motion.div>

      {/* HE Formula */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-xs p-2 rounded-lg mb-4"
        style={{ backgroundColor: `${BRAND.neutral}10`, color: BRAND.neutral }}
      >
        HE = 1 - |實際收入 - 預期收入| / |不避險收入 - 預期收入|
        （HE 越接近 1，避險效果越好）
      </motion.div>

      {/* Core Insight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-center text-sm p-3 rounded-lg"
        style={{ backgroundColor: `${BRAND.accent}15`, color: "#374151" }}
      >
        <span className="font-bold" style={{ color: BRAND.accent }}>
          核心洞察：
        </span>{" "}
        {currentPct < 0 ? (
          <>
            日圓貶值時，
            <span className="font-bold" style={{ color: BRAND.primary }}>
              100% 遠期
            </span>
            保護最完整；
            <span className="font-bold" style={{ color: BRAND.story }}>
              選擇權
            </span>
            也能有效止損。不避險損失最大。
          </>
        ) : (
          <>
            日圓升值時，
            <span className="font-bold" style={{ color: BRAND.danger }}>
              不避險反而收入最高
            </span>
            ；但
            <span className="font-bold" style={{ color: BRAND.primary }}>
              100% 遠期
            </span>
            因鎖定匯率而錯失升值利益。選擇權在此情境下不行使，保留了上方空間。
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

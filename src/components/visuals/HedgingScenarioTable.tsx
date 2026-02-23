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
  ReferenceLine,
} from "recharts";
import { BRAND } from "@/components/brand/BrandColors";

function fmtNum(n: number, digits = 0): string {
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

// Preset scenarios
const PRESETS = [
  { label: "日圓升值 +5%", pct: 5 },
  { label: "匯率不變 0%", pct: 0 },
  { label: "日圓貶值 -10%", pct: -10 },
];

function calcST(pctChange: number): number {
  return S0 * (1 + pctChange / 100);
}

function calcUnhedged(st: number): number {
  return NOTIONAL * st;
}

function calcForward(): number {
  return NOTIONAL * F;
}

function calcOption(st: number): number {
  if (st < K) {
    // Exercise put: sell at K, minus premium
    return NOTIONAL * (K - C);
  }
  // Don't exercise: sell at market, minus premium
  return NOTIONAL * (st - C);
}

type ViewMode = "absolute" | "gainloss";
type SelectedCell = { row: number; col: number } | null;

export default function HedgingScenarioTable() {
  const [viewMode, setViewMode] = useState<ViewMode>("absolute");
  const [customPct, setCustomPct] = useState(0);
  const [selectedCell, setSelectedCell] = useState<SelectedCell>(null);

  // Just the 3 presets for the main table
  const presetScenarios = useMemo(() => {
    return PRESETS.map((p) => {
      const st = calcST(p.pct);
      const unhedged = calcUnhedged(st);
      const forward = calcForward();
      const option = calcOption(st);
      return { ...p, st, unhedged, forward, option };
    });
  }, []);

  // Custom scenario
  const customScenario = useMemo(() => {
    const st = calcST(customPct);
    return {
      pct: customPct,
      st,
      unhedged: calcUnhedged(st),
      forward: calcForward(),
      option: calcOption(st),
    };
  }, [customPct]);

  // Worst case for bar chart
  const worstCases = useMemo(() => {
    const allScenarios = [...presetScenarios, customScenario];
    return [
      {
        name: "未避險",
        value: Math.min(...allScenarios.map((s) => s.unhedged)),
        fill: BRAND.danger,
      },
      {
        name: "遠期合約",
        value: calcForward(),
        fill: BRAND.primary,
      },
      {
        name: "外匯選擇權",
        value: Math.min(...allScenarios.map((s) => s.option)),
        fill: BRAND.story,
      },
    ];
  }, [presetScenarios, customScenario]);

  // Cell value formatting
  function cellValue(raw: number, base: number): string {
    if (viewMode === "gainloss") {
      const diff = raw - base;
      const prefix = diff >= 0 ? "+" : "";
      return `${prefix}${fmtNum(Math.round(diff))}`;
    }
    return fmtNum(Math.round(raw));
  }

  // Cell color
  function cellColor(raw: number, rowValues: number[]): string {
    const max = Math.max(...rowValues);
    const min = Math.min(...rowValues);
    if (raw === max && max !== min) return BRAND.story;
    if (raw === min && max !== min) return BRAND.danger;
    return BRAND.primary;
  }

  // Cell background
  function cellBg(
    rowIdx: number,
    colIdx: number,
    raw: number,
    rowValues: number[]
  ): string {
    const isSelected =
      selectedCell &&
      (selectedCell.row === rowIdx || selectedCell.col === colIdx);
    const max = Math.max(...rowValues);
    const min = Math.min(...rowValues);

    if (isSelected) return `${BRAND.accent}20`;
    if (raw === max && max !== min) return `${BRAND.story}10`;
    if (raw === min && max !== min) return `${BRAND.danger}10`;
    return "transparent";
  }

  // Detail explanation for selected cell
  function cellExplanation(rowIdx: number, colIdx: number): string | null {
    if (!selectedCell || selectedCell.row !== rowIdx || selectedCell.col !== colIdx)
      return null;
    const s = presetScenarios[rowIdx];
    if (!s) return null;

    const st4 = s.st.toFixed(4);
    if (colIdx === 0) {
      return `未避險收入 = ${NOTIONAL} 萬 x ${st4} = ${fmtNum(Math.round(s.unhedged))} 萬 TWD`;
    }
    if (colIdx === 1) {
      return `遠期鎖定 = ${NOTIONAL} 萬 x ${F} = ${fmtNum(Math.round(s.forward))} 萬 TWD`;
    }
    if (colIdx === 2) {
      if (s.st < K) {
        return `行使 Put：${NOTIONAL} 萬 x (${K} - ${C}) = ${fmtNum(Math.round(s.option))} 萬 TWD`;
      }
      return `不行使：${NOTIONAL} 萬 x (${st4} - ${C}) = ${fmtNum(Math.round(s.option))} 萬 TWD`;
    }
    return null;
  }

  const strategies = ["未避險", "遠期合約", "外匯選擇權"];
  const stratColors = [BRAND.danger, BRAND.primary, BRAND.story];

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
        避險策略情境比較表
      </h4>
      <p className="text-center text-xs text-gray-500 mb-4">
        Hedging Scenario Comparison -- 不同匯率情境下的收入比較
      </p>

      {/* View Toggle */}
      <div className="flex justify-center gap-2 mb-4">
        <button
          onClick={() => setViewMode("absolute")}
          className="px-3 py-1.5 rounded-full text-xs font-medium transition-all border"
          style={{
            backgroundColor: viewMode === "absolute" ? BRAND.primary : "#fff",
            color: viewMode === "absolute" ? "#fff" : BRAND.primary,
            borderColor: BRAND.primary,
          }}
        >
          絕對金額（萬 TWD）
        </button>
        <button
          onClick={() => setViewMode("gainloss")}
          className="px-3 py-1.5 rounded-full text-xs font-medium transition-all border"
          style={{
            backgroundColor: viewMode === "gainloss" ? BRAND.accent : "#fff",
            color: viewMode === "gainloss" ? "#fff" : BRAND.accent,
            borderColor: BRAND.accent,
          }}
        >
          損益比較（vs 未避險）
        </button>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto mb-4">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th
                className="px-3 py-2 text-left text-xs font-bold border-b-2"
                style={{ borderColor: BRAND.primary, color: BRAND.primary }}
              >
                情境
              </th>
              <th
                className="px-2 py-2 text-center text-xs border-b-2"
                style={{ borderColor: BRAND.primary, color: BRAND.neutral }}
              >
                S<sub>T</sub>
              </th>
              {strategies.map((s, i) => (
                <th
                  key={s}
                  className="px-3 py-2 text-center text-xs font-bold border-b-2"
                  style={{ borderColor: BRAND.primary, color: stratColors[i] }}
                >
                  {s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {presetScenarios.map((s, rowIdx) => {
              const rowValues = [s.unhedged, s.forward, s.option];
              return (
                <tr key={s.pct} className="border-b border-gray-100">
                  <td className="px-3 py-2.5 text-xs font-medium" style={{ color: BRAND.primary }}>
                    {s.label}
                  </td>
                  <td className="px-2 py-2.5 text-center text-xs text-gray-400">
                    {s.st.toFixed(4)}
                  </td>
                  {rowValues.map((val, colIdx) => (
                    <td
                      key={colIdx}
                      className="px-3 py-2.5 text-center cursor-pointer transition-colors relative"
                      style={{
                        backgroundColor: cellBg(rowIdx, colIdx, val, rowValues),
                        color: cellColor(val, rowValues),
                      }}
                      onClick={() =>
                        setSelectedCell(
                          selectedCell?.row === rowIdx && selectedCell?.col === colIdx
                            ? null
                            : { row: rowIdx, col: colIdx }
                        )
                      }
                    >
                      <span className="font-bold text-sm">
                        {viewMode === "gainloss"
                          ? cellValue(val, rowValues[0])
                          : fmtNum(Math.round(val))}
                      </span>
                      <AnimatePresence>
                        {cellExplanation(rowIdx, colIdx) && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="absolute left-1/2 -translate-x-1/2 top-full mt-1 z-10 bg-white shadow-lg rounded-lg p-2 text-xs text-gray-600 whitespace-nowrap border"
                            style={{ borderColor: BRAND.accent }}
                          >
                            {cellExplanation(rowIdx, colIdx)}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  ))}
                </tr>
              );
            })}

            {/* Worst case row */}
            <tr
              className="border-t-2"
              style={{ borderColor: BRAND.primary }}
            >
              <td
                className="px-3 py-2 text-xs font-bold"
                style={{ color: BRAND.danger }}
              >
                最差情境
              </td>
              <td className="px-2 py-2 text-center text-xs text-gray-400">--</td>
              <td
                className="px-3 py-2 text-center font-bold text-sm"
                style={{ color: BRAND.danger, backgroundColor: `${BRAND.danger}10` }}
              >
                {fmtNum(Math.round(Math.min(...presetScenarios.map((s) => s.unhedged))))}
              </td>
              <td
                className="px-3 py-2 text-center font-bold text-sm"
                style={{ color: BRAND.primary, backgroundColor: `${BRAND.primary}10` }}
              >
                {fmtNum(Math.round(calcForward()))}
              </td>
              <td
                className="px-3 py-2 text-center font-bold text-sm"
                style={{ color: BRAND.story, backgroundColor: `${BRAND.story}10` }}
              >
                {fmtNum(Math.round(Math.min(...presetScenarios.map((s) => s.option))))}
              </td>
            </tr>

            {/* Cost row */}
            <tr className="border-t border-gray-200">
              <td className="px-3 py-2 text-xs font-medium text-gray-500">
                避險成本
              </td>
              <td className="px-2 py-2 text-center text-xs text-gray-400">--</td>
              <td className="px-3 py-2 text-center text-xs text-gray-400">0</td>
              <td className="px-3 py-2 text-center text-xs text-gray-400">0</td>
              <td className="px-3 py-2 text-center text-xs font-medium" style={{ color: BRAND.accent }}>
                {fmtNum(NOTIONAL * C)} 萬
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Custom Scenario Slider */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="p-4 rounded-lg border mb-5"
        style={{ backgroundColor: `${BRAND.primary}05` }}
      >
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium" style={{ color: BRAND.primary }}>
            自訂情境：日圓變動
          </label>
          <span
            className="text-sm font-bold"
            style={{
              color: customPct > 0 ? BRAND.story : customPct < 0 ? BRAND.danger : BRAND.neutral,
            }}
          >
            {customPct > 0 ? "+" : ""}
            {customPct}%（S<sub>T</sub> = {calcST(customPct).toFixed(4)}）
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

        {/* Custom scenario result */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          {[
            { label: "未避險", value: customScenario.unhedged, color: BRAND.danger },
            { label: "遠期合約", value: customScenario.forward, color: BRAND.primary },
            { label: "選擇權", value: customScenario.option, color: BRAND.story },
          ].map((item) => (
            <motion.div
              key={item.label}
              className="text-center p-2 rounded-lg"
              style={{ backgroundColor: `${item.color}10` }}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
            >
              <div className="text-xs text-gray-500">{item.label}</div>
              <motion.div
                key={`${item.label}-${customPct}`}
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
                className="font-bold text-sm"
                style={{ color: item.color }}
              >
                {fmtNum(Math.round(item.value))}
              </motion.div>
              <div className="text-xs text-gray-400">萬 TWD</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Worst Case Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-5"
      >
        <div className="text-sm font-bold text-center mb-2" style={{ color: BRAND.primary }}>
          最差情境收入比較
        </div>
        <div className="w-full h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={worstCases}
              margin={{ left: 10, right: 10, top: 10, bottom: 5 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis
                type="number"
                domain={[900, 1300]}
                tickFormatter={(v: number) => `${fmtNum(v)}`}
                fontSize={10}
              />
              <YAxis
                type="category"
                dataKey="name"
                fontSize={11}
                width={80}
              />
              <Tooltip
                formatter={(value) => [`${fmtNum(Number(value))} 萬 TWD`, "最差情境收入"]}
              />
              <ReferenceLine
                x={calcForward()}
                stroke={BRAND.accent}
                strokeDasharray="4 4"
                label={{
                  value: `遠期鎖定 ${fmtNum(Math.round(calcForward()))}`,
                  position: "insideTopRight",
                  fontSize: 9,
                  fill: BRAND.accent,
                }}
              />
              <Bar
                dataKey="value"
                radius={[0, 4, 4, 0]}
                barSize={28}
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
                        fill={worstCases[index]?.fill ?? BRAND.neutral}
                      />
                    );
                  }) as never
                }
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Key Insight Cards */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-3 rounded-lg text-center"
          style={{ backgroundColor: `${BRAND.danger}10` }}
        >
          <div className="text-xs text-gray-500 mb-1">未避險風險</div>
          <div className="font-bold text-sm" style={{ color: BRAND.danger }}>
            {fmtNum(Math.round(Math.max(...presetScenarios.map((s) => s.unhedged)) - Math.min(...presetScenarios.map((s) => s.unhedged))))} 萬
          </div>
          <div className="text-xs text-gray-400 mt-0.5">收入波動幅度</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-3 rounded-lg text-center"
          style={{ backgroundColor: `${BRAND.primary}10` }}
        >
          <div className="text-xs text-gray-500 mb-1">遠期合約</div>
          <div className="font-bold text-sm" style={{ color: BRAND.primary }}>
            0 萬
          </div>
          <div className="text-xs text-gray-400 mt-0.5">波動完全消除</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="p-3 rounded-lg text-center"
          style={{ backgroundColor: `${BRAND.story}10` }}
        >
          <div className="text-xs text-gray-500 mb-1">選擇權保費</div>
          <div className="font-bold text-sm" style={{ color: BRAND.story }}>
            {fmtNum(NOTIONAL * C)} 萬 TWD
          </div>
          <div className="text-xs text-gray-400 mt-0.5">換取下方保護</div>
        </motion.div>
      </div>

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
        遠期合約{" "}
        <span className="font-bold" style={{ color: BRAND.primary }}>
          鎖定確定性
        </span>
        ，選擇權{" "}
        <span className="font-bold" style={{ color: BRAND.story }}>
          保留上方空間
        </span>
        ，未避險則{" "}
        <span className="font-bold" style={{ color: BRAND.danger }}>
          完全暴露
        </span>
        。沒有完美策略，只有最適合的策略。
      </motion.div>
    </motion.div>
  );
}

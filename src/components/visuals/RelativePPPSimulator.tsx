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
} from "recharts";
import { BRAND } from "@/components/brand/BrandColors";

interface Preset {
  label: string;
  piD: number; // domestic (Taiwan) inflation
  piF: number; // foreign (Japan) inflation
  s0: number;  // initial exchange rate TWD/JPY
  currency: string;
}

const PRESETS: Preset[] = [
  { label: "台灣 vs 日本", piD: 2.5, piF: 0.5, s0: 0.232, currency: "JPY" },
  { label: "台灣 vs 美國", piD: 2.5, piF: 3.5, s0: 32.50, currency: "USD" },
  { label: "台灣 vs 泰國", piD: 2.5, piF: 5.0, s0: 0.91, currency: "THB" },
];

const YEARS = 10;

export default function RelativePPPSimulator() {
  const [presetIdx, setPresetIdx] = useState(0);
  const [piD, setPiD] = useState(PRESETS[0].piD);
  const [piF, setPiF] = useState(PRESETS[0].piF);
  const [s0, setS0] = useState(PRESETS[0].s0);
  const [currency, setCurrency] = useState(PRESETS[0].currency);

  function applyPreset(idx: number) {
    setPresetIdx(idx);
    setPiD(PRESETS[idx].piD);
    setPiF(PRESETS[idx].piF);
    setS0(PRESETS[idx].s0);
    setCurrency(PRESETS[idx].currency);
  }

  const simulation = useMemo(() => {
    const points = [];
    for (let y = 0; y <= YEARS; y++) {
      // Exact formula: S_t = S_0 × ((1 + πd)/(1 + πf))^t
      const ratio = Math.pow((1 + piD / 100) / (1 + piF / 100), y);
      const st = s0 * ratio;
      const cumChange = (ratio - 1) * 100;
      points.push({
        year: y,
        rate: parseFloat(st.toFixed(6)),
        cumChange: parseFloat(cumChange.toFixed(2)),
      });
    }
    return points;
  }, [piD, piF, s0]);

  const annualApprox = piD - piF;
  const finalRate = simulation[YEARS].rate;
  const totalChange = simulation[YEARS].cumChange;

  // Determine significant digits for display
  const rateDigits = s0 < 1 ? 4 : 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <h4
        className="text-center font-bold text-lg mb-1"
        style={{ color: BRAND.primary }}
      >
        相對 PPP 模擬器
      </h4>
      <p className="text-center text-xs text-gray-500 mb-5">
        通膨差異如何影響匯率走勢？
      </p>

      {/* Preset 按鈕 */}
      <div className="flex justify-center gap-2 mb-4 flex-wrap">
        {PRESETS.map((p, i) => (
          <button
            key={p.label}
            onClick={() => applyPreset(i)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors border"
            style={{
              borderColor: presetIdx === i ? BRAND.primary : "#d1d5db",
              backgroundColor: presetIdx === i ? BRAND.primary : "#fff",
              color: presetIdx === i ? "#fff" : "#6b7280",
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* 輸入面板 */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="p-3 rounded-lg border text-center">
          <label className="text-xs text-gray-500 block mb-1">台灣通膨 (π_d)</label>
          <div className="flex items-center justify-center gap-1">
            <input
              type="number"
              value={piD}
              onChange={(e) => setPiD(parseFloat(e.target.value) || 0)}
              className="w-16 px-2 py-1 border rounded text-sm text-center"
              step={0.5}
              min={0}
              max={30}
            />
            <span className="text-sm text-gray-500">%</span>
          </div>
        </div>
        <div className="p-3 rounded-lg border text-center">
          <label className="text-xs text-gray-500 block mb-1">外國通膨 (π_f)</label>
          <div className="flex items-center justify-center gap-1">
            <input
              type="number"
              value={piF}
              onChange={(e) => setPiF(parseFloat(e.target.value) || 0)}
              className="w-16 px-2 py-1 border rounded text-sm text-center"
              step={0.5}
              min={0}
              max={30}
            />
            <span className="text-sm text-gray-500">%</span>
          </div>
        </div>
        <div className="p-3 rounded-lg border text-center">
          <label className="text-xs text-gray-500 block mb-1">初始匯率 S₀</label>
          <div className="flex items-center justify-center gap-1">
            <input
              type="number"
              value={s0}
              onChange={(e) => setS0(parseFloat(e.target.value) || 0.001)}
              className="w-20 px-2 py-1 border rounded text-sm text-center"
              step={s0 < 1 ? 0.001 : 0.1}
              min={0.0001}
            />
          </div>
          <div className="text-xs text-gray-400 mt-0.5">TWD/{currency}</div>
        </div>
      </div>

      {/* 公式提示 */}
      <div
        className="text-center text-xs p-2 rounded mb-4"
        style={{ backgroundColor: `${BRAND.story}10`, color: BRAND.story }}
      >
        近似式：匯率年變動 ≈ π_d - π_f = {piD}% - {piF}% ={" "}
        <span className="font-bold">{annualApprox > 0 ? "+" : ""}{annualApprox.toFixed(1)}%</span>
        {" "}→ 預期 TWD 對 {currency}{" "}
        <span className="font-bold">
          {annualApprox > 0 ? "貶值" : annualApprox < 0 ? "升值" : "不變"}
        </span>
      </div>

      {/* 折線圖 */}
      <div className="w-full h-[220px] mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={simulation} margin={{ left: 10, right: 20, top: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              fontSize={11}
              label={{ value: "年", position: "insideBottomRight", offset: -5, fontSize: 11 }}
            />
            <YAxis
              fontSize={11}
              tickFormatter={(v: number) => v.toFixed(rateDigits)}
              domain={["auto", "auto"]}
              label={{ value: `TWD/${currency}`, angle: -90, position: "insideLeft", fontSize: 10 }}
            />
            <Tooltip
              formatter={(value) => [`${Number(value).toFixed(rateDigits)} TWD/${currency}`, "匯率"]}
              labelFormatter={(label) => `第 ${label} 年`}
            />
            <ReferenceLine y={s0} stroke="#9ca3af" strokeDasharray="5 5" />
            <Line
              type="monotone"
              dataKey="rate"
              stroke={BRAND.primary}
              strokeWidth={2.5}
              dot={{ fill: BRAND.primary, r: 3 }}
              activeDot={{ r: 5, fill: BRAND.accent }}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 結果卡片 */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-3 rounded-lg text-center"
          style={{ backgroundColor: `${BRAND.primary}08` }}
        >
          <div className="text-xs text-gray-500 mb-1">1 年後</div>
          <div className="font-bold text-sm" style={{ color: BRAND.primary }}>
            {simulation[1].rate.toFixed(rateDigits)}
          </div>
          <div className="text-xs text-gray-500">
            {simulation[1].cumChange > 0 ? "+" : ""}{simulation[1].cumChange}%
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-3 rounded-lg text-center"
          style={{ backgroundColor: `${BRAND.accent}10` }}
        >
          <div className="text-xs text-gray-500 mb-1">5 年後</div>
          <div className="font-bold text-sm" style={{ color: BRAND.accent }}>
            {simulation[5].rate.toFixed(rateDigits)}
          </div>
          <div className="text-xs text-gray-500">
            {simulation[5].cumChange > 0 ? "+" : ""}{simulation[5].cumChange}%
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="p-3 rounded-lg text-center"
          style={{ backgroundColor: `${BRAND.danger}10` }}
        >
          <div className="text-xs text-gray-500 mb-1">10 年後</div>
          <div className="font-bold text-sm" style={{ color: BRAND.danger }}>
            {finalRate.toFixed(rateDigits)}
          </div>
          <div className="text-xs text-gray-500">
            {totalChange > 0 ? "+" : ""}{totalChange}%
          </div>
        </motion.div>
      </div>

      {/* 洞察提示 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center text-sm p-3 rounded-lg"
        style={{ backgroundColor: `${BRAND.accent}15`, color: "#374151" }}
      >
        <span className="font-bold" style={{ color: BRAND.accent }}>
          複利效果：
        </span>{" "}
        年通膨差 {Math.abs(annualApprox).toFixed(1)}% 看似微小，
        {YEARS} 年累積卻達{" "}
        <span className="font-bold" style={{ color: BRAND.danger }}>
          {Math.abs(totalChange).toFixed(1)}%
        </span>
        {" "}— 這就是長期匯率趨勢的推動力
      </motion.div>
    </motion.div>
  );
}

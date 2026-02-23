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
  Cell,
  ReferenceLine,
} from "recharts";
import { BRAND } from "@/components/brand/BrandColors";

function fmtInt(n: number): string {
  return n.toLocaleString("zh-TW", { maximumFractionDigits: 0 });
}

const PRINCIPAL_JPY = 100_000_000; // 1 億 JPY
const RATE_JPY = 0.5; // Japan rate %
const RATE_TWD = 2.0; // Taiwan rate %
const S0 = 0.232; // initial TWD/JPY

interface Scenario {
  name: string;
  appreciation: number; // JPY appreciation %
}

const PRESET_SCENARIOS: Scenario[] = [
  { name: "A: 日圓不變", appreciation: 0 },
  { name: "B: 日圓升值 5%", appreciation: 5 },
  { name: "C: 日圓升值 10%", appreciation: 10 },
];

export default function CarryTradeSimulator() {
  const [appreciation, setAppreciation] = useState(5);
  const [showPresets, setShowPresets] = useState(true);

  // Calculate carry trade outcome for a given JPY appreciation
  function calcOutcome(jpyAppreciation: number) {
    // Borrow JPY, convert to TWD, invest in TWD
    const twdInvested = PRINCIPAL_JPY * S0; // TWD received from converting JPY
    const twdMaturity = twdInvested * (1 + RATE_TWD / 100); // TWD after 1 year
    // Repay JPY loan
    const jpyRepay = PRINCIPAL_JPY * (1 + RATE_JPY / 100);
    // End-of-year spot rate: JPY appreciates → S1 > S0 (more TWD per JPY)
    const S1 = S0 * (1 + jpyAppreciation / 100);
    // Cost of buying back JPY
    const twdCostRepay = jpyRepay * S1;
    // Profit
    const profit = twdMaturity - twdCostRepay;
    return { S1, twdMaturity, twdCostRepay, profit, jpyRepay };
  }

  // Chart data: preset scenarios
  const presetData = useMemo(() => {
    return PRESET_SCENARIOS.map((s) => {
      const result = calcOutcome(s.appreciation);
      return {
        name: s.name,
        profit: Math.round(result.profit),
      };
    });
  }, []);

  // Slider scenario
  const sliderResult = useMemo(() => {
    return calcOutcome(appreciation);
  }, [appreciation]);

  // Dynamic chart: show outcomes from -2% to 15% appreciation
  const dynamicData = useMemo(() => {
    const points = [];
    for (let a = -2; a <= 15; a += 1) {
      const result = calcOutcome(a);
      points.push({
        appreciation: a,
        name: `${a}%`,
        profit: Math.round(result.profit),
      });
    }
    return points;
  }, []);

  // Find break-even point (where profit = 0)
  const breakEven = useMemo(() => {
    // profit = twdMaturity - jpyRepay * S1
    // 0 = twdMaturity - jpyRepay * S0 * (1 + x/100)
    // x = ((twdMaturity / (jpyRepay * S0)) - 1) * 100
    const twdInvested = PRINCIPAL_JPY * S0;
    const twdMaturity = twdInvested * (1 + RATE_TWD / 100);
    const jpyRepay = PRINCIPAL_JPY * (1 + RATE_JPY / 100);
    return ((twdMaturity / (jpyRepay * S0)) - 1) * 100;
  }, []);

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
        利差交易（Carry Trade）模擬器
      </h4>
      <p className="text-center text-xs text-gray-500 mb-5">
        借低利日圓、投資台幣 — 匯率變動如何逆轉利潤？
      </p>

      {/* 交易設定摘要 */}
      <div className="grid grid-cols-4 gap-2 mb-5">
        {[
          { label: "借入", value: `${fmtInt(PRINCIPAL_JPY)} JPY`, sub: `利率 ${RATE_JPY}%` },
          { label: "換成台幣", value: `${fmtInt(Math.round(PRINCIPAL_JPY * S0))} TWD`, sub: `S = ${S0}` },
          { label: "台灣存款", value: `利率 ${RATE_TWD}%`, sub: "1 年期" },
          { label: "到期還款", value: `${fmtInt(Math.round(PRINCIPAL_JPY * (1 + RATE_JPY / 100)))} JPY`, sub: "本金 + 利息" },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-2 rounded-lg text-center border"
            style={{ backgroundColor: `${BRAND.primary}05` }}
          >
            <div className="text-xs text-gray-500">{item.label}</div>
            <div className="text-xs font-bold" style={{ color: BRAND.primary }}>
              {item.value}
            </div>
            <div className="text-xs text-gray-400">{item.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* 預設情境對比 vs 動態滑桿 切換 */}
      <div className="flex justify-center gap-2 mb-4">
        <button
          onClick={() => setShowPresets(true)}
          className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors border"
          style={{
            borderColor: showPresets ? BRAND.primary : "#d1d5db",
            backgroundColor: showPresets ? BRAND.primary : "#fff",
            color: showPresets ? "#fff" : "#6b7280",
          }}
        >
          三大情境
        </button>
        <button
          onClick={() => setShowPresets(false)}
          className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors border"
          style={{
            borderColor: !showPresets ? BRAND.primary : "#d1d5db",
            backgroundColor: !showPresets ? BRAND.primary : "#fff",
            color: !showPresets ? "#fff" : "#6b7280",
          }}
        >
          動態滑桿
        </button>
      </div>

      {showPresets ? (
        <>
          {/* 三大預設情境長條圖 */}
          <div className="w-full h-[220px] mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={presetData} margin={{ left: 20, right: 20, top: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={11} />
                <YAxis
                  tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`}
                  fontSize={11}
                />
                <Tooltip
                  formatter={(value) => [
                    `${Number(value) >= 0 ? "+" : ""}${fmtInt(Number(value))} TWD`,
                    "損益",
                  ]}
                />
                <ReferenceLine y={0} stroke="#9ca3af" strokeDasharray="3 3" />
                <Bar dataKey="profit" radius={[4, 4, 0, 0]} animationDuration={600}>
                  {presetData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={entry.profit >= 0 ? BRAND.story : BRAND.danger}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 情境卡片 */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {PRESET_SCENARIOS.map((s, i) => {
              const result = calcOutcome(s.appreciation);
              const isProfit = result.profit >= 0;
              return (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.15 }}
                  className="p-3 rounded-lg text-center"
                  style={{
                    backgroundColor: isProfit
                      ? `${BRAND.story}08`
                      : `${BRAND.danger}08`,
                  }}
                >
                  <div className="text-xs text-gray-500 mb-1">
                    S1 = {result.S1.toFixed(4)}
                  </div>
                  <div
                    className="font-bold text-sm"
                    style={{ color: isProfit ? BRAND.story : BRAND.danger }}
                  >
                    {isProfit ? "+" : ""}
                    {fmtInt(Math.round(result.profit))} TWD
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {s.appreciation === 0
                      ? "穩穩賺利差"
                      : `日圓升值 ${s.appreciation}%`}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          {/* 動態滑桿模式 */}
          <div className="mb-4 px-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-gray-600">日圓升值幅度</label>
              <span
                className="text-sm font-bold"
                style={{
                  color: appreciation > breakEven ? BRAND.danger : BRAND.story,
                }}
              >
                {appreciation > 0 ? "+" : ""}{appreciation}%
              </span>
            </div>
            <input
              type="range"
              min={-2}
              max={15}
              step={0.5}
              value={appreciation}
              onChange={(e) => setAppreciation(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>日圓貶值 2%</span>
              <span className="text-center" style={{ color: BRAND.accent }}>
                損益平衡 {breakEven.toFixed(1)}%
              </span>
              <span>日圓升值 15%</span>
            </div>
          </div>

          {/* 完整曲線圖 */}
          <div className="w-full h-[220px] mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dynamicData} margin={{ left: 20, right: 20, top: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={10} interval={1} />
                <YAxis
                  tickFormatter={(v: number) =>
                    `${v >= 0 ? "" : "-"}${Math.abs(v / 1000).toFixed(0)}K`
                  }
                  fontSize={11}
                />
                <Tooltip
                  formatter={(value) => [
                    `${Number(value) >= 0 ? "+" : ""}${fmtInt(Number(value))} TWD`,
                    "損益",
                  ]}
                  labelFormatter={(label) => `日圓升值 ${label}`}
                />
                <ReferenceLine y={0} stroke="#9ca3af" strokeDasharray="3 3" />
                <Bar dataKey="profit" radius={[2, 2, 0, 0]} animationDuration={600}>
                  {dynamicData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={entry.profit >= 0 ? BRAND.story : BRAND.danger}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 當前滑桿結果 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-3 gap-3 mb-4"
          >
            <div
              className="p-3 rounded-lg text-center"
              style={{ backgroundColor: `${BRAND.primary}08` }}
            >
              <div className="text-xs text-gray-500 mb-1">期末匯率 S1</div>
              <div className="font-bold text-sm" style={{ color: BRAND.primary }}>
                {sliderResult.S1.toFixed(4)}
              </div>
              <div className="text-xs text-gray-400">TWD/JPY</div>
            </div>
            <div
              className="p-3 rounded-lg text-center"
              style={{ backgroundColor: `${BRAND.accent}10` }}
            >
              <div className="text-xs text-gray-500 mb-1">買回日圓成本</div>
              <div className="font-bold text-sm" style={{ color: BRAND.accent }}>
                {fmtInt(Math.round(sliderResult.twdCostRepay))}
              </div>
              <div className="text-xs text-gray-400">TWD</div>
            </div>
            <div
              className="p-3 rounded-lg text-center"
              style={{
                backgroundColor:
                  sliderResult.profit >= 0
                    ? `${BRAND.story}10`
                    : `${BRAND.danger}10`,
              }}
            >
              <div className="text-xs text-gray-500 mb-1">淨損益</div>
              <div
                className="font-bold text-sm"
                style={{
                  color: sliderResult.profit >= 0 ? BRAND.story : BRAND.danger,
                }}
              >
                {sliderResult.profit >= 0 ? "+" : ""}
                {fmtInt(Math.round(sliderResult.profit))}
              </div>
              <div className="text-xs text-gray-400">TWD</div>
            </div>
          </motion.div>
        </>
      )}

      {/* 隱喻 + 核心洞察 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center text-sm p-3 rounded-lg mb-3"
        style={{ backgroundColor: `${BRAND.danger}10`, color: "#374151" }}
      >
        <span className="text-lg">🚂</span>{" "}
        <span className="font-bold" style={{ color: BRAND.danger }}>
          在蒸汽壓路機前撿硬幣
        </span>
        <br />
        <span className="text-xs text-gray-600">
          多數時候賺取微薄利差，但一次匯率急升就能吃掉所有利潤
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center text-sm p-3 rounded-lg"
        style={{ backgroundColor: `${BRAND.accent}15`, color: "#374151" }}
      >
        <span className="font-bold" style={{ color: BRAND.accent }}>
          關鍵數字：
        </span>{" "}
        日圓只要升值超過{" "}
        <span className="font-bold" style={{ color: BRAND.danger }}>
          {breakEven.toFixed(1)}%
        </span>
        ，利差交易就會轉為虧損 — 而 1 億日圓的套利利潤僅{" "}
        <span className="font-bold" style={{ color: BRAND.story }}>
          {fmtInt(Math.round(calcOutcome(0).profit))} TWD
        </span>
      </motion.div>
    </motion.div>
  );
}

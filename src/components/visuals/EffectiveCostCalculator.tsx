"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { BRAND } from "@/components/brand/BrandColors";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import type { BarShapeProps } from "recharts";

function fmtPct(n: number, digits = 2): string {
  return n.toFixed(digits);
}

interface Plan {
  name: string;
  nameEN: string;
  currency: string;
  nominalRate: number; // decimal
  hasFX: boolean;
}

const PLANS: Plan[] = [
  { name: "台幣銀行貸款", nameEN: "TWD Bank Loan", currency: "TWD", nominalRate: 0.045, hasFX: false },
  { name: "日圓聯貸", nameEN: "JPY Syndicated Loan", currency: "JPY", nominalRate: 0.03, hasFX: true },
  { name: "武士債券", nameEN: "Samurai Bond", currency: "JPY", nominalRate: 0.028, hasFX: true },
];

function getBarColor(effectivePct: number): string {
  if (effectivePct < 4.5) return BRAND.story;
  if (effectivePct <= 5.0) return BRAND.accent;
  return BRAND.danger;
}

export default function EffectiveCostCalculator() {
  const [deltaS, setDeltaS] = useState(1.5); // Expected JPY appreciation %

  const results = useMemo(() => {
    return PLANS.map((plan) => {
      const effective = plan.hasFX
        ? (1 + plan.nominalRate) * (1 + deltaS / 100) - 1
        : plan.nominalRate;
      return {
        ...plan,
        effectiveRate: effective,
        effectivePct: effective * 100,
      };
    });
  }, [deltaS]);

  const chartData = results.map((r) => ({
    name: r.name,
    effective: parseFloat(fmtPct(r.effectivePct)),
    fill: getBarColor(r.effectivePct),
  }));

  // IFE equilibrium point
  const ifeEquilibrium = 1.5; // Taiwan 2% - Japan 0.5%

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
        有效借款成本計算器
      </h4>
      <p className="text-center text-xs text-gray-500 mb-5">
        Effective Borrowing Cost Calculator -- IFE 國際費雪效果驗證
      </p>

      {/* 三張融資方案卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        {results.map((r, i) => {
          const isBase = !r.hasFX;
          const effectiveColor = getBarColor(r.effectivePct);
          return (
            <motion.div
              key={r.nameEN}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}
              className="p-4 rounded-lg border text-center"
              style={{
                borderColor: isBase ? BRAND.primary : "#e5e7eb",
                backgroundColor: isBase ? `${BRAND.primary}08` : "#fff",
              }}
            >
              <div className="text-xs text-gray-400 mb-1">
                方案 {String.fromCharCode(65 + i)}
              </div>
              <div
                className="font-bold text-sm mb-2"
                style={{ color: BRAND.primary }}
              >
                {r.name}
              </div>
              <div className="text-xs text-gray-500 mb-1">{r.nameEN}</div>
              <div className="text-xs text-gray-400 mb-2">
                幣別：{r.currency} | 名目利率：{fmtPct(r.nominalRate * 100)}%
              </div>
              <div
                className="text-2xl font-bold"
                style={{ color: effectiveColor }}
              >
                {fmtPct(r.effectivePct)}%
              </div>
              <div className="text-xs text-gray-400 mt-0.5">
                {isBase ? "有效成本（無匯率風險）" : "有效成本（含匯率調整）"}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 滑桿：預期日圓升值幅度 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="p-4 rounded-lg border mb-5"
        style={{ backgroundColor: `${BRAND.primary}05` }}
      >
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium" style={{ color: BRAND.primary }}>
            預期日圓對台幣升值幅度 (Delta s)
          </label>
          <span
            className="text-lg font-bold"
            style={{ color: deltaS >= 0 ? BRAND.danger : BRAND.story }}
          >
            {deltaS > 0 ? "+" : ""}
            {fmtPct(deltaS, 1)}%
          </span>
        </div>
        <input
          type="range"
          min={-2}
          max={5}
          step={0.1}
          value={deltaS}
          onChange={(e) => setDeltaS(parseFloat(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, ${BRAND.story}, ${BRAND.accent}, ${BRAND.danger})`,
          }}
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>-2%（日圓貶值）</span>
          <span
            className="font-medium cursor-pointer"
            style={{ color: BRAND.accent }}
            onClick={() => setDeltaS(ifeEquilibrium)}
          >
            IFE 均衡 +{ifeEquilibrium}%
          </span>
          <span>+5%（日圓升值）</span>
        </div>
      </motion.div>

      {/* 公式展示 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="p-3 rounded-lg border mb-5 text-center"
        style={{ backgroundColor: `${BRAND.accent}08` }}
      >
        <div className="text-xs text-gray-500 mb-1">有效借款成本公式</div>
        <div className="font-mono text-sm" style={{ color: BRAND.primary }}>
          r<sub>eff</sub> = (1 + r<sub>f</sub>) x (1 + Delta s) - 1
        </div>
        <div className="text-xs text-gray-500 mt-2">
          方案 B：(1 + {fmtPct(PLANS[1].nominalRate * 100)}%) x (1 +{" "}
          {deltaS > 0 ? "+" : ""}
          {fmtPct(deltaS, 1)}%) - 1 ={" "}
          <span className="font-bold" style={{ color: getBarColor(results[1].effectivePct) }}>
            {fmtPct(results[1].effectivePct)}%
          </span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          方案 C：(1 + {fmtPct(PLANS[2].nominalRate * 100)}%) x (1 +{" "}
          {deltaS > 0 ? "+" : ""}
          {fmtPct(deltaS, 1)}%) - 1 ={" "}
          <span className="font-bold" style={{ color: getBarColor(results[2].effectivePct) }}>
            {fmtPct(results[2].effectivePct)}%
          </span>
        </div>
      </motion.div>

      {/* 水平長條圖比較 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mb-5"
      >
        <div className="text-sm font-medium text-center mb-2" style={{ color: BRAND.primary }}>
          有效成本比較
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 50, left: 90, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 8]}
              tickFormatter={(v: number) => `${v}%`}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11 }}
              width={85}
            />
            <Tooltip
              formatter={(value) => [`${value}%`, "有效成本"]}
            />
            <Bar
              dataKey="effective"
              barSize={28}
              shape={(props: BarShapeProps) => {
                const { x, y, width, height } = props;
                const payload = props.payload as { fill: string };
                return (
                  <rect
                    x={x}
                    y={y}
                    width={width ?? 0}
                    height={height ?? 0}
                    rx={4}
                    ry={4}
                    fill={payload.fill}
                  />
                );
              }}
            >
              <LabelList
                dataKey="effective"
                position="right"
                formatter={(v) => `${v}%`}
                style={{ fontSize: 11, fontWeight: "bold" }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        {/* Reference line legend */}
        <div className="flex justify-center gap-4 text-xs mt-1">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: BRAND.story }} />
            <span className="text-gray-500">&lt; 4.5%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: BRAND.accent }} />
            <span className="text-gray-500">4.5-5.0%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: BRAND.danger }} />
            <span className="text-gray-500">&gt; 5.0%</span>
          </div>
        </div>
      </motion.div>

      {/* 核心洞察 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center text-sm p-4 rounded-lg"
        style={{ backgroundColor: `${BRAND.accent}15`, color: "#374151" }}
      >
        <span className="font-bold" style={{ color: BRAND.accent }}>
          IFE 核心洞察：
        </span>{" "}
        {Math.abs(deltaS - ifeEquilibrium) < 0.2 ? (
          <>
            當日圓升值幅度接近 IFE 預測值（+{ifeEquilibrium}%）時，三方案有效成本{" "}
            <span className="font-bold" style={{ color: BRAND.story }}>
              趨近相等
            </span>
            。利率差會被匯率變動抵消！
          </>
        ) : deltaS > ifeEquilibrium ? (
          <>
            日圓升值超過 IFE 預測 → 日圓融資{" "}
            <span className="font-bold" style={{ color: BRAND.danger }}>
              成本上升
            </span>
            ，台幣貸款反而更划算。
          </>
        ) : (
          <>
            日圓升值低於 IFE 預測 → 日圓融資{" "}
            <span className="font-bold" style={{ color: BRAND.story }}>
              成本較低
            </span>
            ，但能持續嗎？Carry trade 陷阱！
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

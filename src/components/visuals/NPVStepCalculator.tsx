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

interface CashFlow {
  year: number;
  ncf: number; // 萬 THB
}

const BASE_FLOWS: CashFlow[] = [
  { year: 0, ncf: -3000 },
  { year: 1, ncf: 800 },
  { year: 2, ncf: 800 },
  { year: 3, ncf: 800 },
  { year: 4, ncf: 1000 },
  { year: 5, ncf: 1500 }, // 含 500 萬殘值
];

const S0 = 0.91; // TWD/THB
const TW_RATE = 0.020;
const TH_RATE = 0.022;
const WITHHOLDING_TAX = 0.10;

function fmtInt(n: number): string {
  return n.toLocaleString("zh-TW", { maximumFractionDigits: 0 });
}

export default function NPVStepCalculator() {
  const [discountRate, setDiscountRate] = useState(10);
  const [perspective, setPerspective] = useState<"subsidiary" | "parent">("subsidiary");

  const subsidiaryCalc = useMemo(() => {
    const k = discountRate / 100;
    const rows = BASE_FLOWS.map((cf) => {
      const factor = cf.year === 0 ? 1 : 1 / Math.pow(1 + k, cf.year);
      const pv = cf.ncf * factor;
      return { ...cf, factor, pv };
    });
    const npv = rows.reduce((sum, r) => sum + r.pv, 0);
    return { rows, npv };
  }, [discountRate]);

  const parentCalc = useMemo(() => {
    const kd = discountRate / 100 - (TH_RATE - TW_RATE); // 母公司折現率
    const ifeRatio = (1 + TW_RATE) / (1 + TH_RATE);

    const rows = BASE_FLOWS.map((cf) => {
      const st = cf.year === 0 ? S0 : S0 * Math.pow(ifeRatio, cf.year);
      const ncfTwd = cf.ncf * st;
      const afterTax = cf.year === 0 ? ncfTwd : ncfTwd * (1 - WITHHOLDING_TAX);
      const factor = cf.year === 0 ? 1 : 1 / Math.pow(1 + kd, cf.year);
      const pv = afterTax * factor;
      return { ...cf, st, ncfTwd, afterTax, factor, pv };
    });
    const npv = rows.reduce((sum, r) => sum + r.pv, 0);
    return { rows, npv, kd };
  }, [discountRate]);

  const currentCalc = perspective === "subsidiary" ? subsidiaryCalc : parentCalc;
  const npvColor = currentCalc.npv >= 0 ? BRAND.story : BRAND.danger;

  const chartData = (perspective === "subsidiary" ? subsidiaryCalc.rows : parentCalc.rows).map(
    (r) => ({
      name: r.year === 0 ? "初始" : `Y${r.year}`,
      pv: parseFloat(r.pv.toFixed(0)),
    })
  );

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
        NPV 逐步計算器
      </h4>
      <p className="text-center text-xs text-gray-500 mb-5">
        W05 計算題 — 曼谷投資案 NPV 分析
      </p>

      {/* 控制列 */}
      <div className="flex items-center justify-center gap-4 mb-5 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">觀點：</label>
          <button
            onClick={() => setPerspective("subsidiary")}
            className="px-3 py-1.5 rounded text-sm font-medium transition-colors"
            style={{
              backgroundColor: perspective === "subsidiary" ? BRAND.primary : "#f3f4f6",
              color: perspective === "subsidiary" ? "#fff" : "#6b7280",
            }}
          >
            子公司 (THB)
          </button>
          <button
            onClick={() => setPerspective("parent")}
            className="px-3 py-1.5 rounded text-sm font-medium transition-colors"
            style={{
              backgroundColor: perspective === "parent" ? BRAND.primary : "#f3f4f6",
              color: perspective === "parent" ? "#fff" : "#6b7280",
            }}
          >
            母公司 (TWD)
          </button>
        </div>
      </div>

      {/* 折現率滑桿 */}
      <div className="flex items-center gap-3 mb-5 px-4">
        <label className="text-sm text-gray-600 whitespace-nowrap">
          {perspective === "subsidiary" ? "泰銖" : "泰銖"}折現率：
        </label>
        <input
          type="range"
          min="5"
          max="20"
          step="0.5"
          value={discountRate}
          onChange={(e) => setDiscountRate(parseFloat(e.target.value))}
          className="flex-1"
        />
        <span
          className="text-sm font-bold tabular-nums w-12 text-right"
          style={{ color: BRAND.primary }}
        >
          {discountRate.toFixed(1)}%
        </span>
        {perspective === "parent" && (
          <span className="text-xs text-gray-400">
            (母公司 k = {(parentCalc.kd * 100).toFixed(1)}%)
          </span>
        )}
      </div>

      {/* 現金流表格 */}
      <div className="overflow-x-auto mb-5">
        {perspective === "subsidiary" ? (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ backgroundColor: `${BRAND.primary}10` }}>
                <th className="text-center px-2 py-2 font-semibold" style={{ color: BRAND.primary }}>
                  年度
                </th>
                <th className="text-right px-2 py-2 font-semibold" style={{ color: BRAND.primary }}>
                  NCF (萬THB)
                </th>
                <th className="text-right px-2 py-2 font-semibold" style={{ color: BRAND.primary }}>
                  折現因子
                </th>
                <th className="text-right px-2 py-2 font-semibold" style={{ color: BRAND.primary }}>
                  PV (萬THB)
                </th>
              </tr>
            </thead>
            <tbody>
              {subsidiaryCalc.rows.map((r, i) => (
                <motion.tr
                  key={r.year}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="border-b"
                >
                  <td className="text-center px-2 py-1.5">{r.year === 0 ? "初始" : r.year}</td>
                  <td
                    className="text-right px-2 py-1.5 tabular-nums"
                    style={{ color: r.ncf < 0 ? BRAND.danger : BRAND.story }}
                  >
                    {fmtInt(r.ncf)}
                  </td>
                  <td className="text-right px-2 py-1.5 tabular-nums text-gray-500">
                    {r.factor.toFixed(4)}
                  </td>
                  <td
                    className="text-right px-2 py-1.5 tabular-nums font-medium"
                    style={{ color: r.pv < 0 ? BRAND.danger : BRAND.story }}
                  >
                    {fmtInt(Math.round(r.pv))}
                  </td>
                </motion.tr>
              ))}
              <tr style={{ backgroundColor: `${npvColor}10` }}>
                <td
                  colSpan={3}
                  className="text-right px-2 py-2 font-bold"
                  style={{ color: npvColor }}
                >
                  子公司 NPV
                </td>
                <td
                  className="text-right px-2 py-2 font-bold text-lg tabular-nums"
                  style={{ color: npvColor }}
                >
                  {subsidiaryCalc.npv >= 0 ? "+" : ""}
                  {fmtInt(Math.round(subsidiaryCalc.npv))} 萬
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr style={{ backgroundColor: `${BRAND.primary}10` }}>
                <th className="text-center px-1.5 py-2 font-semibold" style={{ color: BRAND.primary }}>
                  年度
                </th>
                <th className="text-right px-1.5 py-2 font-semibold" style={{ color: BRAND.primary }}>
                  NCF(萬THB)
                </th>
                <th className="text-right px-1.5 py-2 font-semibold" style={{ color: BRAND.primary }}>
                  E(St)
                </th>
                <th className="text-right px-1.5 py-2 font-semibold" style={{ color: BRAND.primary }}>
                  NCF(萬TWD)
                </th>
                <th className="text-right px-1.5 py-2 font-semibold" style={{ color: BRAND.primary }}>
                  稅後NCF
                </th>
                <th className="text-right px-1.5 py-2 font-semibold" style={{ color: BRAND.primary }}>
                  PV(萬TWD)
                </th>
              </tr>
            </thead>
            <tbody>
              {parentCalc.rows.map((r, i) => (
                <motion.tr
                  key={r.year}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="border-b"
                >
                  <td className="text-center px-1.5 py-1.5">{r.year === 0 ? "初始" : r.year}</td>
                  <td
                    className="text-right px-1.5 py-1.5 tabular-nums"
                    style={{ color: r.ncf < 0 ? BRAND.danger : BRAND.story }}
                  >
                    {fmtInt(r.ncf)}
                  </td>
                  <td className="text-right px-1.5 py-1.5 tabular-nums text-gray-500">
                    {r.st.toFixed(4)}
                  </td>
                  <td className="text-right px-1.5 py-1.5 tabular-nums">
                    {fmtInt(Math.round(r.ncfTwd))}
                  </td>
                  <td className="text-right px-1.5 py-1.5 tabular-nums">
                    {fmtInt(Math.round(r.afterTax))}
                  </td>
                  <td
                    className="text-right px-1.5 py-1.5 tabular-nums font-medium"
                    style={{ color: r.pv < 0 ? BRAND.danger : BRAND.story }}
                  >
                    {fmtInt(Math.round(r.pv))}
                  </td>
                </motion.tr>
              ))}
              <tr style={{ backgroundColor: `${npvColor}10` }}>
                <td
                  colSpan={5}
                  className="text-right px-1.5 py-2 font-bold text-sm"
                  style={{ color: npvColor }}
                >
                  母公司 NPV（含 10% 扣繳稅）
                </td>
                <td
                  className="text-right px-1.5 py-2 font-bold text-base tabular-nums"
                  style={{ color: npvColor }}
                >
                  {parentCalc.npv >= 0 ? "+" : ""}
                  {fmtInt(Math.round(parentCalc.npv))} 萬
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      {/* PV 長條圖 */}
      <div className="w-full h-[200px] mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ left: 10, right: 20, top: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" fontSize={12} />
            <YAxis
              tickFormatter={(v: number) => `${v}`}
              fontSize={11}
              label={{ value: "萬", position: "insideTopLeft", fontSize: 10, fill: "#9ca3af" }}
            />
            <Tooltip
              formatter={(value) => [
                `${fmtInt(Number(value))} 萬${perspective === "subsidiary" ? " THB" : " TWD"}`,
                "PV",
              ]}
            />
            <ReferenceLine y={0} stroke="#9ca3af" />
            <Bar dataKey="pv" radius={[4, 4, 0, 0]} animationDuration={600}>
              {chartData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={entry.pv >= 0 ? BRAND.story : BRAND.danger}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* NPV 結果 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="p-4 rounded-lg text-center"
        style={{ backgroundColor: `${npvColor}10` }}
      >
        <div className="text-sm text-gray-600 mb-1">
          {perspective === "subsidiary" ? "子公司觀點" : "母公司觀點"} NPV
        </div>
        <div
          className="text-3xl font-bold tabular-nums"
          style={{ color: npvColor }}
        >
          {currentCalc.npv >= 0 ? "+" : ""}
          {fmtInt(Math.round(currentCalc.npv))} 萬
          {perspective === "subsidiary" ? " THB" : " TWD"}
        </div>
        <div
          className="text-sm font-medium mt-2"
          style={{ color: npvColor }}
        >
          {currentCalc.npv >= 0 ? "NPV > 0 建議投資" : "NPV < 0 不建議投資"}
        </div>
        {perspective === "parent" && (
          <div className="text-xs text-gray-500 mt-1">
            IFE 預期匯率 + 10% 扣繳稅後
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

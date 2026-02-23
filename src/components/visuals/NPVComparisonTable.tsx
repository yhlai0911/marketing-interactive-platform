"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND } from "@/components/brand/BrandColors";

function fmtNum(n: number, digits = 0): string {
  return n.toLocaleString("zh-TW", { maximumFractionDigits: digits, minimumFractionDigits: digits });
}

// === Cash flows (萬 JPY) ===
const YEARS = [0, 1, 2, 3, 4, 5];
const NCF_JPY = [-10000, 1800, 2500, 3000, 3000, 4200]; // Y5 = 3000 operating + 1200 salvage

// === Subsidiary perspective (k=8%) ===
const K_SUB = 0.08;

// === Parent perspective ===
const K_PARENT = 0.095; // kd = 9.5%
const S0 = 0.232; // TWD/JPY spot
const INF_D = 0.02; // Taiwan inflation
const INF_F = 0.005; // Japan inflation

// IFE expected exchange rates: E(St) = S0 × ((1+inf_d)/(1+inf_f))^t
function expectedRate(t: number): number {
  return S0 * Math.pow((1 + INF_D) / (1 + INF_F), t);
}

type Perspective = "subsidiary" | "parent_notax" | "parent_tax";

interface PerspectiveConfig {
  key: Perspective;
  label: string;
  sublabel: string;
  color: string;
}

const PERSPECTIVES: PerspectiveConfig[] = [
  {
    key: "subsidiary",
    label: "子公司觀點",
    sublabel: "k = 8%",
    color: BRAND.primary,
  },
  {
    key: "parent_notax",
    label: "母公司觀點（無稅）",
    sublabel: "kd = 9.5%",
    color: BRAND.accent,
  },
  {
    key: "parent_tax",
    label: "母公司觀點（含扣繳稅）",
    sublabel: "kd = 9.5%",
    color: BRAND.danger,
  },
];

export default function NPVComparisonTable() {
  const [perspective, setPerspective] = useState<Perspective>("subsidiary");
  const [withholdingRate, setWithholdingRate] = useState(10); // %

  const calc = useMemo(() => {
    const tau = withholdingRate / 100;

    // Subsidiary NPV (in 萬 JPY)
    const subDiscountFactors = YEARS.map((t) =>
      t === 0 ? 1 : 1 / Math.pow(1 + K_SUB, t)
    );
    const subPVs = NCF_JPY.map((cf, i) => cf * subDiscountFactors[i]);
    const subNPV = subPVs.reduce((a, b) => a + b, 0);

    // Parent NPV no tax (in 萬 TWD)
    const parentRates = YEARS.map((t) => expectedRate(t));
    const parentDiscountFactors = YEARS.map((t) =>
      t === 0 ? 1 : 1 / Math.pow(1 + K_PARENT, t)
    );
    const parentNoTaxPVs = NCF_JPY.map((cf, i) =>
      cf * parentRates[i] * parentDiscountFactors[i]
    );
    const parentNoTaxNPV = parentNoTaxPVs.reduce((a, b) => a + b, 0);

    // Parent NPV with withholding tax (in 萬 TWD)
    const parentTaxPVs = NCF_JPY.map((cf, i) => {
      if (i === 0) return cf * parentRates[i]; // initial investment (no tax on outflow)
      return cf * (1 - tau) * parentRates[i] * parentDiscountFactors[i];
    });
    const parentTaxNPV = parentTaxPVs.reduce((a, b) => a + b, 0);

    return {
      subDiscountFactors,
      subPVs,
      subNPV,
      parentRates,
      parentDiscountFactors,
      parentNoTaxPVs,
      parentNoTaxNPV,
      parentTaxPVs,
      parentTaxNPV,
    };
  }, [withholdingRate]);

  // Current perspective data
  const currentData = useMemo(() => {
    switch (perspective) {
      case "subsidiary":
        return {
          discountFactors: calc.subDiscountFactors,
          pvs: calc.subPVs,
          npv: calc.subNPV,
          unit: "萬 JPY",
          color: BRAND.primary,
        };
      case "parent_notax":
        return {
          discountFactors: calc.parentDiscountFactors,
          pvs: calc.parentNoTaxPVs,
          npv: calc.parentNoTaxNPV,
          unit: "萬 TWD",
          color: BRAND.accent,
        };
      case "parent_tax":
        return {
          discountFactors: calc.parentDiscountFactors,
          pvs: calc.parentTaxPVs,
          npv: calc.parentTaxNPV,
          unit: "萬 TWD",
          color: BRAND.danger,
        };
    }
  }, [perspective, calc]);

  // Bar chart data for comparison
  const barData = [
    { label: "子公司", npv: calc.subNPV, unit: "萬JPY", color: BRAND.primary },
    { label: "母公司(無稅)", npv: calc.parentNoTaxNPV, unit: "萬TWD", color: BRAND.accent },
    { label: `母公司(${withholdingRate}%稅)`, npv: calc.parentTaxNPV, unit: "萬TWD", color: BRAND.danger },
  ];

  // Normalize bar widths relative to subsidiary NPV
  const maxNPV = Math.max(...barData.map((d) => Math.abs(d.npv)));

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
        NPV 多視角比較表
      </h4>
      <p className="text-center text-xs text-gray-500 mb-5">
        東京店投資案 — 子公司 vs 母公司觀點
      </p>

      {/* Cash Flow Timeline */}
      <div className="mb-5 overflow-x-auto">
        <div className="text-xs font-medium text-gray-500 mb-2 px-1">
          現金流量時間線（萬 JPY）
        </div>
        <div className="flex gap-1 min-w-[500px]">
          {YEARS.map((year, i) => {
            const cf = NCF_JPY[i];
            const isNeg = cf < 0;
            return (
              <motion.div
                key={year}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex-1 rounded-lg p-2 text-center border"
                style={{
                  backgroundColor: isNeg ? `${BRAND.danger}08` : `${BRAND.story}08`,
                  borderColor: isNeg ? `${BRAND.danger}30` : `${BRAND.story}30`,
                }}
              >
                <div className="text-xs text-gray-500 mb-1">
                  Year {year}
                </div>
                <div
                  className="font-bold text-sm"
                  style={{ color: isNeg ? BRAND.danger : BRAND.story }}
                >
                  {isNeg ? "" : "+"}
                  {fmtNum(cf)}
                </div>
                {year === 5 && (
                  <div className="text-xs text-gray-400 mt-0.5">
                    含殘值 1,200
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Perspective Toggle */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {PERSPECTIVES.map((p) => (
          <button
            key={p.key}
            onClick={() => setPerspective(p.key)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all border"
            style={{
              borderColor: perspective === p.key ? p.color : "#d1d5db",
              backgroundColor: perspective === p.key ? p.color : "#fff",
              color: perspective === p.key ? "#fff" : "#6b7280",
            }}
          >
            {p.label}（{p.sublabel}）
          </button>
        ))}
      </div>

      {/* Detail Table */}
      <AnimatePresence mode="wait">
        <motion.div
          key={perspective}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.3 }}
          className="mb-5 overflow-x-auto"
        >
          <table className="w-full text-xs border-collapse min-w-[500px]">
            <thead>
              <tr
                className="text-white"
                style={{ backgroundColor: currentData.color }}
              >
                <th className="py-2 px-2 text-left rounded-tl-lg">項目</th>
                {YEARS.map((y) => (
                  <th key={y} className={`py-2 px-2 text-center ${y === 5 ? "rounded-tr-lg" : ""}`}>
                    Year {y}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* NCF row */}
              <tr className="border-b">
                <td className="py-2 px-2 font-medium text-gray-700">
                  NCF（萬 JPY）
                </td>
                {NCF_JPY.map((cf, i) => (
                  <td key={i} className="py-2 px-2 text-center">
                    {fmtNum(cf)}
                  </td>
                ))}
              </tr>

              {/* Exchange rate row (parent only) */}
              {perspective !== "subsidiary" && (
                <tr className="border-b" style={{ backgroundColor: `${currentData.color}05` }}>
                  <td className="py-2 px-2 font-medium text-gray-700">
                    E(S<sub>t</sub>) TWD/JPY
                  </td>
                  {YEARS.map((_, i) => (
                    <td key={i} className="py-2 px-2 text-center">
                      {calc.parentRates[i].toFixed(4)}
                    </td>
                  ))}
                </tr>
              )}

              {/* After-tax NCF row (parent_tax only) */}
              {perspective === "parent_tax" && (
                <tr className="border-b">
                  <td className="py-2 px-2 font-medium text-gray-700">
                    NCF x (1-{withholdingRate}%)
                  </td>
                  {NCF_JPY.map((cf, i) => (
                    <td key={i} className="py-2 px-2 text-center">
                      {i === 0 ? fmtNum(cf) : fmtNum(cf * (1 - withholdingRate / 100))}
                    </td>
                  ))}
                </tr>
              )}

              {/* Discount factor row */}
              <tr className="border-b" style={{ backgroundColor: `${currentData.color}05` }}>
                <td className="py-2 px-2 font-medium text-gray-700">
                  折現因子
                </td>
                {currentData.discountFactors.map((df, i) => (
                  <td key={i} className="py-2 px-2 text-center">
                    {df.toFixed(4)}
                  </td>
                ))}
              </tr>

              {/* PV row */}
              <tr className="font-bold" style={{ backgroundColor: `${currentData.color}10` }}>
                <td className="py-2 px-2 text-gray-700 rounded-bl-lg">
                  PV（{currentData.unit}）
                </td>
                {currentData.pvs.map((pv, i) => (
                  <td
                    key={i}
                    className={`py-2 px-2 text-center ${i === YEARS.length - 1 ? "rounded-br-lg" : ""}`}
                    style={{ color: pv >= 0 ? BRAND.story : BRAND.danger }}
                  >
                    {pv >= 0 ? "+" : ""}
                    {fmtNum(Math.round(pv))}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>

          {/* NPV Summary */}
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="mt-3 p-3 rounded-lg text-center"
            style={{ backgroundColor: `${currentData.color}10` }}
          >
            <span className="text-sm text-gray-600">NPV = </span>
            <span
              className="text-xl font-bold"
              style={{
                color: currentData.npv >= 0 ? currentData.color : BRAND.danger,
              }}
            >
              {currentData.npv >= 0 ? "+" : ""}
              {fmtNum(Math.round(currentData.npv))} {currentData.unit}
            </span>
            <span className="ml-2 text-lg">
              {currentData.npv > 200 ? " ✓" : currentData.npv > 0 ? " ⚠️" : " ✗"}
            </span>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Withholding Tax Slider */}
      <div className="mb-5 px-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-gray-600">扣繳稅率 (Withholding Tax)</label>
          <span
            className="text-sm font-bold"
            style={{ color: BRAND.danger }}
          >
            {withholdingRate}%
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={25}
          step={0.5}
          value={withholdingRate}
          onChange={(e) => setWithholdingRate(parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0%（免稅）</span>
          <span style={{ color: BRAND.accent }}>10%（日本標準）</span>
          <span>25%（高稅率）</span>
        </div>
      </div>

      {/* Value Evaporation Bar */}
      <div className="mb-5">
        <div className="text-xs font-medium text-gray-500 mb-2 px-1">
          價值蒸發圖 — 從子公司到母公司
        </div>
        <div className="space-y-2">
          {barData.map((item, i) => {
            const widthPct = maxNPV > 0 ? (Math.abs(item.npv) / maxNPV) * 100 : 0;
            const isPositive = item.npv >= 0;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.15 }}
                className="flex items-center gap-2"
              >
                <div className="w-28 text-xs text-gray-600 text-right flex-shrink-0">
                  {item.label}
                </div>
                <div className="flex-1 relative h-7">
                  <div className="absolute inset-0 bg-gray-100 rounded-full" />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(widthPct, 2)}%` }}
                    transition={{ duration: 0.8, delay: 0.5 + i * 0.15 }}
                    className="absolute inset-y-0 left-0 rounded-full flex items-center justify-end pr-2"
                    style={{
                      backgroundColor: isPositive
                        ? item.npv > 200
                          ? item.color
                          : BRAND.accent
                        : BRAND.danger,
                    }}
                  >
                    <span className="text-white text-xs font-bold whitespace-nowrap">
                      {isPositive ? "+" : ""}
                      {fmtNum(Math.round(item.npv))} {item.unit}
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Key Insight */}
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
        同一筆投資，子公司看到 +{fmtNum(Math.round(calc.subNPV))} 萬 JPY，
        母公司含 {withholdingRate}% 扣繳稅後只剩{" "}
        <span
          className="font-bold"
          style={{
            color: calc.parentTaxNPV > 200 ? BRAND.story : calc.parentTaxNPV > 0 ? BRAND.accent : BRAND.danger,
          }}
        >
          +{fmtNum(Math.round(calc.parentTaxNPV))} 萬 TWD
        </span>
        {" "}— 匯率與稅務讓價值大幅蒸發
      </motion.div>
    </motion.div>
  );
}

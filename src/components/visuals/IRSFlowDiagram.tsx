"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND } from "@/components/brand/BrandColors";

function fmtNum(n: number, digits = 1): string {
  return n.toLocaleString("zh-TW", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}

function fmtPct(n: number, digits = 1): string {
  return n.toFixed(digits);
}

// === Parameters ===
const LOAN_AMOUNT = 7400; // 萬 JPY
const SPREAD = 2.2; // % over TORF
const SWAP_RATE = 1.0; // % fixed leg of IRS
const FIXED_TOTAL = SPREAD + SWAP_RATE; // 3.2%

// Preset TORF scenarios
const TORF_PRESETS = [
  { label: "0.3%", value: 0.3 },
  { label: "0.8%", value: 0.8 },
  { label: "1.5%", value: 1.5 },
  { label: "2.0%", value: 2.0 },
];

// Animated flow arrow with particles
function FlowArrow({
  label,
  sublabel,
  color,
  delay = 0,
  direction = "right",
}: {
  label: string;
  sublabel?: string;
  color: string;
  delay?: number;
  direction?: "right" | "left";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ delay, duration: 0.4 }}
      className="flex flex-col items-center mx-1"
      style={{ originX: direction === "right" ? 0 : 1, minWidth: 80 }}
    >
      <div className="text-xs font-bold text-center mb-0.5" style={{ color }}>
        {label}
      </div>
      <div className="relative flex items-center w-full">
        {direction === "left" && (
          <div
            className="w-0 h-0"
            style={{
              borderTop: "5px solid transparent",
              borderBottom: "5px solid transparent",
              borderRight: `8px solid ${color}`,
            }}
          />
        )}
        <div
          className="h-0.5 flex-1 relative overflow-hidden"
          style={{ backgroundColor: color }}
        >
          {/* Animated particle */}
          <motion.div
            className="absolute top-[-2px] w-2 h-2 rounded-full"
            style={{ backgroundColor: color }}
            animate={{
              x: direction === "right" ? ["-100%", "500%"] : ["500%", "-100%"],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
              delay: delay + 0.5,
            }}
          />
        </div>
        {direction === "right" && (
          <div
            className="w-0 h-0"
            style={{
              borderTop: "5px solid transparent",
              borderBottom: "5px solid transparent",
              borderLeft: `8px solid ${color}`,
            }}
          />
        )}
      </div>
      {sublabel && (
        <div className="text-xs text-gray-400 mt-0.5">{sublabel}</div>
      )}
    </motion.div>
  );
}

// Flow box component
function FlowBox({
  label,
  sublabel,
  color,
  delay = 0,
  highlight = false,
}: {
  label: string;
  sublabel?: string;
  color: string;
  delay?: number;
  highlight?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
      className="px-3 py-2.5 rounded-lg border-2 text-center flex-shrink-0"
      style={{
        borderColor: color,
        backgroundColor: highlight ? `${color}15` : `${color}08`,
        minWidth: 85,
      }}
    >
      <div className="font-bold text-sm" style={{ color: BRAND.primary }}>
        {label}
      </div>
      {sublabel && (
        <div className="text-xs text-gray-500 mt-0.5">{sublabel}</div>
      )}
    </motion.div>
  );
}

export default function IRSFlowDiagram() {
  const [torf, setTorf] = useState(0.8);

  // Calculations
  const calc = useMemo(() => {
    const withoutIRS = torf + SPREAD;
    const withIRS = FIXED_TOTAL;
    const withoutInterest = (withoutIRS / 100) * LOAN_AMOUNT;
    const withInterest = (withIRS / 100) * LOAN_AMOUNT;
    const diff = withInterest - withoutInterest;
    const isFavorable = torf > SWAP_RATE;

    return {
      withoutIRS,
      withIRS,
      withoutInterest,
      withInterest,
      diff,
      isFavorable,
    };
  }, [torf]);

  // Scenario table data
  const scenarioData = useMemo(() => {
    return TORF_PRESETS.map((preset) => {
      const without = preset.value + SPREAD;
      const withRate = FIXED_TOTAL;
      const withoutInt = (without / 100) * LOAN_AMOUNT;
      const withInt = (withRate / 100) * LOAN_AMOUNT;
      const diff = withInt - withoutInt;
      return {
        torf: preset.value,
        withoutRate: without,
        withRate: withRate,
        withoutInterest: withoutInt,
        withInterest: withInt,
        diff,
        favorable: diff < 0,
      };
    });
  }, []);

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
        利率交換（IRS）流程圖
      </h4>
      <p className="text-center text-xs text-gray-500 mb-5">
        Interest Rate Swap -- 浮動轉固定利率
      </p>

      {/* Flow Diagram */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="p-4 rounded-xl border mb-4"
        style={{ backgroundColor: `${BRAND.primary}05` }}
      >
        {/* Row 1: Loan payment */}
        <div className="flex items-center justify-center flex-wrap gap-y-2 mb-4">
          <FlowBox
            label="珍途日本"
            sublabel="借款人"
            color={BRAND.accent}
            delay={0.1}
            highlight
          />
          <FlowArrow
            label={`TORF + ${SPREAD}%`}
            sublabel="浮動貸款利息"
            color={BRAND.danger}
            delay={0.2}
          />
          <FlowBox
            label="Mizuho 銀行"
            sublabel="貸款銀行"
            color={BRAND.neutral}
            delay={0.3}
          />
        </div>

        {/* Row 2: IRS fixed leg */}
        <div className="flex items-center justify-center flex-wrap gap-y-2 mb-4">
          <FlowBox
            label="珍途日本"
            sublabel="付固定"
            color={BRAND.accent}
            delay={0.4}
            highlight
          />
          <FlowArrow
            label={`固定 ${fmtPct(SWAP_RATE)}%`}
            sublabel="Swap 固定端"
            color={BRAND.primary}
            delay={0.5}
          />
          <FlowBox
            label="IRS 對手方"
            sublabel="Swap Dealer"
            color={BRAND.primary}
            delay={0.6}
          />
        </div>

        {/* Row 3: IRS floating leg (return) */}
        <div className="flex items-center justify-center flex-wrap gap-y-2 mb-3">
          <FlowBox
            label="IRS 對手方"
            sublabel="付浮動"
            color={BRAND.primary}
            delay={0.7}
          />
          <FlowArrow
            label="TORF"
            sublabel="Swap 浮動端"
            color={BRAND.story}
            delay={0.8}
          />
          <FlowBox
            label="珍途日本"
            sublabel="收浮動"
            color={BRAND.accent}
            delay={0.9}
            highlight
          />
        </div>

        {/* Net Effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1 }}
          className="text-center p-3 rounded-lg border-2 border-dashed"
          style={{ borderColor: BRAND.accent, backgroundColor: `${BRAND.accent}10` }}
        >
          <div className="text-xs text-gray-500 mb-1">淨效果：TORF 相互抵消</div>
          <div className="flex items-center justify-center gap-2 text-sm">
            <span
              className="line-through text-gray-400"
              style={{ textDecorationColor: BRAND.danger }}
            >
              TORF
            </span>
            <span className="text-gray-400">+</span>
            <span style={{ color: BRAND.danger }}>{SPREAD}%</span>
            <span className="text-gray-400">+</span>
            <span style={{ color: BRAND.primary }}>{fmtPct(SWAP_RATE)}%</span>
            <span className="text-gray-400">-</span>
            <span
              className="line-through text-gray-400"
              style={{ textDecorationColor: BRAND.story }}
            >
              TORF
            </span>
            <span className="text-gray-400">=</span>
            <span
              className="text-lg font-bold"
              style={{ color: BRAND.accent }}
            >
              固定 {fmtPct(FIXED_TOTAL)}%
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* TORF Slider */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="p-4 rounded-lg border mb-4"
        style={{ backgroundColor: `${BRAND.primary}05` }}
      >
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium" style={{ color: BRAND.primary }}>
            TORF 利率（模擬）
          </label>
          <span
            className="text-lg font-bold"
            style={{
              color: torf > SWAP_RATE ? BRAND.story : torf < SWAP_RATE ? BRAND.danger : BRAND.neutral,
            }}
          >
            {fmtPct(torf)}%
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={3}
          step={0.1}
          value={torf}
          onChange={(e) => setTorf(parseFloat(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, ${BRAND.danger}, #e5e7eb 33%, ${BRAND.story})`,
          }}
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0%</span>
          <span
            className="cursor-pointer font-medium"
            style={{ color: BRAND.accent }}
            onClick={() => setTorf(SWAP_RATE)}
          >
            Break-even {fmtPct(SWAP_RATE)}%
          </span>
          <span>3%</span>
        </div>

        {/* Quick preset buttons */}
        <div className="flex justify-center gap-2 mt-3">
          {TORF_PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => setTorf(preset.value)}
              className="px-2.5 py-1 rounded-full text-xs font-medium transition-colors border"
              style={{
                borderColor: torf === preset.value ? BRAND.primary : "#d1d5db",
                backgroundColor: torf === preset.value ? BRAND.primary : "#fff",
                color: torf === preset.value ? "#fff" : "#6b7280",
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Cost Comparison Cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`cards-${torf}`}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 gap-3 mb-4"
        >
          {/* Without IRS */}
          <div
            className="p-4 rounded-lg text-center border-2"
            style={{
              borderColor: BRAND.danger,
              backgroundColor: `${BRAND.danger}08`,
            }}
          >
            <div className="text-xs text-gray-500 mb-1">無 IRS（浮動）</div>
            <motion.div
              key={`without-${torf}`}
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold"
              style={{ color: BRAND.danger }}
            >
              {fmtPct(calc.withoutIRS)}%
            </motion.div>
            <div className="text-xs text-gray-400 mt-1">
              TORF {fmtPct(torf)}% + {SPREAD}%
            </div>
            <motion.div
              key={`without-int-${torf}`}
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              className="text-sm font-bold mt-2"
              style={{ color: BRAND.danger }}
            >
              年利息 {fmtNum(calc.withoutInterest)} 萬 JPY
            </motion.div>
          </div>

          {/* With IRS */}
          <div
            className="p-4 rounded-lg text-center border-2"
            style={{
              borderColor: BRAND.primary,
              backgroundColor: `${BRAND.primary}08`,
            }}
          >
            <div className="text-xs text-gray-500 mb-1">有 IRS（固定）</div>
            <div
              className="text-2xl font-bold"
              style={{ color: BRAND.primary }}
            >
              {fmtPct(FIXED_TOTAL)}%
            </div>
            <div className="text-xs text-gray-400 mt-1">
              固定 {fmtPct(SWAP_RATE)}% + {SPREAD}%
            </div>
            <div
              className="text-sm font-bold mt-2"
              style={{ color: BRAND.primary }}
            >
              年利息 {fmtNum(calc.withInterest)} 萬 JPY
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Difference Display */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center p-3 rounded-lg mb-5 transition-colors duration-300"
        style={{
          backgroundColor: calc.isFavorable ? `${BRAND.story}12` : `${BRAND.danger}12`,
        }}
      >
        <div className="text-xs text-gray-500 mb-1">IRS 效果</div>
        <motion.div
          key={`diff-${torf}`}
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          className="text-xl font-bold"
          style={{ color: calc.isFavorable ? BRAND.story : BRAND.danger }}
        >
          {calc.diff >= 0 ? "+" : ""}
          {fmtNum(calc.diff)} 萬 JPY
          <span className="text-sm ml-1">
            {calc.isFavorable ? "（節省！）" : calc.diff === 0 ? "（持平）" : "（多付）"}
          </span>
        </motion.div>
      </motion.div>

      {/* Scenario Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="overflow-x-auto mb-4"
      >
        <div className="text-sm font-bold text-center mb-2" style={{ color: BRAND.primary }}>
          不同 TORF 情境比較
        </div>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th
                className="px-3 py-2 text-center text-xs font-bold border-b-2"
                style={{ borderColor: BRAND.primary, color: BRAND.primary }}
              >
                TORF
              </th>
              <th
                className="px-3 py-2 text-center text-xs font-bold border-b-2"
                style={{ borderColor: BRAND.primary, color: BRAND.danger }}
              >
                無 IRS
              </th>
              <th
                className="px-3 py-2 text-center text-xs font-bold border-b-2"
                style={{ borderColor: BRAND.primary, color: BRAND.primary }}
              >
                有 IRS
              </th>
              <th
                className="px-3 py-2 text-center text-xs font-bold border-b-2"
                style={{ borderColor: BRAND.primary, color: BRAND.accent }}
              >
                差額
              </th>
            </tr>
          </thead>
          <tbody>
            {scenarioData.map((row, idx) => (
              <tr
                key={idx}
                className="border-b border-gray-100 transition-colors"
                style={{
                  backgroundColor:
                    Math.abs(row.torf - torf) < 0.05 ? `${BRAND.accent}15` : "transparent",
                }}
              >
                <td className="px-3 py-2 text-center text-xs font-medium" style={{ color: BRAND.primary }}>
                  {fmtPct(row.torf)}%
                </td>
                <td className="px-3 py-2 text-center text-xs" style={{ color: BRAND.danger }}>
                  <span className="font-bold">{fmtPct(row.withoutRate)}%</span>
                  <span className="text-gray-400 ml-1">
                    ({fmtNum(row.withoutInterest)} 萬)
                  </span>
                </td>
                <td className="px-3 py-2 text-center text-xs" style={{ color: BRAND.primary }}>
                  <span className="font-bold">{fmtPct(row.withRate)}%</span>
                  <span className="text-gray-400 ml-1">
                    ({fmtNum(row.withInterest)} 萬)
                  </span>
                </td>
                <td
                  className="px-3 py-2 text-center text-xs font-bold"
                  style={{
                    color: row.favorable ? BRAND.story : BRAND.danger,
                  }}
                >
                  {row.diff >= 0 ? "+" : ""}
                  {fmtNum(row.diff)} 萬
                  <span className="text-xs ml-0.5">
                    {row.favorable ? "（節省）" : "（多付）"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Break-even Insight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center text-sm p-3 rounded-lg mb-3"
        style={{ backgroundColor: `${BRAND.primary}10`, color: "#374151" }}
      >
        <span className="font-bold" style={{ color: BRAND.primary }}>
          損益平衡點：
        </span>{" "}
        TORF = Swap Rate ={" "}
        <span className="font-bold" style={{ color: BRAND.accent }}>
          {fmtPct(SWAP_RATE)}%
        </span>
        。當 TORF &gt; {fmtPct(SWAP_RATE)}% 時，IRS 為珍途{" "}
        <span className="font-bold" style={{ color: BRAND.story }}>
          節省利息
        </span>
        。
      </motion.div>

      {/* Core Insight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="text-center text-sm p-3 rounded-lg"
        style={{ backgroundColor: `${BRAND.accent}15`, color: "#374151" }}
      >
        <span className="font-bold" style={{ color: BRAND.accent }}>
          核心洞察：
        </span>{" "}
        IRS 不改變貸款本身，而是{" "}
        <span className="font-bold" style={{ color: BRAND.primary }}>
          疊加一層衍生品
        </span>
        ，讓浮動利率的不確定性轉嫁給 Swap 對手方。珍途付出的代價是：放棄 TORF 下降時的利益。
      </motion.div>
    </motion.div>
  );
}

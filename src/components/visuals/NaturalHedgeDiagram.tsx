"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND } from "@/components/brand/BrandColors";

function fmtPct(n: number, digits = 2): string {
  return n.toFixed(digits);
}

type Scenario = "natural" | "mismatch";

// Animated arrow component for flow diagrams
function FlowArrow({
  color,
  delay = 0,
  danger = false,
}: {
  color: string;
  delay?: number;
  danger?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ delay, duration: 0.4 }}
      className="flex items-center justify-center mx-1"
      style={{ originX: 0 }}
    >
      <div
        className="h-0.5 flex-1 min-w-[20px]"
        style={{ backgroundColor: color }}
      />
      {danger && (
        <motion.span
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="text-base mx-0.5"
        >
          &#9889;
        </motion.span>
      )}
      <div
        className="w-0 h-0"
        style={{
          borderTop: "5px solid transparent",
          borderBottom: "5px solid transparent",
          borderLeft: `8px solid ${color}`,
        }}
      />
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
      className="px-3 py-2 rounded-lg border-2 text-center text-xs font-medium flex-shrink-0"
      style={{
        borderColor: color,
        backgroundColor: highlight ? `${color}15` : `${color}08`,
        color: BRAND.primary,
        minWidth: 80,
      }}
    >
      <div className="font-bold text-sm">{label}</div>
      {sublabel && <div className="text-gray-500 mt-0.5">{sublabel}</div>}
    </motion.div>
  );
}

export default function NaturalHedgeDiagram() {
  const [scenario, setScenario] = useState<Scenario>("natural");
  const [jpyChange, setJpyChange] = useState(0); // JPY appreciation %

  const costCalc = useMemo(() => {
    const baseJPYRate = 0.03; // 3% JPY loan rate
    const baseTWDRate = 0.045; // 4.5% TWD loan rate
    const jpyRevenue = 800; // 萬 JPY
    const jpyRepay = 130; // 萬 JPY (for natural hedge scenario)

    // Scenario A: Natural hedge — no FX impact on cost
    const scenarioACost = baseJPYRate * 100; // always 3%

    // Scenario B: Currency mismatch — need to convert JPY to TWD, then repay TWD
    // Effective cost rises if JPY appreciates (more TWD needed to buy JPY for revenue conversion is good,
    // but the debt is in TWD — actually the mismatch is: revenue in JPY, debt in TWD)
    // If JPY depreciates: JPY revenue converts to less TWD → harder to repay TWD debt
    // If JPY appreciates: JPY revenue converts to more TWD → easier to repay TWD debt
    // But the "cost" of the TWD loan itself is fixed. The risk is on the revenue side.
    // Effective cost for mismatch = TWD rate + FX risk impact
    // We model it as: revenue shortfall/surplus from FX change
    const scenarioBBaseCost = baseTWDRate * 100; // 4.5%
    // FX impact: if JPY depreciates, revenue in TWD terms drops
    // Additional cost from FX = -jpyChange (JPY depreciation hurts)
    const scenarioBEffectiveCost = scenarioBBaseCost - jpyChange; // counter-intuitive: JPY appreciation helps

    return {
      scenarioACost,
      scenarioBBaseCost,
      scenarioBEffectiveCost,
      jpyRevenue,
      jpyRepay,
      remaining: jpyRevenue - jpyRepay,
    };
  }, [jpyChange]);

  const isNatural = scenario === "natural";
  const jpyColor = BRAND.story; // green for JPY (same currency)
  const twdColor = BRAND.danger; // red for TWD (mismatch)
  const dangerColor = BRAND.danger;

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
        自然避險 vs. 幣別錯配
      </h4>
      <p className="text-center text-xs text-gray-500 mb-4">
        Natural Hedge vs. Currency Mismatch -- 珍途日本融資決策
      </p>

      {/* 情境切換 */}
      <div className="flex justify-center gap-2 mb-5">
        <button
          onClick={() => setScenario("natural")}
          className="px-4 py-2 rounded-full text-sm font-medium transition-all"
          style={{
            backgroundColor: isNatural ? BRAND.story : "#fff",
            color: isNatural ? "#fff" : BRAND.story,
            border: `2px solid ${BRAND.story}`,
          }}
        >
          方案 A：借日圓（自然避險）
        </button>
        <button
          onClick={() => setScenario("mismatch")}
          className="px-4 py-2 rounded-full text-sm font-medium transition-all"
          style={{
            backgroundColor: !isNatural ? BRAND.danger : "#fff",
            color: !isNatural ? "#fff" : BRAND.danger,
            border: `2px solid ${BRAND.danger}`,
          }}
        >
          方案 B：借台幣（幣別錯配）
        </button>
      </div>

      {/* 流程圖區域 */}
      <AnimatePresence mode="wait">
        {isNatural ? (
          <motion.div
            key="natural"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4 }}
            className="p-4 rounded-xl border-2 mb-4"
            style={{ borderColor: BRAND.story, backgroundColor: `${BRAND.story}06` }}
          >
            <div className="text-sm font-bold text-center mb-3" style={{ color: BRAND.story }}>
              方案 A：借日圓 -- 自然避險 &#10003;
            </div>

            {/* 流程圖 */}
            <div className="flex items-center justify-center flex-wrap gap-y-3">
              <FlowBox
                label="東京店"
                sublabel="營業據點"
                color={jpyColor}
                delay={0.1}
              />
              <div className="flex flex-col items-center">
                <FlowArrow color={jpyColor} delay={0.2} />
                <span className="text-xs font-medium" style={{ color: jpyColor }}>
                  JPY 800萬
                </span>
              </div>
              <FlowBox
                label="珍途日本"
                sublabel="子公司"
                color={jpyColor}
                delay={0.3}
                highlight
              />
              <div className="flex flex-col items-center">
                <FlowArrow color={jpyColor} delay={0.4} />
                <span className="text-xs font-medium" style={{ color: jpyColor }}>
                  JPY 130萬
                </span>
              </div>
              <FlowBox
                label="Mizuho"
                sublabel="日圓貸款"
                color={jpyColor}
                delay={0.5}
              />
            </div>

            {/* 剩餘資金 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center mt-3 text-xs text-gray-500"
            >
              剩餘 JPY 670萬 → 再投資日本市場或匯回台灣
            </motion.div>

            {/* 標語 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center mt-3 p-2 rounded-lg text-sm"
              style={{ backgroundColor: `${BRAND.story}12`, color: BRAND.story }}
            >
              <span className="font-bold">收入幣別 = 債務幣別</span> → 全部都是日圓，無匯率風險
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="mismatch"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="p-4 rounded-xl border-2 mb-4"
            style={{ borderColor: BRAND.danger, backgroundColor: `${BRAND.danger}06` }}
          >
            <div className="text-sm font-bold text-center mb-3" style={{ color: BRAND.danger }}>
              方案 B：借台幣 -- 幣別錯配 &#10007;
            </div>

            {/* 流程圖 */}
            <div className="flex items-center justify-center flex-wrap gap-y-3">
              <FlowBox
                label="東京店"
                sublabel="營業據點"
                color={jpyColor}
                delay={0.1}
              />
              <div className="flex flex-col items-center">
                <FlowArrow color={jpyColor} delay={0.2} />
                <span className="text-xs font-medium" style={{ color: jpyColor }}>
                  JPY 800萬
                </span>
              </div>
              <FlowBox
                label="珍途日本"
                sublabel="子公司"
                color={jpyColor}
                delay={0.3}
              />
              <div className="flex flex-col items-center">
                <FlowArrow color={dangerColor} delay={0.4} danger />
                <span className="text-xs font-bold" style={{ color: dangerColor }}>
                  換匯！
                </span>
              </div>
              <FlowBox
                label="珍途台灣"
                sublabel="總部"
                color={twdColor}
                delay={0.5}
                highlight
              />
              <div className="flex flex-col items-center">
                <FlowArrow color={twdColor} delay={0.6} />
                <span className="text-xs font-medium" style={{ color: twdColor }}>
                  TWD 還款
                </span>
              </div>
              <FlowBox
                label="兆豐銀行"
                sublabel="台幣貸款"
                color={twdColor}
                delay={0.7}
              />
            </div>

            {/* 標語 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center mt-3 p-2 rounded-lg text-sm"
              style={{ backgroundColor: `${BRAND.danger}12`, color: BRAND.danger }}
            >
              <span className="font-bold">收入幣別 (JPY) &#8800; 債務幣別 (TWD)</span> → 換匯環節產生匯率風險！
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 互動式滑桿：日圓升貶 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="p-4 rounded-lg border mb-4"
        style={{ backgroundColor: `${BRAND.primary}05` }}
      >
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium" style={{ color: BRAND.primary }}>
            日圓對台幣升貶幅度
          </label>
          <span
            className="text-lg font-bold"
            style={{ color: jpyChange >= 0 ? BRAND.danger : BRAND.story }}
          >
            {jpyChange > 0 ? "+" : ""}
            {fmtPct(jpyChange, 1)}%
          </span>
        </div>
        <input
          type="range"
          min={-5}
          max={5}
          step={0.5}
          value={jpyChange}
          onChange={(e) => setJpyChange(parseFloat(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, ${BRAND.story}, #e5e7eb, ${BRAND.danger})`,
          }}
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>-5%（日圓貶值）</span>
          <span
            className="cursor-pointer font-medium"
            style={{ color: BRAND.primary }}
            onClick={() => setJpyChange(0)}
          >
            0%（不變）
          </span>
          <span>+5%（日圓升值）</span>
        </div>
      </motion.div>

      {/* 成本對比 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-2 gap-3 mb-4"
      >
        <div
          className="p-4 rounded-lg text-center border-2"
          style={{ borderColor: BRAND.story, backgroundColor: `${BRAND.story}08` }}
        >
          <div className="text-xs text-gray-500 mb-1">方案 A：借日圓</div>
          <div className="text-2xl font-bold" style={{ color: BRAND.story }}>
            {fmtPct(costCalc.scenarioACost)}%
          </div>
          <div className="text-xs text-gray-400 mt-1">
            有效成本不受匯率影響
          </div>
          <motion.div
            key={`a-${jpyChange}`}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.3 }}
            className="text-xs mt-2 font-medium"
            style={{ color: BRAND.story }}
          >
            日圓升值 {jpyChange > 0 ? "+" : ""}{fmtPct(jpyChange, 1)}% → 成本不變
          </motion.div>
        </div>
        <div
          className="p-4 rounded-lg text-center border-2"
          style={{ borderColor: BRAND.danger, backgroundColor: `${BRAND.danger}08` }}
        >
          <div className="text-xs text-gray-500 mb-1">方案 B：借台幣</div>
          <motion.div
            key={`b-${jpyChange}`}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="text-2xl font-bold"
            style={{
              color:
                costCalc.scenarioBEffectiveCost <= costCalc.scenarioBBaseCost
                  ? BRAND.story
                  : BRAND.danger,
            }}
          >
            {fmtPct(costCalc.scenarioBEffectiveCost)}%
          </motion.div>
          <div className="text-xs text-gray-400 mt-1">
            有效成本隨匯率波動
          </div>
          <motion.div
            key={`b-detail-${jpyChange}`}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.3 }}
            className="text-xs mt-2 font-medium"
            style={{
              color:
                jpyChange < 0 ? BRAND.danger : jpyChange > 0 ? BRAND.story : BRAND.primary,
            }}
          >
            {jpyChange === 0
              ? "匯率不變 → 基準成本"
              : jpyChange > 0
              ? `日圓升值 → 營收換匯有利，實際成本 ${fmtPct(costCalc.scenarioBEffectiveCost)}%`
              : `日圓貶值 → 營收換匯不利，實際成本 ${fmtPct(costCalc.scenarioBEffectiveCost)}%`}
          </motion.div>
        </div>
      </motion.div>

      {/* 視覺化差異條 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mb-5"
      >
        <div className="text-xs text-gray-500 text-center mb-2">
          成本差異可視化
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs w-16 text-right" style={{ color: BRAND.story }}>
            方案 A
          </div>
          <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden relative">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: BRAND.story }}
              animate={{ width: `${(costCalc.scenarioACost / 10) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-600">
              {fmtPct(costCalc.scenarioACost)}%
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className="text-xs w-16 text-right" style={{ color: BRAND.danger }}>
            方案 B
          </div>
          <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden relative">
            <motion.div
              className="h-full rounded-full"
              style={{
                backgroundColor:
                  costCalc.scenarioBEffectiveCost > costCalc.scenarioBBaseCost
                    ? BRAND.danger
                    : BRAND.accent,
              }}
              animate={{
                width: `${Math.max(0, Math.min(100, (costCalc.scenarioBEffectiveCost / 10) * 100))}%`,
              }}
              transition={{ duration: 0.5 }}
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-600">
              {fmtPct(costCalc.scenarioBEffectiveCost)}%
            </span>
          </div>
        </div>
      </motion.div>

      {/* 總結卡片 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="text-center text-sm p-4 rounded-lg"
        style={{ backgroundColor: `${BRAND.accent}15`, color: "#374151" }}
      >
        <span className="font-bold" style={{ color: BRAND.accent }}>
          實務智慧：
        </span>{" "}
        台積電 70% 美元營收 + 美元揚基債 = 完美自然避險。{" "}
        <span className="font-bold" style={{ color: BRAND.primary }}>
          收入幣別配債務幣別
        </span>
        ，是跨國企業融資的第一原則。
      </motion.div>
    </motion.div>
  );
}

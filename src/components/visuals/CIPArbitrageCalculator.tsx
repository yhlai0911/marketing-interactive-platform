"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND } from "@/components/brand/BrandColors";

function fmtNum(n: number, digits = 4): string {
  return n.toFixed(digits);
}

function fmtInt(n: number): string {
  return n.toLocaleString("zh-TW", { maximumFractionDigits: 0 });
}

interface StepResult {
  label: string;
  desc: string;
  amount: string;
  currency: string;
}

export default function CIPArbitrageCalculator() {
  const [S, setS] = useState(0.232); // spot rate TWD/JPY
  const [Fmarket, setFmarket] = useState(0.234); // market forward rate
  const [iD, setID] = useState(2.0); // Taiwan rate %
  const [iF, setIF] = useState(0.5); // Japan rate %
  const [principal] = useState(100_000_000); // 1 億 JPY
  const [showSteps, setShowSteps] = useState(false);

  const calc = useMemo(() => {
    const iDdec = iD / 100;
    const iFdec = iF / 100;
    // CIP equilibrium forward rate
    const Fcip = S * (1 + iDdec) / (1 + iFdec);
    // Deviation
    const deviation = ((Fmarket - Fcip) / Fcip) * 100;
    // Arbitrage direction: if F_market > F_CIP, forward JPY is "expensive"
    // Strategy: borrow JPY, convert to TWD, invest in TWD, sell TWD forward
    const hasOpportunity = Math.abs(deviation) > 0.001;
    // Forward is overpriced relative to CIP → sell forward (sell TWD buy JPY at forward)
    // means we lock in buying JPY back cheaper than market implies
    const forwardOverpriced = Fmarket > Fcip;

    // Step-by-step for overpriced forward (standard CIP arb):
    // 1. Borrow principal JPY at iF
    const step1_borrow = principal;
    const step1_repay = principal * (1 + iFdec);
    // 2. Convert to TWD at spot
    const step2_twd = principal * S;
    // 3. Invest in TWD at iD
    const step3_maturity = step2_twd * (1 + iDdec);
    // 4. Sell TWD forward (buy JPY at F_market)
    // We need step1_repay JPY, which costs step1_repay * Fmarket TWD
    const step4_jpyCost = step1_repay * Fmarket;
    // 5. Profit
    const profit = step3_maturity - step4_jpyCost;

    // If forward is underpriced, reverse: borrow TWD, buy JPY spot, invest JPY, buy TWD forward
    let steps: StepResult[];
    let finalProfit: number;

    if (forwardOverpriced || !hasOpportunity) {
      // Standard direction
      finalProfit = profit;
      steps = [
        {
          label: "Step 1: 借入日圓",
          desc: `以 ${iF}% 年利率借入 ${fmtInt(step1_borrow)} JPY，到期需還 ${fmtInt(step1_repay)} JPY`,
          amount: fmtInt(step1_borrow),
          currency: "JPY",
        },
        {
          label: "Step 2: 即期換成台幣",
          desc: `以即期匯率 ${fmtNum(S)} TWD/JPY 換成台幣`,
          amount: fmtInt(Math.round(step2_twd)),
          currency: "TWD",
        },
        {
          label: "Step 3: 台灣存款",
          desc: `以 ${iD}% 年利率存入台灣銀行，1 年後本利和`,
          amount: fmtInt(Math.round(step3_maturity)),
          currency: "TWD",
        },
        {
          label: "Step 4: 遠期合約鎖定",
          desc: `用遠期匯率 ${fmtNum(Fmarket)} TWD/JPY 買回 ${fmtInt(step1_repay)} JPY，需支付`,
          amount: fmtInt(Math.round(step4_jpyCost)),
          currency: "TWD",
        },
        {
          label: "Step 5: 計算利潤",
          desc: `台灣存款本利和 - 買回日圓成本 = ${fmtInt(Math.round(step3_maturity))} - ${fmtInt(Math.round(step4_jpyCost))}`,
          amount: (finalProfit >= 0 ? "+" : "") + fmtInt(Math.round(profit)),
          currency: "TWD",
        },
      ];
    } else {
      // Reverse direction: forward underpriced
      const borrowTWD = principal * S; // borrow TWD equivalent
      const repayTWD = borrowTWD * (1 + iDdec);
      const jpyInvested = principal;
      const jpyMaturity = jpyInvested * (1 + iFdec);
      // Sell JPY forward at F_market → receive jpyMaturity * Fmarket TWD
      const twdReceived = jpyMaturity * Fmarket;
      finalProfit = twdReceived - repayTWD;
      steps = [
        {
          label: "Step 1: 借入台幣",
          desc: `以 ${iD}% 年利率借入 ${fmtInt(Math.round(borrowTWD))} TWD，到期需還 ${fmtInt(Math.round(repayTWD))} TWD`,
          amount: fmtInt(Math.round(borrowTWD)),
          currency: "TWD",
        },
        {
          label: "Step 2: 即期換成日圓",
          desc: `以即期匯率 ${fmtNum(S)} TWD/JPY 換成日圓`,
          amount: fmtInt(jpyInvested),
          currency: "JPY",
        },
        {
          label: "Step 3: 日本存款",
          desc: `以 ${iF}% 年利率存入日本銀行，1 年後本利和`,
          amount: fmtInt(Math.round(jpyMaturity)),
          currency: "JPY",
        },
        {
          label: "Step 4: 遠期合約鎖定",
          desc: `用遠期匯率 ${fmtNum(Fmarket)} TWD/JPY 賣出 ${fmtInt(Math.round(jpyMaturity))} JPY，可得`,
          amount: fmtInt(Math.round(twdReceived)),
          currency: "TWD",
        },
        {
          label: "Step 5: 計算利潤",
          desc: `賣出日圓所得 - 台幣貸款本利 = ${fmtInt(Math.round(twdReceived))} - ${fmtInt(Math.round(repayTWD))}`,
          amount: (finalProfit >= 0 ? "+" : "") + fmtInt(Math.round(finalProfit)),
          currency: "TWD",
        },
      ];
    }

    return { Fcip, deviation, hasOpportunity, forwardOverpriced, steps, finalProfit };
  }, [S, Fmarket, iD, iF, principal]);

  const profitColor = calc.finalProfit >= 0 ? BRAND.story : BRAND.danger;

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
        CIP 套利計算器
      </h4>
      <p className="text-center text-xs text-gray-500 mb-5">
        拋補利率平價 — 逐步套利演算
      </p>

      {/* 輸入面板 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="p-3 rounded-lg border text-center">
          <label className="text-xs text-gray-500 block mb-1">即期匯率 S</label>
          <div className="flex items-center justify-center gap-1">
            <input
              type="number"
              value={S}
              onChange={(e) => setS(parseFloat(e.target.value) || 0.001)}
              className="w-20 px-2 py-1 border rounded text-sm text-center"
              step={0.001}
              min={0.001}
            />
          </div>
          <div className="text-xs text-gray-400 mt-0.5">TWD/JPY</div>
        </div>
        <div className="p-3 rounded-lg border text-center">
          <label className="text-xs text-gray-500 block mb-1">市場遠期 F</label>
          <div className="flex items-center justify-center gap-1">
            <input
              type="number"
              value={Fmarket}
              onChange={(e) => setFmarket(parseFloat(e.target.value) || 0.001)}
              className="w-20 px-2 py-1 border rounded text-sm text-center"
              step={0.001}
              min={0.001}
            />
          </div>
          <div className="text-xs text-gray-400 mt-0.5">TWD/JPY</div>
        </div>
        <div className="p-3 rounded-lg border text-center">
          <label className="text-xs text-gray-500 block mb-1">台灣利率 i_d</label>
          <div className="flex items-center justify-center gap-1">
            <input
              type="number"
              value={iD}
              onChange={(e) => setID(parseFloat(e.target.value) || 0)}
              className="w-16 px-2 py-1 border rounded text-sm text-center"
              step={0.1}
              min={0}
              max={30}
            />
            <span className="text-sm text-gray-500">%</span>
          </div>
        </div>
        <div className="p-3 rounded-lg border text-center">
          <label className="text-xs text-gray-500 block mb-1">日本利率 i_f</label>
          <div className="flex items-center justify-center gap-1">
            <input
              type="number"
              value={iF}
              onChange={(e) => setIF(parseFloat(e.target.value) || 0)}
              className="w-16 px-2 py-1 border rounded text-sm text-center"
              step={0.1}
              min={0}
              max={30}
            />
            <span className="text-sm text-gray-500">%</span>
          </div>
        </div>
      </div>

      {/* CIP 均衡遠期匯率 vs 市場遠期匯率 */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-3 rounded-lg text-center"
          style={{ backgroundColor: `${BRAND.primary}08` }}
        >
          <div className="text-xs text-gray-500 mb-1">CIP 均衡遠期匯率</div>
          <div className="font-bold text-lg" style={{ color: BRAND.primary }}>
            {fmtNum(calc.Fcip)}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">
            F = S x (1+i_d)/(1+i_f)
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-3 rounded-lg text-center"
          style={{ backgroundColor: `${BRAND.accent}10` }}
        >
          <div className="text-xs text-gray-500 mb-1">市場遠期匯率</div>
          <div className="font-bold text-lg" style={{ color: BRAND.accent }}>
            {fmtNum(Fmarket)}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">F_market</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-3 rounded-lg text-center"
          style={{
            backgroundColor: calc.hasOpportunity
              ? `${BRAND.danger}10`
              : `${BRAND.story}10`,
          }}
        >
          <div className="text-xs text-gray-500 mb-1">偏差幅度</div>
          <div
            className="font-bold text-lg"
            style={{
              color: calc.hasOpportunity ? BRAND.danger : BRAND.story,
            }}
          >
            {calc.deviation > 0 ? "+" : ""}
            {calc.deviation.toFixed(3)}%
          </div>
          <div className="text-xs text-gray-400 mt-0.5">
            {calc.hasOpportunity ? "套利機會存在!" : "無套利機會"}
          </div>
        </motion.div>
      </div>

      {/* 套利方向提示 */}
      {calc.hasOpportunity && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm p-3 rounded-lg mb-4"
          style={{ backgroundColor: `${BRAND.story}10`, color: BRAND.story }}
        >
          {calc.forwardOverpriced
            ? "遠期匯率偏高 → 借日圓、投資台幣、賣遠期台幣"
            : "遠期匯率偏低 → 借台幣、投資日圓、買遠期台幣"}
        </motion.div>
      )}

      {/* 展開套利步驟按鈕 */}
      <div className="text-center mb-4">
        <button
          onClick={() => setShowSteps(!showSteps)}
          className="px-5 py-2 rounded-full text-sm font-medium transition-colors border"
          style={{
            borderColor: BRAND.primary,
            backgroundColor: showSteps ? BRAND.primary : "#fff",
            color: showSteps ? "#fff" : BRAND.primary,
          }}
        >
          {showSteps ? "收起步驟" : "展開 5 步驟套利流程"}
        </button>
      </div>

      {/* 套利步驟 */}
      <AnimatePresence>
        {showSteps && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-5"
          >
            <div className="space-y-3">
              {calc.steps.map((step, i) => {
                const isLast = i === calc.steps.length - 1;
                const stepColor = isLast ? profitColor : BRAND.primary;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className="flex items-start gap-3 p-3 rounded-lg border"
                    style={{
                      borderColor: isLast ? profitColor : "#e5e7eb",
                      backgroundColor: isLast ? `${profitColor}08` : "#fff",
                    }}
                  >
                    {/* 圓形步驟號 */}
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: stepColor }}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-sm font-bold mb-0.5"
                        style={{ color: stepColor }}
                      >
                        {step.label}
                      </div>
                      <div className="text-xs text-gray-600">{step.desc}</div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div
                        className="font-bold text-sm"
                        style={{ color: isLast ? profitColor : "#374151" }}
                      >
                        {step.amount}
                      </div>
                      <div className="text-xs text-gray-400">
                        {step.currency}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 核心結論 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center text-sm p-3 rounded-lg"
        style={{ backgroundColor: `${BRAND.accent}15`, color: "#374151" }}
      >
        <span className="font-bold" style={{ color: BRAND.accent }}>
          CIP 結論：
        </span>{" "}
        {calc.hasOpportunity ? (
          <>
            市場遠期偏離 CIP 均衡{" "}
            <span className="font-bold" style={{ color: BRAND.danger }}>
              {Math.abs(calc.deviation).toFixed(3)}%
            </span>
            ，以 {fmtInt(principal)} JPY 本金可獲利{" "}
            <span className="font-bold" style={{ color: profitColor }}>
              {fmtInt(Math.abs(Math.round(calc.finalProfit)))} TWD
            </span>
          </>
        ) : (
          "市場遠期匯率等於 CIP 均衡值，無套利空間 — 這就是高效率市場的結果"
        )}
      </motion.div>
    </motion.div>
  );
}

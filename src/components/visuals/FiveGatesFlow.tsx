"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { BRAND } from "@/components/brand/BrandColors";

function fmtNum(n: number, digits = 0): string {
  return n.toLocaleString("zh-TW", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}

interface FiveGatesFlowProps {
  ebit?: number; // default 10000 (千 THB)
  depreciation?: number; // default 5000 (千 THB)
  localTaxRate?: number; // default 0.20
  whtRate?: number; // default 0.10
  exchangeRate?: number; // default 0.882 (TWD/THB, Year 1)
  restricted?: boolean; // default false (no restriction for Thailand)
}

interface GateInfo {
  key: string;
  label: string;
  sublabel: string;
  color: string;
  icon: string;
  amountBefore: number;
  amountAfter: number;
  currency: string;
  description: string;
}

export default function FiveGatesFlow({
  ebit = 10000,
  depreciation = 5000,
  localTaxRate = 0.20,
  whtRate = 0.10,
  exchangeRate = 0.882,
  restricted = false,
}: FiveGatesFlowProps) {
  const calc = useMemo(() => {
    // Starting: EBIT after local tax + depreciation
    const ebitAfterTax = ebit * (1 - localTaxRate);
    const startCF = ebitAfterTax + depreciation;

    // Gate 1: local tax already applied above
    const afterLocalTax = startCF;

    // Gate 2: withholding tax on remittance
    const afterWHT = afterLocalTax * (1 - whtRate);

    // Gate 3: FX conversion THB -> TWD
    const afterFX = afterWHT * exchangeRate;

    // Gate 4: remittance restrictions
    const afterRestriction = restricted ? afterFX * 0.5 : afterFX;

    // Gate 5: foreign tax credit (Taiwan credit for taxes paid abroad)
    // Simplified: if Taiwan rate = 20% and foreign effective rate >= 20%, net additional = 0
    const afterCredit = afterRestriction; // net effect ~0 when rates are similar

    return {
      ebitAfterTax,
      startCF,
      afterLocalTax,
      afterWHT,
      afterFX,
      afterRestriction,
      afterCredit,
    };
  }, [ebit, depreciation, localTaxRate, whtRate, exchangeRate, restricted]);

  const gates: GateInfo[] = useMemo(
    () => [
      {
        key: "localTax",
        label: "Gate 1：當地稅",
        sublabel: `稅率 ${(localTaxRate * 100).toFixed(0)}%`,
        color: BRAND.danger,
        icon: "1",
        amountBefore: ebit + depreciation,
        amountAfter: calc.afterLocalTax,
        currency: "千 THB",
        description: `EBIT ${fmtNum(ebit)} x (1-${(localTaxRate * 100).toFixed(0)}%) + 折舊 ${fmtNum(depreciation)} = ${fmtNum(Math.round(calc.afterLocalTax))}`,
      },
      {
        key: "wht",
        label: "Gate 2：預扣稅",
        sublabel: `WHT ${(whtRate * 100).toFixed(0)}%`,
        color: BRAND.accent,
        icon: "2",
        amountBefore: calc.afterLocalTax,
        amountAfter: calc.afterWHT,
        currency: "千 THB",
        description: `${fmtNum(Math.round(calc.afterLocalTax))} x (1-${(whtRate * 100).toFixed(0)}%) = ${fmtNum(Math.round(calc.afterWHT))}`,
      },
      {
        key: "fx",
        label: "Gate 3：匯率轉換",
        sublabel: `THB \u2192 TWD @ ${exchangeRate}`,
        color: BRAND.primary,
        icon: "3",
        amountBefore: calc.afterWHT,
        amountAfter: calc.afterFX,
        currency: "千 TWD",
        description: `${fmtNum(Math.round(calc.afterWHT))} THB x ${exchangeRate} = ${fmtNum(Math.round(calc.afterFX))} TWD`,
      },
      {
        key: "restriction",
        label: "Gate 4：匯回限制",
        sublabel: restricted ? "限制 50%" : "泰國：無限制",
        color: restricted ? BRAND.danger : BRAND.story,
        icon: "4",
        amountBefore: calc.afterFX,
        amountAfter: calc.afterRestriction,
        currency: "千 TWD",
        description: restricted
          ? `匯回上限 50%：${fmtNum(Math.round(calc.afterFX))} x 0.5 = ${fmtNum(Math.round(calc.afterRestriction))}`
          : `泰國無匯回限制，全額 ${fmtNum(Math.round(calc.afterRestriction))} 可匯回母公司`,
      },
      {
        key: "credit",
        label: "Gate 5：稅務抵免",
        sublabel: "台灣：可抵免",
        color: BRAND.story,
        icon: "5",
        amountBefore: calc.afterRestriction,
        amountAfter: calc.afterCredit,
        currency: "千 TWD",
        description: `台灣稅率 20% \u2248 泰國有效稅率，外國稅額抵免後淨額 \u2248 0`,
      },
    ],
    [calc, ebit, depreciation, localTaxRate, whtRate, exchangeRate, restricted]
  );

  const retentionRate = calc.afterCredit / ((ebit + depreciation) * exchangeRate) * 100;

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
        五道關卡：從子公司到母公司
      </h4>
      <p className="text-center text-xs text-gray-500 mb-5">
        子公司現金流匯回母公司的五道關卡與損耗
      </p>

      {/* === Horizontal Flow Diagram === */}
      <div className="relative mb-6">
        {/* Start Box */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center p-3 rounded-xl border-2 mb-3"
          style={{
            borderColor: BRAND.primary,
            backgroundColor: `${BRAND.primary}10`,
          }}
        >
          <div className="text-center">
            <div className="text-xs text-gray-500">子公司營業現金流（泰銖）</div>
            <div className="text-2xl font-bold" style={{ color: BRAND.primary }}>
              {fmtNum(ebit + depreciation)} 千 THB
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              EBIT {fmtNum(ebit)} + 折舊 {fmtNum(depreciation)}
            </div>
          </div>
        </motion.div>

        {/* Flow Arrow */}
        <div className="flex justify-center mb-2">
          <motion.svg
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke={BRAND.neutral}
            strokeWidth="2"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </motion.svg>
        </div>

        {/* === Gate Cards === */}
        <div className="space-y-2">
          {gates.map((gate, i) => {
            const isConversion = gate.key === "fx";
            const hasLeakage = !isConversion && gate.amountBefore !== gate.amountAfter;
            const leakageAmount = gate.amountBefore - gate.amountAfter;

            return (
              <motion.div
                key={gate.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.12 }}
              >
                {/* Gate Bar */}
                <div
                  className="relative flex items-center gap-3 p-3 rounded-lg border-l-4 bg-white shadow-sm"
                  style={{ borderLeftColor: gate.color }}
                >
                  {/* Gate Number Badge */}
                  <div
                    className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm"
                    style={{ backgroundColor: gate.color }}
                  >
                    {gate.icon}
                  </div>

                  {/* Gate Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold" style={{ color: gate.color }}>
                        {gate.label}
                      </span>
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">
                        {gate.sublabel}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {gate.description}
                    </div>
                  </div>

                  {/* Amount After */}
                  <div className="flex-shrink-0 text-right">
                    {hasLeakage && (
                      <div className="text-xs line-through text-gray-400">
                        {fmtNum(Math.round(gate.amountBefore))}
                      </div>
                    )}
                    <div className="font-bold text-sm" style={{ color: gate.color }}>
                      {fmtNum(Math.round(gate.amountAfter))}
                    </div>
                    <div className="text-xs text-gray-400">{gate.currency}</div>
                    {hasLeakage && leakageAmount > 0 && (
                      <div className="text-xs font-medium" style={{ color: BRAND.danger }}>
                        -{fmtNum(Math.round(leakageAmount))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Arrow between gates */}
                {i < gates.length - 1 && (
                  <div className="flex justify-center py-1">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={BRAND.neutral}
                      strokeWidth="2"
                      opacity={0.4}
                    >
                      <path d="M12 5v14M5 12l7 7 7-7" />
                    </svg>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Flow Arrow to End */}
        <div className="flex justify-center my-2">
          <motion.svg
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke={BRAND.neutral}
            strokeWidth="2"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </motion.svg>
        </div>

        {/* End Box */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.1 }}
          className="flex items-center justify-center p-3 rounded-xl border-2"
          style={{
            borderColor: BRAND.story,
            backgroundColor: `${BRAND.story}10`,
          }}
        >
          <div className="text-center">
            <div className="text-xs text-gray-500">母公司可用現金流（台幣）</div>
            <div className="text-2xl font-bold" style={{ color: BRAND.story }}>
              {fmtNum(Math.round(calc.afterCredit))} 千 TWD
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              通過五道關卡後的最終金額
            </div>
          </div>
        </motion.div>
      </div>

      {/* === Leakage Summary Bar === */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="mb-5"
      >
        <div className="text-xs text-gray-500 mb-2 text-center">現金流損耗比例</div>
        <div className="relative h-8 rounded-full overflow-hidden bg-gray-100">
          {/* Build stacked bar segments */}
          {(() => {
            const originalTWD = (ebit + depreciation) * exchangeRate;
            const localTaxLoss = ebit * localTaxRate * exchangeRate;
            const whtLoss = calc.afterLocalTax * whtRate * exchangeRate;
            const restrictionLoss = restricted ? calc.afterFX * 0.5 : 0;
            const survived = calc.afterCredit;
            const total = originalTWD;

            const segments = [
              { label: "當地稅", value: localTaxLoss, color: BRAND.danger },
              { label: "預扣稅", value: whtLoss, color: BRAND.accent },
              { label: "匯回限制", value: restrictionLoss, color: "#9b59b6" },
              { label: "母公司實收", value: survived, color: BRAND.story },
            ].filter((s) => s.value > 0);

            let offset = 0;
            return segments.map((seg) => {
              const widthPct = (seg.value / total) * 100;
              const left = offset;
              offset += widthPct;
              return (
                <motion.div
                  key={seg.label}
                  initial={{ width: 0 }}
                  animate={{ width: `${widthPct}%` }}
                  transition={{ delay: 1.3, duration: 0.6 }}
                  className="absolute top-0 h-full flex items-center justify-center"
                  style={{
                    left: `${left}%`,
                    backgroundColor: seg.color,
                  }}
                >
                  {widthPct > 8 && (
                    <span className="text-white text-xs font-medium truncate px-1">
                      {seg.label} {widthPct.toFixed(0)}%
                    </span>
                  )}
                </motion.div>
              );
            });
          })()}
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
          <span>0%</span>
          <span>原始 {fmtNum(Math.round((ebit + depreciation) * exchangeRate))} 千 TWD</span>
          <span>100%</span>
        </div>
      </motion.div>

      {/* === Key Metrics === */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="p-3 rounded-lg text-center"
          style={{ backgroundColor: `${BRAND.danger}10` }}
        >
          <div className="text-xs text-gray-500 mb-1">稅務損耗</div>
          <div className="font-bold text-sm" style={{ color: BRAND.danger }}>
            {fmtNum(Math.round(ebit * localTaxRate + calc.afterLocalTax * whtRate))}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">千 THB</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="p-3 rounded-lg text-center"
          style={{ backgroundColor: `${BRAND.primary}10` }}
        >
          <div className="text-xs text-gray-500 mb-1">匯率效果</div>
          <div className="font-bold text-sm" style={{ color: BRAND.primary }}>
            x {exchangeRate}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">TWD/THB</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="p-3 rounded-lg text-center"
          style={{ backgroundColor: `${BRAND.story}10` }}
        >
          <div className="text-xs text-gray-500 mb-1">實收比率</div>
          <div className="font-bold text-sm" style={{ color: BRAND.story }}>
            {retentionRate.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-400 mt-0.5">母公司實收</div>
        </motion.div>
      </div>

      {/* === Core Insight === */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.7 }}
        className="text-center text-sm p-3 rounded-lg mb-3"
        style={{ backgroundColor: `${BRAND.danger}10`, color: "#374151" }}
      >
        <span className="font-bold" style={{ color: BRAND.danger }}>
          關鍵提醒：
        </span>{" "}
        子公司帳上的 {fmtNum(ebit + depreciation)} 千 THB 營業現金流，
        經過五道關卡後母公司實際收到{" "}
        <span className="font-bold" style={{ color: BRAND.story }}>
          {fmtNum(Math.round(calc.afterCredit))} 千 TWD
        </span>
        {" "}— 子公司賺錢 {"\u2260"} 母公司賺錢
      </motion.div>

      {/* === Analogy === */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="text-center text-sm p-3 rounded-lg"
        style={{ backgroundColor: `${BRAND.accent}15`, color: "#374151" }}
      >
        <span className="font-bold" style={{ color: BRAND.accent }}>
          國際資本預算原則：
        </span>{" "}
        必須以「母公司實際收到的現金流」為基礎計算 NPV，而非子公司帳面利潤。
        五道關卡中任何一道都可能大幅改變投資案的可行性判斷
      </motion.div>
    </motion.div>
  );
}

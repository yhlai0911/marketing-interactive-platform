"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND } from "@/components/brand/BrandColors";

interface Strategy {
  key: string;
  label: string;
  subtitle: string;
  example: string;
  color: string;
}

const STRATEGIES: Strategy[] = [
  { key: "undiff", label: "無差異行銷", subtitle: "一套方案打全市場", example: "台灣銀行的「一般活存」，對所有客戶提供相同利率與服務", color: BRAND.neutral },
  { key: "diff", label: "差異化行銷", subtitle: "多套方案攻不同區隔", example: "國泰金控針對學生、上班族、退休族分別設計不同理財產品線", color: BRAND.story },
  { key: "conc", label: "集中化行銷", subtitle: "專攻一個區隔做到最強", example: "富誠 FinTech 聚焦 25-35 歲小資族，深耕微型投資服務", color: BRAND.primary },
  { key: "micro", label: "微型行銷", subtitle: "針對個人量身打造", example: "私人銀行為超高淨值客戶提供一對一資產配置方案", color: BRAND.accent },
  { key: "niche", label: "利基行銷", subtitle: "找到被忽略的小角落", example: "專做外籍移工金融服務的新創，切入大銀行不碰的市場", color: BRAND.danger },
];

/* SVG visual for each strategy type */
function StrategyVisual({ type, active }: { type: string; active: boolean }) {
  const r = 14;
  const cx = 60;
  const cy = 40;
  const op = active ? 1 : 0.5;

  return (
    <svg width="120" height="80" viewBox="0 0 120 80" className="mx-auto">
      {type === "undiff" && (
        <circle cx={cx} cy={cy} r={30} fill={BRAND.neutral} opacity={op * 0.3} stroke={BRAND.neutral} strokeWidth={1.5} />
      )}
      {type === "diff" && (
        <>
          <circle cx={35} cy={30} r={r} fill={BRAND.story} opacity={op * 0.4} stroke={BRAND.story} strokeWidth={1.5} />
          <circle cx={65} cy={25} r={r} fill={BRAND.primary} opacity={op * 0.4} stroke={BRAND.primary} strokeWidth={1.5} />
          <circle cx={90} cy={35} r={r} fill={BRAND.accent} opacity={op * 0.4} stroke={BRAND.accent} strokeWidth={1.5} />
          <circle cx={50} cy={55} r={r} fill={BRAND.danger} opacity={op * 0.4} stroke={BRAND.danger} strokeWidth={1.5} />
        </>
      )}
      {type === "conc" && (
        <>
          <circle cx={30} cy={35} r={r} fill="#ddd" opacity={0.3} />
          <circle cx={60} cy={30} r={r} fill="#ddd" opacity={0.3} />
          <circle cx={85} cy={40} r={r} fill={BRAND.primary} opacity={op * 0.6} stroke={BRAND.primary} strokeWidth={2} />
          <circle cx={50} cy={58} r={r} fill="#ddd" opacity={0.3} />
        </>
      )}
      {type === "micro" && (
        <>
          {[20,38,56,74,92].map((x) =>
            [22,40,58].map((y) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r={6} fill={BRAND.accent} opacity={op * 0.5} stroke={BRAND.accent} strokeWidth={0.8} />
            ))
          )}
        </>
      )}
      {type === "niche" && (
        <>
          <rect x={10} y={10} width={100} height={60} rx={4} fill="#eee" opacity={0.3} />
          <path d="M75 25 L100 15 L105 45 L80 55 Z" fill={BRAND.danger} opacity={op * 0.4} stroke={BRAND.danger} strokeWidth={1.5} />
        </>
      )}
    </svg>
  );
}

export default function TargetingTypeMatrix() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto"
    >
      <h4 className="text-center font-bold text-lg mb-1" style={{ color: BRAND.primary }}>
        五種目標市場策略
      </h4>
      <p className="text-center text-xs text-gray-500 mb-5">
        點擊圖示展開說明與金融業案例
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
        {STRATEGIES.map((s, i) => {
          const isOpen = selected === s.key;
          return (
            <motion.button
              key={s.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i }}
              onClick={() => setSelected(isOpen ? null : s.key)}
              className="rounded-xl p-3 border-2 text-center transition-all cursor-pointer"
              style={{
                borderColor: isOpen ? s.color : `${s.color}30`,
                backgroundColor: isOpen ? `${s.color}08` : "#fff",
              }}
            >
              <StrategyVisual type={s.key} active={isOpen || selected === null} />
              <div className="text-sm font-bold mt-1" style={{ color: s.color }}>{s.label}</div>
              <div className="text-xs text-gray-400">{s.subtitle}</div>
            </motion.button>
          );
        })}
      </div>

      {/* Expanded Detail */}
      <AnimatePresence mode="wait">
        {selected && (() => {
          const s = STRATEGIES.find((x) => x.key === selected)!;
          return (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div
                className="p-4 rounded-xl border-l-4"
                style={{ borderLeftColor: s.color, backgroundColor: `${s.color}08` }}
              >
                <div className="font-bold text-sm mb-1" style={{ color: s.color }}>{s.label}</div>
                <div className="text-sm text-gray-600 mb-2">{s.subtitle}</div>
                <div className="text-xs text-gray-500">
                  <span className="font-bold" style={{ color: BRAND.accent }}>金融業案例：</span>{s.example}
                </div>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-xs text-gray-400 mt-4"
      >
        富誠 FinTech 選擇「集中化行銷」策略，專注服務年輕小資族群
      </motion.p>
    </motion.div>
  );
}

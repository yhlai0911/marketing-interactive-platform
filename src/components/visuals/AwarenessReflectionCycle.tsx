"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND } from "@/components/brand/BrandColors";

const STAGES = [
  { label: "覺察", q: "我注意到了什麼？", color: BRAND.primary, detail: "觀察生活中的金融行銷現象：銀行廣告、理財推薦、社群業配。先記錄你看到了什麼。", angle: -90 },
  { label: "分析", q: "為什麼會這樣？", color: BRAND.accent, detail: "運用行銷理論框架（如 4P、STP）分析觀察到的現象背後的策略邏輯與商業動機。", angle: 0 },
  { label: "反思", q: "這對我有什麼意義？", color: BRAND.story, detail: "連結個人經驗：這個行銷手法對我有效嗎？我的消費決策是理性的還是被設計的？", angle: 90 },
  { label: "行動", q: "我要怎麼做？", color: BRAND.danger, detail: "將洞察轉化為具體行動：優化自己的理財選擇，或設計更有溫度的行銷方案。", angle: 180 },
];

const R = 110, CX = 160, CY = 160;

export default function AwarenessReflectionCycle() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-3xl mx-auto">
      <h4 className="text-center font-bold text-lg mb-1" style={{ color: BRAND.primary }}>覺察與反思的學習循環</h4>
      <p className="text-center text-xs text-gray-500 mb-4">點擊每個階段查看說明</p>

      <div className="flex justify-center mb-4">
        <svg viewBox="0 0 320 320" className="w-full max-w-xs">
          <motion.path d={`M ${CX} ${CY - R + 15} A ${R - 15} ${R - 15} 0 1 1 ${CX - 1} ${CY - R + 15}`} fill="none" stroke="#e5e7eb" strokeWidth="3" strokeDasharray="8 6" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 0.3 }} />
          <motion.polygon points={`${CX + 6},${CY - R + 6} ${CX - 2},${CY - R + 18} ${CX + 12},${CY - R + 18}`} fill="#d1d5db" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} />
          {STAGES.map((s, i) => {
            const rad = (s.angle * Math.PI) / 180;
            const x = CX + R * Math.cos(rad), y = CY + R * Math.sin(rad);
            return (
              <g key={s.label} onClick={() => setActive(active === i ? null : i)} className="cursor-pointer">
                <motion.circle cx={x} cy={y} r="36" fill={active === i ? `${s.color}20` : "#fff"} stroke={s.color} strokeWidth={active === i ? 3 : 2} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + i * 0.15 }} whileHover={{ scale: 1.1 }} />
                <text x={x} y={y - 6} textAnchor="middle" fontSize="14" fontWeight="bold" fill={s.color}>{s.label}</text>
                <text x={x} y={y + 12} textAnchor="middle" fontSize="8" fill="#9CA3AF">{s.q}</text>
                <circle cx={x + 24} cy={y - 24} r="10" fill={s.color} />
                <text x={x + 24} y={y - 20} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fff">{i + 1}</text>
              </g>
            );
          })}
          <text x={CX} y={CY - 6} textAnchor="middle" fontSize="11" fill="#6B7280" fontWeight="bold">學習</text>
          <text x={CX} y={CY + 10} textAnchor="middle" fontSize="11" fill="#6B7280" fontWeight="bold">循環</text>
        </svg>
      </div>

      <AnimatePresence mode="wait">
        {active !== null && (
          <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-4 rounded-lg border-l-4 mb-4" style={{ borderColor: STAGES[active].color, backgroundColor: `${STAGES[active].color}08` }}>
            <div className="font-bold text-sm mb-1" style={{ color: STAGES[active].color }}>Step {active + 1}：{STAGES[active].label} — {STAGES[active].q}</div>
            <div className="text-sm text-gray-600">{STAGES[active].detail}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="text-center text-xs text-gray-400">
        這個循環沒有終點——每一次行動都會帶來新的覺察
      </motion.div>
    </motion.div>
  );
}

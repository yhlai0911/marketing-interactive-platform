"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND } from "@/components/brand/BrandColors";

const PS = [
  { en: "Product", zh: "產品", q: "設計什麼？", color: BRAND.primary, ex: "基金定期定額、智能理財機器人、退休規劃方案", cx: 200, cy: 60 },
  { en: "Price", zh: "價格", q: "收多少？", color: BRAND.accent, ex: "管理費率、手續費折扣、零申購費優惠", cx: 340, cy: 200 },
  { en: "Place", zh: "通路", q: "怎麼給？", color: BRAND.story, ex: "手機 APP、網路銀行、實體分行、第三方平台", cx: 200, cy: 340 },
  { en: "Promotion", zh: "推廣", q: "怎麼說？", color: BRAND.danger, ex: "理財講座、KOL 合作、社群內容行銷、口碑推薦", cx: 60, cy: 200 },
];
const EXT = [
  { en: "People", zh: "人員", d: "理財顧問的專業素養與服務態度" },
  { en: "Process", zh: "流程", d: "開戶到投資的順暢體驗" },
  { en: "Physical Evidence", zh: "實體環境", d: "APP 介面、品牌視覺、信任標章" },
];

export default function FourPDiagram() {
  const [act, setAct] = useState<number | null>(null);
  const [show7P, setShow7P] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-3xl mx-auto">
      <h4 className="text-center font-bold text-lg mb-1" style={{ color: BRAND.primary }}>4P 行銷組合</h4>
      <p className="text-center text-xs text-gray-500 mb-4">點擊每個 P 查看金融業實例</p>

      <div className="flex justify-center mb-4">
        <svg viewBox="0 0 400 400" className="w-full max-w-sm">
          <motion.circle cx="200" cy="200" r="45" fill={`${BRAND.primary}12`} stroke={BRAND.primary} strokeWidth="2" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.4 }} />
          <text x="200" y="195" textAnchor="middle" fontSize="13" fontWeight="bold" fill={BRAND.primary}>行銷</text>
          <text x="200" y="213" textAnchor="middle" fontSize="13" fontWeight="bold" fill={BRAND.primary}>組合</text>
          {PS.map((p, i) => (
            <motion.line key={`l-${i}`} x1="200" y1="200" x2={p.cx} y2={p.cy} stroke={act === i ? p.color : `${p.color}40`} strokeWidth={act === i ? 3 : 1.5} strokeDasharray="6 4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }} />
          ))}
          {PS.map((p, i) => (
            <g key={p.en} onClick={() => setAct(act === i ? null : i)} className="cursor-pointer">
              <motion.circle cx={p.cx} cy={p.cy} r="38" fill={act === i ? `${p.color}20` : "#fff"} stroke={p.color} strokeWidth={act === i ? 3 : 2} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 + i * 0.12 }} whileHover={{ scale: 1.08 }} />
              <text x={p.cx} y={p.cy - 8} textAnchor="middle" fontSize="13" fontWeight="bold" fill={p.color}>{p.en}</text>
              <text x={p.cx} y={p.cy + 8} textAnchor="middle" fontSize="11" fill={p.color}>{p.zh}</text>
              <text x={p.cx} y={p.cy + 24} textAnchor="middle" fontSize="9" fill="#9CA3AF">{p.q}</text>
            </g>
          ))}
        </svg>
      </div>

      <AnimatePresence mode="wait">
        {act !== null && (
          <motion.div key={act} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-4 rounded-lg border-l-4 mb-4" style={{ borderColor: PS[act].color, backgroundColor: `${PS[act].color}08` }}>
            <div className="font-bold text-sm mb-1" style={{ color: PS[act].color }}>{PS[act].en}（{PS[act].zh}）— {PS[act].q}</div>
            <div className="text-sm text-gray-600"><span className="font-medium">金融業實例：</span>{PS[act].ex}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center mb-4">
        <button onClick={() => setShow7P(!show7P)} className="px-4 py-2 rounded-full text-xs font-medium border transition-colors" style={{ borderColor: BRAND.primary, backgroundColor: show7P ? BRAND.primary : "#fff", color: show7P ? "#fff" : BRAND.primary }}>
          {show7P ? "收起 7P 延伸" : "延伸到 7P（服務業）"}
        </button>
      </div>

      <AnimatePresence>
        {show7P && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="grid grid-cols-3 gap-3">
            {EXT.map((p, i) => (
              <motion.div key={p.en} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }} className="rounded-lg p-3 border text-center" style={{ borderColor: `${BRAND.primary}30`, backgroundColor: `${BRAND.primary}06` }}>
                <div className="text-xs font-bold" style={{ color: BRAND.primary }}>{p.en}（{p.zh}）</div>
                <div className="text-xs text-gray-500 mt-1">{p.d}</div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

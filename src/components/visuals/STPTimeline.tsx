"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND } from "@/components/brand/BrandColors";

interface Step {
  key: string;
  letter: string;
  label: string;
  metaphor: string;
  color: string;
  week: string;
  summary: string;
}

const STEPS: Step[] = [
  {
    key: "s", letter: "S", label: "Segmentation", metaphor: "切蛋糕",
    color: BRAND.primary, week: "W04",
    summary: "用地理、人口、心理、行為四把刀，將整個市場切成有意義的區隔。富誠發現「年輕小資族」是一塊被忽略的大蛋糕。",
  },
  {
    key: "t", letter: "T", label: "Targeting", metaphor: "瞄準靶心",
    color: BRAND.accent, week: "W05",
    summary: "以四指標評估法（規模、成長、競爭、可接觸性）挑選最有吸引力的目標區隔，決定用集中化行銷策略聚焦小資族。",
  },
  {
    key: "p", letter: "P", label: "Positioning", metaphor: "插旗佔地",
    color: BRAND.story, week: "W06",
    summary: "透過知覺定位圖找到市場空隙，撰寫定位宣言：「對於想理財卻怕被推銷的年輕人，富誠是唯一用教育取代推銷的 FinTech 品牌。」",
  },
];

/* SVG icon for each step */
function StepIcon({ type, color }: { type: string; color: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      {type === "s" && (
        /* Cake / cut icon */
        <>
          <circle cx="16" cy="16" r="12" fill={`${color}20`} stroke={color} strokeWidth="1.5" />
          <line x1="16" y1="4" x2="16" y2="28" stroke={color} strokeWidth="1.5" strokeDasharray="3 2" />
          <line x1="4" y1="16" x2="28" y2="16" stroke={color} strokeWidth="1.5" strokeDasharray="3 2" />
        </>
      )}
      {type === "t" && (
        /* Target / crosshair icon */
        <>
          <circle cx="16" cy="16" r="11" stroke={color} strokeWidth="1.5" fill="none" />
          <circle cx="16" cy="16" r="6" stroke={color} strokeWidth="1.5" fill={`${color}20`} />
          <circle cx="16" cy="16" r="2" fill={color} />
        </>
      )}
      {type === "p" && (
        /* Flag icon */
        <>
          <line x1="10" y1="6" x2="10" y2="26" stroke={color} strokeWidth="2" />
          <path d="M10 6 L24 10 L10 15 Z" fill={`${color}40`} stroke={color} strokeWidth="1.5" />
        </>
      )}
    </svg>
  );
}

export default function STPTimeline() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto"
    >
      <h4 className="text-center font-bold text-lg mb-1" style={{ color: BRAND.primary }}>
        STP 策略流程
      </h4>
      <p className="text-center text-xs text-gray-500 mb-6">
        點擊每個步驟回顧對應章節重點
      </p>

      {/* Horizontal Timeline */}
      <div className="flex items-center justify-center gap-0 mb-5">
        {STEPS.map((step, i) => (
          <div key={step.key} className="flex items-center">
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.2 }}
              onClick={() => setSelected(selected === step.key ? null : step.key)}
              className="flex flex-col items-center cursor-pointer group"
            >
              {/* Circle node */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-16 h-16 rounded-full flex items-center justify-center border-3 shadow-md transition-all"
                style={{
                  borderColor: step.color,
                  borderWidth: selected === step.key ? 3 : 2,
                  backgroundColor: selected === step.key ? `${step.color}15` : "#fff",
                  boxShadow: selected === step.key ? `0 4px 16px ${step.color}30` : undefined,
                }}
              >
                <StepIcon type={step.key} color={step.color} />
              </motion.div>
              {/* Letter */}
              <div className="text-xl font-bold mt-2" style={{ color: step.color }}>{step.letter}</div>
              <div className="text-xs font-medium" style={{ color: step.color }}>{step.label}</div>
              <div className="text-xs text-gray-400">{step.metaphor}</div>
              <div className="text-xs text-gray-300">{step.week}</div>
            </motion.button>

            {/* Arrow between steps */}
            {i < STEPS.length - 1 && (
              <motion.svg
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.2 }}
                width="48" height="20" viewBox="0 0 48 20" className="mx-1 flex-shrink-0"
              >
                <line x1="4" y1="10" x2="36" y2="10" stroke="#d1d5db" strokeWidth="2" />
                <polygon points="36,5 44,10 36,15" fill="#d1d5db" />
              </motion.svg>
            )}
          </div>
        ))}
      </div>

      {/* Expanded Section */}
      <AnimatePresence mode="wait">
        {selected && (() => {
          const step = STEPS.find((s) => s.key === selected)!;
          return (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-xl border-l-4 mb-3"
              style={{ borderLeftColor: step.color, backgroundColor: `${step.color}08` }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold" style={{ color: step.color }}>{step.letter} - {step.label}</span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${step.color}20`, color: step.color }}>
                  {step.week}
                </span>
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">{step.summary}</div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center text-sm p-3 rounded-lg"
        style={{ backgroundColor: `${BRAND.accent}10`, color: "#374151" }}
      >
        <span className="font-bold" style={{ color: BRAND.accent }}>核心邏輯：</span>{" "}
        先切（S）、再選（T）、最後定（P）—— 順序不能亂，每一步都建立在前一步的基礎上。
      </motion.div>
    </motion.div>
  );
}

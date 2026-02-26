"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BRAND = {
  primary: "#1A3C5E",
  accent: "#C9A84C",
  story: "#2A6B5A",
  danger: "#C0392B",
  neutral: "#6B7280",
};

interface Stage {
  id: number;
  name: string;
  subtitle: string;
  color: string;
  features: string[];
  example: string;
}

const STAGES: Stage[] = [
  {
    id: 1,
    name: "多通路",
    subtitle: "Multi-Channel",
    color: BRAND.neutral,
    features: ["線上線下各自獨立", "資訊可能不一致", "客戶體驗割裂", "無數據共享"],
    example: "App 和門市各管各的，客戶在 App 看到的優惠門市不知道",
  },
  {
    id: 2,
    name: "O2O",
    subtitle: "Online ↔ Offline",
    color: BRAND.accent,
    features: ["單向引流", "線上→線下或線下→線上", "有連結但不連續", "數據部分共享"],
    example: "線上領券→線下消費；門市掃碼→App 註冊",
  },
  {
    id: 3,
    name: "OMO",
    subtitle: "Online-Merge-Offline",
    color: BRAND.story,
    features: ["無縫融合", "數據即時同步", "統一客戶 ID", "任何通路開始/完成"],
    example: "講座掃碼→App 帶入紀錄→顧問看到瀏覽偏好→一致服務",
  },
];

export default function ChannelEvolutionDiagram() {
  const [activeStage, setActiveStage] = useState(2);

  return (
    <div className="p-4 space-y-4 max-w-xl mx-auto">
      <h3 className="text-lg font-bold text-center" style={{ color: BRAND.primary }}>
        通路融合三階段演進
      </h3>

      {/* Stage selector */}
      <div className="flex items-center justify-center gap-1">
        {STAGES.map((stage, i) => (
          <div key={stage.id} className="flex items-center">
            <motion.button
              onClick={() => setActiveStage(i)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative px-4 py-2 rounded-lg text-center transition-all"
              style={{
                backgroundColor: activeStage === i ? stage.color : "#f3f4f6",
                color: activeStage === i ? "#fff" : BRAND.neutral,
                border: `2px solid ${activeStage === i ? stage.color : "#e5e7eb"}`,
              }}
            >
              <div className="text-sm font-bold">{stage.name}</div>
              <div className="text-[10px] opacity-80">{stage.subtitle}</div>
            </motion.button>
            {i < STAGES.length - 1 && (
              <svg width="24" height="24" viewBox="0 0 24 24" className="mx-1">
                <path d="M8 12h8M13 8l4 4-4 4" stroke={BRAND.neutral} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        ))}
      </div>

      {/* Stage detail */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="rounded-lg p-4 space-y-3"
          style={{ backgroundColor: `${STAGES[activeStage].color}10`, border: `1px solid ${STAGES[activeStage].color}30` }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: STAGES[activeStage].color }}
            >
              {STAGES[activeStage].id}
            </div>
            <div>
              <div className="font-bold" style={{ color: STAGES[activeStage].color }}>
                {STAGES[activeStage].name}
              </div>
              <div className="text-xs" style={{ color: BRAND.neutral }}>
                {STAGES[activeStage].subtitle}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {STAGES[activeStage].features.map((f, i) => (
              <motion.div
                key={f}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-1 text-sm"
              >
                <span style={{ color: STAGES[activeStage].color }}>●</span>
                <span>{f}</span>
              </motion.div>
            ))}
          </div>

          <div className="text-xs p-2 rounded bg-white/60" style={{ color: BRAND.neutral }}>
            <span className="font-medium">範例：</span>{STAGES[activeStage].example}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Maturity indicator */}
      <div className="flex items-center gap-1">
        <span className="text-xs" style={{ color: BRAND.neutral }}>成熟度</span>
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${(activeStage + 1) * 33.3}%` }}
            transition={{ duration: 0.5 }}
            className="h-full rounded-full"
            style={{ backgroundColor: STAGES[activeStage].color }}
          />
        </div>
        <span className="text-xs font-medium" style={{ color: STAGES[activeStage].color }}>
          {activeStage === 0 ? "初階" : activeStage === 1 ? "進階" : "終極"}
        </span>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const BRAND = {
  primary: "#1A3C5E",
  accent: "#C9A84C",
  story: "#2A6B5A",
  danger: "#C0392B",
  neutral: "#6B7280",
};

interface StageData {
  letter: string;
  name: string;
  example: string;
  color: string;
  angle: number;
}

const STAGES: StageData[] = [
  { letter: "A", name: "Attention", example: "朋友 IG 分享引起注意", color: BRAND.primary, angle: -90 },
  { letter: "I", name: "Interest", example: "覺得有趣，想了解更多", color: BRAND.accent, angle: -18 },
  { letter: "S", name: "Search", example: "Google 搜尋「富誠評價」", color: BRAND.story, angle: 54 },
  { letter: "A", name: "Action", example: "下載 App，3 分鐘開戶", color: BRAND.danger, angle: 126 },
  { letter: "S", name: "Share", example: "IG 分享「我開始理財了！」", color: BRAND.neutral, angle: 198 },
];

const FEATURES = [
  { title: "自發性", desc: "消費者出於興趣搜尋和分享" },
  { title: "可信度高", desc: "83% 信任親友推薦（Nielsen 2015）" },
  { title: "成本低", desc: "企業做好產品，分享由消費者完成" },
  { title: "指數成長", desc: "每次分享觸發多個新搜尋者" },
];

export default function AISASCycleEngine() {
  const [activeStage, setActiveStage] = useState<number | null>(null);
  const [showEngine, setShowEngine] = useState(false);

  const R = 110;
  const CX = 150;
  const CY = 140;

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="flex gap-2 mb-4 justify-center">
        <button
          onClick={() => setShowEngine(false)}
          className="px-3 py-1.5 rounded-lg text-sm font-bold transition-all"
          style={{
            backgroundColor: !showEngine ? BRAND.primary : "#f3f4f6",
            color: !showEngine ? "white" : BRAND.primary,
          }}
        >
          AISAS 循環圖
        </button>
        <button
          onClick={() => setShowEngine(true)}
          className="px-3 py-1.5 rounded-lg text-sm font-bold transition-all"
          style={{
            backgroundColor: showEngine ? BRAND.story : "#f3f4f6",
            color: showEngine ? "white" : BRAND.story,
          }}
        >
          Search/Share 引擎
        </button>
      </div>

      {!showEngine ? (
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* SVG 循環圖 */}
          <svg viewBox="0 0 300 280" className="w-64 h-56 flex-shrink-0">
            {/* 連接箭頭 */}
            {STAGES.map((s, i) => {
              const next = STAGES[(i + 1) % STAGES.length];
              const rad1 = (s.angle * Math.PI) / 180;
              const rad2 = (next.angle * Math.PI) / 180;
              const x1 = CX + R * Math.cos(rad1);
              const y1 = CY + R * Math.sin(rad1);
              const x2 = CX + R * Math.cos(rad2);
              const y2 = CY + R * Math.sin(rad2);
              const midX = (x1 + x2) / 2;
              const midY = (y1 + y2) / 2;
              const bulge = 15;
              const dx = midX - CX;
              const dy = midY - CY;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const cpX = midX + (dx / dist) * bulge;
              const cpY = midY + (dy / dist) * bulge;
              const isSearchShare = i === 4;
              return (
                <motion.path
                  key={`arrow-${i}`}
                  d={`M ${x1} ${y1} Q ${cpX} ${cpY} ${x2} ${y2}`}
                  fill="none"
                  stroke={isSearchShare ? BRAND.accent : "#d1d5db"}
                  strokeWidth={isSearchShare ? 2.5 : 1.5}
                  strokeDasharray={isSearchShare ? "6 3" : "none"}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
                />
              );
            })}

            {/* 節點 */}
            {STAGES.map((s, i) => {
              const rad = (s.angle * Math.PI) / 180;
              const x = CX + R * Math.cos(rad);
              const y = CY + R * Math.sin(rad);
              const isActive = activeStage === i;
              return (
                <g key={i}>
                  <motion.circle
                    cx={x}
                    cy={y}
                    r={isActive ? 30 : 26}
                    fill={s.color}
                    opacity={isActive ? 1 : 0.85}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setActiveStage(i)}
                    onMouseLeave={() => setActiveStage(null)}
                    onClick={() => setActiveStage(activeStage === i ? null : i)}
                  />
                  <text
                    x={x}
                    y={y - 5}
                    textAnchor="middle"
                    fill="white"
                    fontSize="14"
                    fontWeight="bold"
                    pointerEvents="none"
                  >
                    {s.letter}
                  </text>
                  <text
                    x={x}
                    y={y + 10}
                    textAnchor="middle"
                    fill="white"
                    fontSize="7"
                    pointerEvents="none"
                  >
                    {s.name}
                  </text>
                </g>
              );
            })}

            {/* 中心文字 */}
            <text
              x={CX}
              y={CY - 5}
              textAnchor="middle"
              fill={BRAND.primary}
              fontSize="11"
              fontWeight="bold"
            >
              AISAS
            </text>
            <text
              x={CX}
              y={CY + 10}
              textAnchor="middle"
              fill={BRAND.neutral}
              fontSize="8"
            >
              雙向循環
            </text>
          </svg>

          {/* 說明面板 */}
          <div className="flex-1 min-w-0">
            {activeStage !== null ? (
              <motion.div
                key={activeStage}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 rounded-lg"
                style={{ backgroundColor: `${STAGES[activeStage].color}10`, borderLeft: `4px solid ${STAGES[activeStage].color}` }}
              >
                <h4 className="font-bold text-base" style={{ color: STAGES[activeStage].color }}>
                  {STAGES[activeStage].letter} — {STAGES[activeStage].name}
                </h4>
                <p className="text-sm text-gray-700 mt-1">{STAGES[activeStage].example}</p>
              </motion.div>
            ) : (
              <p className="text-sm text-gray-500 italic">
                點擊或移入圓圈查看各階段說明。Share → Attention 的虛線表示循環效應。
              </p>
            )}
          </div>
        </div>
      ) : (
        /* Search/Share 引擎四特性 */
        <div className="space-y-3">
          <p className="text-center text-sm mb-4" style={{ color: BRAND.story }}>
            Search 與 Share 形成自我強化的成長飛輪
          </p>
          <div className="grid grid-cols-2 gap-3">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-3 rounded-lg border"
                style={{ borderColor: BRAND.story }}
              >
                <h4 className="font-bold text-sm" style={{ color: BRAND.story }}>
                  {i + 1}. {f.title}
                </h4>
                <p className="text-xs text-gray-600 mt-1">{f.desc}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-500 mt-2">
            富誠的 90% 推薦數據 = Share 引擎已啟動。策略不是「買更多廣告」，而是優化分享動機和搜尋結果。
          </p>
        </div>
      )}
    </div>
  );
}

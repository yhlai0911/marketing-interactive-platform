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

interface ToolData {
  id: number;
  name: string;
  english: string;
  question: string;
  description: string;
  origin: string;
  week: string;
  isFocus: boolean;
  color: string;
}

const TOOLS: ToolData[] = [
  {
    id: 1,
    name: "人物誌",
    english: "Persona",
    question: "他是誰？",
    description:
      "將目標客群具象化為一個虛構但真實的代表性人物——姓名、年齡、職業、媒體習慣、煩惱與痛點。",
    origin: "Alan Cooper（1999）軟體設計領域",
    week: "W08（本週）",
    isFocus: true,
    color: BRAND.accent,
  },
  {
    id: 2,
    name: "同理心地圖",
    english: "Empathy Map",
    question: "他怎麼想？",
    description:
      "用六個維度深入感受消費者內心：他想什麼、聽什麼、看什麼、說什麼做什麼、痛苦是什麼、想獲得什麼。",
    origin: "Dave Gray / XPLANE（2010）",
    week: "W09",
    isFocus: false,
    color: BRAND.story,
  },
  {
    id: 3,
    name: "價值主張畫布",
    english: "Value Proposition Canvas",
    question: "你能解決他的問題嗎？",
    description:
      "比對你的產品服務能否對應消費者的任務、痛點與獲益，找到產品與客戶需求的契合點。",
    origin: "Alexander Osterwalder 等（2014）",
    week: "W10",
    isFocus: false,
    color: BRAND.primary,
  },
  {
    id: 4,
    name: "客戶旅程地圖",
    english: "Customer Journey Map",
    question: "他的體驗如何？",
    description:
      "追蹤消費者從「第一次聽到你」到「成為忠實客戶」的完整體驗歷程，找出每個接觸點的改善機會。",
    origin: "服務設計（Service Design）領域",
    week: "W15",
    isFocus: false,
    color: BRAND.neutral,
  },
];

export default function W08FourToolsProgression() {
  const [activeTool, setActiveTool] = useState<number | null>(null);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h3
        className="text-center text-lg font-bold mb-1"
        style={{ color: BRAND.primary }}
      >
        分析目標客群的四個工具
      </h3>
      <p className="text-center text-xs text-gray-500 mb-5">
        層層遞進：從「他是誰」到「他的體驗如何」。點擊各工具查看詳細說明
      </p>

      {/* 四工具橫向流程圖（SVG） */}
      <div className="overflow-x-auto pb-2">
        <svg viewBox="0 0 720 140" className="w-full min-w-[500px] h-36">
          {TOOLS.map((tool, i) => {
            const x = 40 + i * 175;
            const y = 70;
            const isActive = activeTool === tool.id;
            const boxW = 140;
            const boxH = 90;

            return (
              <g key={tool.id}>
                {/* 連接箭頭 */}
                {i < TOOLS.length - 1 && (
                  <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + i * 0.15 }}
                  >
                    <line
                      x1={x + boxW}
                      y1={y}
                      x2={x + boxW + 25}
                      y2={y}
                      stroke="#d1d5db"
                      strokeWidth={2}
                    />
                    <polygon
                      points={`${x + boxW + 25},${y - 5} ${x + boxW + 33},${y} ${x + boxW + 25},${y + 5}`}
                      fill="#d1d5db"
                    />
                  </motion.g>
                )}

                {/* 工具卡片 */}
                <motion.g
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15, type: "spring" }}
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    setActiveTool(activeTool === tool.id ? null : tool.id)
                  }
                >
                  {/* 本週焦點高亮框 */}
                  {tool.isFocus && (
                    <rect
                      x={x - boxW / 2 - 4}
                      y={y - boxH / 2 - 4}
                      width={boxW + 8}
                      height={boxH + 8}
                      rx={12}
                      fill="none"
                      stroke={BRAND.accent}
                      strokeWidth={2}
                      strokeDasharray="6 3"
                    />
                  )}

                  {/* 卡片背景 */}
                  <rect
                    x={x - boxW / 2}
                    y={y - boxH / 2}
                    width={boxW}
                    height={boxH}
                    rx={10}
                    fill={isActive ? tool.color : `${tool.color}15`}
                    stroke={tool.color}
                    strokeWidth={isActive ? 2 : 1}
                  />

                  {/* 編號圓 */}
                  <circle
                    cx={x}
                    cy={y - 22}
                    r={12}
                    fill={isActive ? "white" : tool.color}
                  />
                  <text
                    x={x}
                    y={y - 18}
                    textAnchor="middle"
                    fill={isActive ? tool.color : "white"}
                    fontSize="11"
                    fontWeight="bold"
                  >
                    {tool.id}
                  </text>

                  {/* 工具名稱 */}
                  <text
                    x={x}
                    y={y + 2}
                    textAnchor="middle"
                    fill={isActive ? "white" : tool.color}
                    fontSize="12"
                    fontWeight="bold"
                  >
                    {tool.name}
                  </text>

                  {/* 核心問題 */}
                  <text
                    x={x}
                    y={y + 18}
                    textAnchor="middle"
                    fill={isActive ? "rgba(255,255,255,0.85)" : BRAND.neutral}
                    fontSize="10"
                  >
                    {tool.question}
                  </text>

                  {/* 週次標籤 */}
                  <text
                    x={x}
                    y={y + 35}
                    textAnchor="middle"
                    fill={isActive ? "rgba(255,255,255,0.7)" : "#9ca3af"}
                    fontSize="8"
                  >
                    {tool.week}
                  </text>
                </motion.g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* 詳細說明面板 */}
      <AnimatePresence mode="wait">
        {activeTool !== null ? (
          <motion.div
            key={activeTool}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mt-4 p-4 rounded-lg"
            style={{
              backgroundColor: `${TOOLS[activeTool - 1].color}10`,
              borderLeft: `4px solid ${TOOLS[activeTool - 1].color}`,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <h4
                className="font-bold text-base"
                style={{ color: TOOLS[activeTool - 1].color }}
              >
                {TOOLS[activeTool - 1].name}（{TOOLS[activeTool - 1].english}）
              </h4>
              {TOOLS[activeTool - 1].isFocus && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: BRAND.accent }}
                >
                  本週焦點
                </span>
              )}
            </div>
            <p className="text-sm text-gray-700">
              {TOOLS[activeTool - 1].description}
            </p>
            <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-500">
              <span>
                <strong>提出者：</strong>
                {TOOLS[activeTool - 1].origin}
              </span>
              <span>
                <strong>課程週次：</strong>
                {TOOLS[activeTool - 1].week}
              </span>
            </div>
          </motion.div>
        ) : (
          <motion.p
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4 text-center text-xs text-gray-400 italic"
          >
            四個工具層層遞進、互不取代。點擊卡片查看詳細說明和學術溯源。
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

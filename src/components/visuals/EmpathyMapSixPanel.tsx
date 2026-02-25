"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BRAND = {
  primary: "#1A3C5E",
  accent: "#C9A84C",
  story: "#2A6B5A",
  danger: "#C0392B",
  neutral: "#6B7280",
};

interface PanelData {
  id: string;
  label: string;
  english: string;
  icon: string;
  color: string;
  items: string[];
}

const PANELS: PanelData[] = [
  {
    id: "think",
    label: "想法和感受",
    english: "Think & Feel",
    icon: "💭",
    color: BRAND.primary,
    items: [
      "覺得理財很複雜，怕自己不夠聰明",
      "擔心被銀行理專推銷不適合的商品",
      "「別人都在投資，我是不是落後了？」",
      "對未來有焦慮，但不知從何開始",
    ],
  },
  {
    id: "hear",
    label: "聽到什麼",
    english: "Hear",
    icon: "👂",
    color: BRAND.story,
    items: [
      "同事說：「你不理財，財不理你」",
      "爸媽唸：「存銀行利息太低了」",
      "YouTube 財經 KOL 推薦各種標的",
      "朋友轉發 LINE 群的理財文章",
    ],
  },
  {
    id: "see",
    label: "看到什麼",
    english: "See",
    icon: "👁️",
    color: "#5B8CB8",
    items: [
      "IG 上同齡人曬出投資績效截圖",
      "銀行 App 推播的基金廣告",
      "新聞報導股市創新高",
      "Dcard 理財版的討論和經驗分享",
    ],
  },
  {
    id: "saydo",
    label: "說和做",
    english: "Say & Do",
    icon: "🗣️",
    color: BRAND.accent,
    items: [
      "嘴上說「我應該要開始理財了」",
      "實際上每天下班就打電動到 12 點",
      "偶爾 Google 搜尋「新手理財」然後關掉",
      "銀行帳戶裡的錢就放著不動",
    ],
  },
  {
    id: "pains",
    label: "痛苦",
    english: "Pains",
    icon: "😣",
    color: BRAND.danger,
    items: [
      "不懂——專業術語看不懂，覺得被排除在外",
      "不信——怕被推銷，不信任金融機構",
      "不動——知道該行動但就是踏不出第一步",
      "怕犯錯——萬一賠錢怎麼辦？",
    ],
  },
  {
    id: "gains",
    label: "獲得",
    english: "Gains",
    icon: "🎯",
    color: "#4A90D9",
    items: [
      "想要 5 年內存到 50 萬結婚基金",
      "希望有簡單、不用花太多時間的理財方式",
      "想要值得信任的理財夥伴",
      "對自己的財務狀況有掌控感",
    ],
  },
];

// 六宮格布局位置定義（SVG 座標）
const LAYOUT = {
  center: { x: 300, y: 230 },
  panels: [
    { id: "think", x: 300, y: 52 },    // 上方
    { id: "hear", x: 95, y: 155 },      // 左上
    { id: "see", x: 505, y: 155 },      // 右上
    { id: "saydo", x: 300, y: 310 },    // 中下
    { id: "pains", x: 95, y: 405 },     // 左下
    { id: "gains", x: 505, y: 405 },    // 右下
  ],
};

export default function EmpathyMapSixPanel() {
  const [activePanel, setActivePanel] = useState<string | null>(null);

  const activeData = activePanel
    ? PANELS.find((p) => p.id === activePanel) ?? null
    : null;

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h3
        className="text-center text-lg font-bold mb-1"
        style={{ color: BRAND.primary }}
      >
        同理心地圖（Empathy Map）六宮格
      </h3>
      <p className="text-center text-xs text-gray-500 mb-4">
        以林志翔（28 歲軟體工程師）為例，點擊各維度查看詳細內容
      </p>

      <div className="flex flex-col items-center gap-4">
        {/* SVG 六宮格結構圖 */}
        <svg viewBox="0 0 600 480" className="w-full max-w-lg">
          {/* 連接線 */}
          {LAYOUT.panels.map((pos, i) => {
            const isActive = activePanel === pos.id;
            return (
              <motion.line
                key={`line-${pos.id}`}
                x1={LAYOUT.center.x}
                y1={LAYOUT.center.y}
                x2={pos.x}
                y2={pos.y}
                stroke={
                  isActive
                    ? PANELS[i].color
                    : "#e5e7eb"
                }
                strokeWidth={isActive ? 2.5 : 1.5}
                strokeDasharray={
                  pos.id === "pains" || pos.id === "gains"
                    ? "6 3"
                    : "none"
                }
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
              />
            );
          })}

          {/* 中心——目標客戶 */}
          <motion.g
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <circle
              cx={LAYOUT.center.x}
              cy={LAYOUT.center.y}
              r={42}
              fill={BRAND.accent}
            />
            <text
              x={LAYOUT.center.x}
              y={LAYOUT.center.y - 12}
              textAnchor="middle"
              fill="white"
              fontSize="11"
              fontWeight="bold"
            >
              林志翔
            </text>
            <text
              x={LAYOUT.center.x}
              y={LAYOUT.center.y + 3}
              textAnchor="middle"
              fill="rgba(255,255,255,0.85)"
              fontSize="9"
            >
              28 歲
            </text>
            <text
              x={LAYOUT.center.x}
              y={LAYOUT.center.y + 16}
              textAnchor="middle"
              fill="rgba(255,255,255,0.85)"
              fontSize="9"
            >
              軟體工程師
            </text>
          </motion.g>

          {/* 六個面板節點 */}
          {LAYOUT.panels.map((pos, i) => {
            const panel = PANELS[i];
            const isActive = activePanel === panel.id;

            return (
              <motion.g
                key={panel.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.3 + i * 0.1,
                  type: "spring",
                  stiffness: 180,
                }}
                style={{ cursor: "pointer" }}
                onClick={() =>
                  setActivePanel(activePanel === panel.id ? null : panel.id)
                }
              >
                {/* 痛苦/獲得高亮外圈 */}
                {(panel.id === "pains" || panel.id === "gains") && (
                  <motion.circle
                    cx={pos.x}
                    cy={pos.y}
                    r={42}
                    fill="none"
                    stroke={panel.color}
                    strokeWidth={1.5}
                    strokeDasharray="4 2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ delay: 1 + i * 0.1 }}
                  />
                )}

                {/* 節點圓 */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isActive ? 38 : 35}
                  fill={panel.color}
                  opacity={isActive ? 1 : 0.85}
                />

                {/* 圖示 */}
                <text
                  x={pos.x}
                  y={pos.y - 6}
                  textAnchor="middle"
                  fontSize="16"
                  pointerEvents="none"
                >
                  {panel.icon}
                </text>

                {/* 中文標籤 */}
                <text
                  x={pos.x}
                  y={pos.y + 13}
                  textAnchor="middle"
                  fill="white"
                  fontSize="9"
                  fontWeight="bold"
                  pointerEvents="none"
                >
                  {panel.label}
                </text>

                {/* 英文標籤 */}
                <text
                  x={pos.x}
                  y={pos.y + 24}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.7)"
                  fontSize="7"
                  pointerEvents="none"
                >
                  {panel.english}
                </text>
              </motion.g>
            );
          })}

          {/* 底部標注 */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <rect
              x={220}
              y={456}
              width={160}
              height={18}
              rx={4}
              fill={BRAND.danger}
              opacity={0.85}
            />
            <text
              x={300}
              y={468}
              textAnchor="middle"
              fill="white"
              fontSize="8"
              fontWeight="bold"
            >
              痛苦 + 獲得 = 行銷策略切入點
            </text>
          </motion.g>
        </svg>

        {/* 詳細說明面板 */}
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {activeData ? (
              <motion.div
                key={activeData.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="p-4 rounded-lg"
                style={{
                  backgroundColor: `${activeData.color}10`,
                  borderLeft: `4px solid ${activeData.color}`,
                }}
              >
                <h4
                  className="font-bold text-base flex items-center gap-2"
                  style={{ color: activeData.color }}
                >
                  <span className="text-lg">{activeData.icon}</span>
                  {activeData.label}
                  <span className="text-xs text-gray-400 font-normal">
                    {activeData.english}
                  </span>
                </h4>
                <ul className="mt-3 space-y-2">
                  {activeData.items.map((item, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                        style={{ backgroundColor: activeData.color }}
                      />
                      {item}
                    </motion.li>
                  ))}
                </ul>
                {(activeData.id === "pains" || activeData.id === "gains") && (
                  <div
                    className="mt-3 p-2 rounded text-xs"
                    style={{
                      backgroundColor: `${BRAND.accent}15`,
                      border: `1px solid ${BRAND.accent}30`,
                      color: BRAND.accent,
                    }}
                  >
                    {activeData.id === "pains"
                      ? "痛苦是行銷的切入點——找到痛苦，就知道產品該解決什麼問題。"
                      : "獲得是價值主張的方向——客戶想要什麼，你就提供什麼。"}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-4 rounded-lg border border-dashed border-gray-300"
              >
                <p className="text-sm text-gray-500 italic">
                  點擊六宮格中的各維度，查看林志翔的同理心地圖內容。
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  同理心地圖由 Dave Gray / XPLANE（2010）提出，用六個維度深入理解目標客戶的內心世界。
                  <span className="font-semibold" style={{ color: BRAND.danger }}>
                    「痛苦」
                  </span>
                  和
                  <span className="font-semibold" style={{ color: "#4A90D9" }}>
                    「獲得」
                  </span>
                  是行銷策略的核心切入點。
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

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

interface ComparisonRow {
  aspect: string;
  persona: string;
  empathyMap: string;
  personaIcon: string;
  empathyIcon: string;
}

const ROWS: ComparisonRow[] = [
  {
    aspect: "核心問題",
    persona: "他是誰？",
    empathyMap: "他怎麼想？",
    personaIcon: "🧑",
    empathyIcon: "💭",
  },
  {
    aspect: "焦點",
    persona: "外在特徵",
    empathyMap: "內在世界",
    personaIcon: "📋",
    empathyIcon: "❤️",
  },
  {
    aspect: "資料來源",
    persona: "人口統計 + 行為數據",
    empathyMap: "感受 + 動機 + 恐懼",
    personaIcon: "📊",
    empathyIcon: "🎭",
  },
  {
    aspect: "行銷用途",
    persona: "決定跟誰說話",
    empathyMap: "決定說什麼、怎麼說",
    personaIcon: "🎯",
    empathyIcon: "💬",
  },
  {
    aspect: "產出格式",
    persona: "一頁人物檔案",
    empathyMap: "六宮格便利貼牆",
    personaIcon: "📄",
    empathyIcon: "🗂️",
  },
  {
    aspect: "課程週次",
    persona: "W08 人物誌",
    empathyMap: "W09 同理心地圖",
    personaIcon: "8️⃣",
    empathyIcon: "9️⃣",
  },
];

type HighlightSide = "none" | "persona" | "empathy";

export default function EmpathyMapVsPersona() {
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const [highlightSide, setHighlightSide] = useState<HighlightSide>("none");

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h3
        className="text-center text-lg font-bold mb-1"
        style={{ color: BRAND.primary }}
      >
        人物誌 vs 同理心地圖
      </h3>
      <p className="text-center text-xs text-gray-500 mb-5">
        兩個工具互補而非替代。Hover 欄位查看差異，點擊標題高亮比較
      </p>

      {/* 頂部工具標題切換 */}
      <div className="flex gap-3 mb-5 justify-center">
        <button
          onClick={() =>
            setHighlightSide(highlightSide === "persona" ? "none" : "persona")
          }
          className="px-5 py-2.5 rounded-lg text-sm font-bold transition-all"
          style={{
            backgroundColor:
              highlightSide === "persona" ? BRAND.accent : "#f3f4f6",
            color: highlightSide === "persona" ? "white" : BRAND.accent,
            boxShadow:
              highlightSide === "persona"
                ? `0 2px 8px ${BRAND.accent}40`
                : "none",
          }}
        >
          人物誌 Persona
        </button>
        <button
          onClick={() =>
            setHighlightSide(highlightSide === "empathy" ? "none" : "empathy")
          }
          className="px-5 py-2.5 rounded-lg text-sm font-bold transition-all"
          style={{
            backgroundColor:
              highlightSide === "empathy" ? BRAND.story : "#f3f4f6",
            color: highlightSide === "empathy" ? "white" : BRAND.story,
            boxShadow:
              highlightSide === "empathy"
                ? `0 2px 8px ${BRAND.story}40`
                : "none",
          }}
        >
          同理心地圖 Empathy Map
        </button>
      </div>

      {/* 比較表格 */}
      <div className="space-y-2">
        {/* 表頭 */}
        <div className="grid grid-cols-3 gap-2 px-2 pb-2 border-b-2 border-gray-200">
          <div className="text-xs font-bold text-gray-500 text-center">
            比較面向
          </div>
          <div
            className="text-xs font-bold text-center"
            style={{ color: BRAND.accent }}
          >
            人物誌 Persona
          </div>
          <div
            className="text-xs font-bold text-center"
            style={{ color: BRAND.story }}
          >
            同理心地圖 Empathy Map
          </div>
        </div>

        {/* 表格列 */}
        {ROWS.map((row, i) => {
          const isActive = activeRow === i;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="grid grid-cols-3 gap-2 rounded-lg transition-all cursor-pointer"
              style={{
                backgroundColor: isActive ? `${BRAND.primary}08` : "transparent",
              }}
              onMouseEnter={() => setActiveRow(i)}
              onMouseLeave={() => setActiveRow(null)}
            >
              {/* 面向 */}
              <div
                className="flex items-center justify-center py-3 px-2 rounded-l-lg"
                style={{
                  backgroundColor: isActive ? `${BRAND.primary}12` : "#f9fafb",
                }}
              >
                <span
                  className="text-sm font-bold"
                  style={{ color: BRAND.primary }}
                >
                  {row.aspect}
                </span>
              </div>

              {/* 人物誌 */}
              <motion.div
                className="flex items-center gap-2 py-3 px-3 rounded-lg"
                animate={{
                  backgroundColor:
                    highlightSide === "persona" || isActive
                      ? `${BRAND.accent}12`
                      : "transparent",
                  scale: highlightSide === "persona" ? 1.02 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-base flex-shrink-0">{row.personaIcon}</span>
                <span
                  className="text-sm"
                  style={{
                    color:
                      highlightSide === "persona"
                        ? BRAND.accent
                        : BRAND.neutral,
                    fontWeight: highlightSide === "persona" ? 600 : 400,
                  }}
                >
                  {row.persona}
                </span>
              </motion.div>

              {/* 同理心地圖 */}
              <motion.div
                className="flex items-center gap-2 py-3 px-3 rounded-r-lg"
                animate={{
                  backgroundColor:
                    highlightSide === "empathy" || isActive
                      ? `${BRAND.story}12`
                      : "transparent",
                  scale: highlightSide === "empathy" ? 1.02 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-base flex-shrink-0">{row.empathyIcon}</span>
                <span
                  className="text-sm"
                  style={{
                    color:
                      highlightSide === "empathy"
                        ? BRAND.story
                        : BRAND.neutral,
                    fontWeight: highlightSide === "empathy" ? 600 : 400,
                  }}
                >
                  {row.empathyMap}
                </span>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* 底部互補說明 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={highlightSide}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="mt-5 p-4 rounded-lg"
          style={{
            backgroundColor:
              highlightSide === "persona"
                ? `${BRAND.accent}10`
                : highlightSide === "empathy"
                ? `${BRAND.story}10`
                : "#f9fafb",
            borderLeft: `4px solid ${
              highlightSide === "persona"
                ? BRAND.accent
                : highlightSide === "empathy"
                ? BRAND.story
                : "#e5e7eb"
            }`,
          }}
        >
          {highlightSide === "persona" && (
            <div>
              <h4
                className="font-bold text-sm mb-1"
                style={{ color: BRAND.accent }}
              >
                人物誌的核心價值
              </h4>
              <p className="text-sm text-gray-700">
                人物誌回答「我們要跟誰說話」——將抽象的目標市場具象化為一個有名字、有故事的人。
                它是市場區隔和目標選擇之後的落地工具，確保團隊對客戶有一致的想像。
              </p>
            </div>
          )}
          {highlightSide === "empathy" && (
            <div>
              <h4
                className="font-bold text-sm mb-1"
                style={{ color: BRAND.story }}
              >
                同理心地圖的核心價值
              </h4>
              <p className="text-sm text-gray-700">
                同理心地圖回答「我們要對他說什麼、怎麼說」——深入客戶的內心世界，
                理解他的感受、恐懼和渴望。它是從「知道客戶是誰」到「真正理解客戶」的橋樑。
              </p>
            </div>
          )}
          {highlightSide === "none" && (
            <div>
              <h4
                className="font-bold text-sm mb-1"
                style={{ color: BRAND.primary }}
              >
                互補關係
              </h4>
              <p className="text-sm text-gray-700">
                先用人物誌畫出「他是誰」，再用同理心地圖深入「他怎麼想」。
                兩者互補而非替代：人物誌提供外在輪廓，同理心地圖填入內在靈魂。
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

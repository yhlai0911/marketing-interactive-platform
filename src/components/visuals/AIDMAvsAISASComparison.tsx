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

interface StageInfo {
  letter: string;
  name: string;
  desc: string;
  color: string;
}

const AIDMA_STAGES: StageInfo[] = [
  { letter: "A", name: "Attention", desc: "看到電視廣告、報紙廣告", color: BRAND.primary },
  { letter: "I", name: "Interest", desc: "「報酬率好像不錯」", color: BRAND.accent },
  { letter: "D", name: "Desire", desc: "「我也想投資試試」", color: BRAND.story },
  { letter: "M", name: "Memory", desc: "記住品牌名稱和特色", color: BRAND.danger },
  { letter: "A", name: "Action", desc: "走進銀行開戶", color: BRAND.neutral },
];

const AISAS_STAGES: StageInfo[] = [
  { letter: "A", name: "Attention", desc: "朋友 IG 分享、短影音", color: BRAND.primary },
  { letter: "I", name: "Interest", desc: "覺得有趣、想了解更多", color: BRAND.accent },
  { letter: "S", name: "Search", desc: "Google 搜尋、PTT 爬文", color: BRAND.story },
  { letter: "A", name: "Action", desc: "下載 App、3 分鐘開戶", color: BRAND.danger },
  { letter: "S", name: "Share", desc: "IG 分享「我開始理財了！」", color: BRAND.neutral },
];

const DIMENSIONS = [
  { label: "消費者角色", aidma: "被動接收者", aisas: "主動搜尋者＋傳播者" },
  { label: "資訊流向", aidma: "單向（企業→消費者）", aisas: "雙向（消費者↔消費者）" },
  { label: "核心媒體", aidma: "電視、報紙、廣播", aisas: "搜尋引擎、社群媒體" },
  { label: "購買前", aidma: "記住等時機", aisas: "主動搜尋比較" },
  { label: "購買後", aidma: "結束", aisas: "線上分享→觸發循環" },
  { label: "行銷關鍵", aidma: "曝光量、記憶度", aisas: "搜尋力、分享力" },
];

export default function AIDMAvsAISASComparison() {
  const [activeModel, setActiveModel] = useState<"aidma" | "aisas" | "compare">("compare");

  const stages = activeModel === "aidma" ? AIDMA_STAGES : AISAS_STAGES;

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      {/* Tab 切換 */}
      <div className="flex gap-2 mb-6 justify-center">
        {[
          { key: "aidma" as const, label: "AIDMA" },
          { key: "aisas" as const, label: "AISAS" },
          { key: "compare" as const, label: "比較" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveModel(tab.key)}
            className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
            style={{
              backgroundColor: activeModel === tab.key ? BRAND.primary : "#f3f4f6",
              color: activeModel === tab.key ? "white" : BRAND.primary,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeModel !== "compare" ? (
          <motion.div
            key={activeModel}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3
              className="text-center text-lg font-bold mb-4"
              style={{ color: BRAND.primary }}
            >
              {activeModel === "aidma"
                ? "AIDMA：傳統單向模型"
                : "AISAS：數位雙向循環模型"}
            </h3>

            {/* 五階段流程 */}
            <div className="flex items-center justify-center gap-1 mb-6 flex-wrap">
              {stages.map((s, i) => (
                <div key={i} className="flex items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex flex-col items-center rounded-lg px-3 py-2 text-white min-w-[70px]"
                    style={{ backgroundColor: s.color }}
                  >
                    <span className="text-lg font-bold">{s.letter}</span>
                    <span className="text-xs">{s.name}</span>
                  </motion.div>
                  {i < stages.length - 1 && (
                    <span className="text-gray-400 mx-1">→</span>
                  )}
                </div>
              ))}
              {activeModel === "aisas" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-xs font-bold ml-2"
                  style={{ color: BRAND.accent }}
                >
                  ↻ 循環
                </motion.div>
              )}
            </div>

            {/* 階段說明 */}
            <div className="space-y-2">
              {stages.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex items-center gap-3 text-sm"
                >
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: s.color }}
                  >
                    {s.letter}
                  </span>
                  <span className="font-semibold" style={{ color: s.color }}>
                    {s.name}
                  </span>
                  <span className="text-gray-600">{s.desc}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="compare"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3
              className="text-center text-lg font-bold mb-4"
              style={{ color: BRAND.primary }}
            >
              AIDMA vs AISAS 八維度比較
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr>
                    <th className="text-left py-2 px-3 border-b-2" style={{ borderColor: BRAND.primary }}>
                      維度
                    </th>
                    <th className="text-center py-2 px-3 border-b-2" style={{ borderColor: BRAND.primary, color: BRAND.danger }}>
                      AIDMA
                    </th>
                    <th className="text-center py-2 px-3 border-b-2" style={{ borderColor: BRAND.primary, color: BRAND.story }}>
                      AISAS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {DIMENSIONS.map((d, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.08 }}
                      className="border-b border-gray-200"
                    >
                      <td className="py-2 px-3 font-semibold" style={{ color: BRAND.primary }}>
                        {d.label}
                      </td>
                      <td className="py-2 px-3 text-center text-gray-600">{d.aidma}</td>
                      <td className="py-2 px-3 text-center font-medium" style={{ color: BRAND.story }}>
                        {d.aisas}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

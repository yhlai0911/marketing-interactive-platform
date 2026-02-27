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

interface WeekItem {
  week: string;
  tool: string;
  planChapter: string;
}

interface Stage {
  name: string;
  color: string;
  weeks: WeekItem[];
}

const STAGES: Stage[] = [
  {
    name: "認識",
    color: BRAND.neutral,
    weeks: [
      { week: "W01", tool: "行銷本質", planChapter: "願景基礎" },
      { week: "W02", tool: "哈佛四層次框架", planChapter: "產品策略" },
    ],
  },
  {
    name: "規劃",
    color: BRAND.primary,
    weeks: [
      { week: "W03", tool: "SWOT + PEST", planChapter: "Ch.2 情境分析" },
      { week: "W04", tool: "市場區隔", planChapter: "Ch.3 STP" },
      { week: "W05", tool: "目標市場選擇", planChapter: "Ch.3 STP" },
      { week: "W06", tool: "品牌定位", planChapter: "Ch.3 STP" },
    ],
  },
  {
    name: "洞察",
    color: BRAND.story,
    weeks: [
      { week: "W07", tool: "AISAS 數位消費旅程", planChapter: "客戶旅程設計" },
      { week: "W08", tool: "Persona 人物誌", planChapter: "目標客群描繪" },
      { week: "W09", tool: "同理心地圖", planChapter: "需求深度理解" },
      { week: "W10", tool: "價值主張畫布 VPC", planChapter: "價值主張" },
    ],
  },
  {
    name: "執行",
    color: BRAND.accent,
    weeks: [
      { week: "W11", tool: "產品策略", planChapter: "Ch.4 行銷策略" },
      { week: "W12", tool: "定價策略", planChapter: "Ch.4 行銷策略" },
      { week: "W13", tool: "通路策略 OMO", planChapter: "Ch.4 行銷策略" },
      { week: "W14", tool: "IMC 整合行銷傳播", planChapter: "Ch.4 行銷策略" },
      { week: "W15", tool: "客戶旅程 + SERVQUAL", planChapter: "Ch.4 行銷策略" },
    ],
  },
  {
    name: "整合",
    color: BRAND.danger,
    weeks: [
      { week: "W16", tool: "行銷計畫書", planChapter: "全部章節整合" },
    ],
  },
];

export default function WeeklyIntegrationMap() {
  const [activeStage, setActiveStage] = useState<string | null>(null);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h3 className="text-center font-bold text-lg mb-1" style={{ color: BRAND.primary }}>
        十六週行銷工具整合地圖
      </h3>
      <p className="text-center text-xs mb-5" style={{ color: BRAND.neutral }}>
        從認識到整合的五大學習階段 ── 點擊階段展開詳情
      </p>

      {/* 階段標籤列 */}
      <div className="flex gap-1 mb-4 justify-center flex-wrap">
        {STAGES.map((stage) => {
          const isActive = activeStage === stage.name;
          return (
            <button
              key={stage.name}
              onClick={() => setActiveStage(isActive ? null : stage.name)}
              className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
              style={{
                backgroundColor: isActive ? stage.color : `${stage.color}15`,
                color: isActive ? "#fff" : stage.color,
                border: `1.5px solid ${stage.color}`,
              }}
            >
              {stage.name}（{stage.weeks.length} 週）
            </button>
          );
        })}
      </div>

      {/* 主內容：時間線 */}
      <div className="relative">
        {/* 中央連接線 */}
        <div
          className="absolute left-6 top-0 bottom-0 w-0.5"
          style={{ backgroundColor: "#e5e7eb" }}
        />

        {STAGES.map((stage, si) => {
          const isExpanded = activeStage === null || activeStage === stage.name;
          return (
            <motion.div
              key={stage.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: isExpanded ? 1 : 0.3 }}
              transition={{ duration: 0.3 }}
              className="mb-3"
            >
              {/* 階段標題 */}
              <div className="flex items-center gap-3 mb-2">
                <motion.div
                  className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ backgroundColor: stage.color }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: si * 0.1, type: "spring" }}
                >
                  {stage.name}
                </motion.div>
                <div
                  className="h-px flex-1"
                  style={{ backgroundColor: `${stage.color}40` }}
                />
              </div>

              {/* 週次卡片 */}
              {isExpanded && (
                <div className="ml-16 space-y-1.5">
                  {stage.weeks.map((w, wi) => (
                    <motion.div
                      key={w.week}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: si * 0.1 + wi * 0.04 }}
                      className="flex items-center gap-3 rounded-lg px-3 py-2"
                      style={{
                        backgroundColor: w.week === "W16" ? `${BRAND.danger}10` : "#f9fafb",
                        border: w.week === "W16" ? `1.5px solid ${BRAND.danger}` : "1px solid #e5e7eb",
                      }}
                    >
                      <span
                        className="shrink-0 text-xs font-bold px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: stage.color,
                          color: "#fff",
                        }}
                      >
                        {w.week}
                      </span>
                      <span className="text-sm flex-1" style={{ color: "#1f2937" }}>
                        {w.tool}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded shrink-0"
                        style={{
                          backgroundColor: `${stage.color}12`,
                          color: stage.color,
                        }}
                      >
                        → {w.planChapter}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* 底部洞察 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-5 rounded-lg p-3 text-center"
        style={{ backgroundColor: `${BRAND.accent}10`, border: `1px solid ${BRAND.accent}30` }}
      >
        <p className="text-xs font-semibold" style={{ color: BRAND.accent }}>
          行銷是一整套系統，不是一個工具
        </p>
        <p className="text-xs mt-1" style={{ color: BRAND.neutral }}>
          單獨使用 STP 或 4P 就像只彈鋼琴的一個鍵——你需要整首曲子才能打動人
        </p>
      </motion.div>
    </div>
  );
}

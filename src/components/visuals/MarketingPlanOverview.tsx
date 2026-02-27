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

interface Chapter {
  num: number;
  title: string;
  en: string;
  question: string;
  detail: string;
  color: string;
}

const CHAPTERS: Chapter[] = [
  {
    num: 1,
    title: "執行摘要",
    en: "Executive Summary",
    question: "一頁精華——決策者只看這裡",
    detail: "整份計畫的濃縮版，包括核心策略、目標市場、預期成果。高階主管只看這一頁就要能做決策。",
    color: BRAND.accent,
  },
  {
    num: 2,
    title: "情境分析",
    en: "Situation Analysis",
    question: "我們現在在哪裡？",
    detail: "外部環境掃描（PEST）、競爭態勢分析（SWOT）、市場規模與趨勢。對應 W03 學的工具。",
    color: BRAND.primary,
  },
  {
    num: 3,
    title: "目標市場與定位",
    en: "STP",
    question: "我們要服務誰？怎麼被記住？",
    detail: "市場區隔（W04）、目標市場選擇（W05）、品牌定位聲明（W06）。三步驟缺一不可。",
    color: BRAND.primary,
  },
  {
    num: 4,
    title: "行銷策略",
    en: "4P / 7P",
    question: "我們怎麼做？",
    detail: "產品（W11）、定價（W12）、通路（W13）、推廣 IMC（W14）、加上 People / Process / Physical Evidence（W15）。",
    color: BRAND.story,
  },
  {
    num: 5,
    title: "預算與時程",
    en: "Budget & Timeline",
    question: "花多少錢？什麼時候做？",
    detail: "行銷預算分配（Paid / Owned / Earned Media）、Q1-Q4 季度里程碑、資源配置優先序。",
    color: BRAND.story,
  },
  {
    num: 6,
    title: "成效評估",
    en: "KPI & ROI",
    question: "怎麼知道成功了？",
    detail: "SMART 原則設定 KPI（MAU、轉換率、NPS）、行銷 ROI 計算、月/季追蹤頻率。",
    color: BRAND.primary,
  },
  {
    num: 7,
    title: "實施控制",
    en: "Controls",
    question: "計畫偏離軌道怎麼辦？",
    detail: "追蹤機制、預警門檻（如轉換率 < 1.5% 即啟動 B 計畫）、里程碑檢核點、應變方案。Kotler 強調：沒有控制機制的計畫書是不完整的。",
    color: BRAND.danger,
  },
];

export default function MarketingPlanOverview() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h3 className="text-center font-bold text-lg mb-1" style={{ color: BRAND.primary }}>
        行銷計畫書七大章節
      </h3>
      <p className="text-center text-xs mb-5" style={{ color: BRAND.neutral }}>
        Kotler & Keller (2022) ── 點擊章節查看詳情
      </p>

      {/* 七個章節卡片 */}
      <div className="flex flex-col gap-2">
        {CHAPTERS.map((ch, i) => {
          const isSelected = selected === ch.num;
          return (
            <motion.div
              key={ch.num}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <button
                onClick={() => setSelected(isSelected ? null : ch.num)}
                className="w-full text-left rounded-lg px-4 py-3 transition-all flex items-center gap-3"
                style={{
                  backgroundColor: isSelected ? `${ch.color}15` : "#f9fafb",
                  border: `2px solid ${isSelected ? ch.color : "#e5e7eb"}`,
                }}
              >
                {/* 編號圓圈 */}
                <span
                  className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ backgroundColor: ch.color }}
                >
                  {ch.num}
                </span>
                {/* 標題 + 英文 */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm" style={{ color: ch.color }}>
                    {ch.title}
                    <span className="text-xs font-normal ml-2" style={{ color: BRAND.neutral }}>
                      {ch.en}
                    </span>
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: BRAND.neutral }}>
                    {ch.question}
                  </p>
                </div>
                {/* 展開箭頭 */}
                <motion.span
                  animate={{ rotate: isSelected ? 90 : 0 }}
                  className="text-sm"
                  style={{ color: ch.color }}
                >
                  ▶
                </motion.span>
              </button>

              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="mx-4 mt-1 mb-2 rounded-lg p-4 text-sm"
                      style={{ backgroundColor: `${ch.color}08`, borderLeft: `3px solid ${ch.color}` }}
                    >
                      {ch.detail}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* 底部提示 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 rounded-lg p-3 text-center"
        style={{ backgroundColor: `${BRAND.accent}10`, border: `1px solid ${BRAND.accent}30` }}
      >
        <p className="text-xs font-semibold" style={{ color: BRAND.accent }}>
          行銷計畫書是「決策文件」，不是作文比賽
        </p>
        <p className="text-xs mt-1" style={{ color: BRAND.neutral }}>
          每一頁都要回答一個問題，每一個數字都要有根據
        </p>
      </motion.div>
    </div>
  );
}

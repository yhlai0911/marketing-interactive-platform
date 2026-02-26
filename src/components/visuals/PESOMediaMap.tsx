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

interface Quadrant {
  id: "P" | "E" | "S" | "O";
  label: string;
  fullName: string;
  color: string;
  description: string;
  financeFeature: string;
  timing: string;
  fuChengStrategy: string[];
  budget: string;
}

const QUADRANTS: Quadrant[] = [
  {
    id: "P",
    label: "Paid",
    fullName: "付費媒體",
    color: BRAND.danger,
    description: "你花錢買的曝光：Google Ads、Facebook 廣告、贊助文章",
    financeFeature: "可精準定向（年齡、收入、投資行為），但金融廣告須標示風險警語",
    timing: "新品上市、快速觸及新客群",
    fuChengStrategy: [
      "Google 搜尋廣告（高意圖關鍵字）",
      "FB/IG 再行銷廣告",
      "KOL 共創系列（非一次性業配）",
    ],
    budget: "15%",
  },
  {
    id: "E",
    label: "Earned",
    fullName: "贏得媒體",
    color: BRAND.accent,
    description: "別人主動報導或推薦：新聞報導、評測、獎項、口碑推薦",
    financeFeature: "公信力最高，但需長期累積品牌聲譽和媒體關係",
    timing: "建立行業權威、差異化定位",
    fuChengStrategy: [
      "每季 1-2 次財經媒體專訪",
      "年度「透明理財報告」",
      "大學財金系合辦工作坊",
      "申請金融創新獎項",
    ],
    budget: "20%",
  },
  {
    id: "S",
    label: "Shared",
    fullName: "共享媒體",
    color: BRAND.story,
    description: "消費者主動分享：社群轉發、評論、UGC、社團討論",
    financeFeature: "台灣的 LINE 群組和 PTT 理財版是重要分享管道",
    timing: "口碑擴散、社群經營",
    fuChengStrategy: [
      "LINE 官方帳號推送理財小知識",
      "IG 圖文懶人包 + Reels",
      "「富誠理財同學會」LINE 社群",
      "用戶故事「我的理財覺醒」",
    ],
    budget: "25%",
  },
  {
    id: "O",
    label: "Owned",
    fullName: "自有媒體",
    color: BRAND.primary,
    description: "你完全掌控的平台：官網、Blog、App、電子報、YouTube",
    financeFeature: "法規揭露最完整、品牌調性最一致、長期 SEO 價值",
    timing: "內容行銷、品牌故事、長期信任建立",
    fuChengStrategy: [
      "Blog 每週 2 篇 SEO 文章",
      "YouTube「理財不難」每週 1 支",
      "App「學習中心」懶人包",
      "每月電子報",
    ],
    budget: "40%",
  },
];

export default function PESOMediaMap() {
  const [activeQuadrant, setActiveQuadrant] = useState<string | null>(null);
  const active = QUADRANTS.find((q) => q.id === activeQuadrant);

  return (
    <div className="p-4 space-y-4 max-w-xl mx-auto">
      <h3
        className="text-lg font-bold text-center"
        style={{ color: BRAND.primary }}
      >
        PESO 媒體模型
      </h3>
      <p className="text-xs text-center" style={{ color: BRAND.neutral }}>
        點擊各象限查看詳細說明與富誠策略
      </p>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-2 gap-2">
        {QUADRANTS.map((q) => (
          <motion.button
            key={q.id}
            onClick={() =>
              setActiveQuadrant(activeQuadrant === q.id ? null : q.id)
            }
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="relative rounded-lg p-3 text-left transition-all"
            style={{
              backgroundColor:
                activeQuadrant === q.id ? `${q.color}15` : "#f9fafb",
              border: `2px solid ${activeQuadrant === q.id ? q.color : "#e5e7eb"}`,
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: q.color }}
              >
                {q.id}
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: q.color }}>
                  {q.label} Media
                </div>
                <div className="text-[10px]" style={{ color: BRAND.neutral }}>
                  {q.fullName}
                </div>
              </div>
            </div>
            <div
              className="text-[11px] mt-1 font-medium"
              style={{ color: q.color }}
            >
              建議佔比：{q.budget}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Budget bar */}
      <div className="flex h-4 rounded-full overflow-hidden">
        {QUADRANTS.map((q) => (
          <motion.div
            key={q.id}
            className="flex items-center justify-center"
            style={{
              backgroundColor: q.color,
              width: q.budget,
              opacity: activeQuadrant && activeQuadrant !== q.id ? 0.3 : 1,
            }}
            animate={{
              opacity: activeQuadrant && activeQuadrant !== q.id ? 0.3 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-[9px] text-white font-bold">
              {q.budget}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Detail panel */}
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="rounded-lg p-4 space-y-3"
            style={{
              backgroundColor: `${active.color}08`,
              border: `1px solid ${active.color}25`,
            }}
          >
            <p className="text-sm" style={{ color: BRAND.primary }}>
              {active.description}
            </p>

            <div className="space-y-2">
              <div className="text-xs">
                <span
                  className="font-medium"
                  style={{ color: active.color }}
                >
                  金融業特點：
                </span>
                <span style={{ color: BRAND.neutral }}>
                  {active.financeFeature}
                </span>
              </div>
              <div className="text-xs">
                <span
                  className="font-medium"
                  style={{ color: active.color }}
                >
                  適用時機：
                </span>
                <span style={{ color: BRAND.neutral }}>{active.timing}</span>
              </div>
            </div>

            <div>
              <div
                className="text-xs font-medium mb-1"
                style={{ color: active.color }}
              >
                富誠策略：
              </div>
              <div className="space-y-1">
                {active.fuChengStrategy.map((s, i) => (
                  <motion.div
                    key={s}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-1.5 text-xs"
                  >
                    <span style={{ color: active.color }}>&#9679;</span>
                    <span>{s}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Principle */}
      <div
        className="text-center text-xs p-2 rounded-lg"
        style={{ backgroundColor: `${BRAND.primary}08`, color: BRAND.primary }}
      >
        <span className="font-medium">原則：</span>Owned 為基礎、Shared
        為放大器、Earned 為信任加速器、Paid 為精準補充
      </div>
    </div>
  );
}

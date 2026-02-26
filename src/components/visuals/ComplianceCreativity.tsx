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

interface Card {
  id: number;
  restriction: string;
  restrictionDetail: string;
  creativity: string;
  creativityDetail: string;
  fuChengExample: string;
}

const CARDS: Card[] = [
  {
    id: 1,
    restriction: "不可承諾報酬率",
    restrictionDetail:
      "不得使用「穩賺」「保證獲利」「零風險」等用語，展示歷史績效須標註「過去績效不代表未來表現」",
    creativity: "改用「教育」角度",
    creativityDetail:
      "「我們不告訴你能賺多少，我們教你怎麼評估」——從推銷轉為教育",
    fuChengExample:
      "「富誠財商學院」Blog 用教學而非推銷的口吻撰寫",
  },
  {
    id: 2,
    restriction: "風險揭露義務",
    restrictionDetail:
      "所有行銷材料必須包含風險警語，字體和位置不得刻意隱藏（不能小字、快速閃過）",
    creativity: "把揭露變成品牌特色",
    creativityDetail:
      "「我們把風險放大字告訴你，因為透明是我們的 DNA」——從被動合規轉為主動透明",
    fuChengExample:
      "每則內容結尾加品牌簽名：「富誠不推銷，富誠教理財。投資有風險，選擇需謹慎。」",
  },
  {
    id: 3,
    restriction: "代言人不可投資建議",
    restrictionDetail:
      "KOL 不得提供具體投資建議（除非持照），必須明確標示「廣告」或「合作」",
    creativity: "分享「學習心得」",
    creativityDetail:
      "KOL 說「我學到了...」而非「你應該買...」——從投資建議轉為學習分享",
    fuChengExample:
      "與 KOL 共創「ETF 入門」教育系列，林教授把關學術品質",
  },
  {
    id: 4,
    restriction: "不可利用恐懼行銷",
    restrictionDetail:
      "不得針對弱勢族群不當銷售，不得利用消費者的恐懼或焦慮來促銷",
    creativity: "改用正面框架",
    creativityDetail:
      "不說「不理財老了會很慘」，說「提早開始，退休更從容」——從恐懼轉為賦能",
    fuChengExample:
      "社區講座主題「理財不難，難的是開始」——鼓勵而非恐嚇",
  },
];

export default function ComplianceCreativity() {
  const [flippedId, setFlippedId] = useState<number | null>(null);

  return (
    <div className="p-4 space-y-4 max-w-xl mx-auto">
      <h3
        className="text-lg font-bold text-center"
        style={{ color: BRAND.primary }}
      >
        合規創意：從限制中找出路
      </h3>
      <p className="text-xs text-center" style={{ color: BRAND.neutral }}>
        點擊卡片翻轉，查看法規限制的創意對策
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CARDS.map((card) => {
          const isFlipped = flippedId === card.id;
          return (
            <motion.button
              key={card.id}
              onClick={() =>
                setFlippedId(isFlipped ? null : card.id)
              }
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative w-full text-left"
              style={{ minHeight: 160 }}
            >
              <AnimatePresence mode="wait">
                {!isFlipped ? (
                  /* Front: Restriction */
                  <motion.div
                    key="front"
                    initial={{ rotateY: 180, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: -90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-lg p-3 h-full"
                    style={{
                      backgroundColor: `${BRAND.danger}08`,
                      border: `2px solid ${BRAND.danger}30`,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: BRAND.danger }}
                      >
                        {card.id}
                      </div>
                      <span
                        className="text-xs font-bold"
                        style={{ color: BRAND.danger }}
                      >
                        法規限制
                      </span>
                    </div>
                    <div
                      className="text-sm font-bold mb-1"
                      style={{ color: BRAND.primary }}
                    >
                      {card.restriction}
                    </div>
                    <div className="text-xs" style={{ color: BRAND.neutral }}>
                      {card.restrictionDetail}
                    </div>
                    <div
                      className="absolute bottom-2 right-2 text-[10px]"
                      style={{ color: BRAND.danger }}
                    >
                      點擊翻轉 →
                    </div>
                  </motion.div>
                ) : (
                  /* Back: Creative solution */
                  <motion.div
                    key="back"
                    initial={{ rotateY: -180, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: 90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-lg p-3 h-full"
                    style={{
                      backgroundColor: `${BRAND.story}08`,
                      border: `2px solid ${BRAND.story}30`,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: BRAND.story }}
                      >
                        {card.id}
                      </div>
                      <span
                        className="text-xs font-bold"
                        style={{ color: BRAND.story }}
                      >
                        創意對策
                      </span>
                    </div>
                    <div
                      className="text-sm font-bold mb-1"
                      style={{ color: BRAND.primary }}
                    >
                      {card.creativity}
                    </div>
                    <div
                      className="text-xs mb-2"
                      style={{ color: BRAND.neutral }}
                    >
                      {card.creativityDetail}
                    </div>
                    <div
                      className="text-xs p-1.5 rounded"
                      style={{
                        backgroundColor: `${BRAND.accent}10`,
                        color: BRAND.accent,
                      }}
                    >
                      <span className="font-medium">富誠實踐：</span>
                      {card.fuChengExample}
                    </div>
                    <div
                      className="absolute bottom-2 right-2 text-[10px]"
                      style={{ color: BRAND.story }}
                    >
                      ← 點擊翻回
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      {/* Key insight */}
      <div
        className="text-center text-xs p-2 rounded-lg"
        style={{ backgroundColor: `${BRAND.primary}08`, color: BRAND.primary }}
      >
        <span className="font-medium">核心洞察：</span>
        在充斥「穩賺不賠」話術的市場裡，誠實本身就是最好的差異化策略
      </div>
    </div>
  );
}

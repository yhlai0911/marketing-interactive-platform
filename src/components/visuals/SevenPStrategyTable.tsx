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

interface PItem {
  p: string;
  en: string;
  week: string;
  strategy: string;
  detail: string;
  color: string;
}

const SEVEN_P: PItem[] = [
  {
    p: "Product",
    en: "產品",
    week: "W11",
    strategy: "富誠·安退 退休理財副品牌",
    detail: "三層次設計：核心利益「退休不焦慮」、AI 退休試算、安退通信月報 + 社群",
    color: BRAND.primary,
  },
  {
    p: "Price",
    en: "定價",
    week: "W12",
    strategy: "月投 1,000 元起 / 管理費 0.3%",
    detail: "滲透定價降低門檻 + 心理定價（999 元方案）+ 價值基礎定價（CFP 諮詢）",
    color: BRAND.primary,
  },
  {
    p: "Place",
    en: "通路",
    week: "W13",
    strategy: "OMO 全通路整合",
    detail: "App 主通路 + 新板特區體驗店 + 企業合作 B2B2C + LINE 社群導流",
    color: BRAND.story,
  },
  {
    p: "Promotion",
    en: "推廣",
    week: "W14",
    strategy: "IMC 整合行銷傳播",
    detail: "PESO 媒體整合：理財 Blog（Owned）+ 理財 KOL（Earned）+ 精準投放（Paid）+ LINE 官方帳號（Shared）",
    color: BRAND.story,
  },
  {
    p: "People",
    en: "人員",
    week: "W15",
    strategy: "CFP 理財顧問團隊",
    detail: "每位顧問服務 ≤ 200 客戶、年度一對一退休健檢、同理心訓練",
    color: BRAND.accent,
  },
  {
    p: "Process",
    en: "流程",
    week: "W15",
    strategy: "五步驟顧客旅程",
    detail: "認知→考慮→申購→使用→推薦，每個接觸點設計 MOT（關鍵時刻）",
    color: BRAND.accent,
  },
  {
    p: "Physical Evidence",
    en: "實體證據",
    week: "W15",
    strategy: "信任可視化",
    detail: "App 退休進度儀表板 + 新板特區門市暖色調設計 + NPS 即時顯示",
    color: BRAND.accent,
  },
];

export default function SevenPStrategyTable() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h3 className="text-center font-bold text-lg mb-1" style={{ color: BRAND.primary }}>
        富誠 7P 行銷策略總覽
      </h3>
      <p className="text-center text-xs mb-5" style={{ color: BRAND.neutral }}>
        每個 P 對應的具體策略與學習週次
      </p>

      <div className="space-y-2">
        {SEVEN_P.map((item, i) => {
          const isHovered = hoveredIdx === i;
          return (
            <motion.div
              key={item.p}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="rounded-lg px-4 py-3 cursor-default transition-all"
              style={{
                backgroundColor: isHovered ? `${item.color}12` : "#f9fafb",
                border: `1.5px solid ${isHovered ? item.color : "#e5e7eb"}`,
              }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="flex items-start gap-3">
                {/* P 標籤 */}
                <div className="shrink-0 text-center" style={{ minWidth: 56 }}>
                  <span
                    className="inline-block px-2 py-0.5 rounded text-xs font-bold text-white"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.p}
                  </span>
                  <p className="text-xs mt-0.5" style={{ color: BRAND.neutral }}>
                    {item.en}
                  </p>
                </div>

                {/* 策略內容 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm" style={{ color: "#1f2937" }}>
                      {item.strategy}
                    </p>
                    <span
                      className="text-xs px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: `${item.color}15`, color: item.color }}
                    >
                      {item.week}
                    </span>
                  </div>
                  <motion.p
                    initial={false}
                    animate={{ height: isHovered ? "auto" : 0, opacity: isHovered ? 1 : 0 }}
                    className="text-xs overflow-hidden"
                    style={{ color: BRAND.neutral }}
                  >
                    <span className="block pt-1">{item.detail}</span>
                  </motion.p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 底部洞察 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-4 rounded-lg p-3"
        style={{ backgroundColor: `${BRAND.story}08`, border: `1px solid ${BRAND.story}30` }}
      >
        <p className="text-xs font-semibold" style={{ color: BRAND.story }}>
          從 4P 到 7P：服務業的差異化關鍵
        </p>
        <p className="text-xs mt-1" style={{ color: BRAND.neutral }}>
          People、Process、Physical Evidence 是金融服務業建立信任的三根支柱——產品可以抄，但服務體驗很難複製
        </p>
      </motion.div>
    </div>
  );
}

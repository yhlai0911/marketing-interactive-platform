"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND } from "@/components/brand/BrandColors";

const layers = [
  {
    name: "基礎功能",
    en: "Foundation",
    desc: "產品能做什麼",
    example: "基金能投資股票、債券，提供報酬",
    color: `${BRAND.primary}50`,
    textColor: BRAND.primary,
  },
  {
    name: "預期品質",
    en: "Expected",
    desc: "應該做到的",
    example: "線上下單順暢、淨值每日揭露、手續費透明",
    color: `${BRAND.primary}70`,
    textColor: BRAND.primary,
  },
  {
    name: "延伸服務",
    en: "Augmented",
    desc: "超出預期的",
    example: "專屬理財顧問、智能再平衡、稅務規劃諮詢",
    color: `${BRAND.primary}90`,
    textColor: "white",
  },
  {
    name: "潛在驚喜",
    en: "Potential",
    desc: "還能做什麼",
    example: "AI 個人化投資建議、社群互動理財圈",
    color: BRAND.primary,
    textColor: "white",
  },
];

export default function HarvardFourLevelsPyramid() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <h4 className="text-center font-bold text-lg mb-1" style={{ color: BRAND.primary }}>
        哈佛 4 層次價值框架
      </h4>
      <p className="text-center text-xs text-gray-500 mb-5">
        點擊各層查看金融業案例
      </p>

      {/* Pyramid blocks stacking from bottom */}
      <div className="flex flex-col items-center gap-1 mb-4">
        {layers.map((layer, i) => {
          const isActive = active === i;
          const widthPct = 100 - i * 15; // bottom widest

          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.18, duration: 0.4 }}
              onClick={() => setActive(isActive ? null : i)}
              className="relative rounded-lg px-4 py-3 text-center transition-all duration-200"
              style={{
                width: `${widthPct}%`,
                backgroundColor: layer.color,
                color: layer.textColor,
                boxShadow: isActive ? `0 0 0 3px ${BRAND.accent}` : "none",
                transform: isActive ? "scale(1.03)" : "scale(1)",
              }}
            >
              <div className="font-bold text-sm">
                {layer.name}
                <span className="ml-1.5 opacity-70 font-normal text-xs">({layer.en})</span>
              </div>
              <div className="text-xs opacity-80 mt-0.5">{layer.desc}</div>
            </motion.button>
          );
        })}
      </div>

      {/* Detail panel */}
      <AnimatePresence mode="wait">
        {active !== null && (
          <motion.div
            key={active}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div
              className="p-4 rounded-lg border-l-4 mb-3"
              style={{
                borderLeftColor: BRAND.accent,
                backgroundColor: `${BRAND.accent}10`,
              }}
            >
              <div className="font-bold text-sm" style={{ color: BRAND.accent }}>
                {layers[active].name} ({layers[active].en})
              </div>
              <div className="text-xs text-gray-500 mt-0.5">{layers[active].desc}</div>
              <div className="mt-2 text-sm text-gray-700">
                <span className="font-semibold" style={{ color: BRAND.primary }}>
                  金融業案例：
                </span>
                {layers[active].example}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Arrow annotation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-4"
      >
        <span>基礎</span>
        <svg width="60" height="12" viewBox="0 0 60 12" fill="none">
          <line x1="0" y1="6" x2="52" y2="6" stroke={BRAND.accent} strokeWidth="1.5" />
          <polygon points="52,2 60,6 52,10" fill={BRAND.accent} />
        </svg>
        <span>差異化</span>
      </motion.div>

      {/* Insight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-center text-sm p-3 rounded-lg"
        style={{ backgroundColor: `${BRAND.story}12`, color: "#374151" }}
      >
        <span className="font-bold" style={{ color: BRAND.story }}>關鍵：</span>
        前兩層是入場門票，後兩層才是品牌護城河。富誠要在第 3、4 層創造差異。
      </motion.div>
    </motion.div>
  );
}

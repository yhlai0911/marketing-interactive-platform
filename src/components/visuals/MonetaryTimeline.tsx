"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BRAND } from "@/components/brand/BrandColors";

const ERAS = [
  {
    period: "1870s–1914",
    title: "古典金本位",
    desc: "貨幣與黃金掛鉤，匯率固定",
    color: BRAND.accent,
    icon: "🪙",
  },
  {
    period: "1914–1944",
    title: "間戰混亂期",
    desc: "各國放棄金本位，貨幣競貶",
    color: BRAND.danger,
    icon: "⚔️",
  },
  {
    period: "1944–1971",
    title: "布列敦森林",
    desc: "美元掛鉤黃金，各國掛鉤美元",
    color: BRAND.primary,
    icon: "🏛️",
  },
  {
    period: "1971–至今",
    title: "浮動匯率",
    desc: "匯率由市場供需決定",
    color: BRAND.story,
    icon: "📈",
  },
];

export default function MonetaryTimeline() {
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    if (activeIndex < ERAS.length - 1) {
      const timer = setTimeout(() => setActiveIndex((i) => i + 1), 800);
      return () => clearTimeout(timer);
    }
  }, [activeIndex]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl mx-auto py-4"
    >
      <h4
        className="text-center font-bold text-lg mb-6"
        style={{ color: BRAND.primary }}
      >
        國際貨幣體系演變
      </h4>

      {/* 橫向時間軸 */}
      <div className="relative">
        {/* 連接線 */}
        <div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-200" />
        <motion.div
          className="absolute top-8 left-0 h-0.5"
          style={{ backgroundColor: BRAND.primary }}
          initial={{ width: "0%" }}
          animate={{
            width: `${((activeIndex + 1) / ERAS.length) * 100}%`,
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />

        {/* 時代節點 */}
        <div className="relative flex justify-between">
          {ERAS.map((era, i) => {
            const isActive = i <= activeIndex;
            return (
              <div key={era.title} className="flex flex-col items-center w-1/4">
                {/* 圓點 */}
                <motion.div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl border-2 z-10"
                  style={{
                    borderColor: isActive ? era.color : "#e5e7eb",
                    backgroundColor: isActive ? `${era.color}15` : "#f9fafb",
                  }}
                  initial={{ scale: 0.8, opacity: 0.3 }}
                  animate={{
                    scale: isActive ? 1 : 0.8,
                    opacity: isActive ? 1 : 0.3,
                  }}
                  transition={{ duration: 0.4 }}
                >
                  {era.icon}
                </motion.div>

                {/* 文字 */}
                <motion.div
                  className="mt-3 text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: isActive ? 1 : 0.3,
                    y: isActive ? 0 : 10,
                  }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <div
                    className="text-xs font-mono"
                    style={{ color: isActive ? era.color : "#9ca3af" }}
                  >
                    {era.period}
                  </div>
                  <div
                    className="font-bold text-sm mt-1"
                    style={{ color: isActive ? era.color : "#9ca3af" }}
                  >
                    {era.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 leading-tight max-w-[120px]">
                    {isActive ? era.desc : ""}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

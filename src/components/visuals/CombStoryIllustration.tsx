"use client";

import { motion } from "framer-motion";
import { BRAND } from "@/components/brand/BrandColors";

const sellers = [
  {
    label: "業務員 A：推銷式",
    quote: "師父，買把梳子吧！",
    result: "結果：0 把",
    color: BRAND.danger,
    bg: `${BRAND.danger}12`,
    icon: "😰",
  },
  {
    label: "業務員 B：功能式",
    quote: "梳子可以按摩頭皮止癢",
    result: "結果：幾把",
    color: BRAND.accent,
    bg: `${BRAND.accent}18`,
    icon: "🤔",
  },
  {
    label: "業務員 C：價值式",
    quote: "在廟裡為信眾提供開光梳，增加收入",
    result: "結果：上千把",
    color: BRAND.story,
    bg: `${BRAND.story}15`,
    icon: "🎯",
  },
];

export default function CombStoryIllustration() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <h4 className="text-center font-bold text-lg mb-1" style={{ color: BRAND.primary }}>
        梳子賣給和尚的故事
      </h4>
      <p className="text-center text-xs text-gray-500 mb-5">
        同一把梳子、同一位客戶，不同思維帶來截然不同的結果
      </p>

      <div className="space-y-3">
        {sellers.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.25, duration: 0.5 }}
            className="flex items-start gap-4 p-4 rounded-xl border-l-4"
            style={{ borderLeftColor: s.color, backgroundColor: s.bg }}
          >
            <span className="text-3xl flex-shrink-0 mt-0.5">{s.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm" style={{ color: s.color }}>
                {s.label}
              </div>
              <div className="text-sm text-gray-700 mt-1 italic">&ldquo;{s.quote}&rdquo;</div>
              <div className="mt-2 text-xs font-semibold" style={{ color: s.color }}>
                {s.result}
              </div>
            </div>
            {/* mini bar */}
            <div className="flex-shrink-0 flex flex-col items-center gap-1 pt-1">
              <div
                className="w-6 rounded-sm"
                style={{
                  height: i === 0 ? 4 : i === 1 ? 20 : 56,
                  backgroundColor: s.color,
                  opacity: 0.7,
                }}
              />
              <span className="text-[10px] text-gray-400">
                {i === 0 ? "0" : i === 1 ? "幾把" : "1000+"}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Insight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-5 text-center text-sm p-3 rounded-lg"
        style={{ backgroundColor: `${BRAND.story}12`, color: "#374151" }}
      >
        <span className="font-bold" style={{ color: BRAND.story }}>洞察：</span>
        創造價值 = 找到新的使用情境，而非單純推銷產品。
      </motion.div>
    </motion.div>
  );
}

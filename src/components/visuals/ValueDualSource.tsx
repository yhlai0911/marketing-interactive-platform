"use client";

import { motion } from "framer-motion";
import { BRAND } from "@/components/brand/BrandColors";

export default function ValueDualSource() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <h4 className="text-center font-bold text-lg mb-1" style={{ color: BRAND.primary }}>
        價值的雙重來源
      </h4>
      <p className="text-center text-xs text-gray-500 mb-6">
        客戶感受到的價值 = 功能價值 + 情感價值
      </p>

      {/* Two source boxes + center merge */}
      <div className="flex items-center justify-center gap-3 md:gap-6 mb-6">
        {/* Functional value */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex-1 max-w-[200px] p-4 rounded-xl border-2 text-center"
          style={{ borderColor: BRAND.primary, backgroundColor: `${BRAND.primary}10` }}
        >
          <svg className="mx-auto mb-2" width="36" height="36" viewBox="0 0 36 36" fill="none">
            <rect x="4" y="6" width="28" height="24" rx="3" stroke={BRAND.primary} strokeWidth="2" />
            <line x1="10" y1="14" x2="26" y2="14" stroke={BRAND.primary} strokeWidth="1.5" />
            <line x1="10" y1="19" x2="20" y2="19" stroke={BRAND.primary} strokeWidth="1.5" opacity={0.6} />
            <line x1="10" y1="24" x2="23" y2="24" stroke={BRAND.primary} strokeWidth="1.5" opacity={0.4} />
          </svg>
          <div className="font-bold text-sm" style={{ color: BRAND.primary }}>功能價值</div>
          <div className="text-xs text-gray-500 mt-1">實際效用</div>
        </motion.div>

        {/* Center balance SVG */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="flex-shrink-0"
        >
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            {/* arrows from left and right */}
            <motion.path
              d="M4 32 H24"
              stroke={BRAND.primary}
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
            />
            <motion.path
              d="M40 32 H60"
              stroke={BRAND.danger}
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
            />
            {/* balance triangle */}
            <polygon points="32,18 24,44 40,44" fill={BRAND.accent} opacity={0.2} stroke={BRAND.accent} strokeWidth="1.5" />
            <circle cx="32" cy="32" r="6" fill={BRAND.accent} />
            <text x="32" y="36" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">$</text>
          </svg>
        </motion.div>

        {/* Emotional value */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex-1 max-w-[200px] p-4 rounded-xl border-2 text-center"
          style={{ borderColor: BRAND.danger, backgroundColor: `${BRAND.danger}10` }}
        >
          <svg className="mx-auto mb-2" width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path
              d="M18 30 C18 30 4 22 4 13 C4 8 8 4 13 6 C15.5 7 17 9 18 11 C19 9 20.5 7 23 6 C28 4 32 8 32 13 C32 22 18 30 18 30Z"
              fill={`${BRAND.danger}30`}
              stroke={BRAND.danger}
              strokeWidth="2"
            />
          </svg>
          <div className="font-bold text-sm" style={{ color: BRAND.danger }}>情感價值</div>
          <div className="text-xs text-gray-500 mt-1">心理滿足</div>
        </motion.div>
      </div>

      {/* Financial examples */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.5 }}
        className="grid grid-cols-2 gap-3"
      >
        <div
          className="p-3 rounded-lg text-center"
          style={{ backgroundColor: `${BRAND.primary}08` }}
        >
          <div className="text-xs text-gray-500 mb-1">金融業功能價值</div>
          <div className="font-bold text-sm" style={{ color: BRAND.primary }}>
            基金報酬率 5%
          </div>
          <div className="text-xs text-gray-400 mt-1">可量化、可比較</div>
        </div>
        <div
          className="p-3 rounded-lg text-center"
          style={{ backgroundColor: `${BRAND.danger}08` }}
        >
          <div className="text-xs text-gray-500 mb-1">金融業情感價值</div>
          <div className="font-bold text-sm" style={{ color: BRAND.danger }}>
            「安心睡得著覺」
          </div>
          <div className="text-xs text-gray-400 mt-1">無形卻決定忠誠度</div>
        </div>
      </motion.div>

      {/* Insight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="mt-4 text-center text-sm p-3 rounded-lg"
        style={{ backgroundColor: `${BRAND.accent}12`, color: "#374151" }}
      >
        <span className="font-bold" style={{ color: BRAND.accent }}>核心觀念：</span>
        金融商品的功能差異愈來愈小，情感價值才是品牌區隔的關鍵。
      </motion.div>
    </motion.div>
  );
}

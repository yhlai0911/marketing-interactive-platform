"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BRAND } from "@/components/brand/BrandColors";

const templateRows = [
  {
    level: "基礎功能",
    definition: "產品核心功能",
    example: "智能投資演算法、自動配置資產",
    color: `${BRAND.primary}50`,
  },
  {
    level: "預期品質",
    definition: "客戶基本期待",
    example: "即時查看資產、安全交易環境",
    color: `${BRAND.primary}70`,
  },
  {
    level: "延伸服務",
    definition: "超越競爭者",
    example: "專屬顧問 Line 群、季度理財報告",
    color: `${BRAND.primary}90`,
  },
  {
    level: "潛在驚喜",
    definition: "未來可能性",
    example: "AI 財務教練、社群共學投資圈",
    color: BRAND.primary,
  },
];

export default function FourLevelTemplate() {
  const [inputs, setInputs] = useState(["", "", "", ""]);
  const [showExample, setShowExample] = useState(false);

  const handleChange = (i: number, v: string) => {
    setInputs((prev) => {
      const next = [...prev];
      next[i] = v;
      return next;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <h4 className="text-center font-bold text-lg mb-1" style={{ color: BRAND.primary }}>
        4 層次定位工作模板
      </h4>
      <p className="text-center text-xs text-gray-500 mb-4">
        用哈佛 4 層次框架分析你的金融商品
      </p>

      {/* Toggle example */}
      <div className="flex justify-end mb-3">
        <button
          onClick={() => setShowExample((p) => !p)}
          className="text-xs px-3 py-1 rounded-full border transition-colors"
          style={{
            borderColor: BRAND.accent,
            color: showExample ? "white" : BRAND.accent,
            backgroundColor: showExample ? BRAND.accent : "transparent",
          }}
        >
          {showExample ? "隱藏範例" : "顯示富誠範例"}
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div
          className="grid grid-cols-[100px_1fr_1fr] text-xs font-bold text-white"
          style={{ backgroundColor: BRAND.primary }}
        >
          <div className="p-2 border-r border-white/20">層次</div>
          <div className="p-2 border-r border-white/20">定義</div>
          <div className="p-2">你的商品</div>
        </div>

        {/* Rows */}
        {templateRows.map((row, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.12 }}
            className="grid grid-cols-[100px_1fr_1fr] text-sm border-t border-gray-100"
          >
            <div
              className="p-2 font-bold text-white text-xs flex items-center"
              style={{ backgroundColor: row.color }}
            >
              {row.level}
            </div>
            <div className="p-2 text-xs text-gray-600 flex items-center border-r border-gray-100">
              {row.definition}
            </div>
            <div className="p-2">
              <input
                type="text"
                value={inputs[i]}
                onChange={(e) => handleChange(i, e.target.value)}
                placeholder="請輸入..."
                className="w-full text-xs p-1.5 border border-gray-200 rounded focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Example panel */}
      {showExample && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="mt-3 rounded-lg overflow-hidden"
        >
          <div
            className="p-3 text-xs"
            style={{ backgroundColor: `${BRAND.accent}10`, borderLeft: `4px solid ${BRAND.accent}` }}
          >
            <div className="font-bold mb-2" style={{ color: BRAND.accent }}>
              富誠 FinTech 範例填寫
            </div>
            {templateRows.map((row, i) => (
              <div key={i} className="flex gap-2 mb-1">
                <span className="font-semibold w-16 flex-shrink-0" style={{ color: BRAND.primary }}>
                  {row.level}：
                </span>
                <span className="text-gray-600">{row.example}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="mt-4 text-center text-xs text-gray-400"
      >
        提示：填完後比較你的商品在第 3、4 層是否有足夠差異化
      </motion.div>
    </motion.div>
  );
}

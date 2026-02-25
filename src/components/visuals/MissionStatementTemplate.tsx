"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BRAND } from "@/components/brand/BrandColors";

const WRONGS = [
  { text: "賣更多基金給客戶", why: "這是推銷，不是使命" },
  { text: "打敗萬泰金控搶市占", why: "以競爭對手為中心，不是以顧客為中心" },
  { text: "讓公司營收成長 50%", why: "這是財務目標，不是行銷使命" },
];
const HINTS = [
  "想想看：客戶來找富誠之前，他們的「痛點」是什麼？",
  "使命宣言的主詞應該是「顧客」，不是「公司」。",
  "好的使命用一句話就能讓人感受到品牌的溫度。",
];

export default function MissionStatementTemplate() {
  const [input, setInput] = useState("");
  const [showHints, setShowHints] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-3xl mx-auto">
      <h4 className="text-center font-bold text-lg mb-1" style={{ color: BRAND.primary }}>使命宣言模板</h4>
      <p className="text-center text-xs text-gray-500 mb-5">富誠 FinTech 的行銷使命是什麼？試著填完這句話</p>

      {/* Template */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="rounded-xl p-6 border-2 text-center mb-5" style={{ borderColor: BRAND.accent, backgroundColor: `${BRAND.accent}08` }}>
        <div className="text-lg leading-relaxed">
          <span className="font-bold" style={{ color: BRAND.primary }}>富誠 FinTech</span>{" "}
          <span className="text-gray-700">不是在賣金融商品——</span>
        </div>
        <div className="text-lg mt-2">
          <span className="text-gray-700">我們是在幫人</span>{" "}
          <span className="inline-block border-b-2 min-w-[120px] text-center font-bold" style={{ borderColor: BRAND.accent, color: BRAND.accent }}>
            {input || "\uFF3F\uFF3F\uFF3F\uFF3F\uFF3F"}
          </span>
          <span className="text-gray-700">。</span>
        </div>
      </motion.div>

      {/* Input */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mb-5">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="例如：用知識守護自己的未來" className="w-full p-3 rounded-lg border text-sm focus:outline-none resize-none" rows={2} maxLength={50} />
        <div className="text-right text-xs text-gray-400 mt-1">{input.length}/50</div>
      </motion.div>

      {/* Wrong examples */}
      <div className="mb-5">
        <div className="text-sm font-bold text-gray-600 mb-2"><span style={{ color: BRAND.danger }}>&#10007;</span> 常見錯誤示範</div>
        {WRONGS.map((w, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.1 }} className="flex items-start gap-2 p-3 rounded-lg mb-1.5" style={{ backgroundColor: `${BRAND.danger}06` }}>
            <span className="text-sm font-bold flex-shrink-0" style={{ color: BRAND.danger }}>&#10007;</span>
            <div>
              <div className="text-sm text-gray-700 line-through">{w.text}</div>
              <div className="text-xs text-gray-500 mt-0.5">{w.why}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Hints */}
      <div className="text-center mb-3">
        <button onClick={() => setShowHints(!showHints)} className="px-4 py-2 rounded-full text-xs font-medium border transition-colors" style={{ borderColor: BRAND.story, backgroundColor: showHints ? BRAND.story : "#fff", color: showHints ? "#fff" : BRAND.story }}>
          {showHints ? "隱藏提示" : "需要提示？"}
        </button>
      </div>
      {showHints && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
          {HINTS.map((h, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }} className="flex items-start gap-2 p-3 rounded-lg text-sm" style={{ backgroundColor: `${BRAND.story}08` }}>
              <span className="font-bold flex-shrink-0" style={{ color: BRAND.story }}>&#10148;</span>
              <span className="text-gray-600">{h}</span>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

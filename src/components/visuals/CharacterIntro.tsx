"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND } from "@/components/brand/BrandColors";

const CHARS = [
  { name: "陳建宏", role: "CEO / 創辦人", ini: "陳", color: BRAND.primary, quote: "我們不推銷，我們教理財。", desc: "從傳統金融業出身，看見年輕世代對理財的渴望卻找不到信任的管道，毅然創辦富誠 FinTech。" },
  { name: "林教授", role: "行銷顧問", ini: "林", color: BRAND.story, quote: "好的行銷不是說服，是讓對的人找到對的產品。", desc: "大學行銷學教授，陳建宏的恩師。用學術理論為富誠的品牌策略提供堅實基礎。" },
  { name: "小雅", role: "CMO / 行銷長", ini: "雅", color: BRAND.accent, quote: "年輕人不是不想理財，是不想被推銷。", desc: "九零後數位原住民，擅長社群行銷與內容策略，負責讓富誠的品牌走進年輕族群的日常。" },
  { name: "老李", role: "業務總監", ini: "李", color: BRAND.neutral, quote: "客戶把你跟推銷員綁在一起，你就完了。", desc: "資深業務老手，二十年金融銷售經驗。從最初的抗拒到逐漸理解「不推銷」哲學的轉變歷程。" },
];

export default function CharacterIntro() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-3xl mx-auto">
      <h4 className="text-center font-bold text-lg mb-1" style={{ color: BRAND.primary }}>富誠 FinTech 核心團隊</h4>
      <p className="text-center text-xs text-gray-500 mb-5">點擊角色卡片展開詳細介紹</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {CHARS.map((c, i) => {
          const open = expanded === i;
          return (
            <motion.button key={c.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 * i, duration: 0.4 }} onClick={() => setExpanded(open ? null : i)} className="rounded-xl p-4 text-center border-2 transition-all cursor-pointer" style={{ borderColor: open ? c.color : `${c.color}30`, backgroundColor: open ? `${c.color}10` : "#fff", boxShadow: open ? `0 4px 16px ${c.color}25` : "none" }}>
              <motion.div whileHover={{ scale: 1.08 }} className="mx-auto w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold mb-2 shadow" style={{ backgroundColor: c.color }}>{c.ini}</motion.div>
              <div className="font-bold text-sm" style={{ color: c.color }}>{c.name}</div>
              <div className="text-xs text-gray-400 mb-2">{c.role}</div>
              <div className="text-xs italic text-gray-600 leading-relaxed">&ldquo;{c.quote}&rdquo;</div>
              <AnimatePresence>
                {open && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-3 pt-3 border-t text-xs text-gray-600 text-left leading-relaxed" style={{ borderColor: `${c.color}30` }}>{c.desc}</motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-5 text-center text-sm p-3 rounded-lg" style={{ backgroundColor: `${BRAND.danger}10`, color: "#374151" }}>
        <span className="font-bold" style={{ color: BRAND.danger }}>對手：萬泰金控</span> — 大型傳統金融集團，代表舊時代「推銷至上」的行銷思維。富誠的每一步創新，都在挑戰萬泰的既有版圖。
      </motion.div>
    </motion.div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND } from "@/components/brand/BrandColors";

const DEFS = [
  { author: "Kotler (2020)", color: BRAND.primary, kw: ["創造價值", "交換"], text: "行銷是透過創造、提供和交換有價值的產品，以滿足需要與慾望的社會與管理過程。", insight: "Kotler 強調行銷的核心在「價值交換」——不是單向推銷，而是雙方都獲得價值的過程。" },
  { author: "AMA (2017)", color: BRAND.story, kw: ["利害關係人", "過程"], text: "行銷是創造、溝通、傳遞和交換對顧客、客戶、合作夥伴及社會整體有價值之產品的活動、機構和過程。", insight: "美國行銷協會的定義將受益者從「顧客」擴展到「社會整體」——行銷不只是企業獲利工具，更承擔社會責任。" },
  { author: "Drucker", color: BRAND.accent, kw: ["了解顧客", "推銷多餘"], text: "行銷的目的在於充分了解顧客，使產品或服務自然賣出——使推銷成為多餘。", insight: "Drucker 的定義最為激進：如果你真正了解顧客，根本不需要推銷。這是富誠「我們不推銷」哲學的理論基礎。" },
];

export default function ThreeDefinitionsTable() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-3xl mx-auto">
      <h4 className="text-center font-bold text-lg mb-1" style={{ color: BRAND.primary }}>三大行銷定義比較</h4>
      <p className="text-center text-xs text-gray-500 mb-5">點擊卡片展開深度解析</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        {DEFS.map((d, i) => {
          const open = expanded === i;
          return (
            <motion.div key={d.author} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 * i, duration: 0.4 }} onClick={() => setExpanded(open ? null : i)} className="rounded-xl p-4 border-2 cursor-pointer transition-all" style={{ borderColor: open ? d.color : `${d.color}30`, backgroundColor: open ? `${d.color}08` : "#fff", boxShadow: open ? `0 4px 16px ${d.color}20` : "none" }}>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-3" style={{ backgroundColor: d.color }}>{d.author}</div>
              <div className="text-sm text-gray-700 leading-relaxed mb-3">{d.text}</div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {d.kw.map((k) => (
                  <span key={k} className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: `${d.color}15`, color: d.color }}>{k}</span>
                ))}
              </div>
              <AnimatePresence>
                {open && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-3 pt-3 border-t text-xs text-gray-600 leading-relaxed" style={{ borderColor: `${d.color}25` }}>
                    <span className="font-bold" style={{ color: d.color }}>深度解析：</span> {d.insight}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-center text-sm p-4 rounded-lg" style={{ backgroundColor: `${BRAND.accent}12`, color: "#374151" }}>
        <span className="font-bold" style={{ color: BRAND.accent }}>共同交集：</span> 三個定義都指向同一件事——行銷的本質是「為顧客創造價值」，而不是「把東西賣出去」。
      </motion.div>
    </motion.div>
  );
}

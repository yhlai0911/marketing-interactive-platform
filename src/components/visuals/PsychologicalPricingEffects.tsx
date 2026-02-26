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

interface PricingEffect {
  key: string;
  name: string;
  nameEn: string;
  color: string;
  icon: string;
  tagline: string;
  description: string;
  financeCase: string;
  visual: {
    type: "anchor" | "range" | "zero" | "quality";
  };
}

const EFFECTS: PricingEffect[] = [
  {
    key: "anchor",
    name: "價格錨定",
    nameEn: "Price Anchoring",
    color: BRAND.primary,
    icon: "⚓",
    tagline: "0.15% → 0.3% 感覺貴了一倍",
    description:
      "消費者會以第一個接觸的價格作為「錨點」來判斷後續價格。萬泰先丟出 0.15% 的超低管理費，讓消費者把它當成標準，再看到富誠的 0.3% 就覺得「貴了一倍」——即使 0.3% 在市場上仍算合理。",
    financeCase:
      "對策：富誠不跟進降價，而是重新設定錨點——「不是比誰便宜，而是比誰幫你賺更多。0.3% 換一位 CFP 持照顧問，值不值？」",
    visual: { type: "anchor" },
  },
  {
    key: "reference",
    name: "參考價格",
    nameEn: "Reference Price",
    color: BRAND.story,
    icon: "📊",
    tagline: "ETF 管理費 0.3%-0.5% 是消費者的合理範圍",
    description:
      "消費者心中有一個「合理價格範圍」——根據過去經驗、市場行情形成的內部參考價格。台灣機器人理財的管理費市場行情約 0.3%-0.5%，富誠的 0.3% 恰好落在這個「合理區間」的下緣。",
    financeCase:
      "富誠定價 0.3% 的策略邏輯：不高於市場參考價格上限（不嚇跑客戶），不低於下限（不引發品質懷疑），同時用附加服務創造超額價值感。",
    visual: { type: "range" },
  },
  {
    key: "zero",
    name: "零價格效應",
    nameEn: "Zero Price Effect",
    color: BRAND.accent,
    icon: "🆓",
    tagline: "$1→$0 的吸引力 >> $2→$1",
    description:
      "「免費」的心理吸引力遠大於「便宜」。從 $1 降到 $0 的吸引力，遠超過從 $2 降到 $1——儘管同樣都是省了 $1。零的魔力在於完全消除「付出感」。",
    financeCase:
      "萬泰的「零手續費」策略正是利用零價格效應——即使隱藏成本更高（管理費 0.6%），「零」字本身就有巨大的行銷吸引力。富誠的回應：「手續費我們也是 0%，但我們連隱藏費用都透明公開。」",
    visual: { type: "zero" },
  },
  {
    key: "quality",
    name: "價格品質訊號",
    nameEn: "Price-Quality Signal",
    color: BRAND.danger,
    icon: "💎",
    tagline: "太便宜反而嚇跑客戶",
    description:
      "在資訊不對稱的市場中，消費者會用價格推斷品質。金融服務的「品質」在購買前看不見、摸不著，價格就成了最重要的品質線索。0.15% 的管理費可能讓客戶擔心「這麼便宜，服務品質行嗎？」",
    financeCase:
      "富誠故意不跟進降到 0.15%，因為太低的價格會傳遞「我們的服務不值錢」的訊號。0.3% + 透明的服務內容，反而能建立「每分錢都有價值」的品質認知。",
    visual: { type: "quality" },
  },
];

function AnchorVisual() {
  return (
    <div className="flex items-center justify-center gap-4 py-3">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="text-center"
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-black"
          style={{ backgroundColor: `${BRAND.danger}15`, color: BRAND.danger }}
        >
          0.15%
        </div>
        <p className="text-xs mt-1" style={{ color: BRAND.neutral }}>
          錨點
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-lg font-bold"
        style={{ color: BRAND.neutral }}
      >
        →
      </motion.div>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.7, type: "spring" }}
        className="text-center"
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-black"
          style={{ backgroundColor: `${BRAND.primary}15`, color: BRAND.primary }}
        >
          0.3%
        </div>
        <p className="text-xs mt-1" style={{ color: BRAND.neutral }}>
          感覺貴一倍
        </p>
      </motion.div>
    </div>
  );
}

function RangeVisual() {
  return (
    <div className="py-3 px-2">
      <div className="relative h-6 rounded-full" style={{ backgroundColor: "#f3f4f6" }}>
        {/* Reasonable range */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "40%" }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="absolute h-full rounded-full"
          style={{
            left: "25%",
            backgroundColor: `${BRAND.story}30`,
          }}
        />
        {/* FuCheng marker */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, type: "spring" }}
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2"
          style={{
            left: "25%",
            backgroundColor: BRAND.story,
            borderColor: "#fff",
          }}
        />
        {/* Labels */}
        <span
          className="absolute -top-5 text-xs font-bold"
          style={{ left: "5%", color: BRAND.neutral }}
        >
          0.1%
        </span>
        <span
          className="absolute -top-5 text-xs font-bold"
          style={{ left: "23%", color: BRAND.story }}
        >
          0.3%
        </span>
        <span
          className="absolute -top-5 text-xs font-bold"
          style={{ left: "60%", color: BRAND.neutral }}
        >
          0.5%
        </span>
        <span
          className="absolute -top-5 text-xs font-bold"
          style={{ left: "88%", color: BRAND.neutral }}
        >
          1.0%
        </span>
      </div>
      <p className="text-center text-xs mt-3" style={{ color: BRAND.story }}>
        合理範圍 0.3%-0.5%
      </p>
    </div>
  );
}

function ZeroVisual() {
  return (
    <div className="flex items-center justify-center gap-2 py-3">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col items-center"
      >
        <div className="flex items-center gap-1 text-sm">
          <span style={{ color: BRAND.neutral }}>$2</span>
          <span style={{ color: BRAND.neutral }}>→</span>
          <span className="font-bold" style={{ color: BRAND.neutral }}>
            $1
          </span>
        </div>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 40 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="h-2 rounded-full mt-1"
          style={{ backgroundColor: `${BRAND.neutral}40` }}
        />
        <p className="text-xs mt-1" style={{ color: BRAND.neutral }}>
          普通吸引力
        </p>
      </motion.div>

      <span className="text-lg px-2" style={{ color: BRAND.neutral }}>
        vs
      </span>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col items-center"
      >
        <div className="flex items-center gap-1 text-sm">
          <span style={{ color: BRAND.neutral }}>$1</span>
          <span style={{ color: BRAND.neutral }}>→</span>
          <span className="font-black text-base" style={{ color: BRAND.accent }}>
            $0
          </span>
        </div>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 80 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="h-2 rounded-full mt-1"
          style={{ backgroundColor: BRAND.accent }}
        />
        <p className="text-xs mt-1 font-bold" style={{ color: BRAND.accent }}>
          巨大吸引力!
        </p>
      </motion.div>
    </div>
  );
}

function QualityVisual() {
  return (
    <div className="flex items-end justify-center gap-6 py-3">
      {[
        { price: "0.05%", quality: 20, label: "嫌太便宜", color: BRAND.danger },
        { price: "0.15%", quality: 45, label: "懷疑品質", color: BRAND.accent },
        { price: "0.3%", quality: 85, label: "信任感高", color: BRAND.story },
        { price: "0.8%", quality: 50, label: "嫌太貴", color: BRAND.neutral },
      ].map((item, i) => (
        <motion.div
          key={item.price}
          initial={{ height: 0 }}
          animate={{ height: item.quality }}
          transition={{ delay: 0.3 + i * 0.15, type: "spring", stiffness: 80 }}
          className="flex flex-col items-center"
        >
          <motion.div
            className="rounded-t-md"
            style={{
              width: 36,
              height: item.quality,
              backgroundColor: item.color,
            }}
          />
          <p className="text-xs font-bold mt-1" style={{ color: item.color }}>
            {item.price}
          </p>
          <p className="text-xs" style={{ color: BRAND.neutral, fontSize: "0.6rem" }}>
            {item.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

const VISUAL_MAP: Record<string, React.FC> = {
  anchor: AnchorVisual,
  range: RangeVisual,
  zero: ZeroVisual,
  quality: QualityVisual,
};

export default function PsychologicalPricingEffects() {
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  const toggleCard = (key: string) => {
    setExpandedKey(expandedKey === key ? null : key);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Title */}
      <h3 className="text-base font-bold mb-1" style={{ color: BRAND.primary }}>
        四大心理定價效應
      </h3>
      <p className="text-xs mb-5" style={{ color: BRAND.neutral }}>
        價格不只是數字——消費者的大腦如何「感受」價格？點擊卡片深入了解
      </p>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {EFFECTS.map((effect, i) => {
          const VisualComponent = VISUAL_MAP[effect.visual.type];
          const isExpanded = expandedKey === effect.key;

          return (
            <motion.div
              key={effect.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
              className="rounded-xl cursor-pointer transition-all"
              style={{
                border: `1.5px solid ${effect.color}40`,
                backgroundColor: isExpanded ? `${effect.color}06` : "#fff",
              }}
              onClick={() => toggleCard(effect.key)}
            >
              <div className="p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{effect.icon}</span>
                    <div>
                      <h4 className="text-sm font-bold" style={{ color: effect.color }}>
                        {effect.name}
                      </h4>
                      <p className="text-xs" style={{ color: BRAND.neutral }}>
                        {effect.nameEn}
                      </p>
                    </div>
                  </div>
                  <motion.span
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    className="text-xs"
                    style={{ color: effect.color }}
                  >
                    &#9660;
                  </motion.span>
                </div>

                {/* Tagline */}
                <div
                  className="rounded-md px-3 py-2 mb-2"
                  style={{ backgroundColor: `${effect.color}10` }}
                >
                  <p className="text-xs font-bold" style={{ color: effect.color }}>
                    {effect.tagline}
                  </p>
                </div>

                {/* Mini Visual */}
                {VisualComponent && <VisualComponent />}

                {/* Expanded */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div
                        className="mt-3 pt-3 space-y-3"
                        style={{ borderTop: `1px solid ${effect.color}20` }}
                      >
                        <div>
                          <p
                            className="text-xs font-semibold mb-1"
                            style={{ color: effect.color }}
                          >
                            原理
                          </p>
                          <p className="text-xs leading-relaxed" style={{ color: "#374151" }}>
                            {effect.description}
                          </p>
                        </div>
                        <div
                          className="rounded-lg p-3"
                          style={{
                            backgroundColor: `${BRAND.accent}08`,
                            borderLeft: `3px solid ${BRAND.accent}`,
                          }}
                        >
                          <p
                            className="text-xs font-semibold mb-1"
                            style={{ color: BRAND.accent }}
                          >
                            金融應用
                          </p>
                          <p className="text-xs leading-relaxed" style={{ color: "#374151" }}>
                            {effect.financeCase}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Insight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 rounded-lg p-4"
        style={{
          backgroundColor: `${BRAND.accent}08`,
          border: `1px solid ${BRAND.accent}`,
        }}
      >
        <p className="text-sm font-bold" style={{ color: BRAND.accent }}>
          小結：價格是一種「語言」
        </p>
        <p className="text-xs mt-1" style={{ color: "#374151" }}>
          消費者不是純理性地比較數字——他們的大腦會用錨定、參考價格、零的魔力和品質推斷來「翻譯」價格。懂得這四種效應，就能用定價策略說出正確的品牌故事。
        </p>
      </motion.div>
    </div>
  );
}

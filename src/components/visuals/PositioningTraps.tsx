"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND } from "@/components/brand/BrandColors";

interface Trap {
  key: string;
  icon: string;
  name: string;
  english: string;
  color: string;
  definition: string;
  badExample: string;
  avoidance: string;
}

const TRAPS: Trap[] = [
  {
    key: "under",
    icon: "\u2753",
    name: "定位不足",
    english: "Under-positioning",
    color: BRAND.danger,
    definition: "消費者完全不知道你的品牌有什麼特色，在腦海中沒有留下任何印象。",
    badExample: "某金融 App 什麼都做一點（存款、投資、保險、貸款），但每個功能都很平庸，消費者想不出一個理由選它而不選別人。",
    avoidance: "聚焦一個核心價值主張，讓目標客群一提到某個需求就想到你。富誠選擇「用教育取代推銷」作為鮮明定位。",
  },
  {
    key: "over",
    icon: "\uD83D\uDCE6",
    name: "定位過度",
    english: "Over-positioning",
    color: BRAND.accent,
    definition: "品牌形象太窄，消費者以為你只服務極小眾市場，錯失更大的機會。",
    badExample: "某券商全力主打「高頻交易專家」形象，導致一般投資人以為它只適合專業交易員，不敢開戶。",
    avoidance: "定位要精準但不能排他。傳達核心優勢時，保留品牌延伸的空間，避免用過於限縮的標籤。",
  },
  {
    key: "confused",
    icon: "\uD83D\uDD04",
    name: "定位混淆",
    english: "Confused positioning",
    color: BRAND.primary,
    definition: "品牌訊息前後矛盾，消費者搞不清楚你到底是什麼。",
    badExample: "某銀行一下說自己是「年輕人的數位銀行」，一下又推高端私人銀行服務，廣告風格一會活潑一會嚴肅，客戶完全混亂。",
    avoidance: "所有行銷接觸點（廣告、App、客服、門市）必須傳達一致的品牌訊息。定期做品牌審計，確認內外溝通的一致性。",
  },
];

export default function PositioningTraps() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto"
    >
      <h4 className="text-center font-bold text-lg mb-1" style={{ color: BRAND.danger }}>
        三大定位陷阱
      </h4>
      <p className="text-center text-xs text-gray-500 mb-5">
        點擊卡片展開詳細說明與避免方法
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        {TRAPS.map((trap, i) => {
          const isOpen = expanded === trap.key;
          return (
            <motion.div
              key={trap.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i }}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => setExpanded(isOpen ? null : trap.key)}
                className="w-full rounded-xl p-4 border-2 text-center transition-all cursor-pointer"
                style={{
                  borderColor: isOpen ? trap.color : `${trap.color}30`,
                  backgroundColor: `${trap.color}08`,
                }}
              >
                <div className="text-3xl mb-2">{trap.icon}</div>
                <div className="font-bold text-sm" style={{ color: trap.color }}>{trap.name}</div>
                <div className="text-xs text-gray-400 mb-2">{trap.english}</div>
                <div className="text-xs text-gray-500 leading-relaxed">{trap.definition}</div>
              </motion.button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 p-3 rounded-lg border-l-4 space-y-2" style={{ borderLeftColor: trap.color, backgroundColor: `${trap.color}05` }}>
                      <div>
                        <div className="text-xs font-bold mb-0.5" style={{ color: BRAND.danger }}>
                          金融業錯誤案例
                        </div>
                        <div className="text-xs text-gray-600 leading-relaxed">{trap.badExample}</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold mb-0.5" style={{ color: BRAND.story }}>
                          如何避免
                        </div>
                        <div className="text-xs text-gray-600 leading-relaxed">{trap.avoidance}</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-sm p-3 rounded-lg"
        style={{ backgroundColor: `${BRAND.accent}10`, color: "#374151" }}
      >
        <span className="font-bold" style={{ color: BRAND.accent }}>自我檢查：</span>{" "}
        用一句話描述你的品牌，問 10 個目標客戶。如果答案模糊、太窄、或不一致，你可能已經掉入陷阱了。
      </motion.div>
    </motion.div>
  );
}

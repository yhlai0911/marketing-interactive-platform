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

interface CaseData {
  id: "delivery" | "finance";
  label: string;
  persona: string;
  painPoints: string;
  color: string;
}

interface DimensionRow {
  name: string;
  description: string;
  delivery: string;
  finance: string;
  bestChannel: string;
  channelIcon: string;
}

const CASES: CaseData[] = [
  {
    id: "delivery",
    label: "外送平台",
    persona: "謝章升（38 歲講師）",
    painPoints: "懶 / 排隊 / 停車",
    color: BRAND.story,
  },
  {
    id: "finance",
    label: "金融商品",
    persona: "林志翔（28 歲工程師）",
    painPoints: "不懂 / 不信 / 不動",
    color: BRAND.primary,
  },
];

const DIMENSIONS: DimensionRow[] = [
  {
    name: "直接訴求",
    description: "直接告訴消費者產品做什麼——簡單、明瞭、功能導向",
    delivery: "美食外送，UberEats",
    finance: "3 分鐘開戶，AI 幫你規劃理財",
    bestChannel: "Google 搜尋廣告",
    channelIcon: "🔍",
  },
  {
    name: "提問",
    description: "用問題引起共鳴，讓消費者覺得「對，我就是這樣」",
    delivery: "今晚想來點什麼？",
    finance: "你知道退休金缺口有多大嗎？",
    bestChannel: "IG 限動 / 社群",
    channelIcon: "📱",
  },
  {
    name: "戲劇化",
    description: "用誇張或故事化方式呈現改變，創造記憶點",
    delivery: "用過一次，這輩子再也沒排過隊",
    finance: "從看不懂基金到月存一萬，只花了一個週末",
    bestChannel: "YouTube 廣告",
    channelIcon: "🎬",
  },
];

export default function W08ThreeDimensions() {
  const [activeCase, setActiveCase] = useState<"delivery" | "finance">(
    "delivery"
  );
  const [activeDimension, setActiveDimension] = useState<number | null>(null);

  const currentCase = CASES.find((c) => c.id === activeCase)!;

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h3
        className="text-center text-lg font-bold mb-1"
        style={{ color: BRAND.primary }}
      >
        發想三構面：從痛點到行銷訊息
      </h3>
      <p className="text-center text-xs text-gray-500 mb-4">
        切換外送 / 金融案例，點擊構面查看適合的媒體通路
      </p>

      {/* 案例切換按鈕 */}
      <div className="flex gap-2 mb-5 justify-center">
        {CASES.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setActiveCase(c.id);
              setActiveDimension(null);
            }}
            className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
            style={{
              backgroundColor: activeCase === c.id ? c.color : "#f3f4f6",
              color: activeCase === c.id ? "white" : c.color,
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* 人物誌摘要 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCase}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="mb-5 p-3 rounded-lg text-center"
          style={{
            backgroundColor: `${currentCase.color}10`,
            border: `1px solid ${currentCase.color}30`,
          }}
        >
          <span
            className="text-sm font-bold"
            style={{ color: currentCase.color }}
          >
            {currentCase.persona}
          </span>
          <span className="text-sm text-gray-600 ml-2">
            痛點：{currentCase.painPoints}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* 三構面對照表 */}
      <div className="space-y-3">
        {DIMENSIONS.map((dim, i) => {
          const isActive = activeDimension === i;
          return (
            <motion.div
              key={`${activeCase}-${i}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-lg overflow-hidden cursor-pointer border transition-all"
              style={{
                borderColor: isActive ? BRAND.accent : "#e5e7eb",
                boxShadow: isActive
                  ? `0 0 0 2px ${BRAND.accent}40`
                  : "none",
              }}
              onClick={() =>
                setActiveDimension(isActive ? null : i)
              }
            >
              {/* 構面標題行 */}
              <div
                className="flex items-center gap-3 px-4 py-3"
                style={{
                  backgroundColor: isActive ? `${BRAND.accent}15` : "#fafafa",
                }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{
                    backgroundColor:
                      i === 0
                        ? BRAND.primary
                        : i === 1
                        ? BRAND.accent
                        : BRAND.story,
                  }}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm" style={{ color: BRAND.primary }}>
                    {dim.name}
                  </h4>
                  <p className="text-xs text-gray-500">{dim.description}</p>
                </div>
                <div className="text-xs text-gray-400 flex-shrink-0">
                  {isActive ? "▲" : "▼"}
                </div>
              </div>

              {/* 文案範例 */}
              <AnimatePresence>
                <motion.div
                  className="px-4 py-3 border-t border-gray-100"
                  style={{
                    backgroundColor: `${currentCase.color}05`,
                  }}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-lg">{activeCase === "delivery" ? "🛵" : "💰"}</span>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">
                        {currentCase.label}文案範例
                      </p>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: currentCase.color }}
                      >
                        「{activeCase === "delivery" ? dim.delivery : dim.finance}」
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* 展開的通路建議 */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="px-4 py-3 border-t"
                      style={{
                        borderColor: `${BRAND.accent}30`,
                        backgroundColor: `${BRAND.accent}08`,
                      }}
                    >
                      <p className="text-xs text-gray-500 mb-1">最適合的媒體通路</p>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{dim.channelIcon}</span>
                        <span
                          className="text-sm font-bold"
                          style={{ color: BRAND.accent }}
                        >
                          {dim.bestChannel}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {i === 0 &&
                          "搜尋廣告面對有明確需求的消費者，直接訴求最能快速傳遞功能價值。"}
                        {i === 1 &&
                          "社群平台適合用提問引發互動，讓消費者在滑動中被問題打中。"}
                        {i === 2 &&
                          "影片格式能完整呈現故事弧線，戲劇化的前後對比最有感染力。"}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* 底部提示 */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-xs text-gray-400 mt-4"
      >
        三個構面沒有優劣之分，重要的是根據媒體通路和目標客群特性選擇最適合的方式。
      </motion.p>
    </div>
  );
}

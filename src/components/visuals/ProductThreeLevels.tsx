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

type LayerKey = "core" | "tangible" | "augmented";
type CaseKey = "fucheng" | "wantai";

interface TangibleItem {
  dimension: string;
  fucheng: string;
  wantai: string;
}

interface AugmentedData {
  fucheng: string[];
  wantai: string[];
}

const CORE_BENEFITS: Record<CaseKey, { label: string; desc: string }> = {
  fucheng: { label: "富誠·安退", desc: "「退休不焦慮」的安心感" },
  wantai: { label: "萬泰智投 Pro", desc: "「財富最大化」的報酬率追求" },
};

const TANGIBLE_ITEMS: TangibleItem[] = [
  { dimension: "品質", fucheng: "AI 退休試算精準度 95%+", wantai: "500 支 ETF 投資組合" },
  { dimension: "功能", fucheng: "自動再平衡 + 退休倒數計時", wantai: "AI 選股引擎 + 量化回測" },
  { dimension: "設計", fucheng: "暖色調「安退」分頁介面", wantai: "科技感深色交易介面" },
  { dimension: "品牌", fucheng: "副品牌「富誠·安退」", wantai: "品牌延伸「萬泰智投 Pro」" },
  { dimension: "包裝（費率）", fucheng: "月投 1,000 元起 / 管理費 0.3%", wantai: "零手續費 / 管理費 0.6%" },
];

const AUGMENTED_DATA: AugmentedData = {
  fucheng: [
    "安退通信——每月退休進度報告",
    "退休焦慮測驗——量化焦慮指數",
    "退休社群——同齡學習交流",
    "退場機制——不滿意全額退費",
    "年度健檢——CFP 一對一檢視",
  ],
  wantai: [
    "FAQ 常見問題集",
    "客服專線（週一至週五）",
  ],
};

const LAYERS: { key: LayerKey; label: string; sublabel: string; color: string; radius: number }[] = [
  { key: "augmented", label: "延伸產品", sublabel: "Augmented Product", color: BRAND.story, radius: 140 },
  { key: "tangible", label: "形式產品", sublabel: "Tangible Product", color: BRAND.primary, radius: 95 },
  { key: "core", label: "核心利益", sublabel: "Core Benefit", color: BRAND.accent, radius: 50 },
];

export default function ProductThreeLevels() {
  const [selectedLayer, setSelectedLayer] = useState<LayerKey | null>(null);
  const [activeCase, setActiveCase] = useState<CaseKey>("fucheng");
  const [hoveredLayer, setHoveredLayer] = useState<LayerKey | null>(null);

  const cases: { key: CaseKey; label: string }[] = [
    { key: "fucheng", label: "富誠·安退" },
    { key: "wantai", label: "萬泰智投 Pro" },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Case Toggle */}
      <div className="flex gap-2 mb-6">
        {cases.map((c) => (
          <button
            key={c.key}
            onClick={() => { setActiveCase(c.key); setSelectedLayer(null); }}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: activeCase === c.key ? BRAND.primary : "#f3f4f6",
              color: activeCase === c.key ? "#fff" : BRAND.neutral,
              border: activeCase === c.key && c.key === "fucheng" ? `2px solid ${BRAND.accent}` : "2px solid transparent",
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Concentric Circles + Detail Panel */}
      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* SVG Circles */}
        <div className="shrink-0">
          <svg width="300" height="300" viewBox="0 0 300 300" className="mx-auto">
            {LAYERS.map((layer, i) => {
              const isActive = selectedLayer === layer.key;
              const isHovered = hoveredLayer === layer.key;
              return (
                <motion.g
                  key={layer.key}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: (LAYERS.length - 1 - i) * 0.15, type: "spring", stiffness: 120 }}
                  style={{ transformOrigin: "150px 150px" }}
                >
                  <circle
                    cx={150}
                    cy={150}
                    r={layer.radius}
                    fill={`${layer.color}${isActive ? "30" : isHovered ? "20" : "12"}`}
                    stroke={layer.color}
                    strokeWidth={isActive ? 3 : isHovered ? 2.5 : 1.5}
                    className="cursor-pointer transition-all"
                    style={{ filter: isActive ? `drop-shadow(0 0 8px ${layer.color}60)` : "none" }}
                    onClick={() => setSelectedLayer(isActive ? null : layer.key)}
                    onMouseEnter={() => setHoveredLayer(layer.key)}
                    onMouseLeave={() => setHoveredLayer(null)}
                  />
                  <text
                    x={150}
                    y={layer.key === "core" ? 145 : layer.key === "tangible" ? 72 : 28}
                    textAnchor="middle"
                    fill={layer.color}
                    fontSize={layer.key === "core" ? 13 : 12}
                    fontWeight="bold"
                    className="pointer-events-none select-none"
                  >
                    {layer.label}
                  </text>
                  <text
                    x={150}
                    y={layer.key === "core" ? 160 : layer.key === "tangible" ? 86 : 42}
                    textAnchor="middle"
                    fill={BRAND.neutral}
                    fontSize={9}
                    className="pointer-events-none select-none"
                  >
                    {layer.sublabel}
                  </text>
                </motion.g>
              );
            })}
          </svg>
          <p className="text-xs text-center mt-2" style={{ color: BRAND.neutral }}>
            點擊圓圈查看詳細內容
          </p>
        </div>

        {/* Detail Panel */}
        <div className="flex-1 min-w-0 w-full">
          <AnimatePresence mode="wait">
            {selectedLayer === "core" && (
              <motion.div
                key={`core-${activeCase}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="rounded-xl p-5 border-2"
                style={{ borderColor: BRAND.accent, backgroundColor: `${BRAND.accent}08` }}
              >
                <h4 className="font-bold mb-3" style={{ color: BRAND.accent }}>
                  核心利益 — {CORE_BENEFITS[activeCase].label}
                </h4>
                <div
                  className="rounded-lg p-4 text-center"
                  style={{ backgroundColor: `${BRAND.accent}15` }}
                >
                  <p className="text-lg font-bold" style={{ color: BRAND.accent }}>
                    {CORE_BENEFITS[activeCase].desc}
                  </p>
                </div>
                <p className="text-xs mt-3" style={{ color: BRAND.neutral }}>
                  核心利益是消費者真正購買的東西——不是產品本身，而是產品帶來的「好處」。
                </p>
              </motion.div>
            )}

            {selectedLayer === "tangible" && (
              <motion.div
                key={`tangible-${activeCase}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="rounded-xl p-5 border-2"
                style={{ borderColor: BRAND.primary, backgroundColor: `${BRAND.primary}08` }}
              >
                <h4 className="font-bold mb-3" style={{ color: BRAND.primary }}>
                  形式產品 — 5 大維度比較
                </h4>
                <div className="space-y-2">
                  {TANGIBLE_ITEMS.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="rounded-lg p-3"
                      style={{ backgroundColor: `${BRAND.primary}08` }}
                    >
                      <p className="text-xs font-bold mb-1" style={{ color: BRAND.primary }}>
                        {item.dimension}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-4">
                        <div className="flex-1">
                          <span
                            className="inline-block text-xs px-1.5 py-0.5 rounded mr-1"
                            style={{
                              backgroundColor: activeCase === "fucheng" ? `${BRAND.story}20` : `${BRAND.neutral}15`,
                              color: activeCase === "fucheng" ? BRAND.story : BRAND.neutral,
                              fontWeight: activeCase === "fucheng" ? 600 : 400,
                            }}
                          >
                            富誠
                          </span>
                          <span className="text-xs" style={{ color: "#374151" }}>{item.fucheng}</span>
                        </div>
                        <div className="flex-1">
                          <span
                            className="inline-block text-xs px-1.5 py-0.5 rounded mr-1"
                            style={{
                              backgroundColor: activeCase === "wantai" ? `${BRAND.danger}20` : `${BRAND.neutral}15`,
                              color: activeCase === "wantai" ? BRAND.danger : BRAND.neutral,
                              fontWeight: activeCase === "wantai" ? 600 : 400,
                            }}
                          >
                            萬泰
                          </span>
                          <span className="text-xs" style={{ color: "#374151" }}>{item.wantai}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {selectedLayer === "augmented" && (
              <motion.div
                key={`augmented-${activeCase}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="rounded-xl p-5 border-2"
                style={{ borderColor: BRAND.story, backgroundColor: `${BRAND.story}08` }}
              >
                <h4 className="font-bold mb-3" style={{ color: BRAND.story }}>
                  延伸產品 — {activeCase === "fucheng" ? "富誠·安退" : "萬泰智投 Pro"}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Fucheng Column */}
                  <div>
                    <p className="text-sm font-semibold mb-2" style={{ color: BRAND.story }}>
                      富誠（{AUGMENTED_DATA.fucheng.length} 項服務）
                    </p>
                    <div className="space-y-1.5">
                      {AUGMENTED_DATA.fucheng.map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.06 }}
                          className="flex items-center gap-2 text-xs rounded-md px-3 py-2"
                          style={{
                            backgroundColor: activeCase === "fucheng" ? `${BRAND.story}15` : "#f9fafb",
                            color: "#374151",
                            border: activeCase === "fucheng" ? `1px solid ${BRAND.story}30` : "1px solid #e5e7eb",
                          }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: BRAND.story }} />
                          {item}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  {/* Wantai Column */}
                  <div>
                    <p className="text-sm font-semibold mb-2" style={{ color: BRAND.danger }}>
                      萬泰（{AUGMENTED_DATA.wantai.length} 項服務）
                    </p>
                    <div className="space-y-1.5">
                      {AUGMENTED_DATA.wantai.map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.06 }}
                          className="flex items-center gap-2 text-xs rounded-md px-3 py-2"
                          style={{
                            backgroundColor: activeCase === "wantai" ? `${BRAND.danger}15` : "#f9fafb",
                            color: "#374151",
                            border: activeCase === "wantai" ? `1px solid ${BRAND.danger}30` : "1px solid #e5e7eb",
                          }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: BRAND.danger }} />
                          {item}
                        </motion.div>
                      ))}
                    </div>
                    {activeCase === "wantai" && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs mt-2 italic"
                        style={{ color: BRAND.danger }}
                      >
                        萬泰的延伸產品明顯薄弱——只有基本客服
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Insight */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-4 rounded-lg p-3"
                  style={{ backgroundColor: `${BRAND.accent}10`, border: `1px solid ${BRAND.accent}` }}
                >
                  <p className="text-xs font-semibold" style={{ color: BRAND.accent }}>
                    洞察：延伸產品是差異化的關鍵
                  </p>
                  <p className="text-xs mt-1" style={{ color: BRAND.neutral }}>
                    核心利益和形式產品容易被模仿，延伸產品（售後服務、社群、信任機制）才是建立長期競爭優勢的護城河。
                  </p>
                </motion.div>
              </motion.div>
            )}

            {selectedLayer === null && (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-xl p-6 text-center"
                style={{ backgroundColor: "#f9fafb", border: "2px dashed #e5e7eb" }}
              >
                <p className="text-sm" style={{ color: BRAND.neutral }}>
                  點擊左側的同心圓，查看各層次的詳細內容
                </p>
                <p className="text-xs mt-2" style={{ color: BRAND.neutral }}>
                  Kotler 產品三層次模型：從核心利益到延伸產品
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

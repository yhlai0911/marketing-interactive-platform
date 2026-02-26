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

type StrategyKey = "extension" | "independent" | "subbrand";

interface StrategyData {
  key: StrategyKey;
  name: string;
  nameEn: string;
  color: string;
  isHighlighted: boolean;
  pros: string[];
  cons: string[];
  case: string;
  caseDetail: string;
}

const STRATEGIES: StrategyData[] = [
  {
    key: "extension",
    name: "品牌延伸",
    nameEn: "Brand Extension",
    color: BRAND.primary,
    isHighlighted: false,
    pros: ["降低推廣成本——借用母品牌知名度", "消費者較快建立信任"],
    cons: ["新品失敗會拖累母品牌形象", "母品牌定位可能被稀釋"],
    case: "國泰世華",
    caseDetail: "國泰人壽延伸至銀行、投信、證券，統一使用「國泰」品牌。優勢是品牌資產共享，風險是任一事業體出問題影響全集團。",
  },
  {
    key: "independent",
    name: "獨立品牌",
    nameEn: "Independent Brand",
    color: BRAND.danger,
    isHighlighted: false,
    pros: ["風險完全隔離——失敗不影響母品牌", "可針對不同客群獨立定位"],
    cons: ["信任必須從零建立，行銷成本高", "無法借力母品牌資源"],
    case: "匯豐 vs 恒生",
    caseDetail: "匯豐控股旗下的恒生銀行是獨立品牌。恒生有自己的品牌識別、客群定位（本地零售），與匯豐（國際企業）互不干擾。",
  },
  {
    key: "subbrand",
    name: "副品牌",
    nameEn: "Sub-Brand",
    color: BRAND.story,
    isHighlighted: true,
    pros: ["兼得母品牌信任 + 新品牌獨立定位", "可針對細分市場精準溝通"],
    cons: ["命名和視覺需精心規劃", "母子品牌關係需持續管理"],
    case: "富誠·安退",
    caseDetail: "富誠 FinTech 為退休理財推出副品牌「富誠·安退」。「富誠」提供母品牌信任背書，「安退」傳遞退休安心的獨特定位。",
  },
];

interface TrustPillar {
  name: string;
  nameEn: string;
  color: string;
  height: number; // percentage for bar chart
  items: string[];
}

const TRUST_PILLARS: TrustPillar[] = [
  {
    name: "制度信任",
    nameEn: "Institutional Trust",
    color: BRAND.primary,
    height: 85,
    items: ["金管會監管合規", "資訊安全認證（ISO 27001）", "銀行信託保管機制"],
  },
  {
    name: "能力信任",
    nameEn: "Competence Trust",
    color: BRAND.story,
    height: 75,
    items: ["AI 投資績效紀錄透明", "CFP 持照顧問團隊", "第三方績效評鑑"],
  },
  {
    name: "善意信任",
    nameEn: "Benevolence Trust",
    color: BRAND.accent,
    height: 90,
    items: ["「不推銷承諾」白紙黑字", "費用全透明（無隱藏費用）", "退場機制——不滿意可退出"],
  },
];

export default function BrandStrategyCompare() {
  const [expandedCard, setExpandedCard] = useState<StrategyKey | null>(null);
  const [hoveredPillar, setHoveredPillar] = useState<number | null>(null);

  const toggleCard = (key: StrategyKey) => {
    setExpandedCard(expandedCard === key ? null : key);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Title */}
      <h3 className="text-base font-bold mb-1" style={{ color: BRAND.primary }}>
        三種品牌策略比較
      </h3>
      <p className="text-xs mb-5" style={{ color: BRAND.neutral }}>
        點擊卡片查看詳細分析——看看富誠為什麼選擇副品牌策略
      </p>

      {/* Strategy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {STRATEGIES.map((strategy, i) => (
          <motion.div
            key={strategy.key}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12, type: "spring", stiffness: 100 }}
          >
            <div
              className="rounded-xl p-4 cursor-pointer transition-all h-full"
              style={{
                border: strategy.isHighlighted
                  ? `2.5px solid ${BRAND.accent}`
                  : `1.5px solid ${strategy.color}40`,
                backgroundColor: expandedCard === strategy.key ? `${strategy.color}08` : "#fff",
                boxShadow: strategy.isHighlighted ? `0 0 12px ${BRAND.accent}25` : "none",
              }}
              onClick={() => toggleCard(strategy.key)}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm" style={{ color: strategy.color }}>
                      {strategy.name}
                    </h4>
                    {strategy.isHighlighted && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-bold"
                        style={{ backgroundColor: `${BRAND.accent}20`, color: BRAND.accent }}
                      >
                        富誠的選擇
                      </span>
                    )}
                  </div>
                  <p className="text-xs" style={{ color: BRAND.neutral }}>{strategy.nameEn}</p>
                </div>
                <motion.span
                  animate={{ rotate: expandedCard === strategy.key ? 180 : 0 }}
                  className="text-sm"
                  style={{ color: strategy.color }}
                >
                  &#9660;
                </motion.span>
              </div>

              {/* Brief */}
              <div className="space-y-2 mb-3">
                <div>
                  <p className="text-xs font-semibold" style={{ color: BRAND.story }}>優點</p>
                  {strategy.pros.map((p, j) => (
                    <p key={j} className="text-xs flex items-start gap-1.5 mt-0.5" style={{ color: "#374151" }}>
                      <span className="shrink-0 mt-1 w-1 h-1 rounded-full" style={{ backgroundColor: BRAND.story }} />
                      {p}
                    </p>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-semibold" style={{ color: BRAND.danger }}>風險</p>
                  {strategy.cons.map((c, j) => (
                    <p key={j} className="text-xs flex items-start gap-1.5 mt-0.5" style={{ color: "#374151" }}>
                      <span className="shrink-0 mt-1 w-1 h-1 rounded-full" style={{ backgroundColor: BRAND.danger }} />
                      {c}
                    </p>
                  ))}
                </div>
              </div>

              {/* Case Badge */}
              <div
                className="rounded-md px-2 py-1 text-xs"
                style={{ backgroundColor: `${strategy.color}10`, color: strategy.color }}
              >
                案例：{strategy.case}
              </div>

              {/* Expanded Detail */}
              <AnimatePresence>
                {expandedCard === strategy.key && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="mt-3 rounded-lg p-3 border-l-3"
                      style={{ backgroundColor: `${strategy.color}08`, borderLeft: `3px solid ${strategy.color}` }}
                    >
                      <p className="text-xs" style={{ color: "#374151" }}>
                        {strategy.caseDetail}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Trust Pillars Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-base font-bold mb-1" style={{ color: BRAND.primary }}>
          品牌信任三來源
        </h3>
        <p className="text-xs mb-4" style={{ color: BRAND.neutral }}>
          金融品牌的信任不是單一維度——需要三根柱子共同支撐
        </p>

        {/* Bar Chart */}
        <div className="flex items-end justify-center gap-6 sm:gap-10 mb-4" style={{ height: 200 }}>
          {TRUST_PILLARS.map((pillar, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center cursor-pointer"
              onMouseEnter={() => setHoveredPillar(i)}
              onMouseLeave={() => setHoveredPillar(null)}
            >
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: pillar.height * 1.6 }}
                transition={{ delay: 0.5 + i * 0.12, type: "spring", stiffness: 80 }}
                className="rounded-t-lg relative"
                style={{
                  width: 60,
                  backgroundColor: hoveredPillar === i ? pillar.color : `${pillar.color}80`,
                  transition: "background-color 0.2s",
                }}
              >
                <span
                  className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold whitespace-nowrap"
                  style={{ color: pillar.color }}
                >
                  {pillar.height}%
                </span>
              </motion.div>
              <div className="mt-2 text-center">
                <p className="text-xs font-bold" style={{ color: pillar.color }}>{pillar.name}</p>
                <p className="text-xs" style={{ color: BRAND.neutral, fontSize: "0.6rem" }}>{pillar.nameEn}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Hover Detail */}
        <AnimatePresence mode="wait">
          {hoveredPillar !== null && (
            <motion.div
              key={hoveredPillar}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="rounded-lg p-3 border-l-4"
              style={{
                borderLeftColor: TRUST_PILLARS[hoveredPillar].color,
                backgroundColor: `${TRUST_PILLARS[hoveredPillar].color}08`,
              }}
            >
              <p className="text-sm font-bold mb-1" style={{ color: TRUST_PILLARS[hoveredPillar].color }}>
                {TRUST_PILLARS[hoveredPillar].name}
              </p>
              {TRUST_PILLARS[hoveredPillar].items.map((item, j) => (
                <p key={j} className="text-xs flex items-center gap-2 mt-0.5" style={{ color: "#374151" }}>
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: TRUST_PILLARS[hoveredPillar].color }}
                  />
                  {item}
                </p>
              ))}
            </motion.div>
          )}
          {hoveredPillar === null && (
            <motion.div
              key="default-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-lg p-3 text-center"
              style={{ backgroundColor: "#f9fafb" }}
            >
              <p className="text-xs" style={{ color: BRAND.neutral }}>
                將滑鼠移到柱狀圖上查看詳細說明
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

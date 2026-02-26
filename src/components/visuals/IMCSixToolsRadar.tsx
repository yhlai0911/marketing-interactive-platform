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

interface Tool {
  name: string;
  nameEn: string;
  color: string;
  reach: number;     // 1-5
  trust: number;     // 1-5
  cost: number;      // 1-5 (higher = more expensive)
  measurable: number; // 1-5
  advantage: string;
  limitation: string;
  financeExample: string;
}

const TOOLS: Tool[] = [
  {
    name: "廣告",
    nameEn: "Advertising",
    color: BRAND.danger,
    reach: 5,
    trust: 1,
    cost: 4,
    measurable: 3,
    advantage: "規模大、可精準投放、品牌曝光快",
    limitation: "成本高、信任度低、金融廣告法規嚴格",
    financeExample: "Google Ads、Facebook 廣告、電視廣告",
  },
  {
    name: "促銷",
    nameEn: "Sales Promotion",
    color: "#E67E22",
    reach: 4,
    trust: 1,
    cost: 3,
    measurable: 4,
    advantage: "促進短期行動、可衡量效果",
    limitation: "無法建立長期品牌、可能吸引低品質客戶",
    financeExample: "開戶紅包、推薦獎金、限時手續費減免",
  },
  {
    name: "公關",
    nameEn: "Public Relations",
    color: BRAND.story,
    reach: 4,
    trust: 4,
    cost: 1,
    measurable: 1,
    advantage: "公信力高（第三方背書）、成本相對低",
    limitation: "不可控（記者決定角度）、效果難以預測",
    financeExample: "財經媒體專訪、研究報告發布、CSR 活動",
  },
  {
    name: "直效行銷",
    nameEn: "Direct Marketing",
    color: BRAND.accent,
    reach: 2,
    trust: 3,
    cost: 1,
    measurable: 5,
    advantage: "高度個人化、可追蹤、ROI 可衡量",
    limitation: "過度使用會讓人反感、個資法規限制",
    financeExample: "Email 行銷、App 推播、簡訊",
  },
  {
    name: "數位社群",
    nameEn: "Digital & Social",
    color: "#3498DB",
    reach: 4,
    trust: 3,
    cost: 2,
    measurable: 5,
    advantage: "互動性高、成本效益好、病毒擴散潛力",
    limitation: "演算法變動、負面評論風險、法規限制",
    financeExample: "SEO / KOL 合作 / 影片行銷 / Podcast",
  },
  {
    name: "人員銷售",
    nameEn: "Personal Selling",
    color: BRAND.primary,
    reach: 1,
    trust: 5,
    cost: 5,
    measurable: 3,
    advantage: "信任度最高、適合複雜商品、客製化溝通",
    limitation: "規模有限、人力成本高、品質不易標準化",
    financeExample: "理財顧問、保險業務員、銀行理專",
  },
];

const DIMS = ["觸及範圍", "信任度", "成本", "可衡量性"] as const;
type DimKey = "reach" | "trust" | "cost" | "measurable";
const DIM_KEYS: DimKey[] = ["reach", "trust", "cost", "measurable"];

const LEVEL_LABELS: Record<DimKey, string[]> = {
  reach: ["極窄", "窄", "中", "廣", "極廣"],
  trust: ["低", "中低", "中", "高", "極高"],
  cost: ["低", "中低", "中", "高", "極高"],
  measurable: ["低", "中低", "中", "高", "極高"],
};

export default function IMCSixToolsRadar() {
  const [activeTool, setActiveTool] = useState<number | null>(null);
  const tool = activeTool !== null ? TOOLS[activeTool] : null;

  return (
    <div className="p-4 space-y-4 max-w-xl mx-auto">
      <h3
        className="text-lg font-bold text-center"
        style={{ color: BRAND.primary }}
      >
        六大傳播工具特性比較
      </h3>
      <p className="text-xs text-center" style={{ color: BRAND.neutral }}>
        點擊工具查看詳細特性
      </p>

      {/* Tool selector */}
      <div className="flex flex-wrap justify-center gap-1.5">
        {TOOLS.map((t, i) => (
          <motion.button
            key={t.name}
            onClick={() => setActiveTool(activeTool === i ? null : i)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{
              backgroundColor: activeTool === i ? t.color : "#f3f4f6",
              color: activeTool === i ? "#fff" : BRAND.neutral,
              border: `1.5px solid ${activeTool === i ? t.color : "#e5e7eb"}`,
            }}
          >
            {t.name}
          </motion.button>
        ))}
      </div>

      {/* Comparison bars */}
      <div className="space-y-3">
        {DIMS.map((dim, di) => (
          <div key={dim}>
            <div
              className="text-xs font-medium mb-1"
              style={{ color: BRAND.primary }}
            >
              {dim}
            </div>
            <div className="space-y-1">
              {TOOLS.map((t, ti) => {
                const val = t[DIM_KEYS[di]];
                const isActive = activeTool === ti;
                const dimmed = activeTool !== null && !isActive;
                return (
                  <div key={t.name} className="flex items-center gap-2">
                    <div
                      className="w-14 text-[10px] text-right truncate"
                      style={{
                        color: dimmed ? "#d1d5db" : BRAND.neutral,
                      }}
                    >
                      {t.name}
                    </div>
                    <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={false}
                        animate={{
                          width: `${val * 20}%`,
                          opacity: dimmed ? 0.2 : 1,
                        }}
                        transition={{ duration: 0.4 }}
                        className="h-full rounded-full flex items-center justify-end pr-1"
                        style={{ backgroundColor: t.color }}
                      >
                        <span className="text-[9px] text-white font-medium">
                          {LEVEL_LABELS[DIM_KEYS[di]][val - 1]}
                        </span>
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Detail panel */}
      <AnimatePresence mode="wait">
        {tool && (
          <motion.div
            key={activeTool}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="rounded-lg p-3 space-y-2"
            style={{
              backgroundColor: `${tool.color}08`,
              border: `1px solid ${tool.color}25`,
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="px-2 py-0.5 rounded text-xs font-bold text-white"
                style={{ backgroundColor: tool.color }}
              >
                {tool.name}
              </div>
              <span className="text-xs" style={{ color: BRAND.neutral }}>
                {tool.nameEn}
              </span>
            </div>
            <div className="text-xs space-y-1">
              <div>
                <span className="font-medium" style={{ color: BRAND.story }}>
                  優勢：
                </span>
                {tool.advantage}
              </div>
              <div>
                <span className="font-medium" style={{ color: BRAND.danger }}>
                  限制：
                </span>
                {tool.limitation}
              </div>
              <div>
                <span className="font-medium" style={{ color: BRAND.primary }}>
                  金融業常見形式：
                </span>
                {tool.financeExample}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Key insight */}
      <div
        className="text-center text-xs p-2 rounded-lg"
        style={{ backgroundColor: `${BRAND.story}08`, color: BRAND.story }}
      >
        <span className="font-medium">金融業洞察：</span>高複雜度 +
        高信任需求 →「公關 + 內容行銷 + 人員銷售」通常比單純廣告投放更有效
      </div>
    </div>
  );
}

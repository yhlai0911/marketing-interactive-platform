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

type ModeKey = "4p" | "7p";

interface IHIPTag {
  code: string;
  label: string;
}

interface PItem {
  letter: string;
  name: string;
  nameEn: string;
  color: string;
  summary: string;
  detail: string;
  ihip: IHIPTag[];
  group: "4p" | "3p";
}

const IHIP_LABELS: Record<string, { label: string; color: string }> = {
  I: { label: "無形性", color: BRAND.accent },
  H: { label: "異質性", color: BRAND.story },
  In: { label: "不可分割性", color: BRAND.primary },
  P: { label: "易逝性", color: BRAND.danger },
};

const P_ITEMS: PItem[] = [
  {
    letter: "1",
    name: "Product 產品",
    nameEn: "Product",
    color: BRAND.primary,
    summary: "退休規劃 AI 試算器",
    detail: "富誠的核心產品是「安退」退休規劃平台——AI 根據年齡、收入、目標退休年齡，自動推算每月需要投入的金額和最佳資產配置。不只是「賣基金」，而是賣「退休安心」。",
    ihip: [{ code: "I", label: "金融商品本質無形" }],
    group: "4p",
  },
  {
    letter: "2",
    name: "Price 價格",
    nameEn: "Price",
    color: "#2563EB",
    summary: "管理費 0.3% + 目標達成獎勵金",
    detail: "採用低管理費（0.3%）+ 達成目標後退還部分費用的獎勵機制。相比萬泰的「零手續費但管理費 0.6%」，富誠的費率結構更透明，且將客戶目標與自身利益綁定。",
    ihip: [{ code: "I", label: "服務價值難以在購買前評估" }],
    group: "4p",
  },
  {
    letter: "3",
    name: "Place 通路",
    nameEn: "Place",
    color: "#7C3AED",
    summary: "App + 線下講座（OMO）",
    detail: "線上以 App 為主要通路，線下舉辦「安退學堂」講座。OMO（Online-Merge-Offline）策略讓客戶在線上完成投資操作，線下獲得面對面信任建立。",
    ihip: [{ code: "In", label: "服務需要客戶參與，線上線下整合" }],
    group: "4p",
  },
  {
    letter: "4",
    name: "Promotion 推廣",
    nameEn: "Promotion",
    color: "#DB2777",
    summary: "「安退」品牌故事行銷",
    detail: "以「退休不焦慮」為核心訊息，透過真實用戶故事、退休焦慮測驗、白話文理財專欄做內容行銷。不用傳統金融的「報酬率比較」硬推銷。",
    ihip: [{ code: "I", label: "透過故事將無形服務具象化" }],
    group: "4p",
  },
  {
    letter: "5",
    name: "People 人員",
    nameEn: "People",
    color: BRAND.story,
    summary: "CFP 持照顧問 + AI 輔助",
    detail: "每位客戶配一位 CFP（認證理財規劃師）+ AI 助手。CFP 負責年度健檢和重大決策諮詢，AI 處理日常再平衡和提醒。解決金融服務「人的品質不穩定」問題。",
    ihip: [
      { code: "H", label: "用標準化流程降低服務異質性" },
      { code: "In", label: "顧問與客戶互動不可分割" },
    ],
    group: "3p",
  },
  {
    letter: "6",
    name: "Process 流程",
    nameEn: "Process",
    color: "#059669",
    summary: "3 步驟開通流程",
    detail: "風險評估（3 分鐘問卷）→ 目標設定（退休年齡、目標金額）→ 自動投資（AI 配置開始運作）。全程線上、3 分鐘完成。流程標準化確保每位客戶的體驗一致。",
    ihip: [
      { code: "H", label: "標準化流程降低人為差異" },
      { code: "P", label: "流程設計確保服務可隨時啟動" },
    ],
    group: "3p",
  },
  {
    letter: "7",
    name: "Physical Evidence 有形展示",
    nameEn: "Physical Evidence",
    color: "#0891B2",
    summary: "安退承諾書、健檢報告、儀表板",
    detail: "「安退承諾書」——白紙黑字承諾不推銷；「年度健檢報告」——CFP 署名的財務體檢書；「視覺化儀表板」——即時呈現退休進度。三項有形展示讓無形的金融服務「看得見、摸得到」。",
    ihip: [{ code: "I", label: "用有形物件讓無形服務可見" }],
    group: "3p",
  },
];

export default function SevenPDashboard() {
  const [mode, setMode] = useState<ModeKey>("7p");
  const [expandedP, setExpandedP] = useState<number | null>(null);

  const fourPItems = P_ITEMS.filter((p) => p.group === "4p");
  const threePItems = P_ITEMS.filter((p) => p.group === "3p");
  const showThreeP = mode === "7p";

  const modes: { key: ModeKey; label: string }[] = [
    { key: "4p", label: "一般商品 4P" },
    { key: "7p", label: "金融服務 7P" },
  ];

  const toggleExpand = (idx: number) => {
    setExpandedP(expandedP === idx ? null : idx);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Mode Toggle */}
      <div className="flex items-center gap-3 mb-6">
        {modes.map((m) => (
          <button
            key={m.key}
            onClick={() => { setMode(m.key); setExpandedP(null); }}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: mode === m.key ? BRAND.primary : "#f3f4f6",
              color: mode === m.key ? "#fff" : BRAND.neutral,
            }}
          >
            {m.label}
          </button>
        ))}
        {mode === "7p" && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xs font-medium px-2 py-1 rounded-full"
            style={{ backgroundColor: `${BRAND.story}15`, color: BRAND.story }}
          >
            +3P 服務行銷
          </motion.span>
        )}
      </div>

      {/* IHIP Legend */}
      {mode === "7p" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-5"
        >
          <p className="text-xs font-semibold mb-2" style={{ color: BRAND.neutral }}>
            IHIP 四大挑戰標記：
          </p>
          <div className="flex flex-wrap gap-3">
            {Object.entries(IHIP_LABELS).map(([code, info]) => (
              <div key={code} className="flex items-center gap-1.5">
                <span
                  className="inline-flex items-center justify-center w-5 h-5 rounded text-xs font-bold"
                  style={{ backgroundColor: `${info.color}20`, color: info.color, fontSize: "0.6rem" }}
                >
                  {code}
                </span>
                <span className="text-xs" style={{ color: BRAND.neutral }}>{info.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 4P Section */}
      <div className="mb-2">
        <h4 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: BRAND.primary }}>
          <span
            className="inline-block w-3 h-3 rounded-sm"
            style={{ backgroundColor: BRAND.primary }}
          />
          傳統行銷 4P
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {fourPItems.map((item, i) => (
            <PCard
              key={item.letter}
              item={item}
              index={i}
              isExpanded={expandedP === i}
              onToggle={() => toggleExpand(i)}
              showIHIP={mode === "7p"}
            />
          ))}
        </div>
      </div>

      {/* 3P Section */}
      <AnimatePresence>
        {showThreeP && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6"
          >
            {/* Divider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px" style={{ backgroundColor: `${BRAND.story}40` }} />
              <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: `${BRAND.story}15`, color: BRAND.story }}>
                金融服務特有 +3P
              </span>
              <div className="flex-1 h-px" style={{ backgroundColor: `${BRAND.story}40` }} />
            </div>

            <h4 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: BRAND.story }}>
              <span
                className="inline-block w-3 h-3 rounded-sm"
                style={{ backgroundColor: BRAND.story }}
              />
              服務行銷 3P
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {threePItems.map((item, i) => {
                const globalIdx = i + fourPItems.length;
                return (
                  <PCard
                    key={item.letter}
                    item={item}
                    index={i}
                    isExpanded={expandedP === globalIdx}
                    onToggle={() => toggleExpand(globalIdx)}
                    showIHIP={true}
                  />
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Insight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 rounded-lg p-4"
        style={{ backgroundColor: `${BRAND.accent}08`, border: `1px solid ${BRAND.accent}` }}
      >
        <p className="text-sm font-bold" style={{ color: BRAND.accent }}>
          為什麼金融服務需要 7P 而非 4P？
        </p>
        <p className="text-xs mt-1" style={{ color: "#374151" }}>
          金融商品具有 IHIP 四大特性——無形性（Intangibility）、異質性（Heterogeneity）、不可分割性（Inseparability）、易逝性（Perishability）。傳統 4P 無法完整回應這些挑戰，需要額外的 People、Process、Physical Evidence 三個 P 來補足。
        </p>
      </motion.div>
    </div>
  );
}

function PCard({
  item,
  index,
  isExpanded,
  onToggle,
  showIHIP,
}: {
  item: PItem;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  showIHIP: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="rounded-xl cursor-pointer transition-all"
      style={{
        border: `1.5px solid ${item.color}40`,
        backgroundColor: isExpanded ? `${item.color}06` : "#fff",
      }}
      onClick={onToggle}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold"
              style={{ backgroundColor: item.color, color: "#fff" }}
            >
              P{item.letter}
            </span>
            <div>
              <p className="text-sm font-bold" style={{ color: item.color }}>{item.name}</p>
            </div>
          </div>
          <motion.span
            animate={{ rotate: isExpanded ? 180 : 0 }}
            className="text-xs mt-1"
            style={{ color: item.color }}
          >
            &#9660;
          </motion.span>
        </div>

        {/* Summary */}
        <p className="text-xs mb-2" style={{ color: "#374151" }}>{item.summary}</p>

        {/* IHIP Tags */}
        {showIHIP && item.ihip.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {item.ihip.map((tag, j) => {
              const ihipInfo = IHIP_LABELS[tag.code];
              return (
                <span
                  key={j}
                  className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${ihipInfo.color}12`, color: ihipInfo.color }}
                  title={tag.label}
                >
                  <span className="font-bold" style={{ fontSize: "0.6rem" }}>{tag.code}</span>
                  {tag.label}
                </span>
              );
            })}
          </div>
        )}

        {/* Expanded Detail */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div
                className="mt-3 pt-3"
                style={{ borderTop: `1px solid ${item.color}20` }}
              >
                <p className="text-xs leading-relaxed" style={{ color: "#374151" }}>
                  {item.detail}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

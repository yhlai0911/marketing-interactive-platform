"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND } from "@/components/brand/BrandColors";

interface Instrument {
  key: string;
  name: string;
  nameEn: string;
  icon: string;
  color: string;
  cost: string;
  term: string;
  riskBearer: string;
  bestFor: string;
  mechanism: string;
  detail: string;
  zhentuUse: string;
}

const INSTRUMENTS: Instrument[] = [
  {
    key: "lc",
    name: "信用狀",
    nameEn: "Letter of Credit",
    icon: "L/C",
    color: BRAND.primary,
    cost: "0.5%\u20132%",
    term: "30\u201390 天",
    riskBearer: "開狀銀行",
    bestFor: "新客戶、高風險市場",
    mechanism: "銀行擔保付款，賣方提交符合條件的單據後即可獲得付款",
    detail:
      "開狀銀行承諾在賣方提交符合信用狀條款的單據後付款。買賣雙方風險都大幅降低，但手續費較高且單據要求嚴格。遵循 UCP 600 國際慣例。",
    zhentuUse:
      "適用於珍途首次進入新市場（如越南、菲律賓）時，與不熟悉的經銷商交易",
  },
  {
    key: "ba",
    name: "銀行承兌匯票",
    nameEn: "Banker's Acceptance",
    icon: "B/A",
    color: BRAND.accent,
    cost: "0.3%\u20131%",
    term: "30\u2013180 天",
    riskBearer: "承兌銀行",
    bestFor: "短期融資、可在貨幣市場交易",
    mechanism: "銀行在匯票上簽章承兌，使匯票成為可在貨幣市場流通的信用工具",
    detail:
      "銀行承兌後，匯票成為銀行的無條件付款承諾。持票人可選擇持有到期或在貨幣市場折價出售以提前取得資金。利率通常低於一般商業貸款。",
    zhentuUse:
      "適用於珍途與日本、泰國等已建立信任關係的供應商之間的短期貿易融資",
  },
  {
    key: "forfait",
    name: "福費廷",
    nameEn: "Forfaiting",
    icon: "F",
    color: BRAND.story,
    cost: "1%\u20135%",
    term: "1\u20137 年",
    riskBearer: "福費廷商（無追索權）",
    bestFor: "大額中長期交易、資本設備出口",
    mechanism: "出口商將遠期應收帳款「無追索權」賣斷給福費廷商，完全轉移信用風險",
    detail:
      "福費廷商買入由進口商銀行保證的遠期票據（通常含 aval），承擔所有信用與國家風險。出口商獲得即時現金且不需擔心壞帳。適合 100 萬美元以上的大額交易。",
    zhentuUse:
      "適用於珍途出口大型設備（如全自動珍珠奶茶生產線）給海外加盟商的中長期融資",
  },
  {
    key: "factor",
    name: "應收帳款承購",
    nameEn: "Factoring",
    icon: "FA",
    color: BRAND.danger,
    cost: "1%\u20133%",
    term: "30\u201390 天",
    riskBearer: "承購商（視有無追索權）",
    bestFor: "持續性小額交易、改善現金流",
    mechanism: "出口商將應收帳款批量出售給承購商，預先取得 80\u201390% 的款項",
    detail:
      "承購商提供帳款管理、催收、信用保護等一站式服務。分為有追索權（出口商仍承擔壞帳風險）和無追索權（承購商承擔）兩種。適合頻繁、小額的經常性出口。",
    zhentuUse:
      "適用於珍途對東南亞多國小型經銷商的持續性原料與成品出貨",
  },
];

export default function TradeFinanceComparison() {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto"
    >
      <h4
        className="text-center font-bold text-lg mb-1"
        style={{ color: BRAND.primary }}
      >
        貿易融資工具比較
      </h4>
      <p className="text-center text-xs text-gray-500 mb-5">
        珍途跨境交易的四種融資選擇 — 點擊卡片查看詳情
      </p>

      {/* Comparison Table Header (mobile-responsive) */}
      <div className="hidden sm:grid sm:grid-cols-[1fr_80px_80px_100px_120px] gap-2 mb-2 px-2">
        <div className="text-xs font-medium text-gray-400">工具</div>
        <div className="text-xs font-medium text-gray-400 text-center">費用</div>
        <div className="text-xs font-medium text-gray-400 text-center">期限</div>
        <div className="text-xs font-medium text-gray-400 text-center">風險承擔</div>
        <div className="text-xs font-medium text-gray-400 text-center">最適場景</div>
      </div>

      {/* Instrument Cards */}
      <div className="space-y-2 mb-5">
        {INSTRUMENTS.map((inst, i) => {
          const isSelected = selectedKey === inst.key;
          return (
            <motion.div
              key={inst.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
            >
              <button
                onClick={() =>
                  setSelectedKey(isSelected ? null : inst.key)
                }
                className="w-full text-left"
              >
                <div
                  className="p-3 rounded-xl border-2 transition-all"
                  style={{
                    borderColor: isSelected ? inst.color : `${inst.color}30`,
                    backgroundColor: isSelected ? `${inst.color}08` : "#fff",
                  }}
                >
                  {/* Mobile layout: stacked */}
                  <div className="sm:hidden">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: inst.color }}
                      >
                        {inst.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className="text-sm font-bold"
                          style={{ color: inst.color }}
                        >
                          {inst.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {inst.nameEn}
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: isSelected ? 180 : 0 }}
                        className="text-gray-400"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="6,9 12,15 18,9" />
                        </svg>
                      </motion.div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-gray-50 rounded p-1.5">
                        <span className="text-gray-400">費用：</span>
                        <span className="font-medium">{inst.cost}</span>
                      </div>
                      <div className="bg-gray-50 rounded p-1.5">
                        <span className="text-gray-400">期限：</span>
                        <span className="font-medium">{inst.term}</span>
                      </div>
                      <div className="bg-gray-50 rounded p-1.5">
                        <span className="text-gray-400">風險：</span>
                        <span className="font-medium">{inst.riskBearer}</span>
                      </div>
                      <div className="bg-gray-50 rounded p-1.5">
                        <span className="text-gray-400">適用：</span>
                        <span className="font-medium">{inst.bestFor}</span>
                      </div>
                    </div>
                  </div>

                  {/* Desktop layout: row */}
                  <div className="hidden sm:grid sm:grid-cols-[1fr_80px_80px_100px_120px] gap-2 items-center">
                    <div className="flex items-center gap-2">
                      <div
                        className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: inst.color }}
                      >
                        {inst.icon}
                      </div>
                      <div>
                        <div
                          className="text-sm font-bold"
                          style={{ color: inst.color }}
                        >
                          {inst.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {inst.nameEn}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-center font-medium">
                      {inst.cost}
                    </div>
                    <div className="text-xs text-center font-medium">
                      {inst.term}
                    </div>
                    <div className="text-xs text-center">{inst.riskBearer}</div>
                    <div className="text-xs text-center text-gray-600">
                      {inst.bestFor}
                    </div>
                  </div>
                </div>
              </button>

              {/* Expanded Detail */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="mx-2 mb-1 p-3 rounded-b-xl border border-t-0 space-y-2"
                      style={{
                        borderColor: `${inst.color}30`,
                        backgroundColor: `${inst.color}05`,
                      }}
                    >
                      {/* Mechanism */}
                      <div>
                        <div
                          className="text-xs font-bold mb-1"
                          style={{ color: inst.color }}
                        >
                          運作機制
                        </div>
                        <div className="text-xs text-gray-600 leading-relaxed">
                          {inst.mechanism}
                        </div>
                      </div>

                      {/* Detail */}
                      <div>
                        <div
                          className="text-xs font-bold mb-1"
                          style={{ color: inst.color }}
                        >
                          詳細說明
                        </div>
                        <div className="text-xs text-gray-600 leading-relaxed">
                          {inst.detail}
                        </div>
                      </div>

                      {/* ZhenTu Application */}
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${BRAND.accent}10` }}
                      >
                        <div
                          className="text-xs font-bold mb-1"
                          style={{ color: BRAND.accent }}
                        >
                          珍途應用情境
                        </div>
                        <div className="text-xs text-gray-600 leading-relaxed">
                          {inst.zhentuUse}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Cost-Risk Positioning */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-5"
      >
        <div className="text-xs text-gray-500 mb-2 text-center">
          費用 vs 風險保障程度
        </div>
        <div className="relative h-10 rounded-full overflow-hidden bg-gray-100 flex">
          {INSTRUMENTS.map((inst, i) => (
            <motion.div
              key={inst.key}
              initial={{ width: 0 }}
              animate={{ width: "25%" }}
              transition={{ delay: 0.7 + i * 0.1, duration: 0.4 }}
              className="h-full flex items-center justify-center border-r border-white"
              style={{ backgroundColor: `${inst.color}90` }}
            >
              <span className="text-xs font-medium text-white truncate px-1">
                {inst.name}
              </span>
            </motion.div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
          <span>低費用 / 低保障</span>
          <span>高費用 / 高保障</span>
        </div>
      </motion.div>

      {/* Key Insight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="text-center text-sm p-3 rounded-lg mb-3"
        style={{ backgroundColor: `${BRAND.primary}10`, color: "#374151" }}
      >
        <span className="font-bold" style={{ color: BRAND.primary }}>
          選擇原則：
        </span>{" "}
        沒有「最好」的貿易融資工具，只有「最適合」的。
        選擇取決於交易金額、期限、對手信用、市場熟悉度與成本承受力
      </motion.div>

      {/* ZhenTu Strategy */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="text-center text-sm p-3 rounded-lg"
        style={{ backgroundColor: `${BRAND.accent}15`, color: "#374151" }}
      >
        <span className="font-bold" style={{ color: BRAND.accent }}>
          珍途的融資組合策略：
        </span>{" "}
        新市場用信用狀降低風險，成熟市場用銀行承兌匯票降低成本，
        大型設備出口用福費廷轉移風險，日常小額出貨用應收帳款承購提升現金流
      </motion.div>
    </motion.div>
  );
}

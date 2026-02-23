"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND } from "@/components/brand/BrandColors";

/**
 * ADR 三層級 + Rule 144A 互動比較表
 * 含 ADR 定價計算器（理論價格 & 溢價/折價）
 */

interface ADRLevel {
  key: string;
  name: string;
  nameEn: string;
  color: string;
  venue: string;
  secReg: string;
  accounting: string;
  canRaise: string;
  compliance: string;
  bestFor: string;
  summary: string;
}

const LEVELS: ADRLevel[] = [
  {
    key: "level1",
    name: "Level I",
    nameEn: "一級存託憑證",
    color: BRAND.neutral,
    venue: "OTC 店頭市場",
    secReg: "僅需 F-6 表格（豁免報告）",
    accounting: "母國會計準則即可",
    canRaise: "不可募資",
    compliance: "低（約 US$200K/年）",
    bestFor: "初次試水溫、建立美國知名度",
    summary: "門檻最低，適合首次進入美國市場的企業。不需變更會計準則，但只能在 OTC 交易，流動性有限。",
  },
  {
    key: "level2",
    name: "Level II",
    nameEn: "二級存託憑證",
    color: BRAND.primary,
    venue: "NYSE / NASDAQ 主板上市",
    secReg: "須完整 SEC 註冊（20-F 年報）",
    accounting: "須採用 US GAAP 或 IFRS",
    canRaise: "不可募資（僅上市交易）",
    compliance: "中高（約 US$1M\u20132M/年）",
    bestFor: "追求流動性與品牌曝光",
    summary: "在美國主板掛牌交易，大幅提升流動性與國際能見度，但合規成本顯著增加且須轉換會計準則。",
  },
  {
    key: "level3",
    name: "Level III",
    nameEn: "三級存託憑證",
    color: BRAND.accent,
    venue: "NYSE / NASDAQ 主板上市",
    secReg: "最嚴格（F-1 招股書 + 20-F）",
    accounting: "須採用 US GAAP 或 IFRS",
    canRaise: "可公開募資（IPO/增發）",
    compliance: "最高（約 US$2M\u20135M/年）",
    bestFor: "需要在美國募集資金的企業",
    summary: "唯一可以在美國公開募資的 ADR 層級。合規要求最嚴格，但能直接向美國投資人募集大量資金。",
  },
  {
    key: "rule144a",
    name: "Rule 144A",
    nameEn: "私募 ADR",
    color: BRAND.story,
    venue: "PORTAL / QIB 私募市場",
    secReg: "豁免 SEC 註冊",
    accounting: "母國會計準則即可",
    canRaise: "可向合格機構投資人募資",
    compliance: "低（約 US$200K\u2013500K/年）",
    bestFor: "快速募資、不想公開揭露的企業",
    summary: "繞過 SEC 公開註冊要求，僅向合格機構投資人（QIB）發行。速度快、成本低，但流動性受限於機構市場。",
  },
];

const DIMENSIONS: { label: string; key: keyof ADRLevel }[] = [
  { label: "交易場所", key: "venue" },
  { label: "SEC 註冊要求", key: "secReg" },
  { label: "會計準則", key: "accounting" },
  { label: "能否募資", key: "canRaise" },
  { label: "年合規成本", key: "compliance" },
  { label: "適合企業", key: "bestFor" },
];

export default function ADRLevelComparison() {
  const [activeKey, setActiveKey] = useState("level1");
  // ADR 定價計算器
  const [stockPrice, setStockPrice] = useState(120);
  const [ratio, setRatio] = useState(5);
  const [fxRate, setFxRate] = useState(31.5);
  const [marketPrice, setMarketPrice] = useState("");

  const active = LEVELS.find((l) => l.key === activeKey)!;
  const adrTheory = (stockPrice * ratio) / fxRate;
  const mktPx = parseFloat(marketPrice);
  const premDisc = !isNaN(mktPx) && adrTheory > 0
    ? ((mktPx - adrTheory) / adrTheory) * 100
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto"
    >
      <h4 className="text-center font-bold text-lg mb-1" style={{ color: BRAND.primary }}>
        ADR 層級比較
      </h4>
      <p className="text-center text-xs text-gray-500 mb-4">
        美國存託憑證的四種類型 — 點擊切換查看各層級詳情
      </p>

      {/* Tab Buttons */}
      <div className="flex gap-2 mb-4 justify-center flex-wrap">
        {LEVELS.map((level) => {
          const isActive = activeKey === level.key;
          return (
            <button
              key={level.key}
              onClick={() => setActiveKey(level.key)}
              className="px-4 py-2 rounded-lg text-sm font-bold transition-all border-2"
              style={{
                borderColor: isActive ? level.color : `${level.color}40`,
                backgroundColor: isActive ? level.color : "#fff",
                color: isActive ? "#fff" : level.color,
              }}
            >
              {level.name}
            </button>
          );
        })}
      </div>

      {/* Detail Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeKey}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="rounded-xl border-2 p-4 mb-4"
          style={{ borderColor: active.color, backgroundColor: `${active.color}08` }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: active.color }}
            >
              {active.key === "rule144a" ? "144A" : active.name.split(" ")[1]}
            </div>
            <div>
              <div className="font-bold" style={{ color: active.color }}>{active.name}</div>
              <div className="text-xs text-gray-500">{active.nameEn}</div>
            </div>
          </div>

          {/* Comparison Rows */}
          <div className="space-y-2">
            {DIMENSIONS.map((dim) => (
              <div key={dim.label} className="flex gap-3 text-sm">
                <div className="w-28 flex-shrink-0 font-medium text-gray-500">{dim.label}</div>
                <div className="flex-1" style={{ color: "#374151" }}>{active[dim.key]}</div>
              </div>
            ))}
          </div>

          <div className="mt-3 text-xs leading-relaxed text-gray-600 bg-white rounded-lg p-2">
            {active.summary}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Side-by-side quick comparison */}
      <div className="overflow-x-auto mb-5">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr>
              <th className="text-left p-2 text-gray-500 font-medium">比較維度</th>
              {LEVELS.map((l) => (
                <th
                  key={l.key}
                  className="p-2 text-center font-bold cursor-pointer transition-all"
                  style={{
                    color: l.key === activeKey ? "#fff" : l.color,
                    backgroundColor: l.key === activeKey ? l.color : `${l.color}10`,
                  }}
                  onClick={() => setActiveKey(l.key)}
                >
                  {l.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DIMENSIONS.map((dim, i) => (
              <tr key={dim.label} className={i % 2 === 0 ? "bg-gray-50" : ""}>
                <td className="p-2 font-medium text-gray-600">{dim.label}</td>
                {LEVELS.map((l) => (
                  <td
                    key={`${l.key}-${dim.label}`}
                    className="p-2 text-center transition-all"
                    style={{
                      backgroundColor: l.key === activeKey ? `${l.color}12` : "transparent",
                      fontWeight: l.key === activeKey ? 600 : 400,
                    }}
                  >
                    {l[dim.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADR 定價計算器 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="rounded-xl border p-4 mb-4"
        style={{ borderColor: `${BRAND.accent}50` }}
      >
        <h5 className="font-bold text-sm mb-3" style={{ color: BRAND.accent }}>
          ADR 理論定價計算器
        </h5>
        <p className="text-xs text-gray-500 mb-3">
          ADR 理論價格 = 原股價格 x 轉換比率 / 匯率
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">原股價格 (TWD)</label>
            <input
              type="number"
              value={stockPrice}
              onChange={(e) => setStockPrice(parseFloat(e.target.value) || 0)}
              className="w-full border rounded px-2 py-1.5 text-sm font-mono"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">轉換比率 (ADR:股)</label>
            <input
              type="number"
              value={ratio}
              onChange={(e) => setRatio(parseFloat(e.target.value) || 1)}
              className="w-full border rounded px-2 py-1.5 text-sm font-mono"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">匯率 S (TWD/USD)</label>
            <input
              type="number"
              step="0.1"
              value={fxRate}
              onChange={(e) => setFxRate(parseFloat(e.target.value) || 1)}
              className="w-full border rounded px-2 py-1.5 text-sm font-mono"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">市場價格 (USD, 選填)</label>
            <input
              type="number"
              step="0.01"
              value={marketPrice}
              onChange={(e) => setMarketPrice(e.target.value)}
              placeholder="—"
              className="w-full border rounded px-2 py-1.5 text-sm font-mono"
            />
          </div>
        </div>

        {/* Result */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="bg-gray-50 rounded-lg px-4 py-2">
            <div className="text-xs text-gray-500">ADR 理論價格</div>
            <div className="text-lg font-bold font-mono" style={{ color: BRAND.primary }}>
              US$ {adrTheory.toFixed(2)}
            </div>
          </div>
          {premDisc !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-50 rounded-lg px-4 py-2"
            >
              <div className="text-xs text-gray-500">溢價 / 折價</div>
              <div
                className="text-lg font-bold font-mono"
                style={{ color: premDisc >= 0 ? BRAND.story : BRAND.danger }}
              >
                {premDisc >= 0 ? "+" : ""}{premDisc.toFixed(2)}%
              </div>
              <div className="text-xs text-gray-400">
                {premDisc > 0 ? "溢價（ADR 貴於理論值）" : premDisc < 0 ? "折價（ADR 便宜於理論值）" : "無偏差"}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Key Insight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-sm p-3 rounded-lg"
        style={{ backgroundColor: `${BRAND.primary}10`, color: "#374151" }}
      >
        <span className="font-bold" style={{ color: BRAND.primary }}>珍途策略：</span>{" "}
        先以 Level I ADR 在美國 OTC 市場建立知名度，再視融資需求逐步升級至 Level II 或 Level III
      </motion.div>
    </motion.div>
  );
}

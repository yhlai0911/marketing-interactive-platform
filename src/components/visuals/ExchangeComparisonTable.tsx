"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND } from "@/components/brand/BrandColors";

/**
 * 珍途上市策略：四大交易所互動比較
 * 含 SVG 雷達圖 + 點擊展開詳情 + 底部策略建議
 */

interface Exchange {
  key: string;
  name: string;
  nameEn: string;
  color: string;
  threshold: number;     // 上市門檻 (1-10, 10=最高)
  investorBase: number;  // 投資人基礎
  fbPE: number;          // 餐飲業估值
  langBarrier: number;   // 語言障礙 (10=最高障礙)
  compliance: number;    // 年合規成本
  zhentuFit: number;     // 珍途優勢
  thresholdText: string;
  investorText: string;
  peRange: string;
  langText: string;
  complianceText: string;
  fitText: string;
  detail: string;
}

const EXCHANGES: Exchange[] = [
  {
    key: "twse",
    name: "台灣證交所",
    nameEn: "TWSE",
    color: BRAND.primary,
    threshold: 4, investorBase: 4, fbPE: 5, langBarrier: 1, compliance: 3, zhentuFit: 9,
    thresholdText: "中等（獲利門檻 + 實收資本）",
    investorText: "以散戶為主，外資占比約 40%",
    peRange: "15\u201325x",
    langText: "無（母語市場）",
    complianceText: "約 NT$5\u201310M/年",
    fitText: "品牌知名度高、投資人熟悉珍奶文化",
    detail: "珍途的主場。台灣投資人最懂珍珠奶茶，品牌故事容易引起共鳴。散戶參與度高，有助於 IPO 認購。但市場規模有限，國際資金配置比重偏低。",
  },
  {
    key: "hkex",
    name: "香港交易所",
    nameEn: "HKEX",
    color: "#E74C3C",
    threshold: 6, investorBase: 7, fbPE: 6, langBarrier: 3, compliance: 5, zhentuFit: 7,
    thresholdText: "較高（三年獲利 + 市值門檻）",
    investorText: "亞洲最大國際交易所，中港外資匯聚",
    peRange: "18\u201330x",
    langText: "低（中文為官方語言之一）",
    complianceText: "約 HK$5\u201315M/年",
    fitText: "亞洲品牌溢價、接近大中華消費市場",
    detail: "連接中國資金與國際資本的橋梁。茶飲品牌在港股有良好先例（如奈雪的茶）。雙幣交易機制提供便利性，但市場情緒波動較大。",
  },
  {
    key: "nyse",
    name: "紐約證交所",
    nameEn: "NYSE",
    color: BRAND.accent,
    threshold: 8, investorBase: 10, fbPE: 8, langBarrier: 8, compliance: 9, zhentuFit: 5,
    thresholdText: "高（嚴格 SEC 審查、SOX 合規）",
    investorText: "全球最大、流動性最強",
    peRange: "25\u201340x",
    langText: "高（全英文揭露、美國法律體系）",
    complianceText: "約 US$2\u20135M/年",
    fitText: "全球品牌光環、最高估值，但合規成本巨大",
    detail: "全球資本市場的皇冠。最高的估值倍數與流動性，但 SEC 合規要求極為嚴格。需要強大的 IR 團隊與法務支援。適合已具備國際規模的企業。",
  },
  {
    key: "tse",
    name: "東京證交所",
    nameEn: "TSE",
    color: BRAND.story,
    threshold: 5, investorBase: 6, fbPE: 7, langBarrier: 9, compliance: 6, zhentuFit: 6,
    thresholdText: "中高（Prime Market 標準較嚴）",
    investorText: "亞洲第二大，機構投資人占比高",
    peRange: "20\u201335x",
    langText: "很高（日文揭露、獨特商業文化）",
    complianceText: "約 JPY 50\u2013150M/年",
    fitText: "日本珍奶熱潮加分，但語言與文化門檻高",
    detail: "日本是全球第二大珍珠奶茶消費市場，品牌有天然優勢。但日文揭露要求與獨特的企業治理文化（如交叉持股）對外國企業構成挑戰。",
  },
];

const DIMS = [
  { label: "上市門檻", key: "threshold" as const },
  { label: "投資人基礎", key: "investorBase" as const },
  { label: "餐飲業估值", key: "fbPE" as const },
  { label: "語言障礙", key: "langBarrier" as const },
  { label: "合規成本", key: "compliance" as const },
  { label: "珍途優勢", key: "zhentuFit" as const },
];

const TEXT_KEYS: { label: string; key: keyof Exchange }[] = [
  { label: "上市門檻", key: "thresholdText" },
  { label: "投資人基礎", key: "investorText" },
  { label: "餐飲業 P/E", key: "peRange" },
  { label: "語言障礙", key: "langText" },
  { label: "年合規成本", key: "complianceText" },
  { label: "珍途優勢", key: "fitText" },
];

// SVG radar chart helpers
const CX = 130, CY = 130, R = 100;
function polarToXY(angle: number, value: number): [number, number] {
  const rad = (angle - 90) * (Math.PI / 180);
  const r = (value / 10) * R;
  return [CX + r * Math.cos(rad), CY + r * Math.sin(rad)];
}
function makePolygon(values: number[]): string {
  const step = 360 / values.length;
  return values.map((v, i) => polarToXY(i * step, v).join(",")).join(" ");
}

export default function ExchangeComparisonTable() {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const selected = EXCHANGES.find((e) => e.key === selectedKey);

  const step = 360 / DIMS.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto"
    >
      <h4 className="text-center font-bold text-lg mb-1" style={{ color: BRAND.primary }}>
        珍途上市策略：交易所比較
      </h4>
      <p className="text-center text-xs text-gray-500 mb-4">
        四大交易所多維度評估 — 點擊交易所查看詳情
      </p>

      {/* Exchange selector pills */}
      <div className="flex gap-2 mb-4 justify-center flex-wrap">
        {EXCHANGES.map((ex) => {
          const isActive = selectedKey === ex.key;
          return (
            <button
              key={ex.key}
              onClick={() => setSelectedKey(isActive ? null : ex.key)}
              className="px-3 py-1.5 rounded-full text-sm font-bold transition-all border-2"
              style={{
                borderColor: isActive ? ex.color : `${ex.color}40`,
                backgroundColor: isActive ? ex.color : "#fff",
                color: isActive ? "#fff" : ex.color,
              }}
            >
              {ex.nameEn} {ex.name}
            </button>
          );
        })}
      </div>

      {/* Radar Chart */}
      <div className="flex justify-center mb-4">
        <svg viewBox="0 0 260 260" className="w-full max-w-[280px]">
          {/* Grid circles */}
          {[2, 4, 6, 8, 10].map((v) => (
            <circle key={v} cx={CX} cy={CY} r={(v / 10) * R}
              fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
          ))}
          {/* Axis lines & labels */}
          {DIMS.map((dim, i) => {
            const [x, y] = polarToXY(i * step, 10);
            const [lx, ly] = polarToXY(i * step, 12);
            return (
              <g key={dim.label}>
                <line x1={CX} y1={CY} x2={x} y2={y} stroke="#d1d5db" strokeWidth="0.5" />
                <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
                  className="text-[8px] fill-gray-500">{dim.label}</text>
              </g>
            );
          })}
          {/* Exchange polygons */}
          {EXCHANGES.map((ex) => {
            const values = DIMS.map((d) => ex[d.key] as number);
            const isHighlighted = selectedKey === null || selectedKey === ex.key;
            return (
              <polygon
                key={ex.key}
                points={makePolygon(values)}
                fill={`${ex.color}${isHighlighted ? "25" : "08"}`}
                stroke={ex.color}
                strokeWidth={selectedKey === ex.key ? 2 : 1}
                opacity={isHighlighted ? 1 : 0.3}
                className="transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedKey(selectedKey === ex.key ? null : ex.key)}
              />
            );
          })}
          {/* Dots on selected */}
          {selected && DIMS.map((d, i) => {
            const val = selected[d.key] as number;
            const [x, y] = polarToXY(i * step, val);
            return (
              <circle key={d.label} cx={x} cy={y} r={3}
                fill={selected.color} stroke="#fff" strokeWidth="1" />
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex gap-3 justify-center flex-wrap mb-4">
        {EXCHANGES.map((ex) => (
          <div key={ex.key} className="flex items-center gap-1 text-xs">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: ex.color }} />
            <span style={{ color: ex.color, fontWeight: selectedKey === ex.key ? 700 : 400 }}>
              {ex.nameEn}
            </span>
          </div>
        ))}
      </div>

      {/* Bar comparison (simple CSS bars) */}
      <div className="space-y-3 mb-5">
        {DIMS.map((dim) => (
          <div key={dim.label}>
            <div className="text-xs font-medium text-gray-500 mb-1">{dim.label}</div>
            <div className="flex gap-1">
              {EXCHANGES.map((ex) => {
                const val = ex[dim.key] as number;
                const isHighlighted = selectedKey === null || selectedKey === ex.key;
                return (
                  <div key={ex.key} className="flex-1">
                    <div className="relative h-5 bg-gray-100 rounded overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${val * 10}%` }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="absolute left-0 top-0 h-full rounded transition-opacity"
                        style={{
                          backgroundColor: ex.color,
                          opacity: isHighlighted ? 0.8 : 0.2,
                        }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold"
                        style={{ color: val > 5 && isHighlighted ? "#fff" : "#666" }}>
                        {ex.nameEn}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Selected exchange detail */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="rounded-xl border-2 p-4"
              style={{ borderColor: selected.color, backgroundColor: `${selected.color}08` }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: selected.color }}>
                  {selected.nameEn.slice(0, 2)}
                </div>
                <div>
                  <div className="font-bold" style={{ color: selected.color }}>
                    {selected.name}（{selected.nameEn}）
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-3">
                {TEXT_KEYS.map((tk) => (
                  <div key={tk.label} className="flex gap-3 text-sm">
                    <div className="w-24 flex-shrink-0 font-medium text-gray-500">{tk.label}</div>
                    <div className="flex-1 text-gray-700">{String(selected[tk.key])}</div>
                  </div>
                ))}
              </div>

              <div className="text-xs leading-relaxed text-gray-600 bg-white rounded-lg p-2">
                {selected.detail}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recommendation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="rounded-xl p-4 text-sm"
        style={{ backgroundColor: `${BRAND.accent}12`, color: "#374151" }}
      >
        <div className="font-bold mb-2" style={{ color: BRAND.accent }}>
          珍途建議上市路徑
        </div>
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {[
            { step: "1", text: "台灣 IPO（TWSE）", color: BRAND.primary },
            { step: "2", text: "Level I ADR（OTC）", color: BRAND.neutral },
            { step: "3", text: "升級 Level II（NYSE）", color: BRAND.accent },
            { step: "4", text: "評估港股 / 東京二次上市", color: BRAND.story },
          ].map((s, i) => (
            <div key={s.step} className="flex items-center gap-1">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                style={{ backgroundColor: s.color }}>
                {s.step}
              </div>
              <span>{s.text}</span>
              {i < 3 && <span className="text-gray-400 mx-1">&rarr;</span>}
            </div>
          ))}
        </div>
        <div className="mt-2 text-xs text-gray-500">
          先在母國市場建立估值基礎，再透過 ADR 逐步打入美國市場，最終視業務版圖考慮亞洲多地上市
        </div>
      </motion.div>
    </motion.div>
  );
}

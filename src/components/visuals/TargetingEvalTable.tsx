"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BRAND } from "@/components/brand/BrandColors";

interface Indicator {
  key: string;
  label: string;
  hint: string;
  icon: string;
}

const INDICATORS: Indicator[] = [
  { key: "size", label: "市場規模", hint: "這塊市場夠大嗎？", icon: "S" },
  { key: "growth", label: "成長潛力", hint: "這塊市場在成長嗎？", icon: "G" },
  { key: "competition", label: "競爭強度", hint: "競爭者多嗎？(5=低競爭)", icon: "C" },
  { key: "access", label: "可接觸性", hint: "我們觸達得到嗎？", icon: "A" },
];

const PRESETS: Record<string, Record<string, number>> = {
  young: { size: 4, growth: 5, competition: 2, access: 4 },
  hnw: { size: 2, growth: 3, competition: 4, access: 2 },
};

function getSuggestion(total: number): { text: string; color: string } {
  if (total >= 16) return { text: "極具吸引力的目標市場，建議優先投入資源", color: BRAND.story };
  if (total >= 12) return { text: "具備潛力，可列入差異化行銷候選", color: BRAND.accent };
  if (total >= 8) return { text: "需審慎評估，可能需要利基策略切入", color: BRAND.primary };
  return { text: "吸引力偏低，建議暫緩或尋找其他區隔", color: BRAND.danger };
}

export default function TargetingEvalTable() {
  const [scores, setScores] = useState<Record<string, number>>({ size: 3, growth: 3, competition: 3, access: 3 });
  const [preset, setPreset] = useState<string | null>(null);

  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const suggestion = getSuggestion(total);

  const applyPreset = (key: string) => {
    setScores({ ...PRESETS[key] });
    setPreset(key);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <h4 className="text-center font-bold text-lg mb-1" style={{ color: BRAND.primary }}>
        四指標評估法：目標市場計分卡
      </h4>
      <p className="text-center text-xs text-gray-500 mb-4">
        拖曳滑桿為每個指標打分（1-5 分），評估目標市場吸引力
      </p>

      {/* Preset Buttons */}
      <div className="flex justify-center gap-2 mb-5">
        {[
          { key: "young", label: "範例：年輕小資族" },
          { key: "hnw", label: "範例：高淨值客戶" },
        ].map((p) => (
          <button
            key={p.key}
            onClick={() => applyPreset(p.key)}
            className="text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer"
            style={{
              borderColor: preset === p.key ? BRAND.accent : "#e5e7eb",
              backgroundColor: preset === p.key ? `${BRAND.accent}15` : "#fff",
              color: preset === p.key ? BRAND.accent : "#6b7280",
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Indicator Rows */}
      <div className="space-y-3 mb-5">
        {INDICATORS.map((ind, i) => (
          <motion.div
            key={ind.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-100 shadow-sm"
          >
            <div
              className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{ backgroundColor: BRAND.primary }}
            >
              {ind.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold" style={{ color: BRAND.primary }}>{ind.label}</span>
                <span className="text-xs text-gray-400">{ind.hint}</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                value={scores[ind.key]}
                onChange={(e) => {
                  setScores((prev) => ({ ...prev, [ind.key]: Number(e.target.value) }));
                  setPreset(null);
                }}
                className="w-full h-2 mt-1 accent-[#1B3A5C] cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-300 mt-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <span key={n} style={{ color: scores[ind.key] >= n ? BRAND.primary : undefined }}>{n}</span>
                ))}
              </div>
            </div>
            <div
              className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold text-white"
              style={{ backgroundColor: BRAND.primary }}
            >
              {scores[ind.key]}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Total & Suggestion */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="p-4 rounded-xl border-2 text-center"
        style={{ borderColor: suggestion.color, backgroundColor: `${suggestion.color}10` }}
      >
        <div className="text-xs text-gray-500 mb-1">總分</div>
        <div className="text-3xl font-bold mb-1" style={{ color: suggestion.color }}>
          {total} / 20
        </div>
        <div className="text-sm" style={{ color: suggestion.color }}>{suggestion.text}</div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-center text-xs text-gray-400 mt-3"
      >
        提示：競爭強度是反向指標 — 5 分代表競爭少（對我們有利）
      </motion.p>
    </motion.div>
  );
}

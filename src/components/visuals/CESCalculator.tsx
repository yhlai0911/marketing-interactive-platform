"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";

const BRAND = {
  primary: "#1A3C5E",
  accent: "#C9A84C",
  story: "#2A6B5A",
  danger: "#C0392B",
  neutral: "#6B7280",
};

interface TouchpointData {
  id: string;
  name: string;
  weight: number;
  defaultScore: number;
}

const DEFAULT_TOUCHPOINTS: TouchpointData[] = [
  { id: "app", name: "App 開戶", weight: 0.3, defaultScore: 5 },
  { id: "service", name: "客服回應", weight: 0.4, defaultScore: 3 },
  { id: "report", name: "月報告", weight: 0.3, defaultScore: 8 },
];

function getCESColor(ces: number): string {
  if (ces < 4) return BRAND.danger;
  if (ces <= 6) return BRAND.accent;
  return BRAND.story;
}

function getCESLabel(ces: number): string {
  if (ces < 4) return "需立即改善";
  if (ces <= 6) return "尚可，有改善空間";
  return "表現優良";
}

export default function CESCalculator() {
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(
      DEFAULT_TOUCHPOINTS.map((tp) => [tp.id, tp.defaultScore])
    )
  );

  const updateScore = (id: string, value: number) => {
    setScores((prev) => ({ ...prev, [id]: value }));
  };

  const calculations = useMemo(() => {
    const items = DEFAULT_TOUCHPOINTS.map((tp) => ({
      ...tp,
      score: scores[tp.id],
      weighted: tp.weight * scores[tp.id],
    }));
    const ces = items.reduce((sum, item) => sum + item.weighted, 0);
    const worstIdx = items.reduce(
      (minIdx, item, idx, arr) =>
        item.weighted < arr[minIdx].weighted ? idx : minIdx,
      0
    );
    return { items, ces, worstIdx };
  }, [scores]);

  const { items, ces, worstIdx } = calculations;
  const cesColor = getCESColor(ces);

  return (
    <div className="p-4 space-y-4 max-w-xl mx-auto">
      <h3
        className="text-lg font-bold text-center"
        style={{ color: BRAND.primary }}
      >
        CES 客戶體驗分數計算器
      </h3>
      <p className="text-xs text-center" style={{ color: BRAND.neutral }}>
        調整每個接觸點的評分（1-10），即時計算 CES = &Sigma;(w<sub>i</sub>{" "}
        &times; TP<sub>i</sub>)
      </p>

      {/* Touchpoint sliders */}
      <div className="space-y-4">
        {items.map((item, i) => {
          const isWorst = i === worstIdx;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-lg p-3"
              style={{
                backgroundColor: isWorst ? `${BRAND.danger}08` : "#f9fafb",
                border: `1px solid ${isWorst ? BRAND.danger + "40" : "#e5e7eb"}`,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="text-sm font-bold"
                    style={{ color: isWorst ? BRAND.danger : BRAND.primary }}
                  >
                    {item.name}
                  </span>
                  {isWorst && (
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                      style={{
                        backgroundColor: `${BRAND.danger}15`,
                        color: BRAND.danger,
                      }}
                    >
                      最大拖累
                    </span>
                  )}
                </div>
                <span className="text-xs" style={{ color: BRAND.neutral }}>
                  權重 w = {item.weight.toFixed(2)}
                </span>
              </div>

              {/* Slider */}
              <div className="flex items-center gap-3">
                <span
                  className="text-xs w-4 text-center font-mono"
                  style={{ color: BRAND.neutral }}
                >
                  1
                </span>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={item.score}
                  onChange={(e) =>
                    updateScore(item.id, parseInt(e.target.value))
                  }
                  className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${isWorst ? BRAND.danger : BRAND.primary} 0%, ${isWorst ? BRAND.danger : BRAND.primary} ${((item.score - 1) / 9) * 100}%, #e5e7eb ${((item.score - 1) / 9) * 100}%, #e5e7eb 100%)`,
                  }}
                />
                <span
                  className="text-xs w-4 text-center font-mono"
                  style={{ color: BRAND.neutral }}
                >
                  10
                </span>
              </div>

              {/* Score display */}
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs" style={{ color: BRAND.neutral }}>
                  接觸點評分：
                  <span
                    className="font-bold text-sm"
                    style={{
                      color: item.score >= 7 ? BRAND.story : item.score >= 4 ? BRAND.accent : BRAND.danger,
                    }}
                  >
                    {item.score}
                  </span>
                  /10
                </span>
                <span className="text-xs font-mono" style={{ color: BRAND.neutral }}>
                  {item.weight.toFixed(2)} &times; {item.score} ={" "}
                  <span className="font-bold">{item.weighted.toFixed(2)}</span>
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* CES Result */}
      <motion.div
        className="rounded-lg p-4 text-center space-y-2"
        style={{
          backgroundColor: `${cesColor}10`,
          border: `2px solid ${cesColor}`,
        }}
        animate={{
          borderColor: cesColor,
          backgroundColor: `${cesColor}10`,
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-xs font-medium" style={{ color: BRAND.neutral }}>
          CES = &Sigma;(w<sub>i</sub> &times; TP<sub>i</sub>) ={" "}
          {items.map((item, i) => (
            <span key={item.id}>
              {i > 0 && " + "}
              {item.weighted.toFixed(2)}
            </span>
          ))}
        </div>
        <div className="text-3xl font-bold" style={{ color: cesColor }}>
          {ces.toFixed(2)}
        </div>
        <div className="text-sm font-medium" style={{ color: cesColor }}>
          {getCESLabel(ces)}
        </div>

        {/* Progress bar */}
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden mt-2 relative">
          {/* Color zones */}
          <div className="absolute inset-0 flex">
            <div
              className="h-full"
              style={{ width: "40%", backgroundColor: `${BRAND.danger}20` }}
            />
            <div
              className="h-full"
              style={{ width: "20%", backgroundColor: `${BRAND.accent}20` }}
            />
            <div
              className="h-full"
              style={{ width: "40%", backgroundColor: `${BRAND.story}20` }}
            />
          </div>
          {/* Indicator */}
          <motion.div
            className="absolute top-0 h-full w-1 rounded-full"
            style={{ backgroundColor: cesColor }}
            animate={{ left: `${(ces / 10) * 100}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          />
        </div>
        <div className="flex justify-between text-[9px]" style={{ color: BRAND.neutral }}>
          <span>0</span>
          <span style={{ color: BRAND.danger }}>危險 (&lt;4)</span>
          <span style={{ color: BRAND.accent }}>普通 (4-6)</span>
          <span style={{ color: BRAND.story }}>優良 (&gt;6)</span>
          <span>10</span>
        </div>
      </motion.div>

      {/* Improvement suggestion */}
      <div
        className="rounded-lg p-3 text-xs space-y-1"
        style={{
          backgroundColor: `${BRAND.danger}08`,
          border: `1px solid ${BRAND.danger}20`,
        }}
      >
        <div className="font-medium" style={{ color: BRAND.danger }}>
          改善建議
        </div>
        <p style={{ color: BRAND.primary }}>
          「<span className="font-bold">{items[worstIdx].name}</span>
          」的加權得分最低（
          {items[worstIdx].weighted.toFixed(2)}），是目前最大的體驗瓶頸。
          {items[worstIdx].score <= 4 &&
            " 建議優先投入資源提升此接觸點的服務品質。"}
          {items[worstIdx].score > 4 &&
            items[worstIdx].score <= 6 &&
            " 此接觸點仍有明顯改善空間。"}
          {items[worstIdx].score > 6 &&
            " 雖然評分不低，但因權重較高，改善此項的 CES 提升效果最大。"}
        </p>
      </div>
    </div>
  );
}

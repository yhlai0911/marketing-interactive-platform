"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const BRAND = {
  primary: "#1A3C5E",
  accent: "#C9A84C",
  story: "#2A6B5A",
  danger: "#C0392B",
  neutral: "#6B7280",
};

interface Dimension {
  name: string;
  direct: { score: number; label: string };
  indirect: { score: number; label: string };
}

const DIMENSIONS: Dimension[] = [
  { name: "控制力", direct: { score: 90, label: "高（完全掌握體驗）" }, indirect: { score: 25, label: "低（受制於合作方）" } },
  { name: "觸及範圍", direct: { score: 25, label: "窄（受限自有資源）" }, indirect: { score: 90, label: "廣（借力合作網路）" } },
  { name: "單位成本", direct: { score: 80, label: "高（需自建基礎建設）" }, indirect: { score: 30, label: "低（共享合作方資源）" } },
  { name: "客戶關係", direct: { score: 85, label: "深（直接互動）" }, indirect: { score: 30, label: "淺（隔層互動）" } },
  { name: "品牌控制", direct: { score: 90, label: "強（統一體驗）" }, indirect: { score: 25, label: "弱（可能被稀釋）" } },
];

export default function ChannelEvalFramework() {
  const [selected, setSelected] = useState<"direct" | "indirect" | "both">("both");

  return (
    <div className="p-4 space-y-4 max-w-xl mx-auto">
      <h3 className="text-lg font-bold text-center" style={{ color: BRAND.primary }}>
        通路選擇五維度評估框架
      </h3>

      <div className="flex justify-center gap-2">
        {(["direct", "indirect", "both"] as const).map((opt) => (
          <button
            key={opt}
            onClick={() => setSelected(opt)}
            className="px-3 py-1 rounded-full text-sm font-medium transition-colors"
            style={{
              backgroundColor: selected === opt ? BRAND.primary : "#f3f4f6",
              color: selected === opt ? "#fff" : BRAND.neutral,
            }}
          >
            {opt === "direct" ? "直接通路" : opt === "indirect" ? "間接通路" : "兩者比較"}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {DIMENSIONS.map((dim, i) => (
          <div key={dim.name} className="space-y-1">
            <div className="flex justify-between text-sm font-medium" style={{ color: BRAND.primary }}>
              <span>{dim.name}</span>
            </div>

            {(selected === "direct" || selected === "both") && (
              <div className="flex items-center gap-2">
                <span className="text-xs w-16 text-right" style={{ color: BRAND.story }}>直接</span>
                <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dim.direct.score}%` }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="h-full rounded-full flex items-center justify-end pr-2"
                    style={{ backgroundColor: BRAND.story }}
                  >
                    <span className="text-[10px] text-white whitespace-nowrap">{dim.direct.label}</span>
                  </motion.div>
                </div>
              </div>
            )}

            {(selected === "indirect" || selected === "both") && (
              <div className="flex items-center gap-2">
                <span className="text-xs w-16 text-right" style={{ color: BRAND.accent }}>間接</span>
                <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dim.indirect.score}%` }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="h-full rounded-full flex items-center justify-end pr-2"
                    style={{ backgroundColor: BRAND.accent }}
                  >
                    <span className="text-[10px] text-white whitespace-nowrap">{dim.indirect.label}</span>
                  </motion.div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-center" style={{ color: BRAND.neutral }}>
        最佳策略：直接 + 間接通路的組合，讓每個通路各司其職（Stern &amp; El-Ansary, 2006）
      </p>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { BRAND } from "@/components/brand/BrandColors";

const MOTIVES = [
  { motive: "市場尋求", value: 90, desc: "開拓新消費市場" },
  { motive: "資源尋求", value: 40, desc: "獲取原料或人才" },
  { motive: "效率尋求", value: 55, desc: "優化全球供應鏈" },
  { motive: "策略資產", value: 60, desc: "取得品牌、通路" },
  { motive: "風險分散", value: 70, desc: "不把雞蛋放同一籃" },
  { motive: "寡占反應", value: 35, desc: "跟隨競爭者出海" },
];

export default function SixMotivesChart() {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (visibleCount < MOTIVES.length) {
      const timer = setTimeout(() => setVisibleCount((c) => c + 1), 600);
      return () => clearTimeout(timer);
    }
  }, [visibleCount]);

  const chartData = MOTIVES.map((m, i) => ({
    ...m,
    value: i < visibleCount ? m.value : 0,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-lg mx-auto"
    >
      <h4
        className="text-center font-bold text-lg mb-4"
        style={{ color: BRAND.primary }}
      >
        企業國際化六大動機（Dunning, 1993）
      </h4>

      <div className="w-full h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis
              dataKey="motive"
              tick={{ fontSize: 12, fill: "#374151" }}
            />
            <Radar
              dataKey="value"
              stroke={BRAND.primary}
              fill={BRAND.primary}
              fillOpacity={0.25}
              animationDuration={400}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* 逐項展開的說明文字 */}
      <div className="mt-4 space-y-2">
        <AnimatePresence>
          {MOTIVES.slice(0, visibleCount).map((m, i) => (
            <motion.div
              key={m.motive}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 text-sm px-3 py-2 rounded-lg bg-gray-50"
            >
              <span
                className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: BRAND.primary }}
              />
              <span className="font-medium text-gray-800">{m.motive}</span>
              <span className="text-gray-500">—</span>
              <span className="text-gray-600">{m.desc}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

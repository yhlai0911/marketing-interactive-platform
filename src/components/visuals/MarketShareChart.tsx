"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { BRAND } from "@/components/brand/BrandColors";

const MARKET_DATA = [
  { name: "亞太", value: 55, color: BRAND.primary },
  { name: "歐洲", value: 20, color: BRAND.accent },
  { name: "北美", value: 15, color: BRAND.story },
  { name: "其他", value: 10, color: BRAND.neutral },
];

export default function MarketShareChart() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <h4
        className="text-center font-bold text-lg mb-4"
        style={{ color: BRAND.primary }}
      >
        全球手搖飲市場分佈
      </h4>

      {show && (
        <div className="w-full h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={MARKET_DATA}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={95}
                paddingAngle={3}
                dataKey="value"
                animationBegin={0}
                animationDuration={1000}
                label={({ name, value }) => `${name} ${value}%`}
              >
                {MARKET_DATA.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `${value}%`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* 圖例 */}
      <div className="flex justify-center gap-4 mt-2 flex-wrap">
        {MARKET_DATA.map((d) => (
          <div key={d.name} className="flex items-center gap-1.5 text-sm">
            <span
              className="inline-block w-3 h-3 rounded-sm"
              style={{ backgroundColor: d.color }}
            />
            <span className="text-gray-700">
              {d.name} ({d.value}%)
            </span>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-gray-400 mt-3">
        市場規模約 43 億美元（資料來源：產業報告估計值）
      </p>
    </motion.div>
  );
}

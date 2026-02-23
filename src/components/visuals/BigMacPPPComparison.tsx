"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { BRAND } from "@/components/brand/BrandColors";

interface CountryPPP {
  country: string;
  flag: string;
  // Bubble Tea data
  teaLocal: number;
  teaCurrency: string;
  teaActualRate: number; // TWD per 1 foreign unit
  // Big Mac data
  macLocal: number;
  macCurrency: string;
  macActualRate: number;
}

const TW_TEA = 65; // TWD
const TW_MAC = 75; // TWD (approximate Big Mac price in Taiwan)

const COUNTRIES: CountryPPP[] = [
  {
    country: "日本",
    flag: "🇯🇵",
    teaLocal: 500, teaCurrency: "JPY", teaActualRate: 0.232,
    macLocal: 450, macCurrency: "JPY", macActualRate: 0.232,
  },
  {
    country: "美國",
    flag: "🇺🇸",
    teaLocal: 6.50, teaCurrency: "USD", teaActualRate: 32.50,
    macLocal: 5.58, macCurrency: "USD", macActualRate: 32.50,
  },
  {
    country: "泰國",
    flag: "🇹🇭",
    teaLocal: 75, teaCurrency: "THB", teaActualRate: 0.91,
    macLocal: 158, macCurrency: "THB", macActualRate: 0.91,
  },
  {
    country: "中國",
    flag: "🇨🇳",
    teaLocal: 15, teaCurrency: "CNY", teaActualRate: 4.50,
    macLocal: 24.40, macCurrency: "CNY", macActualRate: 4.50,
  },
];

function calcDeviation(localPrice: number, twPrice: number, actualRate: number): number {
  const pppRate = twPrice / localPrice;
  return ((actualRate - pppRate) / pppRate) * 100;
}

export default function BigMacPPPComparison() {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const data = useMemo(() => {
    return COUNTRIES.map((c) => {
      const teaDev = calcDeviation(c.teaLocal, TW_TEA, c.teaActualRate);
      const macDev = calcDeviation(c.macLocal, TW_MAC, c.macActualRate);
      return {
        name: `${c.flag} ${c.country}`,
        teaDev: parseFloat(teaDev.toFixed(1)),
        macDev: parseFloat(macDev.toFixed(1)),
        diff: parseFloat(Math.abs(teaDev - macDev).toFixed(1)),
        teaPPP: (TW_TEA / c.teaLocal).toFixed(4),
        macPPP: (TW_MAC / c.macLocal).toFixed(4),
        actualRate: c.teaActualRate.toFixed(4),
        currency: c.teaCurrency,
        ...c,
      };
    });
  }, []);

  const chartData = data.map((d) => ({
    name: d.name,
    "珍奶偏差": d.teaDev,
    "大麥克偏差": d.macDev,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <h4
        className="text-center font-bold text-lg mb-1"
        style={{ color: BRAND.primary }}
      >
        大麥克 vs 珍奶 PPP 偏差對比
      </h4>
      <p className="text-center text-xs text-gray-500 mb-5">
        同一國家、不同商品、不同結論
      </p>

      {/* 商品圖示 */}
      <div className="flex justify-center gap-8 mb-4">
        <div className="text-center">
          <div className="text-3xl mb-1">🧋</div>
          <div className="text-xs text-gray-500">珍奶 NT${TW_TEA}</div>
        </div>
        <div className="text-center text-gray-300 text-2xl self-center">vs</div>
        <div className="text-center">
          <div className="text-3xl mb-1">🍔</div>
          <div className="text-xs text-gray-500">大麥克 NT${TW_MAC}</div>
        </div>
      </div>

      {/* 雙條長條圖 */}
      <div className="w-full h-[220px] mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ left: 10, right: 20, top: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" fontSize={12} />
            <YAxis
              tickFormatter={(v: number) => `${v}%`}
              fontSize={11}
            />
            <Tooltip
              formatter={(value, name) => [`${value}%`, name]}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar
              dataKey="珍奶偏差"
              fill={BRAND.accent}
              radius={[4, 4, 0, 0]}
              animationDuration={600}
            />
            <Bar
              dataKey="大麥克偏差"
              fill={BRAND.primary}
              radius={[4, 4, 0, 0]}
              animationDuration={600}
              animationBegin={300}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 國家卡片列 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {data.map((d, i) => (
          <motion.button
            key={d.country}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setSelectedIdx(selectedIdx === i ? null : i)}
            className="p-3 rounded-lg border-2 text-center transition-all"
            style={{
              borderColor: selectedIdx === i ? BRAND.primary : "#e5e7eb",
              backgroundColor: selectedIdx === i ? `${BRAND.primary}08` : "#fff",
            }}
          >
            <div className="text-lg">{d.flag}</div>
            <div className="text-xs font-bold text-gray-700">{d.country}</div>
            <div className="text-xs mt-1">
              <span style={{ color: BRAND.accent }}>🧋 {d.teaDev > 0 ? "+" : ""}{d.teaDev}%</span>
            </div>
            <div className="text-xs">
              <span style={{ color: BRAND.primary }}>🍔 {d.macDev > 0 ? "+" : ""}{d.macDev}%</span>
            </div>
            <div
              className="text-xs font-bold mt-1"
              style={{ color: BRAND.danger }}
            >
              差距 {d.diff}%
            </div>
          </motion.button>
        ))}
      </div>

      {/* 選中國家的詳細資訊 */}
      <AnimatePresence>
        {selectedIdx !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-4"
          >
            <div
              className="p-4 rounded-lg text-sm"
              style={{ backgroundColor: `${BRAND.primary}08` }}
            >
              {(() => {
                const d = data[selectedIdx];
                return (
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <span className="text-gray-500 text-xs block">珍奶 PPP 匯率</span>
                        <span className="font-bold">{d.teaPPP}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs block">大麥克 PPP 匯率</span>
                        <span className="font-bold">{d.macPPP}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs block">實際匯率</span>
                        <span className="font-bold">{d.actualRate}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2 text-center">
                      {d.diff > 50
                        ? "兩種商品給出截然不同的結論——這說明單一商品無法代表整體物價水準"
                        : d.diff > 20
                          ? "偏差差異顯著——不同商品的成本結構（原料 vs 人工）影響 PPP 估計"
                          : "兩種商品的偏差相近——可能反映類似的成本結構"}
                    </p>
                  </div>
                );
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 核心結論 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center text-sm p-3 rounded-lg"
        style={{ backgroundColor: `${BRAND.accent}15`, color: "#374151" }}
      >
        <span className="font-bold" style={{ color: BRAND.accent }}>
          關鍵結論：
        </span>{" "}
        同一國家用不同商品計算 PPP，偏差可以差
        <span className="font-bold" style={{ color: BRAND.danger }}>
          {" "}{Math.max(...data.map((d) => d.diff)).toFixed(0)}%
        </span>{" "}
        以上——沒有單一商品能完美代表物價水準
      </motion.div>
    </motion.div>
  );
}

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
  Cell,
  ReferenceLine,
} from "recharts";
import { BRAND } from "@/components/brand/BrandColors";

interface CountryData {
  country: string;
  flag: string;
  localPrice: number;
  currency: string;
  actualRate: number;
  gdpPerCapita: number;
}

const COUNTRIES: CountryData[] = [
  { country: "台灣", flag: "🇹🇼", localPrice: 65, currency: "TWD", actualRate: 1, gdpPerCapita: 34000 },
  { country: "日本", flag: "🇯🇵", localPrice: 500, currency: "JPY", actualRate: 0.232, gdpPerCapita: 34000 },
  { country: "美國", flag: "🇺🇸", localPrice: 6.50, currency: "USD", actualRate: 32.50, gdpPerCapita: 76000 },
  { country: "泰國", flag: "🇹🇭", localPrice: 75, currency: "THB", actualRate: 0.91, gdpPerCapita: 8000 },
  { country: "越南", flag: "🇻🇳", localPrice: 55000, currency: "VND", actualRate: 0.00130, gdpPerCapita: 4300 },
  { country: "中國", flag: "🇨🇳", localPrice: 15, currency: "CNY", actualRate: 4.50, gdpPerCapita: 13000 },
];

const TW_PRICE = 65;

function computePPP(c: CountryData) {
  if (c.currency === "TWD") {
    return { twdPrice: 65, pppRate: 1, deviation: 0 };
  }
  const twdPrice = c.localPrice * c.actualRate;
  const pppRate = TW_PRICE / c.localPrice;
  const deviation = ((c.actualRate - pppRate) / pppRate) * 100;
  return { twdPrice, pppRate, deviation };
}

function cupSize(twdPrice: number): number {
  // Scale: 65 TWD = base (36px), scale proportionally, cap at 64px
  return Math.max(24, Math.min(64, (twdPrice / 65) * 36));
}

export default function PPPBubbleTeaIndex() {
  const [showBS, setShowBS] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);

  const analysis = useMemo(() => {
    return COUNTRIES.map((c) => ({
      ...c,
      ...computePPP(c),
    }));
  }, []);

  const deviationChart = analysis
    .filter((a) => a.currency !== "TWD")
    .map((a) => ({
      name: `${a.flag} ${a.country}`,
      deviation: parseFloat(a.deviation.toFixed(1)),
      gdp: a.gdpPerCapita,
    }));

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
        珍珠奶茶購買力平價指數
      </h4>
      <p className="text-center text-xs text-gray-500 mb-5">
        W03 計算題 1 — 六國珍奶 PPP 比較
      </p>

      {/* 珍奶杯圖示列 — 使用 grid 確保不溢出 */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6">
        {analysis.map((a, i) => {
          const size = cupSize(a.twdPrice);
          return (
            <motion.div
              key={a.country}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="flex flex-col items-center cursor-pointer p-1"
              onClick={() => setSelectedCountry(selectedCountry === i ? null : i)}
            >
              <div
                className="text-center mb-1"
                style={{ fontSize: `${size}px`, lineHeight: 1 }}
              >
                🧋
              </div>
              <div className="text-[10px] font-bold text-gray-700 whitespace-nowrap">
                {a.flag} {a.country}
              </div>
              <div className="text-[10px] text-gray-500 whitespace-nowrap">
                {a.currency === "TWD"
                  ? `${a.localPrice} TWD`
                  : `${a.localPrice.toLocaleString()} ${a.currency}`}
              </div>
              <div
                className="text-xs font-bold mt-0.5"
                style={{
                  color:
                    a.currency === "TWD"
                      ? BRAND.primary
                      : a.deviation > 50
                        ? BRAND.danger
                        : a.deviation > 10
                          ? BRAND.accent
                          : BRAND.story,
                }}
              >
                NT${a.twdPrice.toFixed(0)}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 選中國家的詳細資訊 */}
      <AnimatePresence>
        {selectedCountry !== null && analysis[selectedCountry].currency !== "TWD" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-5"
          >
            <div
              className="p-4 rounded-lg text-sm"
              style={{ backgroundColor: `${BRAND.primary}08` }}
            >
              {(() => {
                const a = analysis[selectedCountry];
                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <span className="text-gray-500 text-xs">PPP 隱含匯率：</span>
                      <span className="font-bold ml-1">
                        {a.pppRate.toFixed(4)} TWD/{a.currency}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs">實際匯率：</span>
                      <span className="font-bold ml-1">
                        {a.actualRate.toFixed(4)} TWD/{a.currency}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs">PPP 偏差：</span>
                      <span
                        className="font-bold ml-1"
                        style={{ color: a.deviation > 0 ? BRAND.danger : BRAND.story }}
                      >
                        {a.deviation > 0 ? "+" : ""}
                        {a.deviation.toFixed(1)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs">判斷：</span>
                      <span className="font-bold ml-1">
                        {a.deviation > 0
                          ? `${a.currency} 被高估（或 TWD 被低估）`
                          : `${a.currency} 被低估（或 TWD 被高估）`}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PPP 偏差長條圖 */}
      <div className="w-full h-[180px] mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={deviationChart} margin={{ left: 5, right: 10, top: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" fontSize={10} interval={0} />
            <YAxis
              tickFormatter={(v: number) => `${v}%`}
              fontSize={11}
              domain={[0, "auto"]}
            />
            <Tooltip
              formatter={(value) => [`${value}%`, "PPP 偏差"]}
            />
            <ReferenceLine y={0} stroke="#9ca3af" />
            <Bar dataKey="deviation" radius={[4, 4, 0, 0]} animationDuration={600}>
              {deviationChart.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={
                    entry.deviation > 100
                      ? BRAND.danger
                      : entry.deviation > 30
                        ? BRAND.accent
                        : BRAND.story
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Balassa-Samuelson 提示 */}
      <div className="flex justify-center mb-3">
        <button
          onClick={() => setShowBS(!showBS)}
          className="text-sm px-4 py-1.5 rounded-full border transition-colors"
          style={{
            borderColor: BRAND.accent,
            color: showBS ? "#fff" : BRAND.accent,
            backgroundColor: showBS ? BRAND.accent : "transparent",
          }}
        >
          {showBS ? "隱藏" : "顯示"} Balassa-Samuelson 效果
        </button>
      </div>

      <AnimatePresence>
        {showBS && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div
              className="p-4 rounded-lg text-sm"
              style={{ backgroundColor: `${BRAND.accent}10` }}
            >
              <p className="font-bold mb-2" style={{ color: BRAND.accent }}>
                PPP 偏差 vs 人均 GDP
              </p>
              <div className="space-y-2">
                {analysis
                  .filter((a) => a.currency !== "TWD")
                  .sort((a, b) => a.gdpPerCapita - b.gdpPerCapita)
                  .map((a) => (
                    <div key={a.country} className="flex items-center gap-2">
                      <span className="w-20 text-xs">
                        {a.flag} ${(a.gdpPerCapita / 1000).toFixed(0)}K
                      </span>
                      <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, a.deviation / 2)}%` }}
                          transition={{ duration: 0.8 }}
                          className="h-full rounded-full"
                          style={{
                            backgroundColor:
                              a.deviation > 100
                                ? BRAND.danger
                                : a.deviation > 30
                                  ? BRAND.accent
                                  : BRAND.story,
                          }}
                        />
                      </div>
                      <span className="text-xs font-medium w-16 text-right">
                        +{a.deviation.toFixed(1)}%
                      </span>
                    </div>
                  ))}
              </div>
              <p className="text-xs text-gray-600 mt-3">
                人均 GDP 越高的國家，PPP 偏差越大 — 已開發國家的服務業成本（店租、人工）被高生產力部門的工資水準推高。
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

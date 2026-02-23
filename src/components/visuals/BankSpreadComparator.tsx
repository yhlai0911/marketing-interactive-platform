"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { BRAND } from "@/components/brand/BrandColors";

interface BankQuote {
  name: string;
  jpyBid: number;
  jpyAsk: number;
  usdBid: number;
  usdAsk: number;
}

const BANKS: BankQuote[] = [
  { name: "A 銀行", jpyBid: 0.2138, jpyAsk: 0.2162, usdBid: 32.30, usdAsk: 32.70 },
  { name: "B 銀行", jpyBid: 0.2140, jpyAsk: 0.2158, usdBid: 32.32, usdAsk: 32.68 },
  { name: "C 銀行", jpyBid: 0.2135, jpyAsk: 0.2165, usdBid: 32.28, usdAsk: 32.72 },
];

function spreadPct(bid: number, ask: number): number {
  return ((ask - bid) / ask) * 100;
}

function fmt(n: number, digits = 4): string {
  return n.toFixed(digits);
}

function fmtInt(n: number): string {
  return n.toLocaleString("zh-TW", { maximumFractionDigits: 0 });
}

export default function BankSpreadComparator() {
  const [amount, setAmount] = useState(4_500_000);
  const [mode, setMode] = useState<"buy" | "sell">("buy");

  const analysis = useMemo(() => {
    return BANKS.map((b) => {
      const jpySpread = spreadPct(b.jpyBid, b.jpyAsk);
      const usdSpread = spreadPct(b.usdBid, b.usdAsk);
      const cost =
        mode === "buy" ? amount * b.jpyAsk : amount * b.jpyBid;
      return { ...b, jpySpread, usdSpread, cost };
    });
  }, [amount, mode]);

  const bestIdx = useMemo(() => {
    if (mode === "buy") {
      let idx = 0;
      for (let i = 1; i < analysis.length; i++) {
        if (analysis[i].cost < analysis[idx].cost) idx = i;
      }
      return idx;
    } else {
      let idx = 0;
      for (let i = 1; i < analysis.length; i++) {
        if (analysis[i].cost > analysis[idx].cost) idx = i;
      }
      return idx;
    }
  }, [analysis, mode]);

  const bestSpreadIdx = useMemo(() => {
    let idx = 0;
    for (let i = 1; i < analysis.length; i++) {
      if (analysis[i].jpySpread < analysis[idx].jpySpread) idx = i;
    }
    return idx;
  }, [analysis]);

  const chartData = analysis.map((a, i) => ({
    name: a.name,
    cost: Math.round(a.cost),
    isBest: i === bestIdx,
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
        銀行外匯報價比較器
      </h4>
      <p className="text-center text-xs text-gray-500 mb-5">
        W02 計算題 3 — 三家銀行 TWD/JPY 即期電匯報價
      </p>

      {/* 控制列 */}
      <div className="flex items-center justify-center gap-4 mb-5 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">交易方向：</label>
          <button
            onClick={() => setMode("buy")}
            className="px-3 py-1 rounded text-sm font-medium transition-colors"
            style={{
              backgroundColor: mode === "buy" ? BRAND.primary : "#f3f4f6",
              color: mode === "buy" ? "#fff" : "#6b7280",
            }}
          >
            買入日圓
          </button>
          <button
            onClick={() => setMode("sell")}
            className="px-3 py-1 rounded text-sm font-medium transition-colors"
            style={{
              backgroundColor: mode === "sell" ? BRAND.primary : "#f3f4f6",
              color: mode === "sell" ? "#fff" : "#6b7280",
            }}
          >
            賣出日圓
          </button>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">金額（JPY）：</label>
          <input
            type="text"
            value={amount.toLocaleString()}
            onChange={(e) => {
              const v = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10);
              if (!isNaN(v) && v > 0) setAmount(v);
            }}
            className="w-36 px-2 py-1 border rounded text-sm text-right"
          />
        </div>
      </div>

      {/* 報價表格 */}
      <div className="overflow-x-auto mb-5">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr style={{ backgroundColor: `${BRAND.primary}10` }}>
              <th className="text-left px-3 py-2 font-semibold" style={{ color: BRAND.primary }}>
                銀行
              </th>
              <th className="text-right px-3 py-2 font-semibold" style={{ color: BRAND.primary }}>
                JPY Bid
              </th>
              <th className="text-right px-3 py-2 font-semibold" style={{ color: BRAND.primary }}>
                JPY Ask
              </th>
              <th className="text-right px-3 py-2 font-semibold" style={{ color: BRAND.primary }}>
                Spread%
              </th>
              <th className="text-right px-3 py-2 font-semibold" style={{ color: BRAND.primary }}>
                {mode === "buy" ? "買入成本 (TWD)" : "賣出收入 (TWD)"}
              </th>
            </tr>
          </thead>
          <tbody>
            {analysis.map((a, i) => (
              <motion.tr
                key={a.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="border-b"
                style={{
                  backgroundColor: i === bestIdx ? `${BRAND.story}10` : "transparent",
                }}
              >
                <td className="px-3 py-2 font-medium">
                  {a.name}
                  {i === bestIdx && (
                    <span
                      className="ml-2 text-xs px-1.5 py-0.5 rounded font-bold"
                      style={{ backgroundColor: BRAND.story, color: "#fff" }}
                    >
                      最佳
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 text-right tabular-nums">{fmt(a.jpyBid)}</td>
                <td className="px-3 py-2 text-right tabular-nums">{fmt(a.jpyAsk)}</td>
                <td
                  className="px-3 py-2 text-right tabular-nums font-medium"
                  style={{
                    color: i === bestSpreadIdx ? BRAND.story : BRAND.danger,
                  }}
                >
                  {a.jpySpread.toFixed(2)}%
                  {i === bestSpreadIdx && " *"}
                </td>
                <td
                  className="px-3 py-2 text-right tabular-nums font-bold"
                  style={{ color: i === bestIdx ? BRAND.story : "#374151" }}
                >
                  {fmtInt(a.cost)}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 長條圖 */}
      <div className="w-full h-[200px] mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 30 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis
              type="number"
              tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`}
              domain={["dataMin - 2000", "dataMax + 2000"]}
              fontSize={11}
            />
            <YAxis type="category" dataKey="name" width={60} fontSize={12} />
            <Tooltip
              formatter={(value) => [`NT$ ${fmtInt(Number(value))}`, mode === "buy" ? "成本" : "收入"]}
            />
            <Bar dataKey="cost" radius={[0, 4, 4, 0]} animationDuration={600}>
              {chartData.map((entry, i) => (
                <Cell
                  key={entry.name}
                  fill={entry.isBest ? BRAND.story : `${BRAND.primary}80`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 差異提示 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-sm p-3 rounded-lg"
        style={{ backgroundColor: `${BRAND.accent}15`, color: "#374151" }}
      >
        <span className="font-bold" style={{ color: BRAND.accent }}>
          價差影響：
        </span>{" "}
        最佳與最差銀行相差{" "}
        <span className="font-bold" style={{ color: BRAND.danger }}>
          NT$ {fmtInt(Math.abs(Math.max(...analysis.map((a) => a.cost)) - Math.min(...analysis.map((a) => a.cost))))}
        </span>
      </motion.div>
    </motion.div>
  );
}

"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { BRAND } from "@/components/brand/BrandColors";

interface InvoiceItem {
  name: string;
  amount: number;
  currency: "JPY" | "EUR";
}

const INVOICE_ITEMS: InvoiceItem[] = [
  { name: "宇治抹茶粉", amount: 2_000_000, currency: "JPY" },
  { name: "丹波玄米", amount: 1_200_000, currency: "JPY" },
  { name: "北海道鮮乳原料", amount: 1_300_000, currency: "JPY" },
  { name: "法國有機糖漿", amount: 5_000, currency: "EUR" },
];

// 預設匯率（來自 week02 案例分析）
const DEFAULT_RATES = {
  twdJpyBid: 0.2140,
  twdJpyAsk: 0.2158,
  twdUsdBid: 32.32,
  twdUsdAsk: 32.68,
  usdEurBid: 1.0830,
  usdEurAsk: 1.0870,
};

const GOOGLE_RATE_JPY = 0.215; // 林美用 Google 查到的中間價

function fmtInt(n: number): string {
  return n.toLocaleString("zh-TW", { maximumFractionDigits: 0 });
}

function fmt(n: number, digits = 4): string {
  return n.toFixed(digits);
}

export default function InvoiceCostCalculator() {
  const [rates, setRates] = useState(DEFAULT_RATES);
  const [showCrossRate, setShowCrossRate] = useState(false);

  const calc = useMemo(() => {
    // 交叉匯率 TWD/EUR
    const twdEurBid = rates.twdUsdBid * rates.usdEurBid;
    const twdEurAsk = rates.twdUsdAsk * rates.usdEurAsk;
    const twdEurSpread = ((twdEurAsk - twdEurBid) / twdEurAsk) * 100;

    // 各品項成本（買入外幣使用 Ask 價）
    const items = INVOICE_ITEMS.map((item) => {
      const rate = item.currency === "JPY" ? rates.twdJpyAsk : twdEurAsk;
      const twdCost = item.amount * rate;
      return { ...item, rate, twdCost };
    });

    const totalTWD = items.reduce((sum, i) => sum + i.twdCost, 0);

    // Google 估算（全部當日圓 + 中間價）
    const googleEstimate = 5_000_000 * GOOGLE_RATE_JPY;
    const diff = totalTWD - googleEstimate;
    const diffPct = (diff / googleEstimate) * 100;

    return { twdEurBid, twdEurAsk, twdEurSpread, items, totalTWD, googleEstimate, diff, diffPct };
  }, [rates]);

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
        進口報價單成本計算器
      </h4>
      <p className="text-center text-xs text-gray-500 mb-5">
        W02 案例分析 — 珍途的第一筆進口交易
      </p>

      {/* 匯率面板 */}
      <div
        className="rounded-lg p-4 mb-5"
        style={{ backgroundColor: `${BRAND.primary}06` }}
      >
        <p className="text-sm font-bold mb-3" style={{ color: BRAND.primary }}>
          銀行即期電匯報價
        </p>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div>
            <div className="text-xs text-gray-500 mb-1">TWD/JPY</div>
            <div className="flex gap-2">
              <div>
                <span className="text-xs text-gray-400">Bid</span>
                <input
                  type="number"
                  step="0.0001"
                  value={rates.twdJpyBid}
                  onChange={(e) =>
                    setRates({ ...rates, twdJpyBid: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-1.5 py-1 border rounded text-xs tabular-nums"
                />
              </div>
              <div>
                <span className="text-xs text-gray-400">Ask</span>
                <input
                  type="number"
                  step="0.0001"
                  value={rates.twdJpyAsk}
                  onChange={(e) =>
                    setRates({ ...rates, twdJpyAsk: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-1.5 py-1 border rounded text-xs tabular-nums"
                />
              </div>
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">TWD/USD</div>
            <div className="flex gap-2">
              <div>
                <span className="text-xs text-gray-400">Bid</span>
                <input
                  type="number"
                  step="0.01"
                  value={rates.twdUsdBid}
                  onChange={(e) =>
                    setRates({ ...rates, twdUsdBid: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-1.5 py-1 border rounded text-xs tabular-nums"
                />
              </div>
              <div>
                <span className="text-xs text-gray-400">Ask</span>
                <input
                  type="number"
                  step="0.01"
                  value={rates.twdUsdAsk}
                  onChange={(e) =>
                    setRates({ ...rates, twdUsdAsk: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-1.5 py-1 border rounded text-xs tabular-nums"
                />
              </div>
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">USD/EUR</div>
            <div className="flex gap-2">
              <div>
                <span className="text-xs text-gray-400">Bid</span>
                <input
                  type="number"
                  step="0.0001"
                  value={rates.usdEurBid}
                  onChange={(e) =>
                    setRates({ ...rates, usdEurBid: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-1.5 py-1 border rounded text-xs tabular-nums"
                />
              </div>
              <div>
                <span className="text-xs text-gray-400">Ask</span>
                <input
                  type="number"
                  step="0.0001"
                  value={rates.usdEurAsk}
                  onChange={(e) =>
                    setRates({ ...rates, usdEurAsk: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-1.5 py-1 border rounded text-xs tabular-nums"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 交叉匯率 */}
        <button
          onClick={() => setShowCrossRate(!showCrossRate)}
          className="mt-3 text-xs underline"
          style={{ color: BRAND.accent }}
        >
          {showCrossRate ? "隱藏" : "查看"}交叉匯率 TWD/EUR 推算
        </button>
        {showCrossRate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 p-2 rounded text-xs bg-white"
          >
            <div className="text-gray-600">
              Bid(TWD/EUR) = Bid(TWD/USD) x Bid(USD/EUR) = {fmt(rates.twdUsdBid, 2)} x {fmt(rates.usdEurBid)} ={" "}
              <span className="font-bold">{fmt(calc.twdEurBid, 2)}</span>
            </div>
            <div className="text-gray-600">
              Ask(TWD/EUR) = Ask(TWD/USD) x Ask(USD/EUR) = {fmt(rates.twdUsdAsk, 2)} x {fmt(rates.usdEurAsk)} ={" "}
              <span className="font-bold">{fmt(calc.twdEurAsk, 2)}</span>
            </div>
            <div className="text-gray-500 mt-1">
              交叉匯率 Spread = {calc.twdEurSpread.toFixed(2)}%（經美元中轉的成本疊加效應）
            </div>
          </motion.div>
        )}
      </div>

      {/* 報價單表格 */}
      <div className="overflow-x-auto mb-5">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr style={{ backgroundColor: `${BRAND.accent}10` }}>
              <th className="text-left px-3 py-2 font-semibold" style={{ color: BRAND.primary }}>
                品項
              </th>
              <th className="text-right px-3 py-2 font-semibold" style={{ color: BRAND.primary }}>
                金額
              </th>
              <th className="text-center px-3 py-2 font-semibold" style={{ color: BRAND.primary }}>
                幣別
              </th>
              <th className="text-right px-3 py-2 font-semibold" style={{ color: BRAND.primary }}>
                適用匯率
              </th>
              <th className="text-right px-3 py-2 font-semibold" style={{ color: BRAND.primary }}>
                台幣成本
              </th>
            </tr>
          </thead>
          <tbody>
            {calc.items.map((item, i) => (
              <motion.tr
                key={item.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="border-b"
              >
                <td className="px-3 py-2">{item.name}</td>
                <td className="px-3 py-2 text-right tabular-nums">{fmtInt(item.amount)}</td>
                <td className="px-3 py-2 text-center">{item.currency}</td>
                <td className="px-3 py-2 text-right tabular-nums text-gray-500">
                  {fmt(item.rate, item.currency === "EUR" ? 2 : 4)}
                </td>
                <td className="px-3 py-2 text-right tabular-nums font-medium">
                  {fmtInt(item.twdCost)}
                </td>
              </motion.tr>
            ))}
            {/* 合計列 */}
            <tr style={{ backgroundColor: `${BRAND.primary}08` }}>
              <td
                colSpan={4}
                className="px-3 py-2 text-right font-bold"
                style={{ color: BRAND.primary }}
              >
                實際銀行總成本
              </td>
              <td
                className="px-3 py-2 text-right font-bold text-lg tabular-nums"
                style={{ color: BRAND.primary }}
              >
                NT$ {fmtInt(calc.totalTWD)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Google vs 實際比較 */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl p-4 border-2 text-center"
          style={{ borderColor: "#9ca3af", backgroundColor: "#f9fafb" }}
        >
          <div className="text-xs text-gray-500 mb-1">林美的 Google 估算</div>
          <div className="text-xs text-gray-400 mb-2">
            500 萬 JPY x 0.215
          </div>
          <div className="text-xl font-bold text-gray-500">
            NT$ {fmtInt(calc.googleEstimate)}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl p-4 border-2 text-center"
          style={{ borderColor: BRAND.primary, backgroundColor: `${BRAND.primary}06` }}
        >
          <div className="text-xs text-gray-500 mb-1">實際銀行成本</div>
          <div className="text-xs text-gray-400 mb-2">
            分幣別 x Ask 價
          </div>
          <div className="text-xl font-bold" style={{ color: BRAND.primary }}>
            NT$ {fmtInt(calc.totalTWD)}
          </div>
        </motion.div>
      </div>

      {/* 差額警示 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="p-3 rounded-lg text-center text-sm"
        style={{ backgroundColor: `${BRAND.danger}10` }}
      >
        <span className="font-bold" style={{ color: BRAND.danger }}>
          被忽略的成本：
        </span>{" "}
        <span className="text-gray-700">
          實際多付{" "}
          <span className="font-bold" style={{ color: BRAND.danger }}>
            NT$ {fmtInt(calc.diff)}
          </span>{" "}
          （+{calc.diffPct.toFixed(1)}%）
        </span>
        <div className="text-xs text-gray-500 mt-1">
          來自：Bid-Ask 價差 + 歐元交叉匯率成本疊加 + 幣別分類錯誤
        </div>
      </motion.div>
    </motion.div>
  );
}

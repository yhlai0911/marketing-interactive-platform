"use client";

import { useState } from "react";

/**
 * 現行匯率法 vs 時態法：同一組數據，兩種方法的換算結果對比
 * 互動元件：切換匯率查看 CTA / 換算利得損失變化
 */
export default function TranslationMethodComparison() {
  const [spotRate, setSpotRate] = useState(0.208);
  const historicalRate = 0.233;

  // 日圓 BS（千 JPY）
  const cash = 5000;
  const receivables = 2000;
  const inventory = 3000;
  const equipment = 20000;
  const totalAssets = cash + receivables + inventory + equipment; // 30000
  const payables = 4000;
  const loans = 6000;
  const totalLiab = payables + loans; // 10000
  const capitalStock = 15000;
  const retainedEarnings = 5000;
  const netAssets = totalAssets - totalLiab; // 20000

  // 現行匯率法
  const crAssets = totalAssets * spotRate;
  const crLiab = totalLiab * spotRate;
  const crCapital = capitalStock * historicalRate;
  const crRE = retainedEarnings * historicalRate;
  const cta = netAssets * (spotRate - historicalRate);
  const crEquity = crCapital + crRE + cta;

  // 時態法
  const monetaryAssets = (cash + receivables) * spotRate;
  const nonMonetaryAssets = (inventory + equipment) * historicalRate;
  const tmAssets = monetaryAssets + nonMonetaryAssets;
  const tmLiab = totalLiab * spotRate;
  const tmCapital = capitalStock * historicalRate;
  const tmRE = retainedEarnings * historicalRate;
  const netMonetary = (cash + receivables) - totalLiab;
  const translationGL = netMonetary * (spotRate - historicalRate);
  const tmEquity = tmCapital + tmRE + translationGL;

  const fmt = (n: number) => n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <div className="bg-white rounded-xl border p-5 my-4">
      <h3 className="text-lg font-bold mb-4 text-center">
        兩種換算方法比較（千 TWD）
      </h3>

      {/* 匯率滑桿 */}
      <div className="mb-6 bg-gray-50 rounded-lg p-4">
        <label className="block text-sm font-medium mb-2">
          期末匯率 S<sub>T</sub> (TWD/JPY)：
          <span className="text-blue-600 font-bold ml-2">{spotRate.toFixed(4)}</span>
          <span className="text-xs text-gray-500 ml-2">
            （歷史 S<sub>H</sub> = {historicalRate}）
          </span>
        </label>
        <input
          type="range"
          min={0.180}
          max={0.260}
          step={0.001}
          value={spotRate}
          onChange={(e) => setSpotRate(parseFloat(e.target.value))}
          className="w-full accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0.180（大幅貶值）</span>
          <span>0.233（歷史）</span>
          <span>0.260（升值）</span>
        </div>
      </div>

      {/* 兩欄對比 */}
      <div className="grid grid-cols-2 gap-4">
        {/* 現行匯率法 */}
        <div className="border rounded-lg p-4">
          <h4 className="font-bold text-blue-700 text-center mb-3">現行匯率法</h4>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b">
                <td className="py-1">資產合計</td>
                <td className="py-1 text-right font-mono">{fmt(crAssets)}</td>
              </tr>
              <tr className="border-b">
                <td className="py-1">負債合計</td>
                <td className="py-1 text-right font-mono">{fmt(crLiab)}</td>
              </tr>
              <tr className="border-b">
                <td className="py-1">投入資本</td>
                <td className="py-1 text-right font-mono">{fmt(crCapital)}</td>
              </tr>
              <tr className="border-b">
                <td className="py-1">保留盈餘</td>
                <td className="py-1 text-right font-mono">{fmt(crRE)}</td>
              </tr>
              <tr className="border-b bg-yellow-50">
                <td className="py-1 font-bold">CTA</td>
                <td className={`py-1 text-right font-mono font-bold ${cta < 0 ? "text-red-600" : "text-green-600"}`}>
                  {cta >= 0 ? "+" : ""}{fmt(cta)}
                </td>
              </tr>
              <tr>
                <td className="py-1 font-bold">權益合計</td>
                <td className="py-1 text-right font-mono font-bold">{fmt(crEquity)}</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-3 text-xs text-center text-gray-500">
            CTA 列入 OCI，不影響 EPS
          </div>
        </div>

        {/* 時態法 */}
        <div className="border rounded-lg p-4">
          <h4 className="font-bold text-orange-700 text-center mb-3">時態法</h4>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b">
                <td className="py-1">資產合計</td>
                <td className="py-1 text-right font-mono">{fmt(tmAssets)}</td>
              </tr>
              <tr className="border-b">
                <td className="py-1">負債合計</td>
                <td className="py-1 text-right font-mono">{fmt(tmLiab)}</td>
              </tr>
              <tr className="border-b">
                <td className="py-1">投入資本</td>
                <td className="py-1 text-right font-mono">{fmt(tmCapital)}</td>
              </tr>
              <tr className="border-b">
                <td className="py-1">保留盈餘</td>
                <td className="py-1 text-right font-mono">{fmt(tmRE)}</td>
              </tr>
              <tr className="border-b bg-yellow-50">
                <td className="py-1 font-bold">換算利得/損失</td>
                <td className={`py-1 text-right font-mono font-bold ${translationGL < 0 ? "text-red-600" : "text-green-600"}`}>
                  {translationGL >= 0 ? "+" : ""}{fmt(translationGL)}
                </td>
              </tr>
              <tr>
                <td className="py-1 font-bold">權益合計</td>
                <td className="py-1 text-right font-mono font-bold">{fmt(tmEquity)}</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-3 text-xs text-center text-gray-500">
            換算利得/損失進損益表，影響 EPS
          </div>
        </div>
      </div>

      {/* 差異摘要 */}
      <div className="mt-4 bg-gray-50 rounded-lg p-3 text-center">
        <span className="text-sm">
          兩法差異：
          <span className={`font-bold ml-1 ${(cta - translationGL) < 0 ? "text-red-600" : "text-green-600"}`}>
            {fmt(Math.abs(cta - translationGL))} 千 TWD
          </span>
          {Math.abs(cta - translationGL) > 0.5 && (
            <span className="text-xs text-gray-500 ml-2">
              （同一家店、同一季度、同樣的數字）
            </span>
          )}
        </span>
      </div>
    </div>
  );
}

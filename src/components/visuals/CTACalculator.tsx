"use client";

import { useState } from "react";

/**
 * CTA 計算器：互動式展示淨資產、匯率變動與 CTA 的關係
 * 含 BS 避險模擬（增加借款降低淨資產）
 */
export default function CTACalculator() {
  const [additionalDebt, setAdditionalDebt] = useState(0);
  const historicalRate = 0.233;
  const spotRate = 0.208;
  const rateChange = spotRate - historicalRate; // -0.025

  const originalNetAssets = 20000;
  const newNetAssets = originalNetAssets - additionalDebt;
  const originalCTA = originalNetAssets * rateChange;
  const newCTA = newNetAssets * rateChange;
  const ctaReduction = Math.abs(originalCTA) - Math.abs(newCTA);
  const interestCost = additionalDebt * 0.005 * (spotRate); // 0.5% 日圓利率 × TWD 換算

  const fmt = (n: number) => {
    const sign = n >= 0 ? "+" : "";
    return sign + n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="bg-white rounded-xl border p-5 my-4">
      <h3 className="text-lg font-bold mb-4 text-center">
        CTA 計算與資產負債表避險
      </h3>

      {/* 基礎數據 */}
      <div className="grid grid-cols-3 gap-3 mb-5 text-center">
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="text-xs text-gray-500">原始淨資產</div>
          <div className="text-lg font-bold text-blue-700">¥{(originalNetAssets / 1000).toFixed(0)}M</div>
          <div className="text-xs text-gray-400">20,000 千 JPY</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500">匯率變動</div>
          <div className="text-lg font-bold text-red-600">{rateChange.toFixed(3)}</div>
          <div className="text-xs text-gray-400">{historicalRate} → {spotRate}</div>
        </div>
        <div className="bg-red-50 rounded-lg p-3">
          <div className="text-xs text-gray-500">原始 CTA</div>
          <div className="text-lg font-bold text-red-600">{fmt(originalCTA)}</div>
          <div className="text-xs text-gray-400">千 TWD</div>
        </div>
      </div>

      {/* BS 避險滑桿 */}
      <div className="bg-amber-50 rounded-lg p-4 mb-4">
        <h4 className="font-bold text-amber-800 mb-2">資產負債表避險模擬</h4>
        <label className="block text-sm mb-2">
          增加日圓借款（並匯回台灣）：
          <span className="text-amber-700 font-bold ml-2">¥{(additionalDebt / 1000).toFixed(0)}M</span>
          <span className="text-xs text-gray-500 ml-1">（{additionalDebt.toLocaleString()} 千 JPY）</span>
        </label>
        <input
          type="range"
          min={0}
          max={20000}
          step={1000}
          value={additionalDebt}
          onChange={(e) => setAdditionalDebt(parseInt(e.target.value))}
          className="w-full accent-amber-600"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0（不避險）</span>
          <span>10,000（半避險）</span>
          <span>20,000（全避險）</span>
        </div>
      </div>

      {/* 結果 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded-lg p-4 text-center">
          <div className="text-sm text-gray-500 mb-1">新淨資產</div>
          <div className="text-2xl font-bold text-blue-700">
            {newNetAssets.toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">千 JPY</div>
          {additionalDebt > 0 && (
            <div className="text-xs text-blue-500 mt-1">
              ↓ 減少 {additionalDebt.toLocaleString()}
            </div>
          )}
        </div>
        <div className="border rounded-lg p-4 text-center">
          <div className="text-sm text-gray-500 mb-1">新 CTA</div>
          <div className={`text-2xl font-bold ${newCTA < 0 ? "text-red-600" : newCTA > 0 ? "text-green-600" : "text-gray-600"}`}>
            {fmt(newCTA)}
          </div>
          <div className="text-xs text-gray-400">千 TWD</div>
          {ctaReduction > 0 && (
            <div className="text-xs text-green-600 mt-1">
              ↓ 減少 {ctaReduction.toFixed(0)} 千 TWD
            </div>
          )}
        </div>
      </div>

      {/* 成本提醒 */}
      {additionalDebt > 0 && (
        <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm">
          <span className="font-bold text-orange-700">代價提醒：</span>
          <span className="text-orange-800 ml-1">
            多借 ¥{(additionalDebt / 1000).toFixed(0)}M 的年利息成本約 {interestCost.toFixed(0)} 千 TWD
            （假設日圓貸款利率 0.5%）。
            {additionalDebt >= 15000 && " 且大量借款匯回會產生交易曝險。"}
          </span>
        </div>
      )}
    </div>
  );
}

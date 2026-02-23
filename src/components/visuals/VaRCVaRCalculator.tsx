"use client";

import { useState } from "react";

/**
 * VaR 與 CVaR 互動計算器
 * 讓學生動態調整標準差和信心水準，即時觀察風險值變化
 */
export default function VaRCVaRCalculator() {
  const [sigma, setSigma] = useState(2000); // 萬日圓
  const [confidence, setConfidence] = useState<95 | 99>(95);

  // z 值和 CVaR 乘數
  const params = {
    95: { z: 1.645, cvarMultiplier: 1.28, label: "95%" },
    99: { z: 2.326, cvarMultiplier: 1.14, label: "99%" },
  };

  const p = params[confidence];
  const var_ = p.z * sigma;
  const cvar = p.cvarMultiplier * var_;

  const formatNum = (n: number) => Math.round(n).toLocaleString();

  return (
    <div className="bg-white rounded-xl border p-5 my-4">
      <h3 className="text-lg font-bold mb-1 text-center">
        VaR 與 CVaR 互動計算器
      </h3>
      <p className="text-sm text-gray-500 text-center mb-5">
        調整參數觀察風險值如何變化
      </p>

      {/* 參數輸入 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* 波動標準差 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <label className="text-sm font-medium text-gray-600 block mb-2">
            日報酬標準差 σ（萬日圓）
          </label>
          <input
            type="range"
            min={500}
            max={5000}
            step={100}
            value={sigma}
            onChange={(e) => setSigma(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
          <div className="text-center mt-1">
            <span className="text-2xl font-bold text-blue-700">{formatNum(sigma)}</span>
            <span className="text-sm text-gray-500 ml-1">萬 ¥</span>
          </div>
        </div>

        {/* 信心水準 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <label className="text-sm font-medium text-gray-600 block mb-2">
            信心水準
          </label>
          <div className="flex gap-2">
            {([95, 99] as const).map((c) => (
              <button
                key={c}
                onClick={() => setConfidence(c)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  confidence === c
                    ? "bg-blue-600 text-white shadow"
                    : "bg-white border text-gray-500 hover:bg-gray-100"
                }`}
              >
                {c}%
              </button>
            ))}
          </div>
          <div className="text-center mt-2 text-sm text-gray-500">
            z<sub>α</sub> = {p.z}
          </div>
        </div>
      </div>

      {/* 公式展示 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="text-center text-sm text-blue-700 mb-2">
          VaR<sub>{confidence}%</sub> = z<sub>α</sub> × σ = {p.z} × {formatNum(sigma)} =
        </div>
        <div className="text-center">
          <span className="text-3xl font-bold text-blue-700">{formatNum(var_)}</span>
          <span className="text-sm text-blue-500 ml-1">萬日圓</span>
        </div>
      </div>

      {/* 結果對比 */}
      <div className="grid grid-cols-2 gap-3">
        {/* VaR */}
        <div className="rounded-lg border-2 border-blue-400 p-4 text-center bg-blue-50">
          <div className="text-sm font-medium text-blue-600 mb-1">VaR（門檻值）</div>
          <div className="text-2xl font-bold text-blue-700">{formatNum(var_)}</div>
          <div className="text-xs text-blue-500 mt-1">萬日圓/天</div>
          <div className="text-xs text-gray-500 mt-2">
            {confidence}% 信心下日損失不超過此值
          </div>
        </div>

        {/* CVaR */}
        <div className="rounded-lg border-2 border-red-400 p-4 text-center bg-red-50">
          <div className="text-sm font-medium text-red-600 mb-1">CVaR（尾部平均）</div>
          <div className="text-2xl font-bold text-red-700">{formatNum(cvar)}</div>
          <div className="text-xs text-red-500 mt-1">萬日圓/天</div>
          <div className="text-xs text-gray-500 mt-2">
            最壞 {100 - confidence}% 情況的平均損失
          </div>
        </div>
      </div>

      {/* CVaR vs VaR 差距 */}
      <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-orange-700 font-medium">CVaR / VaR 比率</span>
          <span className="font-bold text-orange-700">
            {(cvar / var_).toFixed(2)}×
          </span>
        </div>
        <div className="w-full bg-orange-100 rounded-full h-3 mt-2 overflow-hidden">
          <div className="flex h-full">
            <div
              className="bg-blue-500 h-full"
              style={{ width: `${(var_ / cvar) * 100}%` }}
            />
            <div
              className="bg-red-500 h-full"
              style={{ width: `${((cvar - var_) / cvar) * 100}%` }}
            />
          </div>
        </div>
        <div className="flex justify-between text-xs mt-1 text-gray-500">
          <span>VaR 覆蓋範圍</span>
          <span>CVaR 額外捕捉的尾部風險</span>
        </div>
      </div>

      {/* 洞察 */}
      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
        <span className="font-bold">關鍵洞察：</span>
        VaR 只告訴你「門檻在哪」，CVaR 告訴你「超過門檻後平均虧多少」。
        Basel III 已要求銀行同時報告兩者，因為 2008 年金融危機證明了只看 VaR 會嚴重低估尾部風險。
      </div>
    </div>
  );
}

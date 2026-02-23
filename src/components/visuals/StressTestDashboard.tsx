"use client";

import { useState } from "react";

/**
 * 壓力測試儀表板
 * 三情境下珍途的營收、現金流、存活月數即時對比
 */
export default function StressTestDashboard() {
  const [selectedScenario, setSelectedScenario] = useState<number | null>(null);

  const scenarios = [
    {
      name: "基準情境",
      emoji: "☀️",
      color: "#27AE60",
      bgColor: "#E8F8F5",
      borderColor: "#27AE60",
      description: "現況延續，匯率小幅波動",
      assumptions: ["日圓匯率 TWD/JPY = 0.21", "營收成長 8%", "融資成本不變"],
      revenue: 12.0,
      netCashflow: 0.8,
      cashReserve: 13.0,
      creditLine: 5.0,
      survivalMonths: "N/A（正現金流）",
      survivalValue: 999,
    },
    {
      name: "不利情境",
      emoji: "🌧️",
      color: "#E67E22",
      bgColor: "#FEF5E7",
      borderColor: "#E67E22",
      description: "日圓急貶 15%，消費放緩",
      assumptions: ["日圓再貶 15%（TWD/JPY → 0.18）", "日本營收下滑 20%", "避險成本倍增", "信用額度縮減 40%"],
      revenue: 9.2,
      netCashflow: -2.5,
      cashReserve: 10.0,
      creditLine: 3.0,
      survivalMonths: "5.2 個月",
      survivalValue: 5.2,
    },
    {
      name: "極端情境",
      emoji: "🌪️",
      color: "#C0392B",
      bgColor: "#FDEDEC",
      borderColor: "#C0392B",
      description: "亞洲金融風暴重演",
      assumptions: ["日圓暴跌 30%", "泰銖、越南盾同步貶值 20%", "銀行全面抽銀根", "供應鏈斷裂 2 個月"],
      revenue: 5.8,
      netCashflow: -4.8,
      cashReserve: 8.0,
      creditLine: 0,
      survivalMonths: "1.7 個月",
      survivalValue: 1.7,
    },
  ];

  const getSurvivalColor = (months: number) => {
    if (months >= 12) return "#27AE60";
    if (months >= 6) return "#E67E22";
    return "#C0392B";
  };

  return (
    <div className="bg-white rounded-xl border p-5 my-4">
      <h3 className="text-lg font-bold mb-1 text-center">
        壓力測試儀表板
      </h3>
      <p className="text-sm text-gray-500 text-center mb-5">
        珍途在三種情境下的財務韌性分析（金額單位：億 TWD）
      </p>

      {/* 三情境卡片 */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {scenarios.map((s, i) => (
          <button
            key={s.name}
            onClick={() => setSelectedScenario(selectedScenario === i ? null : i)}
            className={`rounded-xl p-4 border-2 text-center transition-all ${
              selectedScenario === i ? "scale-[1.02] shadow-lg" : "hover:shadow-sm"
            }`}
            style={{
              borderColor: selectedScenario === i ? s.borderColor : "#E5E7EB",
              backgroundColor: selectedScenario === i ? s.bgColor : "white",
            }}
          >
            <div className="text-2xl mb-1">{s.emoji}</div>
            <div className="text-sm font-bold" style={{ color: s.color }}>{s.name}</div>
            <div className="text-xs text-gray-500 mt-1">{s.description}</div>
          </button>
        ))}
      </div>

      {/* 情境假設 */}
      {selectedScenario !== null && (
        <div
          className="rounded-lg p-4 mb-5 border"
          style={{
            backgroundColor: scenarios[selectedScenario].bgColor,
            borderColor: scenarios[selectedScenario].borderColor,
          }}
        >
          <h4 className="font-bold text-sm mb-2" style={{ color: scenarios[selectedScenario].color }}>
            {scenarios[selectedScenario].emoji} {scenarios[selectedScenario].name}假設條件
          </h4>
          <ul className="space-y-1">
            {scenarios[selectedScenario].assumptions.map((a, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <span style={{ color: scenarios[selectedScenario].color }}>•</span>
                <span className="text-gray-700">{a}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 比較表 */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2">
              <th className="text-left py-2 text-gray-500 font-medium">指標</th>
              {scenarios.map((s) => (
                <th key={s.name} className="text-center py-2 font-bold" style={{ color: s.color }}>
                  {s.emoji} {s.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2.5 text-gray-600">年營收</td>
              {scenarios.map((s) => (
                <td key={s.name} className="text-center font-medium">{s.revenue.toFixed(1)} 億</td>
              ))}
            </tr>
            <tr className="border-b">
              <td className="py-2.5 text-gray-600">月淨現金流</td>
              {scenarios.map((s) => (
                <td
                  key={s.name}
                  className="text-center font-medium"
                  style={{ color: s.netCashflow < 0 ? "#C0392B" : "#27AE60" }}
                >
                  {s.netCashflow > 0 ? "+" : ""}{s.netCashflow.toFixed(1)} 億
                </td>
              ))}
            </tr>
            <tr className="border-b">
              <td className="py-2.5 text-gray-600">可用現金</td>
              {scenarios.map((s) => (
                <td key={s.name} className="text-center font-medium">{s.cashReserve.toFixed(1)} 億</td>
              ))}
            </tr>
            <tr className="border-b">
              <td className="py-2.5 text-gray-600">未動用信用額度</td>
              {scenarios.map((s) => (
                <td key={s.name} className="text-center font-medium">{s.creditLine.toFixed(1)} 億</td>
              ))}
            </tr>
            <tr className="border-t-2">
              <td className="py-3 font-bold text-gray-800">存活月數</td>
              {scenarios.map((s) => (
                <td key={s.name} className="text-center">
                  <span
                    className="text-lg font-bold"
                    style={{ color: getSurvivalColor(s.survivalValue) }}
                  >
                    {s.survivalMonths}
                  </span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* 安全線警示 */}
      <div className="mt-4 flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg p-3">
        <div className="text-2xl">⚠️</div>
        <div className="text-sm text-red-800">
          <span className="font-bold">安全基準線：12 個月。</span>
          珍途在不利情境下僅能存活 5.2 個月，極端情境下更只有 1.7 個月。
          董事會必須立即制定流動性應急計畫。
        </div>
      </div>

      {/* 洞察 */}
      <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
        <span className="font-bold">關鍵洞察：</span>
        壓力測試的價值不在於「預測」未來，而在於回答「如果最壞的事情發生，我們能撐多久？」
        存活月數公式 = (可用現金 + 未動用信用額度) / 月均淨流出，是最直觀的韌性指標。
      </div>
    </div>
  );
}

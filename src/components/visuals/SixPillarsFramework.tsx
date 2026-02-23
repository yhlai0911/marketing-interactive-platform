"use client";

import { useState } from "react";

/**
 * 六大支柱框架互動圖
 * 顯示六大支柱之間的雙向因果關係，點選任一支柱可高亮相關連結
 */
export default function SixPillarsFramework() {
  const [activePillar, setActivePillar] = useState<number | null>(null);

  const pillars = [
    {
      id: 1,
      label: "I. 市場環境分析",
      weeks: "W1-4",
      tools: "PPP、IRP、IFE、UFR",
      color: "#1B3A5C",
      bgColor: "#EBF0F5",
      icon: "🌏",
      connects: [2, 3, 6],
    },
    {
      id: 2,
      label: "II. 投資決策",
      weeks: "W5-6, 12",
      tools: "NPV、APV、WACC、FDI",
      color: "#2E86C1",
      bgColor: "#EBF5FB",
      icon: "💰",
      connects: [1, 3, 5],
    },
    {
      id: 3,
      label: "III. 風險辨識與量化",
      weeks: "W8-11, 15",
      tools: "VaR、CVaR、曝險係數",
      color: "#C0392B",
      bgColor: "#FDEDEC",
      icon: "📊",
      connects: [1, 2, 4],
    },
    {
      id: 4,
      label: "IV. 風險管理策略",
      weeks: "W7-10",
      tools: "遠期、選擇權、互換、天然避險",
      color: "#D4A843",
      bgColor: "#FEF9E7",
      icon: "🛡️",
      connects: [3, 5, 6],
    },
    {
      id: 5,
      label: "V. 全球資金管理",
      weeks: "W6, 13-14",
      tools: "資金池、淨額清算、ADR",
      color: "#2D5016",
      bgColor: "#EAFAF1",
      icon: "🏦",
      connects: [2, 4, 6],
    },
    {
      id: 6,
      label: "VI. 危機應對與韌性",
      weeks: "W15",
      tools: "壓力測試、存活月數、ERM",
      color: "#8E44AD",
      bgColor: "#F5EEF8",
      icon: "⚡",
      connects: [1, 4, 5],
    },
  ];

  const isHighlighted = (id: number) => {
    if (activePillar === null) return true;
    if (activePillar === id) return true;
    const active = pillars.find((p) => p.id === activePillar);
    return active?.connects.includes(id) ?? false;
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h3 className="text-lg font-bold text-center mb-4" style={{ color: "#1B3A5C" }}>
        六大支柱模型：雙向因果之網
      </h3>
      <p className="text-sm text-gray-500 text-center mb-6">
        點選任一支柱查看其連結關係
      </p>

      {/* 支柱網格 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {pillars.map((p) => {
          const highlighted = isHighlighted(p.id);
          const isActive = activePillar === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setActivePillar(isActive ? null : p.id)}
              className="rounded-xl p-4 text-left transition-all duration-300 border-2"
              style={{
                backgroundColor: highlighted ? p.bgColor : "#f9f9f9",
                borderColor: isActive ? p.color : highlighted ? p.color + "40" : "#e5e5e5",
                opacity: highlighted ? 1 : 0.35,
                transform: isActive ? "scale(1.03)" : "scale(1)",
                boxShadow: isActive ? `0 4px 12px ${p.color}30` : "none",
              }}
            >
              <div className="text-2xl mb-1">{p.icon}</div>
              <div className="font-bold text-sm" style={{ color: p.color }}>
                {p.label}
              </div>
              <div className="text-xs text-gray-500 mt-1">{p.weeks}</div>
              <div className="text-xs mt-1" style={{ color: p.color + "cc" }}>
                {p.tools}
              </div>
            </button>
          );
        })}
      </div>

      {/* 連結說明 */}
      {activePillar !== null && (
        <div
          className="rounded-lg p-4 border text-sm"
          style={{
            backgroundColor: pillars[activePillar - 1].bgColor,
            borderColor: pillars[activePillar - 1].color + "40",
          }}
        >
          <strong style={{ color: pillars[activePillar - 1].color }}>
            {pillars[activePillar - 1].label}
          </strong>
          <span className="text-gray-600"> 直接影響：</span>
          <span className="font-medium">
            {pillars[activePillar - 1].connects
              .map((c) => pillars[c - 1].label)
              .join("、")}
          </span>
          <p className="text-gray-500 mt-2 text-xs">
            國際財務戰略是一張雙向因果之網——每根支柱的決策都會影響其他支柱，反之亦然。
          </p>
        </div>
      )}

      {/* 因果鏈提示 */}
      <div className="mt-4 text-center text-xs text-gray-400">
        因果鏈：環境分析 → 投資決策 → 風險量化 → 避險策略 → 資金管理 → 危機韌性 ↺
      </div>
    </div>
  );
}

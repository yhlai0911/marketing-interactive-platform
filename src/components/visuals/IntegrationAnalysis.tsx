"use client";

import { useState } from "react";

/**
 * 六大支柱整合分析流程——清邁新店案例
 * 逐步展示 IRP → NPV → VaR → 避險 → 資金調度 → 壓力測試 的完整流程
 */
export default function IntegrationAnalysis() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      pillar: "I",
      label: "環境分析",
      icon: "🌏",
      color: "#1B3A5C",
      bgColor: "#EBF0F5",
      calc: "IRP 遠期匯率",
      formula: "F = 0.88 × (1.018 / 1.025)",
      result: "= 0.8740",
      detail: "泰銖/台幣遠期匯率，泰銖小幅貶值（利差效果）",
      status: "pass",
    },
    {
      pillar: "II",
      label: "投資決策",
      icon: "💰",
      color: "#2E86C1",
      bgColor: "#EBF5FB",
      calc: "台幣 NPV",
      formula: "NPV = -7,040,000 + Σ(CF×F_t / 1.11^t)",
      result: "≈ TWD 813,000 > 0",
      detail: "五年台幣折現值為正，初步可行",
      status: "pass",
    },
    {
      pillar: "III",
      label: "風險量化",
      icon: "📊",
      color: "#C0392B",
      bgColor: "#FDEDEC",
      calc: "95% VaR",
      formula: "VaR = 1.645 × 8.3% × 2.4M × 0.88",
      result: "≈ TWD 288,430",
      detail: "年度最大預期損失（95% 信賴水準）",
      status: "pass",
    },
    {
      pillar: "IV",
      label: "避險方案",
      icon: "🛡️",
      color: "#D4A843",
      bgColor: "#FEF9E7",
      calc: "組合避險",
      formula: "60% 遠期 + 40% 天然避險",
      result: "成本效益最佳組合",
      detail: "遠期鎖定確定營收，本地採購抵銷泰銖波動",
      status: "pass",
    },
    {
      pillar: "V",
      label: "資金調度",
      icon: "🏦",
      color: "#2D5016",
      bgColor: "#EAFAF1",
      calc: "亞太資金池",
      formula: "清邁 → 曼谷匯集中心 → 淨額清算",
      result: "納入現有架構",
      detail: "透過曼谷匯集中心與台北總部淨額清算",
      status: "pass",
    },
    {
      pillar: "VI",
      label: "壓力測試",
      icon: "⚡",
      color: "#8E44AD",
      bgColor: "#F5EEF8",
      calc: "存活月數",
      formula: "極端：泰銖貶 20% → 單季虧損 TWD 352K",
      result: "存活月數 11.3 月 ≈ 安全線",
      detail: "加上現金緩衝基金，整體存活月數仍在可接受範圍",
      status: "pass",
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h3 className="text-lg font-bold text-center mb-2" style={{ color: "#1B3A5C" }}>
        清邁新店：六大支柱整合分析
      </h3>
      <p className="text-sm text-gray-500 text-center mb-6">
        點選各步驟查看詳細計算
      </p>

      {/* 流程步驟列 */}
      <div className="flex items-center justify-between mb-6 overflow-x-auto pb-2">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center">
            <button
              onClick={() => setActiveStep(i)}
              className="flex flex-col items-center transition-all duration-300"
              style={{ opacity: activeStep === i ? 1 : 0.6 }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl border-2 transition-all"
                style={{
                  borderColor: step.color,
                  backgroundColor: activeStep === i ? step.bgColor : "white",
                  transform: activeStep === i ? "scale(1.15)" : "scale(1)",
                  boxShadow: activeStep === i ? `0 2px 8px ${step.color}30` : "none",
                }}
              >
                {step.icon}
              </div>
              <span
                className="text-[10px] mt-1 font-medium whitespace-nowrap"
                style={{ color: step.color }}
              >
                {step.pillar}
              </span>
            </button>
            {i < steps.length - 1 && (
              <div className="w-4 md:w-8 h-0.5 bg-gray-300 mx-1 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>

      {/* 詳細卡片 */}
      <div
        className="rounded-xl p-5 border-2 transition-all duration-300"
        style={{
          borderColor: steps[activeStep].color,
          backgroundColor: steps[activeStep].bgColor,
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">{steps[activeStep].icon}</span>
          <div>
            <div className="font-bold" style={{ color: steps[activeStep].color }}>
              支柱 {steps[activeStep].pillar}：{steps[activeStep].label}
            </div>
            <div className="text-sm text-gray-600">{steps[activeStep].calc}</div>
          </div>
          <span className="ml-auto text-lg">
            {steps[activeStep].status === "pass" ? "✅" : "⚠️"}
          </span>
        </div>

        <div className="bg-white/70 rounded-lg p-3 mb-3 font-mono text-sm">
          <div className="text-gray-600">{steps[activeStep].formula}</div>
          <div className="font-bold mt-1" style={{ color: steps[activeStep].color }}>
            {steps[activeStep].result}
          </div>
        </div>

        <p className="text-sm text-gray-600">{steps[activeStep].detail}</p>
      </div>

      {/* 結論 */}
      <div className="mt-4 rounded-lg p-3 bg-green-50 border border-green-200 text-center text-sm">
        <span className="font-bold text-green-700">結論：</span>
        <span className="text-green-600">
          六大支柱全部通過 → 清邁新店可以啟動
        </span>
      </div>
    </div>
  );
}

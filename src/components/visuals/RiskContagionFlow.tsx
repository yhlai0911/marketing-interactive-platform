"use client";

import { useState } from "react";

/**
 * 金融傳染路徑圖
 * 顯示危機如何透過三條渠道（貿易、金融、信心）從震源國擴散到珍途四個市場
 */
export default function RiskContagionFlow() {
  const [activeChannel, setActiveChannel] = useState<string | null>(null);

  const channels = [
    {
      id: "trade",
      label: "貿易渠道",
      color: "#E74C3C",
      bgColor: "#FDEDEC",
      icon: "📦",
      description: "出口銳減、供應鏈中斷、貿易信用凍結",
      examples: [
        "日圓暴跌 → 珍途日本營收縮水 30%",
        "泰國進口原料價格飆升 50%",
        "客戶延遲付款 → 應收帳款週轉天數拉長",
      ],
    },
    {
      id: "finance",
      label: "金融渠道",
      color: "#2980B9",
      bgColor: "#EBF5FB",
      icon: "🏦",
      description: "銀行抽銀根、外匯市場流動性枯竭、融資成本飆升",
      examples: [
        "往來銀行通知縮減信用額度 40%",
        "遠期外匯報價 bid-ask spread 擴大 5 倍",
        "海外子公司無法匯回盈餘",
      ],
    },
    {
      id: "confidence",
      label: "信心渠道",
      color: "#8E44AD",
      bgColor: "#F5EEF8",
      icon: "📉",
      description: "投資者恐慌、信用評等下調、羊群效應加速資金外逃",
      examples: [
        "新興市場 ETF 遭大量贖回 → 股匯雙殺",
        "信用評等從 BBB 降至 BB+ → 發債成本 +200bps",
        "媒體報導引發消費者恐慌 → 門市來客數驟降",
      ],
    },
  ];

  const markets = [
    { name: "日本", flag: "🇯🇵", risk: "匯率暴跌" },
    { name: "泰國", flag: "🇹🇭", risk: "供應鏈斷裂" },
    { name: "越南", flag: "🇻🇳", risk: "資金外逃" },
    { name: "台灣(總部)", flag: "🇹🇼", risk: "融資緊縮" },
  ];

  return (
    <div className="bg-white rounded-xl border p-5 my-4">
      <h3 className="text-lg font-bold mb-1 text-center">
        金融傳染路徑圖
      </h3>
      <p className="text-sm text-gray-500 text-center mb-5">
        點選渠道查看危機如何擴散到珍途各市場
      </p>

      {/* 震源 */}
      <div className="text-center mb-4">
        <div className="inline-block bg-red-100 border-2 border-red-400 rounded-xl px-6 py-3">
          <div className="text-2xl mb-1">⚡</div>
          <div className="font-bold text-red-700">金融危機震源</div>
          <div className="text-xs text-red-500">貨幣危機 / 銀行危機 / 債務危機</div>
        </div>
      </div>

      {/* 三條傳導渠道 */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {channels.map((ch) => (
          <button
            key={ch.id}
            onClick={() => setActiveChannel(activeChannel === ch.id ? null : ch.id)}
            className={`rounded-lg p-3 border-2 text-left transition-all ${
              activeChannel === ch.id ? "scale-[1.02] shadow-md" : "hover:shadow-sm"
            }`}
            style={{
              borderColor: activeChannel === ch.id ? ch.color : "#E5E7EB",
              backgroundColor: activeChannel === ch.id ? ch.bgColor : "white",
            }}
          >
            <div className="text-center text-xl mb-1">{ch.icon}</div>
            <div className="text-sm font-bold text-center" style={{ color: ch.color }}>
              {ch.label}
            </div>
            <div className="text-xs text-gray-500 text-center mt-1">{ch.description}</div>
          </button>
        ))}
      </div>

      {/* 展開的渠道詳情 */}
      {activeChannel && (() => {
        const ch = channels.find((c) => c.id === activeChannel)!;
        return (
          <div
            className="rounded-lg p-4 mb-4 border"
            style={{ backgroundColor: ch.bgColor, borderColor: ch.color }}
          >
            <h4 className="font-bold text-sm mb-2" style={{ color: ch.color }}>
              {ch.icon} {ch.label}對珍途的影響
            </h4>
            <ul className="space-y-1.5">
              {ch.examples.map((ex, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <span style={{ color: ch.color }}>→</span>
                  <span className="text-gray-700">{ex}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })()}

      {/* 下方方向箭頭 */}
      <div className="text-center text-gray-400 text-xl mb-3">▼ ▼ ▼</div>

      {/* 受衝擊市場 */}
      <div className="grid grid-cols-4 gap-2">
        {markets.map((m) => (
          <div key={m.name} className="text-center rounded-lg border p-3 bg-gray-50">
            <div className="text-xl">{m.flag}</div>
            <div className="text-sm font-bold mt-1">{m.name}</div>
            <div className="text-xs text-red-500 mt-1">{m.risk}</div>
          </div>
        ))}
      </div>

      {/* 洞察 */}
      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
        <span className="font-bold">關鍵洞察：</span>
        金融傳染的三條渠道往往同時發作且互相加強——貿易衝擊引發信心崩潰，信心崩潰導致銀行抽銀根，形成惡性循環。
        這就是為什麼 ERM 必須同時考慮多種風險的交互作用。
      </div>
    </div>
  );
}

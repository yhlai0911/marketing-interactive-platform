"use client";

/**
 * 三種曝險比較表：交易、經濟、換算
 * 靜態視覺元件，用色彩區分三種曝險的關鍵特徵
 */
export default function ThreeExposureComparison() {
  const exposures = [
    {
      name: "交易曝險",
      en: "Transaction",
      color: "#2980B9",
      bgColor: "#EBF5FB",
      icon: "💱",
      cashFlow: "有（已知金額）",
      timeframe: "短期（1-12 個月）",
      source: "外幣合約、應收/應付帳款",
      impact: "損益表（已實現損益）",
      hedging: "遠期合約、選擇權、期貨",
      week: "Week 8",
    },
    {
      name: "經濟曝險",
      en: "Economic",
      color: "#27AE60",
      bgColor: "#E8F8F5",
      icon: "📊",
      cashFlow: "有（間接、未來）",
      timeframe: "長期（持續性）",
      source: "競爭格局、成本結構變動",
      impact: "企業價值與競爭力",
      hedging: "營運彈性（生產轉移、多元採購）",
      week: "Week 9",
    },
    {
      name: "換算曝險",
      en: "Translation",
      color: "#8E44AD",
      bgColor: "#F4ECF7",
      icon: "📋",
      cashFlow: "無",
      timeframe: "每個報表日",
      source: "合併財報翻譯過程",
      impact: "股東權益（OCI 或損益表）",
      hedging: "資產負債表避險（最具爭議）",
      week: "Week 10",
    },
  ];

  const dimensions = [
    { label: "現金流影響", key: "cashFlow" as const },
    { label: "時間範圍", key: "timeframe" as const },
    { label: "風險來源", key: "source" as const },
    { label: "影響位置", key: "impact" as const },
    { label: "主要避險方式", key: "hedging" as const },
    { label: "教學進度", key: "week" as const },
  ];

  return (
    <div className="bg-white rounded-xl border p-5 my-4">
      <h3 className="text-lg font-bold mb-4 text-center">
        三種外匯曝險完整比較
      </h3>

      {/* 三欄標題 */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        <div />
        {exposures.map((e) => (
          <div
            key={e.name}
            className="text-center rounded-lg p-3"
            style={{ backgroundColor: e.bgColor }}
          >
            <div className="text-2xl mb-1">{e.icon}</div>
            <div className="font-bold" style={{ color: e.color }}>{e.name}</div>
            <div className="text-xs text-gray-500">{e.en}</div>
          </div>
        ))}
      </div>

      {/* 比較表 */}
      <div className="space-y-1">
        {dimensions.map((dim) => (
          <div key={dim.label} className="grid grid-cols-4 gap-2">
            <div className="text-sm font-medium text-gray-600 py-2 flex items-center">
              {dim.label}
            </div>
            {exposures.map((e) => (
              <div
                key={`${e.name}-${dim.label}`}
                className="text-sm py-2 px-2 rounded"
                style={{ backgroundColor: `${e.color}08` }}
              >
                {e[dim.key]}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* 底部洞察 */}
      <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-3 text-sm text-purple-800">
        <span className="font-bold">關鍵洞察：</span>
        換算曝險是三種曝險中最弔詭的——不涉及任何現金流，但能讓董事會質疑你的經營能力。
        花真金白銀去避險一個帳面數字，到底值不值得？
      </div>
    </div>
  );
}

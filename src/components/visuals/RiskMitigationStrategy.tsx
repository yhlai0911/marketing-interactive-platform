"use client";

/**
 * 五大國家風險緩解策略
 * 以卡片式呈現，搭配珍途的具體應用情境
 */
export default function RiskMitigationStrategy() {
  const strategies = [
    {
      id: 1,
      title: "投資結構設計",
      icon: "🤝",
      color: "#2980B9",
      bgColor: "#EBF5FB",
      tools: ["合資企業", "授權加盟", "ICSID 仲裁"],
      zhentuCase: "與泰國食品集團合資（珍途 60%），借助對方人脈和市場知識",
      riskReduced: "政治針對性↓ 資本暴露↓",
    },
    {
      id: 2,
      title: "政治風險保險",
      icon: "🛡️",
      color: "#8E44AD",
      bgColor: "#F4ECF7",
      tools: ["MIGA", "出口信用機構", "Lloyd's"],
      zhentuCase: "向中國輸出入銀行投保徵收風險和匯兌限制風險",
      riskReduced: "徵收風險↓ 匯兌限制↓",
    },
    {
      id: 3,
      title: "融資結構設計",
      icon: "🏦",
      color: "#27AE60",
      bgColor: "#E8F8F5",
      tools: ["當地貨幣借款", "開發銀行共融", "提早回收設計"],
      zhentuCase: "在泰國以泰銖借款融資，避免匯率錯配",
      riskReduced: "匯率風險↓ 資金暴露時間↓",
    },
    {
      id: 4,
      title: "營運風險分散",
      icon: "🌏",
      color: "#E67E22",
      bgColor: "#FEF5E7",
      tools: ["多國布局", "跨國供應鏈", "退出條款"],
      zhentuCase: "同時布局泰越菲，單一國家出問題損失有限",
      riskReduced: "集中風險↓ 供應鏈風險↓",
    },
    {
      id: 5,
      title: "利害關係人管理",
      icon: "👥",
      color: "#C0392B",
      bgColor: "#FDEDEC",
      tools: ["當地僱員", "社區公益", "政府溝通"],
      zhentuCase: "東京經驗：小雪（旭日食品）的在地關係是成功關鍵",
      riskReduced: "營運風險↓ 政治針對性↓",
    },
  ];

  return (
    <div className="bg-white rounded-xl border p-5 my-4">
      <h3 className="text-lg font-bold mb-4 text-center">
        五大國家風險緩解策略
      </h3>

      <div className="space-y-3">
        {strategies.map((s) => (
          <div
            key={s.id}
            className="rounded-lg p-4 border"
            style={{ borderColor: `${s.color}40`, backgroundColor: s.bgColor }}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl flex-shrink-0">{s.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold" style={{ color: s.color }}>
                    策略 {s.id}：{s.title}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/60 text-gray-600">
                    {s.riskReduced}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {s.tools.map((tool) => (
                    <span
                      key={tool}
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: `${s.color}15`, color: s.color }}
                    >
                      {tool}
                    </span>
                  ))}
                </div>
                <div className="text-sm text-gray-700">
                  <span className="font-medium">珍途應用：</span>
                  {s.zhentuCase}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 底部洞察 */}
      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
        <span className="font-bold">陳教授的總結：</span>
        對珍途最重要的兩個策略——選對合作夥伴，以及不要一次全押。
        階段式進入，用第一個市場的現金流支持後續擴張。
      </div>
    </div>
  );
}

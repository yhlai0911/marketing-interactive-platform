"use client";

/**
 * 三國風險矩陣比較表
 * 顯示泰國、越南、菲律賓在六個風險維度的評分（1-5 分）
 */
export default function CountryRiskMatrix() {
  const countries = [
    { name: "泰國", flag: "🇹🇭", color: "#2980B9", bgColor: "#EBF5FB", total: 14, grade: "低風險" },
    { name: "菲律賓", flag: "🇵🇭", color: "#E67E22", bgColor: "#FEF5E7", total: 18, grade: "中等風險" },
    { name: "越南", flag: "🇻🇳", color: "#C0392B", bgColor: "#FDEDEC", total: 21, grade: "中高風險" },
  ];

  const dimensions = [
    { label: "政治穩定性", thai: 3, phil: 3, viet: 2, note: "越南一黨執政反而穩定" },
    { label: "外資政策友善度", thai: 2, phil: 3, viet: 4, note: "越南限制最多" },
    { label: "法治環境", thai: 2, phil: 3, viet: 4, note: "越南透明度最低" },
    { label: "金融市場成熟度", thai: 2, phil: 3, viet: 4, note: "泰國最成熟" },
    { label: "貨幣穩定性", thai: 2, phil: 3, viet: 4, note: "越南盾準固定匯率有風險" },
    { label: "基礎建設品質", thai: 3, phil: 3, viet: 3, note: "菲律賓島嶼地形增加物流成本" },
  ];

  const getScoreColor = (score: number) => {
    if (score <= 2) return { bg: "#E8F8F5", text: "#27AE60" };
    if (score === 3) return { bg: "#FEF9E7", text: "#F39C12" };
    return { bg: "#FDEDEC", text: "#E74C3C" };
  };

  return (
    <div className="bg-white rounded-xl border p-5 my-4">
      <h3 className="text-lg font-bold mb-4 text-center">
        東南亞三國風險評估矩陣
      </h3>
      <p className="text-sm text-gray-500 text-center mb-4">
        1 分 = 風險最低，5 分 = 風險最高
      </p>

      {/* 國家標題列 */}
      <div className="grid grid-cols-[1fr_80px_80px_80px] gap-2 mb-3">
        <div className="text-sm font-medium text-gray-400">風險維度</div>
        {countries.map((c) => (
          <div key={c.name} className="text-center rounded-lg py-2" style={{ backgroundColor: c.bgColor }}>
            <div className="text-lg">{c.flag}</div>
            <div className="text-xs font-bold" style={{ color: c.color }}>{c.name}</div>
          </div>
        ))}
      </div>

      {/* 評分行 */}
      <div className="space-y-1">
        {dimensions.map((dim) => {
          const scores = [dim.thai, dim.phil, dim.viet];
          return (
            <div key={dim.label} className="grid grid-cols-[1fr_80px_80px_80px] gap-2 items-center">
              <div className="text-sm text-gray-700">{dim.label}</div>
              {scores.map((score, i) => {
                const sc = getScoreColor(score);
                return (
                  <div
                    key={i}
                    className="text-center py-1.5 rounded font-bold text-sm"
                    style={{ backgroundColor: sc.bg, color: sc.text }}
                  >
                    {score}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* 加總列 */}
      <div className="grid grid-cols-[1fr_80px_80px_80px] gap-2 mt-3 pt-3 border-t-2">
        <div className="text-sm font-bold text-gray-800">風險總分</div>
        {countries.map((c) => (
          <div key={c.name} className="text-center">
            <div className="text-lg font-bold" style={{ color: c.color }}>{c.total}</div>
            <div className="text-xs" style={{ color: c.color }}>{c.grade}</div>
          </div>
        ))}
      </div>

      {/* 洞察 */}
      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
        <span className="font-bold">關鍵洞察：</span>
        越南的政治穩定性評分反而最低（最好），但外資政策和法治環境是最大弱點。
        風險矩陣提供的是結構化的定性評估，不同分析師可能給出不同評分——這正是國家風險評估的本質。
      </div>
    </div>
  );
}

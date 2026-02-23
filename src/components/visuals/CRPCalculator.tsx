"use client";

/**
 * CRP 計算比較表
 * 展示三國的 CRP 和調整後權益資金成本
 */
export default function CRPCalculator() {
  const data = [
    {
      country: "泰國 🇹🇭",
      rating: "BBB+",
      ratingColor: "#27AE60",
      spread: 1.2,
      volRatio: 1.3,
      crp: 1.56,
      rf: 4.5,
      erp: 6.0,
      ke: 12.06,
      barWidth: 40,
    },
    {
      country: "菲律賓 🇵🇭",
      rating: "BBB",
      ratingColor: "#F39C12",
      spread: 1.8,
      volRatio: 1.4,
      crp: 2.52,
      rf: 4.5,
      erp: 6.0,
      ke: 13.02,
      barWidth: 65,
    },
    {
      country: "越南 🇻🇳",
      rating: "BB+",
      ratingColor: "#E74C3C",
      spread: 2.5,
      volRatio: 1.5,
      crp: 3.75,
      rf: 4.5,
      erp: 6.0,
      ke: 14.25,
      barWidth: 100,
    },
  ];

  return (
    <div className="bg-white rounded-xl border p-5 my-4">
      <h3 className="text-lg font-bold mb-2 text-center">
        三國 CRP 計算比較
      </h3>
      <p className="text-xs text-gray-500 text-center mb-4">
        CRP = 主權利差 × (σ_equity / σ_bond) ｜ k_e = R_f + β(R_m − R_f) + CRP
      </p>

      <div className="space-y-4">
        {data.map((d) => (
          <div key={d.country} className="border rounded-lg p-4">
            {/* 國家標題 */}
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-base">{d.country}</span>
              <span
                className="text-sm font-bold px-2 py-0.5 rounded"
                style={{ backgroundColor: `${d.ratingColor}20`, color: d.ratingColor }}
              >
                {d.rating}
              </span>
            </div>

            {/* 計算步驟 */}
            <div className="text-sm space-y-1 mb-3">
              <div className="text-gray-600">
                主權利差 <span className="font-mono font-bold">{d.spread}%</span>
                {" × "}
                波動度比率 <span className="font-mono font-bold">{d.volRatio}</span>
                {" = "}
                CRP <span className="font-mono font-bold text-blue-600">{d.crp}%</span>
              </div>
              <div className="text-gray-600">
                k_e = {d.rf}% + {d.erp}% + {d.crp}% ={" "}
                <span className="font-mono font-bold text-indigo-700">{d.ke}%</span>
              </div>
            </div>

            {/* CRP 條形圖 */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 w-8">CRP</span>
              <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                <div
                  className="h-full rounded-full flex items-center justify-end pr-2 transition-all"
                  style={{
                    width: `${d.barWidth}%`,
                    backgroundColor: d.ratingColor,
                  }}
                >
                  <span className="text-xs font-bold text-white">{d.crp}%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 底部洞察 */}
      <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
        <span className="font-bold">關鍵洞察：</span>
        越南的 CRP（3.75%）幾乎是泰國（1.56%）的 2.4 倍。
        這意味著同一筆投資在越南需要更高的預期報酬才值得做——CRP 越高，NPV 越低，投資門檻越高。
      </div>
    </div>
  );
}

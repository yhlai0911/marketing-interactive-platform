"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { BRAND } from "@/components/brand/BrandColors";

/**
 * Solnik 1974 投資組合分散化效果圖
 * 呈現隨機選股數量 vs 組合風險（σ），比較國內 vs 國際投資組合
 */

// 模擬風險遞減曲線：σ(n) = floor + (100 - floor) * e^{-decay*(n-1)}
function riskCurve(n: number, floor: number, decay: number): number {
  return floor + (100 - floor) * Math.exp(-decay * (n - 1));
}

const STOCK_COUNTS = [1, 2, 3, 5, 10, 15, 20, 30, 40, 50];

interface CurveConfig {
  label: string;
  floor: number;   // 系統性風險底線 (%)
  decay: number;
  color: string;
  floorLabel: string;
}

const CURVES: CurveConfig[] = [
  {
    label: "純美國投資組合",
    floor: 27,
    decay: 0.12,
    color: BRAND.danger,
    floorLabel: "美國系統性風險 ≈ 27%",
  },
  {
    label: "國際分散投資組合",
    floor: 12,
    decay: 0.15,
    color: BRAND.primary,
    floorLabel: "國際系統性風險 ≈ 12%",
  },
];

export default function PortfolioDiversificationChart() {
  const [hoveredN, setHoveredN] = useState<number | null>(null);

  // SVG 座標參數
  const W = 500, H = 300;
  const padL = 55, padR = 20, padT = 20, padB = 40;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const maxN = 50;
  const maxRisk = 100;

  const toX = (n: number) => padL + (n / maxN) * plotW;
  const toY = (r: number) => padT + ((maxRisk - r) / maxRisk) * plotH;

  const paths = useMemo(() => {
    return CURVES.map((curve) => {
      const finePoints = Array.from({ length: 50 }, (_, i) => i + 1);
      const d = finePoints
        .map((n, i) => {
          const x = toX(n);
          const y = toY(riskCurve(n, curve.floor, curve.decay));
          return `${i === 0 ? "M" : "L"}${x},${y}`;
        })
        .join(" ");
      return { ...curve, d };
    });
  }, []);

  const tooltipData = hoveredN
    ? CURVES.map((c) => ({
        label: c.label,
        color: c.color,
        risk: riskCurve(hoveredN, c.floor, c.decay).toFixed(1),
      }))
    : null;

  return (
    <div className="p-4 rounded-xl border" style={{ borderColor: `${BRAND.primary}30` }}>
      <h3 className="text-base font-bold mb-3 text-center" style={{ color: BRAND.primary }}>
        Solnik (1974)：國際分散化降低投資組合風險
      </h3>

      {/* SVG 圖表 */}
      <div className="flex justify-center">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[520px]">
          {/* Y 軸網格 + 標籤 */}
          {[0, 20, 40, 60, 80, 100].map((r) => (
            <g key={`y-${r}`}>
              <line x1={padL} y1={toY(r)} x2={W - padR} y2={toY(r)} stroke="#e5e7eb" strokeWidth={0.5} />
              <text x={padL - 8} y={toY(r) + 4} textAnchor="end" fontSize={10} fill="#6b7280">
                {r}%
              </text>
            </g>
          ))}

          {/* X 軸標籤 */}
          {[1, 10, 20, 30, 40, 50].map((n) => (
            <text key={`x-${n}`} x={toX(n)} y={H - 8} textAnchor="middle" fontSize={10} fill="#6b7280">
              {n}
            </text>
          ))}

          {/* 系統性風險底線（虛線） */}
          {CURVES.map((c) => (
            <g key={`floor-${c.label}`}>
              <line
                x1={padL}
                y1={toY(c.floor)}
                x2={W - padR}
                y2={toY(c.floor)}
                stroke={c.color}
                strokeWidth={1}
                strokeDasharray="4 3"
                opacity={0.5}
              />
              <text x={W - padR - 2} y={toY(c.floor) - 4} textAnchor="end" fontSize={8} fill={c.color}>
                {c.floorLabel}
              </text>
            </g>
          ))}

          {/* 曲線 */}
          {paths.map((p) => (
            <motion.path
              key={p.label}
              d={p.d}
              fill="none"
              stroke={p.color}
              strokeWidth={2.5}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          ))}

          {/* Hover 指示線 */}
          {hoveredN && (
            <line
              x1={toX(hoveredN)}
              y1={padT}
              x2={toX(hoveredN)}
              y2={H - padB}
              stroke="#9ca3af"
              strokeWidth={1}
              strokeDasharray="3 2"
            />
          )}

          {/* Hover 點 */}
          {hoveredN &&
            CURVES.map((c) => (
              <circle
                key={`dot-${c.label}`}
                cx={toX(hoveredN)}
                cy={toY(riskCurve(hoveredN, c.floor, c.decay))}
                r={4}
                fill={c.color}
                stroke="white"
                strokeWidth={1.5}
              />
            ))}

          {/* 互動區域（隱形 rect 捕捉滑鼠） */}
          <rect
            x={padL}
            y={padT}
            width={plotW}
            height={plotH}
            fill="transparent"
            onMouseMove={(e) => {
              const svg = e.currentTarget.ownerSVGElement;
              if (!svg) return;
              const pt = svg.createSVGPoint();
              pt.x = e.clientX;
              pt.y = e.clientY;
              const svgPt = pt.matrixTransform(svg.getScreenCTM()?.inverse());
              const n = Math.round(((svgPt.x - padL) / plotW) * maxN);
              if (n >= 1 && n <= 50) setHoveredN(n);
            }}
            onMouseLeave={() => setHoveredN(null)}
          />

          {/* 軸標題 */}
          <text x={padL + plotW / 2} y={H - 0} textAnchor="middle" fontSize={11} fill="#374151">
            投資組合中的股票數量
          </text>
          <text
            x={12}
            y={padT + plotH / 2}
            textAnchor="middle"
            fontSize={11}
            fill="#374151"
            transform={`rotate(-90, 12, ${padT + plotH / 2})`}
          >
            組合風險 (%)
          </text>
        </svg>
      </div>

      {/* Hover Tooltip */}
      {tooltipData && hoveredN && (
        <div className="flex justify-center mt-2">
          <div className="inline-flex items-center gap-4 text-xs px-3 py-1.5 rounded-lg bg-gray-50 border">
            <span className="font-medium">{hoveredN} 支股票</span>
            {tooltipData.map((t) => (
              <span key={t.label} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: t.color }} />
                {t.label}：{t.risk}%
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 圖例 */}
      <div className="flex justify-center gap-6 mt-3">
        {CURVES.map((c) => (
          <div key={c.label} className="flex items-center gap-1.5 text-xs">
            <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: c.color }} />
            <span>{c.label}</span>
          </div>
        ))}
      </div>

      {/* 分散化效果摘要 */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="p-3 rounded-lg text-center" style={{ backgroundColor: `${BRAND.danger}10` }}>
          <div className="text-xs text-gray-500 mb-1">純美國投資組合</div>
          <div className="text-2xl font-bold" style={{ color: BRAND.danger }}>~27%</div>
          <div className="text-xs text-gray-500">系統性風險底線</div>
        </div>
        <div className="p-3 rounded-lg text-center" style={{ backgroundColor: `${BRAND.primary}10` }}>
          <div className="text-xs text-gray-500 mb-1">國際分散投資組合</div>
          <div className="text-2xl font-bold" style={{ color: BRAND.primary }}>~12%</div>
          <div className="text-xs text-gray-500">系統性風險底線</div>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center mt-3">
        資料來源：Solnik (1974), &quot;Why Not Diversify Internationally Rather Than Domestically?&quot;, Financial Analysts Journal
      </p>
    </div>
  );
}

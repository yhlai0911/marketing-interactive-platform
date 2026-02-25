"use client";

import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { BRAND } from "@/components/brand/BrandColors";

interface Brand {
  id: string;
  name: string;
  x: number; // 0-100 (price low->high)
  y: number; // 0-100 (digital low->high)
  color: string;
  star?: boolean;
}

const INITIAL_BRANDS: Brand[] = [
  { id: "fucheng", name: "富誠 FinTech", x: 50, y: 82, color: BRAND.story, star: true },
  { id: "wantai", name: "萬泰金控", x: 78, y: 25, color: BRAND.danger },
  { id: "bankA", name: "大型銀行 A", x: 72, y: 50, color: BRAND.neutral },
  { id: "netbank", name: "純網銀 B", x: 30, y: 85, color: BRAND.accent },
  { id: "insureC", name: "傳統保險 C", x: 48, y: 20, color: BRAND.neutral },
];

const MAP_W = 400;
const MAP_H = 320;
const PAD = 40;

export default function PerceptualMap() {
  const [brands, setBrands] = useState<Brand[]>(INITIAL_BRANDS);
  const [dragging, setDragging] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const toSvgX = (pct: number) => PAD + (pct / 100) * (MAP_W - PAD * 2);
  const toSvgY = (pct: number) => MAP_H - PAD - (pct / 100) * (MAP_H - PAD * 2);
  const fromSvgX = (px: number) => Math.max(0, Math.min(100, ((px - PAD) / (MAP_W - PAD * 2)) * 100));
  const fromSvgY = (px: number) => Math.max(0, Math.min(100, ((MAP_H - PAD - px) / (MAP_H - PAD * 2)) * 100));

  const handlePointerDown = (id: string) => setDragging(id);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!dragging || !svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const scaleX = MAP_W / rect.width;
      const scaleY = MAP_H / rect.height;
      const px = (e.clientX - rect.left) * scaleX;
      const py = (e.clientY - rect.top) * scaleY;
      setBrands((prev) =>
        prev.map((b) => (b.id === dragging ? { ...b, x: fromSvgX(px), y: fromSvgY(py) } : b))
      );
    },
    [dragging]
  );

  const handlePointerUp = () => setDragging(null);

  const reset = () => setBrands(INITIAL_BRANDS);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <h4 className="text-center font-bold text-lg mb-1" style={{ color: BRAND.primary }}>
        知覺定位圖
      </h4>
      <p className="text-center text-xs text-gray-500 mb-4">
        拖曳品牌圓點來探索不同定位策略
      </p>

      <div className="flex justify-center mb-3">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          className="w-full max-w-[480px] bg-white rounded-xl border border-gray-200 shadow-sm select-none touch-none"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {/* Grid lines */}
          {[25, 50, 75].map((v) => (
            <g key={v}>
              <line x1={toSvgX(v)} y1={PAD} x2={toSvgX(v)} y2={MAP_H - PAD} stroke="#f3f4f6" strokeWidth="1" />
              <line x1={PAD} y1={toSvgY(v)} x2={MAP_W - PAD} y2={toSvgY(v)} stroke="#f3f4f6" strokeWidth="1" />
            </g>
          ))}

          {/* Axes */}
          <line x1={PAD} y1={MAP_H - PAD} x2={MAP_W - PAD} y2={MAP_H - PAD} stroke="#9ca3af" strokeWidth="1.5" />
          <line x1={PAD} y1={PAD} x2={PAD} y2={MAP_H - PAD} stroke="#9ca3af" strokeWidth="1.5" />
          {/* Axis arrows */}
          <polygon points={`${MAP_W - PAD},${MAP_H - PAD} ${MAP_W - PAD - 6},${MAP_H - PAD - 4} ${MAP_W - PAD - 6},${MAP_H - PAD + 4}`} fill="#9ca3af" />
          <polygon points={`${PAD},${PAD} ${PAD - 4},${PAD + 6} ${PAD + 4},${PAD + 6}`} fill="#9ca3af" />

          {/* Axis labels */}
          <text x={MAP_W / 2} y={MAP_H - 8} textAnchor="middle" fontSize="11" fill="#6b7280">
            價格（低 → 高）
          </text>
          <text x={12} y={MAP_H / 2} textAnchor="middle" fontSize="11" fill="#6b7280" transform={`rotate(-90, 12, ${MAP_H / 2})`}>
            數位化程度（低 → 高）
          </text>

          {/* Brand dots */}
          {brands.map((b) => {
            const cx = toSvgX(b.x);
            const cy = toSvgY(b.y);
            return (
              <g
                key={b.id}
                onPointerDown={() => handlePointerDown(b.id)}
                style={{ cursor: "grab" }}
              >
                <circle cx={cx} cy={cy} r={dragging === b.id ? 16 : 14} fill={`${b.color}25`} stroke={b.color} strokeWidth={2} />
                <circle cx={cx} cy={cy} r={4} fill={b.color} />
                {b.star && (
                  <text x={cx} y={cy + 1.5} textAnchor="middle" fontSize="8" fill={b.color} fontWeight="bold">
                    ★
                  </text>
                )}
                <text
                  x={cx}
                  y={cy - 18}
                  textAnchor="middle"
                  fontSize="10"
                  fill={b.color}
                  fontWeight="600"
                >
                  {b.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend + Reset */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
        {brands.map((b) => (
          <div key={b.id} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: b.color }} />
            <span className="text-xs text-gray-500">{b.name}</span>
          </div>
        ))}
        <button
          onClick={reset}
          className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          重置位置
        </button>
      </div>

      {/* Insight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-sm p-3 rounded-lg"
        style={{ backgroundColor: `${BRAND.story}10`, color: "#374151" }}
      >
        <span className="font-bold" style={{ color: BRAND.story }}>定位洞察：</span>{" "}
        富誠 FinTech 佔據「中等價格 + 高數位化」的空白位置，與萬泰金控的「高價格 + 低數位化」形成鮮明對比。
        純網銀 B 雖然數位化高但價格更低，可做為合作或差異化觀察對象。
      </motion.div>
    </motion.div>
  );
}

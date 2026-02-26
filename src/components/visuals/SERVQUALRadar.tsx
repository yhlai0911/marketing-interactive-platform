"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";

const BRAND = {
  primary: "#1A3C5E",
  accent: "#C9A84C",
  story: "#2A6B5A",
  danger: "#C0392B",
  neutral: "#6B7280",
};

interface Dimension {
  id: string;
  label: string;
  fullLabel: string;
  expectation: number;
  perception: number;
  complaintPct: number;
  description: string;
  example: string;
}

const DIMENSIONS: Dimension[] = [
  {
    id: "tangibles",
    label: "有形性",
    fullLabel: "Tangibles（有形性）",
    expectation: 9,
    perception: 5,
    complaintPct: 35,
    description: "實體設施、設備、人員外表、溝通材料",
    example: "App 介面老舊、報表格式不清楚",
  },
  {
    id: "reliability",
    label: "可靠性",
    fullLabel: "Reliability（可靠性）",
    expectation: 8,
    perception: 7,
    complaintPct: 12,
    description: "準確、可靠地執行承諾服務的能力",
    example: "交易結算正確率 99.8%",
  },
  {
    id: "responsiveness",
    label: "回應性",
    fullLabel: "Responsiveness（回應性）",
    expectation: 8,
    perception: 4,
    complaintPct: 28,
    description: "幫助顧客並提供迅速服務的意願",
    example: "客服回覆慢、問題處理超過 48 小時",
  },
  {
    id: "assurance",
    label: "保證性",
    fullLabel: "Assurance（保證性）",
    expectation: 7,
    perception: 6,
    complaintPct: 7,
    description: "員工的知識、禮貌及傳達信任的能力",
    example: "顧問持有 CFP 證照、說明清楚",
  },
  {
    id: "empathy",
    label: "同理心",
    fullLabel: "Empathy（同理心）",
    expectation: 8,
    perception: 5,
    complaintPct: 18,
    description: "關心顧客並提供個人化服務",
    example: "缺乏客製化建議、通知過於制式",
  },
];

function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number
) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

export default function SERVQUALRadar() {
  const [hoveredDim, setHoveredDim] = useState<string | null>(null);
  const [showGap, setShowGap] = useState(true);
  const hovered = DIMENSIONS.find((d) => d.id === hoveredDim);

  const cx = 160;
  const cy = 160;
  const maxR = 120;
  const maxVal = 10;
  const angleStep = 360 / DIMENSIONS.length;

  const gridLevels = [2, 4, 6, 8, 10];

  const getPoint = useMemo(
    () =>
      (dimIndex: number, value: number) => {
        const angle = dimIndex * angleStep;
        const r = (value / maxVal) * maxR;
        return polarToCartesian(cx, cy, r, angle);
      },
    [angleStep]
  );

  const expectationPoints = DIMENSIONS.map((_, i) =>
    getPoint(i, DIMENSIONS[i].expectation)
  );
  const perceptionPoints = DIMENSIONS.map((_, i) =>
    getPoint(i, DIMENSIONS[i].perception)
  );

  const toPathStr = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + " Z";

  return (
    <div className="p-4 space-y-4 max-w-xl mx-auto">
      <h3
        className="text-lg font-bold text-center"
        style={{ color: BRAND.primary }}
      >
        SERVQUAL 服務品質五維度
      </h3>
      <p className="text-xs text-center" style={{ color: BRAND.neutral }}>
        Hover 各維度查看缺口分析 | 紅色區域 = 期望與感知的落差
      </p>

      {/* Toggle */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowGap(!showGap)}
          className="px-3 py-1 rounded-full text-xs font-medium transition-colors"
          style={{
            backgroundColor: showGap ? `${BRAND.danger}15` : "#f3f4f6",
            color: showGap ? BRAND.danger : BRAND.neutral,
            border: `1px solid ${showGap ? BRAND.danger : "#e5e7eb"}`,
          }}
        >
          {showGap ? "隱藏缺口區域" : "顯示缺口區域"}
        </button>
      </div>

      {/* Radar Chart SVG */}
      <div className="flex justify-center">
        <svg viewBox="0 0 320 320" className="w-full max-w-[320px]">
          {/* Grid circles (pentagon) */}
          {gridLevels.map((level) => {
            const pts = DIMENSIONS.map((_, i) => getPoint(i, level));
            return (
              <polygon
                key={level}
                points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth={0.5}
              />
            );
          })}

          {/* Axis lines */}
          {DIMENSIONS.map((_, i) => {
            const end = getPoint(i, maxVal);
            return (
              <line
                key={`axis-${i}`}
                x1={cx}
                y1={cy}
                x2={end.x}
                y2={end.y}
                stroke="#e5e7eb"
                strokeWidth={0.5}
              />
            );
          })}

          {/* Gap area (red) */}
          {showGap && (
            <motion.path
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.15 }}
              d={
                toPathStr(expectationPoints).replace(" Z", "") +
                " " +
                perceptionPoints
                  .slice()
                  .reverse()
                  .map(
                    (p, i) => `${i === 0 ? "L" : "L"}${p.x},${p.y}`
                  )
                  .join(" ") +
                " Z"
              }
              fill={BRAND.danger}
            />
          )}

          {/* Expectation polygon */}
          <motion.polygon
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            points={expectationPoints
              .map((p) => `${p.x},${p.y}`)
              .join(" ")}
            fill={`${BRAND.accent}15`}
            stroke={BRAND.accent}
            strokeWidth={2}
            strokeDasharray="6 3"
          />

          {/* Perception polygon */}
          <motion.polygon
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            points={perceptionPoints
              .map((p) => `${p.x},${p.y}`)
              .join(" ")}
            fill={`${BRAND.primary}10`}
            stroke={BRAND.primary}
            strokeWidth={2}
          />

          {/* Data points - Expectation */}
          {expectationPoints.map((p, i) => (
            <circle
              key={`e-${i}`}
              cx={p.x}
              cy={p.y}
              r={3}
              fill={BRAND.accent}
            />
          ))}

          {/* Data points - Perception */}
          {perceptionPoints.map((p, i) => (
            <circle
              key={`p-${i}`}
              cx={p.x}
              cy={p.y}
              r={3}
              fill={BRAND.primary}
            />
          ))}

          {/* Labels */}
          {DIMENSIONS.map((dim, i) => {
            const labelPos = getPoint(i, maxVal + 1.5);
            const isHovered = hoveredDim === dim.id;
            return (
              <g
                key={dim.id}
                onMouseEnter={() => setHoveredDim(dim.id)}
                onMouseLeave={() => setHoveredDim(null)}
                onClick={() =>
                  setHoveredDim(hoveredDim === dim.id ? null : dim.id)
                }
                style={{ cursor: "pointer" }}
              >
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={isHovered ? 12 : 11}
                  fontWeight={isHovered ? "bold" : "normal"}
                  fill={isHovered ? BRAND.danger : BRAND.primary}
                >
                  {dim.label}
                </text>
                {/* Invisible hitbox */}
                <circle
                  cx={labelPos.x}
                  cy={labelPos.y}
                  r={18}
                  fill="transparent"
                />
              </g>
            );
          })}

          {/* Scale labels */}
          {gridLevels.map((level) => (
            <text
              key={`lbl-${level}`}
              x={cx + 4}
              y={cy - (level / maxVal) * maxR + 3}
              fontSize={8}
              fill={BRAND.neutral}
            >
              {level}
            </text>
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 text-[11px]">
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-5 h-0.5"
            style={{
              borderTop: `2px dashed ${BRAND.accent}`,
            }}
          />
          <span style={{ color: BRAND.accent }}>客戶期望</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-5 h-0.5"
            style={{
              borderTop: `2px solid ${BRAND.primary}`,
            }}
          />
          <span style={{ color: BRAND.primary }}>實際感知</span>
        </span>
        {showGap && (
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block w-3 h-3 rounded-sm"
              style={{ backgroundColor: `${BRAND.danger}25` }}
            />
            <span style={{ color: BRAND.danger }}>服務缺口</span>
          </span>
        )}
      </div>

      {/* Hover detail */}
      {hovered && (
        <motion.div
          key={hovered.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg p-3 space-y-2"
          style={{
            backgroundColor: `${BRAND.primary}08`,
            border: `1px solid ${BRAND.primary}20`,
          }}
        >
          <div className="flex items-center justify-between">
            <span
              className="text-sm font-bold"
              style={{ color: BRAND.primary }}
            >
              {hovered.fullLabel}
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{
                backgroundColor: `${BRAND.danger}15`,
                color: BRAND.danger,
              }}
            >
              客訴佔比 {hovered.complaintPct}%
            </span>
          </div>
          <p className="text-xs" style={{ color: BRAND.neutral }}>
            {hovered.description}
          </p>
          <div className="flex gap-4 text-xs">
            <span>
              <span className="font-medium" style={{ color: BRAND.accent }}>
                期望：
              </span>
              {hovered.expectation}/10
            </span>
            <span>
              <span className="font-medium" style={{ color: BRAND.primary }}>
                感知：
              </span>
              {hovered.perception}/10
            </span>
            <span>
              <span className="font-medium" style={{ color: BRAND.danger }}>
                缺口：
              </span>
              {hovered.expectation - hovered.perception}
            </span>
          </div>
          <p
            className="text-[11px] italic"
            style={{ color: BRAND.danger }}
          >
            富誠案例：{hovered.example}
          </p>
        </motion.div>
      )}

      {/* Gap ranking */}
      <div className="space-y-1">
        <div
          className="text-xs font-medium"
          style={{ color: BRAND.primary }}
        >
          缺口排行（由大到小）：
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {[...DIMENSIONS]
            .sort(
              (a, b) =>
                b.expectation - b.perception - (a.expectation - a.perception)
            )
            .map((dim, i) => {
              const gap = dim.expectation - dim.perception;
              return (
                <motion.div
                  key={dim.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08 }}
                  className="px-2 py-1 rounded-md text-[11px] font-medium"
                  style={{
                    backgroundColor:
                      gap >= 4
                        ? `${BRAND.danger}15`
                        : gap >= 2
                          ? `${BRAND.accent}15`
                          : `${BRAND.story}15`,
                    color:
                      gap >= 4
                        ? BRAND.danger
                        : gap >= 2
                          ? BRAND.accent
                          : BRAND.story,
                  }}
                >
                  {dim.label} (−{gap})
                </motion.div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

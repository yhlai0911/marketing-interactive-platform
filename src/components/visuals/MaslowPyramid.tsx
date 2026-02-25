"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND } from "@/components/brand/BrandColors";

const levels = [
  {
    name: "生理需求",
    desc: "基本生存",
    finance: "活存 / 薪轉帳戶",
    color: BRAND.primary,
    opacity: 1.0,
  },
  {
    name: "安全需求",
    desc: "保障穩定",
    finance: "壽險 / 意外險",
    color: BRAND.primary,
    opacity: 0.82,
  },
  {
    name: "社會需求",
    desc: "歸屬感",
    finance: "房貸 / 教育基金",
    color: BRAND.primary,
    opacity: 0.64,
  },
  {
    name: "尊重需求",
    desc: "被認可",
    finance: "股票 / 基金投資組合",
    color: BRAND.primary,
    opacity: 0.46,
  },
  {
    name: "自我實現",
    desc: "追求理想",
    finance: "ESG 基金 / 公益信託",
    color: BRAND.primary,
    opacity: 0.30,
  },
];

export default function MaslowPyramid() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <h4 className="text-center font-bold text-lg mb-1" style={{ color: BRAND.primary }}>
        Maslow 需求層次 x 金融商品
      </h4>
      <p className="text-center text-xs text-gray-500 mb-5">
        點擊各層查看對應的金融商品
      </p>

      <div className="flex gap-4 items-start">
        {/* Pyramid SVG */}
        <div className="flex-1">
          <svg viewBox="0 0 300 260" className="w-full" style={{ maxWidth: 360 }}>
            {levels.slice().reverse().map((lvl, ri) => {
              const i = 4 - ri; // original index (0=bottom)
              const py = 10 + ri * 48;
              const wTop = 60 + ri * 50;
              const wBot = 60 + (ri + 1) * 50;
              const cx = 150;
              const x1t = cx - wTop / 2;
              const x2t = cx + wTop / 2;
              const x1b = cx - wBot / 2;
              const x2b = cx + wBot / 2;
              const yb = py + 44;
              const isActive = active === i;

              return (
                <motion.g
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.15, duration: 0.4 }}
                  onClick={() => setActive(isActive ? null : i)}
                  style={{ cursor: "pointer" }}
                >
                  <polygon
                    points={`${x1t},${py} ${x2t},${py} ${x2b},${yb} ${x1b},${yb}`}
                    fill={lvl.color}
                    opacity={isActive ? 1 : lvl.opacity}
                    stroke="white"
                    strokeWidth="2"
                  />
                  <text
                    x={cx}
                    y={py + 20}
                    textAnchor="middle"
                    fill="white"
                    fontSize="13"
                    fontWeight="bold"
                  >
                    {lvl.name}
                  </text>
                  <text
                    x={cx}
                    y={py + 35}
                    textAnchor="middle"
                    fill="white"
                    fontSize="10"
                    opacity={0.85}
                  >
                    {lvl.desc}
                  </text>
                </motion.g>
              );
            })}
          </svg>
        </div>

        {/* Right panel: financial example */}
        <div className="w-44 flex-shrink-0 pt-2">
          <AnimatePresence mode="wait">
            {active !== null ? (
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.25 }}
                className="p-3 rounded-lg border-l-4"
                style={{
                  borderLeftColor: levels[active].color,
                  backgroundColor: `${levels[active].color}10`,
                }}
              >
                <div className="font-bold text-sm" style={{ color: levels[active].color }}>
                  {levels[active].name}
                </div>
                <div className="text-xs text-gray-500 mt-1 mb-2">{levels[active].desc}</div>
                <div className="text-xs font-semibold" style={{ color: BRAND.accent }}>
                  對應金融商品
                </div>
                <div className="text-sm font-medium mt-0.5" style={{ color: "#374151" }}>
                  {levels[active].finance}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 rounded-lg bg-gray-50 text-center"
              >
                <div className="text-xs text-gray-400">
                  點擊左側金字塔的任一層級
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom insight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-4 text-center text-sm p-3 rounded-lg"
        style={{ backgroundColor: `${BRAND.accent}12`, color: "#374151" }}
      >
        <span className="font-bold" style={{ color: BRAND.accent }}>思考：</span>
        你的客戶目前在哪一層？他們需要的是「安全感」還是「自我實現」？
      </motion.div>
    </motion.div>
  );
}

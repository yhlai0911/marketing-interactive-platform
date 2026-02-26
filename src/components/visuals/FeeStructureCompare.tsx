"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BRAND = {
  primary: "#1A3C5E",
  accent: "#C9A84C",
  story: "#2A6B5A",
  danger: "#C0392B",
  neutral: "#6B7280",
};

interface FeeItem {
  label: string;
  fuCheng: string;
  fuChengVal: number; // for bar width (max scale)
  wantai: string;
  wantaiVal: number;
  color: string;
}

const FEE_ITEMS: FeeItem[] = [
  {
    label: "手續費",
    fuCheng: "0%",
    fuChengVal: 0,
    wantai: "0%",
    wantaiVal: 0,
    color: BRAND.neutral,
  },
  {
    label: "平台顧問費/年",
    fuCheng: "0.3%",
    fuChengVal: 30,
    wantai: "0.6%",
    wantaiVal: 60,
    color: BRAND.primary,
  },
  {
    label: "ETF 產品內扣費",
    fuCheng: "0.05%-0.15%",
    fuChengVal: 15,
    wantai: "0.15%-0.40%",
    wantaiVal: 40,
    color: BRAND.accent,
  },
];

interface ServiceItem {
  text: string;
}

const FUCHENG_SERVICES: ServiceItem[] = [
  { text: "CFP 年度健檢" },
  { text: "退休進度追蹤" },
  { text: "白話文教育" },
  { text: "退場機制" },
];

const WANTAI_SERVICES: ServiceItem[] = [
  { text: "FAQ" },
  { text: "客服專線（週一至週五）" },
];

export default function FeeStructureCompare() {
  const [animated, setAnimated] = useState(false);
  const [showServices, setShowServices] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Title */}
      <h3 className="text-base font-bold mb-1" style={{ color: BRAND.primary }}>
        費率結構全面比較
      </h3>
      <p className="text-xs mb-5" style={{ color: BRAND.neutral }}>
        富誠·安退 vs 萬泰智投 Pro——同樣「零手續費」，真正的持有成本差多少？
      </p>

      {/* Animate trigger */}
      {!animated && (
        <div className="text-center mb-4">
          <button
            onClick={() => setAnimated(true)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{ backgroundColor: BRAND.primary, color: "#fff" }}
          >
            開始比較
          </button>
        </div>
      )}

      {/* Two-column comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* FuCheng column */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
          className="rounded-xl p-4"
          style={{
            border: `2px solid ${BRAND.story}`,
            backgroundColor: `${BRAND.story}06`,
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold"
              style={{ backgroundColor: BRAND.story, color: "#fff" }}
            >
              富
            </span>
            <div>
              <p className="text-sm font-bold" style={{ color: BRAND.story }}>
                富誠·安退
              </p>
              <p className="text-xs" style={{ color: BRAND.neutral }}>
                價值定價策略
              </p>
            </div>
          </div>

          {/* Fee bars */}
          <div className="space-y-3">
            {FEE_ITEMS.map((item, i) => (
              <div key={item.label}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs" style={{ color: BRAND.neutral }}>
                    {item.label}
                  </span>
                  <span className="text-xs font-bold" style={{ color: BRAND.story }}>
                    {item.fuCheng}
                  </span>
                </div>
                <div
                  className="w-full h-4 rounded-full overflow-hidden"
                  style={{ backgroundColor: "#f3f4f6" }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: BRAND.story }}
                    initial={{ width: 0 }}
                    animate={{
                      width: animated ? `${item.fuChengVal}%` : "0%",
                    }}
                    transition={{
                      delay: 0.3 + i * 0.2,
                      duration: 0.6,
                      ease: "easeOut",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <AnimatePresence>
            {animated && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-4 pt-3 text-center"
                style={{ borderTop: `2px dashed ${BRAND.story}40` }}
              >
                <p className="text-xs" style={{ color: BRAND.neutral }}>
                  總持有成本
                </p>
                <p className="text-2xl font-black" style={{ color: BRAND.story }}>
                  0.35%-0.45%
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Wantai column */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 100 }}
          className="rounded-xl p-4"
          style={{
            border: `2px solid ${BRAND.danger}`,
            backgroundColor: `${BRAND.danger}06`,
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold"
              style={{ backgroundColor: BRAND.danger, color: "#fff" }}
            >
              萬
            </span>
            <div>
              <p className="text-sm font-bold" style={{ color: BRAND.danger }}>
                萬泰智投 Pro
              </p>
              <p className="text-xs" style={{ color: BRAND.neutral }}>
                低價搶市策略
              </p>
            </div>
          </div>

          {/* Fee bars */}
          <div className="space-y-3">
            {FEE_ITEMS.map((item, i) => (
              <div key={item.label}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs" style={{ color: BRAND.neutral }}>
                    {item.label}
                  </span>
                  <span className="text-xs font-bold" style={{ color: BRAND.danger }}>
                    {item.wantai}
                  </span>
                </div>
                <div
                  className="w-full h-4 rounded-full overflow-hidden"
                  style={{ backgroundColor: "#f3f4f6" }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: BRAND.danger }}
                    initial={{ width: 0 }}
                    animate={{
                      width: animated ? `${item.wantaiVal}%` : "0%",
                    }}
                    transition={{
                      delay: 0.3 + i * 0.2,
                      duration: 0.6,
                      ease: "easeOut",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <AnimatePresence>
            {animated && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-4 pt-3 text-center"
                style={{ borderTop: `2px dashed ${BRAND.danger}40` }}
              >
                <p className="text-xs" style={{ color: BRAND.neutral }}>
                  總持有成本
                </p>
                <p className="text-2xl font-black" style={{ color: BRAND.danger }}>
                  0.75%-1.00%
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Truth reveal */}
      <AnimatePresence>
        {animated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            className="rounded-xl p-4 mb-6 text-center"
            style={{
              backgroundColor: `${BRAND.accent}12`,
              border: `2px solid ${BRAND.accent}`,
            }}
          >
            <p className="text-sm font-bold mb-1" style={{ color: BRAND.accent }}>
              真相
            </p>
            <p className="text-base font-black" style={{ color: BRAND.primary }}>
              富誠的總持有成本比萬泰便宜近一半
            </p>
            <p className="text-xs mt-1" style={{ color: BRAND.neutral }}>
              同樣標榜「零手續費」，但平台顧問費和 ETF 內扣費才是真正的長期成本
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Services toggle */}
      <div className="text-center mb-4">
        <button
          onClick={() => setShowServices(!showServices)}
          className="px-4 py-2 rounded-lg text-xs font-medium transition-all"
          style={{
            backgroundColor: showServices ? BRAND.primary : "#f3f4f6",
            color: showServices ? "#fff" : BRAND.neutral,
          }}
        >
          {showServices ? "收合附加服務" : "查看附加服務對比"}
        </button>
      </div>

      <AnimatePresence>
        {showServices && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* FuCheng services */}
              <div
                className="rounded-lg p-3"
                style={{ backgroundColor: `${BRAND.story}08`, border: `1px solid ${BRAND.story}30` }}
              >
                <p className="text-xs font-bold mb-2" style={{ color: BRAND.story }}>
                  富誠·安退 附加服務
                </p>
                {FUCHENG_SERVICES.map((s, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="text-xs flex items-center gap-2 mt-1"
                    style={{ color: "#374151" }}
                  >
                    <span
                      className="w-4 h-4 rounded-full flex items-center justify-center text-white shrink-0"
                      style={{ backgroundColor: BRAND.story, fontSize: "0.55rem" }}
                    >
                      ✓
                    </span>
                    {s.text}
                  </motion.p>
                ))}
              </div>
              {/* Wantai services */}
              <div
                className="rounded-lg p-3"
                style={{ backgroundColor: `${BRAND.danger}08`, border: `1px solid ${BRAND.danger}30` }}
              >
                <p className="text-xs font-bold mb-2" style={{ color: BRAND.danger }}>
                  萬泰智投 Pro 附加服務
                </p>
                {WANTAI_SERVICES.map((s, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="text-xs flex items-center gap-2 mt-1"
                    style={{ color: "#374151" }}
                  >
                    <span
                      className="w-4 h-4 rounded-full flex items-center justify-center text-white shrink-0"
                      style={{ backgroundColor: BRAND.neutral, fontSize: "0.55rem" }}
                    >
                      -
                    </span>
                    {s.text}
                  </motion.p>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

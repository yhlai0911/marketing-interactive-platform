"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND } from "@/components/brand/BrandColors";

export default function ExchangeRateDemo() {
  const [step, setStep] = useState(0);

  // 0: 初始, 1: 貶值前, 2: 貶值後
  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 500),
      setTimeout(() => setStep(2), 2500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const beforeRate = 0.21; // 1 JPY = 0.21 TWD
  const afterRate = 0.189; // 貶值 10%
  const jpy = 500;
  const beforeTWD = jpy * beforeRate; // 105
  const afterTWD = jpy * afterRate; // 94.5
  const loss = beforeTWD - afterTWD; // 10.5

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <h4
        className="text-center font-bold text-lg mb-5"
        style={{ color: BRAND.primary }}
      >
        匯率貶值對營收的影響
      </h4>

      {/* 珍奶圖示 */}
      <div className="text-center mb-4 text-4xl">🧋</div>
      <p className="text-center text-gray-600 text-sm mb-6">
        東京店一杯珍奶 = ¥{jpy}
      </p>

      {/* 兩種情境對比 */}
      <div className="grid grid-cols-2 gap-4">
        {/* 貶值前 */}
        <AnimatePresence>
          {step >= 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-xl p-4 border-2 text-center"
              style={{ borderColor: BRAND.story, backgroundColor: `${BRAND.story}08` }}
            >
              <div className="text-xs text-gray-500 mb-1">貶值前</div>
              <div className="text-sm text-gray-600">¥1 = NT${beforeRate}</div>
              <div
                className="text-2xl font-bold mt-2"
                style={{ color: BRAND.story }}
              >
                NT${beforeTWD}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 貶值後 */}
        <AnimatePresence>
          {step >= 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-xl p-4 border-2 text-center"
              style={{ borderColor: BRAND.danger, backgroundColor: `${BRAND.danger}08` }}
            >
              <div className="text-xs text-gray-500 mb-1">日圓貶 10%</div>
              <div className="text-sm text-gray-600">¥1 = NT${afterRate}</div>
              <div
                className="text-2xl font-bold mt-2"
                style={{ color: BRAND.danger }}
              >
                NT${afterTWD}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 損失提示 */}
      <AnimatePresence>
        {step >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4 p-3 rounded-lg text-center text-sm"
            style={{ backgroundColor: `${BRAND.danger}10`, color: BRAND.danger }}
          >
            <span className="font-bold">每杯損失 NT${loss.toFixed(1)}</span>
            <span className="text-gray-500 ml-2">
              （利潤蒸發，但成本不變）
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

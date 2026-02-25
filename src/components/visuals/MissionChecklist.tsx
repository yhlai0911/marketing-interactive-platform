"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND } from "@/components/brand/BrandColors";

interface Task {
  id: string;
  title: string;
  hint: string;
}

interface MissionChecklistProps {
  title?: string;
  tasks?: Task[];
}

const DEFAULT_TASKS: Task[] = [
  { id: "t1", title: "從四指標評估法中選出最優區隔", hint: "比較市場規模、成長潛力、競爭強度和可接觸性，為每個區隔打分後排序。" },
  { id: "t2", title: "決定採用哪一種目標市場策略", hint: "根據團隊資源、品牌定位與市場分析結果，從五種策略中選擇最適合的一種。" },
  { id: "t3", title: "撰寫定位宣言草稿", hint: "格式：對於（目標客群），（品牌名）是（品類）中唯一能（差異化利益）的品牌，因為（支持理由）。" },
  { id: "t4", title: "在知覺圖上標出競品與自身位置", hint: "選擇兩個最能區分市場的維度（如：價格 vs 數位化程度），將主要競品和自己標示在 2D 圖上。" },
  { id: "t5", title: "檢查是否落入三大定位陷阱", hint: "逐一檢視：定位不足（沒特色）、定位過度（太窄）、定位混淆（前後矛盾）。" },
];

export default function MissionChecklist({ title, tasks }: MissionChecklistProps) {
  const items = tasks ?? DEFAULT_TASKS;
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const progress = items.length > 0 ? (checked.size / items.length) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <h4 className="text-center font-bold text-lg mb-1" style={{ color: BRAND.accent }}>
        {title ?? "本週任務清單"}
      </h4>
      <p className="text-center text-xs text-gray-500 mb-5">
        逐項完成並打勾，點擊展開提示
      </p>

      <div className="space-y-2 mb-5">
        {items.map((task, i) => {
          const done = checked.has(task.id);
          const isOpen = expanded === task.id;
          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="rounded-lg border overflow-hidden"
              style={{ borderColor: done ? BRAND.story : "#e5e7eb" }}
            >
              <div
                className="flex items-center gap-3 p-3 cursor-pointer"
                onClick={() => setExpanded(isOpen ? null : task.id)}
              >
                {/* Checkbox */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggle(task.id); }}
                  className="flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all cursor-pointer"
                  style={{
                    borderColor: done ? BRAND.story : "#d1d5db",
                    backgroundColor: done ? BRAND.story : "transparent",
                  }}
                >
                  {done && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>

                <span
                  className="flex-1 text-sm"
                  style={{
                    textDecoration: done ? "line-through" : "none",
                    color: done ? "#9ca3af" : "#374151",
                  }}
                >
                  {task.title}
                </span>

                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"
                  className="flex-shrink-0 transition-transform"
                  style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-3 pt-1 text-xs text-gray-500 border-t border-gray-100 ml-9">
                      <span className="font-bold" style={{ color: BRAND.accent }}>提示：</span>
                      {task.hint}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="mb-2">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>進度</span>
          <span>{checked.size} / {items.length}</span>
        </div>
        <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: BRAND.accent }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {progress === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center text-sm p-3 rounded-lg mt-3"
          style={{ backgroundColor: `${BRAND.story}15`, color: BRAND.story }}
        >
          全部完成！你已經掌握本週的核心任務。
        </motion.div>
      )}
    </motion.div>
  );
}

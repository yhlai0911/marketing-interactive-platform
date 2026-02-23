"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/components/brand/BrandColors";
import type { QuizSegment } from "@/types";

interface InteractiveQuizProps {
  segment: QuizSegment;
  onComplete?: () => void;
}

export default function InteractiveQuiz({ segment, onComplete }: InteractiveQuizProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const correctIdx = segment.correctIndex ?? 0;

  const handleSelect = (idx: number) => {
    if (revealed) return;
    setSelectedIndex(idx);
    setRevealed(true);
  };

  const isCorrect = selectedIndex === correctIdx;

  return (
    <div className="space-y-5">
      {/* Question */}
      <h3 className="text-base font-semibold text-gray-900">
        {segment.title && (
          <span className="mr-2 text-sm" style={{ color: BRAND.accent }}>
            [{segment.title}]
          </span>
        )}
        {segment.question}
      </h3>

      {/* Options */}
      <div className="space-y-2">
        {segment.options.map((opt, i) => {
          const isSelected = selectedIndex === i;
          const isRight = i === correctIdx;

          let borderColor = "border-gray-200";
          let bg = "bg-white";
          if (revealed && isRight) {
            borderColor = "border-green-500";
            bg = "bg-green-50";
          } else if (revealed && isSelected && !isRight) {
            borderColor = "border-red-400";
            bg = "bg-red-50";
          }

          return (
            <motion.button
              key={i}
              whileHover={!revealed ? { scale: 1.01 } : {}}
              whileTap={!revealed ? { scale: 0.99 } : {}}
              onClick={() => handleSelect(i)}
              disabled={revealed}
              className={cn(
                "w-full text-left rounded-lg border-2 p-4 transition-colors",
                borderColor,
                bg,
                !revealed && "hover:border-gray-300 cursor-pointer",
                revealed && "cursor-default",
              )}
            >
              <div className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs font-semibold text-gray-500">
                  {String.fromCharCode(65 + i)}
                </span>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{opt.label}</p>
                  {opt.desc && (
                    <p className="mt-0.5 text-sm text-gray-500">{opt.desc}</p>
                  )}
                </div>
                {revealed && isRight && (
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                )}
                {revealed && isSelected && !isRight && (
                  <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Explanation */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div
              className={cn(
                "rounded-lg p-4 text-sm",
                isCorrect
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : "bg-amber-50 border border-amber-200 text-amber-800",
              )}
            >
              <p className="font-semibold mb-1">
                {isCorrect ? "正確！" : "再想想看 —"}
              </p>
              <p>{segment.explanation}</p>
            </div>

            {onComplete && (
              <button
                onClick={onComplete}
                className="mt-3 text-sm font-medium hover:underline"
                style={{ color: BRAND.primary }}
              >
                繼續下一段 &rarr;
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

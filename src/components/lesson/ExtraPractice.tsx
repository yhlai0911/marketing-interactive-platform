"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/components/brand/BrandColors";
import type { QuizSegment } from "@/types";

interface ExtraPracticeProps {
  exercises: QuizSegment[];
}

interface AnswerState {
  selectedIndex: number;
  isCorrect: boolean;
}

export default function ExtraPractice({ exercises }: ExtraPracticeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [answers, setAnswers] = useState<Record<number, AnswerState>>({});

  const handleAnswer = useCallback(
    (exerciseIndex: number, optionIndex: number) => {
      if (answers[exerciseIndex] !== undefined) return;
      const exercise = exercises[exerciseIndex];
      const correctIdx = exercise.correctIndex ?? 0;
      setAnswers((prev) => ({
        ...prev,
        [exerciseIndex]: {
          selectedIndex: optionIndex,
          isCorrect: optionIndex === correctIdx,
        },
      }));
    },
    [answers, exercises]
  );

  const answeredCount = Object.keys(answers).length;
  const correctCount = Object.values(answers).filter((a) => a.isCorrect).length;

  return (
    <div className="mt-8 rounded-xl border-2 border-dashed border-gray-200 overflow-hidden">
      {/* Toggle header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">📝</span>
          <span className="font-semibold text-gray-700">
            更多練習（{exercises.length} 題）
          </span>
          {answeredCount > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
              已答 {answeredCount}/{exercises.length}
              {answeredCount > 0 && `，正確 ${correctCount}/${answeredCount}`}
            </span>
          )}
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </button>

      {/* Collapsible content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-5 border-t border-gray-100 pt-4">
              {/* Progress bar */}
              {answeredCount > 0 && (
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: BRAND.story }}
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(answeredCount / exercises.length) * 100}%`,
                      }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {answeredCount}/{exercises.length}
                  </span>
                </div>
              )}

              {/* Exercise cards */}
              {exercises.map((exercise, exIdx) => (
                <ExerciseCard
                  key={exIdx}
                  exercise={exercise}
                  index={exIdx}
                  answer={answers[exIdx]}
                  onAnswer={(optIdx) => handleAnswer(exIdx, optIdx)}
                />
              ))}

              {/* Completion message */}
              {answeredCount === exercises.length && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-3 rounded-lg"
                  style={{
                    backgroundColor: `${BRAND.story}08`,
                    color: BRAND.story,
                  }}
                >
                  <p className="font-semibold">
                    全部完成！正確率 {Math.round((correctCount / exercises.length) * 100)}%
                    （{correctCount}/{exercises.length}）
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── 單題卡片 ────────────────────────────────────

function ExerciseCard({
  exercise,
  index,
  answer,
  onAnswer,
}: {
  exercise: QuizSegment;
  index: number;
  answer?: AnswerState;
  onAnswer: (optionIndex: number) => void;
}) {
  const correctIdx = exercise.correctIndex ?? 0;
  const revealed = answer !== undefined;

  return (
    <div
      className="rounded-lg border bg-white p-4"
      style={{ borderColor: revealed ? `${BRAND.primary}20` : "#e5e7eb" }}
    >
      {/* Question */}
      <p className="text-sm font-semibold text-gray-800 mb-3">
        <span className="text-gray-400 mr-1.5">Q{index + 1}.</span>
        {exercise.question}
      </p>

      {/* Options */}
      <div className="space-y-1.5">
        {exercise.options.map((opt, optIdx) => {
          const isSelected = answer?.selectedIndex === optIdx;
          const isRight = optIdx === correctIdx;

          let borderColor = "border-gray-150";
          let bg = "bg-white";
          let textClass = "text-gray-700";

          if (revealed && isRight) {
            borderColor = "border-green-400";
            bg = "bg-green-50";
            textClass = "text-green-800";
          } else if (revealed && isSelected && !isRight) {
            borderColor = "border-red-300";
            bg = "bg-red-50";
            textClass = "text-red-700";
          } else if (revealed) {
            textClass = "text-gray-400";
          }

          return (
            <button
              key={optIdx}
              onClick={() => onAnswer(optIdx)}
              disabled={revealed}
              className={cn(
                "w-full text-left rounded-lg border px-3 py-2 text-sm transition-colors flex items-center gap-2",
                borderColor,
                bg,
                textClass,
                !revealed && "hover:border-gray-300 cursor-pointer",
                revealed && "cursor-default"
              )}
            >
              <span className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-xs font-semibold shrink-0">
                {revealed && isRight ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : revealed && isSelected && !isRight ? (
                  <XCircle className="w-4 h-4 text-red-400" />
                ) : (
                  opt.label
                )}
              </span>
              <span>{opt.desc}</span>
            </button>
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
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div
              className={cn(
                "mt-3 rounded-lg px-3 py-2 text-xs leading-relaxed",
                answer?.isCorrect
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : "bg-amber-50 border border-amber-200 text-amber-800"
              )}
            >
              {exercise.explanation}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

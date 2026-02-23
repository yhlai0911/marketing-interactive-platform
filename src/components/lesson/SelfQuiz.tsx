"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  RotateCcw,
  BookOpen,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/components/brand/BrandColors";
import { saveQuizResult } from "@/lib/progress";
import type { QuizSegment, QuizResult } from "@/types";

interface SelfQuizProps {
  weekNum: number;
  exercises: QuizSegment[];
  onBackToLesson?: () => void;
}

/** Fisher-Yates shuffle（回傳新陣列 + 原始 index 對映） */
function shuffleWithMap<T>(arr: T[], seed: number): { items: T[]; originalIndices: number[] } {
  const indices = arr.map((_, i) => i);
  // 用 seed 產生偽隨機（簡易 LCG）
  let rng = seed;
  const next = () => {
    rng = (rng * 1664525 + 1013904223) & 0x7fffffff;
    return rng / 0x7fffffff;
  };
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return {
    items: indices.map((idx) => arr[idx]),
    originalIndices: indices,
  };
}

interface ShuffledQuestion {
  original: QuizSegment;
  shuffledOptions: { label: string; desc: string; originalIndex: number }[];
  correctShuffledIndex: number;
}

export default function SelfQuiz({
  weekNum,
  exercises,
  onBackToLesson,
}: SelfQuizProps) {
  // 用時間戳作為 seed，每次進入測驗都不同排列
  const [seed] = useState(() => Date.now());

  // 洗牌題目 + 每題的選項
  const shuffledQuestions: ShuffledQuestion[] = useMemo(() => {
    const { items: shuffledExercises } = shuffleWithMap(exercises, seed);
    return shuffledExercises.map((ex, qIdx) => {
      const optionsWithIndex = ex.options.map((opt, i) => ({ ...opt, originalIndex: i }));
      const { items: shuffledOpts } = shuffleWithMap(optionsWithIndex, seed + qIdx * 7919);
      const correctOriginal = ex.correctIndex ?? 0;
      const correctInShuffled = shuffledOpts.findIndex(
        (o) => o.originalIndex === correctOriginal,
      );
      return {
        original: ex,
        shuffledOptions: shuffledOpts,
        correctShuffledIndex: correctInShuffled,
      };
    });
  }, [exercises, seed]);

  const totalQuestions = shuffledQuestions.length;
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({}); // qIdx → shuffled option idx
  const [showResult, setShowResult] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const currentAnswer = answers[currentQ];
  const isCurrentAnswered = currentAnswer !== undefined;

  const handleAnswer = useCallback(
    (optIdx: number) => {
      if (isCurrentAnswered) return;
      setAnswers((prev) => ({ ...prev, [currentQ]: optIdx }));
    },
    [currentQ, isCurrentAnswered],
  );

  const handleNext = useCallback(() => {
    if (currentQ < totalQuestions - 1) {
      setCurrentQ((prev) => prev + 1);
    }
  }, [currentQ, totalQuestions]);

  const handlePrev = useCallback(() => {
    if (currentQ > 0) {
      setCurrentQ((prev) => prev - 1);
    }
  }, [currentQ]);

  const handleFinish = useCallback(() => {
    // 計算成績
    let score = 0;
    const wrongTopics: string[] = [];
    const answerArray: number[] = [];

    shuffledQuestions.forEach((q, idx) => {
      const chosen = answers[idx] ?? -1;
      // 轉回原始 index 以儲存
      const originalChosen =
        chosen >= 0 ? q.shuffledOptions[chosen].originalIndex : -1;
      answerArray.push(originalChosen);
      if (chosen === q.correctShuffledIndex) {
        score++;
      } else {
        const topic = q.original.title || q.original.question.slice(0, 20);
        wrongTopics.push(topic);
      }
    });

    const result: QuizResult = {
      score,
      total: totalQuestions,
      answers: answerArray,
      wrongTopics,
      completedAt: Date.now(),
    };
    saveQuizResult(weekNum, result);
    setShowResult(true);
  }, [answers, shuffledQuestions, totalQuestions, weekNum]);

  const handleRetake = useCallback(() => {
    setAnswers({});
    setCurrentQ(0);
    setShowResult(false);
    // 不重設 seed，重新 render 時用新 seed（因為 useState 不會 re-init）
    // 實際上需要 force re-mount，由父元件控制更簡單
    // 這裡先簡單 reload 洗牌
    window.location.reload();
  }, []);

  // ─── 成績頁 ─────────────────────────────────────
  if (showResult) {
    let score = 0;
    const wrongTopics: string[] = [];
    shuffledQuestions.forEach((q, idx) => {
      const chosen = answers[idx] ?? -1;
      if (chosen === q.correctShuffledIndex) {
        score++;
      } else {
        const topic = q.original.title || q.original.question.slice(0, 20);
        wrongTopics.push(topic);
      }
    });
    const pct = Math.round((score / totalQuestions) * 100);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto"
      >
        <div className="rounded-2xl border-2 bg-white p-8 text-center" style={{ borderColor: BRAND.accent }}>
          <Trophy className="w-12 h-12 mx-auto mb-4" style={{ color: BRAND.accent }} />
          <h2 className="text-2xl font-bold mb-2">測驗完成！</h2>

          {/* 分數 */}
          <div className="my-6">
            <div className="text-5xl font-black" style={{ color: pct >= 80 ? BRAND.story : pct >= 60 ? BRAND.accent : BRAND.danger }}>
              {pct}%
            </div>
            <p className="text-gray-500 mt-1">
              {score} / {totalQuestions} 題正確
            </p>
          </div>

          {/* 進度條 */}
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-6">
            <motion.div
              className="h-full rounded-full"
              style={{
                backgroundColor: pct >= 80 ? BRAND.story : pct >= 60 ? BRAND.accent : BRAND.danger,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </div>

          {/* 弱項提示 */}
          {wrongTopics.length > 0 && (
            <div className="text-left rounded-lg bg-amber-50 border border-amber-200 p-4 mb-6">
              <h4 className="text-sm font-bold text-amber-800 mb-2">建議複習：</h4>
              <ul className="space-y-1">
                {wrongTopics.map((topic, i) => (
                  <li key={i} className="text-sm text-amber-700 flex items-center gap-2">
                    <XCircle className="w-3.5 h-3.5 shrink-0" />
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {pct === 100 && (
            <div className="rounded-lg bg-green-50 border border-green-200 p-4 mb-6 text-green-800">
              🎉 滿分！你已經完全掌握本週內容！
            </div>
          )}

          {/* 動作按鈕 */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              onClick={handleRetake}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border font-medium hover:bg-gray-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> 重新測驗
            </button>
            {onBackToLesson && (
              <button
                onClick={onBackToLesson}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-medium hover:opacity-90 transition-colors"
                style={{ backgroundColor: BRAND.primary }}
              >
                <BookOpen className="w-4 h-4" /> 回到課程
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // ─── 答題頁 ─────────────────────────────────────
  const q = shuffledQuestions[currentQ];
  const isCorrect = isCurrentAnswered && currentAnswer === q.correctShuffledIndex;

  return (
    <div className="max-w-2xl mx-auto">
      {/* 標題 + 進度 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold" style={{ color: BRAND.primary }}>
            Week {weekNum} 自我測驗
          </h2>
          <span className="text-sm text-gray-500">
            第 {currentQ + 1} 題 / 共 {totalQuestions} 題
          </span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: BRAND.accent }}
            animate={{ width: `${((answeredCount) / totalQuestions) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        {/* 題號快速導航 */}
        <div className="flex items-center gap-1 mt-3 flex-wrap">
          {shuffledQuestions.map((_, idx) => {
            const ans = answers[idx];
            const isAnswered = ans !== undefined;
            const isRight = isAnswered && ans === shuffledQuestions[idx].correctShuffledIndex;
            const isCurrent = idx === currentQ;
            return (
              <button
                key={idx}
                onClick={() => setCurrentQ(idx)}
                className={cn(
                  "w-7 h-7 rounded-full text-xs font-bold transition-all",
                  isCurrent
                    ? "ring-2 ring-offset-1"
                    : "",
                  !isAnswered
                    ? "bg-gray-100 text-gray-400"
                    : isRight
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600",
                )}
                style={isCurrent ? { outlineColor: BRAND.primary } : undefined}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* 題目卡片 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.2 }}
          className="rounded-xl border-2 bg-white p-6"
          style={{ borderColor: isCurrentAnswered ? (isCorrect ? "#22c55e" : "#ef4444") : "#e5e7eb" }}
        >
          {/* 題目 */}
          <p className="text-base font-semibold text-gray-800 mb-5 leading-relaxed">
            <span className="text-gray-400 mr-2">Q{currentQ + 1}.</span>
            {q.original.question}
          </p>

          {/* 選項 */}
          <div className="space-y-2.5">
            {q.shuffledOptions.map((opt, optIdx) => {
              const isSelected = currentAnswer === optIdx;
              const isRight = optIdx === q.correctShuffledIndex;

              let borderClass = "border-gray-200";
              let bgClass = "bg-white hover:bg-gray-50";
              let textClass = "text-gray-700";

              if (isCurrentAnswered) {
                if (isRight) {
                  borderClass = "border-green-400";
                  bgClass = "bg-green-50";
                  textClass = "text-green-800";
                } else if (isSelected && !isRight) {
                  borderClass = "border-red-300";
                  bgClass = "bg-red-50";
                  textClass = "text-red-700";
                } else {
                  textClass = "text-gray-400";
                  bgClass = "bg-white";
                }
              }

              const optionLabels = ["A", "B", "C", "D"];

              return (
                <button
                  key={optIdx}
                  onClick={() => handleAnswer(optIdx)}
                  disabled={isCurrentAnswered}
                  className={cn(
                    "w-full text-left rounded-lg border-2 px-4 py-3 transition-all flex items-center gap-3",
                    borderClass,
                    bgClass,
                    textClass,
                    !isCurrentAnswered && "cursor-pointer hover:border-gray-300",
                    isCurrentAnswered && "cursor-default",
                  )}
                >
                  <span
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 border",
                      isCurrentAnswered && isRight
                        ? "bg-green-500 text-white border-green-500"
                        : isCurrentAnswered && isSelected && !isRight
                        ? "bg-red-400 text-white border-red-400"
                        : "border-gray-300 text-gray-500",
                    )}
                  >
                    {isCurrentAnswered && isRight ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : isCurrentAnswered && isSelected && !isRight ? (
                      <XCircle className="w-4 h-4" />
                    ) : (
                      optionLabels[optIdx]
                    )}
                  </span>
                  <span className="text-sm leading-relaxed">{opt.desc}</span>
                </button>
              );
            })}
          </div>

          {/* 解析 */}
          <AnimatePresence>
            {isCurrentAnswered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div
                  className={cn(
                    "mt-4 rounded-lg px-4 py-3 text-sm leading-relaxed",
                    isCorrect
                      ? "bg-green-50 border border-green-200 text-green-800"
                      : "bg-amber-50 border border-amber-200 text-amber-800",
                  )}
                >
                  <span className="font-bold mr-1">{isCorrect ? "✓ 正確！" : "✗ 答錯了。"}</span>
                  {q.original.explanation}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* 導航 */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={handlePrev}
          disabled={currentQ === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          <ChevronLeft className="w-4 h-4" /> 上一題
        </button>

        {answeredCount === totalQuestions ? (
          <button
            onClick={handleFinish}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-bold hover:opacity-90 transition-colors"
            style={{ backgroundColor: BRAND.accent }}
          >
            <Trophy className="w-4 h-4" /> 查看成績
          </button>
        ) : currentQ < totalQuestions - 1 ? (
          <button
            onClick={handleNext}
            disabled={!isCurrentAnswered}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90"
            style={{ backgroundColor: BRAND.primary }}
          >
            下一題 <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <span className="text-sm text-gray-400">
            還有 {totalQuestions - answeredCount} 題未作答
          </span>
        )}
      </div>
    </div>
  );
}

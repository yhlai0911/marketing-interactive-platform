"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  RotateCcw,
  ClipboardCheck,
} from "lucide-react";
import { getLesson } from "@/data/lessons";
import StoryNarrator from "@/components/lesson/StoryNarrator";
import TheoryExplainer from "@/components/lesson/TheoryExplainer";
import InteractiveQuiz from "@/components/lesson/InteractiveQuiz";
import ClassroomTeacher from "@/components/lesson/ClassroomTeacher";
import LessonProgress from "@/components/lesson/LessonProgress";
import ModeSwitch from "@/components/lesson/ModeSwitch";
import type { Mode } from "@/components/lesson/ModeSwitch";
import SelfQuiz from "@/components/lesson/SelfQuiz";
import FormulaQuickRef from "@/components/visuals/FormulaQuickRef";
import ExtraPractice from "@/components/lesson/ExtraPractice";
import LessonChatFAB from "@/components/lesson/LessonChatFAB";
import { BRAND } from "@/components/brand/BrandColors";
import { saveProgress, getProgress, resetProgress, getQuizResult } from "@/lib/progress";
import { week01Teaching } from "@/data/teaching/week01";
import { week02Teaching } from "@/data/teaching/week02";
import { week03Teaching } from "@/data/teaching/week03";
import { week04Teaching } from "@/data/teaching/week04";
import { week05Teaching } from "@/data/teaching/week05";
import { week06Teaching } from "@/data/teaching/week06";
import { week07Teaching } from "@/data/teaching/week07";
import { week08Teaching } from "@/data/teaching/week08";
import { week09Teaching } from "@/data/teaching/week09";
import { week10Teaching } from "@/data/teaching/week10";
import { week11Teaching } from "@/data/teaching/week11";
import { week12Teaching } from "@/data/teaching/week12";
import { week13Teaching } from "@/data/teaching/week13";
import { week14Teaching } from "@/data/teaching/week14";
import { week15Teaching } from "@/data/teaching/week15";
import { week16Teaching } from "@/data/teaching/week16";
import { ALL_FORMULAS } from "@/data/formulas";
import { ALL_EXERCISES } from "@/data/exercises";
import type { LessonSegment, SegmentTeaching } from "@/types";

// 教學腳本對照表（按週數載入）
const TEACHING_DATA: Record<number, SegmentTeaching[]> = {
  1: week01Teaching,
  2: week02Teaching,
  3: week03Teaching,
  4: week04Teaching,
  5: week05Teaching,
  6: week06Teaching,
  7: week07Teaching,
  8: week08Teaching,
  9: week09Teaching,
  10: week10Teaching,
  11: week11Teaching,
  12: week12Teaching,
  13: week13Teaching,
  14: week14Teaching,
  15: week15Teaching,
  16: week16Teaching,
};

function MissionSegmentView({
  segment,
}: {
  segment: Extract<LessonSegment, { type: "mission" }>;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div
        className="rounded-xl p-6 border-2"
        style={{ borderColor: BRAND.accent, backgroundColor: `${BRAND.accent}08` }}
      >
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: BRAND.accent }}>
          📋 {segment.title}
        </h3>
        <p className="mb-4 text-gray-700">{segment.description}</p>
        <div>
          <h4 className="font-bold text-sm mb-2">交付項目：</h4>
          <ul className="space-y-1">
            {segment.deliverables.map((d, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-[var(--zhen-accent)]">✦</span>
                {d}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

function DiscussSegmentView({
  segment,
}: {
  segment: Extract<LessonSegment, { type: "discuss" }>;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="rounded-xl p-6 border-2 border-[var(--zhen-story)] bg-[var(--zhen-story)]/5">
        <h3 className="text-xl font-bold mb-4" style={{ color: BRAND.story }}>
          💬 {segment.title}
        </h3>
        <p className="text-lg mb-4">{segment.prompt}</p>
        {segment.guidePoints && (
          <ul className="space-y-1 text-sm text-gray-600">
            {segment.guidePoints.map((p, i) => (
              <li key={i}>• {p}</li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}

export default function LessonPage() {
  const params = useParams();
  const weekNum = parseInt(params.week as string, 10);
  const lesson = getLesson(weekNum);

  const [currentSegment, setCurrentSegment] = useState(0);
  const [maxReached, setMaxReached] = useState(0);
  const [mode, setMode] = useState<Mode>("self");
  const [initialClassStep, setInitialClassStep] = useState(0);

  const exercises = ALL_EXERCISES[weekNum] ?? [];
  const quizCount = exercises.length;

  // 頁面載入時恢復進度（含邊界檢查）
  useEffect(() => {
    const saved = getProgress(weekNum);
    if (saved) {
      // 若段落 index 超出當前 lesson 段落數（例如重構後段落變少），重置進度
      if (lesson && saved.currentSegment >= lesson.segments.length) {
        resetProgress(weekNum);
        return;
      }
      setCurrentSegment(saved.currentSegment);
      const maxSeg = saved.maxReachedSegment ?? saved.currentSegment;
      setMaxReached(lesson ? Math.min(maxSeg, lesson.segments.length - 1) : maxSeg);
      if (saved.mode && saved.mode !== "quiz") setMode(saved.mode);
      if (saved.classStepIndex) setInitialClassStep(saved.classStepIndex);
    }
  }, [weekNum, lesson]);

  const handleNext = useCallback(() => {
    if (lesson && currentSegment < lesson.segments.length - 1) {
      const next = currentSegment + 1;
      setCurrentSegment(next);
      setMaxReached((prev) => Math.max(prev, next));
      setInitialClassStep(0);
      saveProgress(weekNum, next, lesson.segments.length, mode, 0);
    }
  }, [currentSegment, lesson, weekNum, mode]);

  const handlePrev = useCallback(() => {
    if (currentSegment > 0) {
      const prev = currentSegment - 1;
      setCurrentSegment(prev);
      setInitialClassStep(0);
      if (lesson) saveProgress(weekNum, prev, lesson.segments.length, mode, 0);
    }
  }, [currentSegment, lesson, weekNum, mode]);

  const handleModeChange = useCallback((newMode: Mode) => {
    setMode(newMode);
    if (newMode !== "quiz" && lesson) {
      saveProgress(weekNum, currentSegment, lesson.segments.length, newMode, 0);
    }
  }, [weekNum, currentSegment, lesson]);

  const handleClassStepChange = useCallback((stepIndex: number) => {
    if (lesson) saveProgress(weekNum, currentSegment, lesson.segments.length, mode, stepIndex);
  }, [weekNum, currentSegment, lesson, mode]);

  const handleNavigate = useCallback((index: number) => {
    if (index <= maxReached && lesson) {
      setCurrentSegment(index);
      setInitialClassStep(0);
      saveProgress(weekNum, index, lesson.segments.length, mode, 0);
    }
  }, [maxReached, lesson, weekNum, mode]);

  const handleRestart = useCallback(() => {
    resetProgress(weekNum);
    setCurrentSegment(0);
    setMaxReached(0);
    setMode("self");
    setInitialClassStep(0);
  }, [weekNum]);

  const handleBackFromQuiz = useCallback(() => {
    setMode("self");
  }, []);

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">課程尚未開放</h1>
          <p className="text-gray-500 mb-6">第 {weekNum} 週的互動課程正在準備中</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2 rounded-lg text-white"
            style={{ backgroundColor: BRAND.primary }}
          >
            <ArrowLeft className="w-4 h-4" /> 返回首頁
          </Link>
        </div>
      </div>
    );
  }

  const segment = lesson.segments[currentSegment];
  const segmentTitles = lesson.segments.map((s) => {
    if (s.type === "quiz") return s.title || "互動測驗";
    return s.title;
  });
  const segmentTypes = lesson.segments.map((s) => s.type);

  const isLastSegment = currentSegment === lesson.segments.length - 1;
  const previousQuizResult = getQuizResult(weekNum);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頂部列 */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: BRAND.primary }}>
                Week {weekNum}
              </span>
              <h1 className="text-lg font-bold mt-1">{lesson.title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ModeSwitch
              mode={mode}
              onChange={handleModeChange}
              quizCount={quizCount > 0 ? quizCount : undefined}
            />
            <button
              onClick={handleRestart}
              title="重新開始本週課程"
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
        {/* 進度條：quiz 模式下隱藏 */}
        {mode !== "quiz" && (
          <LessonProgress
            current={currentSegment}
            total={lesson.segments.length}
            titles={segmentTitles}
            types={segmentTypes}
            maxReached={maxReached}
            onNavigate={handleNavigate}
          />
        )}
      </div>

      {/* 段落內容 */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 模式提示 */}
        {mode === "class" && (
          <div
            className="mb-6 text-center text-sm py-2 rounded-lg"
            style={{ backgroundColor: `${BRAND.primary}08`, color: BRAND.primary }}
          >
            課堂模式：互動教學 — 多角色講解、提問、回饋
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={`${mode}-${currentSegment}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {mode === "quiz" ? (
              /* ─── 自我測驗模式 ─── */
              quizCount > 0 ? (
                <SelfQuiz
                  weekNum={weekNum}
                  exercises={exercises}
                  onBackToLesson={handleBackFromQuiz}
                />
              ) : (
                <div className="max-w-2xl mx-auto text-center py-12 text-gray-400">
                  <ClipboardCheck className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p className="text-lg mb-2">本週尚無測驗題目</p>
                  <p className="text-sm">測驗題目準備中，請先閱讀課程內容</p>
                </div>
              )
            ) : mode === "class" ? (
              /* 課堂模式：互動教學（預先生成腳本 + 隨堂提問） */
              (() => {
                const teachingData = TEACHING_DATA[weekNum];
                const segmentTeaching = teachingData?.[currentSegment];

                if (!segmentTeaching) {
                  return (
                    <div className="max-w-2xl mx-auto text-center py-12 text-gray-400">
                      <p className="text-lg mb-2">本段尚無互動教學腳本</p>
                      <p className="text-sm">目前僅 Week 1 支援課堂模式</p>
                    </div>
                  );
                }

                return (
                  <ClassroomTeacher
                    teaching={segmentTeaching}
                    weekNum={weekNum}
                    segmentIndex={currentSegment}
                    segmentTitle={segmentTitles[currentSegment]}
                    initialStepIndex={initialClassStep}
                    onStepChange={handleClassStepChange}
                    onComplete={
                      currentSegment < lesson.segments.length - 1
                        ? handleNext
                        : undefined
                    }
                  />
                );
              })()
            ) : (
              /* 自學模式：靜態內容 + 手動操作 */
              <>
                {segment.type === "story" && (
                  <StoryNarrator
                    segment={segment}
                    onComplete={handleNext}
                  />
                )}
                {segment.type === "theory" && (
                  <>
                    <TheoryExplainer segment={segment} />
                    {ALL_FORMULAS[weekNum] && (
                      <div className="mt-6">
                        <FormulaQuickRef
                          weekNum={weekNum}
                          title={ALL_FORMULAS[weekNum].title}
                          formulas={ALL_FORMULAS[weekNum].formulas}
                        />
                      </div>
                    )}
                  </>
                )}
                {segment.type === "quiz" && (
                  <>
                    <InteractiveQuiz segment={segment} onComplete={handleNext} />
                    {ALL_EXERCISES[weekNum]?.length > 0 && (
                      <ExtraPractice exercises={ALL_EXERCISES[weekNum]} />
                    )}
                  </>
                )}
                {segment.type === "discuss" && (
                  <DiscussSegmentView segment={segment} />
                )}
                {segment.type === "mission" && (
                  <MissionSegmentView segment={segment} />
                )}

                {/* ─── 課程結尾：引導進入測驗 ─── */}
                {isLastSegment && quizCount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 max-w-md mx-auto"
                  >
                    <div
                      className="rounded-2xl p-6 text-center border-2"
                      style={{ borderColor: BRAND.accent, backgroundColor: `${BRAND.accent}08` }}
                    >
                      <ClipboardCheck className="w-10 h-10 mx-auto mb-3" style={{ color: BRAND.accent }} />
                      <h3 className="text-lg font-bold mb-1">準備好測驗了嗎？</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        {quizCount} 題選擇題，選項隨機排列
                      </p>
                      {previousQuizResult && (
                        <p className="text-xs text-gray-400 mb-3">
                          上次成績：{previousQuizResult.score}/{previousQuizResult.total}
                          （{Math.round((previousQuizResult.score / previousQuizResult.total) * 100)}%）
                        </p>
                      )}
                      <button
                        onClick={() => setMode("quiz")}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-bold hover:opacity-90 transition-colors"
                        style={{ backgroundColor: BRAND.accent }}
                      >
                        <ClipboardCheck className="w-4 h-4" />
                        開始本週測驗
                      </button>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* 自學模式的導航按鈕（課堂模式的導航已整合在 TeachingNarrator 中） */}
        {mode === "self" && (
          <div className="flex items-center justify-between mt-12 max-w-2xl mx-auto">
            <button
              onClick={handlePrev}
              disabled={currentSegment === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft className="w-4 h-4" /> 上一步
            </button>

            <button
              onClick={handleNext}
              disabled={currentSegment === lesson.segments.length - 1}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90"
              style={{ backgroundColor: BRAND.primary }}
            >
              下一步 <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 課堂模式的上一步按鈕 */}
        {mode === "class" && currentSegment > 0 && (
          <div className="mt-6 max-w-2xl mx-auto">
            <button
              onClick={handlePrev}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm text-gray-500 hover:bg-gray-50 transition-all"
            >
              <ChevronLeft className="w-4 h-4" /> 回到上一段
            </button>
          </div>
        )}
      </div>

      {/* 浮動 AI 助教（quiz 模式不顯示） */}
      {mode !== "quiz" && (
        <LessonChatFAB
          weekNum={weekNum}
          weekTitle={lesson.title}
          currentSegment={segment}
          currentSegmentIndex={currentSegment}
          totalSegments={lesson.segments.length}
          segmentTitle={segmentTitles[currentSegment]}
          teachingSteps={TEACHING_DATA[weekNum]?.[currentSegment]?.steps}
          formulas={ALL_FORMULAS[weekNum]?.formulas}
        />
      )}
    </div>
  );
}

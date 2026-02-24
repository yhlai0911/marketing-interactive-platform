"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2,
  VolumeX,
  Pause,
  Play,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import CharacterAvatar from "@/components/brand/CharacterAvatar";
import { BRAND } from "@/components/brand/BrandColors";
import { VISUAL_COMPONENTS } from "@/components/visuals";
import type { SegmentTeaching, TeachingStep, CharacterId, DiscussTimerStep } from "@/types";

// ─── Props ───────────────────────────────────────
interface ClassroomTeacherProps {
  teaching: SegmentTeaching;
  weekNum: number;
  segmentIndex: number;
  segmentTitle?: string;
  initialStepIndex?: number;
  onStepChange?: (stepIndex: number) => void;
  onComplete?: () => void;
}

// ─── 狀態型別 ────────────────────────────────────
type StepPhase =
  | "entering"           // 步驟進場動畫
  | "playing_lecture"    // TTS 播放中 + 文字逐字顯示
  | "lecture_done"       // 講解完成，等待自動進入下一步
  | "showing_visual"     // 顯示圖表動畫
  | "asking_check"       // 等待學生回答（blocking）
  | "showing_feedback"   // 顯示對/錯回饋
  | "discuss_countdown"  // 討論倒數計時中
  | "step_done";         // 步驟完成，準備下一步

// ─── 文字逐字顯示 Hook（支援動態速度）────────────
function useTypewriter(text: string, speed = 80) {
  const [displayed, setDisplayed] = useState("");
  const [isDone, setIsDone] = useState(false);
  const indexRef = useRef(0);
  const speedRef = useRef(speed);

  // 動態更新速度，不重置打字進度
  speedRef.current = speed;

  useEffect(() => {
    setDisplayed("");
    setIsDone(false);
    indexRef.current = 0;

    if (!text) {
      setIsDone(true);
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout>;
    const tick = () => {
      indexRef.current++;
      if (indexRef.current >= text.length) {
        setDisplayed(text);
        setIsDone(true);
      } else {
        setDisplayed(text.slice(0, indexRef.current));
        timeoutId = setTimeout(tick, speedRef.current);
      }
    };
    timeoutId = setTimeout(tick, speedRef.current);

    return () => clearTimeout(timeoutId);
  }, [text]);

  const skipToEnd = useCallback(() => {
    setDisplayed(text);
    setIsDone(true);
    indexRef.current = text.length;
  }, [text]);

  return { displayed, isDone, skipToEnd };
}

// ─── 主元件 ──────────────────────────────────────
export default function ClassroomTeacher({
  teaching,
  weekNum,
  segmentIndex,
  segmentTitle,
  initialStepIndex,
  onStepChange,
  onComplete,
}: ClassroomTeacherProps) {
  const [stepIndex, setStepIndex] = useState(initialStepIndex ?? 0);
  const [phase, setPhase] = useState<StepPhase>("entering");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const [audioDuration, setAudioDuration] = useState<number | null>(null);

  // ─── 答題計分（segment 級別）─────────────────
  const [correctCount, setCorrectCount] = useState(0);
  const [attemptedCount, setAttemptedCount] = useState(0);

  // ─── 討論倒數計時 ─────────────────────────────
  const [discussTimeLeft, setDiscussTimeLeft] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const prevStepRef = useRef(stepIndex);

  const steps = teaching.steps;
  const currentStep = steps[stepIndex] as TeachingStep | undefined;

  // 文字提取
  const lectureText =
    currentStep?.type === "lecture" ? currentStep.text : "";
  const feedbackText =
    currentStep?.type === "check"
      ? isCorrect
        ? currentStep.onCorrect
        : currentStep.onWrong
      : "";
  const questionText =
    currentStep?.type === "check" ? currentStep.question : "";

  // ─── 動態速度：根據音檔時長同步打字速率 ─────────
  const activeSpeed = useMemo(() => {
    if (isMuted) return 35; // 靜音模式：快速打字（120字 × 35ms ≈ 4.2秒）
    if (!audioDuration) return 150; // 音檔載入前：接近中文語速的預估速度（100字 × 150ms ≈ 15秒）
    const activeText =
      phase === "playing_lecture" ? lectureText :
      phase === "asking_check" ? questionText :
      phase === "showing_feedback" ? feedbackText : "";
    if (!activeText || activeText.length === 0) return 150;
    // 文字在音檔 92% 時長內打完，留 8% 緩衝
    return Math.max(25, Math.min(250, (audioDuration * 920) / activeText.length));
  }, [isMuted, audioDuration, phase, lectureText, questionText, feedbackText]);

  // ─── 講解文字逐字顯示 ─────────────────────────
  const { displayed, isDone: typingDone, skipToEnd } = useTypewriter(
    phase === "playing_lecture" ? lectureText : "",
    activeSpeed
  );

  // ─── 回饋文字（check 答對/答錯）──
  const {
    displayed: feedbackDisplayed,
    isDone: feedbackTypingDone,
    skipToEnd: skipFeedback,
  } = useTypewriter(
    phase === "showing_feedback" ? feedbackText : "",
    activeSpeed
  );

  // ─── 提問文字逐字顯示 ─────────────────────────
  const {
    displayed: questionDisplayed,
    isDone: questionTypingDone,
    skipToEnd: skipQuestion,
  } = useTypewriter(
    phase === "asking_check" ? questionText : "",
    activeSpeed
  );

  // ─── manifest 快取 ─────────────────────────────
  const manifestRef = useRef<Record<string, string> | null>(null);
  const manifestLoadedRef = useRef(false);

  // 載入 manifest（只載入一次）
  useEffect(() => {
    if (manifestLoadedRef.current) return;
    manifestLoadedRef.current = true;
    const paddedWeek = String(weekNum).padStart(2, "0");
    fetch(`/audio/teaching/week${paddedWeek}/manifest.json`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) manifestRef.current = data;
      })
      .catch(() => {});
  }, [weekNum]);

  // ─── 音訊播放 ──────────────────────────────────
  const playAudio = useCallback(
    async (_text: string, _character: CharacterId = "profLin", audioKey?: string) => {
      if (isMuted) return;

      // 停止先前的音訊
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      setAudioDuration(null); // 重置，等新音檔載入

      try {
        setIsPlayingAudio(true);

        // 只使用預錄音檔，不 fallback 到即時 TTS（避免付費 API 呼叫和音文不匹配）
        let audioUrl: string | null = null;
        if (audioKey && manifestRef.current?.[audioKey]) {
          audioUrl = manifestRef.current[audioKey];
        }

        if (!audioUrl) {
          // 無預錄音檔：靜默模式，文字照常顯示但不播放語音
          setIsPlayingAudio(false);
          return;
        }

        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        // 取得音檔時長，用於同步打字速度
        audio.onloadedmetadata = () => {
          setAudioDuration(audio.duration);
        };

        audio.onended = () => {
          setIsPlayingAudio(false);
          audioRef.current = null;
        };

        audio.onerror = () => {
          setIsPlayingAudio(false);
          audioRef.current = null;
        };

        await audio.play();
      } catch {
        setIsPlayingAudio(false);
      }
    },
    [isMuted]
  );

  // ─── 步驟轉場邏輯 ─────────────────────────────
  // 當 stepIndex 或 segmentIndex 改變時，重置狀態
  // 回退時跳過打字動畫，直接顯示完整內容
  useEffect(() => {
    const goingBack = stepIndex < prevStepRef.current;
    prevStepRef.current = stepIndex;

    setSelectedOption(null);
    setIsCorrect(null);
    setAudioDuration(null);

    // 停止先前音訊
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlayingAudio(false);
    }

    // 回退：跳過動畫，直接顯示完成狀態
    if (goingBack && currentStep) {
      switch (currentStep.type) {
        case "lecture":
          setPhase("lecture_done");
          return;
        case "visual":
          setPhase("showing_visual");
          return;
        case "check":
          setPhase("asking_check");
          return;
        case "discuss_timer":
          setPhase("discuss_countdown");
          return;
      }
    }

    // 前進：正常動畫流程
    setPhase("entering");

    // 段落首步延長延遲（讓轉場標題有時間被看到）
    const enterDelay = stepIndex === 0 ? 800 : 400;

    // 短暫延遲後進入活躍狀態
    const timer = setTimeout(() => {
      if (!currentStep) return;

      switch (currentStep.type) {
        case "lecture":
          setPhase("playing_lecture");
          break;
        case "visual":
          setPhase("showing_visual");
          break;
        case "check":
          setPhase("asking_check");
          break;
        case "discuss_timer":
          setDiscussTimeLeft(currentStep.durationMinutes * 60);
          setPhase("discuss_countdown");
          break;
      }
    }, enterDelay);

    return () => clearTimeout(timer);
  }, [stepIndex, segmentIndex, currentStep]);

  // 開始講解時自動播放語音
  useEffect(() => {
    if (phase === "playing_lecture" && currentStep?.type === "lecture") {
      const key = `s${segmentIndex}-step${stepIndex}`;
      playAudio(currentStep.text, currentStep.character, key);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // 講解打字完成 → lecture_done（等學生按「繼續」）
  useEffect(() => {
    if (phase === "playing_lecture" && typingDone) {
      setPhase("lecture_done");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, typingDone]);

  // visual 步驟：不自動推進，等學生按「繼續」

  // 回饋：不自動推進，等學生按「繼續」

  // ─── 討論倒數計時 ─────────────────────────────
  useEffect(() => {
    if (phase !== "discuss_countdown" || discussTimeLeft <= 0) return;
    const timer = setInterval(() => {
      setDiscussTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, discussTimeLeft > 0]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── 自動捲動 ─────────────────────────────────
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [displayed, feedbackDisplayed, questionDisplayed, phase]);

  // ─── 是否可以按「繼續」────────────────────────
  const canAdvance =
    (phase === "lecture_done" && !isPlayingAudio) ||
    (phase === "showing_visual") ||
    (phase === "showing_feedback" && feedbackTypingDone && !isPlayingAudio) ||
    (phase === "discuss_countdown") ||
    (phase === "step_done");

  // ─── 回到上一步 ────────────────────────────────
  const goBackStep = useCallback(() => {
    if (stepIndex > 0) {
      const prev = stepIndex - 1;
      setStepIndex(prev);
      onStepChange?.(prev);
    }
  }, [stepIndex, onStepChange]);

  // ─── 進入下一步 ────────────────────────────────
  const advanceStep = useCallback(() => {
    if (stepIndex < steps.length - 1) {
      const next = stepIndex + 1;
      setStepIndex(next);
      onStepChange?.(next);
    } else {
      // Segment 完成
      setPhase("step_done");
    }
  }, [stepIndex, steps.length, onStepChange]);

  // ─── 計算 check 在 segment 中的索引 ────────────
  const checkIndexInSegment = (() => {
    let count = 0;
    for (let i = 0; i < stepIndex; i++) {
      if (steps[i]?.type === "check") count++;
    }
    return count;
  })();

  // check 步驟進入時播放提問語音
  useEffect(() => {
    if (phase === "asking_check" && currentStep?.type === "check") {
      const key = `s${segmentIndex}-check${checkIndexInSegment}-question`;
      playAudio(currentStep.question, "profLin", key);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // ─── Check 回答處理 ────────────────────────────
  const handleCheckAnswer = useCallback(
    (optionIndex: number) => {
      if (currentStep?.type !== "check" || selectedOption !== null) return;

      const correct = optionIndex === currentStep.correctIndex;
      setSelectedOption(optionIndex);
      setIsCorrect(correct);
      setPhase("showing_feedback");

      // 計分
      setAttemptedCount((prev) => prev + 1);
      if (correct) setCorrectCount((prev) => prev + 1);

      // 朗讀回饋（使用預錄音檔）
      const feedbackAudioText = correct
        ? currentStep.onCorrect
        : currentStep.onWrong;
      const feedbackKey = `s${segmentIndex}-check${checkIndexInSegment}-${correct ? "correct" : "wrong"}`;
      playAudio(feedbackAudioText, "profLin", feedbackKey);
    },
    [currentStep, selectedOption, playAudio, segmentIndex, checkIndexInSegment]
  );

  // ─── 暫停/繼續 ────────────────────────────────
  const togglePause = useCallback(() => {
    if (audioRef.current) {
      if (isPaused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
      setIsPaused(!isPaused);
    }
  }, [isPaused]);

  // ─── 靜音切換 ─────────────────────────────────
  const toggleMute = useCallback(() => {
    if (audioRef.current && !isMuted) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlayingAudio(false);
    }
    setIsMuted(!isMuted);
  }, [isMuted]);

  // ─── 清理 ──────────────────────────────────────
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // ─── segment 切換時重置 stepIndex + 計分（使用 initialStepIndex 或歸零）──
  useEffect(() => {
    setStepIndex(initialStepIndex ?? 0);
    setCorrectCount(0);
    setAttemptedCount(0);
  }, [segmentIndex, initialStepIndex]);

  if (!currentStep) {
    return null;
  }

  // ─── 渲染 ──────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={currentStep.type === "visual" ? "max-w-5xl mx-auto" : "max-w-2xl mx-auto"}
    >
      {/* 頂部：教授資訊 + 控制按鈕 */}
      <div className="flex items-center gap-3 mb-5">
        <CharacterAvatar character="profLin" size="lg" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900">陳思遠教授</span>
            <StepBadge step={currentStep} />
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-xs text-gray-400">
              步驟 {stepIndex + 1} / {steps.length}
            </p>
            {attemptedCount > 0 && (
              <span className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                style={{
                  backgroundColor: correctCount === attemptedCount ? `${BRAND.story}15` : `${BRAND.accent}15`,
                  color: correctCount === attemptedCount ? BRAND.story : BRAND.accent,
                }}
              >
                答對 {correctCount}/{attemptedCount}
              </span>
            )}
          </div>
        </div>

        {/* 控制按鈕 */}
        <div className="flex items-center gap-1.5">
          {isPlayingAudio && (
            <button
              onClick={togglePause}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title={isPaused ? "繼續" : "暫停"}
            >
              {isPaused ? (
                <Play className="w-4 h-4 text-gray-500" />
              ) : (
                <Pause className="w-4 h-4 text-gray-500" />
              )}
            </button>
          )}
          <button
            onClick={toggleMute}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title={isMuted ? "開啟語音" : "靜音"}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-gray-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {/* 進度條 */}
      <div className="h-1 bg-gray-100 rounded-full mb-5 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: BRAND.primary }}
          initial={{ width: 0 }}
          animate={{
            width: `${((stepIndex + (phase === "step_done" ? 1 : 0.5)) / steps.length) * 100}%`,
          }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* 段落轉場標題（僅首步進場時顯示）*/}
      <AnimatePresence>
        {stepIndex === 0 && phase === "entering" && segmentTitle && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-center py-6 mb-4"
          >
            <div className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-2"
              style={{ backgroundColor: `${BRAND.primary}10`, color: BRAND.primary }}
            >
              {currentStep?.type === "lecture" ? "理論講解" :
               currentStep?.type === "check" ? "隨堂測驗" :
               currentStep?.type === "visual" ? "圖表展示" :
               currentStep?.type === "discuss_timer" ? "小組討論" : "教學"}
            </div>
            <h3 className="text-lg font-bold text-gray-800">{segmentTitle}</h3>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 主要內容區 */}
      <div
        ref={contentRef}
        className="rounded-xl border bg-white shadow-sm overflow-hidden"
        style={{ borderColor: `${BRAND.primary}20` }}
      >
        <AnimatePresence mode="wait">
          {/* ─── Lecture 步驟 ─── */}
          {currentStep.type === "lecture" && (
            <motion.div
              key={`lecture-${stepIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-6"
            >
              {/* 重點筆記 */}
              {currentStep.note && (
                <div
                  className="mb-4 px-4 py-2 rounded-lg text-sm border-l-4"
                  style={{
                    borderColor: BRAND.accent,
                    backgroundColor: `${BRAND.accent}08`,
                    color: BRAND.accent,
                  }}
                >
                  📝 {currentStep.note}
                </div>
              )}

              {/* 講解文字 */}
              <div className="text-gray-800 leading-relaxed text-[15px]">
                {phase === "playing_lecture" ? displayed : lectureText}
                {!typingDone && phase === "playing_lecture" && (
                  <span
                    className="inline-block w-1.5 h-5 ml-0.5 align-text-bottom animate-pulse"
                    style={{ backgroundColor: BRAND.primary }}
                  />
                )}
              </div>

              {/* 跳過打字動畫 */}
              {!typingDone && phase === "playing_lecture" && (
                <button
                  onClick={skipToEnd}
                  className="mt-3 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  跳過動畫 →
                </button>
              )}

              {/* 語音播放狀態 */}
              {isPlayingAudio && !isMuted && (
                <div className="flex items-center gap-1.5 mt-3 text-xs" style={{ color: BRAND.story }}>
                  <span className="inline-block w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: BRAND.story }} />
                  語音播放中
                </div>
              )}
            </motion.div>
          )}

          {/* ─── Visual 步驟（雙欄：左文字 + 右圖表）─── */}
          {currentStep.type === "visual" && (() => {
            // 找前一個 lecture 步驟的文字，作為左欄說明
            const prevLecture = (() => {
              for (let i = stepIndex - 1; i >= 0; i--) {
                const s = steps[i];
                if (s?.type === "lecture") return s;
              }
              return null;
            })();

            return (
              <motion.div
                key={`visual-${stepIndex}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-6"
              >
                {prevLecture ? (
                  /* 雙欄佈局：左文字 + 右圖表 */
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="flex flex-col justify-start">
                      {prevLecture.note && (
                        <div
                          className="mb-3 px-3 py-1.5 rounded-lg text-xs border-l-4"
                          style={{
                            borderColor: BRAND.accent,
                            backgroundColor: `${BRAND.accent}08`,
                            color: BRAND.accent,
                          }}
                        >
                          📝 {prevLecture.note}
                        </div>
                      )}
                      <div className="text-gray-700 leading-relaxed text-sm">
                        {prevLecture.text}
                      </div>
                    </div>
                    <div>
                      {renderVisual(currentStep.component, currentStep.props)}
                      {currentStep.caption && (
                        <p className="text-center text-xs text-gray-500 mt-3">
                          {currentStep.caption}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  /* 無前置講解：全寬圖表 */
                  <>
                    {renderVisual(currentStep.component, currentStep.props)}
                    {currentStep.caption && (
                      <p className="text-center text-sm text-gray-500 mt-4">
                        {currentStep.caption}
                      </p>
                    )}
                  </>
                )}
              </motion.div>
            );
          })()}

          {/* ─── Check 步驟 ─── */}
          {currentStep.type === "check" && (
            <motion.div
              key={`check-${stepIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-6"
            >
              {/* 提問（配合語音逐字顯示）*/}
              <div
                className="flex items-start gap-3 mb-5 p-4 rounded-xl"
                style={{ backgroundColor: `${BRAND.primary}06` }}
              >
                <CharacterAvatar character="profLin" size="sm" />
                <div className="flex-1">
                  <p className="text-gray-800 font-medium leading-relaxed">
                    {phase === "asking_check" ? questionDisplayed : currentStep.question}
                    {!questionTypingDone && phase === "asking_check" && (
                      <span
                        className="inline-block w-1.5 h-4 ml-0.5 align-text-bottom animate-pulse"
                        style={{ backgroundColor: BRAND.primary }}
                      />
                    )}
                  </p>
                  {!questionTypingDone && phase === "asking_check" && (
                    <button
                      onClick={skipQuestion}
                      className="mt-2 text-xs text-gray-400 hover:text-gray-600"
                    >
                      跳過動畫 →
                    </button>
                  )}
                </div>
              </div>

              {/* 選項（提問文字打完後才出現）*/}
              {(phase !== "asking_check" || questionTypingDone) && <div className="space-y-2.5">
                {currentStep.options.map((option, i) => {
                  const isSelected = selectedOption === i;
                  const isAnswer = i === currentStep.correctIndex;
                  const showResult = selectedOption !== null;

                  let borderColor = "#e5e7eb";
                  let bgColor = "white";
                  let textColor = "#374151";

                  if (showResult) {
                    if (isAnswer) {
                      borderColor = BRAND.story;
                      bgColor = `${BRAND.story}08`;
                      textColor = BRAND.story;
                    } else if (isSelected && !isAnswer) {
                      borderColor = BRAND.danger;
                      bgColor = `${BRAND.danger}08`;
                      textColor = BRAND.danger;
                    } else {
                      borderColor = "#f3f4f6";
                      bgColor = "#f9fafb";
                      textColor = "#9ca3af";
                    }
                  }

                  return (
                    <motion.button
                      key={i}
                      onClick={() => handleCheckAnswer(i)}
                      disabled={selectedOption !== null}
                      className="w-full text-left px-4 py-3 rounded-xl border-2 transition-all flex items-center gap-3"
                      style={{
                        borderColor,
                        backgroundColor: bgColor,
                        color: textColor,
                      }}
                      whileHover={
                        selectedOption === null
                          ? { scale: 1.01, borderColor: BRAND.primary }
                          : undefined
                      }
                      whileTap={
                        selectedOption === null ? { scale: 0.99 } : undefined
                      }
                    >
                      <span
                        className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-sm font-bold shrink-0"
                        style={{ borderColor }}
                      >
                        {showResult && isAnswer ? (
                          <CheckCircle2
                            className="w-5 h-5"
                            style={{ color: BRAND.story }}
                          />
                        ) : showResult && isSelected && !isAnswer ? (
                          <XCircle
                            className="w-5 h-5"
                            style={{ color: BRAND.danger }}
                          />
                        ) : (
                          String.fromCharCode(65 + i) // A, B, C, D
                        )}
                      </span>
                      <span className="text-[15px]">{option}</span>
                    </motion.button>
                  );
                })}
              </div>}

              {/* 回饋 */}
              <AnimatePresence>
                {phase === "showing_feedback" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-5"
                  >
                    <div
                      className="p-4 rounded-xl border-l-4"
                      style={{
                        borderColor: isCorrect ? BRAND.story : BRAND.accent,
                        backgroundColor: isCorrect
                          ? `${BRAND.story}06`
                          : `${BRAND.accent}06`,
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {isCorrect ? (
                          <CheckCircle2
                            className="w-5 h-5"
                            style={{ color: BRAND.story }}
                          />
                        ) : (
                          <XCircle
                            className="w-5 h-5"
                            style={{ color: BRAND.accent }}
                          />
                        )}
                        <span
                          className="font-bold text-sm"
                          style={{
                            color: isCorrect ? BRAND.story : BRAND.accent,
                          }}
                        >
                          {isCorrect ? "答對了！" : "再想想看"}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {feedbackDisplayed}
                        {!feedbackTypingDone && (
                          <span
                            className="inline-block w-1.5 h-4 ml-0.5 align-text-bottom animate-pulse"
                            style={{ backgroundColor: BRAND.primary }}
                          />
                        )}
                      </p>
                      {!feedbackTypingDone && (
                        <button
                          onClick={skipFeedback}
                          className="mt-2 text-xs text-gray-400 hover:text-gray-600"
                        >
                          跳過動畫 →
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 未回答提示（提問文字打完後才顯示）*/}
              {phase === "asking_check" && questionTypingDone && selectedOption === null && (
                <p className="text-center text-sm text-gray-400 mt-4 animate-pulse">
                  請選擇一個答案才能繼續
                </p>
              )}
            </motion.div>
          )}
          {/* ─── Discuss Timer 步驟 ─── */}
          {currentStep.type === "discuss_timer" && (
            <motion.div
              key={`discuss-${stepIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-6"
            >
              {/* 倒數計時圓環 */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-32 h-32 mb-4">
                  <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="54" fill="none" stroke="#f3f4f6" strokeWidth="8" />
                    <circle
                      cx="60" cy="60" r="54" fill="none"
                      stroke={discussTimeLeft > 0 ? BRAND.story : BRAND.accent}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 54}
                      strokeDashoffset={
                        currentStep.durationMinutes * 60 > 0
                          ? 2 * Math.PI * 54 * (1 - discussTimeLeft / (currentStep.durationMinutes * 60))
                          : 0
                      }
                      className="transition-all duration-1000 ease-linear"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold tabular-nums" style={{ color: discussTimeLeft > 0 ? BRAND.story : BRAND.accent }}>
                      {Math.floor(discussTimeLeft / 60)}:{String(discussTimeLeft % 60).padStart(2, "0")}
                    </span>
                  </div>
                </div>
                {discussTimeLeft <= 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm font-medium"
                    style={{ color: BRAND.accent }}
                  >
                    討論時間結束！
                  </motion.p>
                )}
              </div>

              {/* 討論題目 */}
              <div
                className="p-4 rounded-xl border-l-4 mb-4"
                style={{
                  borderColor: BRAND.story,
                  backgroundColor: `${BRAND.story}06`,
                }}
              >
                <p className="text-gray-800 font-medium leading-relaxed">
                  {currentStep.prompt}
                </p>
              </div>

              {/* 思考方向 */}
              {currentStep.guidePoints && currentStep.guidePoints.length > 0 && (
                <div className="space-y-1.5 text-sm text-gray-600">
                  {currentStep.guidePoints.map((point, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span style={{ color: BRAND.story }}>●</span>
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* 段落摘要卡（step_done 時顯示）*/}
      <AnimatePresence>
        {phase === "step_done" && attemptedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-xl border p-4 text-center"
            style={{
              borderColor: correctCount >= attemptedCount * 0.6 ? `${BRAND.story}40` : `${BRAND.accent}40`,
              backgroundColor: correctCount >= attemptedCount * 0.6 ? `${BRAND.story}06` : `${BRAND.accent}06`,
            }}
          >
            <p className="font-bold text-sm mb-1"
              style={{ color: correctCount >= attemptedCount * 0.6 ? BRAND.story : BRAND.accent }}
            >
              {correctCount === attemptedCount ? "全對！太棒了！" : `本段完成！答對 ${correctCount}/${attemptedCount}`}
            </p>
            <p className="text-xs text-gray-500">
              {correctCount === attemptedCount
                ? "你對這個段落的理解非常到位"
                : correctCount >= attemptedCount * 0.6
                  ? "表現不錯，繼續加油"
                  : "建議回顧一下這個段落的重點內容"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 底部操作列 */}
      <div className="flex items-center justify-between mt-4">
        {/* 左側：上一步按鈕 或 狀態文字 */}
        {stepIndex > 0 ? (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={goBackStep}
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            上一步
          </motion.button>
        ) : (
          <div className="text-xs text-gray-400">
            {phase === "playing_lecture" && "教授正在講解..."}
            {phase === "lecture_done" && isPlayingAudio && "語音播放中..."}
            {phase === "lecture_done" && !isPlayingAudio && "講解完成"}
            {phase === "showing_visual" && "圖表展示"}
            {phase === "asking_check" && !questionTypingDone && "教授正在提問..."}
            {phase === "asking_check" && questionTypingDone && "等待回答"}
            {phase === "showing_feedback" && (isPlayingAudio || !feedbackTypingDone) && "回饋中..."}
            {phase === "showing_feedback" && !isPlayingAudio && feedbackTypingDone && "回饋完成"}
            {phase === "discuss_countdown" && discussTimeLeft > 0 && "小組討論中..."}
            {phase === "discuss_countdown" && discussTimeLeft <= 0 && "討論完成"}
            {phase === "step_done" && "本段完成"}
          </div>
        )}

        {/* 學生按「繼續」才能推進 */}
        {canAdvance && (
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => {
              if (phase === "step_done" && onComplete) {
                onComplete();
              } else {
                advanceStep();
              }
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90"
            style={{ backgroundColor: BRAND.primary }}
          >
            {phase === "step_done" ? (
              onComplete ? (
                <>
                  下一段 <ChevronRight className="w-4 h-4" />
                </>
              ) : (
                "本週結束"
              )
            ) : (
              <>
                繼續 <ChevronRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

// ─── 輔助元件 ────────────────────────────────────

function StepBadge({ step }: { step: TeachingStep }) {
  const label =
    step.type === "lecture"
      ? "講解中"
      : step.type === "check"
        ? "隨堂提問"
        : step.type === "discuss_timer"
          ? "小組討論"
          : "圖表展示";

  const color =
    step.type === "lecture"
      ? BRAND.primary
      : step.type === "check"
        ? BRAND.accent
        : step.type === "discuss_timer"
          ? BRAND.story
          : BRAND.story;

  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full text-white"
      style={{ backgroundColor: color }}
    >
      {label}
    </span>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderVisual(componentName: string, props?: Record<string, any>) {
  const Component = VISUAL_COMPONENTS[componentName];
  if (!Component) {
    return (
      <div className="text-center py-8 text-gray-400">
        圖表元件 {componentName} 尚未建立
      </div>
    );
  }
  return <Component {...(props || {})} />;
}


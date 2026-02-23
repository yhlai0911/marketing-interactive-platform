"use client";

import { useState, useEffect } from "react";
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  SkipForward,
  SkipBack,
  Maximize2,
  Timer,
  BarChart3,
  ListChecks,
} from "lucide-react";
import { getLesson } from "@/data/lessons";
import StoryNarrator from "@/components/lesson/StoryNarrator";
import TheoryExplainer from "@/components/lesson/TheoryExplainer";
import InteractiveQuiz from "@/components/lesson/InteractiveQuiz";
import { BRAND } from "@/components/brand/BrandColors";
import type { LessonSegment } from "@/types";

function DiscussSegmentView({
  segment,
}: {
  segment: Extract<LessonSegment, { type: "discuss" }>;
}) {
  return (
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
  );
}

function MissionSegmentView({
  segment,
}: {
  segment: Extract<LessonSegment, { type: "mission" }>;
}) {
  return (
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
  );
}

function TimerWidget() {
  const [seconds, setSeconds] = useState(300); // 5 分鐘預設
  const [running, setRunning] = useState(false);
  const [inputMinutes, setInputMinutes] = useState(5);

  useEffect(() => {
    if (!running || seconds <= 0) return;
    const interval = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(interval);
  }, [running, seconds]);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div className="bg-white rounded-xl p-4 border">
      <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
        <Timer className="w-4 h-4" /> 計時器
      </h3>
      <div className="text-center">
        <div className="text-4xl font-mono font-bold mb-3" style={{ color: seconds <= 30 ? BRAND.danger : BRAND.primary }}>
          {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </div>
        <div className="flex items-center justify-center gap-2 mb-3">
          <input
            type="number"
            value={inputMinutes}
            onChange={(e) => setInputMinutes(Number(e.target.value))}
            min={1}
            max={60}
            className="w-16 border rounded px-2 py-1 text-center text-sm"
          />
          <span className="text-sm text-gray-500">分鐘</span>
          <button
            onClick={() => {
              setSeconds(inputMinutes * 60);
              setRunning(false);
            }}
            className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
          >
            設定
          </button>
        </div>
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setRunning(!running)}
            className="px-4 py-2 rounded-lg text-white text-sm"
            style={{ backgroundColor: running ? BRAND.danger : BRAND.story }}
          >
            {running ? "暫停" : "開始"}
          </button>
          <button
            onClick={() => {
              setSeconds(inputMinutes * 60);
              setRunning(false);
            }}
            className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-50"
          >
            重設
          </button>
        </div>
      </div>
    </div>
  );
}

function PollWidget() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [votes, setVotes] = useState<number[]>([0, 0, 0, 0]);
  const [active, setActive] = useState(false);

  const startPoll = () => {
    if (question && options.some((o) => o.trim())) {
      setVotes(options.map(() => 0));
      setActive(true);
    }
  };

  const vote = (index: number) => {
    setVotes((prev) => prev.map((v, i) => (i === index ? v + 1 : v)));
  };

  const totalVotes = votes.reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white rounded-xl p-4 border">
      <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
        <BarChart3 className="w-4 h-4" /> 即時投票
      </h3>
      {!active ? (
        <div className="space-y-2">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="投票問題..."
            className="w-full border rounded px-3 py-2 text-sm"
          />
          {options.map((opt, i) => (
            <input
              key={i}
              value={opt}
              onChange={(e) => {
                const newOpts = [...options];
                newOpts[i] = e.target.value;
                setOptions(newOpts);
              }}
              placeholder={`選項 ${String.fromCharCode(65 + i)}`}
              className="w-full border rounded px-3 py-1.5 text-sm"
            />
          ))}
          <button
            onClick={startPoll}
            className="w-full py-2 rounded-lg text-white text-sm font-medium"
            style={{ backgroundColor: BRAND.primary }}
          >
            發起投票
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="font-medium text-sm mb-2">{question}</p>
          {options
            .filter((o) => o.trim())
            .map((opt, i) => {
              const pct = totalVotes > 0 ? (votes[i] / totalVotes) * 100 : 0;
              return (
                <button
                  key={i}
                  onClick={() => vote(i)}
                  className="w-full text-left rounded-lg border p-2 text-sm relative overflow-hidden hover:border-[var(--zhen-accent)] transition-colors"
                >
                  <div
                    className="absolute inset-y-0 left-0 opacity-20"
                    style={{ width: `${pct}%`, backgroundColor: BRAND.accent }}
                  />
                  <span className="relative">
                    {String.fromCharCode(65 + i)}. {opt}
                    <span className="float-right text-gray-500">
                      {votes[i]} ({pct.toFixed(0)}%)
                    </span>
                  </span>
                </button>
              );
            })}
          <div className="text-xs text-gray-500 text-center">
            共 {totalVotes} 票
          </div>
          <button
            onClick={() => setActive(false)}
            className="w-full py-1.5 rounded-lg border text-sm hover:bg-gray-50"
          >
            結束投票
          </button>
        </div>
      )}
    </div>
  );
}

export default function ClassroomPage() {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [currentSegment, setCurrentSegment] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const lesson = getLesson(selectedWeek);

  const handleNext = () => {
    if (lesson && currentSegment < lesson.segments.length - 1) {
      setCurrentSegment(currentSegment + 1);
    }
  };

  const handlePrev = () => {
    if (currentSegment > 0) {
      setCurrentSegment(currentSegment - 1);
    }
  };


  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const segment = lesson?.segments[currentSegment];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-[calc(100vh-4rem)]">
        {/* 左側：控制面板 */}
        <div className="w-80 bg-white border-r overflow-y-auto p-4 space-y-4 shrink-0">
          <div>
            <h2 className="font-bold text-lg mb-3 flex items-center gap-2" style={{ color: BRAND.primary }}>
              <ListChecks className="w-5 h-5" /> 教師控制台
            </h2>

            {/* 週次選擇 */}
            <label className="text-sm font-medium text-gray-600 block mb-1">選擇週次</label>
            <select
              value={selectedWeek}
              onChange={(e) => {
                setSelectedWeek(Number(e.target.value));
                setCurrentSegment(0);
              }}
              className="w-full border rounded-lg px-3 py-2 text-sm mb-4"
            >
              {Array.from({ length: 9 }, (_, i) => i + 1).map((w) => (
                <option key={w} value={w}>
                  Week {w}
                </option>
              ))}
            </select>

            {/* 段落列表 */}
            {lesson && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600 block mb-1">段落</label>
                {lesson.segments.map((seg, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSegment(i)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      i === currentSegment
                        ? "bg-[var(--zhen-primary)] text-white"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-xs opacity-70">{seg.type}</span>
                    {" — "}
                    {"title" in seg ? seg.title : seg.type === "quiz" ? "測驗" : ""}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 控制按鈕 */}
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              disabled={currentSegment === 0}
              className="flex-1 py-2 rounded-lg border text-sm flex items-center justify-center gap-1 hover:bg-gray-50 disabled:opacity-30"
            >
              <SkipBack className="w-4 h-4" /> 上一步
            </button>
            <button
              onClick={handleNext}
              disabled={!lesson || currentSegment === lesson.segments.length - 1}
              className="flex-1 py-2 rounded-lg text-white text-sm flex items-center justify-center gap-1 disabled:opacity-30"
              style={{ backgroundColor: BRAND.primary }}
            >
              下一步 <SkipForward className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={toggleFullscreen}
            className="w-full py-2 rounded-lg border text-sm flex items-center justify-center gap-1 hover:bg-gray-50"
          >
            <Maximize2 className="w-4 h-4" /> 全螢幕
          </button>

          <TimerWidget />
          <PollWidget />
        </div>

        {/* 右側：預覽區 */}
        <div className="flex-1 overflow-y-auto p-8">
          {lesson && segment ? (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-6">
                <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ backgroundColor: BRAND.primary }}>
                  Week {selectedWeek} — 段落 {currentSegment + 1}/{lesson.segments.length}
                </span>
              </div>
              {segment.type === "story" && (
                <StoryNarrator segment={segment} />
              )}
              {segment.type === "theory" && <TheoryExplainer segment={segment} />}
              {segment.type === "quiz" && <InteractiveQuiz segment={segment} />}
              {segment.type === "discuss" && <DiscussSegmentView segment={segment} />}
              {segment.type === "mission" && <MissionSegmentView segment={segment} />}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              選擇週次和段落以開始
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

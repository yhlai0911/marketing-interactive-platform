"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Volume2, Loader2, ChevronRight } from "lucide-react";
import CharacterAvatar from "@/components/brand/CharacterAvatar";
import { BRAND } from "@/components/brand/BrandColors";
import type { LessonSegment } from "@/types";

interface TeachingNarratorProps {
  segment: LessonSegment;
  weekNum: number;
  weekTitle: string;
  segmentIndex: number;
  totalSegments: number;
  onComplete?: () => void;
}

type TeachState = "loading" | "streaming" | "done" | "error";

export default function TeachingNarrator({
  segment,
  weekNum,
  weekTitle,
  segmentIndex,
  totalSegments,
  onComplete,
}: TeachingNarratorProps) {
  const [teachState, setTeachState] = useState<TeachState>("loading");
  const [text, setText] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Fetch teaching content when segment changes
  useEffect(() => {
    setText("");
    setTeachState("loading");
    setError("");

    // Abort previous request
    if (abortRef.current) {
      abortRef.current.abort();
    }

    const abortController = new AbortController();
    abortRef.current = abortController;

    const fetchTeaching = async () => {
      try {
        const res = await fetch("/api/teach", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            segment,
            weekNum,
            weekTitle,
            segmentIndex,
            totalSegments,
          }),
          signal: abortController.signal,
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({ error: "Unknown error" }));
          throw new Error(body.error || `HTTP ${res.status}`);
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        setTeachState("streaming");

        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          // Keep the last incomplete line in buffer
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6);

            if (data === "[DONE]") {
              setTeachState("done");
              continue;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                setText((prev) => prev + parsed.content);
              }
              if (parsed.error) {
                setError(parsed.error);
                setTeachState("error");
              }
            } catch {
              // skip malformed JSON
            }
          }
        }

        // If we haven't set done yet
        setTeachState((prev) => (prev === "streaming" ? "done" : prev));
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setError((err as Error).message);
        setTeachState("error");
      }
    };

    fetchTeaching();

    return () => {
      abortController.abort();
    };
  }, [segment, weekNum, weekTitle, segmentIndex, totalSegments]);

  // Auto-scroll as text streams in
  useEffect(() => {
    if (textContainerRef.current && teachState === "streaming") {
      textContainerRef.current.scrollTop = textContainerRef.current.scrollHeight;
    }
  }, [text, teachState]);

  // Play TTS for the generated teaching text
  const handlePlayVoice = useCallback(async () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(false);
      return;
    }

    if (!text) return;

    try {
      setIsPlaying(true);
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, character: "profLin" }),
      });

      if (!res.ok) {
        setIsPlaying(false);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(url);
        audioRef.current = null;
      };

      audio.onerror = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(url);
        audioRef.current = null;
      };

      await audio.play();
    } catch {
      setIsPlaying(false);
    }
  }, [text, isPlaying]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const segmentTitle =
    segment.type === "quiz" ? segment.title || "互動測驗" : segment.title;

  const segmentTypeLabel =
    segment.type === "story" ? "故事講解" :
    segment.type === "theory" ? "理論講解" :
    segment.type === "quiz" ? "測驗引導" :
    segment.type === "discuss" ? "討論引導" :
    "任務說明";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      {/* Header: Professor Chen is teaching */}
      <div className="flex items-center gap-3 mb-5">
        <CharacterAvatar character="profLin" size="lg" />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900">林教授</span>
            <span
              className="text-xs px-2 py-0.5 rounded-full text-white"
              style={{ backgroundColor: BRAND.primary }}
            >
              {segmentTypeLabel}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">{segmentTitle}</p>
        </div>

        {/* Teaching state indicator */}
        {teachState === "loading" && (
          <div className="ml-auto flex items-center gap-1.5 text-sm text-gray-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            準備講解中…
          </div>
        )}
        {teachState === "streaming" && (
          <div className="ml-auto flex items-center gap-1.5 text-sm" style={{ color: BRAND.story }}>
            <span className="inline-block w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: BRAND.story }} />
            正在講解
          </div>
        )}
      </div>

      {/* Teaching content */}
      <div
        ref={textContainerRef}
        className="rounded-xl border bg-white p-6 shadow-sm max-h-[60vh] overflow-y-auto"
        style={{ borderColor: `${BRAND.primary}30` }}
      >
        {teachState === "loading" && !text && (
          <div className="flex items-center justify-center py-8 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            陳教授正在組織講解內容…
          </div>
        )}

        {text && (
          <div className="text-gray-800 leading-relaxed whitespace-pre-wrap text-[15px]">
            {text}
            {teachState === "streaming" && (
              <span className="inline-block w-1.5 h-5 ml-0.5 align-text-bottom animate-pulse" style={{ backgroundColor: BRAND.primary }} />
            )}
          </div>
        )}

        {teachState === "error" && (
          <div className="text-red-500 text-sm py-4">
            教學內容產生失敗：{error || "未知錯誤"}
            <br />
            <span className="text-gray-400">請確認 OPENAI_API_KEY 已正確設定。</span>
          </div>
        )}
      </div>

      {/* Action buttons */}
      {teachState === "done" && text && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mt-4"
        >
          <button
            onClick={handlePlayVoice}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90"
            style={{ backgroundColor: isPlaying ? BRAND.danger : BRAND.story }}
          >
            <Volume2 className="w-4 h-4" />
            {isPlaying ? "停止播放" : "語音播放"}
          </button>

          {onComplete && (
            <button
              onClick={onComplete}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90"
              style={{ backgroundColor: BRAND.primary }}
            >
              下一段 <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

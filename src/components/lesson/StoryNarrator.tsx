"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import CharacterAvatar from "@/components/brand/CharacterAvatar";
import { CHARACTER_NAMES, CHARACTER_COLORS } from "@/components/brand/BrandColors";
import type { StorySegment, CharacterId } from "@/types";

interface StoryNarratorProps {
  segment: StorySegment;
  onComplete?: () => void;
}

type PlayState = "idle" | "playing" | "paused";

export default function StoryNarrator({ segment, onComplete }: StoryNarratorProps) {
  const [playState, setPlayState] = useState<PlayState>("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayVoice = useCallback(async (text: string, character: CharacterId) => {
    try {
      // Stop any current playback
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      setPlayState("playing");

      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, character }),
      });

      if (!res.ok) {
        setPlayState("idle");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        setPlayState("idle");
        URL.revokeObjectURL(url);
        audioRef.current = null;
      };

      audio.onerror = () => {
        setPlayState("idle");
        URL.revokeObjectURL(url);
        audioRef.current = null;
      };

      await audio.play();
    } catch {
      setPlayState("idle");
    }
  }, []);

  const togglePause = useCallback(() => {
    if (!audioRef.current) return;
    if (playState === "playing") {
      audioRef.current.pause();
      setPlayState("paused");
    } else if (playState === "paused") {
      audioRef.current.play();
      setPlayState("playing");
    }
  }, [playState]);

  return (
    <div className="space-y-6">
      {/* Narration text */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="prose prose-lg max-w-none text-gray-700 leading-relaxed italic"
        style={{ fontFamily: "serif" }}
      >
        {segment.narration}
      </motion.div>

      {/* Dialogue bubbles */}
      <div className="space-y-4">
        {segment.dialogues.map((line, i) => {
          const charColor = CHARACTER_COLORS[line.character] ?? "#7F8C8D";
          const charName = CHARACTER_NAMES[line.character] ?? "???";

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.15 }}
              className="flex items-start gap-3"
            >
              <CharacterAvatar character={line.character} size="md" />

              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold" style={{ color: charColor }}>
                  {charName}
                </span>
                <div
                  className="mt-1 rounded-lg px-4 py-2.5 text-sm text-gray-800"
                  style={{ backgroundColor: `${charColor}14`, borderLeft: `3px solid ${charColor}` }}
                >
                  {line.text}
                </div>
              </div>

              {/* Voice play button */}
              <button
                onClick={() => handlePlayVoice(line.text, line.character)}
                className="shrink-0 mt-5 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                title="播放語音"
              >
                <Volume2 className="w-4 h-4 text-gray-400" />
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Global play/pause control */}
      {playState !== "idle" && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={togglePause}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white transition-colors",
            playState === "playing" ? "bg-[#1B3A5C]" : "bg-[#D4A843]",
          )}
        >
          {playState === "playing" ? (
            <>
              <Pause className="w-4 h-4" /> 暫停
            </>
          ) : (
            <>
              <Play className="w-4 h-4" /> 繼續
            </>
          )}
        </motion.button>
      )}

      {/* Complete button */}
      {onComplete && (
        <div className="pt-2">
          <button
            onClick={onComplete}
            className="text-sm text-[#1B3A5C] hover:underline"
          >
            繼續下一段 &rarr;
          </button>
        </div>
      )}
    </div>
  );
}

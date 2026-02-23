"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/components/brand/BrandColors";
import type { SegmentType } from "@/types";

/** 類型→色碼對應 */
const TYPE_COLORS: Record<SegmentType, string> = {
  story: BRAND.story,      // 抹茶綠
  theory: BRAND.primary,   // 深藍
  quiz: BRAND.accent,      // 琥珀金
  discuss: "#0891B2",      // 青色 (cyan-600)
  mission: BRAND.accent,   // 金色（與 quiz 同色系）
};

interface LessonProgressProps {
  current: number;
  total: number;
  titles: string[];
  types?: SegmentType[];
  maxReached: number;
  onNavigate?: (index: number) => void;
}

export default function LessonProgress({
  current,
  total,
  titles,
  types,
  maxReached,
  onNavigate,
}: LessonProgressProps) {
  const pct = total > 0 ? ((maxReached + 1) / total) * 100 : 0;
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  // 自動捲動到當前段落
  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      activeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [current]);

  return (
    <div className="space-y-1.5 px-4 pb-3">
      {/* 薄進度條 */}
      <div className="relative h-1 w-full rounded-full bg-gray-200 overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ backgroundColor: BRAND.primary }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Pill 導航列 */}
      <div
        ref={scrollRef}
        className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {Array.from({ length: total }).map((_, i) => {
          const isActive = i === current;
          const isReachable = i <= maxReached;
          const isDone = i < current && isReachable;
          const title = titles[i] ?? `段落 ${i + 1}`;
          const segType = types?.[i];
          const typeColor = segType ? TYPE_COLORS[segType] : BRAND.primary;

          // 截斷標題 ≤ 6 字
          const shortTitle = title.length > 6 ? title.slice(0, 6) + "…" : title;

          return (
            <button
              key={i}
              ref={isActive ? activeRef : undefined}
              onClick={() => {
                if (isReachable && onNavigate) onNavigate(i);
              }}
              disabled={!isReachable}
              title={isReachable ? title : `${title} (尚未解鎖)`}
              className={cn(
                "relative shrink-0 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap",
                "border",
                isReachable ? "cursor-pointer" : "cursor-not-allowed",
              )}
              style={{
                scrollSnapAlign: "center",
                backgroundColor: isActive
                  ? typeColor
                  : isDone
                    ? `${typeColor}18`
                    : isReachable
                      ? `${typeColor}0A`
                      : "#F3F4F6",
                color: isActive
                  ? "#FFFFFF"
                  : isDone
                    ? typeColor
                    : isReachable
                      ? `${typeColor}CC`
                      : "#9CA3AF",
                borderColor: isActive
                  ? typeColor
                  : isDone
                    ? `${typeColor}40`
                    : isReachable
                      ? `${typeColor}30`
                      : "#E5E7EB",
                boxShadow: isActive ? `0 0 0 2px ${typeColor}30` : undefined,
              }}
            >
              <span className="flex items-center gap-1">
                {isDone && <Check className="w-3 h-3" />}
                {!isReachable && <Lock className="w-3 h-3" />}
                {shortTitle}
              </span>
            </button>
          );
        })}
      </div>

      {/* 底部資訊列 */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{current + 1}. {titles[current] ?? ""}</span>
        <span className="tabular-nums">
          {current + 1} / {total}
        </span>
      </div>
    </div>
  );
}

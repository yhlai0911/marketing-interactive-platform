"use client";

import { motion } from "framer-motion";
import { BookOpen, Users, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/components/brand/BrandColors";

export type Mode = "self" | "class" | "quiz";

interface ModeSwitchProps {
  mode: Mode;
  onChange: (mode: Mode) => void;
  quizCount?: number; // 測驗題數（顯示在 badge 上）
}

const MODES: { key: Mode; label: string; icon: typeof BookOpen }[] = [
  { key: "self", label: "自學閱讀", icon: BookOpen },
  { key: "class", label: "課堂教學", icon: Users },
  { key: "quiz", label: "自我測驗", icon: ClipboardCheck },
];

export default function ModeSwitch({ mode, onChange, quizCount }: ModeSwitchProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-gray-100 p-1">
      {MODES.map(({ key, label, icon: Icon }) => {
        const isActive = mode === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={cn(
              "relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              isActive ? "text-white" : "text-gray-500 hover:text-gray-700",
            )}
          >
            {isActive && (
              <motion.span
                layoutId="mode-bg"
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: BRAND.primary }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <Icon className="relative z-10 w-4 h-4" />
            <span className="relative z-10">{label}</span>
            {key === "quiz" && quizCount && !isActive && (
              <span className="relative z-10 ml-0.5 text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-bold">
                {quizCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

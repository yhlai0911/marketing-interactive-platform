import { cn } from "@/lib/utils";
import { CHARACTER_COLORS, CHARACTER_NAMES } from "@/components/brand/BrandColors";
import type { CharacterId } from "@/types";

interface CharacterAvatarProps {
  character: CharacterId;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-base",
} as const;

export default function CharacterAvatar({ character, size = "md" }: CharacterAvatarProps) {
  const name = CHARACTER_NAMES[character] ?? "?";
  const color = CHARACTER_COLORS[character] ?? "#7F8C8D";
  const initial = name.charAt(0);

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-bold text-white shrink-0 select-none",
        sizeMap[size],
      )}
      style={{ backgroundColor: color }}
      title={name}
    >
      {initial}
    </div>
  );
}

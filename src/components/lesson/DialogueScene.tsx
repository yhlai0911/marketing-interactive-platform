"use client";

import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import CharacterAvatar from "@/components/brand/CharacterAvatar";
import { CHARACTER_NAMES, CHARACTER_COLORS } from "@/components/brand/BrandColors";
import type { DialogueLine, CharacterId } from "@/types";

interface DialogueSceneProps {
  dialogues: DialogueLine[];
  onPlayVoice?: (text: string, character: CharacterId) => void;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18 } },
};

const bubble = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35 } },
};

export default function DialogueScene({ dialogues, onPlayVoice }: DialogueSceneProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      {dialogues.map((line, i) => {
        const color = CHARACTER_COLORS[line.character] ?? "#7F8C8D";
        const name = CHARACTER_NAMES[line.character] ?? "???";

        return (
          <motion.div key={i} variants={bubble} className="flex items-start gap-3">
            <CharacterAvatar character={line.character} size="md" />

            <div className="flex-1 min-w-0">
              <span className="text-xs font-semibold" style={{ color }}>
                {name}
              </span>
              <div
                className="mt-1 rounded-lg px-4 py-2.5 text-sm text-gray-800"
                style={{
                  backgroundColor: `${color}14`,
                  borderLeft: `3px solid ${color}`,
                }}
              >
                {line.text}
              </div>
            </div>

            {onPlayVoice && (
              <button
                onClick={() => onPlayVoice(line.text, line.character)}
                className="shrink-0 mt-5 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                title="播放語音"
              >
                <Volume2 className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

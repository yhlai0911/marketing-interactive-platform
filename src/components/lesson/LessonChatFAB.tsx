"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, Trash2, MessageCircleQuestion } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import CharacterAvatar from "@/components/brand/CharacterAvatar";
import { BRAND } from "@/components/brand/BrandColors";
import { buildLessonContext } from "@/lib/lesson-chat-context";
import {
  type LessonChatMessage,
  loadLessonChat,
  saveLessonChat,
  clearLessonChat,
  trimMessages,
} from "@/lib/lesson-chat-storage";
import type { LessonSegment, TeachingStep } from "@/types";
import type { FormulaItem } from "@/components/visuals/FormulaQuickRef";

// ─── 建議問題（依段落類型動態生成）───────────────
const SUGGESTIONS: Record<string, string[]> = {
  story: ["這段故事跟行銷有什麼關係？", "可以解釋故事裡提到的概念嗎？"],
  theory: ["可以用更簡單的方式解釋嗎？", "可以給一個生活化的例子嗎？", "這個公式怎麼推導的？"],
  quiz: ["為什麼正確答案是那個？", "這題考的觀念是什麼？"],
  discuss: ["可以給我一些思考方向嗎？", "有哪些不同的觀點？"],
  mission: ["這個任務要怎麼開始？", "有什麼推薦的步驟？"],
};

interface LessonChatFABProps {
  weekNum: number;
  weekTitle: string;
  currentSegment: LessonSegment;
  currentSegmentIndex: number;
  totalSegments: number;
  segmentTitle: string;
  teachingSteps?: TeachingStep[];
  formulas?: FormulaItem[];
}

export default function LessonChatFAB({
  weekNum,
  weekTitle,
  currentSegment,
  currentSegmentIndex,
  totalSegments,
  segmentTitle,
  teachingSteps,
  formulas,
}: LessonChatFABProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<LessonChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const prevSegmentRef = useRef(currentSegmentIndex);

  // ─── 建構 context string ──────────────────────
  const contextString = useMemo(
    () =>
      buildLessonContext({
        weekNum,
        weekTitle,
        segment: currentSegment,
        segmentIndex: currentSegmentIndex,
        totalSegments,
        teachingSteps,
        formulas,
      }),
    [weekNum, weekTitle, currentSegment, currentSegmentIndex, totalSegments, teachingSteps, formulas],
  );

  // ─── 載入對話 ─────────────────────────────────
  useEffect(() => {
    setMessages(loadLessonChat(weekNum));
  }, [weekNum]);

  // ─── 自動捲動 ─────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ─── 開啟面板時 focus 輸入框 ──────────────────
  useEffect(() => {
    if (open) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  // ─── 段落切換時插入分隔線 ─────────────────────
  useEffect(() => {
    if (prevSegmentRef.current !== currentSegmentIndex && messages.length > 0) {
      const divider: LessonChatMessage = {
        role: "assistant",
        content: `---\n*已切換到：${segmentTitle}*\n---`,
        timestamp: Date.now(),
      };
      const updated = [...messages, divider];
      setMessages(updated);
      saveLessonChat(weekNum, updated);
    }
    prevSegmentRef.current = currentSegmentIndex;
  }, [currentSegmentIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Escape 關閉面板 ─────────────────────────
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  // ─── 送出訊息 ─────────────────────────────────
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming) return;

      const userMsg: LessonChatMessage = {
        role: "user",
        content: text.trim(),
        timestamp: Date.now(),
      };

      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      setInput("");
      setIsStreaming(true);

      // 傳給 API 的訊息要截斷
      const apiMessages = trimMessages(newMessages).map(m => ({
        role: m.role,
        content: m.content,
      }));

      try {
        const res = await fetch("/api/lesson-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: apiMessages,
            weekNum,
            lessonContext: contextString,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Request failed");
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let assistantContent = "";
        const assistantMsg: LessonChatMessage = {
          role: "assistant",
          content: "",
          timestamp: Date.now(),
        };

        setMessages([...newMessages, assistantMsg]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n").filter(l => l.startsWith("data: "));

          for (const line of lines) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                assistantContent += parsed.content;
                setMessages(prev => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    ...updated[updated.length - 1],
                    content: assistantContent,
                  };
                  return updated;
                });
              }
            } catch {
              // skip malformed
            }
          }
        }

        const finalMessages: LessonChatMessage[] = [
          ...newMessages,
          { role: "assistant", content: assistantContent, timestamp: Date.now() },
        ];
        setMessages(finalMessages);
        saveLessonChat(weekNum, finalMessages);

        // 面板關閉時顯示紅點
        if (!open) setHasUnread(true);
      } catch (error) {
        const errorMsg: LessonChatMessage = {
          role: "assistant",
          content: `抱歉，我暫時無法回答。${(error as Error).message || "請稍後再試。"}`,
          timestamp: Date.now(),
        };
        const final = [...newMessages, errorMsg];
        setMessages(final);
        saveLessonChat(weekNum, final);
      } finally {
        setIsStreaming(false);
      }
    },
    [messages, isStreaming, weekNum, contextString, open],
  );

  const handleClear = useCallback(() => {
    clearLessonChat(weekNum);
    setMessages([]);
  }, [weekNum]);

  const suggestions = SUGGESTIONS[currentSegment.type] ?? SUGGESTIONS.theory;

  return (
    <>
      {/* ─── FAB 按鈕 ─── */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
        style={{ backgroundColor: BRAND.primary }}
        title="AI 助教"
      >
        <div className="relative p-1">
          <CharacterAvatar character="profLin" size="md" />
          {/* 未讀紅點 */}
          {hasUnread && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white" />
          )}
        </div>
      </button>

      {/* ─── Chat Panel ─── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/20 z-50 sm:bg-transparent sm:pointer-events-none"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[400px] bg-white shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div
                className="px-4 py-3 flex items-center justify-between shrink-0"
                style={{ backgroundColor: BRAND.primary }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <CharacterAvatar character="profLin" size="sm" />
                  <div className="text-white min-w-0">
                    <div className="text-sm font-bold">AI 助教</div>
                    <div className="text-xs text-white/70 truncate">
                      Week {weekNum} · {segmentTitle}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleClear}
                    className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                    title="清除對話"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && (
                  <div className="text-center py-6">
                    <MessageCircleQuestion
                      className="w-10 h-10 mx-auto mb-3 opacity-30"
                      style={{ color: BRAND.primary }}
                    />
                    <p className="text-sm text-gray-500 mb-4">
                      有任何關於本段內容的問題，隨時問我！
                    </p>
                    <div className="flex flex-col gap-2">
                      {suggestions.map(q => (
                        <button
                          key={q}
                          onClick={() => sendMessage(q)}
                          className="w-full text-left px-3 py-2 rounded-lg text-sm border hover:bg-gray-50 transition-colors"
                          style={{ borderColor: `${BRAND.accent}60`, color: BRAND.primary }}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    {msg.role === "assistant" && (
                      <CharacterAvatar character="profLin" size="sm" />
                    )}
                    <div
                      className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "text-white rounded-br-none"
                          : "bg-gray-100 rounded-bl-none"
                      }`}
                      style={msg.role === "user" ? { backgroundColor: BRAND.primary } : undefined}
                    >
                      {msg.role === "assistant" ? (
                        <ReactMarkdown
                          remarkPlugins={[remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                          components={{
                            p: ({ children }) => <p className="mb-1.5 last:mb-0">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc pl-4 mb-1.5">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal pl-4 mb-1.5">{children}</ol>,
                            strong: ({ children }) => (
                              <strong className="font-bold" style={{ color: BRAND.primary }}>
                                {children}
                              </strong>
                            ),
                            hr: () => (
                              <hr className="my-2 border-dashed" style={{ borderColor: `${BRAND.accent}40` }} />
                            ),
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      ) : (
                        <p>{msg.content}</p>
                      )}
                    </div>
                  </div>
                ))}

                {isStreaming && (
                  <div className="flex items-center gap-2 text-gray-400 text-xs">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    思考中...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggestions when there are messages */}
              {messages.length > 0 && !isStreaming && (
                <div className="px-4 pb-2 flex gap-1.5 overflow-x-auto">
                  {suggestions.slice(0, 2).map(q => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="shrink-0 px-2.5 py-1 rounded-full text-xs border hover:bg-gray-50 transition-colors"
                      style={{ borderColor: `${BRAND.accent}60`, color: BRAND.primary }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="border-t p-3 flex items-end gap-2 shrink-0">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                      e.preventDefault();
                      sendMessage(input);
                    }
                  }}
                  placeholder="輸入問題...（Enter 送出）"
                  rows={1}
                  className="flex-1 resize-none rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                  style={{ "--tw-ring-color": BRAND.accent } as React.CSSProperties}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isStreaming}
                  className="px-3 py-2 rounded-xl text-white transition-all disabled:opacity-30"
                  style={{ backgroundColor: BRAND.primary }}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

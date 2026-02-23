"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Loader2,
  Trash2,
  Plus,
  Paperclip,
  X,
  MessageSquare,
  Image as ImageIcon,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { BRAND } from "@/components/brand/BrandColors";
import CharacterAvatar from "@/components/brand/CharacterAvatar";
import type { ChatMessage, ChatAttachment } from "@/types";
import {
  type ChatThread,
  type StoredMessage,
  loadThreads,
  createThread,
  deleteThread,
  loadMessages,
  saveMessages,
  migrateOldChat,
  extractTextFromFile,
  fileToBase64,
  isImageFile,
} from "@/lib/chat-storage";

const SUGGESTED_QUESTIONS = [
  { week: 1, questions: ["什麼是國際化動機？", "金本位制度是怎麼運作的？", "珍途為什麼要出海？"] },
  { week: 2, questions: ["什麼是交叉匯率？", "買賣價差代表什麼？", "即期匯率和遠期匯率有什麼不同？"] },
  { week: 3, questions: ["什麼是購買力平價？", "大麥克指數怎麼用？", "PPP 在實務上有什麼限制？"] },
  { week: 4, questions: ["利率平價是什麼？", "費雪效果如何影響匯率？", "套利是什麼意思？"] },
  { week: 5, questions: ["NPV 怎麼算？", "APV 方法和 NPV 有什麼不同？", "如何預測匯率？"] },
];

export default function TutorPage() {
  // ─── Thread state ────────────────────────────
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ─── Chat state ──────────────────────────────
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(1);

  // ─── Attachment state ────────────────────────
  const [pendingAttachments, setPendingAttachments] = useState<ChatAttachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ─── Initialize: migrate old data + load threads ─
  useEffect(() => {
    const migrated = migrateOldChat();
    const loaded = loadThreads();
    setThreads(loaded);
    if (migrated) {
      setActiveThreadId(migrated);
    } else if (loaded.length > 0) {
      setActiveThreadId(loaded[0].id);
    }
  }, []);

  // ─── Load messages when thread changes ───────
  useEffect(() => {
    if (activeThreadId) {
      const msgs = loadMessages(activeThreadId);
      setMessages(msgs as ChatMessage[]);
      const thread = threads.find((t) => t.id === activeThreadId);
      if (thread) setSelectedWeek(thread.week);
    } else {
      setMessages([]);
    }
  }, [activeThreadId, threads]);

  // ─── Auto-scroll ─────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ─── Paste image handler ─────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of Array.from(items)) {
        if (item.type.startsWith("image/")) {
          e.preventDefault();
          const file = item.getAsFile();
          if (!file) continue;

          const reader = new FileReader();
          reader.onload = () => {
            const dataUrl = reader.result as string;
            const base64 = dataUrl.split(",")[1] || dataUrl;
            setPendingAttachments((prev) => [
              ...prev,
              {
                type: "image" as const,
                name: `clipboard-${Date.now()}.png`,
                mimeType: file.type,
                data: base64,
                previewUrl: dataUrl,
              },
            ]);
          };
          reader.readAsDataURL(file);
        }
      }
    };

    el.addEventListener("paste", handlePaste);
    return () => el.removeEventListener("paste", handlePaste);
  }, []);

  // ─── Thread actions ──────────────────────────
  const handleNewThread = useCallback(() => {
    const thread = createThread(selectedWeek);
    setThreads(loadThreads());
    setActiveThreadId(thread.id);
    setMessages([]);
    setPendingAttachments([]);
  }, [selectedWeek]);

  const handleDeleteThread = useCallback(
    (id: string) => {
      deleteThread(id);
      const updated = loadThreads();
      setThreads(updated);
      if (activeThreadId === id) {
        setActiveThreadId(updated.length > 0 ? updated[0].id : null);
      }
    },
    [activeThreadId]
  );

  const handleSelectThread = useCallback((id: string) => {
    setActiveThreadId(id);
    setPendingAttachments([]);
  }, []);

  // ─── File upload handler ─────────────────────
  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      if (isImageFile(file)) {
        const base64 = await fileToBase64(file);
        const previewUrl = URL.createObjectURL(file);
        setPendingAttachments((prev) => [
          ...prev,
          { type: "image", name: file.name, mimeType: file.type, data: base64, previewUrl },
        ]);
      } else {
        const text = await extractTextFromFile(file);
        setPendingAttachments((prev) => [
          ...prev,
          { type: "file", name: file.name, mimeType: file.type, data: text },
        ]);
      }
    }
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const removeAttachment = useCallback((index: number) => {
    setPendingAttachments((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // ─── Send message ────────────────────────────
  const sendMessage = useCallback(
    async (text: string) => {
      if ((!text.trim() && pendingAttachments.length === 0) || isStreaming) return;

      // Auto-create thread if none active
      let threadId = activeThreadId;
      if (!threadId) {
        const thread = createThread(selectedWeek);
        setThreads(loadThreads());
        setActiveThreadId(thread.id);
        threadId = thread.id;
      }

      const userMsg: ChatMessage = {
        role: "user",
        content: text.trim(),
        timestamp: Date.now(),
        attachments: pendingAttachments.length > 0 ? [...pendingAttachments] : undefined,
      };

      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      setInput("");
      setPendingAttachments([]);
      setIsStreaming(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: newMessages.map((m) => ({
              role: m.role,
              content: m.content,
              attachments: m.attachments,
            })),
            week: selectedWeek,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Chat request failed");
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let assistantContent = "";

        const assistantMsg: ChatMessage = {
          role: "assistant",
          content: "",
          timestamp: Date.now(),
        };

        setMessages([...newMessages, assistantMsg]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

          for (const line of lines) {
            const data = line.slice(6);
            if (data === "[DONE]") break;

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                assistantContent += parsed.content;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    ...updated[updated.length - 1],
                    content: assistantContent,
                  };
                  return updated;
                });
              }
            } catch {
              // skip malformed data
            }
          }
        }

        const finalMessages: ChatMessage[] = [
          ...newMessages,
          { role: "assistant", content: assistantContent, timestamp: Date.now() },
        ];
        setMessages(finalMessages);
        saveMessages(threadId, finalMessages as StoredMessage[]);
        setThreads(loadThreads());
      } catch (error) {
        console.error("Chat error:", error);
        const errorMsg: ChatMessage = {
          role: "assistant",
          content: `抱歉，我暫時無法回答。${(error as Error).message || "請稍後再試。"}`,
          timestamp: Date.now(),
        };
        const final = [...newMessages, errorMsg];
        setMessages(final);
        saveMessages(threadId, final as StoredMessage[]);
      } finally {
        setIsStreaming(false);
      }
    },
    [messages, isStreaming, selectedWeek, activeThreadId, pendingAttachments]
  );

  const currentSuggestions =
    SUGGESTED_QUESTIONS.find((s) => s.week === selectedWeek)?.questions || SUGGESTED_QUESTIONS[0].questions;

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) {
      return d.toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" });
    }
    return d.toLocaleDateString("zh-TW", { month: "short", day: "numeric" });
  };

  return (
    <div ref={containerRef} className="fixed top-16 inset-x-0 bottom-0 bg-gray-50 flex overflow-hidden">
      {/* ─── 側邊欄：對話串列表 ─── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white border-r flex flex-col overflow-hidden shrink-0"
          >
            {/* 側邊欄標題 */}
            <div className="p-3 border-b flex items-center justify-between">
              <h2 className="font-bold text-sm" style={{ color: BRAND.primary }}>
                對話紀錄
              </h2>
              <button
                onClick={handleNewThread}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                title="新對話"
              >
                <Plus className="w-4 h-4" style={{ color: BRAND.primary }} />
              </button>
            </div>

            {/* 對話列表 */}
            <div className="flex-1 overflow-y-auto">
              {threads.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm">
                  尚無對話紀錄
                </div>
              )}
              {threads.map((thread) => (
                <div
                  key={thread.id}
                  className={`group flex items-center gap-2 px-3 py-2.5 cursor-pointer border-b border-gray-50 transition-colors ${
                    activeThreadId === thread.id
                      ? "bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleSelectThread(thread.id)}
                >
                  <MessageSquare
                    className="w-4 h-4 shrink-0"
                    style={{
                      color: activeThreadId === thread.id ? BRAND.primary : "#9ca3af",
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm truncate"
                      style={{
                        color: activeThreadId === thread.id ? BRAND.primary : "#374151",
                        fontWeight: activeThreadId === thread.id ? 600 : 400,
                      }}
                    >
                      {thread.title}
                    </p>
                    <p className="text-xs text-gray-400">
                      Week {thread.week} · {formatTime(thread.updatedAt)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteThread(thread.id);
                    }}
                    className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all"
                    title="刪除對話"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ─── 主要對話區 ─── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 標題列 */}
        <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title={sidebarOpen ? "收合側邊欄" : "展開側邊欄"}
            >
              {sidebarOpen ? (
                <PanelLeftClose className="w-4 h-4 text-gray-500" />
              ) : (
                <PanelLeftOpen className="w-4 h-4 text-gray-500" />
              )}
            </button>
            <CharacterAvatar character="profchen" size="md" />
            <div>
              <h1 className="font-bold">陳思遠教授</h1>
              <p className="text-xs text-gray-500">國際財務管理 AI 教師</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(Number(e.target.value))}
              className="text-sm border rounded-lg px-2 py-1"
            >
              {Array.from({ length: 8 }, (_, i) => i + 1).map((w) => (
                <option key={w} value={w}>
                  Week {w}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 訊息列表 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <CharacterAvatar character="profchen" size="lg" />
              <h2 className="text-xl font-bold mt-4 mb-2" style={{ color: BRAND.primary }}>
                歡迎來到陳教授的辦公室
              </h2>
              <p className="text-gray-500 mb-6">
                有任何國際財務管理的問題，隨時問我！
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {currentSuggestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="px-4 py-2 rounded-full text-sm border hover:bg-gray-50 transition-colors"
                    style={{ borderColor: BRAND.accent, color: BRAND.primary }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {msg.role === "assistant" && (
                <CharacterAvatar character="profchen" size="sm" />
              )}
              <div className="max-w-[80%]">
                {/* 附件預覽 */}
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className={`flex flex-wrap gap-2 mb-2 ${msg.role === "user" ? "justify-end" : ""}`}>
                    {msg.attachments.map((att, j) =>
                      att.type === "image" && att.previewUrl ? (
                        <img
                          key={j}
                          src={att.previewUrl}
                          alt={att.name}
                          className="max-w-48 max-h-48 rounded-lg border shadow-sm"
                        />
                      ) : (
                        <div
                          key={j}
                          className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-xs text-gray-600"
                        >
                          <Paperclip className="w-3.5 h-3.5" />
                          {att.name}
                        </div>
                      )
                    )}
                  </div>
                )}
                {/* 訊息內容 */}
                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[var(--zhen-primary)] text-white rounded-br-none"
                      : "bg-white border rounded-bl-none shadow-sm"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                        strong: ({ children }) => (
                          <strong className="font-bold" style={{ color: BRAND.primary }}>
                            {children}
                          </strong>
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
            </motion.div>
          ))}

          {isStreaming && (
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              陳教授正在思考...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 附件預覽區 */}
        <AnimatePresence>
          {pendingAttachments.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t bg-gray-50 px-4 py-2"
            >
              <div className="flex flex-wrap gap-2">
                {pendingAttachments.map((att, i) => (
                  <div key={i} className="relative group">
                    {att.type === "image" && att.previewUrl ? (
                      <img
                        src={att.previewUrl}
                        alt={att.name}
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border text-xs text-gray-600">
                        <Paperclip className="w-3.5 h-3.5" />
                        <span className="max-w-24 truncate">{att.name}</span>
                      </div>
                    )}
                    <button
                      onClick={() => removeAttachment(i)}
                      className="absolute -top-1.5 -right-1.5 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 輸入區 */}
        <div className="border-t bg-white p-4">
          {messages.length > 0 && (
            <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
              {currentSuggestions.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  disabled={isStreaming}
                  className="shrink-0 px-3 py-1 rounded-full text-xs border hover:bg-gray-50 transition-colors disabled:opacity-50"
                  style={{ borderColor: BRAND.accent, color: BRAND.primary }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}
          <div className="flex items-end gap-2">
            {/* 附件按鈕 */}
            <div className="flex gap-1 pb-1">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="上傳檔案或圖片"
              >
                <Paperclip className="w-4 h-4 text-gray-400" />
              </button>
              <button
                onClick={() => {
                  // Trigger paste hint
                  inputRef.current?.focus();
                }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="貼上圖片 (Ctrl+V)"
              >
                <ImageIcon className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.txt,.csv,.md"
              onChange={handleFileSelect}
              className="hidden"
            />
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
              placeholder="輸入你的問題...（Enter 送出，Shift+Enter 換行，Ctrl+V 貼圖片）"
              rows={1}
              className="flex-1 resize-none rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--zhen-accent)]"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={(!input.trim() && pendingAttachments.length === 0) || isStreaming}
              className="px-4 py-2.5 rounded-xl text-white transition-all disabled:opacity-30"
              style={{ backgroundColor: BRAND.primary }}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 對話串管理：支援多個獨立對話主題
 * 每個對話儲存在 LocalStorage（key: tutor-chat-{id}）
 */

export interface ChatThread {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  week: number;
}

export interface ChatAttachment {
  type: 'image' | 'file';
  name: string;
  mimeType: string;
  /** base64 data for images; extracted text for documents */
  data: string;
  previewUrl?: string;
}

export interface StoredMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  attachments?: ChatAttachment[];
}

const THREADS_KEY = 'tutor-threads';
const MSG_PREFIX = 'tutor-chat-';

// ─── Thread CRUD ────────────────────────────────

export function loadThreads(): ChatThread[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(THREADS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as ChatThread[];
  } catch {
    return [];
  }
}

export function saveThreads(threads: ChatThread[]) {
  localStorage.setItem(THREADS_KEY, JSON.stringify(threads));
}

export function createThread(week: number): ChatThread {
  const thread: ChatThread = {
    id: crypto.randomUUID(),
    title: '新對話',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    week,
  };
  const threads = loadThreads();
  threads.unshift(thread);
  saveThreads(threads);
  return thread;
}

export function deleteThread(id: string) {
  const threads = loadThreads().filter((t) => t.id !== id);
  saveThreads(threads);
  localStorage.removeItem(MSG_PREFIX + id);
}

export function updateThreadTitle(id: string, title: string) {
  const threads = loadThreads();
  const thread = threads.find((t) => t.id === id);
  if (thread) {
    thread.title = title;
    thread.updatedAt = Date.now();
    saveThreads(threads);
  }
}

export function touchThread(id: string) {
  const threads = loadThreads();
  const thread = threads.find((t) => t.id === id);
  if (thread) {
    thread.updatedAt = Date.now();
    saveThreads(threads);
  }
}

// ─── Messages CRUD ──────────────────────────────

export function loadMessages(threadId: string): StoredMessage[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(MSG_PREFIX + threadId);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as StoredMessage[];
  } catch {
    return [];
  }
}

export function saveMessages(threadId: string, messages: StoredMessage[]) {
  localStorage.setItem(MSG_PREFIX + threadId, JSON.stringify(messages));
  touchThread(threadId);

  // Auto-name thread from first user message
  if (messages.length >= 1) {
    const firstUser = messages.find((m) => m.role === 'user');
    if (firstUser) {
      const title = firstUser.content.slice(0, 20) + (firstUser.content.length > 20 ? '...' : '');
      updateThreadTitle(threadId, title);
    }
  }
}

// ─── Migration: old single-chat → thread system ─

export function migrateOldChat(): string | null {
  if (typeof window === 'undefined') return null;
  const OLD_KEY = 'zhentu-chat-history';
  const raw = localStorage.getItem(OLD_KEY);
  if (!raw) return null;

  try {
    const oldMessages = JSON.parse(raw) as StoredMessage[];
    if (oldMessages.length === 0) return null;

    const thread = createThread(1);
    saveMessages(thread.id, oldMessages);
    localStorage.removeItem(OLD_KEY);
    return thread.id;
  } catch {
    return null;
  }
}

// ─── File helpers ───────────────────────────────

export async function extractTextFromFile(file: File): Promise<string> {
  if (file.type === 'text/plain' || file.type === 'text/csv' || file.type === 'text/markdown') {
    return file.text();
  }
  if (file.type === 'application/pdf') {
    // Simple extraction: read as text (basic PDFs only)
    // For complex PDFs, the server-side would need pdf-parse
    return `[PDF 檔案：${file.name}，大小 ${(file.size / 1024).toFixed(1)} KB]`;
  }
  return `[檔案：${file.name}，類型 ${file.type}]`;
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix: "data:image/png;base64,"
      const base64 = result.split(',')[1] || result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

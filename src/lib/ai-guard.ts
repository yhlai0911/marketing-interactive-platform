// Abuse guard for the paid AI routes (chat, lesson-chat, teach, tts). Added 2026-11-19.
//
// These routes call OpenAI (and the TTS provider) with the server key and have no login.
// Anyone who finds the URL can call them and spend the key's quota. This guard does not
// change the student experience: there is no login step. It only adds three loose limits:
//   1. request body size per route (413)
//   2. requests per client IP per 10 minutes (429), loose because a classroom shares one IP
//   3. requests per day for this server instance (429)
// Each limit can be changed or switched off with an environment variable (0 = off):
//   AI_GUARD_DISABLED=1            switch the whole guard off
//   AI_RATE_PER_IP_PER_10MIN       default 600
//   AI_DAILY_CAP                   default 10000 (per server instance, Taipei calendar day)
//   AI_MAX_BODY_CHARS_<ROUTE>      e.g. AI_MAX_BODY_CHARS_CHAT, AI_MAX_BODY_CHARS_TTS
// Counters live in memory, so they reset when the server restarts and are per instance.

export const ROUTE_MAX_BODY_CHARS = {
  chat: 2_000_000, // chat can carry base64 attachments
  "lesson-chat": 100_000,
  teach: 100_000,
  tts: 20_000,
} as const;

export type AiRoute = keyof typeof ROUTE_MAX_BODY_CHARS;

const TEN_MINUTES_MS = 10 * 60 * 1000;
const ipWindows = new Map<string, { start: number; count: number }>();
let dayKey = "";
let dayCount = 0;

function envInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw.trim() === "") return fallback;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : fallback;
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function taipeiDay(now: number): string {
  return new Date(now + 8 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function reject(status: number, error: string, retryAfterSeconds?: number): Response {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (retryAfterSeconds !== undefined) headers["Retry-After"] = String(retryAfterSeconds);
  return new Response(JSON.stringify({ error }), { status, headers });
}

/** Returns a Response to send back when the request must be refused, or null to continue. */
export async function guardAiRequest(request: Request, route: AiRoute, now: number = Date.now()): Promise<Response | null> {
  if (process.env.AI_GUARD_DISABLED === "1") return null;

  const maxChars = envInt(`AI_MAX_BODY_CHARS_${route.replace("-", "_").toUpperCase()}`, ROUTE_MAX_BODY_CHARS[route]);
  if (maxChars > 0) {
    const declared = Number(request.headers.get("content-length") || "0");
    if (declared > maxChars * 4) return reject(413, "Request too large / 請求內容過大");
    const text = await request.clone().text();
    if (text.length > maxChars) return reject(413, "Request too large / 請求內容過大");
  }

  const perIp = envInt("AI_RATE_PER_IP_PER_10MIN", 600);
  const ip = clientIp(request);
  let window = ipWindows.get(ip);
  if (perIp > 0) {
    if (!window || now - window.start >= TEN_MINUTES_MS) window = { start: now, count: 0 };
    if (window.count >= perIp) {
      const retry = Math.max(1, Math.ceil((window.start + TEN_MINUTES_MS - now) / 1000));
      return reject(429, "Too many requests, please retry later / 請求過多，請稍後再試", retry);
    }
  }

  const dailyCap = envInt("AI_DAILY_CAP", 10_000);
  const today = taipeiDay(now);
  if (today !== dayKey) {
    dayKey = today;
    dayCount = 0;
  }
  if (dailyCap > 0 && dayCount >= dailyCap) {
    return reject(429, "Daily AI quota reached / 今日 AI 使用量已達上限");
  }

  if (perIp > 0 && window) {
    window.count += 1;
    ipWindows.set(ip, window);
    if (ipWindows.size > 10_000) {
      for (const [key, w] of ipWindows) if (now - w.start >= TEN_MINUTES_MS) ipWindows.delete(key);
    }
  }
  dayCount += 1;
  return null;
}

/** Test helper: clear all counters. */
export function resetAiGuardForTests(): void {
  ipWindows.clear();
  dayKey = "";
  dayCount = 0;
}

import { createSign } from 'crypto';
import { readFileSync } from 'fs';
import { join } from 'path';
import type { CharacterId, AudioResult } from '@/types';

// 超時 Promise 工具
function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timeout after ${ms}ms`)), ms)
    ),
  ]);
}

// Edge TTS 角色聲線映射
const EDGE_VOICE_MAP: Record<string, { voice: string; rate?: string; pitch?: string }> = {
  linmei:   { voice: 'zh-TW-HsiaoChenNeural' },
  profchen: { voice: 'zh-TW-YunJheNeural' },
  jason:    { voice: 'zh-TW-YunJheNeural', pitch: '-5Hz' },
  yuki:     { voice: 'zh-TW-HsiaoChenNeural', pitch: '+5Hz' },
  bingcheng:{ voice: 'zh-TW-YunJheNeural', rate: '+10.00%' },
  narrator: { voice: 'zh-TW-HsiaoChenNeural', rate: '-10.00%' },
};

// Google TTS 角色聲線映射（繁中聲線為 cmn-TW，非 zh-TW）
const GOOGLE_VOICE_MAP: Record<string, { name: string }> = {
  linmei:   { name: 'cmn-TW-Wavenet-A' },   // 女聲
  profchen: { name: 'cmn-TW-Wavenet-B' },   // 男聲
  jason:    { name: 'cmn-TW-Wavenet-C' },   // 男聲
  yuki:     { name: 'cmn-TW-Wavenet-A' },   // 女聲
  bingcheng:{ name: 'cmn-TW-Wavenet-B' },   // 男聲
  narrator: { name: 'cmn-TW-Wavenet-A' },   // 女聲
};

// OpenAI TTS 角色映射
const OPENAI_VOICE_MAP: Record<string, { voice: string; instructions: string }> = {
  linmei:   { voice: 'nova',  instructions: '用活潑自信的年輕女性口吻說繁體中文' },
  profchen: { voice: 'onyx',  instructions: '用沉穩溫和的大學教授口吻說繁體中文' },
  jason:    { voice: 'echo',  instructions: '用理性冷靜的財務專家口吻說繁體中文' },
  yuki:     { voice: 'shimmer', instructions: '用精準注重細節的日本女性口吻說繁體中文' },
  bingcheng:{ voice: 'fable', instructions: '用激進自信的商業競爭者口吻說繁體中文' },
  narrator: { voice: 'sage',  instructions: '用溫暖平穩的旁白口吻說繁體中文，語速稍慢' },
};

// ─── Google Service Account OAuth2 ─────────────────────────
// 使用 service account JSON 生成 JWT，換取 access token
let cachedAccessToken: { token: string; expiry: number } | null = null;

function loadServiceAccount(): { client_email: string; private_key: string } | null {
  const saPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!saPath) {
    // 嘗試預設位置
    const defaultPath = join(process.cwd(), 'speak-user-test-a04e5374a72d.json');
    try {
      return JSON.parse(readFileSync(defaultPath, 'utf-8'));
    } catch {
      return null;
    }
  }
  try {
    return JSON.parse(readFileSync(saPath, 'utf-8'));
  } catch {
    return null;
  }
}

function createJWT(sa: { client_email: string; private_key: string }): string {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/cloud-platform',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  })).toString('base64url');

  const signInput = `${header}.${payload}`;
  const sign = createSign('RSA-SHA256');
  sign.update(signInput);
  const signature = sign.sign(sa.private_key, 'base64url');

  return `${signInput}.${signature}`;
}

async function getGoogleAccessToken(): Promise<string> {
  // 如果有快取且未過期（提前 5 分鐘更新）
  if (cachedAccessToken && Date.now() < cachedAccessToken.expiry - 300000) {
    return cachedAccessToken.token;
  }

  const sa = loadServiceAccount();
  if (!sa) throw new Error('Google service account not found');

  const jwt = createJWT(sa);

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Google OAuth2 failed: ${res.status} ${body.slice(0, 200)}`);
  }

  const data = await res.json();
  cachedAccessToken = {
    token: data.access_token,
    expiry: Date.now() + (data.expires_in || 3600) * 1000,
  };

  return cachedAccessToken.token;
}

// ① Edge TTS (免費首選) — 加 10 秒超時
async function edgeTTS(text: string, character: CharacterId): Promise<AudioResult> {
  const { Communicate } = await import('edge-tts-universal');
  const config = EDGE_VOICE_MAP[character] || EDGE_VOICE_MAP.narrator;

  const communicate = new Communicate(text, {
    voice: config.voice,
    rate: config.rate,
    pitch: config.pitch,
    connectionTimeout: 5000,
  });

  const chunks: Buffer[] = [];

  const collectAudio = async () => {
    for await (const chunk of communicate.stream()) {
      if (chunk.type === 'audio' && chunk.data) {
        chunks.push(chunk.data);
      }
    }
  };

  await withTimeout(collectAudio(), 10000, 'Edge TTS');

  if (chunks.length === 0) {
    throw new Error('Edge TTS returned no audio data');
  }

  return {
    audio: Buffer.concat(chunks),
    contentType: 'audio/mpeg',
    engine: 'edge',
  };
}

// ② Google Cloud TTS (高品質備援) — 使用 Service Account 認證
async function googleTTS(text: string, character: CharacterId): Promise<AudioResult> {
  const accessToken = await getGoogleAccessToken();
  const config = GOOGLE_VOICE_MAP[character] || GOOGLE_VOICE_MAP.narrator;

  const res = await withTimeout(
    fetch(
      'https://texttospeech.googleapis.com/v1/text:synthesize',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          input: { text },
          voice: { languageCode: 'cmn-TW', name: config.name },
          audioConfig: { audioEncoding: 'MP3' },
        }),
      }
    ),
    10000,
    'Google TTS'
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Google TTS failed: ${res.status} ${body.slice(0, 200)}`);
  }

  const { audioContent } = await res.json();
  const audio = Buffer.from(audioContent, 'base64');

  return { audio, contentType: 'audio/mpeg', engine: 'google' };
}

// ③ OpenAI TTS (最終備援)
async function openaiTTS(text: string, character: CharacterId): Promise<AudioResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not configured');

  const config = OPENAI_VOICE_MAP[character] || OPENAI_VOICE_MAP.narrator;

  const { default: OpenAI } = await import('openai');
  const client = new OpenAI({ apiKey });

  const response = await withTimeout(
    client.audio.speech.create({
      model: 'gpt-4o-mini-tts',
      voice: config.voice as 'nova' | 'onyx' | 'echo' | 'shimmer' | 'fable' | 'sage',
      input: text,
      instructions: config.instructions,
      response_format: 'mp3',
    }),
    15000,
    'OpenAI TTS'
  );

  const arrayBuffer = await response.arrayBuffer();

  return {
    audio: Buffer.from(arrayBuffer),
    contentType: 'audio/mpeg',
    engine: 'openai',
  };
}

// 三層備援主函式
export async function synthesize(text: string, character: CharacterId): Promise<AudioResult> {
  // ① Edge TTS (10s timeout)
  try {
    return await edgeTTS(text, character);
  } catch (e) {
    console.warn('[TTS] Edge TTS failed, trying Google...', (e as Error).message);
  }

  // ② Google Cloud TTS (10s timeout, service account auth)
  try {
    return await googleTTS(text, character);
  } catch (e) {
    console.warn('[TTS] Google TTS failed, trying OpenAI...', (e as Error).message);
  }

  // ③ OpenAI TTS (15s timeout)
  try {
    return await openaiTTS(text, character);
  } catch (e) {
    console.error('[TTS] All TTS engines failed', (e as Error).message);
    throw new Error('All TTS engines failed');
  }
}

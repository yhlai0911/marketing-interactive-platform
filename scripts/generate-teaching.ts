/**
 * 教學腳本生成器
 *
 * 使用 OpenAI gpt-4.1-mini 為每個 segment 生成 TeachingStep[]。
 * Week 01 已手動撰寫作為黃金範本，此腳本供 Week 02-16 使用。
 *
 * 用法：
 *   npx tsx scripts/generate-teaching.ts --week 2
 *
 * 需要環境變數：
 *   OPENAI_API_KEY
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const SYSTEM_PROMPT = `你是一個教學腳本生成器。你的任務是為大學課堂的國際財務管理課程生成互動式教學步驟。

教授角色：陳思遠教授
- 55 歲，前花旗銀行台灣區外匯交易室主管
- 授課風格：生活化比喻、穿插實務案例、溫和有權威

生成規則：
1. 每個 segment 產生 3-6 個步驟
2. 步驟類型：lecture（教授講解）、check（隨堂提問）、visual（圖表展示）
3. lecture 步驟的 text 欄位 100-300 字，使用繁體中文
4. 每個 segment 至少有 1 個 check
5. 理論類 segment 應有 2 個 check 和 1 個 visual
6. check 的選項 2-4 個，必須有明確正確答案
7. check 的 onCorrect 和 onWrong 都要有教學意義

輸出格式：嚴格的 JSON 陣列，每個元素是 { type, ... } 的步驟物件。
不要加任何 markdown 標記或解釋文字。`;

interface Segment {
  type: string;
  title?: string;
  [key: string]: unknown;
}

async function generateTeachingForSegment(
  segment: Segment,
  weekNum: number,
  weekTitle: string,
  segmentIndex: number,
  totalSegments: number,
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not set');

  let segmentDesc = `第 ${weekNum} 週「${weekTitle}」，第 ${segmentIndex + 1}/${totalSegments} 段。\n`;
  segmentDesc += `段落類型：${segment.type}\n`;
  segmentDesc += `段落內容：${JSON.stringify(segment, null, 2)}`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4.1-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: segmentDesc },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OpenAI API error: ${res.status} ${body.slice(0, 200)}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

async function main() {
  const weekArg = process.argv.find((a) => a.startsWith('--week='))?.split('=')[1]
    || process.argv[process.argv.indexOf('--week') + 1];

  if (!weekArg) {
    console.error('Usage: npx tsx scripts/generate-teaching.ts --week <number>');
    process.exit(1);
  }

  const weekNum = parseInt(weekArg, 10);
  const paddedWeek = String(weekNum).padStart(2, '0');

  // 動態載入課程資料
  const lessonModule = await import(`../src/data/lessons/week${paddedWeek}`);
  const lesson = lessonModule[`week${paddedWeek}`];

  if (!lesson) {
    console.error(`找不到 week${paddedWeek} 的課程資料`);
    process.exit(1);
  }

  console.log(`正在為 Week ${weekNum}「${lesson.title}」生成教學腳本...`);
  console.log(`共 ${lesson.segments.length} 個 segments\n`);

  const allTeaching: { steps: unknown[] }[] = [];

  for (let i = 0; i < lesson.segments.length; i++) {
    const seg = lesson.segments[i];
    const title = seg.type === 'quiz' ? (seg.title || '互動測驗') : seg.title;
    console.log(`  [${i + 1}/${lesson.segments.length}] ${seg.type}: ${title}`);

    try {
      const raw = await generateTeachingForSegment(
        seg, weekNum, lesson.title, i, lesson.segments.length
      );
      // 清理可能的 markdown 包裹
      const clean = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
      const steps = JSON.parse(clean);
      allTeaching.push({ steps });
      console.log(`    ✓ 生成 ${steps.length} 個步驟`);
    } catch (err) {
      console.error(`    ✗ 生成失敗: ${(err as Error).message}`);
      allTeaching.push({ steps: [] });
    }

    // 避免 rate limit
    await new Promise((r) => setTimeout(r, 500));
  }

  // 寫入檔案
  const outDir = join(process.cwd(), 'src', 'data', 'teaching');
  mkdirSync(outDir, { recursive: true });

  const outPath = join(outDir, `week${paddedWeek}.ts`);
  const content = `import type { SegmentTeaching } from '@/types';

/**
 * Week ${paddedWeek}「${lesson.title}」的課堂教學腳本
 * 由 scripts/generate-teaching.ts 自動生成
 * 生成時間：${new Date().toISOString()}
 */
export const week${paddedWeek}Teaching: SegmentTeaching[] = ${JSON.stringify(allTeaching, null, 2)};
`;

  writeFileSync(outPath, content, 'utf-8');
  console.log(`\n✓ 已輸出到 ${outPath}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});

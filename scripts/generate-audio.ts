/**
 * 預錄音檔生成器
 *
 * 讀取教學腳本中所有需要朗讀的文字，
 * 使用 Edge TTS（免費）生成 MP3 音檔。
 *
 * 用法：
 *   npx tsx scripts/generate-audio.ts --week 1
 *
 * 輸出：
 *   public/audio/teaching/week01/*.mp3
 *   public/audio/teaching/week01/manifest.json
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

// Edge TTS 角色聲線映射（與 tts-engine.ts 保持一致）
const VOICE_MAP: Record<string, { voice: string; rate?: string; pitch?: string }> = {
  chen: { voice: 'zh-TW-YunJheNeural', pitch: '-5Hz' },        // 陳建宏（CEO）—理性堅定
  profLin: { voice: 'zh-TW-YunJheNeural' },                    // 林教授（顧問）—沉穩溫和
  xiaoYa: { voice: 'zh-TW-HsiaoChenNeural' },                  // 小雅（CMO）—活潑自信
  laoLi: { voice: 'zh-TW-YunJheNeural', pitch: '-3Hz' },        // 老李（業務總監）—穩重資深
  wantai: { voice: 'zh-TW-YunJheNeural', rate: '+10.00%' },    // 萬泰金控（競爭者）—強勢
  narrator: { voice: 'zh-TW-HsiaoChenNeural', rate: '-10%' }, // 旁白
};

interface AudioEntry {
  key: string;
  file: string;
  text: string;
  character: string;
}

async function generateEdgeTTS(
  text: string,
  character: string,
  outputPath: string,
): Promise<boolean> {
  try {
    const { Communicate } = await import('edge-tts-universal');
    const config = VOICE_MAP[character] || VOICE_MAP.narrator;

    const communicate = new Communicate(text, {
      voice: config.voice,
      rate: config.rate,
      pitch: config.pitch,
      connectionTimeout: 10000,
    });

    const chunks: Buffer[] = [];
    for await (const chunk of communicate.stream()) {
      if (chunk.type === 'audio' && chunk.data) {
        chunks.push(chunk.data);
      }
    }

    if (chunks.length === 0) {
      throw new Error('No audio data received');
    }

    writeFileSync(outputPath, Buffer.concat(chunks));
    return true;
  } catch (err) {
    console.warn(`    Edge TTS failed: ${(err as Error).message}`);
    return false;
  }
}

async function main() {
  const weekArg =
    process.argv.find((a) => a.startsWith('--week='))?.split('=')[1] ||
    process.argv[process.argv.indexOf('--week') + 1];

  if (!weekArg) {
    console.error('Usage: npx tsx scripts/generate-audio.ts --week <number>');
    process.exit(1);
  }

  const weekNum = parseInt(weekArg, 10);
  const paddedWeek = String(weekNum).padStart(2, '0');

  // 動態載入教學腳本
  const teachingModule = await import(
    `../src/data/teaching/week${paddedWeek}`
  );
  const teaching = teachingModule[`week${paddedWeek}Teaching`];

  if (!teaching || !Array.isArray(teaching)) {
    console.error(`找不到 week${paddedWeek} 的教學腳本`);
    process.exit(1);
  }

  console.log(`正在為 Week ${weekNum} 生成音檔...`);

  // 收集所有需要生成語音的文字
  const entries: AudioEntry[] = [];

  for (let si = 0; si < teaching.length; si++) {
    const segment = teaching[si];
    let checkCount = 0;

    for (let ti = 0; ti < segment.steps.length; ti++) {
      const step = segment.steps[ti];

      if (step.type === 'lecture') {
        entries.push({
          key: `s${si}-step${ti}`,
          file: `s${si}-step${ti}.mp3`,
          text: step.text,
          character: step.character || 'profLin',
        });
      } else if (step.type === 'check') {
        // 提問文字
        entries.push({
          key: `s${si}-check${checkCount}-question`,
          file: `s${si}-check${checkCount}-question.mp3`,
          text: step.question,
          character: 'profLin',
        });
        // 答對回饋
        entries.push({
          key: `s${si}-check${checkCount}-correct`,
          file: `s${si}-check${checkCount}-correct.mp3`,
          text: step.onCorrect,
          character: 'profLin',
        });
        // 答錯回饋
        entries.push({
          key: `s${si}-check${checkCount}-wrong`,
          file: `s${si}-check${checkCount}-wrong.mp3`,
          text: step.onWrong,
          character: 'profLin',
        });
        checkCount++;
      }
    }
  }

  console.log(`共 ${entries.length} 個音檔需要生成\n`);

  // 建立輸出目錄
  const outDir = join(process.cwd(), 'public', 'audio', 'teaching', `week${paddedWeek}`);
  mkdirSync(outDir, { recursive: true });

  const manifest: Record<string, string> = {};
  let success = 0;
  let failed = 0;

  // 平行生成（同時最多 CONCURRENCY 個）
  const CONCURRENCY = 5;

  async function processEntry(entry: AudioEntry, idx: number) {
    const outPath = join(outDir, entry.file);
    const relPath = `/audio/teaching/week${paddedWeek}/${entry.file}`;

    // 跳過已存在的檔案
    if (existsSync(outPath)) {
      console.log(`  [${idx + 1}/${entries.length}] ${entry.key} — 已存在，跳過`);
      manifest[entry.key] = relPath;
      success++;
      return;
    }

    console.log(`  [${idx + 1}/${entries.length}] ${entry.key} — 生成中...`);

    const ok = await generateEdgeTTS(entry.text, entry.character, outPath);

    if (ok) {
      manifest[entry.key] = relPath;
      success++;
      console.log(`  [${idx + 1}/${entries.length}] ${entry.key} — ✓`);
    } else {
      failed++;
      console.log(`  [${idx + 1}/${entries.length}] ${entry.key} — ✗`);
    }
  }

  // 以 CONCURRENCY 為批次大小平行處理
  for (let i = 0; i < entries.length; i += CONCURRENCY) {
    const batch = entries.slice(i, i + CONCURRENCY);
    await Promise.all(batch.map((entry, j) => processEntry(entry, i + j)));
  }

  // 寫入 manifest
  const manifestPath = join(outDir, 'manifest.json');
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');

  console.log(`\n完成！成功 ${success}，失敗 ${failed}`);
  console.log(`Manifest: ${manifestPath}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});

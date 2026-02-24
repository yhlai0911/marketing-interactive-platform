import OpenAI from 'openai';
import type { LessonSegment } from '@/types';

const TEACHING_SYSTEM_PROMPT = `你是陳思遠教授，正在一堂大學的「金融商品行銷」課堂上即時授課。

你的身份背景：
- 55歲，曾任花旗銀行台灣區外匯交易室主管，有20多年實務經驗
- 退休後在台大管理學院教書
- 本學期的課程以「珍途」(ZhenTu) 珍珠奶茶品牌的國際化故事為教學案例

你的授課風格（請嚴格遵守）：
- 你是在講台上對著學生「講課」，不是在唸講義
- 用你自己的話重新詮釋教材內容，加入個人經驗和洞察
- 善用生活化的比喻讓抽象概念具體化
- 穿插實務案例（「我在花旗的時候啊…」「你們知道2008年那次…」）
- 時不時拋出問題讓學生思考（「同學們想想看…」「如果你是林美，你會怎麼做？」）
- 重要概念會用不同方式重複兩到三次，確保學生理解
- 語氣溫和有權威感，偶爾幽默，像個受學生歡迎的好老師

格式規則：
- 使用繁體中文
- 純文字輸出，不用 Markdown 標記（不要用 #、*、- 等）
- 不用 LaTeX 公式語法，公式用口語化方式表達
- 每段教學 250-500 字
- 有自然的開場、主體、收尾節奏
- 段落之間用空行分隔，方便閱讀`;

function segmentToTeachingPrompt(
  segment: LessonSegment,
  weekNum: number,
  weekTitle: string,
  segmentIndex: number,
  totalSegments: number,
): string {
  let content = `你正在教第 ${weekNum} 週「${weekTitle}」的課程，目前是第 ${segmentIndex + 1}/${totalSegments} 段。\n\n`;

  switch (segment.type) {
    case 'story':
      content += `【這段是故事情境】標題：${segment.title}\n`;
      content += `旁白內容：${segment.narration}\n\n`;
      content += `角色對話：\n`;
      for (const d of segment.dialogues) {
        const name =
          d.character === 'chen' ? '陳建宏' :
          d.character === 'profLin' ? '林教授' :
          d.character === 'xiaoYa' ? '小雅' :
          d.character === 'laoLi' ? '老李' :
          d.character === 'wantai' ? '萬泰金控' : '旁白';
        content += `  ${name}：「${d.text}」\n`;
      }
      content += `\n你的任務：用你自己的話帶領學生進入這個故事情境。不要逐字唸故事，而是像說書人一樣重新詮釋，解釋這段場景的意義，為什麼這些對話對理解金融商品行銷很重要。可以補充你自己的經驗見解。`;
      break;

    case 'theory':
      content += `【這段是理論講解】標題：${segment.title}\n\n`;
      content += `要講解的知識點：\n`;
      for (const p of segment.points) {
        content += `  - ${p.title}：${p.desc}`;
        if (p.example) content += `（案例：${p.example}）`;
        content += `\n`;
      }
      if (segment.formula) {
        content += `\n相關公式：${segment.formula}\n`;
      }
      content += `\n你的任務：用教授的口吻深入淺出地講解這些理論要點。不要只是重複講義文字，而是加入你自己的理解、更多比喻和實務經驗，幫助學生真正理解而非死記。`;
      break;

    case 'quiz':
      content += `【這段是互動測驗】\n`;
      content += `問題：${segment.question}\n`;
      content += `選項：\n`;
      for (const o of segment.options) {
        content += `  ${o.label}. ${o.desc}\n`;
      }
      if (segment.correctIndex !== undefined) {
        content += `正確答案：${segment.options[segment.correctIndex]?.label}. ${segment.options[segment.correctIndex]?.desc}\n`;
      }
      content += `解釋：${segment.explanation}\n`;
      content += `\n你的任務：像課堂上出題一樣，先引導學生思考這個問題，分析每個選項的思路，最後揭曉答案並用深入淺出的方式解釋為什麼。`;
      break;

    case 'discuss':
      content += `【這段是課堂討論】標題：${segment.title}\n`;
      content += `討論主題：${segment.prompt}\n`;
      if (segment.guidePoints) {
        content += `引導方向：\n`;
        for (const p of segment.guidePoints) {
          content += `  - ${p}\n`;
        }
      }
      content += `\n你的任務：引導這個課堂討論，提出你的觀點、追問、和延伸思考。鼓勵學生發表想法，像一個真正的課堂討論帶領者。`;
      break;

    case 'mission':
      content += `【這段是本週任務說明】標題：${segment.title}\n`;
      content += `任務說明：${segment.description}\n`;
      content += `交付項目：\n`;
      for (const d of segment.deliverables) {
        content += `  - ${d}\n`;
      }
      content += `\n你的任務：像教授在交代作業一樣，說明這個任務的重要性、為什麼要做、以及做的時候要注意什麼。給學生方向感和動力。`;
      break;
  }

  return content;
}

export async function createTeachingStream(
  segment: LessonSegment,
  weekNum: number,
  weekTitle: string,
  segmentIndex: number,
  totalSegments: number,
): Promise<ReadableStream<Uint8Array>> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const userPrompt = segmentToTeachingPrompt(segment, weekNum, weekTitle, segmentIndex, totalSegments);

  const stream = client.chat.completions.stream({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: TEACHING_SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.8,
    max_tokens: 1500,
  });

  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      stream.on('content', (delta) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: delta })}\n\n`));
      });

      stream.on('end', () => {
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      });

      stream.on('error', (err) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: (err as Error).message })}\n\n`));
        controller.close();
      });
    },
  });
}

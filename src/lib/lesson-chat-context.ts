/**
 * 將課程頁面當前狀態序列化為結構化字串，注入 AI 助教的 system prompt
 * Token 預算：~800-1500 tokens
 */

import type { LessonSegment, TeachingStep } from '@/types';
import type { FormulaItem } from '@/components/visuals/FormulaQuickRef';

export interface LessonContextParams {
  weekNum: number;
  weekTitle: string;
  segment: LessonSegment;
  segmentIndex: number;
  totalSegments: number;
  teachingSteps?: TeachingStep[];
  formulas?: FormulaItem[];
}

const SEGMENT_TYPE_LABELS: Record<string, string> = {
  story: '故事導入',
  theory: '理論講解',
  quiz: '互動測驗',
  discuss: '小組討論',
  mission: '週任務',
};

function serializeSegment(segment: LessonSegment): string {
  switch (segment.type) {
    case 'story':
      return [
        segment.narration,
        ...segment.dialogues.map(d => `${d.character}: ${d.text}`),
      ].join('\n').slice(0, 1200);

    case 'theory':
      return segment.points
        .map(p => `【${p.title}】${p.desc}${p.example ? `（例：${p.example}）` : ''}`)
        .join('\n')
        .slice(0, 1200);

    case 'quiz':
      return [
        `問題：${segment.question}`,
        ...segment.options.map((o, i) => `${i + 1}. ${o.label}：${o.desc}`),
        `解析：${segment.explanation}`,
      ].join('\n').slice(0, 1000);

    case 'discuss':
      return [
        `討論主題：${segment.prompt}`,
        ...(segment.guidePoints?.map(p => `- ${p}`) ?? []),
      ].join('\n');

    case 'mission':
      return [
        segment.description,
        '交付項目：',
        ...segment.deliverables.map(d => `- ${d}`),
      ].join('\n');

    default:
      return '';
  }
}

function serializeTeachingSteps(steps: TeachingStep[]): string {
  return steps
    .filter((s): s is Extract<TeachingStep, { type: 'lecture' }> => s.type === 'lecture')
    .map(s => s.text)
    .join('\n')
    .slice(0, 1500);
}

function serializeFormulas(formulas: FormulaItem[]): string {
  return formulas
    .map(f => `${f.name}：${f.formula}\n  ${f.description}`)
    .join('\n');
}

export function buildLessonContext(params: LessonContextParams): string {
  const {
    weekNum, weekTitle, segment, segmentIndex,
    totalSegments, teachingSteps, formulas,
  } = params;

  const typeName = SEGMENT_TYPE_LABELS[segment.type] ?? segment.type;
  const segTitle = 'title' in segment ? segment.title : '';

  const parts: string[] = [
    `=== 當前課程位置 ===`,
    `第 ${weekNum} 週：${weekTitle}`,
    `段落 ${segmentIndex + 1}/${totalSegments}：${segTitle}（${typeName}）`,
    '',
    `=== 本段內容 ===`,
    serializeSegment(segment),
  ];

  if (teachingSteps && teachingSteps.length > 0) {
    parts.push('', `=== 教授的教學重點 ===`, serializeTeachingSteps(teachingSteps));
  }

  if (formulas && formulas.length > 0) {
    parts.push('', `=== 本週公式 ===`, serializeFormulas(formulas));
  }

  return parts.join('\n');
}

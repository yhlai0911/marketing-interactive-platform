'use client';

import type { LearningProgress, AllProgress, QuizResult, ClassScore } from '@/types';

const STORAGE_KEY = 'zhentu-progress';

export function getAllProgress(): AllProgress {
  if (typeof window === 'undefined') return {};
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : {};
}

export function getProgress(week: number): LearningProgress | null {
  const all = getAllProgress();
  return all[week] || null;
}

export function saveQuizResult(week: number, result: QuizResult): void {
  const all = getAllProgress();
  if (!all[week]) {
    all[week] = { week, currentSegment: 0, completed: false, lastAccessed: Date.now() };
  }
  all[week].quizResult = result;
  all[week].lastAccessed = Date.now();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function getQuizResult(week: number): QuizResult | null {
  const p = getProgress(week);
  return p?.quizResult ?? null;
}

export function saveProgress(
  week: number,
  segmentIndex: number,
  total: number,
  mode: "self" | "class" | "quiz" = "self",
  classStepIndex: number = 0,
  classScore?: ClassScore,
): void {
  const all = getAllProgress();
  const prev = all[week];
  const prevMax = prev?.maxReachedSegment ?? 0;
  all[week] = {
    week,
    currentSegment: segmentIndex,
    maxReachedSegment: Math.max(prevMax, segmentIndex),
    completed: segmentIndex >= total - 1,
    lastAccessed: Date.now(),
    mode,
    classStepIndex,
    classScore: classScore ?? prev?.classScore,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function resetProgress(week: number): void {
  const all = getAllProgress();
  delete all[week];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function getCompletedWeeks(): number[] {
  const all = getAllProgress();
  return Object.values(all)
    .filter(p => p.completed)
    .map(p => p.week);
}

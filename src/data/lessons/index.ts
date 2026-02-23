import { week01 } from './week01';
import { week02 } from './week02';
import { week03 } from './week03';
import { week04 } from './week04';
import { week05 } from './week05';
import { week06 } from './week06';
import { week07 } from './week07';
import { week08 } from './week08';
import { week09 } from './week09';
import { week10 } from './week10';
import { week11 } from './week11';
import { week12 } from './week12';
import { week13 } from './week13';
import { week14 } from './week14';
import type { Lesson } from '@/types';

export const lessons: Record<number, Lesson> = {
  1: week01,
  2: week02,
  3: week03,
  4: week04,
  5: week05,
  6: week06,
  7: week07,
  8: week08,
  9: week09,
  10: week10,
  11: week11,
  12: week12,
  13: week13,
  14: week14,
};

export function getLesson(week: number): Lesson | undefined {
  return lessons[week];
}

export { week01Exercises } from './week01';
export { week02Exercises } from './week02';
export { week03Exercises } from './week03';
export { week04Exercises } from './week04';
export { week05Exercises } from './week05';
export { week06Exercises } from './week06';
export { week07Exercises } from './week07';
export { week08Exercises } from './week08';

import type { QuizSegment } from '@/types';
import { week01Exercises } from './week01';
import { week02Exercises } from './week02';
import { week03Exercises } from './week03';
import { week04Exercises } from './week04';
import { week05Exercises } from './week05';
import { week06Exercises } from './week06';
import { week07Exercises } from './week07';
import { week08Exercises } from './week08';

export const ALL_EXERCISES: Record<number, QuizSegment[]> = {
  1: week01Exercises,
  2: week02Exercises,
  3: week03Exercises,
  4: week04Exercises,
  5: week05Exercises,
  6: week06Exercises,
  7: week07Exercises,
  8: week08Exercises,
};

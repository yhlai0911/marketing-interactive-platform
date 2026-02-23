export { week01Formulas } from "./week01";
export { week02Formulas } from "./week02";
export { week03Formulas } from "./week03";
export { week04Formulas } from "./week04";
export { week05Formulas } from "./week05";
export { week06Formulas } from "./week06";
export { week07Formulas } from "./week07";
export { week08Formulas } from "./week08";
export { week09Formulas } from "./week09";
export { week10Formulas } from "./week10";
export { week11Formulas } from "./week11";
export { week12Formulas } from "./week12";
export { week13Formulas } from "./week13";
export { week14Formulas } from "./week14";
export { week15Formulas } from "./week15";
export { week16Formulas } from "./week16";

import type { FormulaItem } from "@/components/visuals/FormulaQuickRef";
import { week01Formulas } from "./week01";
import { week02Formulas } from "./week02";
import { week03Formulas } from "./week03";
import { week04Formulas } from "./week04";
import { week05Formulas } from "./week05";
import { week06Formulas } from "./week06";
import { week07Formulas } from "./week07";
import { week08Formulas } from "./week08";
import { week09Formulas } from "./week09";
import { week10Formulas } from "./week10";
import { week11Formulas } from "./week11";
import { week12Formulas } from "./week12";
import { week13Formulas } from "./week13";
import { week14Formulas } from "./week14";
import { week15Formulas } from "./week15";
import { week16Formulas } from "./week16";

export const ALL_FORMULAS: Record<number, { title: string; formulas: FormulaItem[] }> = {
  1: { title: "第 1 週公式速查", formulas: week01Formulas },
  2: { title: "第 2 週公式速查", formulas: week02Formulas },
  3: { title: "第 3 週公式速查", formulas: week03Formulas },
  4: { title: "第 4 週公式速查", formulas: week04Formulas },
  5: { title: "第 5 週公式速查", formulas: week05Formulas },
  6: { title: "第 6 週公式速查", formulas: week06Formulas },
  7: { title: "第 7 週公式速查", formulas: week07Formulas },
  8: { title: "第 8 週公式速查", formulas: week08Formulas },
  9: { title: "第 9 週公式速查", formulas: week09Formulas },
  10: { title: "第 10 週公式速查", formulas: week10Formulas },
  11: { title: "第 11 週公式速查", formulas: week11Formulas },
  12: { title: "第 12 週公式速查", formulas: week12Formulas },
  13: { title: "第 13 週公式速查", formulas: week13Formulas },
  14: { title: "第 14 週公式速查", formulas: week14Formulas },
  15: { title: "第 15 週公式速查", formulas: week15Formulas },
  16: { title: "第 16 週公式速查", formulas: week16Formulas },
};

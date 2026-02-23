// ─── 角色 ───────────────────────────────────────
export type CharacterId = "linmei" | "profchen" | "jason" | "yuki" | "bingcheng" | "narrator";

export interface Character {
  id: CharacterId;
  name_zh: string;
  name_en: string;
  role: string;
  age: number | null;
  personality: string;
  color: string;
  quote: string;
  avatar: string;
  background: string;
}

// ─── 對話 ───────────────────────────────────────
export interface DialogueLine {
  character: CharacterId;
  text: string;
}

// ─── 教學腳本段落 ───────────────────────────────
export type SegmentType = "story" | "theory" | "quiz" | "discuss" | "mission";

export interface StorySegment {
  type: "story";
  title: string;
  narration: string;
  dialogues: DialogueLine[];
  animation?: string;
}

export interface TheoryPoint {
  title: string;
  desc: string;
  example?: string;
}

export interface TheorySegment {
  type: "theory";
  title: string;
  points: TheoryPoint[];
  formula?: string | null;
  chart?: string | null;
}

export interface QuizOption {
  label: string;
  desc: string;
}

export interface QuizSegment {
  type: "quiz";
  title?: string;
  question: string;
  options: QuizOption[];
  correctIndex?: number;
  explanation: string;
}

export interface DiscussSegment {
  type: "discuss";
  title: string;
  prompt: string;
  guidePoints?: string[];
}

export interface MissionSegment {
  type: "mission";
  title: string;
  description: string;
  deliverables: string[];
}

export type LessonSegment =
  | StorySegment
  | TheorySegment
  | QuizSegment
  | DiscussSegment
  | MissionSegment;

// ─── 課程 ───────────────────────────────────────
export interface Lesson {
  week: number;
  title: string;
  segments: LessonSegment[];
}

// ─── 劇情資料 (from episodes.yaml) ──────────────
export interface Episode {
  week: number;
  title: string;
  ifm_topics: string[];
  task: string;
  cliffhanger: string | null;
  story_summary: string;
  key_concepts: string[];
}

// ─── 術語表 ─────────────────────────────────────
export interface GlossaryTerm {
  term_zh: string;
  term_en: string;
  definition: string;
  first_week: number;
}

// ─── 書籍元資料 ─────────────────────────────────
export interface Metadata {
  title: string;
  subtitle: string;
  brand: {
    primary_color: string;
    accent_color: string;
    story_color: string;
    danger_color: string;
    neutral_color: string;
  };
}

// ─── 教學步驟（預先生成的課堂教學腳本）─────────────
export type TeachingStep = LectureStep | CheckStep | VisualStep | DiscussTimerStep;

export interface LectureStep {
  type: 'lecture';
  text: string;           // 教授的講解文字（用 TTS 朗讀）
  character: CharacterId; // 通常是 'profchen'
  note?: string;          // 可選：螢幕上額外顯示的重點筆記
}

export interface CheckStep {
  type: 'check';
  question: string;       // 教授的提問
  options: string[];      // 2-4 個選項
  correctIndex: number;   // 正確答案索引
  onCorrect: string;      // 答對時教授的回應
  onWrong: string;        // 答錯時教授的補充解釋
}

export interface VisualStep {
  type: 'visual';
  component: string;      // 要渲染的視覺元件名稱
  caption?: string;       // 圖表說明文字
  props?: Record<string, unknown>; // 傳給元件的 props
}

export interface DiscussTimerStep {
  type: 'discuss_timer';
  durationMinutes: number;    // 倒數分鐘數（例如 5）
  prompt: string;             // 討論題目
  guidePoints?: string[];     // 思考方向提示
}

export interface SegmentTeaching {
  steps: TeachingStep[];
}

// ─── 課堂計分 ─────────────────────────────────
export interface ClassScore {
  correct: number;
  total: number;
}

// ─── AI 對話 ─────────────────────────────────────
export interface ChatAttachment {
  type: 'image' | 'file';
  name: string;
  mimeType: string;
  /** base64 for images; extracted text for documents */
  data: string;
  previewUrl?: string;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: number;
  attachments?: ChatAttachment[];
}

// ─── TTS ─────────────────────────────────────────
export interface TTSRequest {
  text: string;
  character: CharacterId;
  rate?: string;
  pitch?: string;
}

export interface AudioResult {
  audio: Buffer | ArrayBuffer;
  contentType: string;
  engine: "edge" | "google" | "openai";
}

// ─── 學習進度 ────────────────────────────────────
export interface LearningProgress {
  week: number;
  currentSegment: number;
  maxReachedSegment?: number;
  completed: boolean;
  lastAccessed: number;
  mode?: "self" | "class" | "quiz";
  classStepIndex?: number;
  quizResult?: QuizResult;
  classScore?: ClassScore;
}

export interface QuizResult {
  score: number;
  total: number;
  answers: number[];           // 每題選的 index（-1 = 未答）
  wrongTopics: string[];       // 答錯的題目主題
  completedAt: number;
}

export interface AllProgress {
  [week: number]: LearningProgress;
}

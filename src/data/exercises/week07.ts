import type { QuizSegment } from '@/types';

export const week07Exercises: QuizSegment[] = [
  {
    type: 'quiz',
    title: '概念測驗 1',
    question: 'AIDMA 模型由誰在何時提出？',
    options: [
      { label: 'A', desc: '日本電通，2004 年' },
      { label: 'B', desc: 'Philip Kotler，1967 年' },
      { label: 'C', desc: 'Samuel Roland Hall，1920 年代' },
      { label: 'D', desc: 'David Aaker，1991 年' },
    ],
    correctIndex: 2,
    explanation:
      '答案：(C)。AIDMA 源自 E. St. Elmo Lewis (1898) 的 AIDA 模型，由 Samuel Roland Hall 於 1920 年代加入 Memory 階段形成。(A) 是 AISAS 的提出者與時間；(B) Kotler 是行銷管理大師但非 AIDMA 提出者；(D) Aaker 以品牌權益理論聞名。',
  },
  {
    type: 'quiz',
    title: '概念測驗 2',
    question: '在 AIDMA 模型中，消費者從「產生興趣」到「採取行動」之間，經歷了哪兩個階段？',
    options: [
      { label: 'A', desc: 'Search（搜尋）和 Share（分享）' },
      { label: 'B', desc: 'Desire（慾望）和 Memory（記憶）' },
      { label: 'C', desc: 'Evaluation（評估）和 Trial（試用）' },
      { label: 'D', desc: 'Comparison（比較）和 Decision（決策）' },
    ],
    correctIndex: 1,
    explanation:
      '答案：(B)。AIDMA 五階段：Attention → Interest → Desire（慾望）→ Memory（記憶）→ Action。Interest 之後先升級為購買慾望，再記住品牌等待時機，最後行動。(A) 是 AISAS 的階段。',
  },
  {
    type: 'quiz',
    title: '概念測驗 3',
    question: 'AISAS 模型與 AIDMA 最大的差異是？',
    options: [
      { label: 'A', desc: 'AISAS 不需要引起消費者注意（Attention）' },
      { label: 'B', desc: 'AISAS 中消費者是被動接收者，AIDMA 中是主動搜尋者' },
      { label: 'C', desc: 'AISAS 增加了 Search 和 Share，資訊流從單向變雙向' },
      { label: 'D', desc: 'AISAS 只適用於金融業，AIDMA 適用於所有產業' },
    ],
    correctIndex: 2,
    explanation:
      '答案：(C)。AISAS 的核心差異：消費者從被動接收者變為主動搜尋者和傳播者。Search 取代了 Desire + Memory，Share 是全新階段。資訊流從單向（企業→消費者）變為雙向（消費者↔消費者）。(B) 說反了。',
  },
  {
    type: 'quiz',
    title: '概念測驗 4',
    question: '在 AISAS 模型中，Search 與 Share 之間形成的循環效應被稱為？',
    options: [
      { label: 'A', desc: '品牌忠誠循環' },
      { label: 'B', desc: '自我強化循環（口碑傳播的病毒效應）' },
      { label: 'C', desc: '產品生命週期循環' },
      { label: 'D', desc: '市場區隔循環' },
    ],
    correctIndex: 1,
    explanation:
      '答案：(B)。A 的 Share → 觸發 B 的 Attention → B 產生 Interest → B 進行 Search → B 採取 Action → B 的 Share → 觸發 C……形成自我強化循環，具有自發性、可信度高、成本低、指數成長四大特性。',
  },
  {
    type: 'quiz',
    title: '概念測驗 5',
    question: '2017 台北世大運案例中，「捷運主題列車」對應 AISAS 的哪兩個階段？',
    options: [
      { label: 'A', desc: 'Attention 和 Action' },
      { label: 'B', desc: 'Interest 和 Search' },
      { label: 'C', desc: 'Attention 和 Share' },
      { label: 'D', desc: 'Interest 和 Action' },
    ],
    correctIndex: 1,
    explanation:
      '答案：(B)。捷運車廂彩繪成運動場景，引起民眾新鮮感和好奇心（Interest）。接著民眾主動搜尋哪個號次車廂有特定場景（Search），找到後拍照上傳。把品牌融入日常場景，引發自發性的興趣與搜尋。',
  },
  {
    type: 'quiz',
    title: '概念測驗 6',
    question: '根據 Nielsen（2015）全球信任度調查，消費者最信任的資訊來源是？',
    options: [
      { label: 'A', desc: '電視廣告' },
      { label: 'B', desc: '親友推薦' },
      { label: 'C', desc: '品牌官方網站' },
      { label: 'D', desc: '網路橫幅廣告' },
    ],
    correctIndex: 1,
    explanation:
      '答案：(B)。根據 Nielsen（2015）調查，約 83% 的消費者信任親友推薦，遠高於對線上廣告的信任度（約 46%）。這正是 AISAS 中 Share 階段如此重要的原因。',
  },
  {
    type: 'quiz',
    title: '概念測驗 7',
    question: '林教授建議富誠的行銷重點應從「買更多廣告」轉為以下哪個方向？',
    options: [
      { label: 'A', desc: '增加電視廣告曝光量，搶佔消費者記憶' },
      { label: 'B', desc: '讓客戶願意分享、讓人搜得到、讓搜到的人願意行動' },
      { label: 'C', desc: '聘請更多業務員，用人海戰術拓展客源' },
      { label: 'D', desc: '降低產品售價，用低價策略吸引大量客戶' },
    ],
    correctIndex: 1,
    explanation:
      '答案：(B)。林教授三策略：(1) 讓客戶願意分享——做出值得分享的產品體驗；(2) 讓人搜得到你——優化搜尋結果和口碑；(3) 讓搜到的人願意行動——降低行動門檻。',
  },
  {
    type: 'quiz',
    title: '概念測驗 8',
    question: '關於 AIDMA 與 AISAS 的適用情境，下列敘述何者最正確？',
    options: [
      { label: 'A', desc: 'AIDMA 已完全過時，所有行銷策略都應使用 AISAS' },
      { label: 'B', desc: '兩個模型不能同時使用，企業必須二選一' },
      { label: 'C', desc: '不是哪個更好，而是目標客群怎麼做決策；年輕族群適合 AISAS，年長族群可能適合 AIDMA' },
      { label: 'D', desc: 'AISAS 只適用於社群媒體行銷，其他管道仍應使用 AIDMA' },
    ],
    correctIndex: 2,
    explanation:
      '答案：(C)。教科書強調「模型是工具，不是信仰」。富誠鎖定 25-35 歲年輕上班族——標準 AISAS 消費者。但賣退休理財給 65 歲族群，AIDMA 可能更適合。同一人在不同產品上也可能用不同模型。',
  },
];

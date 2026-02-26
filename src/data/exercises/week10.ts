import type { QuizSegment } from "@/types";

export const week10Exercises: QuizSegment[] = [
  {
    type: "quiz",
    title: "概念測驗 1",
    question: "價值主張畫布（Value Proposition Canvas）最早由誰在哪一年提出？",
    options: [
      { label: "A", desc: "Philip Kotler（2000 年），在《行銷管理》中提出" },
      { label: "B", desc: "Dave Gray（2010 年），在 XPLANE 公司提出" },
      { label: "C", desc: "Alexander Osterwalder 等人（2014 年），在《Value Proposition Design》中提出" },
      { label: "D", desc: "Michael Porter（1985 年），在《競爭優勢》中提出" },
    ],
    correctIndex: 2,
    explanation:
      "答案：(C)。價值主張畫布（VPC）由 Alexander Osterwalder 等人於 2014 年在《Value Proposition Design》中正式提出，是商業模式畫布（Business Model Canvas, 2010）的延伸。(A) Kotler 是行銷學之父，但 VPC 不是他的工具；(B) Dave Gray 提出的是同理心地圖；(D) Porter 提出的是價值鏈分析。",
  },
  {
    type: "quiz",
    title: "概念測驗 2",
    question: "VPC 的右側圓形稱為「顧客描述（Customer Profile）」，包含哪三個元素？",
    options: [
      { label: "A", desc: "任務（Customer Jobs）、痛點（Pains）、獲益（Gains）" },
      { label: "B", desc: "產品和服務、痛點解決方案、創造獲益" },
      { label: "C", desc: "人口統計、心理特徵、行為模式" },
      { label: "D", desc: "想法和感受、聽到什麼、看到什麼" },
    ],
    correctIndex: 0,
    explanation:
      "答案：(A)。VPC 的右側圓形「顧客描述」包含三個元素：任務（Customer Jobs）——客戶想完成什麼事；痛點（Pains）——完成任務中的阻礙和風險；獲益（Gains）——客戶期望的成果和好處。(B) 是左側方形「價值主張」的三元素；(C) 是人物誌的元素；(D) 是同理心地圖的維度。",
  },
  {
    type: "quiz",
    title: "概念測驗 3",
    question: "關於 Customer Jobs 的三種類型，下列哪個屬於「社會性任務」？",
    options: [
      { label: "A", desc: "把每月閒錢做有效配置" },
      { label: "B", desc: "不想被同事覺得「完全不懂理財」" },
      { label: "C", desc: "對未來感到安心" },
      { label: "D", desc: "每月定期投入 5,000 元" },
    ],
    correctIndex: 1,
    explanation:
      "答案：(B)。社會性任務是客戶想在他人眼中維持或提升的形象。「不想被同事覺得不懂理財」涉及社交認同和面子問題。(A) 和 (D) 是功能性任務——實際想完成的事；(C) 是情感性任務——想獲得的內在感受。",
  },
  {
    type: "quiz",
    title: "概念測驗 4",
    question: "VPC 的左側方形稱為「價值主張（Value Map）」，包含哪三個元素？",
    options: [
      { label: "A", desc: "任務、痛點、獲益" },
      { label: "B", desc: "產品和服務（Products & Services）、痛點解決方案（Pain Relievers）、創造獲益（Gain Creators）" },
      { label: "C", desc: "功能性價值、情感性價值、社會性價值" },
      { label: "D", desc: "核心產品、附加服務、品牌承諾" },
    ],
    correctIndex: 1,
    explanation:
      "答案：(B)。VPC 左側方形「價值主張」包含三個元素：產品和服務——你提供什麼；痛點解決方案——如何減輕客戶痛點；創造獲益——如何為客戶創造好處。(A) 是右側圓形的三元素；(C) 和 (D) 都不是 VPC 的標準分類。",
  },
  {
    type: "quiz",
    title: "概念測驗 5",
    question: "富誠對林志翔的痛點配適比對中，出現了兩個「空白」（✗）。這兩個空白分別是什麼？",
    options: [
      { label: "A", desc: "看不懂、門檻迷思" },
      { label: "B", desc: "怕做錯、門檻迷思" },
      { label: "C", desc: "不知道信誰、怕被推銷" },
      { label: "D", desc: "看不懂、怕被推銷" },
    ],
    correctIndex: 2,
    explanation:
      "答案：(C)。富誠的五個痛點配適結果：看不懂（✓ 強配適）、怕做錯（△ 弱配適）、不知道信誰（✗ 空白）、怕被推銷（✗ 空白）、門檻迷思（✓ 強配適）。兩個空白都與「信任」有關——缺乏第三方背書和不推銷承諾。",
  },
  {
    type: "quiz",
    title: "概念測驗 6",
    question: "根據 VPC 的配適結果，「弱配適（△）」的策略方向是什麼？",
    options: [
      { label: "A", desc: "放大宣傳，將此優勢作為行銷主打" },
      { label: "B", desc: "強化現有功能或加入新功能補強" },
      { label: "C", desc: "策略性放棄，將資源投入其他方向" },
      { label: "D", desc: "維持現狀，不需要改變" },
    ],
    correctIndex: 1,
    explanation:
      "答案：(B)。三種配適結果的策略方向：強配適（✓）→ 放大宣傳；弱配適（△）→ 產品改善，強化現有功能或加入新功能；空白（✗）→ 新開發或策略性放棄。富誠的弱配適案例：「怕做錯」有模擬投資功能但缺乏社會證明 → 加入同儕比較功能。",
  },
  {
    type: "quiz",
    title: "概念測驗 7",
    question: "關於老李提出的信任建立方法，下列何者不在其中？",
    options: [
      { label: "A", desc: "第三方背書（財經雜誌推薦、金管會認證）" },
      { label: "B", desc: "真實口碑（讓用過的客戶自己說體驗）" },
      { label: "C", desc: "降價促銷（用最低價吸引客戶嘗試）" },
      { label: "D", desc: "承諾機制（白紙黑字保證不主動推銷）" },
    ],
    correctIndex: 2,
    explanation:
      "答案：(C)。老李的信任建立三招：(1) 第三方背書、(2) 真實口碑、(3) 承諾機制。降價促銷不在其中——老李強調信任不是靠降價建立的，而是靠制度化的信任機制。降價可能反而降低品牌價值感。",
  },
  {
    type: "quiz",
    title: "概念測驗 8",
    question: "關於 W08-W10 的三步驟分析流程，下列排序何者正確？",
    options: [
      { label: "A", desc: "同理心地圖 → 人物誌 → 價值主張畫布" },
      { label: "B", desc: "價值主張畫布 → 人物誌 → 同理心地圖" },
      { label: "C", desc: "人物誌（他是誰）→ 同理心地圖（他怎麼想）→ 價值主張畫布（我能解決什麼）" },
      { label: "D", desc: "人物誌 → 價值主張畫布 → 同理心地圖" },
    ],
    correctIndex: 2,
    explanation:
      "答案：(C)。正確順序：人物誌（W08，定義「他是誰」）→ 同理心地圖（W09，理解「他怎麼想」）→ 價值主張畫布（W10，檢驗「我的產品能不能解決他的問題」）。每一步都以前一步的產出為輸入，三者缺一不可。VPC 的獨特貢獻在於最後一步的比對配適。",
  },
];

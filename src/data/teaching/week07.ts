import type { SegmentTeaching } from '@/types';
import { week07Formulas } from '@/data/formulas/week07';

/**
 * Week 07「數位消費者的旅程：AISAS」的課堂教學腳本
 *
 * 對齊教師手冊 8 個時段 → 互動平台 9 段（時段 8 拆為 mission + story）：
 *   seg 0 (story)  : 時段 1 — 暖身 STP 回顧 + 消費者行為轉場     5 步 (3L + 1C + 1L)
 *   seg 1 (theory) : 時段 2 — 劇情導入 + AIDMA 模型講授            8 步 (5L + 1V + 2C)
 *   seg 2 (theory) : 時段 3 — AISAS 模型 + AIDMA vs AISAS 比較     9 步 (5L + 2V + 2C)
 *   seg 3 (theory) : 時段 4 — 世大運案例 A-I-S                     7 步 (5L + 2C)
 *   seg 4 (theory) : 時段 5 — 世大運案例 A-S + Search/Share 引擎   7 步 (4L + 1V + 2C)
 *   seg 5 (theory) : 時段 6 — 富誠 AISAS 實戰旅程設計 + 練習       6 步 (4L + 1C + 1DT)
 *   seg 6 (discuss): 時段 7 — 小組討論：金融業 AISAS 特殊考量      4 步 (3L + 1DT)
 *   seg 7 (mission): 時段 8 前半 — PBL 任務                        4 步 (3L + 1C)
 *   seg 8 (story)  : 時段 8 後半 — Cliffhanger 人物誌預告          3 步 (3L)
 *
 * 53 步 = 35L + 11C + 4V + 3DT (含 DT=discuss_timer)
 * lecture:check ≈ 3.2:1
 */
export const week07Teaching: SegmentTeaching[] = [
  // ═══════════════════════════════════════════════════
  // Segment 0: 暖身 STP 回顧 + 消費者行為轉場（時段 1, 10 min）
  // ═══════════════════════════════════════════════════
  {
    steps: [
      {
        type: 'lecture',
        character: 'profLin',
        text: '同學們，前六週我們完成了 STP 三部曲：切蛋糕（Segmentation）、選蛋糕（Targeting）、吃蛋糕（Positioning）。富誠知道了市場長什麼樣、要服務誰、在消費者心中要成為誰。策略確立了。但今天有一個新的問題——',
        note: '快速回顧 STP 三部曲',
      },
      {
        type: 'lecture',
        character: 'profLin',
        text: '想想你自己最近一次下載一個新 App 的經驗——你是看到廣告才下載的，還是朋友推薦的？來，看到廣告才下載的舉手？朋友推薦才下載的舉手？',
        note: '舉手調查：引導學生反思自身消費行為',
      },
      {
        type: 'check',
        question: '富誠完成了 STP 三部曲，S、T、P 分別代表什麼？',
        options: [
          'Strategy（策略）、Technology（技術）、Promotion（促銷）',
          'Segmentation（市場區隔）、Targeting（目標選擇）、Positioning（品牌定位）',
          'Survey（調查）、Test（測試）、Plan（計畫）',
          'Sales（銷售）、Training（訓練）、Pricing（定價）',
        ],
        correctIndex: 1,
        onCorrect: '正確！STP 是行銷策略的核心框架：先切市場、再選目標、最後定位。',
        onWrong: 'STP = Segmentation（市場區隔）+ Targeting（目標選擇）+ Positioning（品牌定位）。前六週的核心框架。',
      },
      {
        type: 'lecture',
        character: 'xiaoYa',
        text: '建宏，你看這張數據。我查了 App 用戶來源——90% 來自「朋友推薦」和「社群分享」，廣告帶來的只有不到 5%。我們花大錢買的 Google 和 Facebook 廣告，幾乎沒有用。',
        note: '核心數據：90% 推薦 vs 5% 廣告 → 顛覆傳統行銷認知',
      },
      {
        type: 'lecture',
        character: 'profLin',
        text: '建宏問對了——如果 90% 是朋友推薦來的，行銷策略應該完全不一樣。數位時代的消費者不只被動看廣告，他們會主動搜尋、也會主動分享。今天我教你們兩個模型：AIDMA 和 AISAS。一個是「你阿公」的消費模式，一個是「你」的消費模式。',
        note: '林教授引入兩個模型的預告',
      },
    ],
  },

  // ═══════════════════════════════════════════════════
  // Segment 1: 劇情導入 + AIDMA 模型講授（時段 2, 20 min）
  // ═══════════════════════════════════════════════════
  {
    steps: [
      {
        type: 'lecture',
        character: 'profLin',
        text: '先講歷史。1898 年，美國人 E. St. Elmo Lewis 提出了 AIDA 模型——Attention、Interest、Desire、Action——描述消費者從看到廣告到購買的心理歷程。後來 Samuel Roland Hall 在 1920 年代加入了 Memory（記憶），就變成了 AIDMA 五階段模型。',
        note: 'AIDA (Lewis, 1898) → AIDMA (Hall, 1920s)',
      },
      {
        type: 'visual',
        component: 'FormulaQuickRef',
        caption: '本週核心公式與框架一覽',
        props: {
          formulas: week07Formulas,
        },
      },
      {
        type: 'lecture',
        character: 'profLin',
        text: 'AIDMA 的五個階段：Attention（注意）→ Interest（興趣）→ Desire（慾望）→ Memory（記憶）→ Action（行動）。注意，資訊流是單向的——企業透過廣告把訊息「推」給消費者。消費者是被動的接收者。',
        note: 'AIDMA 五階段 + 核心特徵：單向、被動',
      },
      {
        type: 'lecture',
        character: 'laoLi',
        text: '這就是我做了二十年的業務模式。銀行買電視廣告讓人注意到我們，漂亮的理財手冊引發興趣，業務員面對面創造購買慾望，留一張名片讓客戶記住，最後約到分行簽約。一步一步，穩穩地來。',
        note: '老李用金融案例驗證 AIDMA 五階段',
      },
      {
        type: 'lecture',
        character: 'profLin',
        text: 'AIDMA 誕生在大眾媒體主導的年代——電視、報紙、廣播是主要資訊來源。消費者獲取資訊的管道有限，只能被動接收。誰的廣告曝光量大、品牌記憶深，誰就贏。這是「推式行銷」（push marketing）的黃金時代。',
        note: '時代背景：大眾媒體主導 → 推式行銷',
      },
      {
        type: 'check',
        question: 'AIDMA 模型中，消費者從「產生興趣」到「採取行動」之間，經歷了哪兩個階段？',
        options: [
          'Search（搜尋）和 Share（分享）',
          'Desire（慾望）和 Memory（記憶）',
          'Evaluation（評估）和 Trial（試用）',
          'Comparison（比較）和 Decision（決策）',
        ],
        correctIndex: 1,
        onCorrect: '正確！AIDMA 的順序是 A→I→D→M→A。Interest 之後先升級為 Desire（購買慾望），再 Memory（記住品牌等待時機），最後 Action。',
        onWrong: '答案是 Desire（慾望）和 Memory（記憶）。AIDMA = Attention → Interest → Desire → Memory → Action。Search 和 Share 是 AISAS 的階段。',
      },
      {
        type: 'lecture',
        character: 'profLin',
        text: '現在問你們一個問題：你覺得今天的消費者還是這樣做決策嗎？你買東西之前，是「記住品牌等待時機」，還是「打開手機搜尋評價」？',
        note: '轉場提問：引出 AISAS',
      },
      {
        type: 'check',
        question: 'AIDMA 模型的資訊流方向是？',
        options: [
          '雙向循環：消費者和企業互相影響',
          '多向分散：消費者之間互相影響',
          '單向：企業→消費者（推式行銷）',
          '由下而上：消費者主動找企業',
        ],
        correctIndex: 2,
        onCorrect: '正確！AIDMA 是單向的——企業透過廣告把訊息「推」給消費者，消費者是被動的接收者。這就是推式行銷。',
        onWrong: 'AIDMA 的資訊流是單向的：企業→消費者。消費者被動接收廣告訊息。這是推式行銷（push marketing）的邏輯。',
      },
    ],
  },

  // ═══════════════════════════════════════════════════
  // Segment 2: AISAS 模型 + AIDMA vs AISAS 比較（時段 3, 25 min）
  // ═══════════════════════════════════════════════════
  {
    steps: [
      {
        type: 'lecture',
        character: 'profLin',
        text: '2004 年，日本電通株式會社（Dentsu）提出了 AISAS 模型，專門描述網路時代消費者的決策行為。五個階段：Attention → Interest → Search → Action → Share。注意兩個關鍵差異——',
        note: 'AISAS (Dentsu, 2004) 歷史背景',
      },
      {
        type: 'visual',
        component: 'AISASCycleEngine',
        caption: 'AISAS 循環模型與 Search/Share 引擎',
      },
      {
        type: 'lecture',
        character: 'profLin',
        text: '第一，Search 取代了 Desire + Memory——消費者不再被動等待，而是主動上網搜尋比較。第二，Share 是全新階段——購買後主動在社群分享體驗。最革命性的是第三點：Search 和 Share 形成循環——A 的分享觸發 B 的搜尋，B 又分享觸發 C 的搜尋，雪球越滾越大。',
        note: 'AISAS 三大關鍵差異',
      },
      {
        type: 'lecture',
        character: 'xiaoYa',
        text: '我用富誠數據驗證：朋友在 IG 分享理財心得——有人注意到——搜尋「富誠評價」——下載 App 開戶——用完又在 IG 分享「我開始理財了！」——新一輪循環開始。90% 推薦就是這個循環在運作。',
        note: '小雅用富誠數據驗證 AISAS 循環',
      },
      {
        type: 'check',
        question: 'AISAS 與 AIDMA 最大的差異是什麼？',
        options: [
          'AISAS 不需要引起消費者注意',
          'AISAS 中消費者是被動接收者，AIDMA 中是主動搜尋者',
          'AISAS 增加了 Search 和 Share，資訊流從單向變雙向',
          'AISAS 只適用於金融業',
        ],
        correctIndex: 2,
        onCorrect: '正確！AISAS 的核心變革是：消費者從被動接收者變為主動搜尋者和傳播者。Search 取代 D+M，Share 是新階段，資訊流從單向變雙向。',
        onWrong: '答案是 (C)。AISAS 增加了 Search（主動搜尋）和 Share（主動分享），讓消費者從被動變主動，資訊流從單向（企業→消費者）變為雙向循環。注意 (B) 說反了。',
      },
      {
        type: 'lecture',
        character: 'profLin',
        text: '現在來做完整比較。消費者角色：被動→主動。資訊流：單向→雙向。核心媒體：電視報紙→搜尋引擎社群。購買前：記住等待→主動搜尋比較。購買後：結束→分享觸發循環。行銷關鍵：曝光量記憶度→搜尋力分享力。這不是哪個更好的問題——是你的目標客群怎麼做決策的問題。',
        note: '八維度比較 + 模型選擇原則',
      },
      {
        type: 'visual',
        component: 'AIDMAvsAISASComparison',
        caption: 'AIDMA vs AISAS 完整比較',
      },
      {
        type: 'lecture',
        character: 'profLin',
        text: '記住這句話：模型是工具，不是信仰。富誠鎖定 25-35 歲年輕上班族——標準 AISAS 消費者。但如果你賣退休理財給 65 歲長輩，AIDMA 可能更適合。同一個人在不同產品上也可能用不同模型。',
        note: '金句：模型是工具，不是信仰',
      },
      {
        type: 'check',
        question: '富誠鎖定 25-35 歲年輕上班族，應優先採用哪個模型？',
        options: [
          'AIDMA，因為金融業偏傳統',
          'AISAS，因為目標客群是數位原住民',
          '兩者都不適合，需要新模型',
          '由老闆決定，和客群無關',
        ],
        correctIndex: 1,
        onCorrect: '正確！25-35 歲年輕上班族是典型的 AISAS 消費者——他們會搜尋、會分享。富誠 90% 推薦數據就是最好的證明。',
        onWrong: '25-35 歲年輕上班族習慣主動搜尋、社群分享——是標準 AISAS 消費者。富誠 90% 來自推薦就是 AISAS 循環在運作。',
      },
    ],
  },

  // ═══════════════════════════════════════════════════
  // Segment 3: 世大運案例 A-I-S（時段 4, 25 min）
  // ═══════════════════════════════════════════════════
  {
    steps: [
      {
        type: 'lecture',
        character: 'profLin',
        text: '理論講完了，來看一個真實案例——2017 台北世界大學運動會。台灣第一次舉辦大型國際綜合賽事，賽前負面新聞一堆。但這場賽事的行銷是教科書等級的 AISAS 案例。注意，這是 2017 年的案例，距今已有數年，但作為 AISAS 模型的教學範例，其行銷邏輯歷久彌新。',
        note: '案例導入 + 時效性注記',
      },
      {
        type: 'lecture',
        character: 'profLin',
        text: 'A（Attention）——注意。正面的：官方影片「Taipei in Motion」上傳 9 小時吸引 69 萬人觀看。負面的：選手村缺失、票房慘淡——但反而讓全民注意到「世大運要開始了」。行銷啟示：Attention 不分正負，關鍵是進入消費者的「雷達範圍」。',
        note: 'A 階段：正反報導都引起注意',
      },
      {
        type: 'check',
        question: '世大運賽前的負面新聞（選手村缺失、票房慘淡）對 AISAS 的 Attention 階段有什麼效果？',
        options: [
          '完全無效，負面新聞只會傷害品牌',
          '反而引起全民關注——Attention 不分正負',
          '只有正面新聞才算 Attention',
          '負面新聞應該被隱藏，不算行銷',
        ],
        correctIndex: 1,
        onCorrect: '正確！Attention 不分正負，關鍵是進入消費者的「雷達範圍」。負面新聞反而讓全民注意到「世大運要開始了」。',
        onWrong: '答案是 (B)。Attention 不分正負——負面新聞也讓全民注意到世大運的存在。關鍵是進入消費者的「雷達範圍」。',
      },
      {
        type: 'lecture',
        character: 'profLin',
        text: 'I（Interest）——興趣。捷運車廂被彩繪成游泳池、籃球場、足球場，超級逼真，民眾瘋狂拍照。吉祥物「熊讚」跟市長出席活動，荷蘭水球選手團體照在網上瘋傳。行銷啟示：把品牌元素融入日常生活場景，比硬廣更有效。',
        note: 'I 階段：捷運列車引爆全民興趣',
      },
      {
        type: 'lecture',
        character: 'chen',
        text: '等等，捷運車廂我有印象！那年我剛在銀行上班沒多久，真的看到很多人在月台上等特定車廂，就為了拍照。我自己也拍了一張游泳池車廂的照片傳給同事。',
        note: '建宏現身說法（符合 2017 年 26 歲設定）',
      },
      {
        type: 'lecture',
        character: 'profLin',
        text: 'S（Search）——搜尋。建宏的行為就是最好的例子。民眾主動搜尋哪個號次車廂有游泳池場景，找到後拍照上傳。觀眾搜尋比賽時間、轉播資訊。行銷啟示：不必把所有資訊推給消費者，提供足夠的「誘因」讓他們自己來搜。被搜尋到的資訊，比被推銷的更有說服力。',
        note: 'S 階段：主動搜尋 + 啟示',
      },
      {
        type: 'check',
        question: '世大運「捷運主題列車」對應 AISAS 的哪兩個階段？',
        options: [
          'Attention 和 Action',
          'Interest 和 Search',
          'Attention 和 Share',
          'Interest 和 Action',
        ],
        correctIndex: 1,
        onCorrect: '正確！捷運車廂創意彩繪引發「Interest（興趣）」，民眾主動搜尋特定車廂拍照則是「Search（搜尋）」。',
        onWrong: '答案是 (B)。車廂彩繪引起 Interest（新鮮感好奇心），民眾搜尋哪個車廂有特定場景則是 Search（主動搜尋）。',
      },
    ],
  },

  // ═══════════════════════════════════════════════════
  // Segment 4: 世大運案例 A-S + Search/Share 引擎（時段 5, 20 min）
  // ═══════════════════════════════════════════════════
  {
    steps: [
      {
        type: 'lecture',
        character: 'profLin',
        text: 'A（Action）——行動。中華隊頻頻獲牌，觀眾開始買票入場。陳金鋒點燃聖火的畫面令全台沸騰。反年改團體阻撓入場的事件反而凝聚了社會支持。行銷啟示：Action 是前面所有階段的累積。共同的情感體驗能大幅加速行動轉換。',
        note: 'A (Action) 階段 + 啟示',
      },
      {
        type: 'lecture',
        character: 'profLin',
        text: 'S（Share）——分享。四類分享行為：捷運創意照片上傳、奪牌畫面分享、選手自己分享比賽、感人事件轉傳。廣告文案「這次，我們回家比賽」連結社群情感。過去需要大量廣告預算的曝光，由消費者自動完成——這就是 AISAS 比 AIDMA 強大的地方。',
        note: 'S (Share) 階段 + 滾雪球效應',
      },
      {
        type: 'lecture',
        character: 'profLin',
        text: '現在來看 Search 和 Share 這個雙引擎的四大特性：第一，自發性——消費者出於興趣搜尋和分享。第二，可信度高——根據 Nielsen（2015）調查，約 83% 的消費者信任親友推薦，遠高於線上廣告的約 46%。當然，消費者信任格局持續演變，最新數據可能有所不同。第三，成本低——企業做好產品，分享由消費者完成。第四，指數成長——每次分享觸發多個新搜尋者。',
        note: 'Search & Share 四特性 + Nielsen 2015 數據（含時效注記）',
      },
      {
        type: 'visual',
        component: 'AISASCycleEngine',
        caption: 'Search/Share 引擎的四大特性',
        props: { defaultTab: 'engine' },
      },
      {
        type: 'check',
        question: '根據 Nielsen（2015）全球信任度調查，消費者最信任的資訊來源是？',
        options: [
          '電視廣告',
          '親友推薦（約 83%）',
          '品牌官方網站',
          '網路橫幅廣告',
        ],
        correctIndex: 1,
        onCorrect: '正確！約 83% 的消費者信任親友推薦，遠高於線上廣告（約 46%）。這正是 AISAS 中 Share 如此重要的原因。',
        onWrong: '答案是親友推薦（約 83%）。Nielsen 2015 數據顯示，口碑信任度遠高於任何形式的廣告。這就是 Share 引擎的威力。',
      },
      {
        type: 'lecture',
        character: 'profLin',
        text: '所以富誠的策略不是「買更多廣告」，而是三件事：第一，讓客戶願意分享——做出值得分享的產品體驗。第二，讓人搜得到你——優化搜尋結果和口碑。第三，讓搜到的人願意行動——降低行動門檻。這就是為什麼 90% 廣告預算白花了——用 AIDMA 邏輯在數位時代做行銷。',
        note: '林教授三策略：Share + Search + Action 優化',
      },
      {
        type: 'check',
        question: '林教授建議富誠的行銷重點應從「買更多廣告」轉為？',
        options: [
          '增加電視廣告曝光量',
          '讓客戶願意分享、讓人搜得到、讓搜到的人願意行動',
          '聘請更多業務員',
          '降低產品售價',
        ],
        correctIndex: 1,
        onCorrect: '正確！三策略：(1) 讓客戶願意分享、(2) 讓人搜得到你、(3) 讓搜到的人願意行動。這是 AISAS 思維的核心。',
        onWrong: '答案是 (B)。林教授的三策略對應 AISAS 的核心：優化 Share（分享動機）、Search（搜尋結果）、Action（行動門檻）。',
      },
    ],
  },

  // ═══════════════════════════════════════════════════
  // Segment 5: 富誠 AISAS 實戰旅程設計 + 小組練習（時段 6, 20 min）
  // ═══════════════════════════════════════════════════
  {
    steps: [
      {
        type: 'lecture',
        character: 'profLin',
        text: '理論和案例都有了，現在來看富誠怎麼實際設計 AISAS 客戶旅程。每個階段我標出了具體的行銷觸點——',
        note: '導入富誠實戰設計',
      },
      {
        type: 'lecture',
        character: 'profLin',
        text: 'A（Attention）：IG/TikTok 短影音、KOL 合作、朋友社群分享。I（Interest）：「一分鐘看懂 ETF」懶人包、App 截圖、用戶故事（UGC）。S（Search）：Google 正面評價、PTT/Dcard 討論、YouTube 開箱影片。',
        note: 'A→I→S 階段觸點',
      },
      {
        type: 'lecture',
        character: 'profLin',
        text: 'A（Action）：免費下載、3 分鐘開戶、30 天免手續費、AI 理財健檢。S（Share）：邀請獎勵、每月理財成績單、一鍵分享功能。每一個觸點都可以優化——讓更多人進入下一階段。',
        note: 'A→S 階段觸點',
      },
      {
        type: 'lecture',
        character: 'laoLi',
        text: '客戶願意幫你說好話，比你自己說一百句都有用。過去口碑一次傳一人，數位時代一次傳幾百人。富誠的 90% 推薦數據告訴我們——Share 引擎已經啟動。下一步是優化 Search 和降低 Action 門檻。',
        note: '老李金句 + 策略方向',
      },
      {
        type: 'check',
        question: '富誠 90% 用戶來自推薦，這表示 AISAS 中哪個階段已經在運作？',
        options: [
          'Attention 階段（廣告曝光高）',
          'Search 階段（搜尋引擎排名好）',
          'Share 階段（口碑循環已啟動）',
          'Action 階段（產品免費下載）',
        ],
        correctIndex: 2,
        onCorrect: '正確！90% 推薦 = Share 引擎已啟動。現有用戶的分享正在驅動新用戶的進入。下一步是優化 Search 和降低 Action 門檻。',
        onWrong: '90% 來自推薦 = Share 階段在運作。用戶主動分享，帶來新用戶。富誠不缺分享動力，需要優化被搜尋到的結果（Search）和降低行動門檻（Action）。',
      },
      {
        type: 'discuss_timer',
        durationMinutes: 8,
        prompt: '小組快速練習（8 分鐘）：各組選一個日常使用的品牌（Netflix、蝦皮、Foodpanda 等），在工作紙上快速寫出該品牌的 AISAS 五階段觸點——每階段至少 1 個。重點看 Search 和 Share 的設計。完成後每組 1 分鐘分享。',
        guidePoints: ['發放教學附件二（AISAS 旅程設計工作紙）', '每階段至少寫 1 個觸點', '重點觀察 Search 和 Share 的設計'],
      },
    ],
  },

  // ═══════════════════════════════════════════════════
  // Segment 6: 小組討論——金融業 AISAS 特殊考量（時段 7, 20 min）
  // ═══════════════════════════════════════════════════
  {
    steps: [
      {
        type: 'lecture',
        character: 'profLin',
        text: '前面講的 AISAS 是通用的模型。但金融業有它的特殊性。各組選一題深入討論：(1) 金融商品的 Search 和一般消費品有什麼不同？(2) 金融商品的 Share 有什麼特殊障礙？(3) 你自己最近使用金融商品是 AIDMA 還是 AISAS 路徑？',
        note: '三個討論題（各組選一題）',
      },
      {
        type: 'lecture',
        character: 'profLin',
        text: '提示方向：金融搜尋更深入——涉及大筆金錢，消費者會查金管會、PTT 理財版、朋友真實經驗，搜尋時間也更長。Share 的障礙是隱私——很多人不願公開理財狀況。可以設計「分享經驗不分享金額」的機制，例如「連續存了 6 個月」而非「我賺了 5 萬」。',
        note: '各題引導方向',
      },
      {
        type: 'discuss_timer',
        durationMinutes: 10,
        prompt: '小組討論（10 分鐘）：各組圍繞選定的題目深入討論。討論完畢後每組 1 分鐘摘要發現。',
        guidePoints: ['Search 更深：金錢涉入度高，負面評價殺傷力更大', 'Share 有隱私障礙：設計「不暴露金額也能分享」的機制', '信任門檻更高：從首次接觸到首筆投資，平均需 6-8 次互動'],
      },
      {
        type: 'lecture',
        character: 'profLin',
        text: '各組報告得很好。讓我總結金融業 AISAS 的三個特殊性：第一，Search 更深入——涉及大筆金錢，消費者搜尋更多來源、比較更多細節。第二，Share 有隱私障礙——需要設計「分享經驗不分享金額」的機制。第三，信任門檻更高——從首次接觸到首筆投資，平均需要 6-8 次互動。',
        note: '教師總結金融業 AISAS 三特殊性',
      },
    ],
  },

  // ═══════════════════════════════════════════════════
  // Segment 7: PBL 任務（時段 8 前半）
  // ═══════════════════════════════════════════════════
  {
    steps: [
      {
        type: 'lecture',
        character: 'profLin',
        text: '任務 7 的情境：富誠要推出「AI 理財健檢」新功能——免費工具，用戶輸入基本資料後 AI 分析財務狀況並給出建議。你是富誠的行銷顧問，用 AISAS 模型為這項功能設計完整的客戶旅程地圖。',
        note: 'PBL 任務情境說明',
      },
      {
        type: 'lecture',
        character: 'profLin',
        text: '四項交付要求：第一，AISAS 五個階段各設計至少 2 個具體行銷觸點。第二，特別說明 Search 階段——目標客群最可能去哪裡搜尋？如何確保搜到正面資訊？第三，特別說明 Share 階段——什麼機制讓用戶忍不住想分享？第四，畫一張 AISAS 旅程圖，標注觸點和轉換率預估。',
        note: '四項交付要求',
      },
      {
        type: 'lecture',
        character: 'profLin',
        text: '進階挑戰：同樣的 AI 理財健檢功能，如果推給 55 歲退休族群，要改用 AIDMA 嗎？旅程設計有什麼不同？下週上課前交。',
        note: '進階挑戰 + 截止日期',
      },
      {
        type: 'check',
        question: '設計 AISAS 旅程時，最需要特別深入設計的兩個階段是？',
        options: [
          'Attention 和 Interest（因為是第一印象）',
          'Search 和 Share（因為是 AISAS 的核心引擎）',
          'Interest 和 Action（因為最影響銷售）',
          'Attention 和 Action（因為是頭尾兩端）',
        ],
        correctIndex: 1,
        onCorrect: '正確！Search 和 Share 是 AISAS 的核心引擎——搜尋確保消費者找得到你，分享確保現有用戶帶來新用戶。任務要求特別說明這兩個階段。',
        onWrong: '答案是 Search 和 Share。它們是 AISAS 的核心引擎，形成自我強化的成長飛輪。任務也特別要求深入設計這兩個階段。',
      },
    ],
  },

  // ═══════════════════════════════════════════════════
  // Segment 8: Cliffhanger——統計數字背後的真人（時段 8 後半）
  // ═══════════════════════════════════════════════════
  {
    steps: [
      {
        type: 'lecture',
        character: 'chen',
        text: '教授，我們說了這麼久「25-35 歲年輕上班族」——但這只是一個統計數字。他到底是誰？叫什麼名字？每天的生活是什麼樣子？理財煩惱是什麼？',
        note: '建宏的核心困惑——從統計到真人',
      },
      {
        type: 'lecture',
        character: 'profLin',
        text: '建宏，你問了一個好問題。你知道他的年齡、收入、行為模式——但你不認識他。下週我要你做一件事：去跟消費者聊聊。給他一個名字、一張臉、一段人生。這叫人物誌——Persona。',
        note: '林教授引出下週主題：Persona',
      },
      {
        type: 'lecture',
        character: 'narrator',
        text: '消費者的行為路徑搞清楚了——AISAS 告訴我們他們怎麼從陌生人變成客戶。但「25-35 歲年輕上班族」還只是數字。下週——走進客戶的世界，建立真實的人物誌（Persona）。',
        note: 'Cliffhanger → W08 Persona',
      },
    ],
  },
];

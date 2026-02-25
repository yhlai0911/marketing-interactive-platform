import type { Lesson } from '@/types';

export const week07: Lesson = {
  week: 7,
  title: '數位消費者的旅程：AISAS',
  segments: [
    // ═══ Seg 0 (story): 時段 1 — 暖身 STP 回顧 + 消費者行為轉場 ═══
    {
      type: 'story',
      title: 'STP 完結，然後呢？',
      narration:
        '前六週完成了 STP 三部曲：切蛋糕、選蛋糕、吃蛋糕。富誠知道了市場長什麼樣、要服務誰、在消費者心中要成為誰。策略確立了。但建宏有一個新的困惑——消費者到底是怎麼找到我們的？小雅在會議室秀出了一張讓所有人沉默的數據圖。',
      dialogues: [
        {
          character: 'xiaoYa',
          text: '建宏，你看這張數據。我查了 App 用戶來源：90% 來自「朋友推薦」和「社群分享」，廣告帶來的只有不到 5%。我們花大錢買的 Google 和 FB 廣告，幾乎沒有用。',
        },
        {
          character: 'chen',
          text: '等等，如果 90% 是朋友推薦來的——那行銷策略應該完全不一樣吧？不該一直投廣告，而是想辦法讓現有客戶「願意分享」？',
        },
        {
          character: 'profLin',
          text: '建宏問對了。你在銀行六年，學的是傳統行銷思維——打廣告、買曝光、衝轉換率。但數位時代的消費者不是這樣。他們會主動搜尋，也會主動分享。今天我教你們兩個模型：AIDMA 和 AISAS。',
        },
      ],
    },

    // ═══ Seg 1 (theory): 時段 2 — 劇情導入 + AIDMA 模型 ═══
    {
      type: 'theory',
      title: 'AIDMA：傳統消費者行為模型',
      points: [
        {
          title: 'AIDMA 五階段',
          desc: '源自 E. St. Elmo Lewis (1898) 的 AIDA 模型，由 Samuel Roland Hall 於 1920 年代加入 Memory 階段形成。五階段：Attention（注意）→ Interest（興趣）→ Desire（慾望）→ Memory（記憶）→ Action（行動）。核心特徵：單向（企業→消費者），消費者是被動接收者。',
          example:
            '老李做了二十年的業務模式：銀行買電視廣告（A）、漂亮理財手冊引發興趣（I）、業務員創造購買慾望（D）、留名片讓客戶記住（M）、約到分行簽約（A）。',
        },
        {
          title: 'AIDMA 的時代背景',
          desc: '誕生於大眾媒體主導的年代——電視、報紙、廣播是主要資訊來源。消費者獲取資訊的管道有限，只能「被動」接收企業透過廣告傳遞的訊息。誰的廣告曝光量大、品牌記憶深，誰就贏。',
        },
      ],
      formula: 'Attention → Interest → Desire → Memory → Action',
      chart: null,
    },

    // ═══ Seg 2 (theory): 時段 3 — AISAS 模型 + AIDMA vs AISAS 比較 ═══
    {
      type: 'theory',
      title: 'AISAS 模型與兩代模型比較',
      points: [
        {
          title: 'AISAS 五階段',
          desc: '2004 年由日本電通株式會社（Dentsu）提出，專為描述網路時代的消費者決策。五階段：Attention → Interest → Search → Action → Share。三大關鍵差異：(1) Search 取代 Desire + Memory——消費者主動搜尋；(2) Share 是全新階段——購買後在社群分享；(3) Search ↔ Share 形成迴圈——A 的分享觸發 B 的搜尋。',
          example:
            '小雅用富誠數據驗證：朋友在 IG 分享（A）→ 覺得有趣（I）→ 搜尋「富誠評價」（S）→ 下載 App（A）→ 在 IG 分享「我開始理財了！」（S）→ 新一輪循環開始。',
        },
        {
          title: 'AIDMA vs AISAS 八維度比較',
          desc: '消費者角色：被動→主動。資訊流向：單向→雙向。核心媒體：電視報紙→搜尋引擎社群。購買前：記住等時機→主動搜尋比較。購買後：結束→線上分享觸發循環。行銷關鍵：曝光量記憶度→搜尋力分享力。',
        },
        {
          title: '模型是工具，不是信仰',
          desc: '不是哪個模型「更好」，而是目標客群怎麼做決策。富誠鎖定 25-35 歲年輕上班族——標準 AISAS 消費者。但若賣退休理財給 65 歲族群，AIDMA 可能更適合。同一人在不同產品上也可能用不同模型。',
        },
      ],
      formula: 'Attention → Interest → Search → Action → Share（循環）',
      chart: null,
    },

    // ═══ Seg 3 (theory): 時段 4 — 世大運案例 A-I-S ═══
    {
      type: 'theory',
      title: '世大運案例：Attention、Interest、Search',
      points: [
        {
          title: 'A（Attention）：正反報導都引起注意',
          desc: '正面注意：官方影片「Taipei in Motion」上傳 9 小時吸引 69 萬人觀看。負面注意：選手村缺失、票房慘淡——反而讓全民關注「世大運要開始了」。行銷啟示：Attention 不分正負，關鍵是進入消費者的「雷達範圍」。',
        },
        {
          title: 'I（Interest）：捷運列車引爆全民興趣',
          desc: '捷運車廂彩繪成游泳池、籃球場、足球場，引起民眾瘋狂拍照。吉祥物「熊讚」跟市長出席活動。荷蘭水球選手團體照引發瘋傳。行銷啟示：把品牌元素融入日常生活場景，比硬廣更有效。',
        },
        {
          title: 'S（Search）：主動搜尋成為新常態',
          desc: '民眾主動搜尋哪個號次車廂有特定場景，找到後拍照上傳。觀眾搜尋比賽時間和轉播資訊。行銷啟示：不必把所有資訊推給消費者，提供足夠「誘因」讓消費者自己來搜。被搜尋到的資訊比被推銷的更有說服力。',
        },
      ],
      formula: null,
      chart: null,
    },

    // ═══ Seg 4 (theory): 時段 5 — 世大運案例 A-S + Search/Share 引擎 ═══
    {
      type: 'theory',
      title: '世大運案例：Action、Share 與 Search/Share 引擎',
      points: [
        {
          title: 'A（Action）：從觀望到進場',
          desc: '中華隊頻頻獲牌，觀眾買票入場。陳金鋒點燃聖火令全台沸騰。反年改阻撓事件反而凝聚社會支持。行銷啟示：Action 是前面所有階段的累積。共同情感體驗能大幅加速行動轉換。',
        },
        {
          title: 'S（Share）：口碑的病毒傳播',
          desc: '分享行為：捷運照片上傳、奪牌畫面分享、選手分享比賽、感人事件轉傳。廣告文案「這次，我們回家比賽」連結社群情感。滾雪球效應：分享→搜尋→再分享，過去需要大量廣告預算的曝光，由消費者自動完成。',
        },
        {
          title: 'Search & Share 雙引擎四特性',
          desc: '(1) 自發性：消費者出於興趣搜尋和分享。(2) 可信度高：約 83% 信任親友推薦（Nielsen 2015），遠高於線上廣告。(3) 成本低：企業做好產品，分享由消費者完成。(4) 指數成長：每次分享觸發多個搜尋者。',
          example:
            '林教授三策略：(1) 讓客戶願意分享——做出值得分享的體驗；(2) 讓人搜得到你——優化口碑和搜尋結果；(3) 讓搜到的人願意行動——降低行動門檻。',
        },
      ],
      formula: null,
      chart: null,
    },

    // ═══ Seg 5 (theory): 時段 6 — 富誠 AISAS 實戰旅程設計 ═══
    {
      type: 'theory',
      title: '富誠的 AISAS 客戶旅程',
      points: [
        {
          title: 'A→I→S→A→S 五階段觸點設計',
          desc: 'A：IG/TikTok 短影音、KOL 合作、朋友社群分享。I：「一分鐘看懂 ETF」懶人包、App 截圖、UGC 故事。S：Google 正面評價、PTT/Dcard 討論、YouTube 開箱。A：免費下載、3 分鐘開戶、30 天免手續費、理財健檢。S：邀請獎勵、每月理財成績單、一鍵分享。',
        },
        {
          title: '老李的洞察',
          desc: '「客戶願意幫你說好話，比你自己說一百句都有用。」過去口碑一次傳一人，數位時代一次傳幾百人。這就是 AISAS 比 AIDMA 強大的地方。富誠的 90% 推薦數據 = Share 引擎已經啟動，下一步是優化 Search 和降低 Action 門檻。',
        },
      ],
      formula: null,
      chart: null,
    },

    // ═══ Seg 6 (discuss): 時段 7 — 小組討論：金融業 AISAS 特殊考量 ═══
    {
      type: 'discuss',
      title: '討論：金融業 AISAS 的特殊考量',
      prompt:
        '各組選一題深入討論：(1) 金融商品的 Search 和一般消費品有什麼不同？（提示：金錢涉入度高，搜尋行為更深入謹慎）(2) 金融商品的 Share 有什麼特殊障礙？（提示：隱私——很多人不願公開理財狀況）(3) 你自己最近使用金融商品是 AIDMA 還是 AISAS 路徑？',
      guidePoints: [
        'Search 差異：金融搜尋更深入（查金管會、PTT 理財版、朋友真實經驗），搜尋時間更長，負面評價殺傷力更大',
        'Share 障礙：隱私是最大障礙——設計「分享經驗不分享金額」的機制（如理財體質分數、連續存款天數）',
        '金融業 AISAS 三特殊性：Search 更深、Share 有隱私門檻、信任建立平均需 6-8 次互動',
      ],
    },

    // ═══ Seg 7 (mission): 時段 8 前半 — PBL 任務 ═══
    {
      type: 'mission',
      title: 'AISAS 客戶旅程設計',
      description:
        '富誠要推出「AI 理財健檢」新功能——免費工具，用戶輸入基本資料後 AI 分析財務狀況並給出建議。你是富誠的行銷顧問，用 AISAS 模型為這項功能設計完整的客戶旅程地圖。',
      deliverables: [
        '為 AISAS 五個階段各設計至少 2 個具體的行銷觸點，說明在哪裡、用什麼方式接觸消費者',
        '特別說明 Search 階段：目標客群最可能去哪裡搜尋？如何確保搜到正面資訊？',
        '特別說明 Share 階段：設計什麼機制讓用戶「忍不住想分享」？',
        '畫出 AISAS 旅程圖，標注每個階段的觸點和轉換率預估',
        '進階挑戰：同樣功能推給 55 歲退休族群，要改用 AIDMA 嗎？旅程設計有什麼不同？',
      ],
    },

    // ═══ Seg 8 (story): 時段 8 後半 — Cliffhanger ═══
    {
      type: 'story',
      title: '統計數字背後的真人',
      narration:
        'AISAS 分析完了，富誠知道客戶怎麼從陌生人變成用戶。但建宏看著白板上寫的「25-35 歲年輕上班族」六個字，突然覺得很空洞。',
      dialogues: [
        {
          character: 'chen',
          text: '教授，我們說了這麼久「25-35 歲年輕上班族」——但這只是一個統計數字。他到底是誰？叫什麼名字？每天的生活是什麼樣子？理財煩惱是什麼？',
        },
        {
          character: 'profLin',
          text: '建宏，你問了一個好問題。你知道他的年齡、收入、行為模式——但你不認識他。下週我要你做一件事：去跟消費者聊聊。給他一個名字、一張臉、一段人生。這叫人物誌——Persona。',
        },
        {
          character: 'narrator',
          text: '消費者的行為路徑（AISAS）搞清楚了。但「25-35 歲年輕上班族」還只是數字。下週——走進客戶的世界，建立真實的人物誌（Persona）。',
        },
      ],
    },
  ],
};

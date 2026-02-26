// Week 11: 設計商品——金融產品策略
import type { FormulaItem } from "@/components/visuals/FormulaQuickRef";

export const week11Formulas: FormulaItem[] = [
  {
    name: "產品三層次模型（Kotler）",
    formula: "核心利益（客戶真正買的是什麼）→ 形式產品（品質/功能/設計/品牌/包裝）→ 延伸產品（附加服務與體驗）",
    description:
      "Philip Kotler 在《Marketing Management》中提出的經典模型。最內層是核心利益（Core Benefit），客戶購買的不是產品本身而是帶來的價值；中間層是形式產品（Actual Product），將核心利益轉化為具體可辨識的產品形態；最外層是延伸產品（Augmented Product），超越客戶基本期望的附加價值。金融商品的核心利益容易同質化，形式產品受法規限制，延伸產品是差異化的主戰場。",
    example:
      "富誠·安退：核心利益＝退休不焦慮（掌控感與安心感）；形式產品＝AI 退休試算器 + 精選 ETF 組合 + 管理費 0.3%；延伸產品＝白話文教育、安退社群、安心退場機制、年度健檢報告。",
  },
  {
    name: "產品組合三維度",
    formula: "寬度（產品線數量）× 深度（每條線的商品數量）× 一致性（各產品線是否互相強化）",
    description:
      "產品組合（Product Mix）是一家公司所銷售的所有產品線與產品項目的集合。寬度（Width）指產品線的數量，越寬代表業務範圍越廣；深度（Depth）指每條產品線中的具體商品數量，越深代表選擇越多；一致性（Consistency）指各產品線在目標客群、技術平台、品牌形象上的關聯程度，一致性高代表各產品線互相加分。",
    example:
      "萬泰金控：寬度＝5（投資/保險/信貸/信用卡/財富管理），投資產品線深度＝4（500 支 ETF/200 支基金/定期定額/智能投資）。富誠：寬度＝2（ETF 推薦 + 安退退休規劃），深度較淺但更聚焦。",
  },
  {
    name: "互補效應 vs 蠶食效應",
    formula: "目標客群不同 or 使用場景不同 → 互補效應 ｜ 目標客群+場景高度重疊 → 蠶食效應",
    description:
      "互補效應（Complementary Effect）：新產品幫助舊產品賣得更好，兩者互相強化。蠶食效應（Cannibalization）：新產品搶走舊產品的客戶。判斷原則：如果新舊產品的目標客群不同或使用場景不同，通常是互補；如果目標客群和場景高度重疊，就容易蠶食。主動蠶食有時是策略：「如果你不蠶食自己，別人就會來蠶食你。」",
    example:
      "富誠案例：ETF 推薦（主動投資者）+ 安退退休規劃包（被動規劃者）→ 目標客群不同，判定為互補效應。兩者底層共用 ETF 推薦引擎，互相強化。",
  },
  {
    name: "品牌策略三選項",
    formula: "品牌延伸（借用母品牌信任）vs 獨立品牌（避免干擾）vs 副品牌（兼得信任+定位）",
    description:
      "品牌延伸（Brand Extension）：直接用既有品牌名推新產品，降低推廣成本但失敗可能拖累母品牌。獨立品牌（Individual Brand）：全新品牌不提母公司，可針對不同客群但建立信任成本高。副品牌（Sub-brand）：母品牌+副品牌名架構，兼得母品牌信任與新品牌獨特定位。在金融業，品牌是信任的載體，品牌延伸的價值特別高。信任三來源：制度信任、能力信任、善意信任。",
    example:
      "富誠選擇副品牌「富誠·安退」：母品牌「富誠」提供信任基礎，副品牌「安退」傳遞「安心退休」的獨特定位，比「富誠退休規劃」更有記憶點。",
  },
  {
    name: "IHIP 金融服務四大特性",
    formula: "Intangibility（無形性）+ Inseparability（不可分割性）+ Variability（變異性）+ Perishability（易逝性）",
    description:
      "金融服務與實體商品的四個根本差異：無形性——看不見摸不著，客戶無法在購買前評估品質，需靠信任和口碑；不可分割性——生產與消費同時發生，服務品質取決於提供者狀態；變異性——每次服務可能不同，品質不穩定；易逝性——無法儲存，供需不平衡時難以調整。對策分別是：有形化（Physical Evidence）、標準化+科技輔助、SOP+品質控管、預約制+數位自助服務。",
    example:
      "老李的銀行經驗：無形性＝客戶問「保險到底保了什麼」；變異性＝心情好多聊半小時，心情差三分鐘結束；易逝性＝年底旺季排隊一小時，一月淡季坐著發呆。",
  },
  {
    name: "7P 服務行銷組合",
    formula: "傳統 4P（Product + Price + Place + Promotion）+ 服務 3P（People + Process + Physical Evidence）",
    description:
      "Booms & Bitner（1981）提出的 7P 模型，在傳統 4P 之上增加三個專為服務業設計的 P。People（人員）：提供服務的人員素質直接影響客戶體驗。Process（流程）：服務提供的每一步流程都是體驗的一部分。Physical Evidence（實體證據）：用「看得到的東西」代表「看不到的服務」。金融業尤其需要 Physical Evidence，因為金融商品是「承諾」——承諾本身看不見，需要用看得見的東西來承載。",
    example:
      "富誠 7P：Product＝安退退休規劃包；Price＝管理費 0.3%；Place＝App+官網；Promotion＝內容行銷；People＝AI+客服；Process＝3 分鐘線上開戶；Physical Evidence＝視覺化儀表板、月報 PDF、開戶禮。",
  },
];

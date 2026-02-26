"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BRAND = {
  primary: "#1A3C5E",
  accent: "#C9A84C",
  story: "#2A6B5A",
  danger: "#C0392B",
  neutral: "#6B7280",
};

type FitResult = "strong" | "weak" | "gap";

interface FitItem {
  customerNeed: string;
  solution: string;
  fit: FitResult;
  reason: string;
}

const PAIN_FIT: FitItem[] = [
  {
    customerNeed: "看不懂（知識門檻）",
    solution: "白話文商品說明 + 3 分鐘懶人包影片",
    fit: "strong",
    reason: "直接對應，功能已上線",
  },
  {
    customerNeed: "怕做錯（社交壓力）",
    solution: "模擬投資 + AI 推薦降低選擇障礙",
    fit: "weak",
    reason: "有功能但缺乏「別人也這樣做」的社會證明",
  },
  {
    customerNeed: "不知道信誰（資訊過載）",
    solution: "---",
    fit: "gap",
    reason: "空白：缺乏第三方背書、獨立評鑑機制",
  },
  {
    customerNeed: "怕被推銷（信任危機）",
    solution: "---",
    fit: "gap",
    reason: "空白：無「不推銷承諾」或使用者真實口碑",
  },
  {
    customerNeed: "門檻迷思（本金太少）",
    solution: "100 元即可開始定期定額",
    fit: "strong",
    reason: "直接打破迷思，門檻夠低",
  },
];

const GAIN_FIT: FitItem[] = [
  {
    customerNeed: "白話文說明",
    solution: "白話文理財教學專欄 + 懶人包影片",
    fit: "strong",
    reason: "直接對應",
  },
  {
    customerNeed: "低門檻開始",
    solution: "100 元定期定額 + 3 分鐘線上開戶",
    fit: "strong",
    reason: "雙重降門檻",
  },
  {
    customerNeed: "不會虧光的安心感",
    solution: "AI 風險評估 + 分散投資推薦",
    fit: "weak",
    reason: "有功能但缺乏「風險透明說明」的心理安撫",
  },
  {
    customerNeed: "看到資產增長的成就感",
    solution: "視覺化儀表板",
    fit: "strong",
    reason: "數據圖表直覺呈現",
  },
  {
    customerNeed: "可信賴不推銷的平台",
    solution: "---",
    fit: "gap",
    reason: "空白：缺乏信任機制",
  },
];

const FIT_CONFIG: Record<FitResult, { label: string; symbol: string; color: string; bg: string }> = {
  strong: { label: "強配適", symbol: "✓", color: BRAND.story, bg: `${BRAND.story}15` },
  weak: { label: "弱配適", symbol: "△", color: BRAND.accent, bg: `${BRAND.accent}15` },
  gap: { label: "空白", symbol: "✗", color: BRAND.danger, bg: `${BRAND.danger}15` },
};

const STRATEGIES = [
  {
    fit: "strong" as FitResult,
    direction: "放大宣傳",
    desc: "你的產品已經解決了這個痛點，把優勢放大讓客戶知道。",
    example: "「白話文理財」和「100 元開始投資」成為行銷主打",
  },
  {
    fit: "weak" as FitResult,
    direction: "產品改善",
    desc: "有碰到但力道不夠，強化現有功能或加入新功能補強。",
    example: "模擬投資加入「和你一樣的人都這樣投資」同儕比較功能",
  },
  {
    fit: "gap" as FitResult,
    direction: "新開發或放棄",
    desc: "完全未回應，評估重要性——核心需求必須開發。",
    example: "信任建立三招：第三方背書、真實口碑、承諾機制",
  },
];

type ViewMode = "painFit" | "gainFit" | "strategy";

export default function FitDashboard() {
  const [view, setView] = useState<ViewMode>("painFit");

  const views: { key: ViewMode; label: string }[] = [
    { key: "painFit", label: "痛點配適" },
    { key: "gainFit", label: "獲益配適" },
    { key: "strategy", label: "策略方向" },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Legend */}
      <div className="flex gap-4 mb-4 flex-wrap">
        {Object.entries(FIT_CONFIG).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span
              className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold"
              style={{ backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}` }}
            >
              {cfg.symbol}
            </span>
            <span className="text-xs" style={{ color: BRAND.neutral }}>{cfg.label}</span>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-6">
        {views.map((v) => (
          <button
            key={v.key}
            onClick={() => setView(v.key)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: view === v.key ? BRAND.primary : "#f3f4f6",
              color: view === v.key ? "#fff" : BRAND.neutral,
            }}
          >
            {v.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {view === "painFit" && (
          <motion.div key="painFit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <FitTable title="富誠 vs 林志翔：痛點配適比對" items={PAIN_FIT} />
            <FitSummary items={PAIN_FIT} />
          </motion.div>
        )}
        {view === "gainFit" && (
          <motion.div key="gainFit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <FitTable title="富誠 vs 林志翔：獲益配適比對" items={GAIN_FIT} />
            <FitSummary items={GAIN_FIT} />
          </motion.div>
        )}
        {view === "strategy" && (
          <motion.div key="strategy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <StrategyPanel />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FitTable({ title, items }: { title: string; items: FitItem[] }) {
  return (
    <div>
      <h3 className="text-base font-bold mb-3" style={{ color: BRAND.primary }}>{title}</h3>
      <div className="space-y-2">
        {items.map((item, i) => {
          const cfg = FIT_CONFIG[item.fit];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-lg p-3 border"
              style={{ borderColor: cfg.color, backgroundColor: cfg.bg }}
            >
              <div className="flex items-start gap-3">
                <span
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold shrink-0"
                  style={{ backgroundColor: `${cfg.color}20`, color: cfg.color, border: `2px solid ${cfg.color}` }}
                >
                  {cfg.symbol}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <span className="font-semibold text-sm" style={{ color: "#374151" }}>
                      {item.customerNeed}
                    </span>
                    <span className="text-xs" style={{ color: BRAND.neutral }}>
                      {item.solution !== "---" ? `\u2192 ${item.solution}` : "\u2192 (無對應方案)"}
                    </span>
                  </div>
                  <p className="text-xs mt-1" style={{ color: cfg.color }}>
                    {cfg.label}：{item.reason}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function FitSummary({ items }: { items: FitItem[] }) {
  const counts = {
    strong: items.filter((i) => i.fit === "strong").length,
    weak: items.filter((i) => i.fit === "weak").length,
    gap: items.filter((i) => i.fit === "gap").length,
  };

  return (
    <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: "#f9fafb" }}>
      <p className="text-sm font-semibold" style={{ color: BRAND.primary }}>
        配適結果：
        <span style={{ color: BRAND.story }}> {counts.strong} 個強配適 </span>
        /
        <span style={{ color: BRAND.accent }}> {counts.weak} 個弱配適 </span>
        /
        <span style={{ color: BRAND.danger }}> {counts.gap} 個空白</span>
      </p>
    </div>
  );
}

function StrategyPanel() {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold" style={{ color: BRAND.primary }}>三種策略方向</h3>
      {STRATEGIES.map((s, i) => {
        const cfg = FIT_CONFIG[s.fit];
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12 }}
            className="rounded-lg p-4 border-l-4"
            style={{ borderLeftColor: cfg.color, backgroundColor: cfg.bg }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg font-bold" style={{ color: cfg.color }}>{cfg.symbol}</span>
              <span className="font-bold text-sm" style={{ color: cfg.color }}>
                {cfg.label} &rarr; {s.direction}
              </span>
            </div>
            <p className="text-sm" style={{ color: "#374151" }}>{s.desc}</p>
            <p className="text-xs mt-2 italic" style={{ color: BRAND.neutral }}>
              富誠案例：{s.example}
            </p>
          </motion.div>
        );
      })}

      {/* Trust Box */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="rounded-lg p-4 mt-4"
        style={{ backgroundColor: `${BRAND.danger}10`, border: `2px solid ${BRAND.danger}` }}
      >
        <p className="font-bold text-sm mb-2" style={{ color: BRAND.danger }}>
          核心發現：信任是金融行銷最大的空白
        </p>
        <div className="space-y-1.5">
          {["第三方背書：財經媒體推薦、金管會認證", "真實口碑：實名認證用戶的真實評價", "承諾機制：白紙黑字「不推銷承諾」"].map((item, i) => (
            <p key={i} className="text-xs flex items-center gap-2" style={{ color: "#374151" }}>
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: BRAND.danger }} />
              {item}
            </p>
          ))}
        </div>
        <p className="text-xs mt-2 italic" style={{ color: BRAND.neutral }}>
          老李：信任不是靠一個功能解決的——需要一套組合拳，把「人際信任」轉化成「制度信任」。
        </p>
      </motion.div>
    </div>
  );
}

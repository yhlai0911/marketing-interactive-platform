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

interface Touchpoint {
  name: string;
  positive: boolean; // true = 正面 MOT, false = 體驗斷點
  description: string;
  fuChengStatus: string;
}

interface Stage {
  id: string;
  label: string;
  icon: string;
  color: string;
  emotion: string;
  touchpoints: Touchpoint[];
}

const STAGES: Stage[] = [
  {
    id: "awareness",
    label: "認知",
    icon: "👁",
    color: BRAND.primary,
    emotion: "好奇",
    touchpoints: [
      {
        name: "社群廣告",
        positive: true,
        description: "FB/IG 精準投放理財知識短影音",
        fuChengStatus: "已上線，CTR 高於同業 2 倍",
      },
      {
        name: "搜尋結果",
        positive: true,
        description: "Google 搜尋「小額投資」出現在前三",
        fuChengStatus: "SEO 持續優化中",
      },
      {
        name: "朋友推薦",
        positive: true,
        description: "LINE 群組口碑分享",
        fuChengStatus: "推薦碼機制已建立",
      },
    ],
  },
  {
    id: "consideration",
    label: "考慮",
    icon: "🔍",
    color: BRAND.accent,
    emotion: "比較",
    touchpoints: [
      {
        name: "官網資訊",
        positive: true,
        description: "產品比較頁、費率透明揭露",
        fuChengStatus: "資訊完整度 85%",
      },
      {
        name: "客服諮詢",
        positive: false,
        description: "電話等候時間過長、回答不一致",
        fuChengStatus: "平均等候 8 分鐘（斷點！）",
      },
      {
        name: "評價查詢",
        positive: true,
        description: "PTT、Dcard 用戶正面評價",
        fuChengStatus: "正面評價佔比 72%",
      },
    ],
  },
  {
    id: "purchase",
    label: "購買",
    icon: "💳",
    color: BRAND.story,
    emotion: "期待",
    touchpoints: [
      {
        name: "App 開戶",
        positive: false,
        description: "開戶流程步驟多、需上傳多份文件",
        fuChengStatus: "完成率僅 60%（嚴重斷點！）",
      },
      {
        name: "首次投資",
        positive: true,
        description: "100 元即可開始，門檻低",
        fuChengStatus: "小額入門策略成效良好",
      },
      {
        name: "KYC 驗證",
        positive: false,
        description: "身分驗證等待時間 2-3 天",
        fuChengStatus: "正在導入 eKYC 縮短至即時",
      },
    ],
  },
  {
    id: "experience",
    label: "體驗",
    icon: "⭐",
    color: BRAND.accent,
    emotion: "使用",
    touchpoints: [
      {
        name: "App 使用",
        positive: true,
        description: "介面簡潔、操作直覺",
        fuChengStatus: "NPS 62，高於同業平均",
      },
      {
        name: "客服回應",
        positive: false,
        description: "問題處理需 48 小時以上",
        fuChengStatus: "目標縮短至 4 小時內（斷點！）",
      },
      {
        name: "月報告",
        positive: true,
        description: "個人化投資報告、視覺化呈現",
        fuChengStatus: "開信率 45%，持續優化",
      },
    ],
  },
  {
    id: "loyalty",
    label: "忠誠",
    icon: "❤️",
    color: BRAND.danger,
    emotion: "推薦",
    touchpoints: [
      {
        name: "回購/加碼",
        positive: true,
        description: "定期定額自動扣款、智能加碼提醒",
        fuChengStatus: "續約率 78%",
      },
      {
        name: "推薦分享",
        positive: true,
        description: "好友邀請獎勵機制",
        fuChengStatus: "每月新增 15% 來自推薦",
      },
      {
        name: "VIP 服務",
        positive: false,
        description: "高資產客戶缺乏差異化服務",
        fuChengStatus: "尚未建立分級制度（待改善）",
      },
    ],
  },
];

export default function CustomerJourneyStageFlow() {
  const [activeStage, setActiveStage] = useState<string | null>(null);
  const active = STAGES.find((s) => s.id === activeStage);

  return (
    <div className="p-4 space-y-4 max-w-xl mx-auto">
      <h3
        className="text-lg font-bold text-center"
        style={{ color: BRAND.primary }}
      >
        顧客旅程地圖五階段
      </h3>
      <p className="text-xs text-center" style={{ color: BRAND.neutral }}>
        點擊各階段查看接觸點與富誠現況評估
      </p>

      {/* Stage Flow */}
      <div className="flex items-center justify-between gap-1">
        {STAGES.map((stage, i) => (
          <div key={stage.id} className="flex items-center flex-1">
            <motion.button
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                setActiveStage(activeStage === stage.id ? null : stage.id)
              }
              className="flex flex-col items-center gap-1 w-full rounded-lg py-2 px-1 transition-all"
              style={{
                backgroundColor:
                  activeStage === stage.id ? `${stage.color}18` : "#f9fafb",
                border: `2px solid ${activeStage === stage.id ? stage.color : "#e5e7eb"}`,
              }}
            >
              <span className="text-xl">{stage.icon}</span>
              <span
                className="text-xs font-bold"
                style={{
                  color: activeStage === stage.id ? stage.color : BRAND.neutral,
                }}
              >
                {stage.label}
              </span>
              <span
                className="text-[10px]"
                style={{ color: BRAND.neutral }}
              >
                {stage.emotion}
              </span>
            </motion.button>
            {i < STAGES.length - 1 && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 + 0.3 }}
                className="text-gray-300 text-lg font-light mx-0.5 flex-shrink-0"
              >
                &#8594;
              </motion.span>
            )}
          </div>
        ))}
      </div>

      {/* Summary bar */}
      <div className="flex gap-3 justify-center text-[10px]">
        <span className="flex items-center gap-1">
          <span
            className="w-2.5 h-2.5 rounded-full inline-block"
            style={{ backgroundColor: BRAND.story }}
          />
          正面 MOT
        </span>
        <span className="flex items-center gap-1">
          <span
            className="w-2.5 h-2.5 rounded-full inline-block"
            style={{ backgroundColor: BRAND.danger }}
          />
          體驗斷點
        </span>
      </div>

      {/* Detail panel */}
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="rounded-lg p-4 space-y-3"
            style={{
              backgroundColor: `${active.color}08`,
              border: `1px solid ${active.color}25`,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{active.icon}</span>
              <span
                className="text-sm font-bold"
                style={{ color: active.color }}
              >
                {active.label}階段 — 接觸點分析
              </span>
            </div>

            <div className="space-y-2">
              {active.touchpoints.map((tp, i) => (
                <motion.div
                  key={tp.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-md p-2.5"
                  style={{
                    backgroundColor: tp.positive ? `${BRAND.story}10` : `${BRAND.danger}10`,
                    borderLeft: `3px solid ${tp.positive ? BRAND.story : BRAND.danger}`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-xs font-bold"
                      style={{
                        color: tp.positive ? BRAND.story : BRAND.danger,
                      }}
                    >
                      {tp.positive ? "✓" : "✗"} {tp.name}
                    </span>
                  </div>
                  <p
                    className="text-[11px] mb-1"
                    style={{ color: BRAND.primary }}
                  >
                    {tp.description}
                  </p>
                  <p
                    className="text-[10px] italic"
                    style={{
                      color: tp.positive ? BRAND.story : BRAND.danger,
                    }}
                  >
                    富誠現況：{tp.fuChengStatus}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom insight */}
      <div
        className="text-center text-xs p-2 rounded-lg"
        style={{
          backgroundColor: `${BRAND.primary}08`,
          color: BRAND.primary,
        }}
      >
        <span className="font-medium">關鍵洞察：</span>
        每個「體驗斷點」都是改善機會——優先修復購買階段的開戶流程
      </div>
    </div>
  );
}

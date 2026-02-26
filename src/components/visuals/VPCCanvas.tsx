"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BRAND = {
  primary: "#1A3C5E",
  accent: "#C9A84C",
  story: "#2A6B5A",
  danger: "#C0392B",
  neutral: "#6B7280",
};

interface VPCItem {
  label: string;
  detail: string;
}

const CUSTOMER_JOBS: VPCItem[] = [
  { label: "功能性", detail: "把每月 1.5-2 萬做有效配置，5 年存到 50 萬" },
  { label: "社會性", detail: "不想被同事覺得「完全不懂理財」" },
  { label: "情感性", detail: "對未來感到安心，覺得自己在進步" },
];

const CUSTOMER_PAINS: VPCItem[] = [
  { label: "看不懂", detail: "金融商品說明書像天書（知識門檻）" },
  { label: "怕做錯", detail: "怕做錯決定被朋友笑（社交壓力）" },
  { label: "不知道信誰", detail: "KOL 說 A、銀行說 B、爸媽說都別買" },
  { label: "怕被推銷", detail: "擔心被業務推銷不需要的產品" },
  { label: "門檻迷思", detail: "覺得本金太少，投資沒意義" },
];

const CUSTOMER_GAINS: VPCItem[] = [
  { label: "白話文", detail: "有人能用白話文解釋金融商品" },
  { label: "低門檻", detail: "不用大筆資金就能開始" },
  { label: "安心感", detail: "確定不會虧光" },
  { label: "成就感", detail: "看到錢在慢慢增加" },
  { label: "信任", detail: "可信賴、不推銷的平台" },
];

const VALUE_PRODUCTS: VPCItem[] = [
  { label: "AI 理財健檢", detail: "智慧診斷投資組合健康度" },
  { label: "基金/ETF 推薦", detail: "AI 驅動的個人化推薦引擎" },
  { label: "自動定期定額", detail: "100 元起，每月自動扣款" },
  { label: "3 分鐘線上開戶", detail: "在沙發上就能完成開戶" },
  { label: "白話文理財專欄", detail: "每週更新，零術語解說" },
  { label: "視覺化儀表板", detail: "資產成長一目了然" },
];

const VALUE_PAIN_RELIEVERS: VPCItem[] = [
  { label: "白話文說明", detail: "所有商品改用白話文 + 3 分鐘懶人包影片" },
  { label: "模擬投資", detail: "零風險體驗，先練再上場" },
  { label: "100 元起投", detail: "打破「本金太少」迷思" },
];

const VALUE_GAIN_CREATORS: VPCItem[] = [
  { label: "AI 自動配置", detail: "省去研究時間，智慧分散投資" },
  { label: "視覺化成長", detail: "即時圖表呈現資產增長軌跡" },
  { label: "理財知識推送", detail: "每週一篇白話文理財知識" },
];

type TabKey = "overview" | "customerProfile" | "valueMap" | "fullProcess";

export default function VPCCanvas({ mode }: { mode?: string }) {
  const initialTab: TabKey = (mode as TabKey) || "overview";
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);

  const tabs: { key: TabKey; label: string }[] = [
    { key: "overview", label: "VPC 結構圖" },
    { key: "customerProfile", label: "顧客描述" },
    { key: "valueMap", label: "價值主張" },
    { key: "fullProcess", label: "W08-W10 流程" },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Tab Navigation */}
      <div className="flex gap-1 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all"
            style={{
              backgroundColor: activeTab === tab.key ? BRAND.primary : "#f3f4f6",
              color: activeTab === tab.key ? "#fff" : BRAND.neutral,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <OverviewDiagram />
          </motion.div>
        )}
        {activeTab === "customerProfile" && (
          <motion.div
            key="customerProfile"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <CustomerProfilePanel />
          </motion.div>
        )}
        {activeTab === "valueMap" && (
          <motion.div
            key="valueMap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <ValueMapPanel />
          </motion.div>
        )}
        {activeTab === "fullProcess" && (
          <motion.div
            key="fullProcess"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <FullProcessPanel />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Overview Diagram ── */
function OverviewDiagram() {
  return (
    <div className="relative flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
      {/* Left Square: Value Map */}
      <motion.div
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full md:w-[45%] border-2 rounded-lg p-5"
        style={{ borderColor: BRAND.primary }}
      >
        <h3 className="text-lg font-bold text-center mb-4" style={{ color: BRAND.primary }}>
          價值主張
        </h3>
        <p className="text-xs text-center mb-4" style={{ color: BRAND.neutral }}>Value Map</p>
        <div className="space-y-3">
          <SectionBlock title="產品和服務" color={BRAND.primary} desc="你提供什麼？" />
          <SectionBlock title="痛點解決方案" color={BRAND.danger} desc="如何減輕客戶痛點？" />
          <SectionBlock title="創造獲益" color={BRAND.story} desc="如何為客戶創造好處？" />
        </div>
      </motion.div>

      {/* Center Arrow */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col items-center"
      >
        <div
          className="text-2xl font-bold"
          style={{ color: BRAND.primary }}
        >
          &larr; Fit &rarr;
        </div>
        <p className="text-xs mt-1" style={{ color: BRAND.neutral }}>配適</p>
      </motion.div>

      {/* Right Circle: Customer Profile */}
      <motion.div
        initial={{ x: 30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full md:w-[45%] border-2 rounded-full p-5 aspect-square flex flex-col items-center justify-center"
        style={{ borderColor: BRAND.accent }}
      >
        <h3 className="text-lg font-bold text-center mb-2" style={{ color: BRAND.accent }}>
          顧客描述
        </h3>
        <p className="text-xs text-center mb-3" style={{ color: BRAND.neutral }}>Customer Profile</p>
        <div className="space-y-2 text-center">
          <SectionLabel title="任務" color={BRAND.accent} desc="客戶想完成什麼事？" />
          <SectionLabel title="痛點" color={BRAND.danger} desc="阻礙和風險" />
          <SectionLabel title="獲益" color={BRAND.story} desc="期望的成果" />
        </div>
      </motion.div>
    </div>
  );
}

function SectionBlock({ title, color, desc }: { title: string; color: string; desc: string }) {
  return (
    <div className="rounded-md p-3" style={{ backgroundColor: `${color}10`, borderLeft: `3px solid ${color}` }}>
      <p className="font-semibold text-sm" style={{ color }}>{title}</p>
      <p className="text-xs mt-0.5" style={{ color: BRAND.neutral }}>{desc}</p>
    </div>
  );
}

function SectionLabel({ title, color, desc }: { title: string; color: string; desc: string }) {
  return (
    <div>
      <p className="font-semibold text-sm" style={{ color }}>{title}</p>
      <p className="text-xs" style={{ color: BRAND.neutral }}>{desc}</p>
    </div>
  );
}

/* ── Customer Profile Panel ── */
function CustomerProfilePanel() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold" style={{ color: BRAND.accent }}>
        林志翔的顧客描述（右圓形）
      </h3>

      <ItemList title="任務（Customer Jobs）" items={CUSTOMER_JOBS} color={BRAND.accent} />
      <ItemList title="痛點（Pains）" items={CUSTOMER_PAINS} color={BRAND.danger} />
      <ItemList title="獲益（Gains）" items={CUSTOMER_GAINS} color={BRAND.story} />
    </div>
  );
}

/* ── Value Map Panel ── */
function ValueMapPanel() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold" style={{ color: BRAND.primary }}>
        富誠 App 的價值主張（左方形）
      </h3>

      <ItemList title="產品和服務" items={VALUE_PRODUCTS} color={BRAND.primary} />
      <ItemList title="痛點解決方案（Pain Relievers）" items={VALUE_PAIN_RELIEVERS} color={BRAND.danger} />
      <ItemList title="創造獲益（Gain Creators）" items={VALUE_GAIN_CREATORS} color={BRAND.story} />
    </div>
  );
}

function ItemList({ title, items, color }: { title: string; items: VPCItem[]; color: string }) {
  return (
    <div>
      <h4 className="font-semibold mb-2" style={{ color }}>{title}</h4>
      <div className="grid gap-2">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-start gap-3 rounded-md p-3"
            style={{ backgroundColor: `${color}08`, borderLeft: `3px solid ${color}` }}
          >
            <span className="font-bold text-sm whitespace-nowrap" style={{ color }}>{item.label}</span>
            <span className="text-sm" style={{ color: "#374151" }}>{item.detail}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── Full Process Panel ── */
function FullProcessPanel() {
  const steps = [
    { week: "W08", tool: "人物誌", question: "他是誰？", color: BRAND.primary, desc: "基本輪廓、行為、媒體習慣" },
    { week: "W09", tool: "同理心地圖", question: "他怎麼想？", color: BRAND.story, desc: "感受、恐懼、說做落差" },
    { week: "W10", tool: "價值主張畫布", question: "我能解決什麼？", color: BRAND.accent, desc: "配適比對、找出空白" },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold" style={{ color: BRAND.primary }}>
        目標客群分析完整流程（W08-W10）
      </h3>

      <div className="flex flex-col gap-4">
        {steps.map((step, i) => (
          <React.Fragment key={i}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="rounded-lg p-4 border-2"
              style={{ borderColor: step.color }}
            >
              <div className="flex items-center gap-3 mb-1">
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded"
                  style={{ backgroundColor: step.color, color: "#fff" }}
                >
                  {step.week}
                </span>
                <span className="font-bold" style={{ color: step.color }}>{step.tool}</span>
              </div>
              <p className="text-sm font-semibold" style={{ color: "#374151" }}>{step.question}</p>
              <p className="text-xs mt-1" style={{ color: BRAND.neutral }}>{step.desc}</p>
            </motion.div>
            {i < steps.length - 1 && (
              <div className="flex justify-center">
                <span className="text-xl" style={{ color: BRAND.neutral }}>&#8595;</span>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div
        className="rounded-lg p-4 text-center text-sm"
        style={{ backgroundColor: `${BRAND.accent}15`, border: `1px solid ${BRAND.accent}` }}
      >
        <p className="font-bold" style={{ color: BRAND.accent }}>
          VPC 的獨特貢獻：最後一步的「比對配適」
        </p>
        <p className="mt-1" style={{ color: BRAND.neutral }}>
          把客戶的痛點/獲益與產品功能一一對照，找出強配適、弱配適和空白
        </p>
      </div>
    </div>
  );
}

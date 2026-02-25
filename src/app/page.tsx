"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, Lock, Sparkles, Users, Brain, Globe, Download, FileText, Presentation, ClipboardList } from "lucide-react";
import { BRAND, CHARACTER_COLORS } from "@/components/brand/BrandColors";

const episodes = [
  { week: 1, title: "行銷的本質：不只是推銷", topics: ["Kotler 定義", "4P 組合"], available: true },
  { week: 2, title: "創造價值：哈佛 4 層次框架", topics: ["Maslow 需求", "價值設計"], available: true },
  { week: 3, title: "認識你的戰場：策略規劃流程", topics: ["SWOT 分析", "PEST 分析"], available: true },
  { week: 4, title: "切開市場：市場區隔", topics: ["STP 框架", "四維度區隔"], available: true },
  { week: 5, title: "選定目標：目標市場選擇", topics: ["Targeting", "聚焦 vs 差異化"], available: true },
  { week: 6, title: "搶佔心智：品牌定位", topics: ["定位圖", "定位聲明"], available: true },
  { week: 7, title: "數位消費者的旅程：AISAS", topics: ["AISAS 模型", "數位行銷"], available: false },
  { week: 8, title: "走進客戶的世界：人物誌", topics: ["Persona", "用戶研究"], available: false },
  { week: 9, title: "走進客戶的心：同理心地圖", topics: ["Empathy Map", "深度洞察"], available: false },
  { week: 10, title: "痛點轉商機：價值主張畫布", topics: ["VPC", "價值配適"], available: false },
  { week: 11, title: "設計商品：金融產品策略", topics: ["產品組合", "產品生命週期"], available: false },
  { week: 12, title: "定價的藝術：金融商品定價", topics: ["定價策略", "心理定價"], available: false },
  { week: 13, title: "觸達客戶：金融通路策略", topics: ["OMO", "通路設計"], available: false },
  { week: 14, title: "讓人記住你：整合行銷傳播", topics: ["IMC", "品牌傳播"], available: false },
  { week: 15, title: "打造體驗：金融服務顧客旅程", topics: ["顧客旅程", "服務設計"], available: false },
  { week: 16, title: "整合行銷計畫：富誠的下一步", topics: ["行銷計畫書", "總複習"], available: false },
];

const characters = [
  { id: "chen", name: "陳建宏", role: "富誠 FinTech CEO", quote: "我們不推銷，我們教理財。讓每個人都能做出不後悔的理財決定。" },
  { id: "profLin", name: "林教授", role: "行銷顧問", quote: "好的行銷不是說服，而是讓對的人找到對的產品。" },
  { id: "xiaoYa", name: "小雅", role: "富誠 CMO", quote: "年輕人不是不想理財，是不想被推銷。我們用內容贏得信任。" },
  { id: "laoLi", name: "老李", role: "業務總監", quote: "做了二十年保險，客戶心裡把你跟推銷員綁在一起，你就完了。" },
  { id: "wantai", name: "萬泰金控", role: "競爭對手", quote: "我們有百年品牌和千萬客戶。小公司想跟我們搶市場？" },
];

const features = [
  { icon: Sparkles, title: "AI 語音導讀", desc: "三層 TTS 備援引擎，為每位角色配備專屬聲線" },
  { icon: Brain, title: "AI 林教授", desc: "蘇格拉底式對話教學，隨時提問即時回答" },
  { icon: Globe, title: "動態視覺", desc: "互動圖表、公式動畫、場景轉場效果" },
  { icon: Users, title: "雙模式", desc: "自學模式 + 課堂模式，彈性適應教學情境" },
];

const resourceTabs = [
  {
    id: "slides",
    label: "投影片",
    icon: Presentation,
    files: Array.from({ length: 16 }, (_, i) => ({
      week: i + 1,
      href: `/pdfs/投影片/week${String(i + 1).padStart(2, "0")}-slides.pdf`,
    })),
  },
  {
    id: "textbook",
    label: "教科書",
    icon: BookOpen,
    files: [{ week: 0, label: "完整教科書", href: "/pdfs/教科書/main.pdf" }],
  },
  {
    id: "supplements",
    label: "教學附件",
    icon: FileText,
    files: Array.from({ length: 16 }, (_, i) => ({
      week: i + 1,
      href: `/pdfs/教學附件/week${String(i + 1).padStart(2, "0")}-supplement.pdf`,
    })),
  },
  {
    id: "exercises",
    label: "習題",
    icon: ClipboardList,
    files: Array.from({ length: 16 }, (_, i) => ({
      week: i + 1,
      href: `/pdfs/習題/week${String(i + 1).padStart(2, "0")}-exercises.pdf`,
    })),
  },
];

function ResourceDownloadSection() {
  const [activeTab, setActiveTab] = useState("slides");
  const currentTab = resourceTabs.find((t) => t.id === activeTab)!;

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-2" style={{ color: BRAND.primary }}>
          教學資源下載
        </h2>
        <p className="text-center text-gray-500 mb-8">課堂投影片、教科書、附件及習題</p>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {resourceTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={
                activeTab === tab.id
                  ? { backgroundColor: BRAND.primary, color: "#fff" }
                  : { backgroundColor: `${BRAND.primary}10`, color: BRAND.primary }
              }
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* File grid */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className={
            currentTab.id === "textbook"
              ? "flex justify-center"
              : "grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3"
          }
        >
          {currentTab.files.map((file) => (
            <a
              key={file.href}
              href={file.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-transparent hover:shadow-lg transition-all hover:-translate-y-0.5 bg-gray-50 group"
              style={{ borderColor: `${BRAND.accent}40` }}
            >
              <Download
                className="w-5 h-5 transition-colors"
                style={{ color: BRAND.accent }}
              />
              <span className="text-xs font-bold" style={{ color: BRAND.primary }}>
                {"label" in file ? file.label : `Week ${file.week}`}
              </span>
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* 英雄區 */}
      <section className="brand-gradient text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-6xl mb-6 block">💰</span>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              行銷，可能跟你想的不一樣
            </h1>
            <p className="text-xl text-white/80 mb-2">
              金融商品行銷實務 PBL 互動式多媒體教學平台
            </p>
            <p className="text-lg text-white/60 mb-8">
              跟著富誠 FinTech 學行銷 — 用溫度改變金融
            </p>
            <Link
              href="/lesson/1"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-lg transition-all hover:scale-105"
              style={{ backgroundColor: BRAND.accent, color: BRAND.primary }}
            >
              <BookOpen className="w-5 h-5" />
              開始學習
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 16 週課程地圖 */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-4" style={{ color: BRAND.primary }}>
            16 週課程地圖
          </h2>
          <p className="text-center text-gray-500 mb-12">跟著富誠 FinTech 走過行銷的每一步</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {episodes.map((ep, i) => (
              <motion.div
                key={ep.week}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 + 0.5 }}
              >
                {ep.available ? (
                  <Link
                    href={`/lesson/${ep.week}`}
                    className="block p-4 rounded-xl border-2 bg-white hover:shadow-lg transition-all hover:-translate-y-1 h-full"
                    style={{ borderColor: BRAND.accent }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: BRAND.primary }}
                      >
                        Week {ep.week}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm mb-2">{ep.title}</h3>
                    <div className="flex flex-wrap gap-1">
                      {ep.topics.map((t) => (
                        <span
                          key={t}
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: `${BRAND.accent}20`, color: BRAND.primary }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </Link>
                ) : (
                  <div className="block p-4 rounded-xl border-2 border-gray-200 bg-gray-50 opacity-60 h-full">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-300 text-white">
                        Week {ep.week}
                      </span>
                      <Lock className="w-3 h-3 text-gray-400" />
                    </div>
                    <h3 className="font-bold text-sm mb-2 text-gray-400">{ep.title}</h3>
                    <div className="flex flex-wrap gap-1">
                      {ep.topics.map((t) => (
                        <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-400">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 教學資源下載 */}
      <ResourceDownloadSection />

      {/* 角色介紹 */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12" style={{ color: BRAND.primary }}>
            認識角色
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {characters.map((char, i) => (
              <motion.div
                key={char.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.3 }}
                className="text-center p-4 rounded-xl border hover:shadow-lg transition-shadow"
              >
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-xl font-bold"
                  style={{ backgroundColor: CHARACTER_COLORS[char.id] || BRAND.neutral }}
                >
                  {char.name[0]}
                </div>
                <h3 className="font-bold text-sm">{char.name}</h3>
                <p className="text-xs text-gray-500 mb-2">{char.role}</p>
                <p className="text-xs italic" style={{ color: CHARACTER_COLORS[char.id] || BRAND.neutral }}>
                  「{char.quote}」
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 平台特色 */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12" style={{ color: BRAND.primary }}>
            平台特色
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.3 }}
                className="text-center p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow bg-white"
              >
                <feat.icon className="w-10 h-10 mx-auto mb-4" style={{ color: BRAND.accent }} />
                <h3 className="font-bold mb-2">{feat.title}</h3>
                <p className="text-sm text-gray-600">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, Lock, Sparkles, Users, Brain, Globe } from "lucide-react";
import { BRAND, CHARACTER_COLORS } from "@/components/brand/BrandColors";

const episodes = [
  { week: 1, title: "夜市到世界：為什麼要出海？", topics: ["國際化動機", "國際貨幣體系"], available: true },
  { week: 2, title: "第一桶金的匯率陷阱", topics: ["外匯市場結構", "交叉匯率"], available: true },
  { week: 3, title: "大麥克能告訴我們什麼？", topics: ["購買力平價", "一價法則"], available: true },
  { week: 4, title: "利率的秘密通道", topics: ["利率平價", "費雪效果"], available: true },
  { week: 5, title: "東京首戰：開店要多少錢？", topics: ["國際資本預算", "匯率預測"], available: true },
  { week: 6, title: "錢從哪裡來？", topics: ["國際融資管道", "資本市場"], available: true },
  { week: 7, title: "保護我們的錢", topics: ["遠期合約", "期貨", "選擇權"], available: true },
  { week: 8, title: "期中危機：日圓風暴", topics: ["交易曝險", "避險實務"], available: true },
  { week: 9, title: "價格戰的真正戰場", topics: ["經濟曝險", "營運彈性"], available: true },
  { week: 10, title: "會計的魔術", topics: ["換算曝險", "財報合併"], available: true },
  { week: 11, title: "南進！東南亞的機會與陷阱", topics: ["國家風險", "新興市場"], available: true },
  { week: 12, title: "曼谷設廠——大投資決策", topics: ["FDI", "國際 WACC"], available: true },
  { week: 13, title: "全球金庫：錢怎麼搬？", topics: ["現金管理", "移轉訂價"], available: true },
  { week: 14, title: "上市夢：走向國際資本市場", topics: ["ADR/GDR", "國際投資組合"], available: true },
  { week: 15, title: "風暴中的決策", topics: ["金融危機", "風險管理"], available: true },
  { week: 16, title: "珍途的未來", topics: ["總複習", "整合報告"], available: true },
];

const characters = [
  { id: "linmei", name: "林美", role: "珍途 CEO", quote: "珍珠奶茶征服了台灣，下一步就是征服世界！" },
  { id: "profchen", name: "陳思遠教授", role: "國際財務顧問", quote: "匯率就像海浪，你不能阻止它，但你可以學會衝浪。" },
  { id: "jason", name: "方志豪", role: "珍途 CFO", quote: "在沒有看到數據之前，我不會簽任何一張支票。" },
  { id: "yuki", name: "小雪", role: "旭日食品財務經理", quote: "在日本做生意，差一円都不行。" },
  { id: "bingcheng", name: "冰城帝國", role: "競爭對手", quote: "一杯只要 10 塊人民幣！" },
];

const features = [
  { icon: Sparkles, title: "AI 語音導讀", desc: "三層 TTS 備援引擎，為每位角色配備專屬聲線" },
  { icon: Brain, title: "AI 陳教授", desc: "蘇格拉底式對話教學，隨時提問即時回答" },
  { icon: Globe, title: "動態視覺", desc: "互動圖表、公式動畫、場景轉場效果" },
  { icon: Users, title: "雙模式", desc: "自學模式 + 課堂模式，彈性適應教學情境" },
];

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
            <span className="text-6xl mb-6 block">🧋</span>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              珍途的全球征途
            </h1>
            <p className="text-xl text-white/80 mb-2">
              國際財務管理 PBL 互動式多媒體教學平台
            </p>
            <p className="text-lg text-white/60 mb-8">
              從台北夜市到世界舞台 — 跟著珍珠奶茶品牌學國際金融
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

      {/* 功能特色 */}
      <section className="py-16 px-4 bg-white">
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
                className="text-center p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <feat.icon className="w-10 h-10 mx-auto mb-4" style={{ color: BRAND.accent }} />
                <h3 className="font-bold mb-2">{feat.title}</h3>
                <p className="text-sm text-gray-600">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 16 週課程地圖 */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-4" style={{ color: BRAND.primary }}>
            16 週課程地圖
          </h2>
          <p className="text-center text-gray-500 mb-12">跟著珍途走過國際化的每一步</p>
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
    </div>
  );
}

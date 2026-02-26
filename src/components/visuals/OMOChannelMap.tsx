"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const BRAND = {
  primary: "#1A3C5E",
  accent: "#C9A84C",
  story: "#2A6B5A",
  danger: "#C0392B",
  neutral: "#6B7280",
};

interface Channel {
  name: string;
  desc: string;
  type: "online" | "offline";
}

const ONLINE_CHANNELS: Channel[] = [
  { name: "富誠 App", desc: "核心交易平台，24/7 自助服務", type: "online" },
  { name: "官網 + Blog", desc: "SEO 內容行銷，財商教育文章", type: "online" },
  { name: "社群", desc: "LINE / IG / YouTube 口碑擴散", type: "online" },
];

const OFFLINE_CHANNELS: Channel[] = [
  { name: "社區講座", desc: "每月 10 社區，不推銷只教理財", type: "offline" },
  { name: "銀行合作", desc: "3-5 家銀行「退休規劃專區」", type: "offline" },
  { name: "認證顧問", desc: "20 位「富誠認證理財教練」", type: "offline" },
];

interface FusionPath {
  from: string;
  to: string;
  desc: string;
}

const FUSION_PATHS: FusionPath[] = [
  { from: "社區講座", to: "App", desc: "掃碼開戶，自動帶入顧問推薦紀錄" },
  { from: "App", to: "認證顧問", desc: "一鍵預約諮詢，顧問看到瀏覽紀錄" },
  { from: "銀行合作", to: "App", desc: "銀行開戶後 App 繼續管理帳戶" },
];

export default function OMOChannelMap() {
  const [showFusion, setShowFusion] = useState(false);

  return (
    <div className="p-4 space-y-4 max-w-xl mx-auto">
      <h3 className="text-lg font-bold text-center" style={{ color: BRAND.primary }}>
        富誠 OMO 通路地圖
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {/* Online */}
        <div className="space-y-2">
          <div className="text-center text-sm font-bold px-3 py-1 rounded-full" style={{ backgroundColor: `${BRAND.primary}15`, color: BRAND.primary }}>
            線上通路（規模引擎）
          </div>
          {ONLINE_CHANNELS.map((ch, i) => (
            <motion.div
              key={ch.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className="p-2 rounded-lg border text-sm"
              style={{ borderColor: `${BRAND.primary}40` }}
            >
              <div className="font-medium" style={{ color: BRAND.primary }}>{ch.name}</div>
              <div className="text-xs" style={{ color: BRAND.neutral }}>{ch.desc}</div>
            </motion.div>
          ))}
        </div>

        {/* Offline */}
        <div className="space-y-2">
          <div className="text-center text-sm font-bold px-3 py-1 rounded-full" style={{ backgroundColor: `${BRAND.story}15`, color: BRAND.story }}>
            線下通路（信任引擎）
          </div>
          {OFFLINE_CHANNELS.map((ch, i) => (
            <motion.div
              key={ch.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className="p-2 rounded-lg border text-sm"
              style={{ borderColor: `${BRAND.story}40` }}
            >
              <div className="font-medium" style={{ color: BRAND.story }}>{ch.name}</div>
              <div className="text-xs" style={{ color: BRAND.neutral }}>{ch.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Fusion toggle */}
      <button
        onClick={() => setShowFusion(!showFusion)}
        className="w-full py-2 rounded-lg text-sm font-medium transition-colors"
        style={{
          backgroundColor: showFusion ? BRAND.accent : `${BRAND.accent}15`,
          color: showFusion ? "#fff" : BRAND.accent,
        }}
      >
        {showFusion ? "隱藏 OMO 融合路徑" : "顯示 OMO 融合路徑 →"}
      </button>

      {/* Fusion paths */}
      {showFusion && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-2"
        >
          {FUSION_PATHS.map((path, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="flex items-center gap-2 p-2 rounded-lg text-sm"
              style={{ backgroundColor: `${BRAND.accent}10`, border: `1px solid ${BRAND.accent}30` }}
            >
              <span className="font-medium whitespace-nowrap" style={{ color: BRAND.story }}>{path.from}</span>
              <svg width="20" height="16" viewBox="0 0 20 16">
                <path d="M2 8h14M13 4l4 4-4 4" stroke={BRAND.accent} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-medium whitespace-nowrap" style={{ color: BRAND.primary }}>{path.to}</span>
              <span className="text-xs flex-1" style={{ color: BRAND.neutral }}>{path.desc}</span>
            </motion.div>
          ))}

          {/* Unified ID */}
          <div className="text-center p-2 rounded-lg" style={{ backgroundColor: `${BRAND.primary}10`, border: `1px dashed ${BRAND.primary}40` }}>
            <div className="text-xs font-bold" style={{ color: BRAND.primary }}>
              核心基礎：統一客戶 ID
            </div>
            <div className="text-[10px]" style={{ color: BRAND.neutral }}>
              所有通路共享客戶資料、互動紀錄、推薦邏輯
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

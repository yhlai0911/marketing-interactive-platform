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

interface ElementData {
  id: number;
  label: string;
  subtitle: string;
  description: string;
  example: string;
  color: string;
  highlighted: boolean;
  angle: number;
}

const ELEMENTS: ElementData[] = [
  {
    id: 1,
    label: "基本資料",
    subtitle: "姓名 / 年齡 / 職業",
    description:
      "讓人物誌有一張「身分證」——姓名、性別、年齡、職業、居住地、預估收入。把統計數字變成一個有名字的人。",
    example: "林志翔，28 歲，軟體工程師，住新北市新店區，月收入約 6 萬",
    color: BRAND.primary,
    highlighted: false,
    angle: 90,
  },
  {
    id: 2,
    label: "興趣與生活方式",
    subtitle: "日常興趣 / 休閒",
    description:
      "了解他的世界——日常興趣、休閒活動、生活型態。從生活細節中看到行銷觸及的機會點。",
    example: "喜歡打電動、看 Netflix，下班後滑手機到 12 點。每月能存 1.5~2 萬",
    color: BRAND.story,
    highlighted: false,
    angle: 30,
  },
  {
    id: 3,
    label: "常接觸媒體",
    subtitle: "去哪找客戶？",
    description:
      "直接決定行銷通路選擇——他每天瀏覽哪些平台？怎麼獲取資訊？遇到問題去哪搜尋？",
    example:
      "每天必看 IG、YouTube；Google 搜尋理財名詞；Dcard 理財版潛水；LINE 群組偶爾分享",
    color: BRAND.danger,
    highlighted: true,
    angle: -30,
  },
  {
    id: 4,
    label: "煩惱",
    subtitle: "對客戶說什麼？",
    description:
      "生活中與產品/服務相關的困擾。注意：是他的煩惱，不是你認為他應該有的煩惱。",
    example:
      "覺得理財離自己很遙遠；去銀行辦事麻煩又緊張；怕被理專推銷不適合的商品",
    color: BRAND.danger,
    highlighted: true,
    angle: -90,
  },
  {
    id: 5,
    label: "痛點",
    subtitle: "2~3 個核心問題",
    description:
      "從煩惱中提煉出最具代表性的具體問題。痛點 = 行銷的切入點，先找痛點再設計解決方案。",
    example: "不懂（知識門檻高）、不信（信任危機）、不動（行動門檻高）",
    color: BRAND.accent,
    highlighted: false,
    angle: -150,
  },
  {
    id: 6,
    label: "目標與期望",
    subtitle: "他想要什麼？",
    description:
      "他希望達成什麼？理想中的解決方案長什麼樣子？了解目標才能設計出讓他心動的價值主張。",
    example:
      "5 年內存 50 萬結婚基金；想要「不用花太多時間研究、值得信任的自動化理財助手」",
    color: BRAND.story,
    highlighted: false,
    angle: 150,
  },
];

export default function W08PersonaSixElements() {
  const [activeElement, setActiveElement] = useState<number | null>(null);

  const R = 120;
  const CX = 160;
  const CY = 155;

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h3
        className="text-center text-lg font-bold mb-1"
        style={{ color: BRAND.primary }}
      >
        人物誌（Persona）六大組成元素
      </h3>
      <p className="text-center text-xs text-gray-500 mb-4">
        點擊各元素查看說明與富誠範例
      </p>

      <div className="flex flex-col items-center gap-4">
        {/* SVG 放射圖 */}
        <svg viewBox="0 0 320 310" className="w-72 flex-shrink-0">
          {/* 連線 */}
          {ELEMENTS.map((el, i) => {
            const rad = (el.angle * Math.PI) / 180;
            const x = CX + R * Math.cos(rad);
            const y = CY - R * Math.sin(rad);
            const isActive = activeElement === el.id;
            return (
              <motion.line
                key={`line-${i}`}
                x1={CX}
                y1={CY}
                x2={x}
                y2={y}
                stroke={isActive ? el.color : "#d1d5db"}
                strokeWidth={isActive ? 2.5 : 1.5}
                strokeDasharray={el.highlighted ? "6 3" : "none"}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
              />
            );
          })}

          {/* 中心圓 */}
          <motion.circle
            cx={CX}
            cy={CY}
            r={36}
            fill={BRAND.accent}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          />
          <text
            x={CX}
            y={CY - 6}
            textAnchor="middle"
            fill="white"
            fontSize="11"
            fontWeight="bold"
          >
            Persona
          </text>
          <text
            x={CX}
            y={CY + 9}
            textAnchor="middle"
            fill="white"
            fontSize="10"
          >
            人物誌
          </text>

          {/* 六個節點 */}
          {ELEMENTS.map((el, i) => {
            const rad = (el.angle * Math.PI) / 180;
            const x = CX + R * Math.cos(rad);
            const y = CY - R * Math.sin(rad);
            const isActive = activeElement === el.id;

            // 文字位置微調
            const labelOffsetY = el.angle > 0 ? -6 : 6;

            return (
              <g key={el.id}>
                {/* 外圈高亮指示（行銷價值最高） */}
                {el.highlighted && (
                  <motion.circle
                    cx={x}
                    cy={y}
                    r={34}
                    fill="none"
                    stroke={BRAND.danger}
                    strokeWidth={1.5}
                    strokeDasharray="4 2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                  />
                )}
                <motion.circle
                  cx={x}
                  cy={y}
                  r={isActive ? 30 : 27}
                  fill={el.color}
                  opacity={isActive ? 1 : 0.85}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1, type: "spring" }}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setActiveElement(el.id)}
                  onMouseLeave={() => setActiveElement(null)}
                  onClick={() =>
                    setActiveElement(activeElement === el.id ? null : el.id)
                  }
                />
                <text
                  x={x}
                  y={y + labelOffsetY - 2}
                  textAnchor="middle"
                  fill="white"
                  fontSize="9"
                  fontWeight="bold"
                  pointerEvents="none"
                >
                  {el.id}. {el.label}
                </text>
                <text
                  x={x}
                  y={y + labelOffsetY + 10}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.85)"
                  fontSize="7"
                  pointerEvents="none"
                >
                  {el.subtitle}
                </text>
              </g>
            );
          })}

          {/* 行銷價值高 標籤 */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <rect
              x={248}
              y={285}
              width={68}
              height={18}
              rx={4}
              fill={BRAND.danger}
              opacity={0.9}
            />
            <text
              x={282}
              y={297}
              textAnchor="middle"
              fill="white"
              fontSize="8"
              fontWeight="bold"
            >
              行銷價值最高
            </text>
          </motion.g>
        </svg>

        {/* 說明面板 */}
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {activeElement !== null ? (
              <motion.div
                key={activeElement}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="p-4 rounded-lg"
                style={{
                  backgroundColor: `${ELEMENTS[activeElement - 1].color}10`,
                  borderLeft: `4px solid ${ELEMENTS[activeElement - 1].color}`,
                }}
              >
                <h4
                  className="font-bold text-base flex items-center gap-2"
                  style={{ color: ELEMENTS[activeElement - 1].color }}
                >
                  {ELEMENTS[activeElement - 1].id}.{" "}
                  {ELEMENTS[activeElement - 1].label}
                  {ELEMENTS[activeElement - 1].highlighted && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: BRAND.danger }}
                    >
                      核心
                    </span>
                  )}
                </h4>
                <p className="text-sm text-gray-700 mt-2">
                  {ELEMENTS[activeElement - 1].description}
                </p>
                <div className="mt-3 p-2 rounded bg-white/60 border border-gray-200">
                  <p
                    className="text-xs font-semibold mb-1"
                    style={{ color: BRAND.accent }}
                  >
                    富誠範例（林志翔）
                  </p>
                  <p className="text-xs text-gray-600">
                    {ELEMENTS[activeElement - 1].example}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-4 rounded-lg border border-dashed border-gray-300"
              >
                <p className="text-sm text-gray-500 italic">
                  點擊或移入各元素，查看定義說明與富誠 FinTech 的林志翔範例。
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  虛線圈標示的
                  <span className="font-semibold" style={{ color: BRAND.danger }}>
                    「常接觸媒體」
                  </span>
                  和
                  <span className="font-semibold" style={{ color: BRAND.danger }}>
                    「煩惱」
                  </span>
                  是行銷價值最高的兩個元素：前者告訴你去哪找客戶，後者告訴你對客戶說什麼。
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

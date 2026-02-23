"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND } from "@/components/brand/BrandColors";

function fmtNum(n: number, digits = 0): string {
  return n.toLocaleString("zh-TW", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}

interface ExposureItem {
  id: string;
  name: string;
  amount: number; // 萬 JPY
  direction: "in" | "out";
  nature: "合約" | "預期";
  detail: string;
}

const ITEMS: ExposureItem[] = [
  {
    id: "tokyo-rev",
    name: "東京店營收匯回",
    amount: 5000,
    direction: "in",
    nature: "預期",
    detail:
      "東京旗艦店的預估季度營收。因尚未實現，屬於「預期」性質——金額可能隨銷售狀況上下波動，但根據目前趨勢預估為 5,000 萬日圓。",
  },
  {
    id: "royalty",
    name: "權利金收入",
    amount: 300,
    direction: "in",
    nature: "合約",
    detail:
      "珍途授權日本合作方使用品牌所收取的權利金。依合約固定金額 300 萬日圓/期，屬於「合約」確定收入。",
  },
  {
    id: "tea-import",
    name: "茶葉原料進口",
    amount: 800,
    direction: "out",
    nature: "合約",
    detail:
      "從日本進口高品質抹茶與烏龍茶原料的採購成本。依供應合約固定為 800 萬日圓/期。",
  },
  {
    id: "mizuho-int",
    name: "Mizuho 貸款利息",
    amount: 118,
    direction: "out",
    nature: "合約",
    detail:
      "向 Mizuho 銀行借入的日圓貸款之利息支出。固定利率合約，每期利息 118 萬日圓。這筆日圓負債本身就是一種自然避險工具。",
  },
  {
    id: "tokyo-rent",
    name: "東京店租金",
    amount: 900,
    direction: "out",
    nature: "合約",
    detail:
      "東京旗艦店的店面租賃費用。依租約固定為 900 萬日圓/期，屬於「合約」確定支出。",
  },
];

export default function ExposureInventoryTable() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const totalIn = ITEMS.filter((i) => i.direction === "in").reduce(
      (s, i) => s + i.amount,
      0
    );
    const totalOut = ITEMS.filter((i) => i.direction === "out").reduce(
      (s, i) => s + i.amount,
      0
    );
    const netExposure = totalIn - totalOut;
    const naturalHedgeRatio = totalOut / totalIn;

    const contractIn = ITEMS.filter(
      (i) => i.direction === "in" && i.nature === "合約"
    ).reduce((s, i) => s + i.amount, 0);
    const contractOut = ITEMS.filter(
      (i) => i.direction === "out" && i.nature === "合約"
    ).reduce((s, i) => s + i.amount, 0);
    const expectedIn = ITEMS.filter(
      (i) => i.direction === "in" && i.nature === "預期"
    ).reduce((s, i) => s + i.amount, 0);

    return {
      totalIn,
      totalOut,
      netExposure,
      naturalHedgeRatio,
      contractTotal: contractIn + contractOut,
      expectedTotal: expectedIn,
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto"
    >
      <h4
        className="text-center font-bold text-lg mb-1"
        style={{ color: BRAND.primary }}
      >
        珍途曝險盤點表
      </h4>
      <p className="text-center text-xs text-gray-500 mb-4">
        Exposure Inventory — 收支項目一覽
      </p>

      {/* Main Table */}
      <div className="overflow-x-auto mb-4">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th
                className="px-3 py-2 text-left text-xs font-bold border-b-2"
                style={{ borderColor: BRAND.primary, color: BRAND.primary }}
              >
                項目
              </th>
              <th
                className="px-3 py-2 text-center text-xs font-bold border-b-2"
                style={{ borderColor: BRAND.primary, color: BRAND.primary }}
              >
                金額（萬 ¥）
              </th>
              <th
                className="px-3 py-2 text-center text-xs font-bold border-b-2"
                style={{ borderColor: BRAND.primary, color: BRAND.primary }}
              >
                方向
              </th>
              <th
                className="px-3 py-2 text-center text-xs font-bold border-b-2"
                style={{ borderColor: BRAND.primary, color: BRAND.primary }}
              >
                性質
              </th>
            </tr>
          </thead>
          <tbody>
            {ITEMS.map((item) => {
              const isExpanded = expandedId === item.id;
              const isIn = item.direction === "in";
              const rowColor = isIn ? BRAND.story : BRAND.danger;

              return (
                <tr
                  key={item.id}
                  className="border-b border-gray-100 cursor-pointer transition-colors"
                  style={{
                    backgroundColor: isExpanded
                      ? `${rowColor}08`
                      : "transparent",
                  }}
                  onClick={() =>
                    setExpandedId(isExpanded ? null : item.id)
                  }
                >
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <motion.span
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        className="text-xs text-gray-400"
                      >
                        ▶
                      </motion.span>
                      <span
                        className="text-sm font-medium"
                        style={{ color: BRAND.primary }}
                      >
                        {item.name}
                      </span>
                    </div>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <p className="text-xs text-gray-500 mt-2 pl-5 pr-2 pb-1 leading-relaxed">
                            {item.detail}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <span className="font-bold text-sm" style={{ color: rowColor }}>
                      {fmtNum(item.amount)}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <span
                      className="inline-flex items-center gap-1 text-sm font-bold"
                      style={{ color: rowColor }}
                    >
                      {isIn ? "▲" : "▼"} {isIn ? "收入" : "支出"}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor:
                          item.nature === "合約"
                            ? `${BRAND.primary}15`
                            : `${BRAND.accent}15`,
                        color:
                          item.nature === "合約" ? BRAND.primary : BRAND.accent,
                      }}
                    >
                      {item.nature}
                    </span>
                  </td>
                </tr>
              );
            })}

            {/* Subtotals */}
            <tr
              className="border-t-2"
              style={{ borderColor: BRAND.story }}
            >
              <td
                className="px-3 py-2 text-xs font-bold"
                style={{ color: BRAND.story }}
              >
                總收入
              </td>
              <td
                className="px-3 py-2 text-center font-bold text-sm"
                style={{ color: BRAND.story }}
              >
                {fmtNum(stats.totalIn)}
              </td>
              <td className="px-3 py-2 text-center">
                <span className="text-sm font-bold" style={{ color: BRAND.story }}>
                  ▲
                </span>
              </td>
              <td className="px-3 py-2" />
            </tr>
            <tr
              className="border-t"
              style={{ borderColor: `${BRAND.danger}40` }}
            >
              <td
                className="px-3 py-2 text-xs font-bold"
                style={{ color: BRAND.danger }}
              >
                總支出
              </td>
              <td
                className="px-3 py-2 text-center font-bold text-sm"
                style={{ color: BRAND.danger }}
              >
                {fmtNum(stats.totalOut)}
              </td>
              <td className="px-3 py-2 text-center">
                <span className="text-sm font-bold" style={{ color: BRAND.danger }}>
                  ▼
                </span>
              </td>
              <td className="px-3 py-2" />
            </tr>
            <tr
              className="border-t-2"
              style={{ borderColor: BRAND.primary }}
            >
              <td
                className="px-3 py-2 text-sm font-bold"
                style={{ color: BRAND.primary }}
              >
                淨曝險
              </td>
              <td
                className="px-3 py-2 text-center font-bold text-base"
                style={{ color: BRAND.primary }}
              >
                {fmtNum(stats.netExposure)}
              </td>
              <td className="px-3 py-2 text-center">
                <span className="text-sm font-bold" style={{ color: BRAND.story }}>
                  ▲ 淨收入
                </span>
              </td>
              <td className="px-3 py-2" />
            </tr>
          </tbody>
        </table>
      </div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-2 gap-3 mb-4"
      >
        {/* Natural Hedge Card */}
        <div
          className="p-4 rounded-lg text-center"
          style={{ backgroundColor: `${BRAND.accent}12` }}
        >
          <div className="text-xs text-gray-500 mb-1">自然避險效果</div>
          <div
            className="font-bold text-2xl"
            style={{ color: BRAND.accent }}
          >
            {(stats.naturalHedgeRatio * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-gray-400 mt-1">
            日圓支出抵銷收入的比例
          </div>
        </div>

        {/* Net Exposure Card */}
        <div
          className="p-4 rounded-lg text-center"
          style={{ backgroundColor: `${BRAND.primary}10` }}
        >
          <div className="text-xs text-gray-500 mb-1">需額外避險金額</div>
          <div
            className="font-bold text-2xl"
            style={{ color: BRAND.primary }}
          >
            ¥{fmtNum(stats.netExposure)} 萬
          </div>
          <div className="text-xs text-gray-400 mt-1">
            淨曝險 = 總收入 - 總支出
          </div>
        </div>
      </motion.div>

      {/* Nature Classification Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="p-3 rounded-lg border mb-4"
        style={{ borderColor: `${BRAND.neutral}30` }}
      >
        <div
          className="text-xs font-bold mb-2"
          style={{ color: BRAND.primary }}
        >
          按確定性分類
        </div>
        <div className="flex gap-4">
          <div className="flex-1 text-center p-2 rounded-lg" style={{ backgroundColor: `${BRAND.primary}08` }}>
            <div className="text-xs text-gray-500">合約確定</div>
            <div className="font-bold text-sm" style={{ color: BRAND.primary }}>
              ¥{fmtNum(stats.contractTotal)} 萬
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              權利金 + 茶葉 + 利息 + 租金
            </div>
          </div>
          <div className="flex-1 text-center p-2 rounded-lg" style={{ backgroundColor: `${BRAND.accent}08` }}>
            <div className="text-xs text-gray-500">預期（不確定）</div>
            <div className="font-bold text-sm" style={{ color: BRAND.accent }}>
              ¥{fmtNum(stats.expectedTotal)} 萬
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              東京店營收匯回
            </div>
          </div>
        </div>
      </motion.div>

      {/* Core Insight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center text-sm p-3 rounded-lg"
        style={{ backgroundColor: `${BRAND.accent}15`, color: "#374151" }}
      >
        <span className="font-bold" style={{ color: BRAND.accent }}>
          核心洞察：
        </span>{" "}
        日圓支出（租金、利息、原料）自動抵銷了{" "}
        <span className="font-bold" style={{ color: BRAND.accent }}>
          {(stats.naturalHedgeRatio * 100).toFixed(1)}%
        </span>{" "}
        的收入曝險，珍途只需針對淨曝險{" "}
        <span className="font-bold" style={{ color: BRAND.primary }}>
          ¥{fmtNum(stats.netExposure)} 萬
        </span>{" "}
        制定額外避險策略。
      </motion.div>
    </motion.div>
  );
}

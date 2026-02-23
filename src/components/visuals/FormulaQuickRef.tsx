"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND } from "@/components/brand/BrandColors";

export interface FormulaItem {
  name: string;
  formula: string;
  description: string;
  example?: string;
}

interface FormulaQuickRefProps {
  weekNum: number;
  title: string;
  formulas: FormulaItem[];
}

/** CSS-simulated fraction: renders numerator over denominator with a line */
function Fraction({ top, bottom }: { top: string; bottom: string }) {
  return (
    <span className="inline-flex flex-col items-center mx-1" style={{ verticalAlign: "middle" }}>
      <span className="px-1 text-center leading-tight">{top}</span>
      <span
        className="w-full"
        style={{ height: 1.5, backgroundColor: BRAND.primary }}
      />
      <span className="px-1 text-center leading-tight">{bottom}</span>
    </span>
  );
}

function FormulaCard({ item, index }: { item: FormulaItem; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35 }}
      onClick={() => setExpanded(!expanded)}
      className="rounded-xl border-2 cursor-pointer select-none transition-shadow hover:shadow-md"
      style={{
        borderColor: `${BRAND.primary}30`,
        backgroundColor: "#fafbfc",
      }}
    >
      {/* Header */}
      <div className="px-4 pt-3 pb-2 flex items-start justify-between gap-2">
        <span
          className="text-sm font-semibold"
          style={{ color: BRAND.primary }}
        >
          {item.name}
        </span>
        <span
          className="text-xs mt-0.5 flex-shrink-0"
          style={{ color: BRAND.accent }}
        >
          {expanded ? "收起" : "展開"}
        </span>
      </div>

      {/* Formula display */}
      <div
        className="px-4 pb-3 font-mono leading-relaxed"
        style={{ fontSize: 18, color: BRAND.primary }}
      >
        <FormulaText text={item.formula} />
      </div>

      {/* Expandable description + example */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div
              className="px-4 pb-3 text-sm border-t"
              style={{ borderColor: `${BRAND.primary}15` }}
            >
              <p className="pt-2 text-gray-700 leading-relaxed">
                {item.description}
              </p>
              {item.example && (
                <p className="mt-2 text-gray-600 leading-relaxed">
                  <span
                    className="font-semibold mr-1"
                    style={{ color: BRAND.accent }}
                  >
                    範例：
                  </span>
                  {item.example}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/** Render formula text with highlighted variables */
function FormulaText({ text }: { text: string }) {
  // Split by fraction markers: {num}/{den}
  const parts = text.split(/(\{[^}]+\}\/\{[^}]+\})/g);
  return (
    <>
      {parts.map((part, i) => {
        const fracMatch = part.match(/^\{([^}]+)\}\/\{([^}]+)\}$/);
        if (fracMatch) {
          return <Fraction key={i} top={fracMatch[1]} bottom={fracMatch[2]} />;
        }
        return <HighlightVars key={i} text={part} />;
      })}
    </>
  );
}

/** Highlight currency codes and key variables with brand accent */
const HIGHLIGHT_KEYWORDS = new Set([
  "TWD","USD","JPY","EUR","THB","VND","CNY","AUD","ISK",
  "NPV","APV","WACC","IRR","CIP","UIP","IFE","PPP","PVIFA","HE","NCF","TORF","IRS",
]);

function HighlightVars({ text }: { text: string }) {
  const parts = text.split(/(TWD|USD|JPY|EUR|THB|VND|CNY|AUD|ISK|NPV|APV|WACC|IRR|CIP|UIP|IFE|PPP|PVIFA|HE|NCF|TORF|IRS)/);
  return (
    <>
      {parts.map((part, i) =>
        HIGHLIGHT_KEYWORDS.has(part) ? (
          <span key={i} style={{ color: BRAND.accent, fontWeight: 600 }}>
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export default function FormulaQuickRef({
  weekNum,
  title,
  formulas,
}: FormulaQuickRefProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Title bar */}
      <div
        className="rounded-t-xl px-5 py-3 flex items-center gap-3"
        style={{ backgroundColor: BRAND.primary }}
      >
        <span className="text-white text-opacity-70 text-sm font-mono">
          W{String(weekNum).padStart(2, "0")}
        </span>
        <span className="text-white font-bold text-base">{title}</span>
      </div>

      {/* Cards grid */}
      <div
        className="rounded-b-xl border-2 border-t-0 p-4 grid gap-3"
        style={{ borderColor: `${BRAND.primary}30` }}
      >
        {formulas.map((item, index) => (
          <FormulaCard key={item.name} item={item} index={index} />
        ))}
      </div>

      <p className="text-center text-xs text-gray-400 mt-2">
        點擊卡片查看說明與範例
      </p>
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import katex from "katex";
import { BRAND } from "@/components/brand/BrandColors";

interface FormulaRevealProps {
  formula: string;
  title?: string;
}

export default function FormulaReveal({ formula, title }: FormulaRevealProps) {
  // Safe: KaTeX sanitizes its output, and formula strings are developer-controlled
  const html = katex.renderToString(formula, { throwOnError: false, displayMode: true });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="rounded-xl border-2 bg-white p-6 text-center shadow-sm"
      style={{ borderColor: BRAND.accent }}
    >
      {title && (
        <h4
          className="mb-3 text-sm font-semibold uppercase tracking-wider"
          style={{ color: BRAND.primary }}
        >
          {title}
        </h4>
      )}
      {/* Safe: KaTeX sanitizes output and formula is from trusted source */}
      <div
        className="overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </motion.div>
  );
}

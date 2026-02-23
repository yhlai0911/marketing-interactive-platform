"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import katex from "katex";
import { BRAND } from "@/components/brand/BrandColors";
import type { TheorySegment } from "@/types";

interface TheoryExplainerProps {
  segment: TheorySegment;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function TheoryExplainer({ segment }: TheoryExplainerProps) {
  // KaTeX renderToString output is safe — formula strings are developer-controlled, not user input
  const formulaHtml = segment.formula
    ? katex.renderToString(segment.formula, { throwOnError: false, displayMode: true })
    : null;

  return (
    <div className="space-y-5">
      {/* Title */}
      <div className="flex items-center gap-2">
        <BookOpen className="w-5 h-5" style={{ color: BRAND.primary }} />
        <h3 className="text-lg font-bold" style={{ color: BRAND.primary }}>
          {segment.title}
        </h3>
      </div>

      {/* Theory point cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-3"
      >
        {segment.points.map((point, i) => (
          <motion.div
            key={i}
            variants={cardVariant}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <h4 className="font-semibold text-gray-900">{point.title}</h4>
            <p className="mt-1 text-sm text-gray-600">{point.desc}</p>
            {point.example && (
              <p className="mt-2 text-sm italic text-gray-400">
                {point.example}
              </p>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Formula — KaTeX output from developer-controlled formula strings */}
      {formulaHtml && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-lg border-2 p-5 text-center overflow-x-auto"
          style={{ borderColor: BRAND.accent, backgroundColor: `${BRAND.accent}08` }}
        >
          {/* Safe: KaTeX sanitizes output and formula is from trusted source */}
          <div dangerouslySetInnerHTML={{ __html: formulaHtml }} />
        </motion.div>
      )}
    </div>
  );
}

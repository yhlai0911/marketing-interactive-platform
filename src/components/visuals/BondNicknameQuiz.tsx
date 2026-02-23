"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND } from "@/components/brand/BrandColors";

interface BondItem {
  id: string;
  emoji: string;
  nameCN: string;
  nameEN: string;
}

interface CountryItem {
  id: string;
  flag: string;
  country: string;
  currency: string;
}

const BONDS: BondItem[] = [
  { id: "samurai", emoji: "\u{1F5E1}\uFE0F", nameCN: "\u6B66\u58EB\u50B5\u5238", nameEN: "Samurai Bond" },
  { id: "yankee", emoji: "\u{1F5FD}", nameCN: "\u63DA\u57FA\u50B5\u5238", nameEN: "Yankee Bond" },
  { id: "bulldog", emoji: "\u{1F436}", nameCN: "\u9B25\u725B\u72AC\u50B5\u5238", nameEN: "Bulldog Bond" },
  { id: "panda", emoji: "\u{1F43C}", nameCN: "\u718A\u8C93\u50B5\u5238", nameEN: "Panda Bond" },
  { id: "kangaroo", emoji: "\u{1F998}", nameCN: "\u888B\u9F20\u50B5\u5238", nameEN: "Kangaroo Bond" },
];

const COUNTRIES: CountryItem[] = [
  { id: "samurai", flag: "\u{1F1EF}\u{1F1F5}", country: "\u65E5\u672C", currency: "\u65E5\u5713" },
  { id: "yankee", flag: "\u{1F1FA}\u{1F1F8}", country: "\u7F8E\u570B", currency: "\u7F8E\u5143" },
  { id: "bulldog", flag: "\u{1F1EC}\u{1F1E7}", country: "\u82F1\u570B", currency: "\u82F1\u938A" },
  { id: "panda", flag: "\u{1F1E8}\u{1F1F3}", country: "\u4E2D\u570B", currency: "\u4EBA\u6C11\u5E63" },
  { id: "kangaroo", flag: "\u{1F1E6}\u{1F1FA}", country: "\u6FB3\u6D32", currency: "\u6FB3\u5143" },
];

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function BondNicknameQuiz() {
  const shuffledBonds = useMemo(() => shuffleArray(BONDS), []);
  const shuffledCountries = useMemo(() => shuffleArray(COUNTRIES), []);

  const [selectedBond, setSelectedBond] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [wrongPair, setWrongPair] = useState<{ bond: string; country: string } | null>(null);
  const [showBonus, setShowBonus] = useState(false);
  const [bonusRevealed, setBonusRevealed] = useState(false);

  const score = matchedPairs.size;
  const allMatched = score === 5;

  const handleBondClick = useCallback(
    (bondId: string) => {
      if (matchedPairs.has(bondId) || wrongPair) return;
      setSelectedBond(bondId === selectedBond ? null : bondId);
    },
    [matchedPairs, selectedBond, wrongPair]
  );

  const handleCountryClick = useCallback(
    (countryId: string) => {
      if (!selectedBond || matchedPairs.has(countryId) || wrongPair) return;

      if (selectedBond === countryId) {
        // Correct match
        setMatchedPairs((prev) => new Set([...prev, selectedBond]));
        setSelectedBond(null);
      } else {
        // Wrong match
        setWrongPair({ bond: selectedBond, country: countryId });
        setTimeout(() => {
          setWrongPair(null);
          setSelectedBond(null);
        }, 800);
      }
    },
    [selectedBond, matchedPairs, wrongPair]
  );

  const shakeAnimation = {
    x: [0, -8, 8, -6, 6, -3, 3, 0],
    transition: { duration: 0.5 },
  };

  const correctAnimation = {
    scale: [1, 1.15, 1],
    transition: { duration: 0.4 },
  };

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
        外國債券暱稱配對
      </h4>
      <p className="text-center text-xs text-gray-500 mb-2">
        Foreign Bond Nickname Quiz -- 點擊左邊的債券名稱，再點擊右邊的發行地配對
      </p>

      {/* 計分板 */}
      <div className="text-center mb-4">
        <span
          className="inline-block px-4 py-1.5 rounded-full text-sm font-bold"
          style={{
            backgroundColor: allMatched ? `${BRAND.story}20` : `${BRAND.primary}10`,
            color: allMatched ? BRAND.story : BRAND.primary,
          }}
        >
          {allMatched ? "全部正確！" : `${score} / 5`}
        </span>
      </div>

      {/* 配對區域 */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        {/* 左欄：債券暱稱 */}
        <div className="space-y-2">
          <div className="text-xs text-center text-gray-400 mb-1 font-medium">
            債券暱稱
          </div>
          {shuffledBonds.map((bond) => {
            const isMatched = matchedPairs.has(bond.id);
            const isSelected = selectedBond === bond.id;
            const isWrong = wrongPair?.bond === bond.id;

            return (
              <motion.button
                key={bond.id}
                onClick={() => handleBondClick(bond.id)}
                animate={
                  isWrong
                    ? shakeAnimation
                    : isMatched
                    ? correctAnimation
                    : {}
                }
                className="w-full p-3 rounded-lg border text-left transition-all text-sm"
                style={{
                  borderColor: isMatched
                    ? BRAND.story
                    : isSelected
                    ? BRAND.accent
                    : isWrong
                    ? BRAND.danger
                    : "#e5e7eb",
                  backgroundColor: isMatched
                    ? `${BRAND.story}12`
                    : isSelected
                    ? `${BRAND.accent}12`
                    : isWrong
                    ? `${BRAND.danger}10`
                    : "#fff",
                  opacity: isMatched ? 0.7 : 1,
                  cursor: isMatched ? "default" : "pointer",
                }}
                disabled={isMatched}
              >
                <span className="mr-2 text-base">{bond.emoji}</span>
                <span className="font-medium">{bond.nameCN}</span>
                <span className="text-xs text-gray-400 ml-1">
                  ({bond.nameEN})
                </span>
                {isMatched && (
                  <span className="float-right text-sm" style={{ color: BRAND.story }}>
                    &#10003;
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* 右欄：發行國家 */}
        <div className="space-y-2">
          <div className="text-xs text-center text-gray-400 mb-1 font-medium">
            發行地（幣別）
          </div>
          {shuffledCountries.map((country) => {
            const isMatched = matchedPairs.has(country.id);
            const isWrong = wrongPair?.country === country.id;
            const isClickable = selectedBond !== null && !isMatched;

            return (
              <motion.button
                key={country.id}
                onClick={() => handleCountryClick(country.id)}
                animate={
                  isWrong
                    ? shakeAnimation
                    : isMatched
                    ? correctAnimation
                    : {}
                }
                className="w-full p-3 rounded-lg border text-left transition-all text-sm"
                style={{
                  borderColor: isMatched
                    ? BRAND.story
                    : isWrong
                    ? BRAND.danger
                    : isClickable
                    ? `${BRAND.accent}60`
                    : "#e5e7eb",
                  backgroundColor: isMatched
                    ? `${BRAND.story}12`
                    : isWrong
                    ? `${BRAND.danger}10`
                    : isClickable
                    ? `${BRAND.accent}06`
                    : "#fff",
                  opacity: isMatched ? 0.7 : 1,
                  cursor: isMatched || !isClickable ? "default" : "pointer",
                }}
                disabled={isMatched || !isClickable}
              >
                <span className="mr-2 text-base">{country.flag}</span>
                <span className="font-medium">{country.country}</span>
                <span className="text-xs text-gray-400 ml-1">
                  （{country.currency}）
                </span>
                {isMatched && (
                  <span className="float-right text-sm" style={{ color: BRAND.story }}>
                    &#10003;
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 全部配對完成後顯示 */}
      <AnimatePresence>
        {allMatched && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* 關鍵規則 */}
            <div
              className="text-center text-sm p-4 rounded-lg mb-4"
              style={{ backgroundColor: `${BRAND.accent}15`, color: "#374151" }}
            >
              <span className="font-bold" style={{ color: BRAND.accent }}>
                記憶訣竅：
              </span>{" "}
              外國債券的暱稱跟「
              <span className="font-bold" style={{ color: BRAND.primary }}>
                發行地
              </span>
              」相關，不是「發行人」！武士 = 日本、揚基 = 美國、鬥牛犬 = 英國...
            </div>

            {/* Bonus Challenge */}
            {!showBonus ? (
              <div className="text-center">
                <button
                  onClick={() => setShowBonus(true)}
                  className="px-5 py-2 rounded-full text-sm font-medium transition-colors border"
                  style={{
                    borderColor: BRAND.primary,
                    backgroundColor: "#fff",
                    color: BRAND.primary,
                  }}
                >
                  挑戰加分題
                </button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg border"
                style={{ borderColor: BRAND.primary, backgroundColor: `${BRAND.primary}06` }}
              >
                <div className="text-sm font-bold mb-2" style={{ color: BRAND.primary }}>
                  加分題
                </div>
                <div className="text-sm text-gray-700 mb-3">
                  台積電在紐約發行美元債券 — 這是「外國債券（揚基）」還是「歐洲債券」？
                </div>
                {!bonusRevealed ? (
                  <button
                    onClick={() => setBonusRevealed(true)}
                    className="px-4 py-1.5 rounded-full text-xs font-medium transition-colors"
                    style={{
                      backgroundColor: BRAND.accent,
                      color: "#fff",
                    }}
                  >
                    揭曉答案
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm p-3 rounded-lg"
                    style={{ backgroundColor: `${BRAND.story}10` }}
                  >
                    <span className="font-bold" style={{ color: BRAND.story }}>
                      揚基債券！
                    </span>{" "}
                    <span className="text-gray-600">
                      因為在美國（美元母國）發行美元債 = 外國債券。若台積電在倫敦發行美元債，那才是歐洲債券（Eurobond）—— 幣別在母國「境外」發行。
                    </span>
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 提示文字（未完成時） */}
      {!allMatched && !selectedBond && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-xs text-gray-400 mt-2"
        >
          點擊左邊的債券暱稱開始配對
        </motion.div>
      )}
      {!allMatched && selectedBond && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-xs mt-2"
          style={{ color: BRAND.accent }}
        >
          已選擇債券，請點擊右邊的發行國家
        </motion.div>
      )}
    </motion.div>
  );
}

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

// 動態載入視覺元件，避免 SSR 問題（recharts 需要 DOM）
const SixMotivesChart = dynamic(() => import("./SixMotivesChart"), { ssr: false });
const MonetaryTimeline = dynamic(() => import("./MonetaryTimeline"), { ssr: false });
const ExchangeRateDemo = dynamic(() => import("./ExchangeRateDemo"), { ssr: false });
const MarketShareChart = dynamic(() => import("./MarketShareChart"), { ssr: false });
const BankSpreadComparator = dynamic(() => import("./BankSpreadComparator"), { ssr: false });
const PPPBubbleTeaIndex = dynamic(() => import("./PPPBubbleTeaIndex"), { ssr: false });
const BigMacPPPComparison = dynamic(() => import("./BigMacPPPComparison"), { ssr: false });
const RelativePPPSimulator = dynamic(() => import("./RelativePPPSimulator"), { ssr: false });
const InvoiceCostCalculator = dynamic(() => import("./InvoiceCostCalculator"), { ssr: false });
const NPVStepCalculator = dynamic(() => import("./NPVStepCalculator"), { ssr: false });
const FormulaQuickRef = dynamic(() => import("./FormulaQuickRef"), { ssr: false });
const CIPArbitrageCalculator = dynamic(() => import("./CIPArbitrageCalculator"), { ssr: false });
const CarryTradeSimulator = dynamic(() => import("./CarryTradeSimulator"), { ssr: false });
const ParityWebDiagram = dynamic(() => import("./ParityWebDiagram"), { ssr: false });
const NPVComparisonTable = dynamic(() => import("./NPVComparisonTable"), { ssr: false });
const APVBreakdownChart = dynamic(() => import("./APVBreakdownChart"), { ssr: false });
const SensitivityAnalysis = dynamic(() => import("./SensitivityAnalysis"), { ssr: false });
const EffectiveCostCalculator = dynamic(() => import("./EffectiveCostCalculator"), { ssr: false });
const BondNicknameQuiz = dynamic(() => import("./BondNicknameQuiz"), { ssr: false });
const NaturalHedgeDiagram = dynamic(() => import("./NaturalHedgeDiagram"), { ssr: false });
const HedgingScenarioTable = dynamic(() => import("./HedgingScenarioTable"), { ssr: false });
const OptionPayoffDiagram = dynamic(() => import("./OptionPayoffDiagram"), { ssr: false });
const IRSFlowDiagram = dynamic(() => import("./IRSFlowDiagram"), { ssr: false });
const ExposureInventoryTable = dynamic(() => import("./ExposureInventoryTable"), { ssr: false });
const FourStrategyComparison = dynamic(() => import("./FourStrategyComparison"), { ssr: false });
const DecisionReviewTimeline = dynamic(() => import("./DecisionReviewTimeline"), { ssr: false });
const TranslationMethodComparison = dynamic(() => import("./TranslationMethodComparison"), { ssr: false });
const CTACalculator = dynamic(() => import("./CTACalculator"), { ssr: false });
const ThreeExposureComparison = dynamic(() => import("./ThreeExposureComparison"), { ssr: false });
const CountryRiskMatrix = dynamic(() => import("./CountryRiskMatrix"), { ssr: false });
const CRPCalculator = dynamic(() => import("./CRPCalculator"), { ssr: false });
const RiskMitigationStrategy = dynamic(() => import("./RiskMitigationStrategy"), { ssr: false });
const FiveGatesFlow = dynamic(() => import("./FiveGatesFlow"), { ssr: false });
const NettingFlowDiagram = dynamic(() => import("./NettingFlowDiagram"), { ssr: false });
const TransferPricingScenarios = dynamic(() => import("./TransferPricingScenarios"), { ssr: false });
const TradeFinanceComparison = dynamic(() => import("./TradeFinanceComparison"), { ssr: false });
const ADRLevelComparison = dynamic(() => import("./ADRLevelComparison"), { ssr: false });
const ExchangeComparisonTable = dynamic(() => import("./ExchangeComparisonTable"), { ssr: false });
const PortfolioDiversificationChart = dynamic(() => import("./PortfolioDiversificationChart"), { ssr: false });
const RiskContagionFlow = dynamic(() => import("./RiskContagionFlow"), { ssr: false });
const VaRCVaRCalculator = dynamic(() => import("./VaRCVaRCalculator"), { ssr: false });
const StressTestDashboard = dynamic(() => import("./StressTestDashboard"), { ssr: false });
const SixPillarsFramework = dynamic(() => import("./SixPillarsFramework"), { ssr: false });
const IntegrationAnalysis = dynamic(() => import("./IntegrationAnalysis"), { ssr: false });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const VISUAL_COMPONENTS: Record<string, ComponentType<any>> = {
  SixMotivesChart,
  MonetaryTimeline,
  ExchangeRateDemo,
  MarketShareChart,
  BankSpreadComparator,
  PPPBubbleTeaIndex,
  BigMacPPPComparison,
  RelativePPPSimulator,
  InvoiceCostCalculator,
  NPVStepCalculator,
  FormulaQuickRef,
  CIPArbitrageCalculator,
  CarryTradeSimulator,
  ParityWebDiagram,
  NPVComparisonTable,
  APVBreakdownChart,
  SensitivityAnalysis,
  EffectiveCostCalculator,
  BondNicknameQuiz,
  NaturalHedgeDiagram,
  HedgingScenarioTable,
  OptionPayoffDiagram,
  IRSFlowDiagram,
  ExposureInventoryTable,
  FourStrategyComparison,
  DecisionReviewTimeline,
  TranslationMethodComparison,
  CTACalculator,
  ThreeExposureComparison,
  CountryRiskMatrix,
  CRPCalculator,
  RiskMitigationStrategy,
  FiveGatesFlow,
  NettingFlowDiagram,
  TransferPricingScenarios,
  TradeFinanceComparison,
  ADRLevelComparison,
  ExchangeComparisonTable,
  PortfolioDiversificationChart,
  RiskContagionFlow,
  VaRCVaRCalculator,
  StressTestDashboard,
  SixPillarsFramework,
  IntegrationAnalysis,
};

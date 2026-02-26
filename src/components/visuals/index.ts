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

// Week 01: 行銷的本質
const CharacterIntro = dynamic(() => import("./CharacterIntro"), { ssr: false });
const ThreeDefinitionsTable = dynamic(() => import("./ThreeDefinitionsTable"), { ssr: false });
const FourPDiagram = dynamic(() => import("./FourPDiagram"), { ssr: false });
const AwarenessReflectionCycle = dynamic(() => import("./AwarenessReflectionCycle"), { ssr: false });
const MissionStatementTemplate = dynamic(() => import("./MissionStatementTemplate"), { ssr: false });

// Week 02: 創造價值——哈佛4層次框架
const CombStoryIllustration = dynamic(() => import("./CombStoryIllustration"), { ssr: false });
const ValueDualSource = dynamic(() => import("./ValueDualSource"), { ssr: false });
const MaslowPyramid = dynamic(() => import("./MaslowPyramid"), { ssr: false });
const HarvardFourLevelsPyramid = dynamic(() => import("./HarvardFourLevelsPyramid"), { ssr: false });
const FourLevelTemplate = dynamic(() => import("./FourLevelTemplate"), { ssr: false });

// Week 05: 選定目標——目標市場選擇
const TargetingEvalTable = dynamic(() => import("./TargetingEvalTable"), { ssr: false });
const TargetingTypeMatrix = dynamic(() => import("./TargetingTypeMatrix"), { ssr: false });

// Week 05/06 共用
const MissionChecklist = dynamic(() => import("./MissionChecklist"), { ssr: false });

// Week 06: 搶佔心智——品牌定位
const STPTimeline = dynamic(() => import("./STPTimeline"), { ssr: false });
const PerceptualMap = dynamic(() => import("./PerceptualMap"), { ssr: false });
const PositioningTraps = dynamic(() => import("./PositioningTraps"), { ssr: false });

// Week 07: 數位消費者的旅程——AISAS
const AIDMAvsAISASComparison = dynamic(() => import("./AIDMAvsAISASComparison"), { ssr: false });
const AISASCycleEngine = dynamic(() => import("./AISASCycleEngine"), { ssr: false });

// Week 08: 走進客戶的世界——人物誌（Persona）
const W08PersonaSixElements = dynamic(() => import("./W08PersonaSixElements"), { ssr: false });
const W08ThreeDimensions = dynamic(() => import("./W08ThreeDimensions"), { ssr: false });
const W08FourToolsProgression = dynamic(() => import("./W08FourToolsProgression"), { ssr: false });

// Week 09: 走進客戶的心——同理心地圖（Empathy Map）
const EmpathyMapSixPanel = dynamic(() => import("./EmpathyMapSixPanel"), { ssr: false });
const EmpathyMapVsPersona = dynamic(() => import("./EmpathyMapVsPersona"), { ssr: false });
const EmpathyToStrategy = dynamic(() => import("./EmpathyToStrategy"), { ssr: false });

// Week 10: 痛點轉商機——價值主張畫布（VPC）
const VPCCanvas = dynamic(() => import("./VPCCanvas"), { ssr: false });
const FitDashboard = dynamic(() => import("./FitDashboard"), { ssr: false });

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
  // Week 01
  CharacterIntro,
  ThreeDefinitionsTable,
  FourPDiagram,
  AwarenessReflectionCycle,
  MissionStatementTemplate,
  // Week 02
  CombStoryIllustration,
  ValueDualSource,
  MaslowPyramid,
  HarvardFourLevelsPyramid,
  FourLevelTemplate,
  // Week 05
  TargetingEvalTable,
  TargetingTypeMatrix,
  // Week 05/06 共用
  MissionChecklist,
  // Week 06
  STPTimeline,
  PerceptualMap,
  PositioningTraps,
  // Week 07
  AIDMAvsAISASComparison,
  AISASCycleEngine,
  // Week 08
  W08PersonaSixElements,
  W08ThreeDimensions,
  W08FourToolsProgression,
  // Week 09
  EmpathyMapSixPanel,
  EmpathyMapVsPersona,
  EmpathyToStrategy,
  // Week 10
  VPCCanvas,
  FitDashboard,
};

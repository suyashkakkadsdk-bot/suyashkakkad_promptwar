/**
 * BlindSpot Mirror AI - Socratic Decision Analysis Data Models
 * Strict TypeScript types aligned with Pydantic v2 schemas from Hackathon Blueprint.
 */

export interface ExplicitFact {
  id: string;
  statement: string;
  category: 'financial' | 'temporal' | 'logistical' | 'reputational' | 'contractual' | 'other';
  confidence: 'verified_explicit' | 'stated_self_report';
}

export interface UnstatedAssumption {
  id: string;
  assumption: string;
  fragility: 'Low' | 'Medium' | 'High';
  fragilityReason: string;
  counterHypothesis: string;
  status?: 'unverified' | 'acknowledged' | 'challenged';
  userCertainty?: number; // 1-10
}

export interface OmittedRisk {
  id: string;
  dimension: string;
  description: string;
  impactLevel: 'Minor' | 'Moderate' | 'Critical';
  investigativeQuestion: string;
}

export interface PreMortemTimelineStage {
  month: string;
  label: string;
  projectedSymptom: string;
  vulnerabilityPoint: string;
}

export interface PreMortemAnalysis {
  failureScenario: string;
  rootCauseDayOne: string;
  leadingIndicatorTripwires: string[];
  timeline: PreMortemTimelineStage[];
}

export interface SocraticQuestion {
  id: string;
  question: string;
  category: string;
  socraticIntent: string;
  deepenContext?: string;
  userReflection?: string;
}

export interface CognitiveBiasItem {
  name: string;
  evidence: string;
  debiasingNudge: string;
}

export interface GuardrailMetrics {
  prescriptiveStatementsCount: number;
  reflectiveInquiryRatio: number; // e.g. 82%
  scenarioSynthesisRatio: number; // e.g. 18%
  complianceStatus: 'PASSED_STRICT' | 'WARNING';
  guardrailAuditNotes: string;
}

export interface DecisionAnalysisResult {
  decisionTitle: string;
  rawInput: string;
  timestamp: string;
  objectiveSynthesis: string;
  explicitFacts: ExplicitFact[];
  unstatedAssumptions: UnstatedAssumption[];
  omittedRisks: OmittedRisk[];
  preMortem: PreMortemAnalysis;
  socraticQuestions: SocraticQuestion[];
  cognitiveBiases: CognitiveBiasItem[];
  guardrailMetrics: GuardrailMetrics;
}

export interface PresetScenario {
  id: string;
  title: string;
  tag: string;
  description: string;
  rawInput: string;
  contextNotes: string;
}

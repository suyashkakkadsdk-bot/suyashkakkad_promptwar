import React, { useState } from 'react';
import { X, Copy, Check, Printer, FileText } from 'lucide-react';
import { DecisionAnalysisResult } from '../types/decision';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: DecisionAnalysisResult;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  analysis,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const markdownContent = `
# 🪞 BlindSpot Mirror AI — Socratic Decision Dossier
**Generated at:** ${new Date(analysis.timestamp).toLocaleString()}
**Decision Headline:** ${analysis.decisionTitle}
**Guardrail Ratio:** ${analysis.guardrailMetrics.reflectiveInquiryRatio}% Reflective Inquiry / ${analysis.guardrailMetrics.scenarioSynthesisRatio}% Synthesis
**Prescriptive Statements:** 0 (Strict Non-Prescriptive Socratic Mandate)

---

## 1. Raw Stated Terms & Given Reasons
${analysis.rawInput}

## 2. Objective Scenario Synthesis (20%)
${analysis.objectiveSynthesis}

## 3. Layer 1: Stated Facts vs. Hidden Assumptions
### Explicit Facts
${analysis.explicitFacts.map((f) => `- [${f.category.toUpperCase()}] ${f.statement}`).join('\n')}

### Unstated Assumptions & Fragility
${analysis.unstatedAssumptions
  .map(
    (a) =>
      `### Assumption: ${a.assumption}\n- **Fragility:** ${a.fragility}\n- **Vulnerability:** ${a.fragilityReason}\n- **Counter-Hypothesis:** "${a.counterHypothesis}"`
  )
  .join('\n\n')}

## 4. Layer 2: Pre-Mortem Failure Simulation
- **Prospective Autopsy (Month 6):** ${analysis.preMortem.failureScenario}
- **Day-1 Silent Root Cause:** ${analysis.preMortem.rootCauseDayOne}

### Leading Indicator Tripwires (First 30–60 Days)
${analysis.preMortem.leadingIndicatorTripwires.map((t, idx) => `${idx + 1}. ${t}`).join('\n')}

### Omitted Risk Dimensions
${analysis.omittedRisks
  .map(
    (r) =>
      `- **${r.dimension}** [Impact: ${r.impactLevel}]: ${r.description}\n  *Key Question:* "${r.investigativeQuestion}"`
  )
  .join('\n')}

## 5. Layer 3: Socratic Dialogue & Cognitive Probes
${analysis.socraticQuestions
  .map(
    (q, idx) =>
      `### Probe #${idx + 1}: ${q.question}\n- **Dimension:** ${q.category}\n- **Socratic Intent:** ${q.socraticIntent}`
  )
  .join('\n\n')}

## 6. Cognitive Biases & Debiasing Nudges
${analysis.cognitiveBiases
  .map((b) => `- **${b.name}:** ${b.evidence}\n  *Debiasing Nudge:* ${b.debiasingNudge}`)
  .join('\n')}

---
*Created with BlindSpot Mirror AI — Socratic Decision Analysis Engine.*
`.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <FileText className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Export Socratic Decision Dossier
              </h3>
              <p className="text-xs text-slate-400">
                Ready to copy as formatted Markdown or print for team reflection
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Preview */}
        <div className="flex-1 p-5 overflow-y-auto bg-slate-950/90 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
          {markdownContent}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Includes all extracted facts, assumptions, pre-mortem, & Socratic inquiries.
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition cursor-pointer flex items-center space-x-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition cursor-pointer flex items-center space-x-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Copied Markdown!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Search, Loader2, Info, ArrowRight } from 'lucide-react';

interface DecisionInputFormProps {
  decisionTitle: string;
  setDecisionTitle: (val: string) => void;
  rawInput: string;
  setRawInput: (val: string) => void;
  contextNotes: string;
  setContextNotes: (val: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

export const DecisionInputForm: React.FC<DecisionInputFormProps> = ({
  decisionTitle,
  setDecisionTitle,
  rawInput,
  setRawInput,
  contextNotes,
  setContextNotes,
  onAnalyze,
  isLoading,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Background glow decoration */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <span>Socratic Input Matrix</span>
            <span className="text-[11px] font-normal text-slate-400">
              (Layer 1 Parser & Decomposition)
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Describe the choice, concrete numbers, and what makes it attractive. The Socratic engine will separate visible facts from implicit assumptions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 cols: Title and Raw Input */}
        <div className="lg:col-span-2 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Decision Headline / Offer Title:
            </label>
            <input
              type="text"
              value={decisionTitle}
              onChange={(e) => setDecisionTitle(e.target.value)}
              placeholder="e.g. 6-Month Internship Offer Evaluation"
              className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-300">
                Stated Terms & Given Reasons:
              </label>
              <span className="text-[11px] text-slate-500">
                Include salary, hours, location, and why you want it
              </span>
            </div>
            <textarea
              rows={4}
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder="e.g. 6-month internship offer. Stipend: $1,000/mo. Location: 10 mins from home. Schedule: 9 AM – 6 PM. Given Reasons: Good money, close location, resume brand name."
              className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition font-sans leading-relaxed"
            />
          </div>
        </div>

        {/* Right col: Context & Secondary constraints */}
        <div className="space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-300">
                Secondary Constraints & Headroom:
              </label>
            </div>
            <textarea
              rows={4}
              value={contextNotes}
              onChange={(e) => setContextNotes(e.target.value)}
              placeholder="e.g. Current student with 18 credit hours, midterm exams in 6 weeks, limited personal savings, partner in city center..."
              className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition font-sans leading-relaxed"
            />
          </div>

          {/* Action button */}
          <button
            onClick={onAnalyze}
            disabled={isLoading || !rawInput.trim()}
            className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center space-x-2 transition cursor-pointer shadow-lg ${
              isLoading || !rawInput.trim()
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-indigo-600/30'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Running Socratic Guardrail Extraction...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Run Socratic Blind-Spot Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center space-x-1.5">
          <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span>
            <strong>Architectural Rule:</strong> The engine is strictly non-prescriptive. It extracts hidden assumptions and scenarios, but never tells you what to choose.
          </span>
        </div>
        <span className="hidden sm:inline text-slate-500 font-mono text-[10px]">
          Single-pass JSON Schema Execution
        </span>
      </div>
    </div>
  );
};

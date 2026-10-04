import React, { useState } from 'react';
import { DecisionAnalysisResult, UnstatedAssumption } from '../types/decision';
import { Eye, EyeOff, AlertTriangle, CheckCircle2, HelpCircle, Flame, ShieldAlert, Sliders } from 'lucide-react';

interface BlindSpotMirrorProps {
  analysis: DecisionAnalysisResult;
  onUpdateAssumption?: (updatedAssumption: UnstatedAssumption) => void;
}

export const BlindSpotMirror: React.FC<BlindSpotMirrorProps> = ({
  analysis,
  onUpdateAssumption,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'high' | 'medium'>('all');
  const [userAssumptions, setUserAssumptions] = useState<UnstatedAssumption[]>(
    analysis.unstatedAssumptions
  );

  // Keep state synced if analysis changes
  React.useEffect(() => {
    setUserAssumptions(analysis.unstatedAssumptions);
  }, [analysis]);

  const handleToggleStatus = (id: string, newStatus: 'unverified' | 'acknowledged' | 'challenged') => {
    const updated = userAssumptions.map((item) =>
      item.id === id ? { ...item, status: newStatus } : item
    );
    setUserAssumptions(updated);
    const target = updated.find((i) => i.id === id);
    if (target && onUpdateAssumption) {
      onUpdateAssumption(target);
    }
  };

  const handleCertaintyChange = (id: string, val: number) => {
    const updated = userAssumptions.map((item) =>
      item.id === id ? { ...item, userCertainty: val } : item
    );
    setUserAssumptions(updated);
    const target = updated.find((i) => i.id === id);
    if (target && onUpdateAssumption) {
      onUpdateAssumption(target);
    }
  };

  const filteredAssumptions = userAssumptions.filter((item) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'high') return item.fragility === 'High';
    if (activeFilter === 'medium') return item.fragility === 'Medium';
    return true;
  });

  const getFragilityColor = (fragility: string) => {
    switch (fragility.toLowerCase()) {
      case 'high':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'medium':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      default:
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'financial':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
      case 'temporal':
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20';
      case 'logistical':
        return 'bg-blue-500/10 text-blue-300 border-blue-500/20';
      case 'reputational':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/20';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with Layer explanation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-white tracking-tight">
              Layer 4 & Layer 1: Interactive Blind-Spot Mirror
            </h3>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Side-by-Side Visual Split
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Contrasting what you heavily over-weight on the left against the implicit vulnerabilities surfaced on the right.
          </p>
        </div>

        {/* Filter pills */}
        <div className="flex items-center space-x-1.5 self-start sm:self-auto">
          <span className="text-[11px] text-slate-400 mr-1 flex items-center gap-1">
            <Sliders className="w-3 h-3 text-slate-500" /> Filter Fragility:
          </span>
          {(['all', 'high', 'medium'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`text-xs px-2.5 py-1 rounded-lg capitalize transition cursor-pointer font-medium ${
                activeFilter === filter
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Side-by-Side Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left Column: Visible Horizon (What you see & stated) */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <Eye className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Visible Horizon (Stated Data)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Explicit verified constraints & stated motivators
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                20% Objective Synthesis
              </span>
            </div>

            {/* Objective Synthesis Box */}
            <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-3.5 mb-4 text-xs text-slate-300 leading-relaxed font-sans">
              <span className="font-semibold text-emerald-400 block mb-1">
                Objective Synthesis:
              </span>
              {analysis.objectiveSynthesis}
            </div>

            {/* Explicit Verified Facts list */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Extracted Explicit Facts ({analysis.explicitFacts.length}):
                </span>
                <span className="text-[10px] text-emerald-400/90 flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3 h-3" /> 100% Grounded
                </span>
              </div>

              <div className="space-y-2">
                {analysis.explicitFacts.map((fact) => (
                  <div
                    key={fact.id}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/70 hover:border-slate-700 transition flex items-start space-x-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span
                          className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${getCategoryBadge(
                            fact.category
                          )}`}
                        >
                          {fact.category}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {fact.confidence === 'verified_explicit'
                            ? 'Hard constraint'
                            : 'Self-reported motive'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 leading-snug font-medium">
                        {fact.statement}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Cognitive focus area: Immediate visible payoff</span>
            <span className="font-mono text-[10px] text-slate-400">Layer 1 Extractor</span>
          </div>
        </div>

        {/* Right Column: The Blind Spot Mirror (What you missed) */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <EyeOff className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    The Blind Spot Mirror
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Unstated premises & unverified dependencies
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                80% Socratic Probing
              </span>
            </div>

            {/* Assumptions List with Stress-Tester */}
            <div className="space-y-3">
              {filteredAssumptions.map((assump) => {
                const certainty = assump.userCertainty ?? 5;
                return (
                  <div
                    key={assump.id}
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-amber-500/30 transition space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <Flame className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="text-xs font-bold text-slate-100 leading-snug">
                          {assump.assumption}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border shrink-0 ${getFragilityColor(
                          assump.fragility
                        )}`}
                      >
                        Fragility: {assump.fragility}
                      </span>
                    </div>

                    {/* Fragility Reason */}
                    <p className="text-xs text-slate-300 leading-relaxed">
                      <strong className="text-amber-300/90 font-medium">Why it's vulnerable: </strong>
                      {assump.fragilityReason}
                    </p>

                    {/* Counter Hypothesis */}
                    <div className="p-2 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200/90 italic">
                      <span className="font-semibold text-indigo-300 not-italic block mb-0.5">
                        Orthogonal Counter-Hypothesis:
                      </span>
                      "{assump.counterHypothesis}"
                    </div>

                    {/* Stress-Tester Interactive Controls */}
                    <div className="pt-2 border-t border-slate-800/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-400">Your Certainty:</span>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={certainty}
                          onChange={(e) =>
                            handleCertaintyChange(assump.id, parseInt(e.target.value, 10))
                          }
                          className="w-20 accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                        />
                        <span className="font-mono text-indigo-300 font-bold">
                          {certainty}/10
                        </span>
                      </div>

                      {/* Status toggle buttons */}
                      <div className="flex items-center space-x-1.5 self-end sm:self-auto">
                        <button
                          onClick={() => handleToggleStatus(assump.id, 'unverified')}
                          className={`px-2 py-0.5 rounded text-[10px] transition cursor-pointer ${
                            (assump.status || 'unverified') === 'unverified'
                              ? 'bg-slate-700 text-white font-medium'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          Unverified
                        </button>
                        <button
                          onClick={() => handleToggleStatus(assump.id, 'challenged')}
                          className={`px-2 py-0.5 rounded text-[10px] transition cursor-pointer ${
                            assump.status === 'challenged'
                              ? 'bg-rose-600 text-white font-medium'
                              : 'text-slate-400 hover:text-rose-400'
                          }`}
                        >
                          Challenged
                        </button>
                        <button
                          onClick={() => handleToggleStatus(assump.id, 'acknowledged')}
                          className={`px-2 py-0.5 rounded text-[10px] transition cursor-pointer ${
                            assump.status === 'acknowledged'
                              ? 'bg-emerald-600 text-white font-medium'
                              : 'text-slate-400 hover:text-emerald-400'
                          }`}
                        >
                          Acknowledged
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Critical assumption stress-test active</span>
            <span className="font-mono text-[10px] text-amber-400">Automated Assumption Extractor</span>
          </div>
        </div>
      </div>
    </div>
  );
};

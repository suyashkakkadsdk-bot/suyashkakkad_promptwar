import React, { useState } from 'react';
import { PreMortemAnalysis, OmittedRisk } from '../types/decision';
import { AlertOctagon, Skull, Compass, ShieldAlert, Flag, HelpCircle, ChevronRight, Clock } from 'lucide-react';

interface PreMortemEngineProps {
  preMortem: PreMortemAnalysis;
  omittedRisks: OmittedRisk[];
}

export const PreMortemEngine: React.FC<PreMortemEngineProps> = ({
  preMortem,
  omittedRisks,
}) => {
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(0);
  const currentTimelineStage = preMortem.timeline[selectedMonthIndex] || preMortem.timeline[0];

  const getImpactBadge = (level: string) => {
    switch (level.toLowerCase()) {
      case 'critical':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'moderate':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      default:
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-6 shadow-sm">
      {/* Layer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Skull className="w-4 h-4 text-rose-400" />
              Layer 2: Orthogonal Perspective & Pre-Mortem Engine
            </h3>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/30">
              Prospective Hindsight
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Conducting prospective failure autopsies to identify day-1 implicit vulnerabilities before commitments become irreversible.
          </p>
        </div>
        <div className="text-[11px] text-slate-500 font-mono self-start sm:self-auto flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-indigo-400" /> 6-Month Failure Horizon
        </div>
      </div>

      {/* Main Pre-Mortem Scenario & Day-1 Root Cause */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Failure Scenario Card */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-rose-950/30 via-slate-900/90 to-slate-950 border border-rose-500/25 space-y-2">
          <div className="flex items-center space-x-2">
            <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider text-rose-300">
              Prospective Failure Scenario (Month 6)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
            "{preMortem.failureScenario}"
          </p>
        </div>

        {/* Day-1 Root Cause Card */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/30 via-slate-900/90 to-slate-950 border border-amber-500/25 space-y-2">
          <div className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Day-1 Root Cause Autopsy
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
            {preMortem.rootCauseDayOne}
          </p>
        </div>
      </div>

      {/* Timeline Escalation Interactive Stage */}
      {preMortem.timeline && preMortem.timeline.length > 0 && (
        <div className="space-y-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              Cascading Risk Timeline (Interactive Progression)
            </span>
            <span className="text-[11px] text-slate-400">
              Select milestone to view projected failure mode:
            </span>
          </div>

          {/* Milestone Tabs */}
          <div className="grid grid-cols-3 gap-2">
            {preMortem.timeline.map((stage, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedMonthIndex(idx)}
                className={`py-2 px-3 rounded-lg text-left transition cursor-pointer border ${
                  selectedMonthIndex === idx
                    ? 'bg-indigo-950/70 border-indigo-500/60 shadow-md shadow-indigo-950'
                    : 'bg-slate-900/80 border-slate-800 hover:bg-slate-850 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold text-white flex items-center justify-between">
                  <span>{stage.month}</span>
                  {selectedMonthIndex === idx && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                  )}
                </div>
                <div className="text-[11px] text-slate-400 truncate">{stage.label}</div>
              </button>
            ))}
          </div>

          {/* Active Milestone Card */}
          {currentTimelineStage && (
            <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-700/80 space-y-2 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-indigo-300">
                  {currentTimelineStage.month}: {currentTimelineStage.label}
                </span>
                <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-800">
                  Projected Trajectory
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950/60 p-2.5 rounded-md border border-slate-800">
                  <span className="text-slate-400 block font-medium mb-1">
                    Projected Visible Symptom:
                  </span>
                  <p className="text-slate-200">{currentTimelineStage.projectedSymptom}</p>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded-md border border-slate-800">
                  <span className="text-rose-400/90 block font-medium mb-1">
                    Underlying Failure Vulnerability:
                  </span>
                  <p className="text-slate-200">{currentTimelineStage.vulnerabilityPoint}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Leading Indicator Tripwires (First 30-60 Days) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Flag className="w-3.5 h-3.5 text-amber-400" />
            Leading Indicator Tripwires (Verifiable Early Signals in Days 14–60)
          </span>
          <span className="text-[11px] text-slate-500 font-mono">Pre-Commitment Boundaries</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {preMortem.leadingIndicatorTripwires.map((wire, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/30 transition flex items-start space-x-2.5"
            >
              <span className="w-5 h-5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p className="text-xs text-slate-300 leading-snug">{wire}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Omitted Risk Dimensions (from page 2 of blueprint) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Omitted Risk Dimensions ({omittedRisks.length})
            </span>
          </div>
          <span className="text-[11px] text-slate-500">
            Crucial variables completely missing from your stated rationale
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {omittedRisks.map((risk) => (
            <div
              key={risk.id}
              className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white line-clamp-1">
                    {risk.dimension}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getImpactBadge(
                      risk.impactLevel
                    )}`}
                  >
                    {risk.impactLevel}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {risk.description}
                </p>
              </div>

              {/* Concrete investigative question to ask */}
              <div className="p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-200/90">
                <div className="flex items-center space-x-1.5 mb-1 text-cyan-400 font-semibold text-[11px]">
                  <HelpCircle className="w-3 h-3" />
                  <span>Investigative Question to Counterparty:</span>
                </div>
                <p className="italic">"{risk.investigativeQuestion}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

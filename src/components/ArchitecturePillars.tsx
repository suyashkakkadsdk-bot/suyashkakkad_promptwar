import React, { useState } from 'react';
import { Layers, ShieldAlert, Cpu, Sparkles, ChevronDown, ChevronUp, Zap, HelpCircle } from 'lucide-react';

export const ArchitecturePillars: React.FC = () => {
  const [showComparison, setShowComparison] = useState(false);

  const competitiveData = [
    {
      name: 'Decira.ai',
      strength: 'Spot-on cognitive bias detection (confirmation, sunk cost)',
      gap: 'Rigid workflow with low prompt customization',
      blindSpotAdvantage: 'Dynamic Socratic probes tailored to specific user scenarios'
    },
    {
      name: 'Rationale (Jina AI)',
      strength: 'Fast SWOT, Pros/Cons & cost-benefit matrices',
      gap: 'Analytical only; summarizes given data without discovering missing data',
      blindSpotAdvantage: 'Automated Assumption Extractor highlights unstated premises'
    },
    {
      name: 'MIT AI Blindspot',
      strength: 'Comprehensive audit framework for proxy variables',
      gap: 'High manual friction; paper/card-based process',
      blindSpotAdvantage: 'Single-pass LLM structured extraction with zero user friction'
    },
    {
      name: 'Princeton SocraticAI',
      strength: 'Deep multi-agent Socratic dialogue loops',
      gap: 'High latency and prohibitive API cost for real-time apps',
      blindSpotAdvantage: 'Single-pass JSON schema output delivering instant responses'
    }
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
      {/* 4 Pillars Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            4-Layer Unified System Architecture
          </h3>
          <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
            (Blueprint §3)
          </span>
        </div>
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 transition cursor-pointer self-start sm:self-auto font-medium"
        >
          <span>{showComparison ? 'Hide' : 'Show'} Competitive Gap Analysis</span>
          {showComparison ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
          <div className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">
            Layer 1
          </div>
          <div className="text-xs font-bold text-white">Fact vs. Assumption Splitter</div>
          <p className="text-[11px] text-slate-400 leading-snug">
            Parses raw inputs, categorizing explicit facts vs. implicit unverified assumptions.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
          <div className="text-[10px] font-mono text-rose-400 uppercase font-semibold">
            Layer 2
          </div>
          <div className="text-xs font-bold text-white">Pre-Mortem Engine</div>
          <p className="text-[11px] text-slate-400 leading-snug">
            Runs prospective failure simulations (6 months out) and pinpoints Day-1 silent root cause.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
          <div className="text-[10px] font-mono text-indigo-400 uppercase font-semibold">
            Layer 3
          </div>
          <div className="text-xs font-bold text-white">Socratic Guardrails</div>
          <p className="text-[11px] text-slate-400 leading-snug">
            Enforces strict non-prescriptive rules via prompt constraints and JSON schema validation.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
          <div className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">
            Layer 4
          </div>
          <div className="text-xs font-bold text-white">Interactive Dashboard UI</div>
          <p className="text-[11px] text-slate-400 leading-snug">
            Side-by-side visual mirror contrasting visible drivers against overlooked dimensions.
          </p>
        </div>
      </div>

      {/* Expandable Competitive Matrix */}
      {showComparison && (
        <div className="pt-3 border-t border-slate-800 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-300">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Competitive Landscape & BlindSpot Advantage (Blueprint §2)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-mono">
                  <th className="py-2 pr-3">Solution</th>
                  <th className="py-2 px-3">Core Strength</th>
                  <th className="py-2 px-3">Critical Gap</th>
                  <th className="py-2 pl-3 text-indigo-400">BlindSpot AI Advantage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans text-xs">
                {competitiveData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-950/40">
                    <td className="py-2.5 pr-3 font-semibold text-white whitespace-nowrap">
                      {row.name}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">{row.strength}</td>
                    <td className="py-2.5 px-3 text-slate-400 italic">{row.gap}</td>
                    <td className="py-2.5 pl-3 text-indigo-300 font-medium">
                      {row.blindSpotAdvantage}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

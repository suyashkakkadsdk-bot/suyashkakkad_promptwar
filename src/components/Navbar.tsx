import React from 'react';
import { ShieldCheck, Code2, Download, Sparkles, Scale } from 'lucide-react';

interface NavbarProps {
  onOpenCodeModal: () => void;
  onOpenExportModal: () => void;
  complianceRatio: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCodeModal,
  onOpenExportModal,
  complianceRatio,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Scale className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                BlindSpot Mirror AI
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Blueprint v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Socratic Thinking Partner & Decision Analysis</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Guardrail pill */}
          <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/25 text-emerald-400 text-xs font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>80/20 Guardrails: {complianceRatio}% Socratic</span>
          </div>

          {/* Architecture / Python Code Inspector */}
          <button
            onClick={onOpenCodeModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white text-xs font-medium transition cursor-pointer"
            title="Inspect Blueprint Python Modules"
          >
            <Code2 className="w-4 h-4 text-violet-400" />
            <span className="hidden sm:inline">Python Architecture</span>
          </button>

          {/* Export Brief */}
          <button
            onClick={onOpenExportModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Brief</span>
          </button>
        </div>
      </div>
    </header>
  );
};

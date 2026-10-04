import React from 'react';
import { PRESET_SCENARIOS } from '../data/presetScenarios';
import { PresetScenario } from '../types/decision';
import { Sparkles, GraduationCap, Building2, Home, Rocket } from 'lucide-react';

interface PresetSelectorProps {
  activePresetId: string;
  onSelectPreset: (preset: PresetScenario) => void;
  onSelectCustom: () => void;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  activePresetId,
  onSelectPreset,
  onSelectCustom,
}) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'student-internship':
        return <GraduationCap className="w-4 h-4 text-emerald-400" />;
      case 'startup-pivot':
        return <Rocket className="w-4 h-4 text-cyan-400" />;
      case 'suburb-relocation':
        return <Home className="w-4 h-4 text-amber-400" />;
      case 'series-b-leap':
        return <Building2 className="w-4 h-4 text-indigo-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Quick-Load Scenarios
          </span>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            (Instant Socratic breakdown)
          </span>
        </div>
        <button
          onClick={onSelectCustom}
          className={`text-xs px-2.5 py-1 rounded-md font-medium transition cursor-pointer ${
            activePresetId === 'custom'
              ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          + Blank Custom Decision
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {PRESET_SCENARIOS.map((preset) => {
          const isActive = activePresetId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={`text-left p-3 rounded-xl border transition-all cursor-pointer group ${
                isActive
                  ? 'bg-indigo-950/40 border-indigo-500/60 shadow-md shadow-indigo-950/50'
                  : 'bg-slate-900/90 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-2">
                  <div className="p-1 rounded-md bg-slate-800/90 group-hover:scale-105 transition">
                    {getIcon(preset.id)}
                  </div>
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-white line-clamp-1">
                    {preset.title}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {preset.description}
              </p>
              <div className="mt-2 flex items-center">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                  {preset.tag}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

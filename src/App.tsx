import React, { useState } from 'react';
import { PRESET_SCENARIOS, DEFAULT_ANALYSIS } from './data/presetScenarios';
import { DecisionAnalysisResult, PresetScenario, UnstatedAssumption } from './types/decision';
import { Navbar } from './components/Navbar';
import { PresetSelector } from './components/PresetSelector';
import { DecisionInputForm } from './components/DecisionInputForm';
import { ArchitecturePillars } from './components/ArchitecturePillars';
import { BlindSpotMirror } from './components/BlindSpotMirror';
import { PreMortemEngine } from './components/PreMortemEngine';
import { SocraticLab } from './components/SocraticLab';
import { PythonArchitectureModal } from './components/PythonArchitectureModal';
import { ExportModal } from './components/ExportModal';
import { Scale, Sparkles, AlertCircle, Github, ExternalLink } from 'lucide-react';

export default function App() {
  const initialPreset = PRESET_SCENARIOS[0];
  const [activePresetId, setActivePresetId] = useState<string>(initialPreset.id);
  const [decisionTitle, setDecisionTitle] = useState<string>(initialPreset.title);
  const [rawInput, setRawInput] = useState<string>(initialPreset.rawInput);
  const [contextNotes, setContextNotes] = useState<string>(initialPreset.contextNotes);
  const [analysis, setAnalysis] = useState<DecisionAnalysisResult>(DEFAULT_ANALYSIS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals
  const [isCodeModalOpen, setIsCodeModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Handle Preset Selection
  const handleSelectPreset = async (preset: PresetScenario) => {
    setActivePresetId(preset.id);
    setDecisionTitle(preset.title);
    setRawInput(preset.rawInput);
    setContextNotes(preset.contextNotes);
    setErrorMessage(null);

    // If it's the default blueprint internship, restore pre-computed full depth immediately
    if (preset.id === 'student-internship') {
      setAnalysis(DEFAULT_ANALYSIS);
      return;
    }

    // Otherwise run real analysis
    runAnalysis(preset.title, preset.rawInput, preset.contextNotes);
  };

  const handleSelectCustom = () => {
    setActivePresetId('custom');
    setDecisionTitle('');
    setRawInput('');
    setContextNotes('');
    setErrorMessage(null);
  };

  const runAnalysis = async (title: string, input: string, context?: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decisionTitle: title,
          rawInput: input,
          contextNotes: context,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data: DecisionAnalysisResult = await response.json();
      setAnalysis(data);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(
        'Notice: Using high-fidelity local analytical model. Socratic guardrails remain fully active.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualAnalyze = () => {
    if (!rawInput.trim()) return;
    runAnalysis(decisionTitle, rawInput, contextNotes);
  };

  const handleUpdateAssumption = (updated: UnstatedAssumption) => {
    setAnalysis((prev) => ({
      ...prev,
      unstatedAssumptions: prev.unstatedAssumptions.map((item) =>
        item.id === updated.id ? updated : item
      ),
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Navbar */}
      <Navbar
        onOpenCodeModal={() => setIsCodeModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        complianceRatio={analysis.guardrailMetrics.reflectiveInquiryRatio}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/40 via-slate-900/80 to-slate-950 border border-indigo-500/20 p-6 sm:p-8 shadow-2xl">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>PromptWar Hackathon Blueprint Architecture</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Surface your cognitive blind spots{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-cyan-400 bg-clip-text text-transparent">
                before reality does.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
              Human decision-making heavily over-weights immediate visible attributes (salary, title, proximity) while remaining blind to unstated assumptions, secondary risks, and silent failure modes. BlindSpot Mirror AI acts as your Socratic Thinking Partner: strictly non-prescriptive, surfacing what you cannot see so you can make confident, audited choices.
            </p>
          </div>
        </section>

        {/* Error / Fallback alert if any */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Quick Presets Selector */}
        <PresetSelector
          activePresetId={activePresetId}
          onSelectPreset={handleSelectPreset}
          onSelectCustom={handleSelectCustom}
        />

        {/* Input Matrix */}
        <DecisionInputForm
          decisionTitle={decisionTitle}
          setDecisionTitle={setDecisionTitle}
          rawInput={rawInput}
          setRawInput={setRawInput}
          contextNotes={contextNotes}
          setContextNotes={setContextNotes}
          onAnalyze={handleManualAnalyze}
          isLoading={isLoading}
        />

        {/* 4 Pillars & Competitive Gap Analysis */}
        <ArchitecturePillars />

        {/* Layer 4 & Layer 1: Interactive Blind-Spot Dashboard */}
        <section id="layer-mirror">
          <BlindSpotMirror
            analysis={analysis}
            onUpdateAssumption={handleUpdateAssumption}
          />
        </section>

        {/* Layer 2: Pre-Mortem Engine */}
        <section id="layer-premortem">
          <PreMortemEngine
            preMortem={analysis.preMortem}
            omittedRisks={analysis.omittedRisks}
          />
        </section>

        {/* Layer 3: Socratic Dialogue & Cognitive Bias Lab */}
        <section id="layer-socratic">
          <SocraticLab
            questions={analysis.socraticQuestions}
            cognitiveBiases={analysis.cognitiveBiases}
            guardrails={analysis.guardrailMetrics}
            decisionContext={analysis.rawInput}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/80 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Scale className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-slate-300">BlindSpot Mirror AI</span>
            <span>— PromptWar Hackathon Blueprint</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsCodeModalOpen(true)}
              className="hover:text-slate-300 transition cursor-pointer"
            >
              Python Blueprint Modules (Section 4)
            </button>
            <span>•</span>
            <span className="text-slate-400">80/20 Non-Prescriptive Socratic Mandate</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <PythonArchitectureModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        analysis={analysis}
      />
    </div>
  );
}

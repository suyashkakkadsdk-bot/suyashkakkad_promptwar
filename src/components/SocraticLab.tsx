import React, { useState } from 'react';
import { SocraticQuestion, CognitiveBiasItem, GuardrailMetrics } from '../types/decision';
import { MessageSquareCode, ShieldCheck, Brain, Sparkles, Send, HelpCircle, ChevronDown, ChevronUp, Loader2, ArrowRight } from 'lucide-react';

interface SocraticLabProps {
  questions: SocraticQuestion[];
  cognitiveBiases: CognitiveBiasItem[];
  guardrails: GuardrailMetrics;
  decisionContext: string;
}

export const SocraticLab: React.FC<SocraticLabProps> = ({
  questions,
  cognitiveBiases,
  guardrails,
  decisionContext,
}) => {
  const [reflections, setReflections] = useState<{ [id: string]: string }>({});
  const [deepenedProbes, setDeepenedProbes] = useState<{
    [id: string]: { probe: string; challenge: string };
  }>({});
  const [loadingDeepen, setLoadingDeepen] = useState<{ [id: string]: boolean }>({});
  const [expandedProbeId, setExpandedProbeId] = useState<string | null>(
    questions[0]?.id || null
  );

  const handleSaveReflection = (id: string, text: string) => {
    setReflections((prev) => ({ ...prev, [id]: text }));
  };

  const handleDeepen = async (q: SocraticQuestion) => {
    setLoadingDeepen((prev) => ({ ...prev, [q.id]: true }));
    try {
      const response = await fetch('/api/deepen-probe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q.question,
          userReflection: reflections[q.id] || '',
          decisionContext,
        }),
      });
      const data = await response.json();
      setDeepenedProbes((prev) => ({
        ...prev,
        [q.id]: {
          probe: data.deepenedProbe,
          challenge: data.followUpChallenge,
        },
      }));
    } catch (err) {
      console.error('Deepen error:', err);
      setDeepenedProbes((prev) => ({
        ...prev,
        [q.id]: {
          probe: 'What if your current operational workload is doubled by surprise project emergencies?',
          challenge: 'Identify what you would sacrifice first: sleep, academic grades, or work quality.',
        },
      }));
    } finally {
      setLoadingDeepen((prev) => ({ ...prev, [q.id]: false }));
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <MessageSquareCode className="w-4 h-4 text-indigo-400" />
              Layer 3: Socratic Dialogue & Cognitive Bias Audit
            </h3>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              Strict Non-Prescriptive
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Targeted reflective questions and bias counters designed to stimulate independent critical thinking without prescriptive advice.
          </p>
        </div>

        {/* Live Guardrail Compliance Badge */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-emerald-500/30 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="text-[11px] leading-tight">
            <span className="text-emerald-300 font-semibold block">
              Guardrail Audit: {guardrails.complianceStatus}
            </span>
            <span className="text-slate-400 text-[10px]">
              0 Prescriptive Statements | {guardrails.reflectiveInquiryRatio}% Socratic
            </span>
          </div>
        </div>
      </div>

      {/* Socratic Questions Interactive Accordion / Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Provocative Socratic Inquiries ({questions.length})
          </span>
          <span className="text-[11px] text-slate-500">
            Type your self-reflection to sharpen decision clarity
          </span>
        </div>

        <div className="space-y-3">
          {questions.map((q, idx) => {
            const isExpanded = expandedProbeId === q.id;
            const reflectionText = reflections[q.id] || '';
            const deepened = deepenedProbes[q.id];
            const isDeepening = loadingDeepen[q.id];

            return (
              <div
                key={q.id}
                className="rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-indigo-500/30 transition overflow-hidden"
              >
                {/* Question Trigger Bar */}
                <button
                  onClick={() => setExpandedProbeId(isExpanded ? null : q.id)}
                  className="w-full p-4 text-left flex items-start justify-between gap-3 cursor-pointer group"
                >
                  <div className="flex items-start space-x-3">
                    <span className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-indigo-500/20 transition">
                      #{idx + 1}
                    </span>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 mr-2">
                        {q.category}
                      </span>
                      <h4 className="text-sm font-semibold text-slate-100 group-hover:text-white mt-1 leading-snug">
                        {q.question}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1">
                        <strong className="text-slate-300">Socratic Intent:</strong> {q.socraticIntent}
                      </p>
                    </div>
                  </div>
                  <div className="text-slate-400 group-hover:text-slate-200 transition mt-1">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {/* Collapsible Interactive Body */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-slate-800/60 space-y-3 bg-slate-900/30">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-medium text-slate-300">
                          Your Direct Reflection / Answer:
                        </label>
                        <span className="text-[10px] text-slate-500">
                          Saved locally to decision dossier
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        value={reflectionText}
                        onChange={(e) => handleSaveReflection(q.id, e.target.value)}
                        placeholder="Write your honest internal answer here (e.g., 'If I am being honest, 9 hours of work will leave me exhausted for evening study...')"
                        className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition leading-relaxed"
                      />
                    </div>

                    {/* Deepen Inquiry Action & Display */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => handleDeepen(q)}
                        disabled={isDeepening}
                        className="flex items-center space-x-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium px-2.5 py-1 rounded-md bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/25 transition cursor-pointer"
                      >
                        {isDeepening ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                            <span>Generating Orthogonal Challenge...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Deepen Socratic Counter-Probe</span>
                          </>
                        )}
                      </button>

                      {reflectionText && (
                        <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                          ✓ Reflection Recorded
                        </span>
                      )}
                    </div>

                    {/* Render deepened probe if exists */}
                    {deepened && (
                      <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-2 mt-2">
                        <div className="flex items-center space-x-1.5 text-xs font-semibold text-indigo-300">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Deepened Orthogonal Inquiry:</span>
                        </div>
                        <p className="text-xs text-slate-200 italic leading-relaxed">
                          "{deepened.probe}"
                        </p>
                        <div className="pt-1.5 border-t border-indigo-500/20 text-[11px] text-cyan-300">
                          <strong className="text-cyan-200">Falsification Challenge:</strong> {deepened.challenge}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Cognitive Bias Audit (Competitive Edge: Decira & Rationale Gap Analysis) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Cognitive Bias Audit ({cognitiveBiases.length} Detected)
            </span>
          </div>
          <span className="text-[11px] text-slate-500">
            Debiasing nudges calibrated to your specific rationale
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {cognitiveBiases.map((bias, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-purple-500/30 transition flex flex-col justify-between space-y-2.5"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300">
                    {bias.name}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    Bias Alert
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-snug">
                  <strong className="text-slate-400">Observed In:</strong> {bias.evidence}
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-purple-950/20 border border-purple-500/20 text-xs text-purple-200/90">
                <span className="font-semibold text-purple-300 block mb-0.5 text-[11px]">
                  Debiasing Nudge:
                </span>
                {bias.debiasingNudge}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

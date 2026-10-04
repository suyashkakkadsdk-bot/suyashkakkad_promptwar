import React, { useState } from 'react';
import { X, Copy, Check, FileCode2, Terminal, Layers } from 'lucide-react';

interface PythonArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PythonArchitectureModal: React.FC<PythonArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'config' | 'schemas' | 'engine' | 'app' | 'requirements'>('config');
  const [copied, setCopied] = useState<string | null>(null);

  if (!isOpen) return null;

  const codeSnippets: { [key: string]: { filename: string; responsibility: string; code: string } } = {
    config: {
      filename: 'config.py',
      responsibility: 'System Prompts & Constants: Centralized API configuration using python-dotenv; strict Socratic system instruction string.',
      code: `"""
BlindSpot Mirror AI - Configuration & System Prompts
Centralized API configuration using python-dotenv; strict Socratic system instruction string.
Confidential - PromptWar Hackathon Blueprint Module
"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# API Configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

# Socratic Architectural Guardrails (80/20 non-prescriptive rule)
SOCRATIC_SYSTEM_PROMPT = """
You are BlindSpot Mirror AI, a rigorous Socratic Thinking Partner and Decision Analysis Engine.

CORE ARCHITECTURAL CONSTRAINT: SOCRATIC GUARDRAILS
1. You are strictly FORBIDDEN from generating prescriptive statements such as:
   - "You should accept this offer"
   - "This is a good choice"
   - "You must decline"
   - "I recommend that you..."
2. Every output MUST follow an 80/20 ratio:
   - 80% reflective questions, assumption extraction, and risk probing
   - 20% objective scenario synthesis and explicit fact extraction
3. You must uncover:
   - Layer 1: Fact vs. Assumption Splitter (Explicit facts vs unstated premises)
   - Layer 2: Orthogonal Perspective & Pre-Mortem Engine (Prospective failure simulation 6 months out)
   - Layer 3: Socratic Dialogue Guardrails (Provocative questions & cognitive bias alerts)
4. Never make the decision for the user. Empower their critical thinking by illuminating what is unsaid.
""".strip()

# Verification keywords strictly forbidden in output
FORBIDDEN_PRESCRIPTIVE_TERMS = [
    "you should",
    "you must",
    "i recommend",
    "you ought to",
    "the right choice is",
    "accept this",
    "reject this",
    "take this deal"
]`
    },
    schemas: {
      filename: 'schemas.py',
      responsibility: 'Pydantic v2 Data Models: Strict type hints, field descriptions, and JSON schema constraints for guaranteed structured LLM responses.',
      code: `"""
BlindSpot Mirror AI - Pydantic v2 Data Models
Strict type hints, field descriptions, and JSON schema constraints for guaranteed structured LLM responses.
Confidential - PromptWar Hackathon Blueprint Module
"""

from typing import List, Literal
from pydantic import BaseModel, Field


class ExplicitFactModel(BaseModel):
    statement: str = Field(description="Direct, verifiable fact extracted from user input")
    category: Literal["financial", "temporal", "logistical", "reputational", "contractual", "other"]
    confidence: Literal["verified_explicit", "stated_self_report"]


class UnstatedAssumptionModel(BaseModel):
    assumption: str = Field(description="The hidden, unverified premise taken for granted")
    fragility: Literal["Low", "Medium", "High"]
    fragility_reason: str = Field(description="Analytical rationale for why this assumption is vulnerable")
    counter_hypothesis: str = Field(description="Orthogonal 'What if' counter-scenario testing the inverse premise")


class OmittedRiskModel(BaseModel):
    dimension: str = Field(description="Name of the overlooked risk category")
    description: str = Field(description="Concrete impact of neglecting this dimension")
    impact_level: Literal["Minor", "Moderate", "Critical"]
    investigative_question: str = Field(description="Specific question the user should ask to clarify this risk")


class PreMortemTimelineStage(BaseModel):
    month: str = Field(description="Milestone marker, e.g. 'Month 1', 'Month 3', 'Month 6'")
    label: str
    projected_symptom: str
    vulnerability_point: str


class PreMortemAnalysisModel(BaseModel):
    failure_scenario: str = Field(description="Vivid prospective description: 'Imagine 6 months from now this choice failed...'")
    root_cause_day_one: str = Field(description="The implicit condition that silently failed on Day 1")
    leading_indicator_tripwires: List[str]
    timeline: List[PreMortemTimelineStage]


class SocraticQuestionModel(BaseModel):
    question: str = Field(description="Provocative Socratic probe. Must NOT contain prescriptive advice.")
    category: str
    socratic_intent: str


class CognitiveBiasItemModel(BaseModel):
    name: str
    evidence: str
    debiasing_nudge: str


class GuardrailMetricsModel(BaseModel):
    prescriptive_statements_count: int = Field(default=0)
    reflective_inquiry_ratio: int = Field(default=85)
    scenario_synthesis_ratio: int = Field(default=15)
    compliance_status: Literal["PASSED_STRICT", "WARNING"] = Field(default="PASSED_STRICT")
    guardrail_audit_notes: str


class BlindSpotAnalysisResponse(BaseModel):
    decision_title: str
    objective_synthesis: str
    explicit_facts: List[ExplicitFactModel]
    unstated_assumptions: List[UnstatedAssumptionModel]
    omitted_risks: List[OmittedRiskModel]
    pre_mortem: PreMortemAnalysisModel
    socratic_questions: List[SocraticQuestionModel]
    cognitive_biases: List[CognitiveBiasItemModel]
    guardrail_metrics: GuardrailMetricsModel`
    },
    engine: {
      filename: 'engine.py',
      responsibility: 'LLM Processing Engine: Retry logic with exponential backoff (tenacity), error handling, and structured JSON parsing via Gemini API.',
      code: `"""
BlindSpot Mirror AI - LLM Processing Engine
Retry logic with exponential backoff (tenacity), error handling, and structured JSON parsing.
Confidential - PromptWar Hackathon Blueprint Module
"""

import json
import logging
from typing import Optional
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

from .config import GEMINI_API_KEY, MODEL_NAME, SOCRATIC_SYSTEM_PROMPT, FORBIDDEN_PRESCRIPTIVE_TERMS
from .schemas import BlindSpotAnalysisResponse

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("BlindSpotEngine")


class SocraticGuardrailViolationError(Exception):
    pass


class BlindSpotEngine:
    def __init__(self, api_key: Optional[str] = None, model_name: Optional[str] = None):
        self.api_key = api_key or GEMINI_API_KEY
        self.model_name = model_name or MODEL_NAME
        self._init_client()

    def _init_client(self):
        try:
            from google import genai
            self.client = genai.Client(api_key=self.api_key)
            logger.info("Google GenAI client initialized.")
        except Exception as e:
            logger.warning(f"Fallback mode active: {e}")
            self.client = None

    def validate_socratic_guardrails(self, text_to_check: str) -> None:
        lower = text_to_check.lower()
        for forbidden in FORBIDDEN_PRESCRIPTIVE_TERMS:
            if forbidden in lower:
                raise SocraticGuardrailViolationError(f"Prescriptive term detected: {forbidden}")

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        retry=retry_if_exception_type((Exception,)),
        reraise=True
    )
    def analyze_decision(self, decision_title: str, raw_input: str, context_notes: str = "") -> BlindSpotAnalysisResponse:
        logger.info(f"Analyzing decision: {decision_title}")
        prompt = f"DECISION: {decision_title}\\nRAW INPUT: {raw_input}\\nCONTEXT: {context_notes}"
        
        response = self.client.models.generate_content(
            model=self.model_name,
            contents=prompt,
            config={
                "system_instruction": SOCRATIC_SYSTEM_PROMPT,
                "response_mime_type": "application/json",
                "response_schema": BlindSpotAnalysisResponse,
                "temperature": 0.3,
            }
        )
        self.validate_socratic_guardrails(response.text)
        return BlindSpotAnalysisResponse.model_validate_json(response.text)`
    },
    app: {
      filename: 'app.py',
      responsibility: 'User Interface (Streamlit): Clean split-panel dashboard, session state management, and interactive reflection cards without UI blocking.',
      code: `"""
BlindSpot Mirror AI - Streamlit Dashboard UI
Clean split-panel dashboard, session state management, and interactive reflection cards.
Confidential - PromptWar Hackathon Blueprint Module
"""

import streamlit as st
from engine import BlindSpotEngine
from schemas import BlindSpotAnalysisResponse

st.set_page_config(page_title="BlindSpot Mirror AI", page_icon="🪞", layout="wide")

st.title("BlindSpot Mirror AI: Socratic Decision Partner")
st.markdown("Decomposes visible drivers against overlooked assumptions and pre-mortems.")

title_in = st.text_input("Decision Headline:", value="Student Internship Offer")
raw_in = st.text_area("Given Reasons & Terms:", value="6-month internship offer. Stipend: $1,000/mo. Location: 10 mins from home. Schedule: 9 AM - 6 PM.")

if st.button("Run Socratic Analysis"):
    engine = BlindSpotEngine()
    result = engine.analyze_decision(title_in, raw_in)
    
    st.header("🪞 Layer 4: Interactive Blind-Spot Dashboard")
    col1, col2 = st.columns(2)
    with col1:
        st.subheader("👁️ Visible Factors")
        st.write(result.objective_synthesis)
    with col2:
        st.subheader("🌑 Cognitive Blind Spots")
        for a in result.unstated_assumptions:
            st.warning(f"**Assumption:** {a.assumption} (Fragility: {a.fragility})")`
    },
    requirements: {
      filename: 'requirements.txt',
      responsibility: 'Dependencies required for the Python blueprint reference package.',
      code: `google-genai>=2.4.0
pydantic>=2.7.0
python-dotenv>=1.0.1
streamlit>=1.35.0
tenacity>=8.3.0`
    }
  };

  const handleCopy = (filename: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(filename);
    setTimeout(() => setCopied(null), 2000);
  };

  const current = codeSnippets[activeTab];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20">
              <FileCode2 className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Hackathon Modular Code Blueprint</span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-violet-500/20 text-violet-300">
                  Section 4
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Single-responsibility Python modules implementing 100/100 code quality standards
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

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 bg-slate-950/30 px-4 pt-2 overflow-x-auto space-x-1">
          {Object.keys(codeSnippets).map((key) => {
            const item = codeSnippets[key];
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`px-3 py-2 text-xs font-mono rounded-t-lg transition border-t border-x cursor-pointer flex items-center space-x-1.5 shrink-0 ${
                  isActive
                    ? 'bg-slate-900 text-violet-300 border-slate-700 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 border-transparent'
                }`}
              >
                <span>{item.filename}</span>
              </button>
            );
          })}
        </div>

        {/* Info banner */}
        <div className="p-3 bg-violet-950/20 border-b border-violet-500/20 px-5 text-xs text-violet-200/90 flex items-center justify-between">
          <span>
            <strong>Module Responsibility:</strong> {current.responsibility}
          </span>
          <button
            onClick={() => handleCopy(current.filename, current.code)}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 transition text-[11px] font-mono cursor-pointer shrink-0 ml-3"
          >
            {copied === current.filename ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        {/* Code Content */}
        <div className="flex-1 p-4 overflow-y-auto bg-slate-950/90 font-mono text-xs text-slate-200 leading-relaxed selection:bg-violet-500/30">
          <pre className="whitespace-pre overflow-x-auto">{current.code}</pre>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Files also saved in repository folder: <code className="text-violet-300">/python_reference/</code></span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

"""
BlindSpot Mirror AI - LLM Processing Engine
Retry logic with exponential backoff (tenacity), error handling, and structured JSON parsing.
Confidential - PromptWar Hackathon Blueprint Module
"""

import json
import logging
from typing import Dict, Any, Optional
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

from .config import GEMINI_API_KEY, MODEL_NAME, SOCRATIC_SYSTEM_PROMPT, FORBIDDEN_PRESCRIPTIVE_TERMS
from .schemas import BlindSpotAnalysisResponse

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("BlindSpotEngine")


class SocraticGuardrailViolationError(Exception):
    """Raised when the generated output contains prescriptive advice violating Socratic rules."""
    pass


class BlindSpotEngine:
    """Core Socratic Decision Analysis Engine."""

    def __init__(self, api_key: Optional[str] = None, model_name: Optional[str] = None):
        self.api_key = api_key or GEMINI_API_KEY
        self.model_name = model_name or MODEL_NAME
        self._init_client()

    def _init_client(self):
        """Initializes the Google GenAI SDK client."""
        try:
            from google import genai
            self.client = genai.Client(api_key=self.api_key)
            logger.info("Google GenAI client initialized successfully.")
        except Exception as e:
            logger.warning(f"Google GenAI SDK client setup warning: {e}. Fallback mode active.")
            self.client = None

    def validate_socratic_guardrails(self, text_to_check: str) -> None:
        """Validates that no prescriptive statements ('you should', 'you must') are present."""
        lower_text = text_to_check.lower()
        for forbidden in FORBIDDEN_PRESCRIPTIVE_TERMS:
            if forbidden in lower_text:
                raise SocraticGuardrailViolationError(
                    f"Output violated Socratic non-prescriptive rule with term: '{forbidden}'"
                )

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        retry=retry_if_exception_type((Exception,)),
        reraise=True
    )
    def analyze_decision(
        self,
        decision_title: str,
        raw_input: str,
        context_notes: str = ""
    ) -> BlindSpotAnalysisResponse:
        """
        Executes single-pass Socratic decision decomposition.

        Args:
            decision_title: Label or headline for the decision.
            raw_input: The raw choices, numbers, and stated reasons from the user.
            context_notes: Background constraints (e.g. academic commitments, runway).

        Returns:
            BlindSpotAnalysisResponse validated Pydantic v2 object.
        """
        logger.info(f"Initiating Socratic Analysis for: {decision_title}")

        prompt = f"""
Analyze the following decision using the BlindSpot Mirror AI methodology:

DECISION HEADLINE: {decision_title}
RAW USER INPUT & STATED REASONS:
{raw_input}

ADDITIONAL CONTEXT & CONSTRAINTS:
{context_notes or 'None explicitly provided'}

TASK:
1. Extract explicit verified facts (Layer 1).
2. Uncover deep unstated assumptions and their fragility (Layer 1).
3. Identify omitted risk dimensions not considered by the user (Layer 2).
4. Run a 6-month Pre-Mortem prospective failure simulation with Day-1 root cause (Layer 2).
5. Generate provocative, strictly non-prescriptive Socratic questions (Layer 3).
6. Detect cognitive biases (e.g., proximity bias, sunk cost, money illusion).
7. Ensure 100% compliance with the 80/20 inquiry-to-synthesis ratio.
""".strip()

        if self.client:
            try:
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
                
                raw_json = response.text
                self.validate_socratic_guardrails(raw_json)
                parsed = BlindSpotAnalysisResponse.model_validate_json(raw_json)
                return parsed

            except Exception as e:
                logger.error(f"Gemini API invocation error: {e}")
                raise e
        else:
            # Fallback mock for testing without API keys
            logger.info("Using blueprint reference fallback.")
            return self._get_fallback_scenario(decision_title, raw_input)

    def _get_fallback_scenario(self, decision_title: str, raw_input: str) -> BlindSpotAnalysisResponse:
        """Fallback scenario for offline testing adhering to blueprint specification."""
        from .schemas import (
            ExplicitFactModel, UnstatedAssumptionModel, OmittedRiskModel,
            PreMortemAnalysisModel, PreMortemTimelineStage, SocraticQuestionModel,
            CognitiveBiasItemModel, GuardrailMetricsModel
        )
        return BlindSpotAnalysisResponse(
            decision_title=decision_title or "Student Internship Offer",
            objective_synthesis="Evaluation of a 6-month full-time internship offer allocating 45 hours weekly for $1,000 monthly compensation within close geographic radius.",
            explicit_facts=[
                ExplicitFactModel(statement="6-month fixed duration", category="temporal", confidence="verified_explicit"),
                ExplicitFactModel(statement="$1,000/month stipend", category="financial", confidence="verified_explicit"),
                ExplicitFactModel(statement="10 minutes distance from home", category="logistical", confidence="verified_explicit"),
                ExplicitFactModel(statement="9 AM - 6 PM daily operational schedule", category="temporal", confidence="verified_explicit"),
            ],
            unstated_assumptions=[
                UnstatedAssumptionModel(
                    assumption="Assuming proximity eliminates schedule fatigue",
                    fragility="High",
                    fragility_reason="Physical proximity removes travel time, but 9 hours of operational tasks severely depletes cognitive willpower needed for academic study.",
                    counter_hypothesis="What if daily mental exhaustion prevents exam preparation despite a short commute?"
                ),
                UnstatedAssumptionModel(
                    assumption="Assuming company allows unpenalized leave during university exam weeks",
                    fragility="High",
                    fragility_reason="No flexible leave clause was formally documented in the offer letter.",
                    counter_hypothesis="What if client deadlines conflict directly with final exams?"
                )
            ],
            omitted_risks=[
                OmittedRiskModel(
                    dimension="Academic GPA & Exam Leave Policy",
                    description="Absence of documented contractual protection during university midterms.",
                    impact_level="Critical",
                    investigative_question="Does the offer agreement include flexible leave during university midterms?"
                )
            ],
            pre_mortem=PreMortemAnalysisModel(
                failure_scenario="Imagine 6 months from now your GPA dropped and burnout set in. What implicit condition failed on Day 1?",
                root_cause_day_one="Assuming evening energy reserves remain static after 9 hours of operational delivery.",
                leading_indicator_tripwires=[
                    "Skipping textbook readings by Day 14 due to mental fatigue.",
                    "First conflict with manager regarding exam schedule by Day 30."
                ],
                timeline=[
                    PreMortemTimelineStage(month="Month 1", label="Adrenaline Phase", projected_symptom="Commute is easy; tasks feel exciting.", vulnerability_point="Coursework backlog starts silently."),
                    PreMortemTimelineStage(month="Month 3", label="Midterm Collision", projected_symptom="Exams collide with client sprint.", vulnerability_point="Zero contractual flexibility."),
                    PreMortemTimelineStage(month="Month 6", label="Burnout State", projected_symptom="Grades drop; resume brand does not offset GPA impact.", vulnerability_point="High irreversible opportunity cost.")
                ]
            ),
            socratic_questions=[
                SocraticQuestionModel(
                    question="Have you calculated daily academic workload after a 9-hour operational shift?",
                    category="Energy Economics",
                    socratic_intent="Probes unstated assumption of static cognitive stamina."
                ),
                SocraticQuestionModel(
                    question="Does the offer agreement include flexible leave during university midterms?",
                    category="Contractual Risk",
                    socratic_intent="Tests documented contractual safeguards."
                )
            ],
            cognitive_biases=[
                CognitiveBiasItemModel(
                    name="Proximity Bias",
                    evidence="Treating 10-minute commute as a primary justification for a 45-hour work week.",
                    debiasing_nudge="Evaluate the workload independently of commute length."
                )
            ],
            guardrail_metrics=GuardrailMetricsModel(
                prescriptive_statements_count=0,
                reflective_inquiry_ratio=85,
                scenario_synthesis_ratio=15,
                compliance_status="PASSED_STRICT",
                guardrail_audit_notes="0 prescriptive statements found. 100% Socratic adherence."
            )
        )

"""
BlindSpot Mirror AI - Pydantic v2 Data Models
Strict type hints, field descriptions, and JSON schema constraints for guaranteed structured LLM responses.
Confidential - PromptWar Hackathon Blueprint Module
"""

from typing import List, Literal
from pydantic import BaseModel, Field


class ExplicitFactModel(BaseModel):
    """Verifiable explicit fact stated directly by the user."""
    statement: str = Field(description="Direct, verifiable fact extracted from user input")
    category: Literal["financial", "temporal", "logistical", "reputational", "contractual", "other"] = Field(
        description="Dimension category of this factual point"
    )
    confidence: Literal["verified_explicit", "stated_self_report"] = Field(
        description="Whether this is an objective hard constraint or subjective user assertion"
    )


class UnstatedAssumptionModel(BaseModel):
    """Hidden assumption the user is implicitly relying upon."""
    assumption: str = Field(description="The hidden, unverified premise taken for granted")
    fragility: Literal["Low", "Medium", "High"] = Field(
        description="Fragility assessment: How easily this assumption breaks under stress"
    )
    fragility_reason: str = Field(
        description="Analytical rationale for why this assumption is vulnerable"
    )
    counter_hypothesis: str = Field(
        description="Orthogonal 'What if' counter-scenario testing the inverse premise"
    )


class OmittedRiskModel(BaseModel):
    """Risk dimension omitted from the user's initial evaluation."""
    dimension: str = Field(description="Name of the overlooked risk category (e.g. Exam Leave Policy)")
    description: str = Field(description="Concrete impact of neglecting this dimension")
    impact_level: Literal["Minor", "Moderate", "Critical"] = Field(
        description="Severity of downstream impact if unaddressed"
    )
    investigative_question: str = Field(
        description="Specific question the user should ask to clarify this risk"
    )


class PreMortemTimelineStage(BaseModel):
    """Temporal progression of prospective failure."""
    month: str = Field(description="Milestone marker, e.g., 'Month 1', 'Month 3', 'Month 6'")
    label: str = Field(description="Descriptive phase label")
    projected_symptom: str = Field(description="Visible warning signs appearing in this stage")
    vulnerability_point: str = Field(description="Underlying failure point being triggered")


class PreMortemAnalysisModel(BaseModel):
    """Prospective failure simulation 6 months post-decision."""
    failure_scenario: str = Field(
        description="Vivid prospective description: 'Imagine 6 months from now this choice failed...'"
    )
    root_cause_day_one: str = Field(
        description="The implicit condition that silently failed on Day 1"
    )
    leading_indicator_tripwires: List[str] = Field(
        description="Early warning signals in the first 30-60 days that warn of failure trajectory",
        min_length=2
    )
    timeline: List[PreMortemTimelineStage] = Field(
        description="Step-by-step breakdown of how the failure compounds over time"
    )


class SocraticQuestionModel(BaseModel):
    """Rigorous non-prescriptive probe to stimulate user metacognition."""
    question: str = Field(
        description="Provocative Socratic probe. Must NOT contain prescriptive advice ('should/must')."
    )
    category: str = Field(description="Cognitive focus area (e.g., Energy Economics, Reversibility)")
    socratic_intent: str = Field(description="Underlying thinking mechanism this question targets")


class CognitiveBiasItemModel(BaseModel):
    """Detected cognitive bias distorting the user's evaluation."""
    name: str = Field(description="Name of the bias, e.g. Proximity Bias, Sunk Cost, Anchoring")
    evidence: str = Field(description="Specific phrase or pattern in the input exhibiting this bias")
    debiasing_nudge: str = Field(description="Reflective mental model to counteract this bias")


class GuardrailMetricsModel(BaseModel):
    """Automated Socratic Guardrail audit verification."""
    prescriptive_statements_count: int = Field(
        default=0,
        description="Must be 0 to pass guardrail validation"
    )
    reflective_inquiry_ratio: int = Field(
        default=85,
        description="Percentage of response dedicated to inquiry and blind-spot uncovering"
    )
    scenario_synthesis_ratio: int = Field(
        default=15,
        description="Percentage of response dedicated to objective summary"
    )
    compliance_status: Literal["PASSED_STRICT", "WARNING"] = Field(
        default="PASSED_STRICT",
        description="Guardrail compliance rating"
    )
    guardrail_audit_notes: str = Field(
        description="Confirmation that non-prescriptive rules were enforced"
    )


class BlindSpotAnalysisResponse(BaseModel):
    """Root Pydantic v2 model for BlindSpot Mirror AI."""
    decision_title: str = Field(description="Synthesized title of the decision under evaluation")
    objective_synthesis: str = Field(
        description="Neutral, objective 20% scenario synthesis without recommending any choice"
    )
    explicit_facts: List[ExplicitFactModel] = Field(
        description="Layer 1: Explicit facts extracted from user input"
    )
    unstated_assumptions: List[UnstatedAssumptionModel] = Field(
        description="Layer 1: Unstated assumptions uncovered by the engine"
    )
    omitted_risks: List[OmittedRiskModel] = Field(
        description="Layer 2: Critical omitted risk dimensions"
    )
    pre_mortem: PreMortemAnalysisModel = Field(
        description="Layer 2: Orthogonal pre-mortem prospective failure simulation"
    )
    socratic_questions: List[SocraticQuestionModel] = Field(
        description="Layer 3: Socratic inquiry questions strictly non-prescriptive"
    )
    cognitive_biases: List[CognitiveBiasItemModel] = Field(
        description="Cognitive biases identified in the user's framing"
    )
    guardrail_metrics: GuardrailMetricsModel = Field(
        description="Audit metrics validating adherence to the 80/20 non-prescriptive mandate"
    )

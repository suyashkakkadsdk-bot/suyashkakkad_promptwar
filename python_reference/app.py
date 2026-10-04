"""
BlindSpot Mirror AI - Streamlit Dashboard UI
Clean split-panel dashboard, session state management, and interactive reflection cards.
Confidential - PromptWar Hackathon Blueprint Module
"""

import streamlit as st
from engine import BlindSpotEngine
from schemas import BlindSpotAnalysisResponse

st.set_page_config(
    page_title="BlindSpot Mirror AI",
    page_icon="🪞",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Styling
st.markdown("""
<style>
    .reportview-container { background: #0f172a; color: #f8fafc; }
    .stMetric { background: #1e293b; padding: 12px; border-radius: 8px; border: 1px solid #334155; }
    .card-mirror { background: #1e293b; padding: 18px; border-radius: 10px; border-left: 4px solid #6366f1; margin-bottom: 12px; }
    .assumption-box { background: rgba(245, 158, 11, 0.08); border-left: 4px solid #f59e0b; padding: 12px; border-radius: 6px; margin: 8px 0; }
    .fact-box { background: rgba(16, 185, 129, 0.08); border-left: 4px solid #10b981; padding: 12px; border-radius: 6px; margin: 8px 0; }
    .risk-box { background: rgba(239, 68, 68, 0.08); border-left: 4px solid #ef4444; padding: 12px; border-radius: 6px; margin: 8px 0; }
</style>
""", unsafe_allow_html=True)

# Initialize Session State
if "analysis_result" not in st.session_state:
    st.session_state.analysis_result = None

# Sidebar Controls & Presets
with st.sidebar:
    st.title("🪞 BlindSpot Mirror AI")
    st.caption("Socratic Decision Analysis Partner")
    st.markdown("---")
    
    st.subheader("📚 Preset Blueprints")
    preset_choice = st.selectbox(
        "Load Blueprint Scenario:",
        ["Student Internship Offer (Blueprint Reference)", "Startup B2B Custom Pivot", "Custom Decision"]
    )
    
    if preset_choice == "Student Internship Offer (Blueprint Reference)":
        default_title = "Student Internship Offer"
        default_input = "6-month internship offer. Stipend: $1,000/mo. Location: 10 mins from home. Schedule: 9 AM – 6 PM. Given Reasons: Good money, close location, resume brand name."
        default_context = "Student currently enrolled full-time in university with rigorous coursework."
    elif preset_choice == "Startup B2B Custom Pivot":
        default_title = "Enterprise Custom Contract Pivot"
        default_input = "Enterprise client offered $50,000 upfront for custom features, on-prem deployment, and dedicated Slack support. Current product is a $49/mo developer tool."
        default_context = "Two-person team with limited enterprise SLA support capacity."
    else:
        default_title = ""
        default_input = ""
        default_context = ""

    st.markdown("---")
    st.markdown("""
    **Socratic Guardrail Status:**
    - Non-Prescriptive Ratio: **80/20**
    - Advice Prohibition: **Active**
    """)

# Main Header
st.title("BlindSpot Mirror AI: Socratic Decision Partner")
st.markdown(
    "Human decision-making heavily over-weights immediate, visible attributes while remaining blind to unstated assumptions. "
    "**The AI will illuminate your blind spots, but strictly never make the decision for you.**"
)

# Input Section
col_in1, col_in2 = st.columns([2, 1])
with col_in1:
    title_in = st.text_input("Decision Headline:", value=default_title, placeholder="e.g. Evaluating 6-Month Internship")
    raw_in = st.text_area("What are the stated facts & your given reasons?", value=default_input, height=110)
with col_in2:
    context_in = st.text_area("Constraints / Secondary Context:", value=default_context, height=180, placeholder="e.g. Academics, personal finance, team size")

if st.button("🔍 Generate Socratic Mirror Analysis", type="primary", use_container_width=True):
    if not raw_in.strip():
        st.error("Please provide decision details before analyzing.")
    else:
        with st.spinner("Decomposing cognitive dimensions and running pre-mortem..."):
            engine = BlindSpotEngine()
            result = engine.analyze_decision(title_in, raw_in, context_in)
            st.session_state.analysis_result = result

# Output Dashboard
res: BlindSpotAnalysisResponse = st.session_state.analysis_result

if res:
    st.markdown("---")
    
    # Guardrail banner
    st.success(
        f"🛡️ **Socratic Guardrails Audited**: {res.guardrail_metrics.compliance_status} | "
        f"Reflective Inquiry: {res.guardrail_metrics.reflective_inquiry_ratio}% | "
        f"Prescriptive Statements: {res.guardrail_metrics.prescriptive_statements_count}"
    )

    # Layer 4: Interactive Blind-Spot Dashboard Split View
    st.header("🪞 Layer 4: Interactive Blind-Spot Dashboard")
    col_left, col_right = st.columns(2)

    with col_left:
        st.subheader("👁️ Visible Factors (What You Stated)")
        st.info(f"**Objective Synthesis:** {res.objective_synthesis}")
        st.markdown("#### Explicit Verified Facts:")
        for fact in res.explicit_facts:
            st.markdown(f"<div class='fact-box'><b>[{fact.category.upper()}]</b> {fact.statement}</div>", unsafe_allow_html=True)

    with col_right:
        st.subheader("🌑 Cognitive Blind Spots (What Was Omitted)")
        st.markdown("#### Unstated Implicit Assumptions:")
        for assump in res.unstated_assumptions:
            st.markdown(
                f"<div class='assumption-box'>"
                f"<b>Assumption:</b> {assump.assumption}<br>"
                f"<small><b>Fragility:</b> {assump.fragility} — {assump.fragility_reason}</small><br>"
                f"<i><b>Counter-Hypothesis:</b> {assump.counter_hypothesis}</i>"
                f"</div>",
                unsafe_allow_html=True
            )

    st.markdown("---")

    # Layer 2: Pre-Mortem Prospective Failure Engine
    st.header("⚠️ Layer 2: Pre-Mortem Failure Simulation")
    st.warning(f"**Prospective Autopsy:** {res.pre_mortem.failure_scenario}")
    st.error(f"**Day-1 Root Cause Condition:** {res.pre_mortem.root_cause_day_one}")

    st.subheader("Early Warning Tripwires (First 30–60 Days):")
    for tripwire in res.pre_mortem.leading_indicator_tripwires:
        st.markdown(f"- 🚩 {tripwire}")

    # Layer 3: Socratic Dialogue & Reflection Lab
    st.header("❓ Layer 3: Socratic Dialogue & Cognitive Probes")
    for idx, q in enumerate(res.socratic_questions, 1):
        with st.expander(f"Probe #{idx}: {q.question}", expanded=True):
            st.caption(f"Category: {q.category} | Socratic Intent: {q.socratic_intent}")
            st.text_area(f"Your Reflection for Probe #{idx}:", key=f"refl_{idx}", placeholder="Type your thoughts here...")

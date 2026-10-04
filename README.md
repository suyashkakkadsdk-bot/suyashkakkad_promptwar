# BlindSpot Mirror AI
> **System Blueprint & Modular Production Architecture for Socratic Decision Analysis**  
> *Confidential — PromptWar Hackathon Blueprint*

BlindSpot Mirror AI is a Socratic Thinking Partner designed to counteract human cognitive visibility bias. When evaluating choices (career moves, financial investments, academic offers, startup pivots), individuals heavily over-weight immediate, visible attributes—such as salary, location, or job title—while remaining completely blind to unstated assumptions, secondary risks, and internal logical contradictions.

---

## Core Architectural Constraint: Socratic Guardrails
The AI system is strictly forbidden from generating statements such as:
- *"You should accept this offer"*
- *"This is a good choice"*
- *"I recommend that you..."*

Every output adheres to an **80/20 ratio**: **80% reflective questions & assumption extraction**, **20% objective scenario synthesis**. Crucially, the AI never makes the decision for the user.

---

## 4-Layer Unified System Architecture

1. **Layer 1: Fact vs. Assumption Splitter**  
   Parses raw user inputs, categorizing explicit facts vs. implicit unverified assumptions and scoring assumption fragility.

2. **Layer 2: Orthogonal Perspective & Pre-Mortem Engine**  
   Runs prospective failure simulations (*"Imagine 6 months from now this choice failed—what was the root cause?"*), pinpoints the Day-1 silent failure condition, and defines 3 leading indicator tripwires in days 14–60.

3. **Layer 3: Socratic Dialogue Guardrails**  
   Enforces strict non-prescriptive rules via prompt constraints and JSON schema validation, accompanied by tailored cognitive bias alerts and debiasing nudges.

4. **Layer 4: Interactive Blind-Spot Dashboard UI**  
   Presents a side-by-side visual mirror contrasting visible factors against overlooked dimensions, with assumption stress-testing and deep-inquiry probes.

---

## Repository Structure

```text
├── index.html                  # Web application entry point
├── metadata.json               # AI Studio applet metadata & capabilities
├── package.json                # Node dependencies & full-stack scripts
├── server.ts                   # Express server with Google GenAI SDK & Vite dev middleware
├── src/
│   ├── App.tsx                 # Main interactive prototype dashboard
│   ├── index.css               # Tailwind CSS & custom styling
│   ├── main.tsx                # React DOM root
│   ├── types/
│   │   └── decision.ts         # TypeScript data contracts matching Pydantic v2 schemas
│   ├── data/
│   │   └── presetScenarios.ts  # Blueprint case studies (e.g. Student Internship Offer)
│   └── components/
│       ├── Navbar.tsx          # Brand, guardrail status & action modals
│       ├── PresetSelector.tsx  # Quick-load blueprint scenarios
│       ├── DecisionInputForm.tsx # Raw input parser matrix
│       ├── ArchitecturePillars.tsx # 4-layer architecture & competitive gap analysis
│       ├── BlindSpotMirror.tsx # Layer 4 & Layer 1: Split-screen visual mirror & stress tester
│       ├── PreMortemEngine.tsx # Layer 2: Pre-mortem simulation & timeline
│       ├── SocraticLab.tsx     # Layer 3: Socratic inquiry & cognitive bias lab
│       ├── PythonArchitectureModal.tsx # Blueprint Section 4 code viewer
│       └── ExportModal.tsx     # Socratic decision dossier exporter
└── python_reference/           # Hackathon Blueprint Python Modules (Section 4)
    ├── config.py               # System prompts, constants, & guardrail rules
    ├── schemas.py              # Pydantic v2 data models with strict validation
    ├── engine.py               # Google GenAI engine with tenacity retry backoff
    ├── app.py                  # Streamlit split-panel dashboard UI
    └── requirements.txt        # Python dependencies
```

---

## Competitive Advantage

| Existing Solution | Core Strength | Critical Gap / Limitation | BlindSpot AI Advantage |
| :--- | :--- | :--- | :--- |
| **Decira.ai** | Cognitive bias detection (confirmation, sunk cost) | Rigid workflow with low prompt customization | Dynamic Socratic probes tailored to specific user scenarios |
| **Rationale (Jina AI)** | Fast SWOT, Pros/Cons & cost-benefit matrices | Analytical only; summarizes given data without discovering missing data | Automated Assumption Extractor highlights unstated premises |
| **MIT AI Blindspot** | Comprehensive audit framework for proxy variables | High manual friction; paper/card-based process | Single-pass LLM structured extraction with zero user friction |
| **Princeton SocraticAI** | Deep multi-agent Socratic dialogue loops | High latency and prohibitive API cost for real-time apps | Single-pass JSON schema output delivering instant responses |

---

## Quickstart

### 1. Interactive Web Application (React + TypeScript + Express)
```bash
# Install dependencies
npm install

# Run full-stack dev server (port 3000)
npm run dev

# Build for production
npm run build
```

### 2. Python Blueprint Reference (Streamlit)
```bash
cd python_reference
pip install -r requirements.txt
streamlit run app.py
```

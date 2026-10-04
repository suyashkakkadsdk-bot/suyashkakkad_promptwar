import { PresetScenario, DecisionAnalysisResult } from '../types/decision';

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'student-internship',
    title: 'Student Internship Offer',
    tag: 'Hackathon Blueprint Reference',
    description: '6-month full-time internship offer at a prominent tech agency near campus.',
    rawInput: '6-month internship offer. Stipend: $1,000/mo. Location: 10 mins from home. Schedule: 9 AM – 6 PM. Given Reasons: Good money, close location, resume brand name.',
    contextNotes: 'Student currently in Year 3 with heavy coursework and upcoming midterm exams.'
  },
  {
    id: 'startup-pivot',
    title: 'Enterprise Custom Pivot',
    tag: 'Founder Strategy',
    description: 'Pivoting from $49/mo PLG developer tool to bespoke $50,000 enterprise contracts.',
    rawInput: 'Single enterprise customer offered $50k upfront for custom features, dedicated Slack, and on-prem deployment. Current ARR is $18k across 300 hobbyists. Reasoning: Immediate cash runway, high enterprise validation, validates we can charge real money.',
    contextNotes: 'Team of 2 founders, neither has enterprise SLA compliance experience.'
  },
  {
    id: 'suburb-relocation',
    title: 'Fixer-Upper Home Purchase',
    tag: 'Personal Finance & Life',
    description: 'Buying a larger home in outer suburbs vs renewing lease in city center.',
    rawInput: 'Offered 2,800 sq ft house with yard for 30% less per sq ft than city condo. Location: 45 min highway commute. Reasoning: More room for home office, builds equity, quieter neighborhood.',
    contextNotes: 'Currently relies on walking to grocery and social circles; partner works in city core.'
  },
  {
    id: 'series-b-leap',
    title: 'Senior Leadership Leap',
    tag: 'Career Move',
    description: 'Leaving comfortable Fortune 500 Senior Engineer role for VP Engineering at fast Series B.',
    rawInput: 'Offered VP Engineering at 40-person Series B startup. 40% salary hike + 0.8% equity grant. Reasoning: Career acceleration, executive title, rapid wealth creation if exit happens.',
    contextNotes: 'Company has 11 months runway remaining and high executive turnover.'
  }
];

export const DEFAULT_ANALYSIS: DecisionAnalysisResult = {
  decisionTitle: 'Student Internship Offer Evaluation',
  rawInput: '6-month internship offer. Stipend: $1,000/mo. Location: 10 mins from home. Schedule: 9 AM – 6 PM. Given Reasons: Good money, close location, resume brand name.',
  timestamp: new Date().toISOString(),
  objectiveSynthesis: 'The candidate is weighing a structured 6-month commitment requiring 45+ operational hours per week against a fixed $1,000 monthly compensation and localized proximity. The stated rationale indexes heavily on convenience, short-term liquidity, and resume signaling, setting aside academic synchronization constraints.',
  explicitFacts: [
    {
      id: 'fact-1',
      statement: 'Duration is strictly fixed at 6 months',
      category: 'temporal',
      confidence: 'verified_explicit'
    },
    {
      id: 'fact-2',
      statement: 'Stipend compensation is $1,000 per month',
      category: 'financial',
      confidence: 'verified_explicit'
    },
    {
      id: 'fact-3',
      statement: 'Physical commute distance is 10 minutes from home',
      category: 'logistical',
      confidence: 'verified_explicit'
    },
    {
      id: 'fact-4',
      statement: 'Operational daily schedule is 9:00 AM to 6:00 PM (9 hours/day)',
      category: 'temporal',
      confidence: 'verified_explicit'
    },
    {
      id: 'fact-5',
      statement: 'User values brand recognition for future resume credibility',
      category: 'reputational',
      confidence: 'stated_self_report'
    }
  ],
  unstatedAssumptions: [
    {
      id: 'assump-1',
      assumption: 'Proximity eliminates schedule fatigue',
      fragility: 'High',
      fragilityReason: 'A 10-minute commute removes transit stress, but does not buffer against cognitive depletion from 9 consecutive hours of operational execution before academic study.',
      counterHypothesis: 'What if cumulative mental fatigue from full-time tasks impairs evening academic performance regardless of travel duration?',
      status: 'unverified',
      userCertainty: 7
    },
    {
      id: 'assump-2',
      assumption: 'The employer allows flexible time off during university midterms and finals',
      fragility: 'High',
      fragilityReason: 'No explicit leave or flexibility clause was documented in the offer terms.',
      counterHypothesis: 'What if peak project delivery milestones at the agency coincide exactly with semester examination deadlines?',
      status: 'unverified',
      userCertainty: 4
    },
    {
      id: 'assump-3',
      assumption: 'The resume brand name guarantees superior postgraduate conversion over high GPA & independent research',
      fragility: 'Medium',
      fragilityReason: 'Prestigious brand signals only hold value if core academic accreditation remains in good standing and meaningful engineering ownership occurred.',
      counterHypothesis: 'What if the role consists of routine operational maintenance with negligible mentorship or portfolio artifacts?',
      status: 'unverified',
      userCertainty: 6
    },
    {
      id: 'assump-4',
      assumption: 'Daily energy reserves will remain static over the entire 180-day duration',
      fragility: 'Medium',
      fragilityReason: 'Fails to account for non-linear exhaustion cycles, illness, or midterm study surges.',
      counterHypothesis: 'What if week 8 energy levels drop to 60% of week 1 motivation?',
      status: 'unverified',
      userCertainty: 5
    }
  ],
  omittedRisks: [
    {
      id: 'risk-1',
      dimension: 'Academic Standing & Exam Leave Policy',
      description: 'Absence of an explicit contractual accommodation for mandatory coursework, laboratory hours, and midterm examination preparation.',
      impactLevel: 'Critical',
      investigativeQuestion: 'Does the offer agreement contain an unpenalized examination leave clause signed by management?'
    },
    {
      id: 'risk-2',
      dimension: 'Effective Hourly Compensation Distortion',
      description: 'At 45 scheduled hours/week (~195 hours/month), a $1,000 stipend represents an effective rate of ~$5.12/hour before taxes and work-related expenses.',
      impactLevel: 'Moderate',
      investigativeQuestion: 'Does this effective hourly return justify displacing potential high-leverage skill acquisition or scholarship opportunities?'
    },
    {
      id: 'risk-3',
      dimension: 'Post-Internship Conversion & Return Offer Reality',
      description: 'Unstated conversion percentage: Does this firm systematically convert interns into full-time junior hires, or rely on recurring cheap rotational labor?',
      impactLevel: 'Critical',
      investigativeQuestion: 'What percentage of the previous cohort received formal full-time offers with market compensation?'
    }
  ],
  preMortem: {
    failureScenario: 'Imagine 6 months from now: your semester GPA dropped severely, burnout set in by week 10, and you ended the internship with no usable code portfolio or return offer.',
    rootCauseDayOne: 'Implicit condition that failed on Day 1: Assuming that working 9-to-6 leaves sufficient cognitive headroom for rigorous evening academic mastery.',
    leadingIndicatorTripwires: [
      'By Day 14: Skipping evening textbook readings or delaying assignments until Sunday midnight due to operational lethargy.',
      'By Day 30: First management friction when requesting half-day absence for an unexpected quiz or campus project review.',
      'By Day 60: Realizing 80% of daily assignments are administrative repetitive tickets with no senior engineering mentorship.'
    ],
    timeline: [
      {
        month: 'Month 1',
        label: 'Adrenaline & Novelty Phase',
        projectedSymptom: 'Commute feels trivial; initial stipend deposit produces short-term psychological satisfaction.',
        vulnerabilityPoint: 'Academic backlog starts accumulating invisibly without alarming the student.'
      },
      {
        month: 'Month 3',
        label: 'Midterm Collision Point',
        projectedSymptom: 'Agency client deadlines peak simultaneously with university exam week.',
        vulnerabilityPoint: 'Zero contractual buffer: student forced to choose between displeasing boss or tanking grades.'
      },
      {
        month: 'Month 6',
        label: 'Post-Mortem Exhaustion',
        projectedSymptom: 'Internship concludes; GPA penalty is permanent, while resume brand does not explain lackluster grades.',
        vulnerabilityPoint: 'High sunk time cost for low net financial and academic yield.'
      }
    ]
  },
  socraticQuestions: [
    {
      id: 'soc-1',
      question: 'Have you calculated your daily academic workload after completing a 9-hour operational shift at the office?',
      category: 'Energy & Cognitive Economics',
      socraticIntent: 'Probes the unstated premise that physical proximity equals cognitive vitality.'
    },
    {
      id: 'soc-2',
      question: 'Does the offer agreement include documented, flexible leave during university midterms and laboratory weeks?',
      category: 'Contractual & Academic Risk',
      socraticIntent: 'Tests whether structural academic protections exist or if the student relies on informal goodwill.'
    },
    {
      id: 'soc-3',
      question: 'If the brand name was completely removed from this offer, does the actual day-to-day work still advance your primary technical ambitions?',
      category: 'Brand vs Substance Decoupling',
      socraticIntent: 'Separates social signaling/prestige bias from genuine skill accumulation.'
    },
    {
      id: 'soc-4',
      question: 'What explicit milestone must occur by Day 45 for you to know this decision was sound, and what is your predetermined exit trigger if that milestone is missed?',
      category: 'Decision Reversibility & Tripwires',
      socraticIntent: 'Establishes objective boundary conditions rather than drifting on inertia.'
    }
  ],
  cognitiveBiases: [
    {
      name: 'Proximity Bias',
      evidence: 'Overweighting the 10-minute commute as a primary justification while underestimating daily cognitive fatigue.',
      debiasingNudge: 'Evaluate the schedule as if it were remote: does 9 hours of screen work leave enough study capacity?'
    },
    {
      name: 'Salience & Prestige Bias',
      evidence: 'Citing "resume brand name" without verifying team culture or actual project scope.',
      debiasingNudge: 'Ask alumni what specific responsibilities an intern on this specific team executes.'
    },
    {
      name: 'Present Bias / Money Illusion',
      evidence: 'Viewing $1,000/mo as "good money" without computing the ~$5/hr effective rate against future GPA leverage.',
      debiasingNudge: 'Compare the lifetime earnings difference between a top-tier GPA/skills vs $6,000 cash today.'
    }
  ],
  guardrailMetrics: {
    prescriptiveStatementsCount: 0,
    reflectiveInquiryRatio: 84,
    scenarioSynthesisRatio: 16,
    complianceStatus: 'PASSED_STRICT',
    guardrailAuditNotes: 'Audited against 0 prescriptive keywords ("should", "must", "recommend", "choose"). Socratic ratio 84/16 complies with 80/20 architectural mandate.'
  }
};

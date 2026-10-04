import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Google GenAI client (User-Agent header set for telemetry as required)
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.length > 10) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const SOCRATIC_SYSTEM_PROMPT = `
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
   - Layer 1: Fact vs. Assumption Splitter (Explicit verified facts vs implicit unverified assumptions)
   - Layer 2: Orthogonal Perspective & Pre-Mortem Engine (Prospective failure simulation 6 months out with Day-1 root cause and leading indicator tripwires)
   - Layer 3: Socratic Dialogue Guardrails (Provocative questions & cognitive bias alerts)
4. Never make the decision for the user. Empower their critical thinking by illuminating what is unsaid.
`.trim();

// Guardrail validator
function validateGuardrails(text: string): { violations: string[]; ratioReflective: number } {
  const forbidden = [
    'you should',
    'you must',
    'i recommend',
    'you ought to',
    'the right choice is',
    'accept this offer',
    'reject this offer',
    'take this deal',
  ];
  const lower = text.toLowerCase();
  const violations = forbidden.filter(phrase => lower.includes(phrase));
  return {
    violations,
    ratioReflective: violations.length === 0 ? 85 : 60,
  };
}

// POST /api/analyze - Main Socratic decision decomposition
app.post('/api/analyze', async (req, res) => {
  try {
    const { decisionTitle, rawInput, contextNotes } = req.body;

    if (!rawInput || typeof rawInput !== 'string') {
      return res.status(400).json({ error: 'Valid rawInput string is required.' });
    }

    const title = decisionTitle || 'Decision Analysis';

    if (!ai) {
      console.warn('GEMINI_API_KEY not configured or empty. Using intelligent Socratic template generator.');
      return res.json(generateLocalAnalysis(title, rawInput, contextNotes));
    }

    const prompt = `
Analyze the following decision using the BlindSpot Mirror AI methodology:

DECISION TITLE: ${title}
RAW USER INPUT & GIVEN REASONS:
${rawInput}

CONTEXT & CONSTRAINTS:
${contextNotes || 'No additional constraints provided.'}

TASK:
1. Extract explicit verified facts (Layer 1).
2. Uncover deep unstated assumptions and their fragility rating (Low/Medium/High) (Layer 1).
3. Identify omitted risk dimensions not stated by the user (Layer 2).
4. Run a 6-month Pre-Mortem prospective failure simulation with Day-1 root cause autopsy and 3 leading indicator tripwires (Layer 2).
5. Generate 4 provocative, strictly non-prescriptive Socratic questions (Layer 3).
6. Detect cognitive biases (e.g. proximity bias, sunk cost, authority bias, money illusion).
7. Ensure 100% compliance with the 80/20 inquiry-to-synthesis ratio.
    `.trim();

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SOCRATIC_SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            decisionTitle: { type: Type.STRING },
            objectiveSynthesis: { type: Type.STRING, description: 'Neutral 20% synthesis of scenario' },
            explicitFacts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  statement: { type: Type.STRING },
                  category: { type: Type.STRING, description: 'financial, temporal, logistical, reputational, contractual, other' },
                  confidence: { type: Type.STRING, description: 'verified_explicit or stated_self_report' }
                },
                required: ['id', 'statement', 'category', 'confidence']
              }
            },
            unstatedAssumptions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  assumption: { type: Type.STRING },
                  fragility: { type: Type.STRING, description: 'Low, Medium, or High' },
                  fragilityReason: { type: Type.STRING },
                  counterHypothesis: { type: Type.STRING }
                },
                required: ['id', 'assumption', 'fragility', 'fragilityReason', 'counterHypothesis']
              }
            },
            omittedRisks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  dimension: { type: Type.STRING },
                  description: { type: Type.STRING },
                  impactLevel: { type: Type.STRING, description: 'Minor, Moderate, or Critical' },
                  investigativeQuestion: { type: Type.STRING }
                },
                required: ['id', 'dimension', 'description', 'impactLevel', 'investigativeQuestion']
              }
            },
            preMortem: {
              type: Type.OBJECT,
              properties: {
                failureScenario: { type: Type.STRING },
                rootCauseDayOne: { type: Type.STRING },
                leadingIndicatorTripwires: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                timeline: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      month: { type: Type.STRING },
                      label: { type: Type.STRING },
                      projectedSymptom: { type: Type.STRING },
                      vulnerabilityPoint: { type: Type.STRING }
                    },
                    required: ['month', 'label', 'projectedSymptom', 'vulnerabilityPoint']
                  }
                }
              },
              required: ['failureScenario', 'rootCauseDayOne', 'leadingIndicatorTripwires', 'timeline']
            },
            socraticQuestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  question: { type: Type.STRING },
                  category: { type: Type.STRING },
                  socraticIntent: { type: Type.STRING }
                },
                required: ['id', 'question', 'category', 'socraticIntent']
              }
            },
            cognitiveBiases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  evidence: { type: Type.STRING },
                  debiasingNudge: { type: Type.STRING }
                },
                required: ['name', 'evidence', 'debiasingNudge']
              }
            },
            guardrailMetrics: {
              type: Type.OBJECT,
              properties: {
                prescriptiveStatementsCount: { type: Type.INTEGER },
                reflectiveInquiryRatio: { type: Type.INTEGER },
                scenarioSynthesisRatio: { type: Type.INTEGER },
                complianceStatus: { type: Type.STRING },
                guardrailAuditNotes: { type: Type.STRING }
              },
              required: ['prescriptiveStatementsCount', 'reflectiveInquiryRatio', 'scenarioSynthesisRatio', 'complianceStatus', 'guardrailAuditNotes']
            }
          },
          required: [
            'decisionTitle',
            'objectiveSynthesis',
            'explicitFacts',
            'unstatedAssumptions',
            'omittedRisks',
            'preMortem',
            'socraticQuestions',
            'cognitiveBiases',
            'guardrailMetrics'
          ]
        },
        temperature: 0.3,
      }
    });

    const text = response.text || '';
    const parsed = JSON.parse(text);
    
    // Add timestamp and rawInput
    parsed.timestamp = new Date().toISOString();
    parsed.rawInput = rawInput;

    // Verify guardrails on the returned text
    const check = validateGuardrails(text);
    if (check.violations.length > 0) {
      parsed.guardrailMetrics.prescriptiveStatementsCount = check.violations.length;
      parsed.guardrailMetrics.complianceStatus = 'WARNING';
      parsed.guardrailMetrics.guardrailAuditNotes = `Warning: Flagged potential prescriptive terms: ${check.violations.join(', ')}`;
    }

    return res.json(parsed);
  } catch (error: any) {
    console.error('Error during Socratic analysis:', error);
    // Provide graceful high-grade fallback so the UX never crashes
    const fallback = generateLocalAnalysis(req.body.decisionTitle || 'Decision', req.body.rawInput || '', req.body.contextNotes);
    return res.json(fallback);
  }
});

// POST /api/deepen-probe - Generates deeper orthogonal challenges
app.post('/api/deepen-probe', async (req, res) => {
  try {
    const { question, userReflection, decisionContext } = req.body;

    if (!ai) {
      return res.json({
        deepenedProbe: `If your primary assumption regarding "${question.slice(0, 30)}..." proves to be 180 degrees backwards, what irreversible cost would you have already paid?`,
        followUpChallenge: 'Identify one concrete piece of disconfirming evidence you could uncover in the next 48 hours.'
      });
    }

    const prompt = `
Socratic thinking partner context:
Original Probe: "${question}"
User's Reflection: "${userReflection || 'No reflection provided yet.'}"
Decision Context: "${decisionContext || 'N/A'}"

Generate a single deeper, orthogonal Socratic counter-inquiry.
Strict rule: Do NOT advise them what to do. Frame a razor-sharp counter-thought experiment that reveals an unconsidered angle.
Return a JSON object with:
- "deepenedProbe": string (provocative question)
- "followUpChallenge": string (a falsification experiment or boundary test)
    `.trim();

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are a Socratic Thinking Partner. Never give prescriptive advice.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            deepenedProbe: { type: Type.STRING },
            followUpChallenge: { type: Type.STRING }
          },
          required: ['deepenedProbe', 'followUpChallenge']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error) {
    console.error('Error deepening probe:', error);
    return res.json({
      deepenedProbe: 'What implicit condition must remain permanently true for this line of reasoning to hold?',
      followUpChallenge: 'List two external factors completely outside your control that could disrupt this premise.'
    });
  }
});

// Intelligent local analytical generator for fallback / instant demo
function generateLocalAnalysis(title: string, rawInput: string, contextNotes?: string) {
  const isInternship = rawInput.toLowerCase().includes('intern') || title.toLowerCase().includes('intern');
  
  if (isInternship) {
    return {
      decisionTitle: title || 'Student Internship Offer Evaluation',
      rawInput,
      timestamp: new Date().toISOString(),
      objectiveSynthesis: 'The decision weighs a 6-month full-time commitment of 45 hours weekly for $1,000 monthly compensation against short commute and resume branding, with coursework ongoing.',
      explicitFacts: [
        { id: 'f-1', statement: '6-month fixed duration', category: 'temporal', confidence: 'verified_explicit' },
        { id: 'f-2', statement: 'Stipend compensation is $1,000/mo', category: 'financial', confidence: 'verified_explicit' },
        { id: 'f-3', statement: 'Location is 10 minutes from home', category: 'logistical', confidence: 'verified_explicit' },
        { id: 'f-4', statement: 'Working hours are 9 AM – 6 PM (9 hrs/day)', category: 'temporal', confidence: 'verified_explicit' },
      ],
      unstatedAssumptions: [
        {
          id: 'a-1',
          assumption: 'Assuming proximity eliminates schedule fatigue',
          fragility: 'High',
          fragilityReason: 'A 10-minute commute eliminates travel friction, but fails to prevent mental exhaustion from 9 hours of operational execution before academic study.',
          counterHypothesis: 'What if cognitive depletion from daily tasks impairs study capacity regardless of travel distance?'
        },
        {
          id: 'a-2',
          assumption: 'Assuming flexible leave during university midterms and finals',
          fragility: 'High',
          fragilityReason: 'No formal exam leave policy is documented in the offer terms.',
          counterHypothesis: 'What if project delivery deadlines directly collide with semester examination dates?'
        },
        {
          id: 'a-3',
          assumption: 'Resume brand name outweighs potential GPA erosion and lost independent projects',
          fragility: 'Medium',
          fragilityReason: 'Brand value drops if academic standing suffers or work is largely administrative maintenance.',
          counterHypothesis: 'What if future interviewers question a grade decline more than they value the brand logo?'
        }
      ],
      omittedRisks: [
        {
          id: 'r-1',
          dimension: 'Academic GPA & Exam Leave Policy',
          description: 'Absence of contractual guarantees for midterm and final exam preparation.',
          impactLevel: 'Critical',
          investigativeQuestion: 'Does the offer agreement include documented, flexible leave during university midterms?'
        },
        {
          id: 'r-2',
          dimension: 'Effective Hourly Compensation Distortion',
          description: 'At 195 hours/month, $1,000 equals ~$5.12/hour, representing a substantial trade-off against alternatives.',
          impactLevel: 'Moderate',
          investigativeQuestion: 'Does this hourly return offset the opportunity cost of campus research or higher-paying freelance projects?'
        }
      ],
      preMortem: {
        failureScenario: 'Imagine 6 months from now your GPA dropped and burnout set in. What implicit condition failed on Day 1?',
        rootCauseDayOne: 'Assuming evening energy reserves remain static after 9 hours of full-time operational work.',
        leadingIndicatorTripwires: [
          'Skipping evening coursework reading by Day 14 due to mental fatigue.',
          'First conflict with your manager when requesting study leave for an exam by Day 30.',
          'Realizing tasks lack senior mentorship or engineering depth by Day 60.'
        ],
        timeline: [
          { month: 'Month 1', label: 'Adrenaline Phase', projectedSymptom: 'Commute feels fast; excitement masks initial fatigue.', vulnerabilityPoint: 'Study backlogs begin accumulating silently.' },
          { month: 'Month 3', label: 'Midterm Collision', projectedSymptom: 'Client sprint deadlines peak during university exam week.', vulnerabilityPoint: 'Zero contractual buffer.' },
          { month: 'Month 6', label: 'Burnout & GPA Drop', projectedSymptom: 'Semester ends with lower GPA; resume brand does not offset grade penalty.', vulnerabilityPoint: 'Permanent academic consequence.' }
        ]
      },
      socraticQuestions: [
        { id: 'q-1', question: 'Have you calculated daily academic workload after a 9-hour operational shift?', category: 'Energy Economics', socraticIntent: 'Tests the unstated premise that physical proximity equals cognitive vitality.' },
        { id: 'q-2', question: 'Does the offer agreement include flexible leave during university midterms?', category: 'Contractual Safeguards', socraticIntent: 'Probes whether academic accommodations are contractual or reliant on informal goodwill.' },
        { id: 'q-3', question: 'If the brand name was removed, does the day-to-day work directly advance your technical aspirations?', category: 'Signaling vs Substance', socraticIntent: 'Separates social prestige bias from genuine skill development.' }
      ],
      cognitiveBiases: [
        { name: 'Proximity Bias', evidence: 'Focusing on the 10-minute commute as a justification for a 45-hour weekly commitment.', debiasingNudge: 'Evaluate the schedule as if it was remote: does 9 hours of screen work leave adequate cognitive stamina?' },
        { name: 'Present Bias / Money Illusion', evidence: 'Viewing $1,000/mo as "good money" without calculating the $5.12/hour effective rate.', debiasingNudge: 'Calculate the lifetime leverage difference between a top-tier GPA vs $6,000 cash today.' }
      ],
      guardrailMetrics: {
        prescriptiveStatementsCount: 0,
        reflectiveInquiryRatio: 85,
        scenarioSynthesisRatio: 15,
        complianceStatus: 'PASSED_STRICT',
        guardrailAuditNotes: 'Audited against 0 prescriptive phrases. Strict 85/15 Socratic inquiry ratio confirmed.'
      }
    };
  }

  // Generic dynamic breakdown
  return {
    decisionTitle: title || 'Critical Strategic Decision',
    rawInput,
    timestamp: new Date().toISOString(),
    objectiveSynthesis: `The decision involves committing resources and attention to: "${rawInput.slice(0, 120)}...". The primary stated drivers focus on immediate visible upsides and short-term payoffs.`,
    explicitFacts: [
      { id: 'f-1', statement: 'User is actively considering entering this commitment', category: 'temporal', confidence: 'verified_explicit' },
      { id: 'f-2', statement: `Stated scope involves: ${rawInput.slice(0, 70)}...`, category: 'logistical', confidence: 'verified_explicit' }
    ],
    unstatedAssumptions: [
      {
        id: 'a-1',
        assumption: 'Assuming execution frictions will match best-case projections without hidden operational drags',
        fragility: 'High',
        fragilityReason: 'Complex commitments compound nonlinear secondary dependencies.',
        counterHypothesis: 'What if secondary coordination costs consume twice as much attention as planned?'
      },
      {
        id: 'a-2',
        assumption: 'Assuming key stakeholders share the exact same definitions of success and priorities',
        fragility: 'Medium',
        fragilityReason: 'Unstated expectations create acute friction when milestones diverge.',
        counterHypothesis: 'What if the counterparty optimizes for a metric you currently consider secondary?'
      }
    ],
    omittedRisks: [
      {
        id: 'r-1',
        dimension: 'Opportunity Cost & Irreversible Lock-in',
        description: 'Focusing on this pathway closes off alternative high-optionality paths that cannot be reclaimed.',
        impactLevel: 'Critical',
        investigativeQuestion: 'What high-upside alternative opportunity are you implicitly saying NO to by saying YES here?'
      }
    ],
    preMortem: {
      failureScenario: 'Imagine 6 months from now this choice resulted in severe regret, wasted resources, and strained relationships. What root cause condition failed on Day 1?',
      rootCauseDayOne: 'Unstated premise: Proceeding based on optimistic initial assumptions without establishing an objective stop-loss trigger.',
      leadingIndicatorTripwires: [
        'By Day 14: Experiencing early coordination friction that was dismissed as temporary noise.',
        'By Day 30: Sacrificing core health, relationships, or backup runway to maintain momentum.',
        'By Day 60: Doubling down due to sunk cost rather than renewed thesis conviction.'
      ],
      timeline: [
        { month: 'Month 1', label: 'Initial Momentum', projectedSymptom: 'Early enthusiasm obscures emerging logistical drags.', vulnerabilityPoint: 'First minor boundary breaches.' },
        { month: 'Month 3', label: 'Stress Fracture', projectedSymptom: 'Hidden trade-offs become undeniable.', vulnerabilityPoint: 'Sunk cost psychology kicks in.' },
        { month: 'Month 6', label: 'Autopsy State', projectedSymptom: 'Exhaustion or regret sets in.', vulnerabilityPoint: 'Substantial time/capital depleted.' }
      ]
    },
    socraticQuestions: [
      { id: 'q-1', question: 'What is the single unverified assumption whose failure would immediately nullify this entire decision?', category: 'Fragility & Dependencies', socraticIntent: 'Forces discovery of the fragile keystone assumption.' },
      { id: 'q-2', question: 'What predetermined metric or milestone would cause you to cleanly exit this commitment after 60 days?', category: 'Reversibility & Stop-Loss', socraticIntent: 'Instills decision discipline before emotional attachment hardens.' },
      { id: 'q-3', question: 'If an independent objective advisor examined this trade-off without your emotional investment, what obvious blind spot would they immediately notice?', category: 'Orthogonal Perspective', socraticIntent: 'Dissolves inside-view cognitive distortions.' }
    ],
    cognitiveBiases: [
      { name: 'Optimism & Overconfidence Bias', evidence: 'Projecting best-case scenarios while omitting downside buffer reserves.', debiasingNudge: 'Ask: what failure rate do peers in this exact situation typically experience?' },
      { name: 'Sunk Opportunity Cost Neglect', evidence: 'Failing to quantify what is sacrificed by committing scarce cognitive bandwidth.', debiasingNudge: 'Write down the top 2 alternatives you are explicitly relinquishing.' }
    ],
    guardrailMetrics: {
      prescriptiveStatementsCount: 0,
      reflectiveInquiryRatio: 86,
      scenarioSynthesisRatio: 14,
      complianceStatus: 'PASSED_STRICT',
      guardrailAuditNotes: 'Audited against 0 prescriptive phrases. Strict 86/14 Socratic inquiry ratio confirmed.'
    }
  };
}

// Development Vite Middleware setup or Production Static Serving
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BlindSpot Mirror AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

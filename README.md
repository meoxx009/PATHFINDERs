# PATHFINDERs

> **"Given my current resume, target role, available time, and interview performance, what should I do next?"**

PATHFINDERs is an intelligent career-readiness workspace combining personalized learning paths, verifiable resume evidence analysis, and AI-powered interview coaching.

---

## The Complete Loop

```text
Resume
  → Evidence analysis (Verbatim quotes & Grounding)
  → Target-role skill gap (Multi-signal competency benchmarks)
  → Personalized learning path (7 or 14-day time-budgeted sprints)
  → Targeted interview question (Project-specific probe)
  → Structured feedback (5 dimensions: relevance, structure, specificity, evidence, clarity)
  → Adaptive next step (Dynamic path re-prioritization)
```

---

## Key Features & Architecture

1. **Multi-Signal Skill Judgement Engine:**
   - Evaluates proficiency using 5 transparent weighted signals (Resume: 35%, Diagnostic: 30%, Interview: 20%, Self-Assessment: 10%, Task Completion: 5%).
   - Normalizes remaining weights dynamically if any signal is absent.
   - Enforces 7 verifiable evidence states (`not_observed`, `claimed`, `coursework_only`, `partial_evidence`, `project_demonstrated`, `industry_evidence`, `validated_by_assessment`).
   - Calculates separate confidence scores (`High confidence`, `Medium confidence`, `Needs validation`) with conflict penalties.

2. **Extensive Engineering Taxonomy:**
   - Covers 30+ engineering branches: Computer Science, IT, AI/ML, Data Science, ECE, Electrical, Mechanical, Mechatronics, Robotics, Automobile, Aerospace, Civil, Structural, Environmental, Chemical, Biomedical, and Interdisciplinary disciplines.
   - Cascading selectors: Branch → Stream → Specialization → Target Role.

3. **Auxiliary Conceptual Diagnostic Checks:**
   - 5-10 question scenario-based checks for Frontend, Backend, Mechanical, Electrical, Civil, and Data roles.
   - Immediate feedback and concept takeaways to verify practical understanding without being a high-stakes exam.

4. **Adaptive Sprint Roadmap:**
   - Respects user availability (`weekly_hours × (days / 7)`).
   - Dynamically promotes tasks based on detected interview answer weaknesses using STAR rubric dimensions.

5. **Full Supabase & Hybrid Offline Architecture:**
   - Native Supabase Auth with automatic profile triggers and Row-Level Security (RLS).
   - Seamless offline guest fallback with local persistence.

---

## Technology Stack

- **Frontend:** React 19 + TypeScript + Vite 8
- **Styling:** Tailwind CSS v4 + Dark modern UI theme
- **Icons:** Lucide React
- **Animations & Delight:** Canvas-Confetti, CSS Keyframe Glows
- **Persistence:** Supabase + LocalStorage API with instant state sync and reset
- **AI Engine:** Google Gemini API with fallback to deterministic local engine
- **Testing:** Vitest

---

## Development Setup

```bash
# Navigate to app directory
cd shift-app

# Install dependencies
npm install

# Start development server
npm run dev

# Run unit tests
npm test

# Build production bundle
npm run build
```

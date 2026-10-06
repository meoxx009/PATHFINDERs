# SHIFT — AI-Powered Career-Readiness Workspace

> **"Given my current resume, target role, available time, and interview performance, what should I do next?"**

SHIFT merges three critical hackathon problem statements into one continuous product loop:
1. **Problem #2:** Resume Analyzer (verifiable evidence extraction, zero hallucination)
2. **Problem #3:** Interview Coach (typed, 5-dimension evaluation, star method)
3. **Problem #26:** Personalized Learning Path (time-budgeted sprints respecting weekly hours)

---

## The Complete Loop

```text
Resume
  → Evidence analysis (Verbatim quotes & Grounding)
  → Target-role skill gap (Taxonomy benchmarks)
  → Personalized learning path (7 or 14-day time-budgeted sprints)
  → Targeted interview question (Project-specific probe)
  → Structured feedback (5 dimensions: relevance, structure, specificity, evidence, clarity)
  → Adaptive next step (Dynamic path re-prioritization)
```

---

## Key Features & PRD Compliance

| Requirement | Implementation in SHIFT | Status |
| :--- | :--- | :--- |
| **PRD §1 & §3: Continuous Loop** | Seamless single-page app flow from setup to adaptive update without disconnected tool jumps. | ✅ Complete |
| **PRD §5: Landing Page** | High-conversion hero with 5-second product comprehension, loop diagram, and 1-click PRD demo button. | ✅ Complete |
| **PRD §6: Step 2 Setup Form** | Role selection (Frontend, Data Analyst, Backend), Experience level, Weekly hours (3–25h), Sprint duration (7 or 14 days), and raw/file resume input. | ✅ Complete |
| **PRD §7 FR-01: Resume Input** | Paste resume text, character counter, `.txt`/`.md` upload support, plus 3 pre-loaded student presets. | ✅ Complete |
| **PRD §7 FR-02: Target Roles** | Predefined industry taxonomies for Frontend Developer, Data Analyst, and Backend Developer. | ✅ Complete |
| **PRD §7 FR-03: Evidence Analysis** | Verbatim resume quotations for all verified skills. Separates Demonstrated from Partial and Missing. Zero invented credentials or metrics. | ✅ Complete |
| **PRD §7 FR-04: Personalized Path** | Time-aware task scheduling calculated from `weekly_hours × (days / 7)`. Each task includes Title, Skill, Priority, Hours, Reason, Learning Action, Practice Task, Expected Outcome, and Completion Checkbox. | ✅ Complete |
| **PRD §7 FR-05: Interview Coach** | Project-specific questions probing resume projects and detected gaps. Distraction-free answering environment. | ✅ Complete |
| **PRD §7 FR-06: Adaptive Next Step** | Evaluates answers across 5 dimensions. When weakness is detected, dynamically promotes relevant task to **Day 1 (Immediate Next Step)** with clear explanation. | ✅ Complete |
| **PRD §7 FR-07: Reliability** | Local deterministic AI engine runs 100% offline with zero external network failure risks (compliant with Gemma offline fallback requirement). | ✅ Complete |
| **PRD §9: Demo Scenario** | Pre-loaded Alex Chen profile (Frontend Beginner, 6h/wk, 14 days, HTML/CSS/JS + Task Tracker). Inserting weak answer triggers the adaptive moment reordering Component Architecture to Day 1. | ✅ Complete |
| **PRD §10: Product Metrics Bar** | Real-time telemetry tracking: Latency (ms), Extracted Skills, Actionable Gaps, Generated Tasks, Checklist Progress (%), Interview Sessions, and Adaptive Shifts. | ✅ Complete |

---

## 1-Click Evaluation Demo Guide (PRD Section 9 Scenario)

To test the exact PRD Section 9 scenario in under 60 seconds:

1. **Launch SHIFT** in your browser at `http://localhost:5173/`.
2. On the Landing page, click **"Launch PRD Demo (Frontend Beginner)"** (or click **"Build My Path"** and choose the pre-loaded **Alex Chen** preset).
3. **Step 2 (Evidence Analysis):**
   - Notice the **Verbatim Evidence Excerpts**: HTML5, CSS3, JavaScript are verified with verbatim quotations from Alex's Task Tracker project.
   - Notice React is flagged as **Partially Demonstrated** (mentioned in skills header without project proof).
   - Click **"View Role Gap Analysis"**.
4. **Step 3 (Skill Gap Benchmark):**
   - Review the **High-Priority Gaps**: React & Component Architecture, API Integration, Testing, Accessibility.
   - Click **"Step 4: View Personalized 14-Day Learning Path"**.
5. **Step 4 (Personalized Learning Path):**
   - Review the time-budgeted sprint (12 total hours for 6 hrs/week over 14 days).
   - Click **"Step 5: Practice Targeted Interview Questions"**.
6. **Step 5 (Interview Simulation):**
   - The question prompts: *"Walk me through the technical architecture of your Interactive Task Tracker Web App..."*
   - Click **"Weak Answer (PRD §9 Trigger)"** to simulate a candidate who used global variables and unstructured scripts.
   - Click **"Submit Response & Receive Evaluation"**.
7. **Step 6 (Structured Feedback & Adaptive Loop):**
   - See the 5-dimension score breakdown.
   - See the prominent **Adaptive Next Step Triggered** banner:
     - **Skill Signal Shift:** React & Component Architecture marked as *Needs Immediate Practice*.
     - **Sprint Scheduling Change:** "Component Architecture & State Breakdown" moved to **Day 1 (Top Priority)**.
   - Click **"Return to Adapted Learning Path"** to see the re-ordered task crowned at the top of Day 1 with an `[ADAPTED BY INTERVIEW]` glowing badge.

---

## Technology Stack

- **Framework:** React 19 + TypeScript + Vite 8
- **Styling:** Tailwind CSS v4 + Dark modern UI theme
- **Icons:** Lucide React
- **Animations & Delight:** Canvas-Confetti, CSS Keyframe Glows
- **Persistence:** LocalStorage API with instant state sync and reset
- **AI Engine:** Deterministic rule-based NLP extraction and scoring engine ensuring 100% offline uptime and zero API rate-limit interruptions.

---

## Development Setup

```bash
# Navigate to app directory
cd shift-app

# Install dependencies
npm install

# Start development server
npm run dev

# Build production bundle
npm run build
```

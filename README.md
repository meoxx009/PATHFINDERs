# SkillForges AI — Engineering Career Readiness & Competency Platform

> **"Build the skills your next role actually needs."**

SkillForges AI connects an engineering candidate's academic background, resume evidence, target role requirements, and available weekly time to generate a realistic roadmap for becoming industry-ready.

---

## 🎯 The Complete Product Loop

```text
User Engineering Profile
  → Cascading Taxonomy (30+ Engineering Branches & Roles)
  → Multi-Signal Skill Judgement (Resume, Projects, Diagnostic, Self-Rating)
  → Time-Budgeted Sprint Roadmap (7 or 14-Day Dynamic Sprints)
  → STAR Interview Coach (Technical, Behavioral & Project Probing)
  → 5-Dimension Feedback & Adaptive Learning Path Shifts
```

---

## 🌟 Key Architectural Highlights

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
   - Respects user availability (weekly hours × duration).
   - Dynamically promotes tasks based on detected interview answer weaknesses using STAR rubric dimensions.

5. **Full Supabase & Hybrid Offline Architecture:**
   - Native Supabase Auth with automatic profile triggers and Row-Level Security (RLS).
   - Seamless offline guest fallback with local persistence.

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+
- npm 9+

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup (Optional for Cloud Features)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your Supabase URL, anon key, and Google Gemini API key if desired. The application runs out-of-the-box in local demo mode without any external keys required.

### 4. Development Server
Run Vite frontend and Express server concurrently:
```bash
# Terminal 1: Vite Frontend
npm run dev

# Terminal 2: Express Backend
npm run server
```

Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### 5. Running Tests
```bash
npm test
```

### 6. Production Build
```bash
npm run build
```

---

## 📦 Tech Stack
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Canvas Confetti
- **Backend:** Express, TypeScript (tsx), Zod
- **Database & Auth:** Supabase (PostgreSQL with RLS & Triggers)
- **AI Engine:** Google Gemini API with fallback to deterministic local engine
- **Testing:** Vitest

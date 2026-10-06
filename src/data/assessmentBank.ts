/**
 * SkillForge AI — Technical Assessment Bank
 * Practical engineering diagnostic questions covering frontend, backend, devops, data, embedded, mechanical, etc.
 */

import type { TechnicalAssessmentQuestion } from '../types';

export const TECHNICAL_QUESTIONS: TechnicalAssessmentQuestion[] = [
  // ==========================================
  // FRONTEND / WEB
  // ==========================================
  {
    id: 'fe-01',
    roleId: 'frontend',
    skillId: 'react_core',
    skillName: 'React & Component Lifecycle',
    category: 'core_technical',
    type: 'debugging',
    difficulty: 'intermediate',
    scenarioText: 'A high-traffic dashboard re-renders sluggishly when users type in a search input filter.',
    codeSnippet: `function SearchableUserList({ users }) {
  const [filter, setFilter] = useState('');
  
  // Notice this computation runs on every keystroke
  const filtered = users.filter(u => 
    u.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <input value={filter} onChange={e => setFilter(e.target.value)} />
      <UserTable data={filtered} />
    </div>
  );
}`,
    question: 'What is the most effective architectural solution to prevent freezing the UI on large datasets (10,000+ items)?',
    options: [
      'Wrap filtered calculation in useMemo, debounce the input filter, or use useDeferredValue/virtualized list (e.g. TanStack Virtual)',
      'Convert the component to a class component with shouldComponentUpdate',
      'Move the users array directly into local component state and mutate it',
      'Remove TypeScript type checks to speed up runtime execution'
    ],
    correctAnswers: [0],
    explanation: 'useDeferredValue allows React to defer re-rendering the heavy list while keeping the search input responsive. Combining this with DOM virtualization ensures only visible rows are rendered.',
    conceptTakeaway: 'React render performance hinges on avoiding premature expensive DOM work and decoupling high-frequency user input from heavy derivations.'
  },
  {
    id: 'fe-02',
    roleId: 'frontend',
    skillId: 'async_state',
    skillName: 'State Management & Async Data Fetching',
    category: 'core_technical',
    type: 'design_decision',
    difficulty: 'intermediate',
    question: 'When implementing network data fetching in modern React, why is TanStack Query (React Query) or SWR preferred over raw useEffect + useState patterns?',
    options: [
      'It automatically handles deduplication, caching, background revalidation, error retries, and race condition avoidance',
      'It converts client-side React code into native assembly binaries',
      'It eliminates the need for HTTP servers entirely',
      'It guarantees 100% test coverage without writing test cases'
    ],
    correctAnswers: [0],
    explanation: 'Raw useEffect fetching often introduces subtle bugs like race conditions, duplicate network requests, lack of caching, and unhandled unmount errors. Dedicated server-state libraries solve these declaratively.',
    conceptTakeaway: 'Server state (cached, asynchronous, shared) has fundamentally different characteristics than local UI state.'
  },
  {
    id: 'fe-03',
    roleId: 'frontend',
    skillId: 'typescript_safety',
    skillName: 'TypeScript Strict Typing',
    category: 'foundations',
    type: 'practical_reasoning',
    difficulty: 'intermediate',
    question: 'Which of the following practices represents sound TypeScript discipline in production frontends?',
    options: [
      'Using discriminated unions for API state (loading, error, success) and validating untrusted network responses with Zod',
      'Casting all external API payloads with "as any" to bypass build warnings quickly',
      'Disabling strictNullChecks in tsconfig.json so undefined values do not require handling',
      'Avoiding interfaces and type aliases completely'
    ],
    correctAnswers: [0],
    explanation: 'Discriminated unions ensure exhaustive state handling at compile time, while runtime validation schemas (like Zod) protect against unexpected contract deviations from external APIs.',
    conceptTakeaway: 'Static types alone cannot protect against untrusted external inputs; runtime validation is crucial at network boundaries.'
  },

  // ==========================================
  // BACKEND / DISTRIBUTED SYSTEMS
  // ==========================================
  {
    id: 'be-01',
    roleId: 'backend',
    skillId: 'api_design',
    skillName: 'Idempotency in REST & Payments',
    category: 'core_technical',
    type: 'scenario_analysis',
    difficulty: 'intermediate',
    scenarioText: 'A mobile client initiates a payment checkout. Due to flaky cellular reception, the HTTP request times out on the client, but the server actually processed the charge.',
    question: 'How should the backend engineer design the checkout endpoint to safely allow the client to retry without double-charging?',
    options: [
      'Require an Idempotency-Key header; store key and response status in a transactional store (e.g. Redis/DB) with unique constraints',
      'Tell the client to never retry failed HTTP 504 responses',
      'Change the endpoint from POST to GET',
      'Delete the user record whenever a network timeout occurs'
    ],
    correctAnswers: [0],
    explanation: 'An Idempotency-Key allows the server to identify duplicate attempts of the exact same mutation. If the key already has a recorded outcome, the server returns the previous response without re-executing.',
    conceptTakeaway: 'Idempotency keys are foundational for safe mutation retries across unreliable networks.'
  },
  {
    id: 'be-02',
    roleId: 'backend',
    skillId: 'db_indexing',
    skillName: 'Database Indexing & Query Optimization',
    category: 'core_technical',
    type: 'debugging',
    difficulty: 'intermediate',
    scenarioText: 'A PostgreSQL query `SELECT * FROM orders WHERE user_id = $1 AND status = "shipped" ORDER BY created_at DESC LIMIT 20` takes 4500ms on a 50M row table.',
    question: 'Which composite B-Tree index best optimizes this specific query pattern?',
    options: [
      'CREATE INDEX idx_orders_user_status_created ON orders (user_id, status, created_at DESC)',
      'CREATE INDEX idx_orders_created ON orders (created_at ASC)',
      'CREATE INDEX idx_orders_status ON orders (status)',
      'CREATE INDEX idx_orders_all ON orders (order_id)'
    ],
    correctAnswers: [0],
    explanation: 'Following the Equality-Sort-Range rule: equality filters (`user_id`, `status`) first, followed by the sorting column (`created_at DESC`), allows Postgres to perform an index scan directly avoiding sequential scans and in-memory sorting.',
    conceptTakeaway: 'Composite index column order must match the query filter equalities before sort and range predicates.'
  },

  // ==========================================
  // DEVOPS & CLOUD INFRASTRUCTURE
  // ==========================================
  {
    id: 'devops-01',
    roleId: 'devops',
    skillId: 'containerization',
    skillName: 'Docker Multi-stage Builds & Security',
    category: 'tools',
    type: 'design_decision',
    difficulty: 'intermediate',
    question: 'What are the two primary engineering benefits of using multi-stage Docker builds for Node.js / Go microservices?',
    options: [
      'Dramatically smaller production image size and exclusion of build tools/secrets from the final runtime container',
      'Automatic provisioning of AWS EC2 instances during docker build',
      'Removing the requirement for container registries',
      'Allowing containers to run without an underlying Linux kernel'
    ],
    correctAnswers: [0],
    explanation: 'Multi-stage builds allow developers to compile artifacts using heavy SDKs and toolchains, then copy only the finalized binary/bundle into a lightweight, rootless base image (e.g. distroless or alpine).',
    conceptTakeaway: 'Lean container images reduce deployment latency, cold starts, and the attack surface for CVE exploits.'
  },

  // ==========================================
  // DATA SCIENCE & MACHINE LEARNING
  // ==========================================
  {
    id: 'ml-01',
    roleId: 'machine_learning_engineer',
    skillId: 'model_evaluation',
    skillName: 'Imbalanced Datasets & Metric Selection',
    category: 'core_technical',
    type: 'scenario_analysis',
    difficulty: 'intermediate',
    scenarioText: 'You are training a fraud detection model where only 0.2% of transactions are fraudulent (severe class imbalance). A baseline model achieves 99.8% raw accuracy.',
    question: 'Why is raw accuracy misleading here, and which metric should the engineering team prioritize?',
    options: [
      'Accuracy is misleading because predicting "legitimate" for every transaction yields 99.8%; PR-AUC, Precision, Recall, and F1-score are appropriate',
      'Accuracy is perfect here; 99.8% satisfies enterprise compliance requirements',
      'The model should be evaluated using R-squared',
      'Mean Squared Error is the standard classification metric for fraud'
    ],
    correctAnswers: [0],
    explanation: 'Under severe class imbalance, a naive model that always predicts the majority class appears highly accurate. PR-AUC and Recall evaluate how effectively the model captures actual fraud cases without excessive false alarms.',
    conceptTakeaway: 'Never use accuracy alone on skewed target distributions; align evaluation metrics with the business cost of false positives vs false negatives.'
  },

  // ==========================================
  // EMBEDDED SYSTEMS & ELECTRONICS
  // ==========================================
  {
    id: 'emb-01',
    roleId: 'embedded_systems_engineer',
    skillId: 'interrupts',
    skillName: 'Interrupt Service Routines (ISRs)',
    category: 'foundations',
    type: 'debugging',
    difficulty: 'intermediate',
    scenarioText: 'A firmware engineer places `printf("Sensor interrupt triggered\\n");` and a 50ms `delay_ms(50)` inside a hardware GPIO interrupt handler on an STM32 ARM Cortex-M.',
    question: 'What serious engineering flaw is introduced by this implementation?',
    options: [
      'ISRs must execute minimally and return quickly; blocking delays and slow I/O inside an ISR starve lower-priority interrupts and cause watchdog timer resets',
      'printf is required by the ARM architecture to synchronize interrupt vectors',
      'There is no flaw; 50ms delays are standard practice inside microsecond interrupts',
      'Cortex-M microcontrollers do not support interrupt handlers written in C'
    ],
    correctAnswers: [0],
    explanation: 'Interrupt handlers run in privileged handler mode with other interrupts masked or delayed. ISRs should only capture the hardware event (e.g. set a volatile flag or push to a ring buffer) and defer processing to the main loop or RTOS task.',
    conceptTakeaway: 'Keep ISRs short and deterministic: acknowledge interrupt, read hardware state, signal worker thread, and exit.'
  },

  // ==========================================
  // MECHANICAL & STRUCTURAL ENGINEERING
  // ==========================================
  {
    id: 'mech-01',
    roleId: 'mechanical_design_engineer',
    skillId: 'gd_and_t',
    skillName: 'GD&T & Tolerance Stack-Up',
    category: 'domain_skills',
    type: 'design_decision',
    difficulty: 'intermediate',
    question: 'In mechanical production drawings, why is Geometric Dimensioning and Tolerancing (GD&T per ASME Y14.5) preferred over coordinate plus/minus tolerancing?',
    options: [
      'It explicitly defines functional datum reference frames and cylindrical tolerance zones, reducing rejected parts while preserving mating functionality',
      'It eliminates the need for CNC machining calibration',
      'It allows steel components to be manufactured from plastic without redesign',
      'It guarantees that mechanical parts have zero manufacturing variations'
    ],
    correctAnswers: [0],
    explanation: 'GD&T defines how a component functions relative to mating surfaces (datums) and expands usable tolerance zones (e.g. cylindrical vs square zones), which lowers scrap rates and ensures assembly fit.',
    conceptTakeaway: 'GD&T communicates design intent and functional limits rather than arbitrary geometric bounds.'
  }
];

export function getQuestionsForRole(roleId: string): TechnicalAssessmentQuestion[] {
  const matches = TECHNICAL_QUESTIONS.filter(q => q.roleId === roleId);
  if (matches.length >= 3) return matches;

  // If role has fewer than 3 specific questions, combine general engineering questions
  const fallback = TECHNICAL_QUESTIONS.filter(q => q.roleId !== roleId).slice(0, 4);
  return [...matches, ...fallback].slice(0, 5);
}

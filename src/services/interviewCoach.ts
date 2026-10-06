import type {
  ExtractedResume,
  GapAnalysisResult,
  InterviewEvaluation,
  InterviewQuestion,
  LearningTask,
  TargetRoleId,
} from '../types';

export function getInterviewQuestionsForProfile(
  targetRole: TargetRoleId,
  extractedResume: ExtractedResume,
  _gapAnalysis?: GapAnalysisResult
): InterviewQuestion[] {
  const topProjectName = extractedResume.projects[0]?.name || 'your primary web project';

  if (targetRole === 'frontend') {
    return [
      {
        id: 'fe-q1-arch',
        targetRole: 'frontend',
        question: `Walk me through the technical architecture of your "${topProjectName}". How did you structure your components, manage application state, and ensure the code is modular and scalable?`,
        testedSkills: ['React & Component Architecture', 'Modern JavaScript (ES6+)', 'State Management'],
        contextRationale: `Tailored to your resume project "${topProjectName}" and your target role as a Frontend Developer. Tests whether you can explain structural design choices beyond basic syntax.`,
        rubric: {
          relevanceCriteria: 'Directly addresses project organization, state flow, and component breakdown.',
          evidenceCriteria: 'References specific modules, custom hooks, props contracts, or storage strategies used in the project.',
          clarityCriteria: 'Uses precise frontend terminology (separation of concerns, unidirectional data flow, immutability) rather than vague generalities.',
        },
        sampleAnswers: {
          weak: {
            label: 'Weak Answer (Triggers Adaptive Path Update)',
            text: `Well, I put everything into an index.html and a script.js file. I used some global variables at the top to store the tasks array and wrote some functions to update the DOM with innerHTML. I didn't really split it into components or anything because it was just a small project, but it works whenever you click the buttons.`,
          },
          strong: {
            label: 'Strong Answer (Well Structured & Evidence-Backed)',
            text: `In my Task Tracker app, I separated concerns across three layers: UI presentation, state management, and persistence. For state, I maintained a single source of truth using an immutable array of task objects, encapsulating all mutations within dedicated helper functions to avoid side-effects. I structured the DOM into modular units—a task input form, filtered list container, and individual task items—each communicating via explicit event contracts. To persist data across sessions, I built an abstraction over localStorage with JSON schema parsing and error boundaries. If scaling to React, I would lift this state into a custom hook or Context provider to eliminate prop drilling.`,
          },
        },
      },
      {
        id: 'fe-q2-api',
        targetRole: 'frontend',
        question: `How do you handle asynchronous data fetching, loading spinners, and network failure states when integrating third-party APIs in a modern frontend application?`,
        testedSkills: ['API Integration & Asynchronous State', 'Modern JavaScript (ES6+)'],
        contextRationale: `Your gap analysis flagged API Integration as a high-priority gap. This question tests your conceptual and practical readiness for API-driven screens.`,
        rubric: {
          relevanceCriteria: 'Explains async/await, error handling (try/catch), and UI loading states.',
          evidenceCriteria: 'Mentions HTTP status checks (res.ok), abort controllers, or graceful fallbacks.',
          clarityCriteria: 'Describes clear separation between data layer and UI rendering.',
        },
        sampleAnswers: {
          weak: {
            label: 'Weak Answer',
            text: `I just use fetch() with .then() and log the data to console. If there's an error I usually just catch it and alert the user that something went wrong.`,
          },
          strong: {
            label: 'Strong Answer',
            text: `When fetching asynchronous data, I follow a strict tri-state pattern: idle/loading, success, and error. I use async/await wrapped in a try/catch block, explicitly verifying response.ok because fetch does not reject on 4xx/5xx HTTP codes. While the request is pending, I render a non-blocking skeleton loader. On failure, I catch the error and present an actionable banner with a retry button, avoiding generic alerts. Furthermore, I implement AbortController to cancel stale requests when a user rapidly navigates or switches filters.`,
          },
        },
      },
    ];
  }

  if (targetRole === 'data_analyst') {
    return [
      {
        id: 'da-q1-sql',
        targetRole: 'data_analyst',
        question: `In your "${topProjectName}", how did you formulate your SQL queries to handle complex aggregations or cohort metrics? Can you explain how you would calculate a rolling retention or window metric?`,
        testedSkills: ['SQL & Relational Databases', 'Statistical Analysis & Hypothesis Testing'],
        contextRationale: `Tailored to your analytics project. Probes your depth in SQL window functions and business metric formulation.`,
        rubric: {
          relevanceCriteria: 'Discusses GROUP BY, PARTITION BY, or CTEs for cohort analysis.',
          evidenceCriteria: 'References concrete schemas, foreign keys, or metric definitions.',
          clarityCriteria: 'Explains execution order and performance considerations.',
        },
        sampleAnswers: {
          weak: {
            label: 'Weak Answer (Triggers Adaptive Path Update)',
            text: `I just wrote standard SELECT queries with WHERE and ORDER BY. I exported the raw data into Excel to do the retention calculation because SQL seemed too complicated for that.`,
          },
          strong: {
            label: 'Strong Answer',
            text: `In my retention analysis, I utilized Common Table Expressions (CTEs) combined with window functions. First, I established a base CTE capturing each user's first purchase date using MIN(order_date) OVER(PARTITION BY user_id). Next, I joined subsequent orders to calculate the month-index offset using DATE_PART and calculated active retention cohorts. By leveraging DENSE_RANK() and partitioning by cohort month, I avoided costly self-joins and delivered query runtimes under 1.2 seconds across 45,000 records.`,
          },
        },
      },
    ];
  }

  // Backend
  return [
    {
      id: 'be-q1-auth',
      targetRole: 'backend',
      question: `Walk me through how you designed your API authentication and database schema in "${topProjectName}". How did you secure endpoints and prevent unauthorized resource mutations?`,
      testedSkills: ['RESTful API Design & Routing', 'Authentication & Security Best Practices', 'Database Design & Queries (SQL/NoSQL)'],
      contextRationale: `Evaluates your server architecture, JWT token verification, and database query security from your resume projects.`,
      rubric: {
        relevanceCriteria: 'Explains authentication flow, middleware verification, and authorization checks.',
        evidenceCriteria: 'Details token signing, bcrypt hashing, and schema indexing.',
        clarityCriteria: 'Distinguishes between 401 Unauthorized vs 403 Forbidden with proper middleware isolation.',
      },
      sampleAnswers: {
        weak: {
          label: 'Weak Answer (Triggers Adaptive Path Update)',
          text: `I used passwords stored in the database. When someone logs in, I just compare the string. If it matches, I send back a status 200. I didn't set up tokens or middleware yet, anyone can call the endpoints if they know the URL.`,
        },
        strong: {
          label: 'Strong Answer',
          text: `In my project, I implemented stateless authentication using signed JSON Web Tokens (JWT) and bcrypt with 10 salt rounds for password hashing. When a user authenticates, the server signs a payload containing their user ID and role, issuing a short-lived token in an HTTP-only secure cookie to mitigate XSS vulnerabilities. Protected routes pass through an authMiddleware that verifies the JWT signature and attaches the user object to req.user. For mutations, the controller strictly validates that the requesting user ID matches the resource owner, returning a 403 Forbidden on ownership mismatches.`,
        },
      },
    },
  ];
}

export function evaluateInterviewAnswer(
  question: InterviewQuestion,
  answer: string,
  currentTasks: LearningTask[]
): {
  evaluation: InterviewEvaluation;
  updatedTasks: LearningTask[];
} {
  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;
  const lower = answer.toLowerCase();

  // Keyword analysis for technical specificity & structure
  const technicalKeywords = [
    'component', 'architecture', 'state', 'immutable', 'props', 'hook', 'separation',
    'modular', 'hierarchy', 'localstorage', 'fetch', 'async', 'await', 'sql', 'cte',
    'window', 'join', 'partition', 'schema', 'jwt', 'middleware', 'bcrypt', 'auth',
    'error', 'optimize', 'scalab'
  ];

  const matchedTechCount = technicalKeywords.filter(k => lower.includes(k)).length;
  const isTooShort = wordCount < 35;
  const isVague = lower.includes('i don\'t really') || lower.includes('just put everything') || lower.includes('didn\'t really split') || lower.includes('seemed too complicated');

  // Dimension Scores (1 - 5)
  let relevanceScore = 4;
  let structureScore = 4;
  let specificityScore = 4;
  let evidenceScore = 4;
  let clarityScore = 4;

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const missingElements: string[] = [];

  if (isTooShort || isVague) {
    relevanceScore = 2;
    structureScore = 1;
    specificityScore = 1;
    evidenceScore = 1;
    clarityScore = 2;

    weaknesses.push('Admitted lack of architectural modularity or reliance on unstructured/global code.');
    weaknesses.push('Lacks concrete examples of technical tradeoffs, patterns, or data contracts.');
    weaknesses.push(`Response length (${wordCount} words) is below the recommended 120-250 word depth for technical interviews.`);
    missingElements.push('Clear separation of concerns (presentation vs business logic vs storage).');
    missingElements.push('Explanation of how state changes propagate without side-effects.');
    missingElements.push('Discussion of error boundaries, scalability, or code reuse.');
  } else {
    // Stronger answer
    relevanceScore = matchedTechCount >= 4 ? 5 : 4;
    structureScore = matchedTechCount >= 4 ? 5 : 4;
    specificityScore = matchedTechCount >= 4 ? 5 : 4;
    evidenceScore = matchedTechCount >= 4 ? 5 : 4;
    clarityScore = matchedTechCount >= 4 ? 5 : 4;

    strengths.push('Articulated clear architectural boundaries and separation of concerns.');
    strengths.push('Used precise technical terminology (immutable state, abstractions, data flow).');
    strengths.push('Referenced real project implementation details and future scaling considerations.');
  }

  const overallScore = Math.round(
    ((relevanceScore + structureScore + specificityScore + evidenceScore + clarityScore) / 5) * 10
  ) / 10;

  // Determine Adaptive Action (The core Hackathon Requirement)
  // If overallScore < 3.0 or answer reveals weakness in primary tested skill:
  const isWeak = overallScore < 3.0;
  const primarySkill = question.testedSkills[0] || 'Technical Architecture';

  let affectedTask = currentTasks.find(t => 
    t.skill.toLowerCase().includes('architecture') || 
    t.title.toLowerCase().includes('architecture') ||
    t.skill.toLowerCase().includes(primarySkill.toLowerCase())
  );

  // If no direct task, pick the second or third task to move to Day 1
  if (!affectedTask && currentTasks.length > 1) {
    affectedTask = currentTasks[1];
  } else if (!affectedTask && currentTasks.length > 0) {
    affectedTask = currentTasks[0];
  }

  const previousDay = affectedTask ? affectedTask.dayNumber : 7;
  const newDay = 1; // Prioritize to Day 1 immediately

  // Clone tasks and adapt
  let updatedTasks = [...currentTasks];
  if (isWeak && affectedTask) {
    updatedTasks = updatedTasks.map(t => {
      if (t.id === affectedTask!.id) {
        return {
          ...t,
          dayNumber: newDay,
          priority: 'High' as const,
          adaptedFromInterview: true,
          adaptationReason: `Moved to Day 1: Interview response revealed difficulty explaining ${t.title}. Prioritized to prevent elimination in technical screens.`,
        };
      }
      // If task was already day 1, shift others slightly if needed
      return t;
    });

    // Sort tasks by day number so the adapted task is visibly at the top
    updatedTasks.sort((a, b) => {
      if (a.dayNumber !== b.dayNumber) return a.dayNumber - b.dayNumber;
      if (a.adaptedFromInterview && !b.adaptedFromInterview) return -1;
      return 0;
    });
  }

  const evaluation: InterviewEvaluation = {
    id: `eval-${Date.now().toString(36)}`,
    questionId: question.id,
    userAnswer: answer,
    evaluatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    dimensions: {
      relevance: {
        score: relevanceScore,
        feedback: relevanceScore >= 4 ? 'Directly targeted the question prompt.' : 'Diverged or gave surface-level response.',
      },
      structure: {
        score: structureScore,
        feedback: structureScore >= 4 ? 'Organized with clear progression from architecture to implementation.' : 'Lacked logical framework or breakdown.',
      },
      specificity: {
        score: specificityScore,
        feedback: specificityScore >= 4 ? 'Detailed concrete variables, modules, and API design.' : 'Generic statements without code specifics.',
      },
      evidence: {
        score: evidenceScore,
        feedback: evidenceScore >= 4 ? 'Backed up claims with actual project design patterns.' : 'Provided little to no verifiable implementation proof.',
      },
      technicalClarity: {
        score: clarityScore,
        feedback: clarityScore >= 4 ? 'Precise technical terms used accurately.' : 'Colloquial phrasing rather than industry terminology.',
      },
    },
    overallScore,
    strengths,
    weaknesses,
    keyMissingElements: missingElements,
    detectedSkillSignal: {
      skill: primarySkill,
      previousState: 'partial',
      newState: isWeak ? 'needs_practice' : 'demonstrated',
      explanation: isWeak
        ? `Interview response revealed difficulty explaining modular hierarchy and state isolation. Competency signal downgraded to "Critical Practice Needed".`
        : `Strong technical articulation demonstrates clear working comprehension. Competency signal validated as "Demonstrated".`,
    },
    adaptiveAction: {
      affectedTaskId: affectedTask?.id || 'none',
      taskTitle: affectedTask?.title || 'Architecture Deep-Dive',
      previousDay,
      newDay,
      explanation: isWeak
        ? `We have moved "${affectedTask?.title}" from Day ${previousDay} directly to Day 1 (Immediate Next Step) of your sprint so you can master component boundaries before interviewing.`
        : `Performance was strong! Your sprint order remains optimized for bridging other gaps.`,
    },
  };

  return { evaluation, updatedTasks };
}

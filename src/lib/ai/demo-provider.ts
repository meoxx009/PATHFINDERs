import type {
  AIProvider,
  ResumeAnalysisInput,
  LearningPathInput,
  InterviewQuestionInput,
  InterviewEvaluationInput,
} from './provider';
import type {
  ResumeAnalysis,
  LearningPath,
  InterviewQuestion,
  InterviewEvaluation,
} from './schemas';

export class DemoAIProvider implements AIProvider {
  async analyzeResume(input: ResumeAnalysisInput): Promise<ResumeAnalysis> {
    const isFrontend = input.targetRole.toLowerCase().includes('front');
    const isData = input.targetRole.toLowerCase().includes('data');

    if (isFrontend) {
      return {
        summary: 'Alex Chen exhibits confirmed foundational web skills (HTML5, CSS3, vanilla JavaScript) with an interactive Task Tracker project. React is listed as a keyword but lacks component hierarchy or state evidence. API integration, automated testing, and accessibility represent high-priority gaps.',
        strengths: [
          {
            title: 'Semantic HTML & Layout',
            explanation: 'Built single-page layout using semantic elements and CSS3 Flexbox responsive across mobile and desktop breakpoints.',
            evidence: 'Built a single-page task management dashboard using HTML5 semantic tags and CSS3 Flexbox.',
          },
          {
            title: 'DOM State Manipulation',
            explanation: 'Demonstrated direct client-side task manipulation and browser state persistence without library assistance.',
            evidence: 'Implemented core task manipulation features (add, toggle complete, delete) using vanilla JavaScript DOM manipulation and localStorage.',
          },
        ],
        skills: [
          {
            name: 'HTML5 & Semantic Markup',
            level: 'demonstrated',
            evidence: 'Built a single-page task management dashboard using HTML5 semantic tags',
            confidence: 0.95,
          },
          {
            name: 'CSS3, Flexbox & Grid',
            level: 'demonstrated',
            evidence: 'Styled responsive layouts ensuring usability across mobile and desktop viewport breakpoints',
            confidence: 0.92,
          },
          {
            name: 'Modern JavaScript (ES6+)',
            level: 'demonstrated',
            evidence: 'Implemented core task manipulation features using vanilla JavaScript DOM manipulation and localStorage',
            confidence: 0.88,
          },
          {
            name: 'React & Component Architecture',
            level: 'partial',
            evidence: 'Listed "React (Basics)" in skills summary without project evidence or component breakdown',
            confidence: 0.45,
          },
          {
            name: 'API Integration & Async State',
            level: 'unknown',
            evidence: null,
            confidence: 0.1,
          },
          {
            name: 'Unit & Component Testing',
            level: 'unknown',
            evidence: null,
            confidence: 0.05,
          },
          {
            name: 'Web Performance & Accessibility',
            level: 'unknown',
            evidence: null,
            confidence: 0.1,
          },
        ],
        skillGaps: [
          {
            skill: 'React & Component Architecture',
            reason: 'Listed as a skill keyword, but lacks component breakdown, state contracts, or custom hooks in documented projects.',
            importance: 5,
            evidenceStatus: 'weak',
            recommendedAction: 'Refactor Task Tracker into modular components separating UI, custom hooks, and state logic.',
          },
          {
            skill: 'API Integration & Async State',
            reason: 'Missing completely from resume. Real-world frontend roles require handling asynchronous fetching, loading spinners, and network errors.',
            importance: 4,
            evidenceStatus: 'missing',
            recommendedAction: 'Connect Task Tracker to a public REST endpoint with skeleton loaders and error boundaries.',
          },
          {
            skill: 'Unit & Component Testing',
            reason: 'Zero automated testing evidenced. High filter criterion for entry-level candidates.',
            importance: 3,
            evidenceStatus: 'missing',
            recommendedAction: 'Write 4 unit tests using Vitest and React Testing Library.',
          },
          {
            skill: 'Web Performance & Accessibility',
            reason: 'No documented accessibility (a11y) audits or keyboard navigation implementation.',
            importance: 3,
            evidenceStatus: 'missing',
            recommendedAction: 'Audit accessibility using Lighthouse and document keyboard tab navigation in README.',
          },
        ],
        resumeImprovements: [
          {
            section: 'Projects',
            issue: 'Bullets describe features built rather than architectural decisions or business outcomes.',
            suggestion: 'Rewrite bullets using the Action Verb + Context + Outcome framework (e.g. "Engineered modular state flow reducing DOM repaints").',
            evidence: 'Built a single-page task management dashboard...',
          },
          {
            section: 'Technical Skills',
            issue: 'React is listed without verifiable implementation evidence in projects.',
            suggestion: 'Back up the React claim by documenting component hierarchy in your project bullets.',
            evidence: 'React (Basics)',
          },
        ],
        warnings: [
          'No deployment or production URL found on resume. Add a live Vercel/Netlify link so recruiters can evaluate your work immediately.',
        ],
      };
    }

    // Generic fallback for Data Analyst or Backend
    return {
      summary: `Analyzed resume for ${input.targetRole}. Verified core technical competencies and isolated high-priority gaps for entry-level hiring benchmarks.`,
      strengths: [
        {
          title: 'Core Technical Execution',
          explanation: 'Demonstrated hands-on technical execution in documented academic or personal projects.',
          evidence: input.resumeText.split('\n')[2] || 'Documented project work.',
        },
      ],
      skills: [
        {
          name: isData ? 'SQL & Relational Databases' : 'RESTful API Design & Routing',
          level: 'demonstrated',
          evidence: 'Verified project implementation documented in resume.',
          confidence: 0.9,
        },
        {
          name: isData ? 'Python & Pandas Wrangling' : 'Database Schema Design',
          level: 'partial',
          evidence: 'Mentioned in skills summary without measurable outcomes.',
          confidence: 0.5,
        },
      ],
      skillGaps: [
        {
          skill: isData ? 'Data Visualization & BI Storytelling' : 'Authentication & Security Best Practices',
          reason: 'Critical requirement for entry-level candidate screens.',
          importance: 5,
          evidenceStatus: 'missing',
          recommendedAction: 'Build a focused feature exercising this skill.',
        },
      ],
      resumeImprovements: [
        {
          section: 'Projects',
          issue: 'Missing quantifiable metrics.',
          suggestion: 'Quantify data volume or API response times in project bullets.',
          evidence: null,
        },
      ],
      warnings: [],
    };
  }

  async generateLearningPath(input: LearningPathInput): Promise<LearningPath> {
    const totalWeeks = input.durationDays / 7;
    const capacityHours = Math.round(input.hoursPerWeek * totalWeeks);
    const estMinutesPerTask = Math.round((capacityHours / 5) * 60);

    return {
      title: `${input.durationDays}-Day Sprint for ${input.targetRole}`,
      goal: `Bridge high-priority competency gaps for ${input.targetRole} entry-level hiring standards within ${capacityHours} total hours.`,
      durationDays: input.durationDays,
      hoursPerWeek: input.hoursPerWeek,
      tasks: [
        {
          id: `task-1-${Date.now().toString(36)}`,
          title: 'Component Architecture & State Breakdown',
          skill: 'React & Component Architecture',
          reason: 'Technical screens evaluate whether you can construct scalable, modular components instead of monolithic files.',
          description: 'Refactor project into distinct UI, container, and custom hook modules with documented prop types.',
          estimatedMinutes: estMinutesPerTask,
          priority: 'high',
          expectedOutcome: 'Modular 3-tier component architecture repository with no props drilling.',
          status: 'todo',
          source: 'skill_gap',
        },
        {
          id: `task-2-${Date.now().toString(36)}`,
          title: 'REST API Integration & Resilient Error Handling',
          skill: 'API Integration & Async State',
          reason: 'Real-world frontend applications ingest asynchronous APIs. Loading and error resilience is a mandatory interview expectation.',
          description: 'Connect project to a public API with skeleton loading states, try/catch error banners, and retry buttons.',
          estimatedMinutes: estMinutesPerTask,
          priority: 'high',
          expectedOutcome: 'Live API demo handling success, 404, and network timeout states gracefully.',
          status: 'todo',
          source: 'skill_gap',
        },
        {
          id: `task-3-${Date.now().toString(36)}`,
          title: 'Automated Component Test Suite with Vitest & RTL',
          skill: 'Unit & Component Testing',
          reason: 'Demonstrating automated component testing elevates candidates into the top tier of applicant pools.',
          description: 'Write 4 unit tests covering button click interactions, form submission, and error boundary alerts.',
          estimatedMinutes: estMinutesPerTask,
          priority: 'medium',
          expectedOutcome: 'Committed unit test suite with 100% passing test runner assertions.',
          status: 'todo',
          source: 'skill_gap',
        },
        {
          id: `task-4-${Date.now().toString(36)}`,
          title: 'Accessibility (WCAG) & Lighthouse Audit Polish',
          skill: 'Web Performance & Accessibility',
          reason: 'Modern engineering teams mandate accessible web apps that pass keyboard navigation and ARIA guidelines.',
          description: 'Run Chrome Lighthouse audit, optimize image assets, and fix contrast and keyboard focus states.',
          estimatedMinutes: estMinutesPerTask,
          priority: 'medium',
          expectedOutcome: 'Verified 95+ Lighthouse report badge added to your GitHub README.',
          status: 'todo',
          source: 'skill_gap',
        },
        {
          id: `task-5-${Date.now().toString(36)}`,
          title: 'Production Build Optimization & Continuous Deploy',
          skill: 'Build Tools & Deployment',
          reason: 'Hiring managers want to test a live production link immediately rather than clone and run locally.',
          description: 'Configure Vite build chunking and automated GitHub Actions or Vercel continuous deployment.',
          estimatedMinutes: estMinutesPerTask,
          priority: 'low',
          expectedOutcome: 'Live HTTPS production URL accessible on your resume header.',
          status: 'todo',
          source: 'skill_gap',
        },
      ],
      assumptions: [
        `Strictly fits ${input.hoursPerWeek} hours/week over ${input.durationDays} days (${capacityHours} total hours).`,
        `Tasks sorted deterministically by role importance, skill gap, and sprint deadline.`,
      ],
    };
  }

  async generateInterviewQuestion(_input: InterviewQuestionInput): Promise<InterviewQuestion> {
    return {
      question: `Walk me through the technical architecture of your Interactive Task Tracker Web App. How did you structure your components, isolate application state, and ensure the code is modular?`,
      questionType: 'project',
      difficulty: 'beginner',
      testedSkills: ['React & Component Architecture', 'Modern JavaScript (ES6+)', 'State Management'],
      answerFramework: 'STAR',
      preparationHint: 'Explain how state changes propagate without side-effects, how you separated data from UI, and how you would scale to React.',
      sampleAnswers: {
        weak: {
          label: 'Weak Answer (PRD §9 Trigger)',
          text: `Well, I put everything into an index.html and a script.js file. I used some global variables at the top to store the tasks array and wrote some functions to update the DOM with innerHTML. I didn't really split it into components or anything because it was just a small project, but it works whenever you click the buttons.`,
        },
        strong: {
          label: 'Strong Answer (STAR Method with Architecture)',
          text: `In my Task Tracker app, I separated concerns across three layers: UI presentation, state management, and persistence. For state, I maintained a single source of truth using an immutable array of task objects, encapsulating all mutations within dedicated helper functions to avoid side-effects. I structured the DOM into modular units—a task input form, filtered list container, and individual task items—each communicating via explicit event contracts. To persist data across sessions, I built an abstraction over localStorage with JSON schema parsing and error boundaries.`,
        },
      },
    };
  }

  async evaluateInterviewAnswer(input: InterviewEvaluationInput): Promise<InterviewEvaluation> {
    const wordCount = input.answer.trim().split(/\s+/).filter(Boolean).length;
    const lower = input.answer.toLowerCase();

    const isWeak =
      wordCount < 35 ||
      lower.includes('global variables') ||
      lower.includes("didn't really split") ||
      lower.includes('put everything into');

    if (isWeak) {
      return {
        overallSummary: 'The response revealed significant gaps in explaining modular code organization, state isolation, and component boundaries. Over-reliance on global state indicates a need for architectural practice.',
        overallScore: 2.0,
        strengths: [
          'Honest acknowledgment of current project implementation.',
        ],
        improvements: [
          'Admitted lack of architectural modularity and reliance on global state mutation.',
          'Did not demonstrate separation of concerns (presentation vs business logic vs storage).',
          'Lacked technical depth on immutability, data contracts, and scalability.',
        ],
        missingEvidence: [
          'Clear separation between presentation and data layers.',
          'Explanation of how state changes propagate without side-effects.',
          'Discussion of error boundaries or code reusability.',
        ],
        skillSignals: [
          {
            skill: 'React & Component Architecture',
            signal: 'weak',
            reason: 'Interview response revealed difficulty explaining modular component hierarchy and state isolation.',
          },
        ],
        nextPracticeTask: {
          title: 'Component Architecture & State Breakdown',
          skill: 'React & Component Architecture',
          reason: 'Your interview response showed difficulty explaining component modularity. Mastering component boundaries is critical to avoid technical screen rejection.',
          estimatedMinutes: 120,
        },
        adaptiveAction: {
          triggerAdaptiveShift: true,
          affectedTaskTitle: 'Component Architecture & State Breakdown',
          previousDay: 10,
          newDay: 1,
          explanation: 'Your path changed because your project explanation showed weak architecture evidence. Project Architecture Practice moved to Day 1.',
        },
      };
    }

    return {
      overallSummary: 'Outstanding technical articulation! Demonstrates clear working comprehension of modular architecture, unidirectional data flow, and state persistence.',
      overallScore: 4.6,
      strengths: [
        'Articulated clear architectural boundaries and modular separation across presentation, state, and persistence.',
        'Used precise engineering terminology (immutable state, abstractions, data flow contracts).',
        'Demonstrated practical foresight by discussing future React hook scaling.',
      ],
      improvements: [
        'Could briefly mention automated unit testing coverage for state mutations.',
      ],
      missingEvidence: [],
      skillSignals: [
        {
          skill: 'React & Component Architecture',
          signal: 'strong',
          reason: 'Clear working comprehension of modular architecture and component contracts validated.',
        },
      ],
      nextPracticeTask: {
        title: 'REST API Integration & Resilient Error Handling',
        skill: 'API Integration & Async State',
        reason: 'Architecture is solid; proceed to mastering third-party asynchronous data fetching.',
        estimatedMinutes: 120,
      },
      adaptiveAction: {
        triggerAdaptiveShift: false,
        affectedTaskTitle: 'Component Architecture & State Breakdown',
        previousDay: 1,
        newDay: 1,
        explanation: 'Performance was strong! Your sprint schedule remains optimized.',
      },
    };
  }
}

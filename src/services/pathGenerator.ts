import type { GapAnalysisResult, LearningTask, SprintDuration, TargetRoleId } from '../types';

export function generateLearningPath(
  gapAnalysis: GapAnalysisResult,
  targetRole: TargetRoleId,
  weeklyHours: number,
  durationDays: SprintDuration
): LearningTask[] {
  // Total available budget hours
  const totalWeeks = durationDays / 7;
  const budgetHours = Math.round(weeklyHours * totalWeeks);

  const rawTasks: Omit<LearningTask, 'id' | 'dayNumber' | 'completed'>[] = [];

  // 1. Generate tasks for High-Priority Missing Skills first
  for (const gap of gapAnalysis.highPriorityGaps) {
    const taskDetails = getTaskTemplateForSkill(gap.skill, targetRole, 'High');
    if (taskDetails) {
      rawTasks.push(taskDetails);
    }
  }

  // 2. Generate tasks for Partially Demonstrated Skills (to turn them into verifiable proof)
  for (const part of gapAnalysis.partial) {
    if (!rawTasks.some(t => t.skill === part.skill)) {
      const taskDetails = getTaskTemplateForSkill(part.skill, targetRole, 'Medium');
      if (taskDetails) {
        rawTasks.push(taskDetails);
      }
    }
  }

  // 3. Fallback or baseline tasks if gaps are few (e.g. Portfolio polish, System Architecture)
  const defaultFallbacks = getDefaultTasksForRole(targetRole);
  for (const fb of defaultFallbacks) {
    if (rawTasks.length < 6 && !rawTasks.some(t => t.title === fb.title)) {
      rawTasks.push(fb);
    }
  }

  // Guarantee at least 5-7 tasks
  const selectedTasks = rawTasks.slice(0, Math.max(5, Math.min(8, Math.floor(durationDays / 2) + 2)));

  // Calibrate hours to fit budget
  let currentSum = selectedTasks.reduce((acc, t) => acc + t.estimatedHours, 0);
  if (currentSum > budgetHours) {
    // scale down slightly
    selectedTasks.forEach(t => {
      t.estimatedHours = Math.max(1, Math.round((t.estimatedHours / currentSum) * budgetHours * 10) / 10);
    });
  }

  // Distribute over days (1 to durationDays)
  const interval = Math.floor(durationDays / selectedTasks.length);
  return selectedTasks.map((task, idx) => ({
    ...task,
    id: `task-${idx + 1}-${Date.now().toString(36)}`,
    dayNumber: Math.min(durationDays, Math.max(1, idx * interval + 1)),
    completed: false,
  }));
}

function getTaskTemplateForSkill(
  skill: string,
  role: TargetRoleId,
  priority: 'High' | 'Medium' | 'Low'
): Omit<LearningTask, 'id' | 'dayNumber' | 'completed'> | null {
  const templates: Record<string, Omit<LearningTask, 'id' | 'dayNumber' | 'completed'>> = {
    'React & Component Architecture': {
      title: 'Component Architecture & State Breakdown',
      skill: 'React & Component Architecture',
      priority,
      estimatedHours: 2.0,
      reasonItMatters: 'Interviews evaluate if you can structure scalable, modular components instead of giant monolithic files.',
      learningAction: 'Study React functional components, custom hooks, and lifting state up with proper prop contracts.',
      practiceTask: 'Refactor your project or build a mini-app separating container logic, presentational UI, and custom hooks.',
      expectedOutcome: 'A clean 3-tier component hierarchy repository with documented prop types and no props drilling.',
    },
    'API Integration & Asynchronous State': {
      title: 'REST API Integration & Resilient Error Handling',
      skill: 'API Integration & Asynchronous State',
      priority,
      estimatedHours: 2.5,
      reasonItMatters: 'Almost all real frontend applications ingest backend data. Knowing how to handle loading, error, and offline states is a core requirement.',
      learningAction: 'Review Async/Await, AbortController, HTTP status code checks, and optimistic UI updates.',
      practiceTask: 'Connect your project to a public API (e.g. GitHub API, Weather API, or mock JSON) with spinner states and retry banners.',
      expectedOutcome: 'Live API demo handling success, 404, and network timeout states gracefully.',
    },
    'Unit & Component Testing': {
      title: 'Component Test Suite with Vitest & RTL',
      skill: 'Unit & Component Testing',
      priority: 'Medium',
      estimatedHours: 1.5,
      reasonItMatters: 'Demonstrating automated testing immediately puts entry-level candidates in the top 15% of applicant pools.',
      learningAction: 'Learn query selection by role (screen.getByRole), userEvent interaction testing, and assertions.',
      practiceTask: 'Write 4 unit tests covering button click, form validation, and error alert rendering.',
      expectedOutcome: 'Green test runner output screenshot and committed test suite in your repo.',
    },
    'Web Performance & Accessibility (a11y)': {
      title: 'Accessibility (WCAG) & Lighthouse Audit Polish',
      skill: 'Web Performance & Accessibility (a11y)',
      priority: 'Medium',
      estimatedHours: 1.5,
      reasonItMatters: 'Modern teams require accessible web apps that pass keyboard navigation and ARIA guidelines.',
      learningAction: 'Audit your app using Chrome Lighthouse and axe DevTools for contrast, alt tags, and tabindex.',
      practiceTask: 'Achieve a 95+ Lighthouse Accessibility score and document keyboard tab order navigation.',
      expectedOutcome: 'Verified 95+ Lighthouse report badge added to your GitHub README.',
    },
    'Build Tools & Deployment': {
      title: 'Production Build Optimization & CI/CD Deploy',
      skill: 'Build Tools & Deployment',
      priority: 'Low',
      estimatedHours: 1.0,
      reasonItMatters: 'Hiring managers want to test a live link immediately rather than clone and run locally.',
      learningAction: 'Configure Vite production build chunking and automated GitHub Actions or Vercel continuous deployment.',
      practiceTask: 'Deploy your project with custom meta tags, favicon, and continuous deploy on git push.',
      expectedOutcome: 'Live HTTPS production URL accessible on your resume and LinkedIn.',
    },

    // Data Analyst Templates
    'SQL & Relational Databases': {
      title: 'Advanced SQL Querying & Multi-Table Joins',
      skill: 'SQL & Relational Databases',
      priority,
      estimatedHours: 2.5,
      reasonItMatters: 'SQL technical screens test complex aggregations, window functions, and business cohorting.',
      learningAction: 'Practice ROW_NUMBER, DENSE_RANK, CTEs, and self-joins on realistic business schemas.',
      practiceTask: 'Solve 5 business case problems (e.g. monthly retention, top 3 customers per region) on LeetCode/StrataScratch.',
      expectedOutcome: 'A documented SQL cheat sheet and committed SQL solutions with query execution plans.',
    },
    'Python / R for Data Manipulation': {
      title: 'Pandas Data Wrangling & Outlier Detection Pipeline',
      skill: 'Python / R for Data Manipulation',
      priority,
      estimatedHours: 2.0,
      reasonItMatters: 'Data in the real world is messy; proving you can clean missing values and transform structures is essential.',
      learningAction: 'Master Pandas groupby, melt/pivot_table, date parsing, and vectorization.',
      practiceTask: 'Build an automated cleaning pipeline script on a raw CSV dataset handling nulls, formatting dates, and logging anomalies.',
      expectedOutcome: 'Clean Jupyter Notebook showcasing before-and-after data profiles.',
    },
    'Data Visualization & BI Dashboards': {
      title: 'Executive BI Dashboard Design with Drill-Downs',
      skill: 'Data Visualization & BI Dashboards',
      priority,
      estimatedHours: 2.0,
      reasonItMatters: 'Visualizations must guide decision-making, not just look colorful.',
      learningAction: 'Study chart selection rules, color accessibility, and KPI scorecards.',
      practiceTask: 'Design a 3-tab interactive dashboard in Tableau or PowerBI featuring KPI summaries, trends, and category drill-downs.',
      expectedOutcome: 'Published interactive dashboard with a 2-minute Loom or README walkthrough.',
    },
    'Statistical Analysis & Hypothesis Testing': {
      title: 'A/B Testing Framework & Significance Analysis',
      skill: 'Statistical Analysis & Hypothesis Testing',
      priority: 'Medium',
      estimatedHours: 1.5,
      reasonItMatters: 'Answering "is this metric difference real or random chance?" is foundational for analyst interviews.',
      learningAction: 'Study two-sample t-tests, chi-squared tests, sample size determination, and p-value interpretation.',
      practiceTask: 'Simulate an A/B landing page conversion experiment in Python and calculate 95% confidence intervals.',
      expectedOutcome: 'Hypothesis testing report summarizing sample size, p-value, and executive recommendation.',
    },

    // Backend Developer Templates
    'RESTful API Design & Routing': {
      title: 'RESTful API Specification & Validation Architecture',
      skill: 'RESTful API Design & Routing',
      priority,
      estimatedHours: 2.5,
      reasonItMatters: 'Standardized HTTP status codes, payload validations, and resource naming are assessed in all backend interviews.',
      learningAction: 'Learn REST constraints, JSON schema validation (Zod / Joi / Pydantic), and query parameter pagination.',
      practiceTask: 'Build 5 CRUD endpoints with request body validation, pagination filters, and consistent error envelopes.',
      expectedOutcome: 'OpenAPI / Postman collection with 100% passing contract tests.',
    },
    'Database Design & Queries (SQL/NoSQL)': {
      title: 'Database Schema Normalization & Index Optimization',
      skill: 'Database Design & Queries (SQL/NoSQL)',
      priority,
      estimatedHours: 2.0,
      reasonItMatters: 'Unindexed slow queries break systems at scale. Interviewers probe indexing and relationship modeling.',
      learningAction: 'Study 1-to-many and many-to-many relational modeling, compound indexes, and explain analyze plans.',
      practiceTask: 'Design an Entity-Relationship Diagram (ERD) and benchmark query performance with and without compound indexes.',
      expectedOutcome: 'Benchmarked query log proving a 10x query speedup with proper indexing.',
    },
    'Authentication & Security Best Practices': {
      title: 'Secure JWT Auth & Role-Based Access Control',
      skill: 'Authentication & Security Best Practices',
      priority,
      estimatedHours: 2.0,
      reasonItMatters: 'Security flaws in authentication are critical red flags in entry-level coding submissions.',
      learningAction: 'Study HTTP-only cookies vs authorization headers, token expiration, refresh rotation, and bcrypt salt rounds.',
      practiceTask: 'Implement user login, signup, password hashing, and protected route middleware.',
      expectedOutcome: 'Secure authentication middleware with unit tests verifying unauthorized 401/403 responses.',
    },
  };

  if (templates[skill]) {
    return templates[skill];
  }

  // Generic generator based on skill
  return {
    title: `Practical Mastery: ${skill}`,
    skill,
    priority,
    estimatedHours: 1.5,
    reasonItMatters: `Directly bridges an identified capability gap required for entry-level ${role.replace('_', ' ')} positions.`,
    learningAction: `Study core industry patterns, documentation, and reference implementations for ${skill}.`,
    practiceTask: `Build a standalone focused code module or case study exercising ${skill} under realistic constraints.`,
    expectedOutcome: `Documented code sample or analytical writeup demonstrating working knowledge.`,
  };
}

function getDefaultTasksForRole(role: TargetRoleId): Omit<LearningTask, 'id' | 'dayNumber' | 'completed'>[] {
  if (role === 'frontend') {
    return [
      {
        title: 'Project Architecture & Component Hierarchy',
        skill: 'React & Component Architecture',
        priority: 'High',
        estimatedHours: 2.0,
        reasonItMatters: 'Architecting clean component boundaries prevents bugs and proves seniority in entry-level interviews.',
        learningAction: 'Study smart vs dumb components, separation of concerns, and clean state lifting.',
        practiceTask: 'Diagram and refactor your primary project into clear UI, container, and utility modules.',
        expectedOutcome: 'Modular architecture diagram and clean folder structure documentation.',
      },
      {
        title: 'Resume Star-Method Bullet Refinement',
        skill: 'Modern JavaScript (ES6+)',
        priority: 'Medium',
        estimatedHours: 1.0,
        reasonItMatters: 'Resume bullets need quantifiable outcomes to get recruiters past the 6-second scan.',
        learningAction: 'Rewrite project bullets into [Action Verb] + [Specific Tech] + [Measurable Result].',
        practiceTask: 'Rewrite your 3 main resume project bullets using the revised metric framework.',
        expectedOutcome: 'Updated resume section with 3 high-impact, evidence-backed bullets.',
      },
    ];
  } else if (role === 'data_analyst') {
    return [
      {
        title: 'Business Metric Case Study & Storytelling',
        skill: 'Business Metric Translation & Storytelling',
        priority: 'High',
        estimatedHours: 2.0,
        reasonItMatters: 'Hiring managers hire analysts who can recommend business actions, not just run queries.',
        learningAction: 'Study how to write executive summaries translating findings into revenue or cost savings.',
        practiceTask: 'Draft a 1-page executive memo for your top project with 3 actionable recommendations.',
        expectedOutcome: 'Polished 1-page executive briefing document.',
      },
    ];
  } else {
    return [
      {
        title: 'Centralized Error Handling & Logging Middleware',
        skill: 'Error Handling & Structured Logging',
        priority: 'High',
        estimatedHours: 2.0,
        reasonItMatters: 'Clean error handling prevents uncaught crashes and ensures uniform API response formats.',
        learningAction: 'Study Express/FastAPI exception filters, custom AppError classes, and HTTP status codes.',
        practiceTask: 'Write a global error handler catching validation errors, 404s, and unexpected 500 exceptions.',
        expectedOutcome: 'Centralized error handler with standardized JSON error responses.',
      },
    ];
  }
}

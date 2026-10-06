import type { ExtractedResume, GapAnalysisResult, SkillEvidence, TargetRoleId } from '../types';
import { ROLE_TAXONOMIES } from '../data/roleTaxonomies';
import { evaluateSkill } from './competencyAlgorithm';
import type { SkillJudgementResult } from './competencyAlgorithm';

export interface AnalyzerOptions {
  selfAssessment?: Record<string, number>;
  diagnosticScores?: Record<string, number>;
  interviewSignals?: Record<string, number>;
  taskCompletions?: Record<string, number>;
  durationDays?: number;
  disputedSkills?: string[];
  hiddenSkills?: string[];
  customSkills?: SkillJudgementResult[];
}

export function analyzeResume(
  resumeText: string, 
  targetRoleId: TargetRoleId,
  options?: AnalyzerOptions
): {
  extractedResume: ExtractedResume;
  gapAnalysis: GapAnalysisResult;
} {
  const lines = resumeText.split('\n').map(l => l.trim()).filter(Boolean);
  const normalizedText = resumeText.toLowerCase();

  // Extract Name (typically first non-empty line)
  const candidateName = lines.length > 0 && lines[0].length < 40 ? lines[0] : 'Candidate';

  // Basic Section Parsers
  const education: ExtractedResume['education'] = [];
  const experience: ExtractedResume['experience'] = [];
  const projects: ExtractedResume['projects'] = [];

  // Parse Education
  let inEducation = false;
  let inExperience = false;
  let inProjects = false;
  let currentProject: { name: string; description: string; technologies: string[]; evidenceSnippets: string[] } | null = null;
  let currentExp: { role: string; company: string; period?: string; highlights: string[] } | null = null;

  for (const line of lines) {
    const lower = line.toLowerCase();

    if (lower.includes('education')) {
      inEducation = true;
      inExperience = false;
      inProjects = false;
      continue;
    } else if (lower.includes('experience') || lower.includes('work history') || lower.includes('employment')) {
      inEducation = false;
      inExperience = true;
      inProjects = false;
      continue;
    } else if (lower.includes('projects') || lower.includes('personal projects')) {
      inEducation = false;
      inExperience = false;
      inProjects = true;
      continue;
    } else if (lower.includes('technical skills') || lower.includes('skills &') || lower.includes('certifications')) {
      inEducation = false;
      inExperience = false;
      inProjects = false;
      continue;
    }

    if (inEducation) {
      if (lower.includes('university') || lower.includes('college') || lower.includes('b.s.') || lower.includes('bachelor') || lower.includes('degree')) {
        education.push({
          institution: line.split('—')[0] || line.split('-')[0] || line,
          degree: line.includes('—') ? line.split('—')[1] : (line.includes('-') ? line.split('-')[1] : line),
        });
      }
    }

    if (inProjects) {
      if ((line.includes('|') || line.includes('—') || line.startsWith('Project:') || (line === line.toUpperCase() && line.length > 4)) && !line.startsWith('-') && !line.startsWith('•')) {
        if (currentProject) projects.push(currentProject);
        const namePart = line.split('|')[0].replace('Project:', '').trim();
        currentProject = {
          name: namePart,
          description: '',
          technologies: [],
          evidenceSnippets: [],
        };
      } else if (currentProject && (line.startsWith('-') || line.startsWith('•') || line.length > 15)) {
        const cleanSnippet = line.replace(/^[-•*]\s*/, '').trim();
        currentProject.evidenceSnippets.push(cleanSnippet);
        if (!currentProject.description) {
          currentProject.description = cleanSnippet;
        } else {
          currentProject.description += ' ' + cleanSnippet;
        }
      }
    }

    if (inExperience) {
      if ((line.includes('|') || line.includes('—') || (line.includes('(') && line.includes(')'))) && !line.startsWith('-') && !line.startsWith('•')) {
        if (currentExp) experience.push(currentExp);
        const parts = line.split(/[|—]/);
        currentExp = {
          role: parts[0]?.trim() || line,
          company: parts[1]?.trim() || 'Organization',
          highlights: [],
        };
      } else if (currentExp && (line.startsWith('-') || line.startsWith('•'))) {
        currentExp.highlights.push(line.replace(/^[-•*]\s*/, '').trim());
      }
    }
  }

  if (currentProject) projects.push(currentProject);
  if (currentExp) experience.push(currentExp);

  // Fallback: If no structured projects were parsed, extract lines that describe building things
  if (projects.length === 0) {
    const projectLikeLines = lines.filter(l => 
      (l.toLowerCase().includes('built') || l.toLowerCase().includes('developed') || l.toLowerCase().includes('implemented') || l.toLowerCase().includes('created')) &&
      l.length > 20
    );
    if (projectLikeLines.length > 0) {
      projects.push({
        name: 'Identified Project / Work',
        description: projectLikeLines.join(' '),
        technologies: [],
        evidenceSnippets: projectLikeLines.map(l => l.replace(/^[-•*]\s*/, '').trim()),
      });
    }
  }

  // Taxonomy comparison
  const roleTaxonomy = ROLE_TAXONOMIES[targetRoleId] || ROLE_TAXONOMIES.frontend;
  const demonstrated: SkillEvidence[] = [];
  const partial: SkillEvidence[] = [];
  const missing: SkillEvidence[] = [];
  const extractedSkillsSet = new Set<string>();

  // Helper: Find verbatim excerpt from resume for a given search term
  function findVerbatimExcerpt(searchTerms: string[]): string | undefined {
    for (const term of searchTerms) {
      const lowerTerm = term.toLowerCase();
      // Search in project evidence snippets first
      for (const p of projects) {
        for (const snip of p.evidenceSnippets) {
          if (snip.toLowerCase().includes(lowerTerm)) {
            return `"${snip}" (from project: ${p.name})`;
          }
        }
      }
      // Search in experience highlights
      for (const e of experience) {
        for (const h of e.highlights) {
          if (h.toLowerCase().includes(lowerTerm)) {
            return `"${h}" (from experience at: ${e.company})`;
          }
        }
      }
      // Search in any line of resume
      for (const line of lines) {
        if (line.toLowerCase().includes(lowerTerm) && line.length > 15) {
          return `"${line.replace(/^[-•*]\s*/, '').trim()}"`;
        }
      }
    }
    return undefined;
  }

  // Check each skill in taxonomy
  for (const req of roleTaxonomy.requiredSkills) {
    const skillTerms = getKeywordsForSkill(req.skill);
    const hasAnyMention = skillTerms.some(term => normalizedText.includes(term.toLowerCase()));
    
    // Check if it has project or experience evidence (Demonstrated) vs only list mention (Partial)
    let projectEvidenceQuote: string | undefined;
    for (const term of skillTerms) {
      const lowerTerm = term.toLowerCase();
      for (const p of projects) {
        for (const snip of p.evidenceSnippets) {
          if (snip.toLowerCase().includes(lowerTerm)) {
            projectEvidenceQuote = `"${snip}" (Project: ${p.name})`;
            break;
          }
        }
        if (projectEvidenceQuote) break;
      }
      if (projectEvidenceQuote) break;
    }

    if (projectEvidenceQuote) {
      // Demonstrated with verbatim excerpt
      demonstrated.push({
        skill: req.skill,
        category: req.category,
        quality: 'demonstrated',
        evidenceExcerpt: projectEvidenceQuote,
        explanation: `Demonstrated through verified hands-on implementation in project documentation.`,
        importance: req.importance,
      });
      extractedSkillsSet.add(req.skill);
    } else if (hasAnyMention) {
      // Partially demonstrated: mentioned in skills list or coursework but lacking project execution proof
      const mentionExcerpt = findVerbatimExcerpt(skillTerms) || `Mentioned keyword in skills section without implementation detail.`;
      partial.push({
        skill: req.skill,
        category: req.category,
        quality: 'partial',
        evidenceExcerpt: mentionExcerpt,
        explanation: `Mentioned in skills summary or coursework, but lacks practical project proof, production metrics, or code implementation details.`,
        importance: req.importance,
      });
      extractedSkillsSet.add(req.skill);
    } else {
      // Missing
      missing.push({
        skill: req.skill,
        category: req.category,
        quality: 'missing',
        explanation: `Not identified in resume. Critical requirement for entry-level ${roleTaxonomy.title} evaluations.`,
        importance: req.importance,
      });
    }
  }

  // Also collect any additional recognized technical tools from resume
  const commonTools = ['Git', 'GitHub', 'VS Code', 'Figma', 'Postman', 'Docker', 'Linux', 'Jupyter', 'Excel'];
  for (const tool of commonTools) {
    if (normalizedText.includes(tool.toLowerCase())) {
      extractedSkillsSet.add(tool);
    }
  }

  // Identify high priority gaps (Missing or Partial critical/high skills)
  const highPriorityGaps = [
    ...missing.filter(s => s.importance === 'critical' || s.importance === 'high'),
    ...partial.filter(s => s.importance === 'critical'),
  ];

  // Calculate readiness score
  const totalWeight = roleTaxonomy.requiredSkills.reduce((sum, s) => sum + (s.importance === 'critical' ? 3 : s.importance === 'high' ? 2 : 1), 0);
  const earnedWeight = 
    demonstrated.reduce((sum, s) => sum + (s.importance === 'critical' ? 3 : s.importance === 'high' ? 2 : 1), 0) * 1.0 +
    partial.reduce((sum, s) => sum + (s.importance === 'critical' ? 3 : s.importance === 'high' ? 2 : 1), 0) * 0.45;
  const overallReadinessScore = Math.min(100, Math.round((earnedWeight / totalWeight) * 100));

  // Truthful suggestions & weaknesses
  const strengths: string[] = demonstrated.map(d => `${d.skill}: Verified via ${d.evidenceExcerpt ? 'resume project evidence' : 'documented work'}`);
  const weakEvidenceAreas: string[] = partial.map(p => `${p.skill}: Listed as a skill, but lacks concrete project context, code snippets, or outcome measurements.`);
  const missingCriticalInfo: string[] = missing.map(m => `${m.skill} (Importance: ${m.importance.toUpperCase()})`);

  const truthfulSuggestions: string[] = [
    ...partial.map(p => `Add 1-2 bullet points demonstrating practical usage of ${p.skill} with quantifiable project outcomes.`),
    ...missing.filter(m => m.importance === 'critical').map(m => `Prioritize building a focused project or feature incorporating ${m.skill} before applying.`),
    `Ensure every bullet point follows the Action Verb + Context + Outcome framework rather than passive task listing.`,
  ];

  // Transparent multi-signal competency algorithm
  const hiddenSet = new Set(options?.hiddenSkills || []);
  const disputedSet = new Set(options?.disputedSkills || []);

  const judgements: SkillJudgementResult[] = roleTaxonomy.requiredSkills
    .filter(req => !hiddenSet.has(req.skill))
    .map(req => {
      const isDisputed = disputedSet.has(req.skill);
      let resumeScore = 0;
      let excerpt: string | undefined;

      if (!isDisputed) {
        const demoMatch = demonstrated.find(d => d.skill === req.skill);
        const partMatch = partial.find(p => p.skill === req.skill);
        if (demoMatch) {
          resumeScore = 3.5;
          excerpt = demoMatch.evidenceExcerpt;
        } else if (partMatch) {
          resumeScore = 1.5;
          excerpt = partMatch.evidenceExcerpt;
        }
      }

      const selfScore = options?.selfAssessment?.[req.skill] ?? options?.selfAssessment?.[req.skill.toLowerCase()];
      const diagScore = options?.diagnosticScores?.[req.skill] ?? options?.diagnosticScores?.[req.skill.toLowerCase()];
      const interviewScore = options?.interviewSignals?.[req.skill];
      const taskScore = options?.taskCompletions?.[req.skill];

      const reqLevel = req.importance === 'critical' ? 4 : req.importance === 'high' ? 3 : 2;

      const result = evaluateSkill({
        skillId: req.skill.toLowerCase().replace(/[^a-z0-9]/g, '_'),
        skillName: req.skill,
        category: req.category,
        requiredLevel: reqLevel,
        importance: req.importance,
        signals: {
          selfAssessmentScore: selfScore,
          resumeEvidenceScore: resumeScore,
          diagnosticScore: diagScore,
          interviewSignalScore: interviewScore,
          taskCompletionScore: taskScore,
          evidenceExcerpt: excerpt,
          isRecent: true,
        },
        durationDays: options?.durationDays || 14,
        benchmarkDescription: req.benchmarkDescription,
      });

      if (isDisputed) {
        result.userDisputed = true;
      }
      return result;
    });

  // Append any custom skills added by user
  if (options?.customSkills) {
    for (const custom of options.customSkills) {
      if (!hiddenSet.has(custom.skillName)) {
        judgements.push(custom);
      }
    }
  }

  return {
    extractedResume: {
      rawText: resumeText,
      candidateName,
      education: education.length > 0 ? education : [{ institution: 'Undergraduate Program', degree: 'Relevant Field' }],
      experience,
      projects,
      extractedSkills: Array.from(extractedSkillsSet),
      strengths,
      weakEvidenceAreas,
      missingCriticalInfo,
      truthfulSuggestions,
    },
    gapAnalysis: {
      demonstrated,
      partial,
      missing,
      highPriorityGaps,
      overallReadinessScore,
      summary: `Analyzed ${roleTaxonomy.requiredSkills.length} benchmark competencies for ${roleTaxonomy.title}. Found ${demonstrated.length} demonstrated skills with verifiable evidence, ${partial.length} partially evidenced competencies, and ${missing.length} unevidenced gaps.`,
      judgements,
      disputedSkills: options?.disputedSkills || [],
      hiddenSkills: options?.hiddenSkills || [],
      customSkills: options?.customSkills || [],
    },
  };
}

function getKeywordsForSkill(skillName: string): string[] {
  const map: Record<string, string[]> = {
    'HTML5 & Semantic Markup': ['html', 'html5', 'semantic tags', 'semantic markup', 'dom'],
    'CSS3, Flexbox & Grid': ['css', 'css3', 'flexbox', 'grid', 'responsive', 'tailwind', 'bootstrap'],
    'Modern JavaScript (ES6+)': ['javascript', 'js', 'es6', 'typescript', 'promises', 'async', 'vanilla javascript'],
    'React & Component Architecture': ['react', 'react.js', 'reactjs', 'components', 'hooks', 'jsx'],
    'API Integration & Asynchronous State': ['api', 'rest api', 'fetch', 'axios', 'endpoints', 'http', 'async state'],
    'Web Performance & Accessibility (a11y)': ['accessibility', 'a11y', 'performance', 'lighthouse', 'aria', 'lazy loading'],
    'Version Control & Git Collaboration': ['git', 'github', 'gitlab', 'version control', 'pull request', 'pr'],
    'Unit & Component Testing': ['testing', 'jest', 'vitest', 'react testing library', 'rtl', 'unit tests'],
    'Build Tools & Deployment': ['vite', 'webpack', 'deploy', 'vercel', 'netlify', 'npm', 'ci/cd'],
    
    // Data Analyst
    'SQL & Relational Databases': ['sql', 'postgresql', 'mysql', 'sqlite', 'joins', 'query', 'queries', 'database'],
    'Python / R for Data Manipulation': ['python', 'pandas', 'numpy', 'r', 'data manipulation', 'jupyter'],
    'Data Visualization & BI Dashboards': ['tableau', 'powerbi', 'power bi', 'matplotlib', 'seaborn', 'dashboard', 'visualization'],
    'Statistical Analysis & Hypothesis Testing': ['statistics', 'hypothesis testing', 'a/b testing', 'regression', 'probability', 'p-value'],
    'Data Cleaning & Transformation (ETL)': ['data cleaning', 'etl', 'data transformation', 'missing values', 'normalization'],
    'Business Metric Translation & Storytelling': ['metrics', 'churn', 'kpi', 'retention', 'revenue', 'business intelligence', 'storytelling'],
    'Spreadsheet Modeling (Excel/Sheets)': ['excel', 'google sheets', 'pivot table', 'xlookup', 'vlookup', 'spreadsheets'],

    // Backend
    'Server-side Language & Runtime': ['node', 'node.js', 'nodejs', 'python', 'fastapi', 'django', 'java', 'golang', 'express'],
    'RESTful API Design & Routing': ['rest', 'restful', 'api', 'endpoints', 'crud', 'routing', 'postman'],
    'Database Design & Queries (SQL/NoSQL)': ['mongodb', 'mongoose', 'postgres', 'postgresql', 'mysql', 'prisma', 'nosql', 'sql', 'schema'],
    'Authentication & Security Best Practices': ['jwt', 'json web token', 'bcrypt', 'auth', 'authentication', 'oauth', 'security'],
    'Error Handling & Structured Logging': ['error handling', 'middleware', 'logging', 'winston', 'exceptions'],
    'Testing (Unit & Integration)': ['testing', 'supertest', 'pytest', 'jest', 'integration test', 'unit test'],
    'Containerization & Cloud Deployment': ['docker', 'container', 'dockerfile', 'aws', 'render', 'cloud'],
  };

  return map[skillName] || [skillName.toLowerCase()];
}

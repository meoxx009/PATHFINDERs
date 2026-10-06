import type { 
  ExtractedResume, 
  GapAnalysisResult, 
  SkillEvidence, 
  TargetRoleId,
  CandidateSummary,
  SkillEvidenceMapItem,
  ProjectAnalysisItem,
  RoleAlignmentItem,
  ResumeImprovementItem,
  EvidenceClassificationType
} from '../types';
import { getRoleTaxonomy } from '../data/roleTaxonomies';
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

  // 1. Extract Name (typically first non-empty line)
  const candidateName = lines.length > 0 && lines[0].length < 40 ? lines[0] : 'Candidate';

  // 2. Extract Links (GitHub, Portfolio, LinkedIn)
  const githubLinks: string[] = [];
  const portfolioLinks: string[] = [];
  const linkedinLinks: string[] = [];

  for (const line of lines) {
    const ghMatches = line.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[A-Za-z0-9_.-]+/gi);
    if (ghMatches) githubLinks.push(...ghMatches);

    const liMatches = line.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[A-Za-z0-9_.-]+/gi);
    if (liMatches) linkedinLinks.push(...liMatches);

    const portMatches = line.match(/(?:https?:\/\/)?(?:www\.)?[A-Za-z0-9_.-]+\.(?:vercel\.app|netlify\.app|github\.io|dev|io|me|org)/gi);
    if (portMatches) portfolioLinks.push(...portMatches);
  }

  // 3. Section Parsers
  const education: ExtractedResume['education'] = [];
  const experience: ExtractedResume['experience'] = [];
  const projects: ExtractedResume['projects'] = [];
  const coursework: string[] = [];
  const certifications: string[] = [];
  const competitions: string[] = [];
  const publications: string[] = [];

  let inEducation = false;
  let inExperience = false;
  let inProjects = false;
  let inCoursework = false;
  let inCerts = false;

  let currentProject: { name: string; description: string; technologies: string[]; evidenceSnippets: string[] } | null = null;
  let currentExp: { role: string; company: string; period?: string; highlights: string[] } | null = null;

  for (const line of lines) {
    const lower = line.toLowerCase();

    if (lower.includes('education') || lower.includes('academic background')) {
      inEducation = true; inExperience = false; inProjects = false; inCoursework = false; inCerts = false;
      continue;
    } else if (lower.includes('experience') || lower.includes('work history') || lower.includes('employment') || lower.includes('internship')) {
      inEducation = false; inExperience = true; inProjects = false; inCoursework = false; inCerts = false;
      continue;
    } else if (lower.includes('projects') || lower.includes('personal projects') || lower.includes('academic projects')) {
      inEducation = false; inExperience = false; inProjects = true; inCoursework = false; inCerts = false;
      continue;
    } else if (lower.includes('coursework') || lower.includes('relevant courses')) {
      inEducation = false; inExperience = false; inProjects = false; inCoursework = true; inCerts = false;
      continue;
    } else if (lower.includes('certifications') || lower.includes('certificates') || lower.includes('licenses')) {
      inEducation = false; inExperience = false; inProjects = false; inCoursework = false; inCerts = true;
      continue;
    } else if (lower.includes('technical skills') || lower.includes('skills & tools') || lower.includes('competencies')) {
      inEducation = false; inExperience = false; inProjects = false; inCoursework = false; inCerts = false;
      continue;
    }

    // Education extraction
    if (inEducation) {
      if (lower.includes('university') || lower.includes('college') || lower.includes('institute') || lower.includes('bachelor') || lower.includes('b.tech') || lower.includes('b.e.') || lower.includes('b.s.') || lower.includes('m.s.') || lower.includes('degree')) {
        education.push({
          institution: line.split(/[|—–-]/)[0]?.trim() || line,
          degree: line.includes('|') ? line.split('|')[1]?.trim() : (line.includes('—') ? line.split('—')[1]?.trim() : line),
        });
      }
    }

    // Projects extraction
    if (inProjects) {
      const isBullet = line.startsWith('-') || line.startsWith('•') || line.startsWith('*');
      if (!isBullet && line.length > 3 && line.length < 80 && !lower.includes('projects') && !lower.includes('technical skills')) {
        if (currentProject) projects.push(currentProject);
        const namePart = line.split(/[|—–]/)[0].replace(/^Project:\s*/i, '').trim();
        currentProject = {
          name: namePart,
          description: '',
          technologies: [],
          evidenceSnippets: [],
        };
      } else if (currentProject && isBullet) {
        const cleanSnippet = line.replace(/^[-•*]\s*/, '').trim();
        currentProject.evidenceSnippets.push(cleanSnippet);
        if (!currentProject.description) {
          currentProject.description = cleanSnippet;
        } else {
          currentProject.description += ' ' + cleanSnippet;
        }
      } else if (currentProject && line.length > 15) {
        const cleanSnippet = line.trim();
        currentProject.evidenceSnippets.push(cleanSnippet);
        if (!currentProject.description) {
          currentProject.description = cleanSnippet;
        } else {
          currentProject.description += ' ' + cleanSnippet;
        }
      }
    }

    // Work / Internship extraction
    if (inExperience) {
      if ((line.includes('|') || line.includes('—') || (line.includes('(') && line.includes(')'))) && !line.startsWith('-') && !line.startsWith('•')) {
        if (currentExp) experience.push(currentExp);
        const parts = line.split(/[|—–]/);
        currentExp = {
          role: parts[0]?.trim() || line,
          company: parts[1]?.trim() || 'Organization',
          highlights: [],
        };
      } else if (currentExp && (line.startsWith('-') || line.startsWith('•'))) {
        currentExp.highlights.push(line.replace(/^[-•*]\s*/, '').trim());
      }
    }

    // Coursework & Certs
    if (inCoursework && line.length > 3) coursework.push(line.replace(/^[-•*]\s*/, '').trim());
    if (inCerts && line.length > 3) certifications.push(line.replace(/^[-•*]\s*/, '').trim());

    // Competitions & Publications detection across any line
    if (lower.includes('hackathon') || lower.includes('competition') || lower.includes('contest') || lower.includes('icpc') || lower.includes('formula student') || lower.includes('robocon') || lower.includes('solar car')) {
      competitions.push(line.replace(/^[-•*]\s*/, '').trim());
    }
    if (lower.includes('paper') || lower.includes('publication') || lower.includes('conference') || lower.includes('journal') || lower.includes('ieee')) {
      publications.push(line.replace(/^[-•*]\s*/, '').trim());
    }
  }

  if (currentProject) projects.push(currentProject);
  if (currentExp) experience.push(currentExp);

  // Fallback: If no structured projects were identified, extract lines that describe building things
  if (projects.length === 0) {
    const projectLikeLines = lines.filter(l => 
      (l.toLowerCase().includes('built') || l.toLowerCase().includes('developed') || l.toLowerCase().includes('implemented') || l.toLowerCase().includes('created') || l.toLowerCase().includes('designed')) &&
      l.length > 20
    );
    if (projectLikeLines.length > 0) {
      projects.push({
        name: 'Technical Project Implementation',
        description: projectLikeLines.join(' '),
        technologies: [],
        evidenceSnippets: projectLikeLines.map(l => l.replace(/^[-•*]\s*/, '').trim()),
      });
    }
  }

  // 4. Extract Quantified Metrics
  const quantifiedMetrics: string[] = [];
  const createMetricRegex = () => /\b(?:\d+%\s*(?:increase|reduction|improvement|speedup|growth|faster|decrease|drop|optimization)|\d+\+?\s*(?:users|active users|requests|qps|stars|downloads|clients|rpm|kw|kn|fps|hz|khz|mhz|ghz|v|mv|ma|latency|ms)|\$\d+[\d,.]*(?:k|m|b)?|\d+x\s*(?:faster|speedup|throughput))\b/i;

  for (const line of lines) {
    if (createMetricRegex().test(line)) {
      quantifiedMetrics.push(line.replace(/^[-•*]\s*/, '').trim());
    }
  }

  // 5. Standards & Compliance Evidence
  const standardsAndCompliance: string[] = [];
  const standardsKeywords = [
    'ISO', 'IEEE', 'ASME', 'OSHA', 'WCAG', 'GDPR', 'Six Sigma', 'CMMI', 
    'Agile', 'Scrum', 'REST', 'MISRA', 'AutoSAR', 'Eurocode', 'IS 456', 
    'ACI 318', 'EPA', 'FDA', 'UL', 'CE', 'PCI-DSS'
  ];
  for (const std of standardsKeywords) {
    if (new RegExp(`\\b${std}\\b`, 'i').test(resumeText)) {
      standardsAndCompliance.push(std);
    }
  }

  // 6. Branch & Specialization Inference
  let engineeringBranch = 'Computer Science & Software Engineering';
  if (normalizedText.includes('mechanical') || normalizedText.includes('cad') || normalizedText.includes('solidworks') || normalizedText.includes('thermodynamics')) {
    engineeringBranch = 'Mechanical Engineering';
  } else if (normalizedText.includes('civil') || normalizedText.includes('structural') || normalizedText.includes('concrete') || normalizedText.includes('autocad') || normalizedText.includes('revit')) {
    engineeringBranch = 'Civil & Structural Engineering';
  } else if (normalizedText.includes('embedded') || normalizedText.includes('microcontroller') || normalizedText.includes('vlsi') || normalizedText.includes('verilog') || normalizedText.includes('pcb') || normalizedText.includes('electronics')) {
    engineeringBranch = 'Electronics & Embedded Systems Engineering';
  } else if (normalizedText.includes('data science') || normalizedText.includes('machine learning') || normalizedText.includes('pandas') || normalizedText.includes('sql') && !normalizedText.includes('react')) {
    engineeringBranch = 'Data Science & Artificial Intelligence';
  } else if (normalizedText.includes('chemical') || normalizedText.includes('process') || normalizedText.includes('biochemical')) {
    engineeringBranch = 'Chemical & Process Engineering';
  }

  // Role taxonomy comparison
  const roleTaxonomy = getRoleTaxonomy(targetRoleId);
  const demonstrated: SkillEvidence[] = [];
  const partial: SkillEvidence[] = [];
  const missing: SkillEvidence[] = [];
  const extractedSkillsSet = new Set<string>();

  // Helper: Find verbatim excerpt from resume for a given search term
  function findVerbatimExcerpt(searchTerms: string[]): { excerpt: string; source: string; isProject: boolean; isWork: boolean } | undefined {
    for (const term of searchTerms) {
      const lowerTerm = term.toLowerCase();
      // Search in project evidence snippets first
      for (const p of projects) {
        for (const snip of p.evidenceSnippets) {
          if (snip.toLowerCase().includes(lowerTerm)) {
            return {
              excerpt: `"${snip}"`,
              source: `Project: ${p.name}`,
              isProject: true,
              isWork: false,
            };
          }
        }
      }
      // Search in experience highlights
      for (const e of experience) {
        for (const h of e.highlights) {
          if (h.toLowerCase().includes(lowerTerm)) {
            return {
              excerpt: `"${h}"`,
              source: `Work History: ${e.company} (${e.role})`,
              isProject: false,
              isWork: true,
            };
          }
        }
      }
      // Search in any line of resume
      for (const line of lines) {
        if (line.toLowerCase().includes(lowerTerm) && line.length > 15) {
          return {
            excerpt: `"${line.replace(/^[-•*]\s*/, '').trim()}"`,
            source: 'Resume Skills Summary / Coursework',
            isProject: false,
            isWork: false,
          };
        }
      }
    }
    return undefined;
  }

  // 7. Construct Evidence Map & Taxonomy Alignment
  const evidenceMap: SkillEvidenceMapItem[] = [];

  for (const req of roleTaxonomy.requiredSkills) {
    const skillTerms = getKeywordsForSkill(req.skill);
    const hasAnyMention = skillTerms.some(term => normalizedText.includes(term.toLowerCase()));
    const foundData = findVerbatimExcerpt(skillTerms);

    if (foundData && (foundData.isProject || foundData.isWork)) {
      // Demonstrated
      demonstrated.push({
        skill: req.skill,
        category: req.category,
        quality: 'demonstrated',
        evidenceExcerpt: `${foundData.excerpt} (${foundData.source})`,
        explanation: `Demonstrated through verified hands-on execution documented in ${foundData.source}.`,
        importance: req.importance,
      });
      extractedSkillsSet.add(req.skill);

      const evType: EvidenceClassificationType = foundData.isWork 
        ? 'internship' 
        : (foundData.source.toLowerCase().includes('capstone') || foundData.source.toLowerCase().includes('academic'))
          ? 'academic_project'
          : 'personal_project';

      evidenceMap.push({
        skillName: req.skill,
        evidenceType: evType,
        exactExcerpt: foundData.excerpt,
        source: foundData.source,
        evidenceStrength: foundData.isWork ? 'strong' : 'moderate',
        confidence: 'High confidence',
        recommendation: `Maintain practical readiness; prepare to explain architectural trade-offs and edge failure handling in technical rounds.`,
      });
    } else if (hasAnyMention) {
      // Partial: Mentioned in skills or coursework, but lacking practical project proof
      const mentionExcerpt = foundData ? foundData.excerpt : `Mentioned in skills summary without project context.`;
      const source = foundData ? foundData.source : 'Skills List';
      partial.push({
        skill: req.skill,
        category: req.category,
        quality: 'partial',
        evidenceExcerpt: mentionExcerpt,
        explanation: `Mentioned in skills or coursework, but lacks verifiable implementation details, metrics, or code proof.`,
        importance: req.importance,
      });
      extractedSkillsSet.add(req.skill);

      evidenceMap.push({
        skillName: req.skill,
        evidenceType: 'claimed_only',
        exactExcerpt: mentionExcerpt,
        source,
        evidenceStrength: 'weak',
        confidence: 'Needs validation',
        recommendation: `Build a dedicated lab or feature integrating ${req.skill} with quantifiable outcomes and commit to GitHub.`,
      });
    } else {
      // Missing
      missing.push({
        skill: req.skill,
        category: req.category,
        quality: 'missing',
        explanation: `Not observed in resume. Core benchmark requirement for ${roleTaxonomy.title} evaluations.`,
        importance: req.importance,
      });

      evidenceMap.push({
        skillName: req.skill,
        evidenceType: 'not_observed',
        exactExcerpt: undefined,
        source: 'Not observed',
        evidenceStrength: 'not_observed',
        confidence: 'Needs validation',
        recommendation: `High priority learning gap: Study foundational principles and complete practice milestone during sprint.`,
      });
    }
  }

  // Also collect any recognized tools from common tools catalog
  const commonTools = [
    'Git', 'GitHub', 'VS Code', 'Figma', 'Postman', 'Docker', 'Linux', 
    'Jupyter', 'Excel', 'SolidWorks', 'AutoCAD', 'MATLAB', 'Node.js', 
    'React', 'TypeScript', 'Python', 'C++', 'SQL', 'Kubernetes', 'AWS'
  ];
  for (const tool of commonTools) {
    if (normalizedText.includes(tool.toLowerCase())) {
      extractedSkillsSet.add(tool);
    }
  }

  // 8. Project Deep-Dive Analysis for EVERY project
  const projectAnalyses: ProjectAnalysisItem[] = projects.map(p => {
    // Determine problem solved & technical approach
    const firstBullet = p.evidenceSnippets[0] || p.description;
    const toolsInProject = commonTools.filter(t => 
      p.description.toLowerCase().includes(t.toLowerCase()) || 
      p.evidenceSnippets.some(s => s.toLowerCase().includes(t.toLowerCase()))
    );

    // Check for metrics in this project
    const projectMetric = p.evidenceSnippets.find(s => createMetricRegex().test(s));

    return {
      name: p.name,
      problemSolved: firstBullet.length > 10 ? firstBullet : `Solves functional workflow requirements within ${p.name}.`,
      userOrIndustrialContext: p.description.toLowerCase().includes('user') || p.description.toLowerCase().includes('client') 
        ? 'Interactive user-facing implementation with real-world state' 
        : 'Academic or personal technical project demonstrating core concepts',
      technicalApproach: `Engineered core architecture utilizing ${toolsInProject.length > 0 ? toolsInProject.join(', ') : 'modular component structures'} with structured data handling.`,
      toolsUsed: toolsInProject.length > 0 ? toolsInProject : ['Core Engineering Stack'],
      candidateContribution: 'Sole author / core technical implementer responsible for system design and coding.',
      measurableResult: projectMetric ? `"${projectMetric}"` : undefined,
      missingTechnicalDepth: 'Lacks documentation of automated unit tests, system latency benchmarks, or error recovery boundaries.',
      suggestedInterviewQuestions: [
        `"Walk me through the component or system architecture of ${p.name} and why you chose your specific stack?"`,
        `"What was the most challenging technical edge case or bug you resolved while building ${p.name}?"`,
        `"If ${p.name} experienced a 10x surge in data volume or traffic, where would the primary bottleneck occur?"`,
      ],
    };
  });

  // 9. Role Alignment Evaluation
  const nonRelevantItems: string[] = [];
  // Detect tools on resume unrelated to the target role
  if (targetRoleId === 'frontend') {
    if (normalizedText.includes('autocad')) nonRelevantItems.push('AutoCAD (Mechanical/Civil CAD)');
    if (normalizedText.includes('solidworks')) nonRelevantItems.push('SolidWorks (Mechanical CAD)');
    if (normalizedText.includes('photoshop')) nonRelevantItems.push('Photoshop (Graphic Design)');
  } else if (targetRoleId === 'mech_design' || targetRoleId === 'structural_engineer') {
    if (normalizedText.includes('react')) nonRelevantItems.push('React (Web Frontend)');
    if (normalizedText.includes('css')) nonRelevantItems.push('CSS (Web Styling)');
  } else if (targetRoleId === 'embedded_software') {
    if (normalizedText.includes('figma')) nonRelevantItems.push('Figma (UI Design)');
  }

  const roleAlignment: RoleAlignmentItem = {
    targetRoleId,
    targetRoleTitle: roleTaxonomy.title,
    strongMatches: demonstrated.map(d => ({ skill: d.skill, evidence: d.evidenceExcerpt || 'Verified' })),
    partialMatches: partial.map(p => ({ skill: p.skill, gap: 'Mentioned without hands-on code/project evidence' })),
    missingRequirements: missing.map(m => ({ skill: m.skill, reason: `Benchmark entry criteria for ${roleTaxonomy.title}` })),
    nonRelevantItems,
    resumeOrderingSuggestions: [
      `Place your most technically demanding projects above education to capture hiring manager attention immediately.`,
      `Group your skills section into structured sub-categories (Core Languages, Frameworks, Developer Tooling) rather than an unseparated list.`,
      `Feature public GitHub links directly below project titles for 1-click recruiter verification.`,
    ],
  };

  // 10. Fact-Grounded Resume Improvements (Strictly truthful, never inventing achievements)
  const resumeImprovements: ResumeImprovementItem[] = [];

  if (quantifiedMetrics.length === 0) {
    resumeImprovements.push({
      category: 'measurable_outcome',
      title: 'Add Measurable Outcomes (If True)',
      suggestion: 'None of your project bullet points currently feature quantifiable metrics. If true, add measurable metrics (e.g., user count, query latency reduction, test coverage %, or build time improvement). Never fabricate numbers.',
      affectedSection: 'Projects',
    });
  }

  if (githubLinks.length === 0) {
    resumeImprovements.push({
      category: 'tools_links',
      title: 'Include Verified GitHub Repository Links',
      suggestion: 'No public GitHub repository links were identified. Technical recruiters heavily prioritize candidates who provide verifiable code repositories.',
      affectedSection: 'Contact / Header',
    });
  }

  resumeImprovements.push({
    category: 'personal_contribution',
    title: 'Clarify Individual Contribution vs Team Roles',
    suggestion: 'Ensure every bullet point highlights your personal architectural decisions rather than passive team participation (e.g., use "Architected REST endpoints" instead of "Worked on backend").',
    affectedSection: 'Projects & Experience',
  });

  resumeImprovements.push({
    category: 'testing_validation',
    title: 'Document Testing & Verification Rigor',
    suggestion: 'Mention test methodologies (unit testing, integration testing, GD&T inspection, or FEA simulation) if performed to prove production reliability.',
    affectedSection: 'Technical Skills & Projects',
  });

  if (partial.length > 0) {
    resumeImprovements.push({
      category: 'technical_decisions',
      title: `Substantiate ${partial.length} Unverified Skill Claims`,
      suggestion: `You listed skills (${partial.slice(0, 3).map(p => p.skill).join(', ')}) without showing where they were applied. Add 1 bullet point demonstrating real implementation or remove them if unpracticed.`,
      affectedSection: 'Skills & Projects',
    });
  }

  // 11. Candidate Summary
  const missingContext: string[] = [];
  if (quantifiedMetrics.length === 0) missingContext.push('No measurable performance or scale metrics documented');
  if (githubLinks.length === 0) missingContext.push('No public GitHub or repository links provided for codebase audit');
  if (experience.length === 0) missingContext.push('No formal internship or industrial experience listed (relying entirely on projects)');
  if (partial.length >= 3) missingContext.push('Several technical skills listed without project implementation excerpts');

  const candidateSummary: CandidateSummary = {
    engineeringBranch,
    currentLevel: experience.length > 0 ? 'intern' : 'student',
    mainTechnicalDirection: Array.from(extractedSkillsSet).slice(0, 5).join(', ') || 'General Engineering Fundamentals',
    targetRoleAlignment: `${demonstrated.length} of ${roleTaxonomy.requiredSkills.length} core competencies demonstrated for ${roleTaxonomy.title}.`,
    missingContext,
  };

  // High priority gaps calculation
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

  // Multi-signal competency judgements
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
      education: education.length > 0 ? education : [{ institution: 'Undergraduate Engineering Program', degree: 'B.Tech / B.E.' }],
      experience,
      projects,
      extractedSkills: Array.from(extractedSkillsSet),
      strengths: demonstrated.map(d => `${d.skill}: Verified via ${d.evidenceExcerpt ? 'verifiable project excerpt' : 'documented work'}`),
      weakEvidenceAreas: partial.map(p => `${p.skill}: Listed as a skill, but lacks concrete project context, code snippets, or outcome measurements.`),
      missingCriticalInfo: missing.map(m => `${m.skill} (Importance: ${m.importance.toUpperCase()})`),
      truthfulSuggestions: resumeImprovements.map(r => `${r.title}: ${r.suggestion}`),

      // Prompt 5 Engineering Student Outputs
      candidateSummary,
      evidenceMap,
      projectAnalyses,
      roleAlignment,
      resumeImprovements,
      detectedLinks: {
        github: githubLinks,
        portfolio: portfolioLinks,
        linkedin: linkedinLinks,
      },
      quantifiedMetrics,
      standardsAndCompliance,
      analysisVersion: '2.0.0-engineering-multi-signal',
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
    // Software & Web
    'HTML5 & Semantic Markup': ['html', 'html5', 'semantic tags', 'semantic markup', 'dom'],
    'HTML5, Semantic Markup & CSS3': ['html', 'html5', 'css', 'css3', 'flexbox', 'grid'],
    'CSS3, Flexbox & Grid': ['css', 'css3', 'flexbox', 'grid', 'responsive', 'tailwind', 'bootstrap'],
    'Modern JavaScript (ES6+)': ['javascript', 'js', 'es6', 'typescript', 'promises', 'async', 'vanilla javascript'],
    'JavaScript & TypeScript': ['javascript', 'typescript', 'ts', 'js', 'es6', 'types'],
    'React & Component Architecture': ['react', 'react.js', 'reactjs', 'components', 'hooks', 'jsx', 'redux'],
    'API Integration & Asynchronous State': ['api', 'rest api', 'fetch', 'axios', 'endpoints', 'http', 'async state'],
    'Web Performance & Accessibility (a11y)': ['accessibility', 'a11y', 'performance', 'lighthouse', 'aria', 'lazy loading', 'core web vitals'],
    'Version Control & Git Collaboration': ['git', 'github', 'gitlab', 'version control', 'pull request', 'pr'],
    'Git & Version Control Workflow': ['git', 'github', 'gitlab', 'branching', 'pull request'],
    'Unit & Component Testing': ['testing', 'jest', 'vitest', 'react testing library', 'rtl', 'unit tests'],
    'Build Tools & Deployment': ['vite', 'webpack', 'deploy', 'vercel', 'netlify', 'npm', 'ci/cd'],

    // Backend & Cloud
    'Server-side Language & Runtime': ['node', 'node.js', 'nodejs', 'python', 'fastapi', 'django', 'java', 'golang', 'express'],
    'RESTful API Design & Routing': ['rest', 'restful', 'api', 'endpoints', 'crud', 'routing', 'postman'],
    'Database Design & Queries (SQL/NoSQL)': ['mongodb', 'mongoose', 'postgres', 'postgresql', 'mysql', 'prisma', 'nosql', 'sql', 'schema'],
    'Authentication & Security Best Practices': ['jwt', 'json web token', 'bcrypt', 'auth', 'authentication', 'oauth', 'security'],
    'Error Handling & Structured Logging': ['error handling', 'middleware', 'logging', 'winston', 'exceptions'],
    'Containerization & Cloud Deployment': ['docker', 'container', 'dockerfile', 'aws', 'render', 'cloud', 'kubernetes'],

    // Data Analyst & AI
    'SQL & Relational Databases': ['sql', 'postgresql', 'mysql', 'sqlite', 'joins', 'query', 'queries', 'database'],
    'Python / R for Data Manipulation': ['python', 'pandas', 'numpy', 'r', 'data manipulation', 'jupyter'],
    'Data Visualization & BI Dashboards': ['tableau', 'powerbi', 'power bi', 'matplotlib', 'seaborn', 'dashboard', 'visualization'],
    'Statistical Analysis & Hypothesis Testing': ['statistics', 'hypothesis testing', 'a/b testing', 'regression', 'probability', 'p-value'],
    'Data Cleaning & Transformation (ETL)': ['data cleaning', 'etl', 'data transformation', 'missing values', 'normalization'],
    'Business Metric Translation & Storytelling': ['metrics', 'churn', 'kpi', 'retention', 'revenue', 'business intelligence', 'storytelling'],
    'Spreadsheet Modeling (Excel/Sheets)': ['excel', 'google sheets', 'pivot table', 'xlookup', 'vlookup', 'spreadsheets'],

    // Embedded & Hardware
    'Embedded C / Bare-Metal Programming': ['embedded c', 'c programming', 'bare-metal', 'registers', 'interrupt', 'timer', 'c++'],
    'Embedded C / C++ Programming': ['c', 'c++', 'embedded c', 'pointers', 'memory management', 'bit manipulation'],
    'Microcontrollers & Real-Time OS (RTOS)': ['microcontroller', 'mcu', 'stm32', 'arm', 'rtos', 'freertos', 'tasks', 'mutex', 'esp32'],
    'Microcontroller Architecture & Peripherals': ['microcontroller', 'mcu', 'stm32', 'arm', 'avr', 'esp32', 'arduino', 'timers', 'interrupts', 'gpio', 'adc', 'dac'],
    'Hardware Communication Protocols': ['uart', 'spi', 'i2c', 'can bus', 'protocols', 'communication'],
    'Hardware Communication Protocols (UART, SPI, I2C)': ['uart', 'spi', 'i2c', 'can bus', 'serial communication'],
    'C & Modern C++': ['c++', 'c and c++', 'modern c++', 'pointers', 'hal', 'c'],
    'Hardware Debugging & Oscilloscope Analysis': ['oscilloscope', 'logic analyzer', 'multimeter', 'debugging', 'soldering', 'schematic'],
    'Real-Time Operating Systems (RTOS)': ['rtos', 'freertos', 'tasks', 'semaphores', 'mutex', 'scheduling'],

    // Mechanical
    'Parametric 3D CAD Modeling': ['cad', 'solidworks', 'catia', 'creo', 'fusion 360', 'inventor', '3d modeling'],
    'Geometric Dimensioning & Tolerancing (GD&T)': ['gd&t', 'gdt', 'tolerancing', 'datum', 'runout', 'tolerance stackup', 'asme y14.5'],
    'Finite Element Analysis (FEA)': ['fea', 'ansys', 'simulation', 'stress analysis', 'abaqus', 'von mises', 'finite element'],
    'Engineering Materials & Heat Treatment': ['materials', 'aluminum', 'steel', 'polymers', 'tensile strength', 'heat treatment'],
    'Manufacturing Processes (CNC, Sheet Metal, Injection Molding)': ['machining', 'cnc', 'sheet metal', 'injection molding', 'casting', 'dfm', 'manufacturing'],

    // Civil & Structural
    'Structural Analysis & Load Calculation': ['structural analysis', 'staad', 'etabs', 'sap2000', 'bending moment', 'shear force', 'load calculation'],
    'Concrete & Steel Design Codes': ['is 456', 'aci 318', 'eurocode', 'aisc', 'rcc', 'steel design', 'reinforcement'],
    'Foundation & Geotechnical Concepts': ['foundation', 'soil mechanics', 'bearing capacity', 'pile foundation', 'geotechnical', 'settlement'],
    'Civil CAD & BIM Modeling': ['autocad', 'revit', 'bim', 'structural drawing', 'drafting'],
  };

  return map[skillName] || [skillName.toLowerCase()];
}

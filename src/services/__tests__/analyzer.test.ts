import { describe, it, expect } from 'vitest';
import { analyzeResume } from '../analyzer';

const SAMPLE_STUDENT_RESUME = `
Alex Chen
alex.chen@engineering.edu | github.com/alexchen-dev | linkedin.com/in/alexchen-dev

EDUCATION
Bachelor of Technology in Computer Science & Engineering
State Technical University, 2021 - 2025

TECHNICAL SKILLS
Languages: JavaScript, TypeScript, Python, HTML5, CSS3, SQL
Frameworks & Libraries: React, Node.js, Express, Tailwind CSS
Tools: Git, GitHub, VS Code, Postman, Docker
Standards & Compliance: REST, WCAG 2.1, Agile / Scrum

PROJECTS
E-Commerce Checkout & Storefront
- Built responsive web application using React, TypeScript, and Tailwind CSS.
- Integrated REST API endpoints with Axios and optimized component renders with custom hooks.
- Achieved 40% reduction in checkout page load time and 99.8% uptime during simulated flash sales.
- Implemented client-side input validation and WCAG accessible form controls.

Real-Time Sensor Dashboard
- Developed live IoT monitoring interface consuming WebSocket events.
- Visualized multi-axis accelerometer telemetry with SVG charts and sub-50ms latency.
- Implemented error boundaries and reconnection policies for network dropouts.

EXPERIENCE
Frontend Engineering Intern
TechVentures Labs | Summer 2024
- Collaborated with 4 engineers to build reusable React design system components.
- Wrote unit tests in Vitest ensuring 85% component test coverage.
`;

const HARDWARE_EMBEDDED_RESUME = `
Priya Sharma
priya.sharma@eng.edu | github.com/priyasharma-mcu

EDUCATION
B.E. in Electronics & Communication Engineering
Institute of Technology, 2020 - 2024

TECHNICAL SKILLS
Languages: Embedded C, C++, Assembly, Python
Hardware: STM32, ARM Cortex-M4, ESP32, Arduino, Oscilloscope, Logic Analyzer
Protocols: UART, SPI, I2C, CAN Bus
Concepts: RTOS, FreeRTOS, Interrupt Service Routines, Timers, PWM
Standards: MISRA C, IEEE 802.15.4

PROJECTS
Autonomous Mobile Robot Navigation
- Programmed STM32 microcontroller firmware in Embedded C for dual-wheel motor closed-loop PID control.
- Interfaced ultrasonic and LiDAR sensors via SPI and I2C buses with 200Hz sampling rate.
- Designed FreeRTOS task architecture with strict preemption priorities and zero mutex deadlocks.
`;

describe('Prompt 5 — Engineering Resume Analyzer Engine', () => {
  it('correctly parses candidate summary (branch, level, technical direction)', () => {
    const { extractedResume } = analyzeResume(SAMPLE_STUDENT_RESUME, 'frontend');

    expect(extractedResume.candidateName).toBe('Alex Chen');
    expect(extractedResume.candidateSummary).toBeDefined();
    expect(extractedResume.candidateSummary?.engineeringBranch).toContain('Computer Science');
    expect(extractedResume.candidateSummary?.currentLevel).toBe('intern'); // Has internship experience
    expect(extractedResume.candidateSummary?.mainTechnicalDirection).toBeTruthy();
    expect(extractedResume.candidateSummary?.targetRoleAlignment).toContain('core competencies demonstrated');
  });

  it('constructs an evidence map with verbatim excerpts and classifications', () => {
    const { extractedResume } = analyzeResume(SAMPLE_STUDENT_RESUME, 'frontend');
    const { evidenceMap } = extractedResume;

    expect(evidenceMap).toBeDefined();
    expect(evidenceMap!.length).toBeGreaterThan(0);

    const reactEvidence = evidenceMap!.find(e => e.skillName.toLowerCase().includes('react'));
    expect(reactEvidence).toBeDefined();
    expect(['academic_project', 'personal_project']).toContain(reactEvidence?.evidenceType);
    expect(reactEvidence?.evidenceStrength).toBe('moderate');
    expect(reactEvidence?.exactExcerpt).toBeDefined();
    expect(reactEvidence?.confidence).toBe('High confidence');
    expect(reactEvidence?.recommendation).toBeTruthy();
  });

  it('performs deep-dive project analyses with interview questions and missing depth warnings', () => {
    const { extractedResume } = analyzeResume(SAMPLE_STUDENT_RESUME, 'frontend');
    const { projectAnalyses } = extractedResume;

    expect(projectAnalyses).toBeDefined();
    expect(projectAnalyses!.length).toBeGreaterThanOrEqual(2);

    const checkoutProj = projectAnalyses!.find(p => p.name.includes('E-Commerce'));
    expect(checkoutProj).toBeDefined();
    expect(checkoutProj?.problemSolved).toBeTruthy();
    expect(checkoutProj?.technicalApproach).toBeTruthy();
    expect(checkoutProj?.candidateContribution).toBeTruthy();
    expect(checkoutProj?.toolsUsed.length).toBeGreaterThan(0);
    // Project has "40% reduction", so measurable result should be captured
    expect(checkoutProj?.measurableResult).toContain('40% reduction');
    expect(checkoutProj?.missingTechnicalDepth).toBeTruthy();
    expect(checkoutProj?.suggestedInterviewQuestions.length).toBeGreaterThanOrEqual(2);
  });

  it('evaluates target role alignment and identifies non-relevant items', () => {
    const { extractedResume } = analyzeResume(SAMPLE_STUDENT_RESUME, 'frontend');
    const { roleAlignment } = extractedResume;

    expect(roleAlignment).toBeDefined();
    expect(roleAlignment?.targetRoleId).toBe('frontend');
    expect(roleAlignment?.strongMatches.length).toBeGreaterThan(0);
    expect(roleAlignment?.resumeOrderingSuggestions.length).toBeGreaterThan(0);
  });

  it('exhibits target-role sensitivity: same resume produces different gaps and alignment across roles', () => {
    const frontendResult = analyzeResume(SAMPLE_STUDENT_RESUME, 'frontend');
    const embeddedResult = analyzeResume(SAMPLE_STUDENT_RESUME, 'embedded_software');

    // Frontend developer should find React demonstrated
    const frontendReact = frontendResult.gapAnalysis.demonstrated.find(d => d.skill.toLowerCase().includes('react'));
    expect(frontendReact).toBeDefined();

    // Embedded role requires microcontroller/firmware skills not in Alex Chen's resume
    expect(embeddedResult.gapAnalysis.missing.length).toBeGreaterThan(0);
    expect(embeddedResult.gapAnalysis.overallReadinessScore).toBeLessThan(frontendResult.gapAnalysis.overallReadinessScore);
  });

  it('correctly classifies hardware engineer resume with branch, standards, and RTOS', () => {
    const { extractedResume } = analyzeResume(HARDWARE_EMBEDDED_RESUME, 'embedded_software');

    expect(extractedResume.candidateSummary?.engineeringBranch).toContain('Electronics & Embedded Systems');
    expect(extractedResume.standardsAndCompliance).toContain('IEEE');
    expect(extractedResume.detectedLinks?.github).toContain('github.com/priyasharma-mcu');
    
    // Check project analysis
    expect(extractedResume.projectAnalyses?.length).toBeGreaterThanOrEqual(1);
    const robotProj = extractedResume.projectAnalyses![0];
    expect(robotProj.name).toContain('Autonomous Mobile Robot');
    expect(robotProj.measurableResult).toContain('200Hz');
  });

  it('provides fact-grounded recommendations without hallucinating metrics', () => {
    const resumeWithoutMetrics = `
John Doe
john@test.com
EDUCATION
B.Tech in Computer Science
PROJECTS
Task Manager
Built a simple task manager in React. Used CSS for styling.
`;
    const { extractedResume } = analyzeResume(resumeWithoutMetrics, 'frontend');
    expect(extractedResume.quantifiedMetrics?.length).toBe(0);

    const metricImprovement = extractedResume.resumeImprovements?.find(i => i.category === 'measurable_outcome');
    expect(metricImprovement).toBeDefined();
    expect(metricImprovement?.suggestion).toContain('Never fabricate numbers');

    // Make sure project has undefined / not observed measurable result
    expect(extractedResume.projectAnalyses![0].measurableResult).toBeUndefined();
  });
});

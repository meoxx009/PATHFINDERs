import fs from 'fs';
import path from 'path';

const rolesContent = `/**
 * SkillForge AI — Engineering Roles Catalog
 * Detailed role definitions mapped to branches, specializations, skills, and evidence benchmarks.
 */

import type { ProficiencyLevel } from './skills';
import type { RoleSkillCategory } from '../types';

export interface RoleSkillRequirement {
  skillId: string;
  skillName: string;
  category: RoleSkillCategory | string;
  requiredLevel: ProficiencyLevel;
  importance: 'critical' | 'high' | 'medium' | 'low';
  benchmarkDescription: string;
  evidenceExamples: string[];
  prerequisites: string[];
  suggestedPractice?: string;
}

export type EngineeringDomain =
  | 'software_it'
  | 'ai_data'
  | 'electronics_embedded'
  | 'mechanical_manufacturing'
  | 'civil_infra'
  | 'chemical_bio_materials'
  | 'interdisciplinary';

export interface CareerRole {
  id: string;
  title: string;
  slug: string;
  domain: EngineeringDomain;
  summary: string;
  description: string;
  engineeringFamilies: string[];
  streams: string[];
  specializations: string[];
  industries: string[];
  workModes: string[];
  interestTags: string[];
  experienceLevels: string[];
  beginnerFriendly: boolean;
  estimatedWeeks: {
    beginner: number;
    intermediate: number;
    advanced: number;
  };
  requiredSkills: RoleSkillRequirement[];
  preferredSkills?: RoleSkillRequirement[];
  prerequisiteSkills: string[];
  commonProjects: string[];
  commonResponsibilities: string[];
  tools: string[];
  interviewTopics: string[];
  adjacentRoles?: string[];
  entryLevelExpectations?: string[];
  roadmapTemplateId?: string;
  assessmentProfileId?: string;
}

// Backward compatibility alias
export type EngineeringRole = CareerRole;

export const INTEREST_TAGS = [
  'Building software',
  'Working with data',
  'Designing products',
  'Working with hardware',
  'Solving mathematical problems',
  'Working with machines',
  'Working outdoors',
  'Research',
  'Automation',
  'Sustainability',
  'Healthcare technology',
  'Business and operations',
  'Security',
  'Communication and leadership',
] as const;

export const ROLES_CATALOG: Record<string, CareerRole> = {
  // ==========================================
  // SOFTWARE & IT
  // ==========================================
  'frontend': {
    id: 'frontend',
    title: 'Frontend Developer',
    slug: 'frontend-developer',
    domain: 'software_it',
    summary: 'Builds responsive, accessible, interactive web applications and interfaces integrating with modern APIs.',
    description: 'Frontend developers engineer the user-facing interfaces of modern cloud applications. They combine deep visual fidelity, accessibility (a11y), responsive layout design, state management, and network optimization to deliver lightning-fast interactive client experiences.',
    engineeringFamilies: ['Computer Science and Engineering', 'Information Technology', 'Software Engineering'],
    streams: ['Web Systems', 'User Interface Engineering', 'Frontend Architecture'],
    specializations: ['Single Page Apps', 'Design Systems', 'Web Performance'],
    industries: ['SaaS', 'E-Commerce', 'FinTech', 'EdTech', 'Media'],
    workModes: ['Remote', 'Hybrid', 'Onsite'],
    interestTags: ['Building software', 'Designing products'],
    experienceLevels: ['beginner', 'intern', 'entry_level'],
    beginnerFriendly: true,
    estimatedWeeks: { beginner: 12, intermediate: 8, advanced: 4 },
    requiredSkills: [
      {
        skillId: 'html_css_web',
        skillName: 'HTML5, Semantic Markup & CSS3',
        category: 'foundations',
        importance: 'critical',
        requiredLevel: 4,
        benchmarkDescription: 'Semantic structure, Flexbox/Grid layouts, web accessibility (a11y), responsive design.',
        evidenceExamples: ['Responsive semantic landing page scoring 95+ on Lighthouse'],
        prerequisites: [],
        suggestedPractice: 'Build a keyboard-navigable accessible dashboard component.'
      },
      {
        skillId: 'javascript_typescript',
        skillName: 'JavaScript & TypeScript',
        category: 'core_technical',
        importance: 'critical',
        requiredLevel: 4,
        benchmarkDescription: 'ES6+ features, closures, promises, async/await, static typing, and interfaces.',
        evidenceExamples: ['Strictly typed state stores and asynchronous data fetching layer in TypeScript'],
        prerequisites: ['html_css_web'],
        suggestedPractice: 'Refactor a JavaScript utility library into strictly typed TypeScript.'
      },
      {
        skillId: 'react_architecture',
        skillName: 'React & Component Architecture',
        category: 'core_technical',
        importance: 'critical',
        requiredLevel: 3,
        benchmarkDescription: 'Hooks, custom state management, component decomposition, and performance optimization.',
        evidenceExamples: ['Interactive multi-view web application with client-side state and caching'],
        prerequisites: ['javascript_typescript'],
        suggestedPractice: 'Build a custom hook managing complex optimistic mutation state.'
      },
      {
        skillId: 'git_version_control',
        skillName: 'Git & Version Control Workflow',
        category: 'tools',
        importance: 'high',
        requiredLevel: 3,
        benchmarkDescription: 'Branching, PR reviews, merge hygiene, and collaboration conventions.',
        evidenceExamples: ['Public GitHub repository with feature branches and pull request merges'],
        prerequisites: [],
        suggestedPractice: 'Resolve an intentional multi-branch rebase conflict via terminal.'
      },
      {
        skillId: 'testing_qa',
        skillName: 'Automated Testing & QA Rigor',
        category: 'testing_validation',
        importance: 'medium',
        requiredLevel: 2,
        benchmarkDescription: 'Unit and component testing with Vitest or React Testing Library.',
        evidenceExamples: ['Test suite covering key interactive state flows and assertion mocks'],
        prerequisites: ['react_architecture'],
        suggestedPractice: 'Write comprehensive integration tests for an asynchronous form.'
      },
    ],
    prerequisiteSkills: ['html_css_web', 'javascript_typescript'],
    commonProjects: [
      'Interactive E-Commerce product catalog with cart state and responsive filters',
      'Real-time collaborative kanban board with drag-and-drop state syncing',
      'Accessible corporate design system component library documented with Storybook'
    ],
    commonResponsibilities: [
      'Develop modern responsive user interfaces in React and TypeScript',
      'Collaborate with product designers to implement pixel-perfect Figma designs',
      'Integrate backend RESTful and GraphQL endpoints with robust error handling',
      'Optimize web performance, Core Web Vitals, and accessibility guidelines (WCAG 2.1)'
    ],
    tools: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Git', 'Figma', 'Postman'],
    interviewTopics: [
      'Event loop, asynchronous JavaScript, and closure execution order',
      'React component lifecycle, reconciliation algorithm, and custom hooks',
      'CSS Flexbox vs Grid trade-offs and responsive media breakpoints',
      'Web performance optimizations: code-splitting, lazy loading, and asset bundling'
    ],
    adjacentRoles: ['Full-Stack Developer', 'UI Engineer', 'Mobile Developer'],
    entryLevelExpectations: [
      'Demonstrate 2+ deployed web applications with clean GitHub commits',
      'Proficiency with component decomposition and state management',
      'Ability to consume REST APIs and handle network failure states gracefully'
    ]
  },

  'backend': {
    id: 'backend',
    title: 'Backend Developer',
    slug: 'backend-developer',
    domain: 'software_it',
    summary: 'Designs scalable server architectures, resilient REST/gRPC APIs, database schemas, and background services.',
    description: 'Backend developers create the core computation, business logic, authentication, and data persistence layers of web services. They focus on reliability, database performance, transactional integrity, and scalable microservices.',
    engineeringFamilies: ['Computer Science and Engineering', 'Information Technology', 'Software Engineering'],
    streams: ['Server-Side Architecture', 'Database Engineering', 'API Design'],
    specializations: ['REST & GraphQL APIs', 'Database Optimization', 'Microservices'],
    industries: ['FinTech', 'Cloud Services', 'Enterprise Software', 'E-Commerce'],
    workModes: ['Remote', 'Hybrid', 'Onsite'],
    interestTags: ['Building software', 'Solving mathematical problems'],
    experienceLevels: ['beginner', 'intern', 'entry_level'],
    beginnerFriendly: true,
    estimatedWeeks: { beginner: 14, intermediate: 9, advanced: 5 },
    requiredSkills: [
      {
        skillId: 'node_express',
        skillName: 'Node.js & Backend Architecture',
        category: 'core_technical',
        importance: 'critical',
        requiredLevel: 4,
        benchmarkDescription: 'RESTful API routing, middleware pipelines, authentication tokens (JWT), error handling.',
        evidenceExamples: ['Express/Fastify API server with authentication, rate limiting, and structured logging'],
        prerequisites: [],
        suggestedPractice: 'Build a JWT auth service with refresh token rotation and bcrypt hashing.'
      },
      {
        skillId: 'sql_databases',
        skillName: 'SQL & Relational Database Design',
        category: 'core_technical',
        importance: 'critical',
        requiredLevel: 4,
        benchmarkDescription: 'Relational 3NF schemas, foreign key indexes, transaction isolation, execution plans.',
        evidenceExamples: ['PostgreSQL schema with complex multi-table joins and indexing strategies'],
        prerequisites: [],
        suggestedPractice: 'Design an ACID-compliant transaction workflow for fund transfers.'
      },
      {
        skillId: 'docker_containerization',
        skillName: 'Docker & Containerization',
        category: 'tools',
        importance: 'high',
        requiredLevel: 3,
        benchmarkDescription: 'Writing multi-stage Dockerfiles, managing container networks, and volume persistence.',
        evidenceExamples: ['Containerized application with Docker Compose defining API and PostgreSQL services'],
        prerequisites: [],
        suggestedPractice: 'Package a multi-service Node and Postgres app with Docker Compose.'
      },
      {
        skillId: 'git_version_control',
        skillName: 'Git & Version Control Workflow',
        category: 'tools',
        importance: 'high',
        requiredLevel: 3,
        benchmarkDescription: 'Branching, PR reviews, merge hygiene, and collaboration conventions.',
        evidenceExamples: ['Collaborative repository workflow with branch protection rules'],
        prerequisites: [],
        suggestedPractice: 'Establish conventional commits and automated linting in Git hooks.'
      },
    ],
    prerequisiteSkills: ['node_express', 'sql_databases'],
    commonProjects: [
      'Multi-tenant REST API with JWT authentication and role-based access control (RBAC)',
      'High-throughput message queue worker with Redis and PostgreSQL',
      'Inventory management service with transactional consistency and audit logs'
    ],
    commonResponsibilities: [
      'Architect robust REST and gRPC API endpoints with input validation',
      'Design relational and NoSQL database schemas with optimal query performance',
      'Implement authentication, authorization, and data encryption security standards',
      'Write comprehensive unit and integration tests with automated CI/CD pipelines'
    ],
    tools: ['Node.js', 'PostgreSQL', 'Docker', 'Redis', 'Express', 'Git', 'Postman'],
    interviewTopics: [
      'Database indexing (B-Tree), query optimization, and transaction isolation levels',
      'REST vs GraphQL vs gRPC communication trade-offs',
      'Stateless session management, JWT tokens, and OAuth 2.0 flows',
      'Concurrency, race conditions, and distributed caching with Redis'
    ],
    adjacentRoles: ['Full-Stack Developer', 'DevOps Engineer', 'Cloud Engineer'],
    entryLevelExpectations: [
      'Ability to design a normalized relational database schema with foreign keys',
      'Proficiency writing REST API endpoints with middleware validation and error handling',
      'Understanding of basic security practices (SQL injection prevention, password hashing)'
    ]
  },

  'fullstack': {
    id: 'fullstack',
    title: 'Full-Stack Developer',
    slug: 'fullstack-developer',
    domain: 'software_it',
    summary: 'Builds end-to-end features spanning responsive client interfaces, backend services, and database layers.',
    description: 'Full-stack engineers bridge frontend user interfaces and backend architectures. They are versatile problem solvers capable of designing user experiences, writing server-side APIs, and managing persistent databases.',
    engineeringFamilies: ['Computer Science and Engineering', 'Information Technology', 'Software Engineering'],
    streams: ['Full-Stack Systems', 'Web Engineering'],
    specializations: ['End-to-End Delivery', 'SaaS Architecture'],
    industries: ['Startups', 'SaaS', 'Consulting', 'E-Commerce'],
    workModes: ['Remote', 'Hybrid', 'Onsite'],
    interestTags: ['Building software', 'Designing products'],
    experienceLevels: ['beginner', 'intern', 'entry_level'],
    beginnerFriendly: true,
    estimatedWeeks: { beginner: 16, intermediate: 10, advanced: 6 },
    requiredSkills: [
      {
        skillId: 'react_architecture',
        skillName: 'React & Frontend Architecture',
        category: 'core_technical',
        importance: 'critical',
        requiredLevel: 4,
        benchmarkDescription: 'Component design, state management, client-side routing, and responsive layouts.',
        evidenceExamples: ['Full-featured frontend interface communicating with backend services'],
        prerequisites: [],
        suggestedPractice: 'Build a dashboard integrating complex charts and user filtering.'
      },
      {
        skillId: 'node_express',
        skillName: 'Node.js & Backend Services',
        category: 'core_technical',
        importance: 'critical',
        requiredLevel: 4,
        benchmarkDescription: 'API design, authentication, middleware, and database access layer.',
        evidenceExamples: ['Production REST API supporting CRUD workflows and authentication'],
        prerequisites: [],
        suggestedPractice: 'Implement server-side pagination, search, and sorting endpoints.'
      },
      {
        skillId: 'sql_databases',
        skillName: 'SQL & Database Modeling',
        category: 'core_technical',
        importance: 'high',
        requiredLevel: 3,
        benchmarkDescription: 'Database schemas, relations, migrations, and ORM integration.',
        evidenceExamples: ['Prisma/TypeORM migrations on PostgreSQL database'],
        prerequisites: [],
        suggestedPractice: 'Set up automated database migrations and seed scripts.'
      },
      {
        skillId: 'git_version_control',
        skillName: 'Git & Version Control',
        category: 'tools',
        importance: 'high',
        requiredLevel: 3,
        benchmarkDescription: 'Branch management, code review, and pull requests.',
        evidenceExamples: ['Monorepo or full-stack repository with clear commit hygiene'],
        prerequisites: [],
        suggestedPractice: 'Configure GitHub Actions CI testing frontend and backend builds.'
      }
    ],
    prerequisiteSkills: ['react_architecture', 'node_express'],
    commonProjects: [
      'Full-stack SaaS application with user billing, role-based dashboards, and notifications',
      'Collaborative content platform with real-time updates and markdown editing',
      'Online marketplace with checkout, search filtering, and inventory tracking'
    ],
    commonResponsibilities: [
      'Implement complete user journeys from Figma designs to database records',
      'Build performant APIs and connect them to frontend React state management',
      'Maintain continuous integration, deployment pipelines, and database migrations',
      'Debug cross-tier issues spanning client state, network requests, and database locks'
    ],
    tools: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Tailwind CSS', 'Docker', 'Git'],
    interviewTopics: [
      'Client-side vs Server-side rendering (SSR vs CSR) trade-offs',
      'Authentication architecture: cookies vs Authorization headers in SPAs',
      'Database query optimization and eliminating N+1 query problems',
      'End-to-end security: CORS, CSRF, XSS, and SQL injection mitigations'
    ],
    adjacentRoles: ['Frontend Developer', 'Backend Developer', 'DevOps Engineer'],
    entryLevelExpectations: [
      'Deliver a fully functional web app deployed publicly with live database',
      'Demonstrate understanding of how HTTP requests traverse from client to DB and back'
    ]
  },

  'devops': {
    id: 'devops',
    title: 'DevOps Engineer',
    slug: 'devops-engineer',
    domain: 'software_it',
    summary: 'Automates deployment pipelines, provisions infrastructure as code, and maintains production system reliability.',
    description: 'DevOps engineers bridge software development and operations. They streamline releases through CI/CD pipelines, containerize microservices, monitor uptime, and automate cloud infrastructure provisioning.',
    engineeringFamilies: ['Computer Science and Engineering', 'Information Technology', 'Software Engineering'],
    streams: ['Infrastructure & Cloud', 'Site Operations'],
    specializations: ['CI/CD Pipelines', 'Kubernetes Orchestration', 'Infrastructure as Code'],
    industries: ['Cloud Infrastructure', 'Enterprise Software', 'FinTech'],
    workModes: ['Remote', 'Hybrid', 'Onsite'],
    interestTags: ['Building software', 'Automation'],
    experienceLevels: ['beginner', 'intern', 'entry_level'],
    beginnerFriendly: false,
    estimatedWeeks: { beginner: 16, intermediate: 10, advanced: 6 },
    requiredSkills: [
      {
        skillId: 'docker_containerization',
        skillName: 'Docker & Containerization',
        category: 'core_technical',
        importance: 'critical',
        requiredLevel: 4,
        benchmarkDescription: 'Multi-stage builds, non-root user security, and minimal base images.',
        evidenceExamples: ['Optimized production Docker image under 150MB with zero CVE warnings'],
        prerequisites: [],
        suggestedPractice: 'Optimize a heavy container using alpine/distroless multi-stage builds.'
      },
      {
        skillId: 'ci_cd_pipelines',
        skillName: 'CI/CD Automation & GitHub Actions',
        category: 'core_technical',
        importance: 'critical',
        requiredLevel: 4,
        benchmarkDescription: 'Automated test runners, semantic versioning, and automated cloud deployments.',
        evidenceExamples: ['GitHub Actions pipeline executing lints, tests, image push, and deploy'],
        prerequisites: ['docker_containerization'],
        suggestedPractice: 'Create a deployment pipeline with staging branch triggers and rollback steps.'
      },
      {
        skillId: 'linux_sysadmin',
        skillName: 'Linux Administration & Shell Scripting',
        category: 'foundations',
        importance: 'critical',
        requiredLevel: 3,
        benchmarkDescription: 'Bash scripting, systemd service units, permissions, networking commands.',
        evidenceExamples: ['Automated server backup and log rotation bash script'],
        prerequisites: [],
        suggestedPractice: 'Write a bash script monitoring disk usage and dispatching alert webhooks.'
      }
    ],
    prerequisiteSkills: ['linux_sysadmin', 'docker_containerization'],
    commonProjects: [
      'Automated zero-downtime deployment pipeline with GitHub Actions and Docker',
      'Kubernetes cluster configuration for blue-green microservice deployments',
      'Server monitoring dashboard using Prometheus, Grafana, and alert triggers'
    ],
    commonResponsibilities: [
      'Design, maintain, and optimize automated CI/CD build and release workflows',
      'Containerize microservices and manage cloud Kubernetes environments',
      'Configure system monitoring, log aggregation, and real-time incident alerting',
      'Enforce cloud infrastructure security and credential secret management'
    ],
    tools: ['Docker', 'Kubernetes', 'GitHub Actions', 'Linux', 'Terraform', 'Prometheus', 'Grafana'],
    interviewTopics: [
      'Container orchestration and pod lifecycle in Kubernetes',
      'Continuous integration vs continuous deployment strategies',
      'Linux process management, signals (SIGTERM/SIGKILL), and file descriptors',
      'Infrastructure as Code (Terraform) state management and idempotency'
    ],
    adjacentRoles: ['Cloud Engineer', 'Site Reliability Engineer', 'Backend Developer'],
    entryLevelExpectations: [
      'Demonstrate working knowledge of Linux CLI, SSH, and Bash automation',
      'Proven experience building Dockerfiles and executing GitHub Actions workflows'
    ]
  },

  'cloud': {
    id: 'cloud',
    title: 'Cloud Engineer',
    slug: 'cloud-engineer',
    domain: 'software_it',
    summary: 'Architects, secures, and maintains scalable cloud infrastructure on AWS, Azure, or GCP.',
    description: 'Cloud engineers design cloud computing solutions that provide high availability, data security, disaster recovery, and cost efficiency across compute, networking, storage, and serverless architectures.',
    engineeringFamilies: ['Computer Science and Engineering', 'Information Technology', 'Software Engineering'],
    streams: ['Cloud Architecture', 'Network Systems'],
    specializations: ['AWS/GCP Architecture', 'Serverless Systems', 'Cloud Security'],
    industries: ['Enterprise IT', 'FinTech', 'HealthTech', 'E-Commerce'],
    workModes: ['Remote', 'Hybrid', 'Onsite'],
    interestTags: ['Building software', 'Security', 'Automation'],
    experienceLevels: ['beginner', 'intern', 'entry_level'],
    beginnerFriendly: false,
    estimatedWeeks: { beginner: 15, intermediate: 10, advanced: 5 },
    requiredSkills: [
      {
        skillId: 'cloud_architecture',
        skillName: 'Cloud Infrastructure (AWS/GCP/Azure)',
        category: 'core_technical',
        importance: 'critical',
        requiredLevel: 4,
        benchmarkDescription: 'Virtual networks (VPC), EC2/Compute engines, S3 storage, load balancers, IAM policies.',
        evidenceExamples: ['Secure VPC configuration with public/private subnets and NAT gateway'],
        prerequisites: [],
        suggestedPractice: 'Deploy a resilient multi-AZ web server behind an Application Load Balancer.'
      },
      {
        skillId: 'iac_terraform',
        skillName: 'Infrastructure as Code (Terraform)',
        category: 'tools',
        importance: 'high',
        requiredLevel: 3,
        benchmarkDescription: 'Declarative resource definitions, modules, variables, and remote state locks.',
        evidenceExamples: ['Terraform codebase provisioning complete cloud infrastructure stack'],
        prerequisites: ['cloud_architecture'],
        suggestedPractice: 'Write modular Terraform templates for cloud storage and compute.'
      }
    ],
    prerequisiteSkills: ['cloud_architecture'],
    commonProjects: [
      'Serverless event-driven architecture using AWS Lambda, SQS, and DynamoDB',
      'Disaster recovery backup pipeline across multi-region cloud buckets',
      'Enterprise IAM least-privilege role architecture with audited access policies'
    ],
    commonResponsibilities: [
      'Provision, monitor, and optimize cloud services for high reliability',
      'Implement strict cloud security controls, encryption, and IAM permissions',
      'Optimize monthly cloud utilization and reduce architectural waste',
      'Assist software teams in migrating legacy workloads to cloud infrastructure'
    ],
    tools: ['AWS', 'GCP', 'Terraform', 'Docker', 'Linux', 'CloudWatch', 'Git'],
    interviewTopics: [
      'VPC networking: CIDR blocks, subnets, route tables, and Internet Gateways',
      'High availability vs fault tolerance vs disaster recovery architectures',
      'IAM policy evaluation logic and principle of least privilege',
      'Serverless computing vs containerized services cost and latency trade-offs'
    ],
    adjacentRoles: ['DevOps Engineer', 'Site Reliability Engineer', 'Systems Engineer'],
    entryLevelExpectations: [
      'Understanding of core cloud primitives (compute, networking, storage, IAM)',
      'Ability to deploy a cloud application using either CLI or Terraform templates'
    ]
  },

  'cybersecurity': {
    id: 'cybersecurity',
    title: 'Cybersecurity Analyst',
    slug: 'cybersecurity-analyst',
    domain: 'software_it',
    summary: 'Protects enterprise digital assets through vulnerability management, threat intelligence, and incident response.',
    description: 'Cybersecurity analysts monitor computer networks and systems for malicious activity, evaluate vulnerabilities, enforce compliance standards, and lead rapid incident response during security breaches.',
    engineeringFamilies: ['Computer Science and Engineering', 'Information Technology', 'Software Engineering'],
    streams: ['Information Security', 'Network Defense'],
    specializations: ['Security Operations (SOC)', 'Vulnerability Assessment', 'Threat Analysis'],
    industries: ['Banking & Finance', 'Healthcare', 'Government & Defense', 'Tech'],
    workModes: ['Hybrid', 'Onsite', 'Remote'],
    interestTags: ['Security', 'Research'],
    experienceLevels: ['beginner', 'intern', 'entry_level'],
    beginnerFriendly: true,
    estimatedWeeks: { beginner: 14, intermediate: 9, advanced: 5 },
    requiredSkills: [
      {
        skillId: 'security_fundamentals',
        skillName: 'Network Security & Protocols',
        category: 'foundations',
        importance: 'critical',
        requiredLevel: 4,
        benchmarkDescription: 'TCP/IP handshake, TLS encryption, firewalls, DNS security, Wireshark packet analysis.',
        evidenceExamples: ['Packet capture audit identifying unencrypted credentials over HTTP/FTP'],
        prerequisites: [],
        suggestedPractice: 'Analyze suspicious network traffic in Wireshark to locate malicious payload.'
      },
      {
        skillId: 'vulnerability_scanning',
        skillName: 'Vulnerability Assessment & SIEM',
        category: 'core_technical',
        importance: 'critical',
        requiredLevel: 3,
        benchmarkDescription: 'Nmap reconnaissance, Nessus vulnerability scans, OWASP Top 10 vulnerabilities.',
        evidenceExamples: ['Vulnerability audit report detailing OWASP Top 10 mitigations for web app'],
        prerequisites: ['security_fundamentals'],
        suggestedPractice: 'Perform vulnerability scanning on a practice lab machine and draft remediation plan.'
      }
    ],
    prerequisiteSkills: ['security_fundamentals'],
    commonProjects: [
      'Home SOC lab with Splunk/Wazuh detecting brute-force SSH authentication attempts',
      'Web application penetration test documenting SQLi, XSS, and CSRF vulnerabilities',
      'Automated malware sandboxing script extracting indicators of compromise (IoCs)'
    ],
    commonResponsibilities: [
      'Monitor SIEM alerts and triage suspicious security anomalies in real-time',
      'Conduct scheduled vulnerability scans and collaborate with dev teams on patches',
      'Document security policies aligned with standards (ISO 27001, NIST, GDPR)',
      'Participate in simulated incident response table-top exercises'
    ],
    tools: ['Wireshark', 'Nmap', 'Splunk', 'Burp Suite', 'Linux', 'Metasploit', 'Python'],
    interviewTopics: [
      'Explain the CIA triad and how authentication differs from authorization',
      'OWASP Top 10 vulnerabilities: prevention of SQL injection, XSS, and broken auth',
      'Symmetric vs asymmetric encryption and public key infrastructure (PKI)',
      'Incident response lifecycle steps from detection to post-mortem review'
    ],
    adjacentRoles: ['Security Engineer', 'Systems Engineer', 'DevOps Engineer'],
    entryLevelExpectations: [
      'Clear understanding of TCP/IP networking, port numbers, and common attack vectors',
      'Familiarity with Linux security command line utilities and SIEM log inspection'
    ]
  },

  // ==========================================
  // AI & DATA SCIENCE
  // ==========================================
  'data_analyst': {
    id: 'data_analyst',
    title: 'Data Analyst',
    slug: 'data-analyst',
    domain: 'ai_data',
    summary: 'Transforms raw datasets into business insights, interactive dashboards, and strategic recommendations.',
    description: 'Data analysts interpret data, analyze results using statistical techniques, and build interactive dashboards to help leadership make sound business decisions.',
    engineeringFamilies: ['Computer Science and Engineering', 'Data Science and Analytics', 'Information Technology', 'Industrial Engineering'],
    streams: ['Business Intelligence', 'Statistical Analytics'],
    specializations: ['BI Dashboards', 'Product Analytics', 'SQL Modeling'],
    industries: ['E-Commerce', 'FinTech', 'Healthcare', 'Consulting', 'Logistics'],
    workModes: ['Remote', 'Hybrid', 'Onsite'],
    interestTags: ['Working with data', 'Solving mathematical problems'],
    experienceLevels: ['beginner', 'intern', 'entry_level'],
    beginnerFriendly: true,
    estimatedWeeks: { beginner: 10, intermediate: 6, advanced: 3 },
    requiredSkills: [
      {
        skillId: 'sql_analytics',
        skillName: 'Advanced SQL & Data Extraction',
        category: 'core_technical',
        importance: 'critical',
        requiredLevel: 4,
        benchmarkDescription: 'Window functions, CTEs, self-joins, aggregations, query execution plans.',
        evidenceExamples: ['Complex SQL query computing rolling 30-day customer retention cohorts'],
        prerequisites: [],
        suggestedPractice: 'Write window function queries calculating moving averages and percentile ranks.'
      },
      {
        skillId: 'python_data',
        skillName: 'Python for Data Analysis (Pandas, NumPy)',
        category: 'core_technical',
        importance: 'critical',
        requiredLevel: 4,
        benchmarkDescription: 'Data cleaning, missing value imputation, transformations, exploratory data analysis.',
        evidenceExamples: ['Jupyter notebook cleaning messy 100K-row dataset and extracting statistical trends'],
        prerequisites: [],
        suggestedPractice: 'Perform exploratory analysis on real-world dataset and visualize correlations.'
      },
      {
        skillId: 'bi_dashboards',
        skillName: 'BI Visualization (Power BI / Tableau)',
        category: 'tools',
        importance: 'high',
        requiredLevel: 3,
        benchmarkDescription: 'Interactive dashboard design, DAX measures, KPI cards, drill-down analytics.',
        evidenceExamples: ['Executive dashboard visualizing sales funnel conversions and churn rates'],
        prerequisites: ['sql_analytics'],
        suggestedPractice: 'Design an interactive executive sales dashboard with dynamic filtering.'
      }
    ],
    prerequisiteSkills: ['sql_analytics', 'python_data'],
    commonProjects: [
      'Customer churn analysis identifying top churn drivers with statistical regression',
      'Interactive retail sales dashboard tracking MoM growth, margins, and regional trends',
      'Marketing campaign attribution model calculating ROI across multiple digital channels'
    ],
    commonResponsibilities: [
      'Extract, clean, and validate data across enterprise data warehouses',
      'Build and maintain automated Power BI/Tableau reporting dashboards',
      'Perform statistical exploratory data analysis to evaluate operational performance',
      'Present findings and actionable recommendations to executive stakeholders'
    ],
    tools: ['SQL', 'Python', 'Pandas', 'Power BI', 'Tableau', 'Excel', 'Jupyter'],
    interviewTopics: [
      'SQL window functions: ROW_NUMBER vs RANK vs DENSE_RANK',
      'Handling outliers, missing values, and skewness during exploratory data analysis',
      'Interpreting correlation vs causation in business decision making',
      'Translating ambiguous business inquiries into quantitative data metrics'
    ],
    adjacentRoles: ['Data Engineer', 'Machine Learning Engineer', 'BI Analyst'],
    entryLevelExpectations: [
      'High proficiency writing multi-table SQL queries with aggregations and CTEs',
      'Portfolio project featuring clean exploratory analysis and interactive dashboard'
    ]
  },

  'data_engineer': {
    id: 'data_engineer',
    title: 'Data Engineer',
    slug: 'data-engineer',
    domain: 'ai_data',
    summary: 'Architects robust data pipelines, data warehouses, and scalable ingestion streams for enterprise analytics.',
    description: 'Data engineers build the plumbing of the data ecosystem. They design, construct, test, and maintain architectures such as large-scale processing systems and data pipelines feeding analytics and machine learning applications.',
    engineeringFamilies: ['Computer Science and Engineering', 'Data Science and Analytics', 'Information Technology'],
    streams: ['Data Architecture', 'Big Data Engineering'],
    specializations: ['ETL / ELT Pipelines', 'Data Warehousing', 'Streaming Ingestion'],
    industries: ['Tech', 'FinTech', 'E-Commerce', 'Telecommunications'],
    workModes: ['Remote', 'Hybrid', 'Onsite'],
    interestTags: ['Working with data', 'Building software'],
    experienceLevels: ['beginner', 'intern', 'entry_level'],
    beginnerFriendly: false,
    estimatedWeeks: { beginner: 15, intermediate: 10, advanced: 6 },
    requiredSkills: [
      {
        skillId: 'python_pipelines',
        skillName: 'Python for Pipeline Engineering',
        category: 'core_technical',
        importance: 'critical',
        requiredLevel: 4,
        benchmarkDescription: 'Object-oriented data pipelines, batch extraction, error recovery, API integrations.',
        evidenceExamples: ['Automated pipeline extracting data from 3 APIs and loading into PostgreSQL'],
        prerequisites: [],
        suggestedPractice: 'Build an idempotent data ingestion script with retry policies.'
      },
      {
        skillId: 'data_warehousing',
        skillName: 'Data Modeling & Warehousing',
        category: 'core_technical',
        importance: 'critical',
        requiredLevel: 4,
        benchmarkDescription: 'Star schema, snowflake schema, fact/dimension tables, partition pruning.',
        evidenceExamples: ['Data warehouse schema modeled in dbt with automated data quality tests'],
        prerequisites: ['python_pipelines'],
        suggestedPractice: 'Model an enterprise star schema with slowly changing dimensions (SCD).'
      },
      {
        skillId: 'pipeline_orchestration',
        skillName: 'Workflow Orchestration (Airflow / Prefect)',
        category: 'tools',
        importance: 'high',
        requiredLevel: 3,
        benchmarkDescription: 'DAG configuration, task dependencies, scheduled executions, retry alerts.',
        evidenceExamples: ['Airflow DAG orchestrating multi-step daily ETL pipeline'],
        prerequisites: ['python_pipelines'],
        suggestedPractice: 'Configure a Directed Acyclic Graph (DAG) with error alerting hooks.'
      }
    ],
    prerequisiteSkills: ['python_pipelines', 'data_warehousing'],
    commonProjects: [
      'Automated end-to-end ELT pipeline with dbt, Airflow, and PostgreSQL/Snowflake',
      'Real-time streaming pipeline processing transaction events with Kafka/RabbitMQ',
      'Data lakehouse storage structure organizing raw, silver, and gold analytical tables'
    ],
    commonResponsibilities: [
      'Design, build, and maintain scalable ETL and ELT data processing pipelines',
      'Model star and snowflake schemas in cloud data warehouses',
      'Implement data quality validation checks and schema drift monitors',
      'Optimize database queries and cluster partitioning to minimize processing costs'
    ],
    tools: ['Python', 'SQL', 'PostgreSQL', 'Airflow', 'dbt', 'Docker', 'Git'],
    interviewTopics: [
      'Idempotency in pipeline design and handling partial execution failures',
      'Star schema vs snowflake schema design trade-offs in analytical querying',
      'Batch processing vs stream processing architecture considerations',
      'Slowly changing dimensions (SCD Type 1 vs Type 2) implementation'
    ],
    adjacentRoles: ['Data Analyst', 'Machine Learning Engineer', 'Backend Developer'],
    entryLevelExpectations: [
      'Strong SQL querying and relational schema modeling skills',
      'Demonstrated experience building an automated pipeline loading data into a database'
    ]
  },

  'ml_engineer': {
    id: 'ml_engineer',
    title: 'Machine Learning Engineer',
    slug: 'machine-learning-engineer',
    domain: 'ai_data',
    summary: 'Designs, trains, evaluates, and deploys predictive machine learning models into production systems.',
    description: 'Machine learning engineers bridge statistical data science and scalable software engineering. They build data pipelines, select model architectures, prevent overfitting, and deploy high-availability inference APIs.',
    engineeringFamilies: ['Artificial Intelligence and Machine Learning', 'Data Science and Analytics', 'Computer Science and Engineering'],
    streams: ['Applied Machine Learning', 'Model Deployment'],
    specializations: ['Predictive Modeling', 'MLOps', 'Deep Learning'],
    industries: ['Autonomous Tech', 'FinTech', 'Healthcare', 'E-Commerce'],
    workModes: ['Remote', 'Hybrid', 'Onsite'],
    interestTags: ['Working with data', 'Solving mathematical problems', 'Research'],
    experienceLevels: ['beginner', 'intern', 'entry_level'],
    beginnerFriendly: false,
    estimatedWeeks: { beginner: 16, intermediate: 11, advanced: 6 },
    requiredSkills: [
      {
        skillId: 'ml_foundations',
        skillName: 'Machine Learning Foundations & Scikit-Learn',
        category: 'core_technical',
        importance: 'critical',
        requiredLevel: 4,
        benchmarkDescription: 'Supervised/unsupervised algorithms, regularization, cross-validation, loss functions.',
        evidenceExamples: ['Classification model pipeline with feature engineering, tuning, and ROC-AUC eval'],
        prerequisites: [],
        suggestedPractice: 'Implement a cross-validated random forest classifier with feature selection.'
      },
      {
        skillId: 'model_deployment',
        skillName: 'Model Serving & Inference APIs',
        category: 'core_technical',
        importance: 'critical',
        requiredLevel: 3,
        benchmarkDescription: 'Packaging models with FastAPI/TorchServe, batch inference, latency monitoring.',
        evidenceExamples: ['FastAPI REST service returning live predictions under 50ms latency'],
        prerequisites: ['ml_foundations'],
        suggestedPractice: 'Deploy an inference API in Docker with model artifact serialization.'
      },
      {
        skillId: 'python_math',
        skillName: 'Linear Algebra & Statistics',
        category: 'foundations',
        importance: 'high',
        requiredLevel: 3,
        benchmarkDescription: 'Matrix operations, vector calculus, hypothesis testing, probability distributions.',
        evidenceExamples: ['Mathematical derivation and code implementation of gradient descent'],
        prerequisites: [],
        suggestedPractice: 'Code a logistic regression model from scratch using only NumPy.'
      }
    ],
    prerequisiteSkills: ['ml_foundations', 'model_deployment'],
    commonProjects: [
      'Credit risk assessment model with feature importance explainability (SHAP values)',
      'Product recommendation engine with collaborative filtering and live FastAPI endpoint',
      'Automated MLOps pipeline tracking model drift and triggering automated retraining'
    ],
    commonResponsibilities: [
      'Develop, train, and validate predictive machine learning models on large datasets',
      'Package and deploy models as low-latency REST and gRPC inference services',
      'Monitor production model accuracy, data drift, and inference latency benchmarks',
      'Collaborate with data engineers to ensure clean feature pipeline inputs'
    ],
    tools: ['Python', 'Scikit-Learn', 'PyTorch', 'FastAPI', 'Docker', 'Pandas', 'Git'],
    interviewTopics: [
      'Bias-variance trade-off and regularization techniques (L1 vs L2)',
      'Precision vs recall vs F1-score: selecting appropriate metrics for imbalanced data',
      'Preventing data leakage between training and validation splits',
      'Techniques for serving models at low latency in production'
    ],
    adjacentRoles: ['Data Scientist', 'Data Engineer', 'AI Engineer'],
    entryLevelExpectations: [
      'Sound conceptual understanding of standard algorithms (trees, linear, clustering)',
      'Demonstrated project training a model and deploying it behind an HTTP API'
    ]
  },

  // ==========================================
  // ELECTRONICS & EMBEDDED
  // ==========================================
  'embedded_software': {
    id: 'embedded_software',
    title: 'Embedded Software Engineer',
    slug: 'embedded-software-engineer',
    domain: 'electronics_embedded',
    summary: 'Writes firmware and low-level drivers executing directly on microcontrollers and embedded processors.',
    description: 'Embedded software engineers develop code that runs directly on hardware with tight memory and power constraints. They interface with sensors, write bare-metal and RTOS drivers, and debug electronic signals.',
    engineeringFamilies: ['Electronics and Communication Engineering', 'Embedded Systems Engineering', 'Electrical and Electronics Engineering', 'Computer Science and Engineering'],
    streams: ['Microcontroller Systems', 'Firmware Development'],
    specializations: ['Bare-Metal C', 'RTOS Systems', 'Hardware Protocols'],
    industries: ['Automotive', 'Medical Devices', 'IoT & Consumer Electronics', 'Aerospace'],
    workModes: ['Onsite', 'Hybrid'],
    interestTags: ['Working with hardware', 'Building software'],
    experienceLevels: ['beginner', 'intern', 'entry_level'],
    beginnerFriendly: false,
    estimatedWeeks: { beginner: 16, intermediate: 11, advanced: 6 },
    requiredSkills: [
      {
        skillId: 'embedded_c',
        skillName: 'Embedded C / Bare-Metal Programming',
        category: 'core_technical',
        importance: 'critical',
        requiredLevel: 4,
        benchmarkDescription: 'Memory-mapped registers, bit manipulation, pointers, interrupt service routines (ISRs).',
        evidenceExamples: ['Bare-metal sensor logger writing to flash over SPI with DMA transfers'],
        prerequisites: [],
        suggestedPractice: 'Write a bare-metal GPIO and timer driver configured directly through registers.'
      },
      {
        skillId: 'microcontrollers_rtos',
        skillName: 'Microcontrollers & Real-Time OS (RTOS)',
        category: 'core_technical',
        importance: 'critical',
        requiredLevel: 3,
        benchmarkDescription: 'FreeRTOS tasks, priority scheduling, mutexes, semaphores, queue communication.',
        evidenceExamples: ['FreeRTOS application managing sensor sampling and wireless communication tasks'],
        prerequisites: ['embedded_c'],
        suggestedPractice: 'Implement a multi-task FreeRTOS app with queue communication and mutexes.'
      },
      {
        skillId: 'hw_protocols',
        skillName: 'Hardware Protocols (UART, SPI, I2C, CAN)',
        category: 'tools',
        importance: 'critical',
        requiredLevel: 3,
        benchmarkDescription: 'Timing diagrams, protocol handshakes, baud rates, oscilloscope signal validation.',
        evidenceExamples: ['I2C accelerometer driver capturing 3-axis readings validated on logic analyzer'],
        prerequisites: ['embedded_c'],
        suggestedPractice: 'Debug a communication glitch on an I2C bus using a digital logic analyzer.'
      }
    ],
    prerequisiteSkills: ['embedded_c', 'microcontrollers_rtos'],
    commonProjects: [
      'STM32 flight controller firmware with closed-loop PID attitude stabilization',
      'Ultra-low power IoT environmental logger waking from sleep every 10 minutes',
      'CAN bus automotive telemetry simulator with real-time speed and temperature frames'
    ],
    commonResponsibilities: [
      'Develop robust firmware in C/C++ running on ARM Cortex-M microcontrollers',
      'Design peripheral drivers for sensors, displays, and communication chips',
      'Validate hardware and firmware signals using oscilloscopes and logic analyzers',
      'Optimize firmware for strict real-time constraints and minimal power draw'
    ],
    tools: ['Embedded C', 'C++', 'STM32CubeIDE', 'FreeRTOS', 'Oscilloscope', 'Logic Analyzer', 'Git'],
    interviewTopics: [
      'Volatile keyword in C and why it is critical for interrupt service routines',
      'Priority inversion in real-time operating systems and mutex inheritance protocols',
      'Difference between UART, SPI, and I2C protocols regarding speed and bus topology',
      'Handling memory allocation in resource-constrained embedded systems'
    ],
    adjacentRoles: ['Firmware Engineer', 'IoT Engineer', 'Hardware Verification Engineer'],
    entryLevelExpectations: [
      'Ability to write C programs utilizing pointer arithmetic and bitwise operations',
      'Hands-on experience flashing code to a microcontroller and reading sensor data'
    ]
  },

  'vlsi_design': {
    id: 'vlsi_design',
    title: 'VLSI Design Engineer',
    slug: 'vlsi-design-engineer',
    domain: 'electronics_embedded',
    summary: 'Designs, synthesizes, and verifies digital logic circuits, RTL descriptions, and FPGA systems.',
    description: 'VLSI design engineers create semiconductor microchips, processor cores, and digital integrated circuits. They write Verilog/VHDL, synthesize logic into gates, and perform formal timing verification.',
    engineeringFamilies: ['Electronics and Communication Engineering', 'Electrical and Electronics Engineering', 'Embedded Systems Engineering'],
    streams: ['Digital Electronics', 'Semiconductor Systems'],
    specializations: ['RTL Design', 'FPGA Prototyping', 'Digital Verification'],
    industries: ['Semiconductors', 'Computing Hardware', 'Defense', 'Automotive'],
    workModes: ['Onsite', 'Hybrid'],
    interestTags: ['Working with hardware', 'Solving mathematical problems'],
    experienceLevels: ['beginner', 'intern', 'entry_level'],
    beginnerFriendly: false,
    estimatedWeeks: { beginner: 18, intermediate: 12, advanced: 6 },
    requiredSkills: [
      {
        skillId: 'verilog_vhdl',
        skillName: 'Digital Logic & Verilog / VHDL',
        category: 'core_technical',
        importance: 'critical',
        requiredLevel: 4,
        benchmarkDescription: 'RTL design, finite state machines (FSM), synchronous clocking, synthesizable code.',
        evidenceExamples: ['Implemented 5-stage pipelined 32-bit RISC-V CPU core in Verilog'],
        prerequisites: [],
        suggestedPractice: 'Design a parameterized FIFO memory buffer with full/empty flag logic.'
      },
      {
        skillId: 'comp_arch',
        skillName: 'Computer Architecture & Timing',
        category: 'foundations',
        importance: 'critical',
        requiredLevel: 4,
        benchmarkDescription: 'Pipelining, hazard mitigation, cache hierarchy, static timing analysis (STA).',
        evidenceExamples: ['Branch predictor and cache controller simulation with latency metrics'],
        prerequisites: ['verilog_vhdl'],
        suggestedPractice: 'Resolve setup and hold time violations in a synthesized clock domain.'
      }
    ],
    prerequisiteSkills: ['verilog_vhdl', 'comp_arch'],
    commonProjects: [
      'Pipelined RISC-V CPU core implementation verified on Xilinx Artix-7 FPGA',
      'Hardware accelerator for matrix multiplication synthesized with timing constraints',
      'Self-checking SystemVerilog testbench validating synchronous FIFO buffer'
    ],
    commonResponsibilities: [
      'Author synthesizable RTL descriptions in SystemVerilog or Verilog',
      'Verify digital logic behavior through self-checking simulation testbenches',
      'Perform static timing analysis (STA) to satisfy setup and hold constraints',
      'Prototype digital logic designs on Xilinx or Altera FPGA development boards'
    ],
    tools: ['Verilog', 'SystemVerilog', 'Vivado', 'ModelSim', 'FPGA', 'Git'],
    interviewTopics: [
      'Setup time and hold time definitions and resolving timing violations',
      'Blocking vs non-blocking assignments in Verilog and race conditions',
      'Design of synchronous vs asynchronous reset finite state machines',
      'Pipelining hazards: structural, data (forwarding), and control hazards'
    ],
    adjacentRoles: ['FPGA Engineer', 'Hardware Verification Engineer', 'Embedded Software Engineer'],
    entryLevelExpectations: [
      'Sound mastery of digital logic fundamentals, Karnaugh maps, and flip-flops',
      'Demonstrated RTL design project verified through simulation waveforms'
    ]
  },

  // ==========================================
  // MECHANICAL & ROBOTICS
  // ==========================================
  'mech_design': {
    id: 'mech_design',
    title: 'Mechanical Design Engineer',
    slug: 'mechanical-design-engineer',
    domain: 'mechanical_manufacturing',
    summary: 'Designs physical products, mechanisms, and tooling using 3D CAD modeling, FEA simulation, and GD&T.',
    description: 'Mechanical design engineers create products from conceptual sketches to production-ready manufacturing blueprints. They calculate stress loads, select materials, specify tolerances, and design for manufacturing (DFM).',
    engineeringFamilies: ['Mechanical Engineering', 'Automobile Engineering', 'Aerospace Engineering', 'Mechatronics Engineering'],
    streams: ['Machine Design', 'Product Engineering'],
    specializations: ['3D CAD Modeling', 'FEA Simulation', 'Design for Manufacturing (DFM)'],
    industries: ['Automotive', 'Consumer Hardware', 'Aerospace', 'Heavy Machinery'],
    workModes: ['Onsite', 'Hybrid'],
    interestTags: ['Designing products', 'Working with machines'],
    experienceLevels: ['beginner', 'intern', 'entry_level'],
    beginnerFriendly: true,
    estimatedWeeks: { beginner: 14, intermediate: 9, advanced: 5 },
    requiredSkills: [
      {
        skillId: 'cad_modeling',
        skillName: 'Parametric 3D CAD Modeling (SolidWorks/Fusion)',
        category: 'core_technical',
        importance: 'critical',
        requiredLevel: 4,
        benchmarkDescription: 'Complex part modeling, assembly constraints, sheet metal, surface modeling.',
        evidenceExamples: ['Production-ready gearbox assembly featuring 20+ constrained components'],
        prerequisites: [],
        suggestedPractice: 'Model a sheet-metal enclosure with bend allowances and hardware cutouts.'
      },
      {
        skillId: 'gdt_standards',
        skillName: 'GD&T (ASME Y14.5) & Drafting',
        category: 'core_technical',
        importance: 'critical',
        requiredLevel: 3,
        benchmarkDescription: 'Datums, geometric tolerances, tolerance stack-up analysis, fabrication drawings.',
        evidenceExamples: ['Detailed 2D engineering drawings with datum references and position tolerance'],
        prerequisites: ['cad_modeling'],
        suggestedPractice: 'Perform 1D tolerance stack-up analysis on a pin and bushing assembly.'
      },
      {
        skillId: 'fea_simulation',
        skillName: 'Finite Element Analysis (FEA)',
        category: 'domain_skills',
        importance: 'high',
        requiredLevel: 3,
        benchmarkDescription: 'Mesh convergence, von Mises stress, factor of safety, boundary conditions.',
        evidenceExamples: ['ANSYS stress simulation on structural bracket achieving factor of safety > 2.0'],
        prerequisites: ['cad_modeling'],
        suggestedPractice: 'Simulate structural load on a cantilever arm and verify mesh convergence.'
      }
    ],
    prerequisiteSkills: ['cad_modeling', 'gdt_standards'],
    commonProjects: [
      'Lightweight automotive suspension knuckle topology-optimized in SolidWorks',
      'Injection-molded consumer electronics enclosure designed with DFM draft angles',
      'Custom planetary reduction gearbox with FEA load verification and 2D fabrication prints'
    ],
    commonResponsibilities: [
      'Create parametric 3D models and multi-part assemblies in SolidWorks or CATIA',
      'Generate production 2D technical drawings adhering to ASME Y14.5 GD&T standards',
      'Conduct structural FEA simulations to verify safety margins under operating loads',
      'Coordinate with machine shops on machining (CNC), sheet metal, and injection molding'
    ],
    tools: ['SolidWorks', 'ANSYS', 'AutoCAD', 'Fusion 360', 'Excel', 'MATLAB'],
    interviewTopics: [
      'Principles of GD&T: true position, bonus tolerance, and datum reference frames',
      'Design for Manufacturing (DFM) rules for injection molding (draft, rib thickness)',
      'Stress-strain curve interpretation, yield strength vs ultimate tensile strength',
      'Failure theories: von Mises vs Tresca yield criteria'
    ],
    adjacentRoles: ['Automotive Engineer', 'Robotics Engineer', 'Manufacturing Engineer'],
    entryLevelExpectations: [
      'CAD portfolio showcasing clean feature trees and constrained assemblies',
      'Demonstrated understanding of standard manufacturing processes and materials'
    ]
  },

  'robotics_engineer': {
    id: 'robotics_engineer',
    title: 'Robotics Engineer',
    slug: 'robotics-engineer',
    domain: 'interdisciplinary',
    summary: 'Integrates mechanical kinematics, sensors, control loops, and autonomous navigation for robotic systems.',
    description: 'Robotics engineers develop intelligent mechanical systems that perceive their environment and execute tasks autonomously. They integrate forward/inverse kinematics, computer vision, motor controllers, and ROS.',
    engineeringFamilies: ['Robotics and Automation', 'Mechatronics Engineering', 'Mechanical Engineering', 'Electronics and Communication Engineering', 'Computer Science and Engineering'],
    streams: ['Autonomous Systems', 'Mechatronics & Control'],
    specializations: ['Robot Operating System (ROS)', 'Kinematics & Motion Planning', 'Sensors & Actuators'],
    industries: ['Industrial Automation', 'Warehousing & Logistics', 'Aerospace', 'Healthcare'],
    workModes: ['Onsite', 'Hybrid'],
    interestTags: ['Working with machines', 'Automation', 'Working with hardware'],
    experienceLevels: ['beginner', 'intern', 'entry_level'],
    beginnerFriendly: false,
    estimatedWeeks: { beginner: 18, intermediate: 12, advanced: 6 },
    requiredSkills: [
      {
        skillId: 'ros_middleware',
        skillName: 'Robot Operating System (ROS / ROS2)',
        category: 'core_technical',
        importance: 'critical',
        requiredLevel: 4,
        benchmarkDescription: 'Nodes, topics, services, actions, URDF modeling, tf coordinate transforms.',
        evidenceExamples: ['Autonomous mobile robot simulated in Gazebo with ROS2 navigation stack'],
        prerequisites: [],
        suggestedPractice: 'Configure a ROS2 package with publisher, subscriber, and coordinate transforms.'
      },
      {
        skillId: 'kinematics_control',
        skillName: 'Robot Kinematics & Control Loops (PID)',
        category: 'core_technical',
        importance: 'critical',
        requiredLevel: 3,
        benchmarkDescription: 'Forward and inverse kinematics, Denavit-Hartenberg parameters, PID tuning.',
        evidenceExamples: ['6-DOF robotic arm inverse kinematics solver calculating joint trajectory'],
        prerequisites: ['ros_middleware'],
        suggestedPractice: 'Tune a closed-loop PID controller for DC motor position tracking.'
      }
    ],
    prerequisiteSkills: ['ros_middleware', 'kinematics_control'],
    commonProjects: [
      'Autonomous mobile robot with LiDAR SLAM mapping and dynamic obstacle avoidance',
      'Pick-and-place 4-axis SCARA arm controlled via computer vision color detection',
      'Bipedal walking robot gait balance simulator in Python with inverse kinematics'
    ],
    commonResponsibilities: [
      'Develop robotic software nodes in C++ and Python using ROS/ROS2',
      'Integrate sensors (LiDAR, IMU, depth cameras) and motor encoders',
      'Implement forward/inverse kinematics and closed-loop motor control algorithms',
      'Test autonomous navigation, localization, and trajectory planning in simulation'
    ],
    tools: ['ROS2', 'Python', 'C++', 'Gazebo', 'Linux', 'SolidWorks', 'OpenCV'],
    interviewTopics: [
      'Forward kinematics vs inverse kinematics and DH parameter convention',
      'SLAM (Simultaneous Localization and Mapping) principles and sensor fusion',
      'PID controller tuning: effects of proportional, integral, and derivative gains',
      'Coordinate frames and transformation matrices in 3D robotic space'
    ],
    adjacentRoles: ['Mechatronics Engineer', 'Embedded Software Engineer', 'Control Systems Engineer'],
    entryLevelExpectations: [
      'Working knowledge of ROS2 communication architecture and coordinate transforms',
      'Demonstrated project implementing sensor integration and closed-loop motor motion'
    ]
  },

  // ==========================================
  // CIVIL & INFRASTRUCTURE
  // ==========================================
  'structural_engineer': {
    id: 'structural_engineer',
    title: 'Structural Engineer',
    slug: 'structural-engineer',
    domain: 'civil_infra',
    summary: 'Analyzes structural loads and designs reinforced concrete and steel infrastructure adhering to building codes.',
    description: 'Structural engineers ensure that buildings, bridges, and infrastructure withstand static and dynamic environmental forces without failure. They calculate dead, live, wind, and seismic loads and specify steel reinforcements.',
    engineeringFamilies: ['Civil Engineering', 'Structural Engineering'],
    streams: ['Structural Analysis', 'Concrete & Steel Design'],
    specializations: ['Seismic Analysis', 'Reinforced Concrete Design', 'Steel Structures'],
    industries: ['Construction', 'Civil Infrastructure', 'Consulting Engineering'],
    workModes: ['Onsite', 'Hybrid'],
    interestTags: ['Designing products', 'Working outdoors'],
    experienceLevels: ['beginner', 'intern', 'entry_level'],
    beginnerFriendly: true,
    estimatedWeeks: { beginner: 15, intermediate: 10, advanced: 5 },
    requiredSkills: [
      {
        skillId: 'structural_analysis',
        skillName: 'Structural Analysis & Load Computation',
        category: 'core_technical',
        importance: 'critical',
        requiredLevel: 4,
        benchmarkDescription: 'Bending moment diagrams, shear force, deflection, frame analysis with STAAD/ETABS.',
        evidenceExamples: ['ETABS analysis of G+5 commercial frame under dead, live, and seismic load combinations'],
        prerequisites: [],
        suggestedPractice: 'Calculate bending moment and shear force diagrams for a continuous beam.'
      },
      {
        skillId: 'design_codes',
        skillName: 'Concrete & Steel Design Codes (IS 456 / ACI 318)',
        category: 'core_technical',
        importance: 'critical',
        requiredLevel: 4,
        benchmarkDescription: 'Limit state design, rebar detailing, beam/column interaction, foundation design.',
        evidenceExamples: ['RCC column reinforcement schedule design complying with code requirements'],
        prerequisites: ['structural_analysis'],
        suggestedPractice: 'Design an isolated footing reinforcement schedule under axial load.'
      }
    ],
    prerequisiteSkills: ['structural_analysis', 'design_codes'],
    commonProjects: [
      'Complete structural design and rebar detailing of a multi-story residential building',
      'Seismic vulnerability assessment and retrofitting plan for legacy masonry structure',
      'Design of a steel truss pedestrian bridge with STAAD.Pro load optimization'
    ],
    commonResponsibilities: [
      'Model 3D structural frames in ETABS/STAAD.Pro under multi-hazard load conditions',
      'Calculate member sizing and steel reinforcement according to regional building codes',
      'Prepare structural engineering drawings and rebar bending schedules for construction',
      'Conduct site inspections to verify that rebar placement matches structural drawings'
    ],
    tools: ['ETABS', 'STAAD.Pro', 'AutoCAD', 'Revit', 'Excel', 'SAP2000'],
    interviewTopics: [
      'Limit state method vs working stress method principles and safety factors',
      'Ductility and ductile detailing requirements under seismic loading conditions',
      'Primary causes of structural deflection, cracking, and shear failure in beams',
      'Interpretation of wind and earthquake load distribution across high-rise frames'
    ],
    adjacentRoles: ['BIM Engineer', 'Site Engineer', 'Geotechnical Engineer'],
    entryLevelExpectations: [
      'Thorough understanding of strength of materials, bending moments, and shear forces',
      'Experience modeling a structural frame in ETABS or STAAD.Pro with load combinations'
    ]
  },

  'bim_engineer': {
    id: 'bim_engineer',
    title: 'BIM Engineer',
    slug: 'bim-engineer',
    domain: 'civil_infra',
    summary: 'Coordinates multi-disciplinary architectural, structural, and MEP models using Revit and Navisworks.',
    description: 'Building Information Modeling (BIM) engineers manage digital representations of physical infrastructure. They detect clashes between structural elements and plumbing/electrical conduits to prevent costly site delays.',
    engineeringFamilies: ['Civil Engineering', 'Structural Engineering', 'Architecture'],
    streams: ['Digital Construction', 'BIM Coordination'],
    specializations: ['3D Modeling in Revit', 'Clash Detection', '4D Construction Scheduling'],
    industries: ['Commercial Construction', 'Infrastructure Megaprojects', 'Consulting'],
    workModes: ['Hybrid', 'Onsite'],
    interestTags: ['Designing products', 'Automation'],
    experienceLevels: ['beginner', 'intern', 'entry_level'],
    beginnerFriendly: true,
    estimatedWeeks: { beginner: 12, intermediate: 8, advanced: 4 },
    requiredSkills: [
      {
        skillId: 'revit_modeling',
        skillName: '3D BIM Modeling in Autodesk Revit',
        category: 'core_technical',
        importance: 'critical',
        requiredLevel: 4,
        benchmarkDescription: 'Parametric families, structural elements, MEP routing, LOD 300 models.',
        evidenceExamples: ['Detailed 3D Revit structural model with schedules and sheets generation'],
        prerequisites: [],
        suggestedPractice: 'Create a parametric Revit family for a structural precast component.'
      },
      {
        skillId: 'clash_detection',
        skillName: 'Clash Detection & Navisworks Coordination',
        category: 'tools',
        importance: 'critical',
        requiredLevel: 3,
        benchmarkDescription: 'Federated model coordination, hard/soft clash tests, clash resolution reports.',
        evidenceExamples: ['Navisworks clash detection audit resolving 45 structural-MEP conflicts'],
        prerequisites: ['revit_modeling'],
        suggestedPractice: 'Run clash tests between architectural structural frame and HVAC ductwork.'
      }
    ],
    prerequisiteSkills: ['revit_modeling'],
    commonProjects: [
      'Federated BIM model of hospital wing coordinating architectural, structural, and HVAC',
      '4D construction simulation linking Revit model elements to MS Project schedule',
      'Parametric BIM library of reusable precast concrete elements with automated BOM'
    ],
    commonResponsibilities: [
      'Develop coordinated 3D BIM models in Autodesk Revit across disciplines',
      'Run automated clash detection tests in Navisworks and chair coordination meetings',
      'Extract quantity take-offs (QTO) and bill of materials directly from digital models',
      'Ensure model compliance with BIM execution plans (BEP) and Level of Development (LOD)'
    ],
    tools: ['Autodesk Revit', 'Navisworks', 'AutoCAD', 'BIM 360', 'Excel'],
    interviewTopics: [
      'Level of Development (LOD 100 to LOD 500) definitions and contractual relevance',
      'Clash detection methodology: hard clashes vs clearance/soft clashes',
      'BIM Execution Plan (BEP) components and stakeholder communication protocols',
      'Extracting accurate quantities and automated schedules from federated models'
    ],
    adjacentRoles: ['Structural Engineer', 'Site Engineer', 'Construction Project Engineer'],
    entryLevelExpectations: [
      'Hands-on proficiency with Autodesk Revit modeling and sheet preparation',
      'Understanding of construction sequencing and multi-disciplinary coordination'
    ]
  },

  // ==========================================
  // CHEMICAL, BIO, MATERIALS
  // ==========================================
  'process_engineer': {
    id: 'process_engineer',
    title: 'Process Engineer',
    slug: 'process-engineer',
    domain: 'chemical_bio_materials',
    summary: 'Designs, optimizes, and scales industrial chemical processes, reaction vessels, and distillation columns.',
    description: 'Process engineers transform raw materials into commercial products. They design mass and energy balances, select heat exchangers and reactors, model fluid flow, and enforce environmental and safety compliance (HAZOP).',
    engineeringFamilies: ['Chemical Engineering', 'Biotechnology', 'Petroleum Engineering'],
    streams: ['Chemical Plant Engineering', 'Process Simulation'],
    specializations: ['Mass & Energy Balances', 'Aspen HYSYS Simulation', 'Process Safety (HAZOP)'],
    industries: ['Pharmaceuticals', 'Petrochemicals', 'Specialty Chemicals', 'Food Production'],
    workModes: ['Onsite', 'Hybrid'],
    interestTags: ['Sustainability', 'Working with machines'],
    experienceLevels: ['beginner', 'intern', 'entry_level'],
    beginnerFriendly: true,
    estimatedWeeks: { beginner: 14, intermediate: 9, advanced: 5 },
    requiredSkills: [
      {
        skillId: 'mass_energy_balance',
        skillName: 'Mass & Energy Balances',
        category: 'core_technical',
        importance: 'critical',
        requiredLevel: 4,
        benchmarkDescription: 'Steady-state balances, thermodynamics, stoichiometry, recycle streams.',
        evidenceExamples: ['Rigorous mass balance model for multi-stage bio-ethanol distillation column'],
        prerequisites: [],
        suggestedPractice: 'Solve mass and energy balance equations for an adiabatic reactor.'
      },
      {
        skillId: 'aspen_simulation',
        skillName: 'Process Simulation (Aspen Plus / HYSYS)',
        category: 'tools',
        importance: 'critical',
        requiredLevel: 3,
        benchmarkDescription: 'Thermodynamic property packages, flowsheet convergence, unit operations modeling.',
        evidenceExamples: ['Aspen HYSYS simulation of hydrocarbon separation plant optimizing energy use by 18%'],
        prerequisites: ['mass_energy_balance'],
        suggestedPractice: 'Simulate a binary distillation column in Aspen with reflux ratio optimization.'
      }
    ],
    prerequisiteSkills: ['mass_energy_balance'],
    commonProjects: [
      'Flowsheet simulation and equipment sizing for green hydrogen production unit',
      'HAZOP safety review documentation for pilot chemical reactor scale-up',
      'Energy integration pinch analysis reducing cooling water demand by 25%'
    ],
    commonResponsibilities: [
      'Compute mass and energy balances for industrial chemical processing units',
      'Model and optimize chemical flowsheets in Aspen Plus or Aspen HYSYS',
      'Size process equipment: distillation columns, heat exchangers, pumps, and reactors',
      'Participate in Process Safety Management (PSM) and HAZOP hazard assessments'
    ],
    tools: ['Aspen Plus', 'Aspen HYSYS', 'MATLAB', 'Excel', 'AutoCAD P&ID'],
    interviewTopics: [
      'Thermodynamic property method selection (NRTL, Peng-Robinson, UNIQUAC)',
      'HAZOP methodology: guide words (MORE, LESS, NO) and risk mitigation',
      'Principles of heat exchanger pinch analysis and minimum utility requirements',
      'Distillation column troubleshooting: flooding, weeping, and entrainment'
    ],
    adjacentRoles: ['Quality Engineer', 'Materials Engineer', 'Bioprocess Engineer'],
    entryLevelExpectations: [
      'Solid command of chemical engineering thermodynamics and unit operations',
      'Demonstrated experience modeling a chemical flowsheet in Aspen or DWSIM'
    ]
  },

  'bioinformatics_engineer': {
    id: 'bioinformatics_engineer',
    title: 'Bioinformatics Engineer',
    slug: 'bioinformatics-engineer',
    domain: 'chemical_bio_materials',
    summary: 'Builds computational pipelines to analyze genomic sequencing data, protein structures, and clinical datasets.',
    description: 'Bioinformatics engineers develop algorithms and cloud pipelines to analyze large-scale biological datasets. They process next-generation sequencing (NGS), perform variant calling, and model biomolecules.',
    engineeringFamilies: ['Biotechnology', 'Biomedical Engineering', 'Computer Science and Engineering', 'Data Science and Analytics'],
    streams: ['Computational Biology', 'Genomics Engineering'],
    specializations: ['NGS Pipeline Development', 'Variant Calling', 'Biopython Analysis'],
    industries: ['Pharmaceuticals', 'Genomics Research', 'Biotech Startups', 'Healthcare'],
    workModes: ['Remote', 'Hybrid', 'Onsite'],
    interestTags: ['Research', 'Healthcare technology', 'Working with data'],
    experienceLevels: ['beginner', 'intern', 'entry_level'],
    beginnerFriendly: true,
    estimatedWeeks: { beginner: 14, intermediate: 9, advanced: 5 },
    requiredSkills: [
      {
        skillId: 'python_biopython',
        skillName: 'Python for Computational Biology (Biopython)',
        category: 'core_technical',
        importance: 'critical',
        requiredLevel: 4,
        benchmarkDescription: 'FASTA/FASTQ parsing, sequence alignment algorithms, variant filtering, Pandas dataframes.',
        evidenceExamples: ['Automated Python pipeline parsing genomic BAM files to filter pathogenic mutations'],
        prerequisites: [],
        suggestedPractice: 'Write a script parsing variant call format (VCF) files for high-impact mutations.'
      },
      {
        skillId: 'ngs_pipelines',
        skillName: 'NGS Data Workflows (BWA, GATK, Nextflow)',
        category: 'core_technical',
        importance: 'critical',
        requiredLevel: 3,
        benchmarkDescription: 'Quality control (FastQC), read alignment (BWA), variant calling (GATK), workflow engines.',
        evidenceExamples: ['Nextflow workflow executing reproducible RNA-seq differential expression analysis'],
        prerequisites: ['python_biopython'],
        suggestedPractice: 'Execute a read alignment and quality control pipeline on public genomic datasets.'
      }
    ],
    prerequisiteSkills: ['python_biopython'],
    commonProjects: [
      'Reproducible Nextflow pipeline for whole-exome sequencing variant calling',
      'Machine learning model predicting protein-ligand binding affinity from structural data',
      'Differential gene expression analysis of cancer tumor datasets using R/Bioconductor'
    ],
    commonResponsibilities: [
      'Develop automated Nextflow/Snakemake pipelines for NGS sequence analysis',
      'Analyze genomic variant call files (VCF) and annotate clinical significance',
      'Maintain biological databases and interface with public repositories (NCBI, Ensembl)',
      'Collaborate with wet-lab scientists to validate computational findings experimentally'
    ],
    tools: ['Python', 'Biopython', 'Nextflow', 'R / Bioconductor', 'Linux', 'Docker', 'Git'],
    interviewTopics: [
      'Sequence alignment principles: Smith-Waterman vs BLAST heuristic trade-offs',
      'Structure and purpose of standard genomic file formats (FASTQ, SAM/BAM, VCF)',
      'GATK Best Practices workflow steps for germline variant discovery',
      'Reproducibility in computational biology through containerization and Nextflow'
    ],
    adjacentRoles: ['Data Scientist', 'Machine Learning Engineer', 'Biomedical Engineer'],
    entryLevelExpectations: [
      'Strong Python programming skills and comfort working in a Linux terminal',
      'Understanding of central dogma of molecular biology and genetic variation'
    ]
  }
};

// ==========================================
// HELPER FUNCTIONS & BUSINESS LOGIC
// ==========================================

export function calculateInterestMatch(
  role: CareerRole,
  selectedInterests: string[]
): { score: number; label: string } {
  if (!selectedInterests || selectedInterests.length === 0) {
    return { score: 0.5, label: 'Explore role' };
  }

  const matchedCount = role.interestTags.filter(tag =>
    selectedInterests.includes(tag)
  ).length;

  const score = Math.round((matchedCount / selectedInterests.length) * 100);

  if (score >= 60) {
    return { score, label: 'Strong interest match' };
  } else if (score >= 30) {
    return { score, label: 'Good interest match' };
  }
  return { score, label: 'Explore further' };
}

export function calculateSkillOverlap(
  role: CareerRole,
  extractedSkills: string[]
): number {
  if (!extractedSkills || extractedSkills.length === 0 || !role.requiredSkills) {
    return 0;
  }

  const normalizedExtracted = extractedSkills.map(s => s.toLowerCase());
  let matches = 0;

  for (const req of role.requiredSkills) {
    const isMatch = normalizedExtracted.some(
      s => s.includes(req.skillName.toLowerCase()) || req.skillName.toLowerCase().includes(s)
    );
    if (isMatch) matches++;
  }

  return Math.min(100, Math.round((matches / role.requiredSkills.length) * 100));
}

export function isBranchAligned(role: CareerRole, userBranch?: string): boolean {
  if (!userBranch) return true;
  return role.engineeringFamilies.some(fam =>
    fam.toLowerCase().includes(userBranch.toLowerCase()) ||
    userBranch.toLowerCase().includes(fam.toLowerCase())
  );
}

export function getGenericRoleFallback(roleId: string, roleTitle?: string): CareerRole {
  const title = roleTitle || roleId.replace(/_/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase());
  return {
    id: roleId,
    title,
    slug: roleId.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    domain: 'software_it',
    summary: \`Engineering professional specializing in \${title} principles, systems, and modern workflows.\`,
    description: \`The \${title} role focuses on industry engineering delivery, technical problem solving, rigorous verification, and standard compliance across modern engineering teams.\`,
    engineeringFamilies: ['General Engineering', 'Applied Technology'],
    streams: ['Technical Delivery'],
    specializations: ['Core Competencies'],
    industries: ['Technology', 'Engineering Consulting'],
    workModes: ['Hybrid', 'Onsite', 'Remote'],
    interestTags: ['Building software', 'Solving mathematical problems'],
    experienceLevels: ['beginner', 'intern', 'entry_level'],
    beginnerFriendly: true,
    estimatedWeeks: { beginner: 12, intermediate: 8, advanced: 4 },
    requiredSkills: [
      {
        skillId: 'core_discipline',
        skillName: \`\${title} Fundamentals\`,
        category: 'foundations',
        importance: 'critical',
        requiredLevel: 4,
        benchmarkDescription: \`Fundamental principles, design standards, and technical methodologies for \${title}.\`,
        evidenceExamples: [\`Completed technical project demonstrating \${title} practices\`],
        prerequisites: [],
        suggestedPractice: 'Review core engineering principles and document a hands-on project.'
      },
      {
        skillId: 'technical_tooling',
        skillName: 'Industry Tooling & Workflow',
        category: 'tools',
        importance: 'high',
        requiredLevel: 3,
        benchmarkDescription: 'Standard engineering design, simulation, or software tools.',
        evidenceExamples: ['Hands-on software or lab tool verification'],
        prerequisites: [],
        suggestedPractice: 'Practice core software tools used in industry operations.'
      }
    ],
    prerequisiteSkills: ['core_discipline'],
    commonProjects: [\`Applied technical project showcasing \${title} capabilities\`],
    commonResponsibilities: [
      'Execute core engineering workflows according to project specifications',
      'Collaborate across multi-disciplinary engineering teams',
      'Validate technical quality against documented standards'
    ],
    tools: ['Standard Engineering Stack', 'Git', 'Excel'],
    interviewTopics: [
      \`Core conceptual foundations of \${title}\`,
      'Problem solving methodology and troubleshooting engineering defects'
    ],
    adjacentRoles: ['Systems Engineer', 'Solutions Engineer'],
    entryLevelExpectations: [
      'Demonstrated fundamental understanding of engineering domain concepts',
      'Ability to complete structured tasks with engineering rigor'
    ]
  };
}
`;

fs.writeFileSync(path.resolve(process.cwd(), 'src/data/roles.ts'), rolesContent, 'utf-8');
console.log('Successfully written src/data/roles.ts with rich CareerRole catalog!');

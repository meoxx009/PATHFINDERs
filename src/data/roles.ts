/**
 * SkillForge AI — Engineering Roles Catalog
 * Detailed role definitions mapped to branches, specializations, skills, and evidence benchmarks.
 */

import type { ProficiencyLevel } from './skills';

export interface RoleSkillRequirement {
  skillId: string;
  skillName: string;
  importance: 'critical' | 'high' | 'medium';
  minimumLevel: ProficiencyLevel;
  benchmarkDescription: string;
}

export interface EngineeringRole {
  id: string;
  title: string;
  domain: 'software_it' | 'ai_data' | 'electronics_embedded' | 'mechanical_manufacturing' | 'civil_infra' | 'chemical_bio_materials' | 'interdisciplinary';
  summary: string;
  requiredSkills: RoleSkillRequirement[];
  prerequisiteSkills: string[];
  evidenceExamples: string[];
}

export const ROLES_CATALOG: Record<string, EngineeringRole> = {
  // ==========================================
  // SOFTWARE & IT
  // ==========================================
  'frontend': {
    id: 'frontend',
    title: 'Frontend Developer',
    domain: 'software_it',
    summary: 'Builds responsive, accessible, interactive web applications and interfaces integrating with modern APIs.',
    requiredSkills: [
      {
        skillId: 'html_css_web',
        skillName: 'HTML5, Semantic Markup & CSS3',
        importance: 'critical',
        minimumLevel: 4,
        benchmarkDescription: 'Semantic structure, Flexbox/Grid layouts, web accessibility (a11y), responsive design.',
      },
      {
        skillId: 'javascript_typescript',
        skillName: 'JavaScript & TypeScript',
        importance: 'critical',
        minimumLevel: 4,
        benchmarkDescription: 'ES6+ features, closures, promises, async/await, static typing, and interfaces.',
      },
      {
        skillId: 'react_architecture',
        skillName: 'React & Component Architecture',
        importance: 'critical',
        minimumLevel: 3,
        benchmarkDescription: 'Hooks, custom state management, component decomposition, and performance optimization.',
      },
      {
        skillId: 'git_version_control',
        skillName: 'Git & Version Control Workflow',
        importance: 'high',
        minimumLevel: 3,
        benchmarkDescription: 'Branching, PR reviews, merge hygiene, and collaboration conventions.',
      },
      {
        skillId: 'testing_qa',
        skillName: 'Automated Testing & QA Rigor',
        importance: 'medium',
        minimumLevel: 2,
        benchmarkDescription: 'Unit and component testing with Vitest or React Testing Library.',
      },
    ],
    prerequisiteSkills: ['dsa', 'networks'],
    evidenceExamples: [
      'Interactive single-page web app with client-side state and responsive layout',
      'Production deployment on Vercel/Netlify with Lighthouse 90+ performance audit',
      'Reusable UI design system components adhering to WCAG accessibility guidelines',
    ],
  },

  'backend': {
    id: 'backend',
    title: 'Backend Developer',
    domain: 'software_it',
    summary: 'Designs scalable server architectures, resilient REST/gRPC APIs, database schemas, and background services.',
    requiredSkills: [
      {
        skillId: 'node_express',
        skillName: 'Node.js & Backend Architecture',
        importance: 'critical',
        minimumLevel: 4,
        benchmarkDescription: 'RESTful API routing, middleware pipelines, authentication tokens (JWT), error handling.',
      },
      {
        skillId: 'sql_databases',
        skillName: 'SQL & Relational Database Design',
        importance: 'critical',
        minimumLevel: 4,
        benchmarkDescription: 'Relational 3NF schemas, foreign key indexes, transaction isolation, execution plans.',
      },
      {
        skillId: 'dsa',
        skillName: 'Data Structures & Algorithms',
        importance: 'critical',
        minimumLevel: 3,
        benchmarkDescription: 'Optimal data structures for in-memory indexing, caching, and rate limiting.',
      },
      {
        skillId: 'docker_containerization',
        skillName: 'Docker & Containerization',
        importance: 'high',
        minimumLevel: 3,
        benchmarkDescription: 'Containerizing backend services, configuring environment variables and volumes.',
      },
      {
        skillId: 'git_version_control',
        skillName: 'Git & Version Control Workflow',
        importance: 'high',
        minimumLevel: 3,
        benchmarkDescription: 'Branching strategies, code reviews, and semantic release tagging.',
      },
    ],
    prerequisiteSkills: ['os_concepts', 'networks'],
    evidenceExamples: [
      'REST API with authenticated endpoints, input validation, and PostgreSQL database',
      'Redis caching implementation reducing database read query latency by >50%',
      'Automated integration test suite with mocking for third-party services',
    ],
  },

  'fullstack': {
    id: 'fullstack',
    title: 'Full-Stack Developer',
    domain: 'software_it',
    summary: 'End-to-end web engineering bridging dynamic client interfaces with robust server and database architectures.',
    requiredSkills: [
      {
        skillId: 'react_architecture',
        skillName: 'React & Component Architecture',
        importance: 'critical',
        minimumLevel: 3,
        benchmarkDescription: 'Interactive frontend state management and modular UI components.',
      },
      {
        skillId: 'node_express',
        skillName: 'Node.js & Backend Architecture',
        importance: 'critical',
        minimumLevel: 3,
        benchmarkDescription: 'Server routing, secure session authentication, and REST endpoint construction.',
      },
      {
        skillId: 'sql_databases',
        skillName: 'SQL & Relational Database Design',
        importance: 'high',
        minimumLevel: 3,
        benchmarkDescription: 'Relational data modeling, migrations, and ORM query optimization.',
      },
      {
        skillId: 'git_version_control',
        skillName: 'Git & Version Control Workflow',
        importance: 'high',
        minimumLevel: 3,
        benchmarkDescription: 'Full-stack monorepo management, pull requests, and branch workflows.',
      },
    ],
    prerequisiteSkills: ['dsa', 'javascript_typescript'],
    evidenceExamples: [
      'End-to-end full stack application with authentication, database persistence, and deployed frontend',
      'Integration of payment gateway or third-party webhooks with transactional integrity',
    ],
  },

  'devops': {
    id: 'devops',
    title: 'DevOps Engineer',
    domain: 'software_it',
    summary: 'Automates deployment pipelines, cloud infrastructure provisioning, container orchestration, and reliability.',
    requiredSkills: [
      {
        skillId: 'ci_cd_pipelines',
        skillName: 'CI/CD Pipelines (GitHub Actions / GitLab CI)',
        importance: 'critical',
        minimumLevel: 4,
        benchmarkDescription: 'Automated test runners, build pipelines, and multi-stage container deployment.',
      },
      {
        skillId: 'docker_containerization',
        skillName: 'Docker & Containerization',
        importance: 'critical',
        minimumLevel: 4,
        benchmarkDescription: 'Production Dockerfiles, multi-stage compilation, and container security scanning.',
      },
      {
        skillId: 'networks',
        skillName: 'Computer Networks & Protocols',
        importance: 'high',
        minimumLevel: 3,
        benchmarkDescription: 'DNS resolution, VPCs, subnets, load balancing, SSL/TLS reverse proxies.',
      },
      {
        skillId: 'technical_documentation',
        skillName: 'Technical Writing & Architecture Specs',
        importance: 'medium',
        minimumLevel: 3,
        benchmarkDescription: 'Runbooks, incident post-mortems, and infrastructure-as-code documentation.',
      },
    ],
    prerequisiteSkills: ['os_concepts', 'git_version_control'],
    evidenceExamples: [
      'Automated GitHub Actions workflow building Docker images and deploying to cloud Kubernetes/VPS',
      'Zero-downtime blue-green deployment script with automated rollback on health check failure',
    ],
  },

  'cloud': {
    id: 'cloud',
    title: 'Cloud Engineer',
    domain: 'software_it',
    summary: 'Architects and maintains cloud computing infrastructure, managed databases, security policies, and cost efficiency.',
    requiredSkills: [
      {
        skillId: 'docker_containerization',
        skillName: 'Docker & Containerization',
        importance: 'critical',
        minimumLevel: 3,
        benchmarkDescription: 'Microservice packaging, container clusters, and resource quota allocation.',
      },
      {
        skillId: 'networks',
        skillName: 'Computer Networks & Protocols',
        importance: 'critical',
        minimumLevel: 3,
        benchmarkDescription: 'Cloud routing, NAT gateways, security groups, and CDN integration.',
      },
      {
        skillId: 'engineering_safety_compliance',
        skillName: 'Safety Standards & Industry Compliance',
        importance: 'high',
        minimumLevel: 3,
        benchmarkDescription: 'IAM least privilege access, encryption at rest and in transit, cloud compliance.',
      },
    ],
    prerequisiteSkills: ['os_concepts', 'sql_databases'],
    evidenceExamples: [
      'Serverless microservice architecture deployed on AWS/GCP with auto-scaling triggers',
      'Cloud storage and CDN integration serving static media with strict IAM policies',
    ],
  },

  'qa_automation': {
    id: 'qa_automation',
    title: 'QA Automation Engineer',
    domain: 'software_it',
    summary: 'Develops automated test frameworks, regression suites, and end-to-end integration verifications.',
    requiredSkills: [
      {
        skillId: 'testing_qa',
        skillName: 'Automated Testing & QA Rigor',
        importance: 'critical',
        minimumLevel: 4,
        benchmarkDescription: 'E2E testing suites (Playwright/Cypress/Selenium), API test automation, assertions.',
      },
      {
        skillId: 'javascript_typescript',
        skillName: 'JavaScript & TypeScript',
        importance: 'high',
        minimumLevel: 3,
        benchmarkDescription: 'Writing clean test automation scripts, page object models, and test fixtures.',
      },
      {
        skillId: 'ci_cd_pipelines',
        skillName: 'CI/CD Pipelines',
        importance: 'high',
        minimumLevel: 3,
        benchmarkDescription: 'Triggering regression tests on PR merges and publishing test execution reports.',
      },
    ],
    prerequisiteSkills: ['git_version_control', 'html_css_web'],
    evidenceExamples: [
      'Automated end-to-end browser test suite running in headless CI for critical user checkout journeys',
      'Automated API integration regression suite validating status codes, response schemas, and latency',
    ],
  },

  'cybersecurity': {
    id: 'cybersecurity',
    title: 'Cybersecurity Analyst',
    domain: 'software_it',
    summary: 'Monitors, investigates, and hardens networks, systems, and web applications against vulnerabilities and threats.',
    requiredSkills: [
      {
        skillId: 'networks',
        skillName: 'Computer Networks & Protocols',
        importance: 'critical',
        minimumLevel: 4,
        benchmarkDescription: 'Packet analysis, port scanning, firewalls, TLS handshake vulnerabilities, SIEM logs.',
      },
      {
        skillId: 'os_concepts',
        skillName: 'Operating Systems & Concurrency',
        importance: 'critical',
        minimumLevel: 3,
        benchmarkDescription: 'Linux user permissions, privilege escalation, shell scripting, process monitoring.',
      },
      {
        skillId: 'engineering_safety_compliance',
        skillName: 'Safety Standards & Industry Compliance',
        importance: 'high',
        minimumLevel: 3,
        benchmarkDescription: 'OWASP Top 10 vulnerabilities, incident response protocols, and security audits.',
      },
    ],
    prerequisiteSkills: ['python', 'git_version_control'],
    evidenceExamples: [
      'Comprehensive vulnerability assessment and penetration test report for a web application',
      'Configured network IDS/IPS rules and firewall filters blocking malicious traffic patterns',
    ],
  },

  // ==========================================
  // AI & DATA SCIENCE
  // ==========================================
  'data_analyst': {
    id: 'data_analyst',
    title: 'Data Analyst',
    domain: 'ai_data',
    summary: 'Extracts, transforms, and analyzes organizational datasets to generate actionable business insights and visualizations.',
    requiredSkills: [
      {
        skillId: 'sql_databases',
        skillName: 'SQL & Relational Database Design',
        importance: 'critical',
        minimumLevel: 4,
        benchmarkDescription: 'Advanced joins, window functions, CTEs, aggregation rollups, query performance.',
      },
      {
        skillId: 'data_engineering_pandas',
        skillName: 'Data Wrangling (Pandas / NumPy)',
        importance: 'critical',
        minimumLevel: 3,
        benchmarkDescription: 'Data cleaning, pivot tables, missing data imputation, and exploratory analysis.',
      },
      {
        skillId: 'data_viz_bi',
        skillName: 'Data Visualization & Business Intelligence',
        importance: 'critical',
        minimumLevel: 3,
        benchmarkDescription: 'Interactive dashboards (Tableau/PowerBI), cohort analysis, storytelling with data.',
      },
      {
        skillId: 'math_stats',
        skillName: 'Probability & Applied Statistics',
        importance: 'high',
        minimumLevel: 3,
        benchmarkDescription: 'Hypothesis testing, correlation analysis, statistical significance, and distributions.',
      },
    ],
    prerequisiteSkills: ['python'],
    evidenceExamples: [
      'Interactive executive Tableau dashboard visualizing customer churn rates and retention cohorts',
      'Exploratory data analysis report with statistical hypothesis testing uncovering product revenue drivers',
    ],
  },

  'data_engineer': {
    id: 'data_engineer',
    title: 'Data Engineer',
    domain: 'ai_data',
    summary: 'Engineers robust data pipelines, ETL/ELT workflows, data warehouses, and distributed streaming infrastructure.',
    requiredSkills: [
      {
        skillId: 'sql_databases',
        skillName: 'SQL & Relational Database Design',
        importance: 'critical',
        minimumLevel: 4,
        benchmarkDescription: 'Data warehouse star/snowflake schemas, partitioning, and columnar storage.',
      },
      {
        skillId: 'python',
        skillName: 'Python Programming',
        importance: 'critical',
        minimumLevel: 4,
        benchmarkDescription: 'Scalable data processing scripts, API connectors, and pipeline orchestrators.',
      },
      {
        skillId: 'docker_containerization',
        skillName: 'Docker & Containerization',
        importance: 'high',
        minimumLevel: 3,
        benchmarkDescription: 'Containerizing data pipelines and local test environments.',
      },
      {
        skillId: 'dsa',
        skillName: 'Data Structures & Algorithms',
        importance: 'high',
        minimumLevel: 3,
        benchmarkDescription: 'Stream windowing, hash partitioning, and memory-efficient batch transformations.',
      },
    ],
    prerequisiteSkills: ['os_concepts', 'git_version_control'],
    evidenceExamples: [
      'Automated ETL pipeline extracting data from external APIs and loading into PostgreSQL warehouse',
      'Batch processing script transforming 10M+ rows with logging, error recovery, and data validation',
    ],
  },

  'ml_engineer': {
    id: 'ml_engineer',
    title: 'Machine Learning Engineer',
    domain: 'ai_data',
    summary: 'Designs, trains, and operationalizes predictive machine learning models into high-availability production systems.',
    requiredSkills: [
      {
        skillId: 'ml_fundamentals',
        skillName: 'Machine Learning Foundations',
        importance: 'critical',
        minimumLevel: 4,
        benchmarkDescription: 'Model selection, feature engineering, loss functions, regularization, cross-validation.',
      },
      {
        skillId: 'python',
        skillName: 'Python Programming',
        importance: 'critical',
        minimumLevel: 4,
        benchmarkDescription: 'Object-oriented ML pipelines, Scikit-Learn custom transformers, and vectorized math.',
      },
      {
        skillId: 'deep_learning_frameworks',
        skillName: 'Deep Learning & Neural Networks',
        importance: 'high',
        minimumLevel: 3,
        benchmarkDescription: 'PyTorch / TensorFlow neural networks, transfer learning, and gradient optimization.',
      },
      {
        skillId: 'mlops_pipelines',
        skillName: 'MLOps & Model Deployment',
        importance: 'high',
        minimumLevel: 3,
        benchmarkDescription: 'Packaging models in REST containers (FastAPI) and tracking experiments with MLflow.',
      },
      {
        skillId: 'linear_algebra',
        skillName: 'Linear Algebra & Matrix Calculus',
        importance: 'high',
        minimumLevel: 3,
        benchmarkDescription: 'Matrix decomposition, gradients, tensor transformations, and loss minimization.',
      },
    ],
    prerequisiteSkills: ['math_stats', 'dsa'],
    evidenceExamples: [
      'Trained classification model achieving >90% precision with hyperparameter optimization and feature importance analysis',
      'Containerized inference API serving real-time predictions with p95 latency under 50ms',
    ],
  },

  'ai_engineer': {
    id: 'ai_engineer',
    title: 'AI Engineer / Generative AI',
    domain: 'ai_data',
    summary: 'Builds intelligent systems leveraging Foundation Models, LLMs, Vector Databases, and Retrieval-Augmented Generation (RAG).',
    requiredSkills: [
      {
        skillId: 'python',
        skillName: 'Python Programming',
        importance: 'critical',
        minimumLevel: 4,
        benchmarkDescription: 'Async programming, API wrappers, and structured output parsing.',
      },
      {
        skillId: 'deep_learning_frameworks',
        skillName: 'Deep Learning & Neural Networks',
        importance: 'high',
        minimumLevel: 3,
        benchmarkDescription: 'Transformer architectures, tokenization, embeddings, and attention mechanisms.',
      },
      {
        skillId: 'mlops_pipelines',
        skillName: 'MLOps & Model Deployment',
        importance: 'high',
        minimumLevel: 3,
        benchmarkDescription: 'Prompt evaluation frameworks, vector database retrieval, and token usage caching.',
      },
    ],
    prerequisiteSkills: ['ml_fundamentals', 'git_version_control'],
    evidenceExamples: [
      'RAG pipeline querying enterprise technical documentation with hybrid vector retrieval and citations',
      'LLM-powered autonomous workflow executing multi-step validation checks with fallback routing',
    ],
  },

  // ==========================================
  // ELECTRONICS & EMBEDDED
  // ==========================================
  'embedded_software': {
    id: 'embedded_software',
    title: 'Embedded Software Engineer',
    domain: 'electronics_embedded',
    summary: 'Writes reliable firmware and real-time control software executing directly on microcontrollers and embedded processors.',
    requiredSkills: [
      {
        skillId: 'embedded_c',
        skillName: 'Embedded C / Bare-Metal Programming',
        importance: 'critical',
        minimumLevel: 4,
        benchmarkDescription: 'Register manipulation, interrupt service routines, timers, and memory-mapped hardware.',
      },
      {
        skillId: 'microcontrollers_rtos',
        skillName: 'Microcontrollers & Real-Time OS (RTOS)',
        importance: 'critical',
        minimumLevel: 3,
        benchmarkDescription: 'FreeRTOS tasks, priority scheduling, queues, mutexes, and low-power sleep modes.',
      },
      {
        skillId: 'hw_protocols',
        skillName: 'Hardware Communication Protocols',
        importance: 'critical',
        minimumLevel: 3,
        benchmarkDescription: 'UART, SPI, I2C driver integration and oscilloscope signal debugging.',
      },
      {
        skillId: 'cpp_c',
        skillName: 'C & Modern C++',
        importance: 'high',
        minimumLevel: 3,
        benchmarkDescription: 'Resource-constrained programming and hardware abstraction layers (HAL).',
      },
    ],
    prerequisiteSkills: ['comp_arch'],
    evidenceExamples: [
      'Bare-metal sensor logger writing to flash over SPI with DMA transfers and sleep cycles',
      'FreeRTOS application handling sensor data streams, motor control, and wireless telemetry',
    ],
  },

  'vlsi_design': {
    id: 'vlsi_design',
    title: 'VLSI Design & Verification Engineer',
    domain: 'electronics_embedded',
    summary: 'Designs, verifies, and optimizes digital logic circuits, RTL descriptions, and semiconductor IP cores.',
    requiredSkills: [
      {
        skillId: 'vlsi_verilog',
        skillName: 'Digital Logic & Verilog / VHDL / FPGA',
        importance: 'critical',
        minimumLevel: 4,
        benchmarkDescription: 'RTL coding, finite state machines, synthesizable constructs, and FPGA bitstream generation.',
      },
      {
        skillId: 'comp_arch',
        skillName: 'Computer Architecture & Systems',
        importance: 'critical',
        minimumLevel: 4,
        benchmarkDescription: 'Pipelining, hazard detection, ALU operations, and memory bus arbitration.',
      },
      {
        skillId: 'testing_qa',
        skillName: 'Automated Testing & QA Rigor',
        importance: 'high',
        minimumLevel: 3,
        benchmarkDescription: 'Writing comprehensive self-checking Verilog/SystemVerilog testbenches.',
      },
    ],
    prerequisiteSkills: ['linear_algebra', 'cpp_c'],
    evidenceExamples: [
      'Implemented 5-stage pipelined RISC-V CPU core in Verilog verified on a Xilinx FPGA',
      'Configured UVM testbench testing memory controller IP with 100% functional coverage',
    ],
  },

  'pcb_design_eng': {
    id: 'pcb_design_eng',
    title: 'PCB Design & Hardware Engineer',
    domain: 'electronics_embedded',
    summary: 'Designs electronic schematics, multi-layer printed circuit boards, component selection, and prototype bring-up.',
    requiredSkills: [
      {
        skillId: 'pcb_design',
        skillName: 'Schematic Capture & PCB Layout',
        importance: 'critical',
        minimumLevel: 4,
        benchmarkDescription: 'KiCad/Altium schematics, footprint creation, routing, DRC rules, and Gerber export.',
      },
      {
        skillId: 'hw_protocols',
        skillName: 'Hardware Communication Protocols',
        importance: 'high',
        minimumLevel: 3,
        benchmarkDescription: 'Signal integrity for high-speed traces and decoupling capacitor placement.',
      },
      {
        skillId: 'engineering_safety_compliance',
        skillName: 'Safety Standards & Industry Compliance',
        importance: 'medium',
        minimumLevel: 2,
        benchmarkDescription: 'Electrical clearance, thermal dissipation, and fuse protection.',
      },
    ],
    prerequisiteSkills: ['embedded_c'],
    evidenceExamples: [
      'Designed and assembled a 4-layer microcontroller development board with USB-C and battery charger',
      'Hardware bring-up documentation diagnosing voltage rail ripple with an oscilloscope',
    ],
  },

  // ==========================================
  // MECHANICAL & ROBOTICS
  // ==========================================
  'mech_design': {
    id: 'mech_design',
    title: 'Mechanical Design Engineer',
    domain: 'mechanical_manufacturing',
    summary: 'Engineers physical components, complex machinery, consumer enclosures, and manufacturing drawings using 3D CAD.',
    requiredSkills: [
      {
        skillId: 'cad_3d_modeling',
        skillName: '3D CAD Modeling & Drafting',
        importance: 'critical',
        minimumLevel: 4,
        benchmarkDescription: 'Parametric assemblies, GD&T tolerancing, sheet metal and plastic design rules.',
      },
      {
        skillId: 'fea_simulation',
        skillName: 'Finite Element Analysis (FEA) & Simulation',
        importance: 'critical',
        minimumLevel: 3,
        benchmarkDescription: 'Static structural stress analysis, deflection verification, and safety factor calculations.',
      },
      {
        skillId: 'manufacturing_cnc',
        skillName: 'Manufacturing Processes & CNC / 3D Printing',
        importance: 'high',
        minimumLevel: 3,
        benchmarkDescription: 'Design for Manufacturing (DFM) and Design for Assembly (DFA) audits.',
      },
    ],
    prerequisiteSkills: ['linear_algebra', 'technical_documentation'],
    evidenceExamples: [
      'Engineered a complete mechanical gearbox assembly in SolidWorks with production manufacturing drawings',
      'FEA simulation report validating weight reduction through topology optimization with factor of safety > 2.0',
    ],
  },

  'robotics_engineer': {
    id: 'robotics_engineer',
    title: 'Robotics Engineer',
    domain: 'mechanical_manufacturing',
    summary: 'Integrates kinematic mechanisms, sensors, microcontrollers, and autonomous motion control algorithms.',
    requiredSkills: [
      {
        skillId: 'robotics_ros',
        skillName: 'Robotics & Robot Operating System (ROS / ROS2)',
        importance: 'critical',
        minimumLevel: 4,
        benchmarkDescription: 'ROS nodes, transforms (TF2), URDF modeling, navigation stacks, and Gazebo simulation.',
      },
      {
        skillId: 'cpp_c',
        skillName: 'C & Modern C++',
        importance: 'critical',
        minimumLevel: 3,
        benchmarkDescription: 'Real-time sensor parsing, PID feedback loop controllers, and path planning.',
      },
      {
        skillId: 'cad_3d_modeling',
        skillName: '3D CAD Modeling & Drafting',
        importance: 'high',
        minimumLevel: 3,
        benchmarkDescription: 'Custom robot chassis and manipulator arm geometry modeling.',
      },
      {
        skillId: 'microcontrollers_rtos',
        skillName: 'Microcontrollers & Real-Time OS (RTOS)',
        importance: 'high',
        minimumLevel: 3,
        benchmarkDescription: 'Motor encoder feedback, PWM motor drivers, and serial telemetry.',
      },
    ],
    prerequisiteSkills: ['dsa', 'math_stats'],
    evidenceExamples: [
      'Built a 4-wheeled autonomous mobile robot running ROS2 with LiDAR SLAM mapping and path navigation',
      'Inverse kinematics trajectory calculation for a robotic arm simulated in Gazebo',
    ],
  },

  // ==========================================
  // CIVIL & INFRASTRUCTURE
  // ==========================================
  'structural_engineer': {
    id: 'structural_engineer',
    title: 'Structural Engineer',
    domain: 'civil_infra',
    summary: 'Designs load-bearing structural frameworks, buildings, bridges, and foundation systems ensuring safety and code compliance.',
    requiredSkills: [
      {
        skillId: 'structural_analysis',
        skillName: 'Structural Analysis & Design Codes',
        importance: 'critical',
        minimumLevel: 4,
        benchmarkDescription: 'STAAD.Pro / ETABS modeling, bending moments, shear forces, RCC / steel design standards.',
      },
      {
        skillId: 'geotech_surveying',
        skillName: 'Geotechnical Engineering & Land Surveying',
        importance: 'high',
        minimumLevel: 3,
        benchmarkDescription: 'Foundation bearing capacity, soil settlement calculation, and site leveling.',
      },
      {
        skillId: 'engineering_safety_compliance',
        skillName: 'Safety Standards & Industry Compliance',
        importance: 'critical',
        minimumLevel: 3,
        benchmarkDescription: 'National building safety codes, seismic resistance guidelines, and wind load provisions.',
      },
    ],
    prerequisiteSkills: ['linear_algebra', 'technical_documentation'],
    evidenceExamples: [
      'Structural design calculation report for a G+4 residential building modeled in ETABS',
      'Foundation reinforcement drawings and structural safety audit report adhering to building codes',
    ],
  },

  'bim_engineer': {
    id: 'bim_engineer',
    title: 'BIM Engineer',
    domain: 'civil_infra',
    summary: 'Coordinates multi-disciplinary 3D digital construction models, clash detection, schedules, and quantity takeoffs.',
    requiredSkills: [
      {
        skillId: 'bim_modeling',
        skillName: 'Building Information Modeling (BIM / Revit)',
        importance: 'critical',
        minimumLevel: 4,
        benchmarkDescription: 'Autodesk Revit modeling, Navisworks clash reports, 4D timeline simulation.',
      },
      {
        skillId: 'cad_3d_modeling',
        skillName: '3D CAD Modeling & Drafting',
        importance: 'high',
        minimumLevel: 3,
        benchmarkDescription: '2D/3D architectural drawings and structural cross-section drafting.',
      },
      {
        skillId: 'technical_documentation',
        skillName: 'Technical Writing & Architecture Specs',
        importance: 'high',
        minimumLevel: 3,
        benchmarkDescription: 'Bill of Quantities (BOQ), material takeoff schedules, and clash resolution notes.',
      },
    ],
    prerequisiteSkills: ['agile_project_execution'],
    evidenceExamples: [
      'Revit 3D structural model with automated bill of materials and schedules generated from families',
      'Navisworks clash detection coordination matrix resolving 50+ MEP and structural clashes',
    ],
  },

  // ==========================================
  // CHEMICAL, BIO & MATERIALS
  // ==========================================
  'process_engineer': {
    id: 'process_engineer',
    title: 'Chemical Process Engineer',
    domain: 'chemical_bio_materials',
    summary: 'Simulates and optimizes chemical manufacturing, separation units, reactors, heat transfer, and plant safety.',
    requiredSkills: [
      {
        skillId: 'chemical_process_design',
        skillName: 'Chemical Process Simulation',
        importance: 'critical',
        minimumLevel: 4,
        benchmarkDescription: 'Aspen Plus / DWSIM mass and energy balances, unit operations, PFD and P&ID drafting.',
      },
      {
        skillId: 'engineering_safety_compliance',
        skillName: 'Safety Standards & Industry Compliance',
        importance: 'critical',
        minimumLevel: 3,
        benchmarkDescription: 'HAZOP safety reviews, pressure relief sizing, and environmental discharge norms.',
      },
      {
        skillId: 'technical_documentation',
        skillName: 'Technical Writing & Architecture Specs',
        importance: 'high',
        minimumLevel: 3,
        benchmarkDescription: 'Equipment specification data sheets and standard operating procedures (SOP).',
      },
    ],
    prerequisiteSkills: ['math_stats'],
    evidenceExamples: [
      'Steady-state simulation of a chemical distillation column in Aspen Plus with heat integration analysis',
      'HAZOP risk assessment matrix for a high-pressure reactor unit with emergency relief design',
    ],
  },

  'bioinformatics_engineer': {
    id: 'bioinformatics_engineer',
    title: 'Bioinformatics Engineer',
    domain: 'chemical_bio_materials',
    summary: 'Develops computational pipelines for genomic sequencing, molecular modeling, and biological data science.',
    requiredSkills: [
      {
        skillId: 'bioinformatics_python',
        skillName: 'Bioinformatics & Computational Biology',
        importance: 'critical',
        minimumLevel: 4,
        benchmarkDescription: 'BioPython, sequence alignment, FASTA/BAM parsing, genomic variant calling.',
      },
      {
        skillId: 'python',
        skillName: 'Python Programming',
        importance: 'critical',
        minimumLevel: 4,
        benchmarkDescription: 'Data parsing, automation scripts, and scientific libraries.',
      },
      {
        skillId: 'math_stats',
        skillName: 'Probability & Applied Statistics',
        importance: 'high',
        minimumLevel: 3,
        benchmarkDescription: 'Statistical genomics, p-value FDR corrections, and population genetics distributions.',
      },
    ],
    prerequisiteSkills: ['dsa', 'git_version_control'],
    evidenceExamples: [
      'RNA-Seq differential gene expression pipeline in Python identifying biomarker candidates',
      'Automated molecular docking simulation screen analyzing binding affinities with PyMOL',
    ],
  },
};

export function getRoleById(roleId: string): EngineeringRole | undefined {
  return ROLES_CATALOG[roleId];
}

export function getAllRoles(): EngineeringRole[] {
  return Object.values(ROLES_CATALOG);
}

export function getRolesByDomain(domain: EngineeringRole['domain']): EngineeringRole[] {
  return Object.values(ROLES_CATALOG).filter(r => r.domain === domain);
}

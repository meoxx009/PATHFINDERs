/**
 * SkillForge AI — Unified Engineering Skill Taxonomy
 * Categorized, leveled, and evidence-grounded skill master catalog.
 */

export type SkillCategory =
  | 'engineering_fundamentals'
  | 'programming'
  | 'mathematics_statistics'
  | 'tools_software'
  | 'domain_knowledge'
  | 'design_analysis'
  | 'testing_validation'
  | 'communication'
  | 'project_execution'
  | 'documentation'
  | 'safety_compliance'
  | 'collaboration'
  | 'interview_communication';

export type ProficiencyLevel = 0 | 1 | 2 | 3 | 4 | 5;

export const PROFICIENCY_LEVEL_LABELS: Record<ProficiencyLevel, { label: string; description: string }> = {
  0: { label: 'Not started', description: 'No theoretical or practical exposure yet' },
  1: { label: 'Familiar', description: 'Understands basic vocabulary, definitions, and high-level concepts' },
  2: { label: 'Working knowledge', description: 'Can complete guided exercises, tutorial tasks, or coursework labs' },
  3: { label: 'Project-ready', description: 'Can implement features and solve problems independently in a project' },
  4: { label: 'Interview-ready', description: 'Can articulate trade-offs, solve algorithmic challenges, and explain system architecture' },
  5: { label: 'Industry-ready', description: 'Production experience with scalability, edge cases, maintenance, and testing' },
};

export type EvidenceType =
  | 'self_report'
  | 'coursework'
  | 'assignment'
  | 'personal_project'
  | 'academic_project'
  | 'internship'
  | 'employment'
  | 'certification'
  | 'assessment'
  | 'portfolio';

export interface SkillDefinition {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
  prerequisites?: string[];
  evidenceCriteria: {
    familiar: string;
    workingKnowledge: string;
    projectReady: string;
    industryReady: string;
  };
  suggestedEvidenceTypes: EvidenceType[];
}

export const SKILLS_CATALOG: Record<string, SkillDefinition> = {
  // ==========================================
  // 1. ENGINEERING FUNDAMENTALS & CS CORE
  // ==========================================
  'dsa': {
    id: 'dsa',
    name: 'Data Structures & Algorithms',
    category: 'engineering_fundamentals',
    description: 'Arrays, linked lists, trees, graphs, sorting, searching, Big-O complexity analysis.',
    evidenceCriteria: {
      familiar: 'Knows Big-O time and space notations and standard data structures.',
      workingKnowledge: 'Solves LeetCode easy/medium problems using hash maps, binary trees, two pointers.',
      projectReady: 'Selects optimal data structures for storage, lookup, and sorting in real apps.',
      industryReady: 'Designs cache evictions (LRU), graph traversals, and concurrency-safe structures.',
    },
    suggestedEvidenceTypes: ['academic_project', 'assessment', 'personal_project'],
  },
  'comp_arch': {
    id: 'comp_arch',
    name: 'Computer Architecture & Systems',
    category: 'engineering_fundamentals',
    description: 'Memory hierarchy, CPU caching, instructions, register logic, byte ordering.',
    evidenceCriteria: {
      familiar: 'Understands CPU cycles, registers, RAM vs Disk latency.',
      workingKnowledge: 'Has written basic low-level or assembly programs or inspected compiled assembly.',
      projectReady: 'Analyzes memory alignment and cache locality effects in software execution.',
      industryReady: 'Optimizes SIMD vectorization, cache lines, and multi-core thread affinity.',
    },
    suggestedEvidenceTypes: ['coursework', 'academic_project'],
  },
  'os_concepts': {
    id: 'os_concepts',
    name: 'Operating Systems & Concurrency',
    category: 'engineering_fundamentals',
    description: 'Processes, threads, mutexes, semaphores, scheduling, virtual memory, paging.',
    evidenceCriteria: {
      familiar: 'Knows process vs thread differences, context switches, and file descriptors.',
      workingKnowledge: 'Has used POSIX threads or concurrent primitives in coursework.',
      projectReady: 'Builds race-condition-free multi-threaded code with locks/channels.',
      industryReady: 'Diagnoses deadlocks, memory fragmentation, and kernel scheduler bottlenecks.',
    },
    suggestedEvidenceTypes: ['coursework', 'academic_project', 'internship'],
  },
  'networks': {
    id: 'networks',
    name: 'Computer Networks & Protocols',
    category: 'engineering_fundamentals',
    description: 'OSI 7 layers, TCP/IP, UDP, HTTP/HTTPS, DNS, WebSockets, TLS handshake.',
    evidenceCriteria: {
      familiar: 'Understands IP packets, ports, DNS lookup, HTTP request/response format.',
      workingKnowledge: 'Can inspect network traffic with Wireshark/cURL and write socket clients.',
      projectReady: 'Designs robust REST/WebSocket communication with retry backoff and TLS.',
      industryReady: 'Configures reverse proxies, load balancers, CDN routing, and TCP window tuning.',
    },
    suggestedEvidenceTypes: ['academic_project', 'personal_project', 'certification'],
  },
  'math_discrete': {
    id: 'math_discrete',
    name: 'Discrete Mathematics & Logic',
    category: 'mathematics_statistics',
    description: 'Boolean algebra, set theory, graph theory, combinatorics, proof by induction.',
    evidenceCriteria: {
      familiar: 'Knows predicate logic, truth tables, and basic set theory.',
      workingKnowledge: 'Solves recurrence relations and graph shortest path equations.',
      projectReady: 'Applies discrete algorithms to network topologies and state machine proofs.',
      industryReady: 'Validates cryptographic protocols and formal software verification specs.',
    },
    suggestedEvidenceTypes: ['coursework', 'assignment'],
  },
  'math_stats': {
    id: 'math_stats',
    name: 'Probability & Applied Statistics',
    category: 'mathematics_statistics',
    description: 'Distributions, hypothesis testing, Bayesian inference, regression, variance analysis.',
    evidenceCriteria: {
      familiar: 'Knows normal, binomial, Poisson distributions, mean, median, standard deviation.',
      workingKnowledge: 'Performs p-value testing, ANOVA, and linear regression in Python/R.',
      projectReady: 'Conducts statistically sound A/B test power calculations and confidence intervals.',
      industryReady: 'Builds stochastic models, Markov decision processes, and time-series forecasts.',
    },
    suggestedEvidenceTypes: ['academic_project', 'assignment', 'coursework'],
  },
  'linear_algebra': {
    id: 'linear_algebra',
    name: 'Linear Algebra & Matrix Calculus',
    category: 'mathematics_statistics',
    description: 'Vectors, matrices, eigenvalues, eigenvectors, SVD, gradients, Jacobian.',
    evidenceCriteria: {
      familiar: 'Understands dot products, matrix multiplications, transpose, determinant.',
      workingKnowledge: 'Performs PCA decomposition and vector projections using NumPy.',
      projectReady: 'Implements neural net backpropagation with chain rule and tensor contractions.',
      industryReady: 'Optimizes custom matrix factorization and CUDA tensor core kernels.',
    },
    suggestedEvidenceTypes: ['coursework', 'academic_project'],
  },

  // ==========================================
  // 2. PROGRAMMING LANGUAGES & FRAMEWORKS
  // ==========================================
  'javascript_typescript': {
    id: 'javascript_typescript',
    name: 'JavaScript & TypeScript',
    category: 'programming',
    description: 'ES6+ standards, closures, prototypes, event loop, static typing, generics.',
    evidenceCriteria: {
      familiar: 'Writes basic functions, loops, and objects in JS.',
      workingKnowledge: 'Uses async/await, promises, fetch API, and basic TS types.',
      projectReady: 'Architects robust TS applications with strict types, generics, and linting.',
      industryReady: 'Configures mono-repo compilation, TS AST transforms, and node memory profiling.',
    },
    suggestedEvidenceTypes: ['personal_project', 'academic_project', 'portfolio'],
  },
  'python': {
    id: 'python',
    name: 'Python Programming',
    category: 'programming',
    description: 'Data structures, OOP, generators, decorators, GIL, virtual environments, typing.',
    evidenceCriteria: {
      familiar: 'Writes scripts using standard libraries, lists, and dicts.',
      workingKnowledge: 'Builds modular scripts using classes, exceptions, and pip packages.',
      projectReady: 'Develops full services using FastAPI/Django or end-to-end data pipelines.',
      industryReady: 'Optimizes multiprocessing/asyncio, C-extensions, and memory footprint.',
    },
    suggestedEvidenceTypes: ['personal_project', 'coursework', 'internship'],
  },
  'java_jvm': {
    id: 'java_jvm',
    name: 'Java & JVM Ecosystem',
    category: 'programming',
    description: 'OOP design patterns, collections framework, JVM memory model, garbage collection.',
    evidenceCriteria: {
      familiar: 'Writes basic Java classes with methods and loops.',
      workingKnowledge: 'Uses Java Streams, lambda expressions, and Maven/Gradle build systems.',
      projectReady: 'Builds enterprise microservices using Spring Boot and JPA/Hibernate.',
      industryReady: 'Tunes GC flags (G1/ZGC), thread pools, and analyzes JVM heap dumps.',
    },
    suggestedEvidenceTypes: ['academic_project', 'coursework', 'employment'],
  },
  'cpp_c': {
    id: 'cpp_c',
    name: 'C & Modern C++',
    category: 'programming',
    description: 'Pointers, manual memory management, RAII, smart pointers, templates, STL.',
    evidenceCriteria: {
      familiar: 'Understands pointer dereferencing, struct definitions, and compilation stages.',
      workingKnowledge: 'Uses STL vectors, maps, RAII, and manages dynamic memory with valgrind.',
      projectReady: 'Develops systems/embedded software with smart pointers, move semantics, and CMake.',
      industryReady: 'Writes lock-free concurrent data structures, cache-friendly zero-copy pipelines.',
    },
    suggestedEvidenceTypes: ['coursework', 'academic_project'],
  },
  'sql_databases': {
    id: 'sql_databases',
    name: 'SQL & Relational Database Design',
    category: 'programming',
    description: 'DDL, DML, normalization, indexing, joins, transactions, ACID, execution plans.',
    evidenceCriteria: {
      familiar: 'Writes basic SELECT, INSERT, UPDATE, DELETE queries.',
      workingKnowledge: 'Designs normalized 3NF schemas with foreign keys and multi-table JOINs.',
      projectReady: 'Optimizes indexes (B-Tree/Hash), analyzes EXPLAIN ANALYZE, and writes CTEs.',
      industryReady: 'Partitions tables, configures read-replicas, and tunes connection pools.',
    },
    suggestedEvidenceTypes: ['academic_project', 'personal_project', 'internship'],
  },
  'nosql_databases': {
    id: 'nosql_databases',
    name: 'NoSQL & Key-Value Stores',
    category: 'tools_software',
    description: 'Document databases (MongoDB), key-value caches (Redis), column-stores (Cassandra).',
    evidenceCriteria: {
      familiar: 'Knows difference between relational and document/key-value storage.',
      workingKnowledge: 'Connects to MongoDB or Redis to perform CRUD operations.',
      projectReady: 'Implements caching patterns (Cache-Aside, Write-Through) with TTL in Redis.',
      industryReady: 'Designs sharded clusters with quorum consistency models and disaster recovery.',
    },
    suggestedEvidenceTypes: ['personal_project', 'academic_project'],
  },
  'html_css_web': {
    id: 'html_css_web',
    name: 'HTML5, Semantic Markup & CSS3',
    category: 'domain_knowledge',
    description: 'Semantic tags, responsive design, Flexbox, Grid, web accessibility (WCAG).',
    evidenceCriteria: {
      familiar: 'Creates basic HTML structure with headings, paragraphs, and links.',
      workingKnowledge: 'Builds mobile-responsive layouts using Flexbox, CSS Grid, and media queries.',
      projectReady: 'Constructs WCAG AA compliant forms, ARIA landmarks, and custom animations.',
      industryReady: 'Audits Core Web Vitals, critical rendering path, and CSS bundle splitting.',
    },
    suggestedEvidenceTypes: ['portfolio', 'personal_project'],
  },
  'react_architecture': {
    id: 'react_architecture',
    name: 'React & Component Architecture',
    category: 'tools_software',
    description: 'JSX, hooks, state management, component lifecycles, virtual DOM, SSR basics.',
    evidenceCriteria: {
      familiar: 'Understands props, state, and renders basic components.',
      workingKnowledge: 'Uses useState, useEffect, forms, and client-side routing.',
      projectReady: 'Builds modular applications with custom hooks, Context API, and state libraries.',
      industryReady: 'Profiles render bottlenecks, uses server components, and optimizes tree reconciliation.',
    },
    suggestedEvidenceTypes: ['portfolio', 'personal_project', 'internship'],
  },
  'node_express': {
    id: 'node_express',
    name: 'Node.js & Backend Architecture',
    category: 'tools_software',
    description: 'Event loop, middleware, RESTful API design, authentication, security headers.',
    evidenceCriteria: {
      familiar: 'Builds simple HTTP servers with route handlers.',
      workingKnowledge: 'Constructs REST APIs with Express, JWT authentication, and input validation.',
      projectReady: 'Structures production backends with error middleware, rate limiting, and logging.',
      industryReady: 'Manages clustering, worker threads, stream pipelines, and graceful shutdown.',
    },
    suggestedEvidenceTypes: ['personal_project', 'academic_project'],
  },

  // ==========================================
  // 3. AI, DATA SCIENCE & MACHINE LEARNING
  // ==========================================
  'ml_fundamentals': {
    id: 'ml_fundamentals',
    name: 'Machine Learning Foundations',
    category: 'domain_knowledge',
    description: 'Supervised vs unsupervised, cost functions, gradient descent, overfitting, regularization.',
    evidenceCriteria: {
      familiar: 'Understands classification vs regression, train/test split, and loss metrics.',
      workingKnowledge: 'Trains Scikit-Learn models (random forests, SVM, logistic regression) with cross-validation.',
      projectReady: 'Engineers features, tunes hyper-parameters, and evaluates ROC-AUC / F1 scores.',
      industryReady: 'Deploys continuous model retraining pipelines with data drift detection.',
    },
    suggestedEvidenceTypes: ['academic_project', 'coursework', 'portfolio'],
  },
  'deep_learning_frameworks': {
    id: 'deep_learning_frameworks',
    name: 'Deep Learning & Neural Networks',
    category: 'tools_software',
    description: 'PyTorch, TensorFlow, backpropagation, CNNs, RNNs, Transformers, attention mechanisms.',
    evidenceCriteria: {
      familiar: 'Knows perceptrons, activation functions (ReLU, Sigmoid), and loss calculation.',
      workingKnowledge: 'Builds feedforward and basic CNN models using PyTorch/TensorFlow.',
      projectReady: 'Fine-tunes pretrained Vision or Transformer architectures with custom data.',
      industryReady: 'Implements distributed training (DDP), mixed precision (FP16), and quantization (ONNX).',
    },
    suggestedEvidenceTypes: ['academic_project', 'personal_project'],
  },
  'data_engineering_pandas': {
    id: 'data_engineering_pandas',
    name: 'Data Wrangling (Pandas / NumPy / Polars)',
    category: 'tools_software',
    description: 'DataFrame manipulations, group-by, aggregations, pivoting, vectorization, missing value handling.',
    evidenceCriteria: {
      familiar: 'Loads CSV files and views summary statistics in Pandas.',
      workingKnowledge: 'Cleans nulls, filters data, and performs multi-column groupby operations.',
      projectReady: 'Constructs reproducible exploratory data pipelines with vectorization.',
      industryReady: 'Processes multi-gigabyte datasets with streaming Polars / Arrow chunking.',
    },
    suggestedEvidenceTypes: ['academic_project', 'portfolio'],
  },
  'data_viz_bi': {
    id: 'data_viz_bi',
    name: 'Data Visualization & Business Intelligence',
    category: 'design_analysis',
    description: 'Tableau, PowerBI, Matplotlib, Seaborn, dashboard storytelling, KPI tracking.',
    evidenceCriteria: {
      familiar: 'Generates standard bar charts and scatter plots.',
      workingKnowledge: 'Builds interactive multi-page dashboards with filters and calculated fields.',
      projectReady: 'Delivers executive-ready dashboards with cohort analyses and drill-downs.',
      industryReady: 'Sets up scheduled data refreshes, row-level security, and mobile layout views.',
    },
    suggestedEvidenceTypes: ['portfolio', 'academic_project'],
  },
  'mlops_pipelines': {
    id: 'mlops_pipelines',
    name: 'MLOps & Model Deployment',
    category: 'tools_software',
    description: 'MLflow, Weights & Biases, Docker for ML, Triton / FastAPI model serving, model registry.',
    evidenceCriteria: {
      familiar: 'Knows model serving concepts and basic Docker containers.',
      workingKnowledge: 'Packages a trained model in FastAPI and runs inference locally.',
      projectReady: 'Logs experiments with MLflow, versions artifacts, and containerizes endpoints.',
      industryReady: 'Deploys autoscaling Triton / KServe endpoints with A/B canary routing.',
    },
    suggestedEvidenceTypes: ['personal_project', 'internship'],
  },

  // ==========================================
  // 4. EMBEDDED, ELECTRONICS & HARDWARE
  // ==========================================
  'embedded_c': {
    id: 'embedded_c',
    name: 'Embedded C / Bare-Metal Programming',
    category: 'programming',
    description: 'Memory-mapped I/O, bitwise operators, ISRs (Interrupt Service Routines), timers.',
    evidenceCriteria: {
      familiar: 'Writes basic C code with bit shifting and boolean masks.',
      workingKnowledge: 'Writes register-level code to configure GPIO, ADC, and UART on microcontrollers.',
      projectReady: 'Implements non-blocking state machines with timer interrupts and watchdog timers.',
      industryReady: 'Develops MISRA-C compliant firmware for safety-critical microcontrollers.',
    },
    suggestedEvidenceTypes: ['academic_project', 'coursework'],
  },
  'microcontrollers_rtos': {
    id: 'microcontrollers_rtos',
    name: 'Microcontrollers & Real-Time OS (RTOS)',
    category: 'domain_knowledge',
    description: 'ARM Cortex-M, ESP32, STM32, FreeRTOS tasks, semaphores, queues, context switching.',
    evidenceCriteria: {
      familiar: 'Knows difference between bare-metal superloop and multitasking RTOS.',
      workingKnowledge: 'Creates tasks and passes data via queues in FreeRTOS on ESP32 or STM32.',
      projectReady: 'Builds multi-sensor IoT device with priority preemption and low-power sleep.',
      industryReady: 'Tunes task stack sizes, hard real-time latency deadlines, and heap allocation schemes.',
    },
    suggestedEvidenceTypes: ['academic_project', 'personal_project'],
  },
  'hw_protocols': {
    id: 'hw_protocols',
    name: 'Hardware Communication Protocols',
    category: 'domain_knowledge',
    description: 'UART, SPI, I2C, CAN Bus, Modbus, oscilloscope signal decoding.',
    evidenceCriteria: {
      familiar: 'Knows baud rates, master-slave topology, clock and data lines.',
      workingKnowledge: 'Interfaces I2C sensors and SPI displays with microcontrollers.',
      projectReady: 'Decodes signals using logic analyzers and implements error detection (CRC).',
      industryReady: 'Implements automotive CAN-FD bus networks with arbitration and diagnostics.',
    },
    suggestedEvidenceTypes: ['academic_project', 'coursework'],
  },
  'pcb_design': {
    id: 'pcb_design',
    name: 'Schematic Capture & PCB Layout',
    category: 'design_analysis',
    description: 'KiCad, Altium Designer, schematic symbols, routing, ground planes, DRC, Gerber.',
    evidenceCriteria: {
      familiar: 'Reads circuit schematics and identifies resistor, capacitor, IC symbols.',
      workingKnowledge: 'Designs a 2-layer PCB schematic and layout in KiCad with ground plane.',
      projectReady: 'Manufactures and solders custom PCB with SMT components and passes DRC.',
      industryReady: 'Routes 4+ layer boards with controlled impedance, EMI shielding, and high-speed differential pairs.',
    },
    suggestedEvidenceTypes: ['portfolio', 'academic_project'],
  },
  'vlsi_verilog': {
    id: 'vlsi_verilog',
    name: 'Digital Logic & Verilog / VHDL / FPGA',
    category: 'domain_knowledge',
    description: 'RTL design, FSMs, combinational/sequential logic, Vivado, FPGA synthesis.',
    evidenceCriteria: {
      familiar: 'Writes basic Verilog modules with logic gates and assign statements.',
      workingKnowledge: 'Designs Finite State Machines and counters, tested in ModelSim testbenches.',
      projectReady: 'Synthesizes digital designs onto Xilinx/Altera FPGAs with timing constraints.',
      industryReady: 'Meets setup/hold timing closure, designs AXI interconnects, and conducts formal verification.',
    },
    suggestedEvidenceTypes: ['coursework', 'academic_project'],
  },

  // ==========================================
  // 5. MECHANICAL, CAD & ROBOTICS
  // ==========================================
  'cad_3d_modeling': {
    id: 'cad_3d_modeling',
    name: '3D CAD Modeling & Drafting',
    category: 'design_analysis',
    description: 'SolidWorks, AutoCAD, Fusion 360, parametric sketching, assemblies, GD&T drawings.',
    evidenceCriteria: {
      familiar: 'Creates basic 2D sketches and simple 3D extrusions.',
      workingKnowledge: 'Models multi-part mechanical assemblies with mates and constraints.',
      projectReady: 'Produces production manufacturing drawings with GD&T tolerances and BOM.',
      industryReady: 'Designs complex injection-molded / sheet metal components with draft and FEA verification.',
    },
    suggestedEvidenceTypes: ['portfolio', 'academic_project'],
  },
  'fea_simulation': {
    id: 'fea_simulation',
    name: 'Finite Element Analysis (FEA) & Simulation',
    category: 'design_analysis',
    description: 'ANSYS, SolidWorks Simulation, stress/strain analysis, thermal heat transfer, mesh convergence.',
    evidenceCriteria: {
      familiar: 'Knows stress, strain, yield strength, and factor of safety concepts.',
      workingKnowledge: 'Sets up static structural loads and boundary conditions in ANSYS.',
      projectReady: 'Conducts mesh sensitivity studies and validates stress concentrations.',
      industryReady: 'Performs non-linear dynamic crash simulation or transient thermal-fatigue analysis.',
    },
    suggestedEvidenceTypes: ['academic_project', 'coursework'],
  },
  'robotics_ros': {
    id: 'robotics_ros',
    name: 'Robotics & Robot Operating System (ROS / ROS2)',
    category: 'domain_knowledge',
    description: 'ROS nodes, topics, services, URDF models, Gazebo simulation, kinematics, SLAM.',
    evidenceCriteria: {
      familiar: 'Understands publisher-subscriber robotics architecture.',
      workingKnowledge: 'Creates ROS/ROS2 nodes in Python/C++ communicating over topics.',
      projectReady: 'Simulates mobile robot navigation in Gazebo using LiDAR and SLAM mapping.',
      industryReady: 'Deploys hardware-in-the-loop autonomous mobile robots with real-time controller nodes.',
    },
    suggestedEvidenceTypes: ['academic_project', 'personal_project'],
  },
  'manufacturing_cnc': {
    id: 'manufacturing_cnc',
    name: 'Manufacturing Processes & CNC / 3D Printing',
    category: 'domain_knowledge',
    description: 'Additive manufacturing, CNC machining, G-code, tooling, casting, sheet metal.',
    evidenceCriteria: {
      familiar: 'Knows difference between subtractive (CNC) and additive (3D printing) processes.',
      workingKnowledge: 'Prepares slicing parameters and 3D prints functional prototypes.',
      projectReady: 'Generates CAM toolpaths and G-code for milling operations with feed/speed calculations.',
      industryReady: 'Audits production tooling tolerances, DFM (Design for Manufacturing), and Six Sigma yield.',
    },
    suggestedEvidenceTypes: ['academic_project', 'coursework'],
  },

  // ==========================================
  // 6. CIVIL, STRUCTURAL & INFRASTRUCTURE
  // ==========================================
  'structural_analysis': {
    id: 'structural_analysis',
    name: 'Structural Analysis & Design Codes',
    category: 'design_analysis',
    description: 'STAAD.Pro, ETABS, bending moments, shear force diagrams, RCC and steel design codes.',
    evidenceCriteria: {
      familiar: 'Draws SFD and BMD for simply supported and cantilever beams.',
      workingKnowledge: 'Models framed multi-story structures in STAAD.Pro / ETABS.',
      projectReady: 'Designs concrete columns, beams, and slabs according to national building codes (IS/ACI).',
      industryReady: 'Conducts seismic response spectrum analysis and wind tunnel dynamic load modeling.',
    },
    suggestedEvidenceTypes: ['academic_project', 'coursework'],
  },
  'bim_modeling': {
    id: 'bim_modeling',
    name: 'Building Information Modeling (BIM / Revit)',
    category: 'tools_software',
    description: 'Autodesk Revit, Navisworks, 3D architectural/structural modeling, clash detection, 4D scheduling.',
    evidenceCriteria: {
      familiar: 'Navigates Revit 3D views and understands BIM level definitions.',
      workingKnowledge: 'Creates structural grid models with walls, slabs, columns, and schedules in Revit.',
      projectReady: 'Runs clash detection reports between architectural, structural, and MEP models in Navisworks.',
      industryReady: 'Manages Common Data Environment (CDE) workflows adhering to ISO 19650 BIM standards.',
    },
    suggestedEvidenceTypes: ['portfolio', 'academic_project'],
  },
  'geotech_surveying': {
    id: 'geotech_surveying',
    name: 'Geotechnical Engineering & Land Surveying',
    category: 'domain_knowledge',
    description: 'Soil mechanics, bearing capacity, total station surveying, GIS mapping, slope stability.',
    evidenceCriteria: {
      familiar: 'Knows soil classifications, moisture content, and basic leveling techniques.',
      workingKnowledge: 'Calculates foundation bearing capacity and interprets borehole soil reports.',
      projectReady: 'Processes Total Station or GPS survey points in Civil 3D to create contour topographies.',
      industryReady: 'Designs deep pile foundation groups and geosynthetic soil stabilization systems.',
    },
    suggestedEvidenceTypes: ['coursework', 'academic_project'],
  },

  // ==========================================
  // 7. CHEMICAL, MATERIALS & BIOENGINEERING
  // ==========================================
  'chemical_process_design': {
    id: 'chemical_process_design',
    name: 'Chemical Process Simulation (Aspen Plus / DWSIM)',
    category: 'design_analysis',
    description: 'Mass & energy balances, thermodynamic equations of state, distillation, heat exchangers, P&ID.',
    evidenceCriteria: {
      familiar: 'Performs manual steady-state mass and energy balances on simple units.',
      workingKnowledge: 'Models distillation columns and reactors in Aspen Plus / DWSIM.',
      projectReady: 'Develops complete Process Flow Diagrams (PFD) and Piping & Instrumentation Diagrams (P&ID).',
      industryReady: 'Optimizes heat exchanger networks (Pinch Analysis) and sizing safety relief systems.',
    },
    suggestedEvidenceTypes: ['academic_project', 'coursework'],
  },
  'bioinformatics_python': {
    id: 'bioinformatics_python',
    name: 'Bioinformatics & Computational Biology',
    category: 'domain_knowledge',
    description: 'BioPython, sequence alignment (BLAST), genomic data analysis, molecular visualization.',
    evidenceCriteria: {
      familiar: 'Knows DNA/RNA/protein representations, FASTA formats, and central dogma.',
      workingKnowledge: 'Parses genomic sequences and runs pairwise alignment using BioPython.',
      projectReady: 'Conducts RNA-Seq differential expression pipelines or molecular docking simulations.',
      industryReady: 'Builds scalable next-generation sequencing (NGS) variant calling pipelines on HPC.',
    },
    suggestedEvidenceTypes: ['academic_project', 'portfolio'],
  },
  'materials_characterization': {
    id: 'materials_characterization',
    name: 'Materials Characterization & Metallurgy',
    category: 'domain_knowledge',
    description: 'XRD, SEM, TEM, phase diagrams, stress-strain curves, heat treatment, alloy design.',
    evidenceCriteria: {
      familiar: 'Reads Iron-Carbon phase diagrams and understands crystal lattices (FCC, BCC).',
      workingKnowledge: 'Interprets XRD diffraction peaks and tensile test data.',
      projectReady: 'Correlates heat treatment temperature profiles with hardness and microstructures.',
      industryReady: 'Conducts root-cause metallurgical failure analysis, fracture mechanics, and corrosion prevention.',
    },
    suggestedEvidenceTypes: ['coursework', 'academic_project'],
  },

  // ==========================================
  // 8. DEVOPS, CLOUD & SOFTWARE TESTING
  // ==========================================
  'git_version_control': {
    id: 'git_version_control',
    name: 'Git & Version Control Workflow',
    category: 'tools_software',
    description: 'Branching strategies, pull requests, rebase, merge conflicts, Git CLI conventions.',
    evidenceCriteria: {
      familiar: 'Uses git init, commit, push, and clone.',
      workingKnowledge: 'Creates feature branches, handles pull requests, and resolves basic merge conflicts.',
      projectReady: 'Maintains clean commit history, uses interactive rebase, and tags production releases.',
      industryReady: 'Configures Git hooks, monorepo branch permissions, and automated release changelogs.',
    },
    suggestedEvidenceTypes: ['personal_project', 'academic_project', 'portfolio'],
  },
  'docker_containerization': {
    id: 'docker_containerization',
    name: 'Docker & Containerization',
    category: 'tools_software',
    description: 'Dockerfiles, multi-stage builds, container networking, volumes, Docker Compose.',
    evidenceCriteria: {
      familiar: 'Runs pre-built containers from Docker Hub.',
      workingKnowledge: 'Writes Dockerfiles to containerize web apps and services.',
      projectReady: 'Constructs multi-container development environments using Docker Compose.',
      industryReady: 'Optimizes multi-stage scratch builds, minimizes image CVE vulnerabilities, and tunes layer caching.',
    },
    suggestedEvidenceTypes: ['personal_project', 'academic_project', 'internship'],
  },
  'ci_cd_pipelines': {
    id: 'ci_cd_pipelines',
    name: 'CI/CD Pipelines (GitHub Actions / GitLab CI)',
    category: 'tools_software',
    description: 'Automated test workflows, build triggers, artifact publishing, deployment automation.',
    evidenceCriteria: {
      familiar: 'Understands Continuous Integration vs Continuous Delivery benefits.',
      workingKnowledge: 'Configures GitHub Actions to run linters and test suites on Pull Requests.',
      projectReady: 'Automates end-to-end Docker image builds and deploys to staging environments.',
      industryReady: 'Architects zero-downtime blue-green / canary rollouts with secret scanning and audit logs.',
    },
    suggestedEvidenceTypes: ['personal_project', 'internship'],
  },
  'testing_qa': {
    id: 'testing_qa',
    name: 'Automated Testing & QA Rigor',
    category: 'testing_validation',
    description: 'Unit testing, integration testing, end-to-end testing, mocks, coverage reporting.',
    evidenceCriteria: {
      familiar: 'Understands difference between unit, integration, and E2E testing.',
      workingKnowledge: 'Writes unit tests with assertions using Jest/PyTest/JUnit.',
      projectReady: 'Implements integration tests with database mocks and measures code coverage.',
      industryReady: 'Configures Playwright/Cypress E2E test matrix, fuzz testing, and performance regression suites.',
    },
    suggestedEvidenceTypes: ['personal_project', 'academic_project'],
  },

  // ==========================================
  // 9. PROFESSIONAL, COLLABORATION & SAFETY
  // ==========================================
  'technical_documentation': {
    id: 'technical_documentation',
    name: 'Technical Writing & Architecture Specs',
    category: 'documentation',
    description: 'API documentation (OpenAPI / Swagger), README design, architectural RFCs, user manuals.',
    evidenceCriteria: {
      familiar: 'Writes basic project README with run instructions.',
      workingKnowledge: 'Generates OpenAPI / Swagger specs and writes modular code docstrings.',
      projectReady: 'Authors comprehensive system design RFCs covering trade-offs and data schemas.',
      industryReady: 'Publishes customer-facing developer documentation and post-mortem incident reports.',
    },
    suggestedEvidenceTypes: ['portfolio', 'academic_project'],
  },
  'engineering_safety_compliance': {
    id: 'engineering_safety_compliance',
    name: 'Safety Standards & Industry Compliance',
    category: 'safety_compliance',
    description: 'ISO 9001/27001, OSHA, electrical safety, hazardous material handling, data privacy (GDPR).',
    evidenceCriteria: {
      familiar: 'Knows lab safety protocols and basic regulatory bodies.',
      workingKnowledge: 'Follows safety checklists in engineering workshops or secure coding standards.',
      projectReady: 'Conducts Hazard and Operability (HAZOP) or security threat modeling for projects.',
      industryReady: 'Leads formal ISO / SOC2 compliance certifications and root-cause failure hazard audits.',
    },
    suggestedEvidenceTypes: ['coursework', 'employment'],
  },
  'agile_project_execution': {
    id: 'agile_project_execution',
    name: 'Agile Workflow & Project Execution',
    category: 'project_execution',
    description: 'Scrum, Kanban, sprint planning, ticket sizing, Jira / GitHub Projects, standups.',
    evidenceCriteria: {
      familiar: 'Knows sprint cycles, backlogs, and daily standup purpose.',
      workingKnowledge: 'Uses GitHub Issues / Trello to track personal and team project tasks.',
      projectReady: 'Estimates story points, manages sprint deliverables, and conducts retrospectives.',
      industryReady: 'Optimizes team velocity, manages cross-functional dependencies, and removes delivery blockers.',
    },
    suggestedEvidenceTypes: ['academic_project', 'internship'],
  },
  'interview_communication': {
    id: 'interview_communication',
    name: 'Technical Interview Articulation',
    category: 'interview_communication',
    description: 'STAR framework, trade-off explanation, whiteboarding, clear architectural defense.',
    evidenceCriteria: {
      familiar: 'Answers basic technical questions with direct definitions.',
      workingKnowledge: 'Communicates code thought process out loud while solving programming problems.',
      projectReady: 'Structures behavioral answers using Situation-Task-Action-Result (STAR) with data.',
      industryReady: 'Leads collaborative architectural mock discussions, defending design trade-offs gracefully.',
    },
    suggestedEvidenceTypes: ['assessment', 'self_report'],
  },
};

export function getSkillById(id: string): SkillDefinition | undefined {
  return SKILLS_CATALOG[id];
}

export function getSkillsByCategory(category: SkillCategory): SkillDefinition[] {
  return Object.values(SKILLS_CATALOG).filter(s => s.category === category);
}

export function getAllSkills(): SkillDefinition[] {
  return Object.values(SKILLS_CATALOG);
}

/**
 * SkillForge AI — Branch & Role-Specific Diagnostic Assessment Catalog
 *
 * Short conceptual checks (5-10 questions) testing foundational understanding,
 * architectural trade-offs, and design thinking.
 * Note: Never presented as a certified exam; used as an auxiliary calibration signal.
 */

export interface DiagnosticOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface DiagnosticQuestion {
  id: string;
  roleId: string;
  skillId: string;
  skillName: string;
  question: string;
  scenario: string;
  options: DiagnosticOption[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  conceptTested: string;
}

export const DIAGNOSTIC_QUESTIONS: Record<string, DiagnosticQuestion[]> = {
  // ==========================================
  // FRONTEND DEVELOPER
  // ==========================================
  frontend: [
    {
      id: 'fe_comp_responsibility',
      roleId: 'frontend',
      skillId: 'react_architecture',
      skillName: 'React & Component Architecture',
      question: 'Which architecture best separates responsibilities when a table component requires both server pagination and local row filtering?',
      scenario: 'You are refactoring a dashboard table displaying large customer datasets with active search and page navigation.',
      options: [
        {
          id: 'a',
          text: 'Combine data fetching, sorting algorithms, and row rendering inside one monolithic table component.',
          isCorrect: false,
          explanation: 'Violates Single Responsibility Principle and couples data transport directly with UI presentation.',
        },
        {
          id: 'b',
          text: 'Separate into a container/hook that handles query params & fetch logic, and a presentational table component accepting props.',
          isCorrect: true,
          explanation: 'Decouples business logic and network states from UI rendering, ensuring easy testing and reusability.',
        },
        {
          id: 'c',
          text: 'Use global Redux state for local row highlight toggles on every hover.',
          isCorrect: false,
          explanation: 'Over-complicates ephemeral UI interactions and creates unnecessary re-render overhead.',
        },
        {
          id: 'd',
          text: 'Store all sorted data directly in browser sessionStorage during every keystroke.',
          isCorrect: false,
          explanation: 'SessionStorage introduces needless serialization costs and can cause sluggish UI latency.',
        },
      ],
      difficulty: 'intermediate',
      conceptTested: 'Component decomposition & state encapsulation',
    },
    {
      id: 'fe_async_errors',
      roleId: 'frontend',
      skillId: 'javascript_typescript',
      skillName: 'JavaScript & TypeScript',
      question: 'How should an unhandled network error during a background polling request be managed in modern client apps?',
      scenario: 'A background data polling hook triggers every 15 seconds to fetch notification updates.',
      options: [
        {
          id: 'a',
          text: 'Suppress errors completely in an empty catch block so the user never notices anything.',
          isCorrect: false,
          explanation: 'Silencing network errors masks systemic server failures and hinders debugging.',
        },
        {
          id: 'b',
          text: 'Show a full-page crash modal and force the user to reload the tab immediately.',
          isCorrect: false,
          explanation: 'Severely damages user experience for non-critical background data synchronization.',
        },
        {
          id: 'c',
          text: 'Handle gracefully with exponential backoff retry, log telemetry, and display subtle non-blocking status banner if failure persists.',
          isCorrect: true,
          explanation: 'Ensures resilience, prevents server request storms, and respects user workflow.',
        },
        {
          id: 'd',
          text: 'Immediately retry in a synchronous while-loop until HTTP 200 is received.',
          isCorrect: false,
          explanation: 'Blocks the JavaScript main execution thread and executes a denial-of-service on your server.',
        },
      ],
      difficulty: 'intermediate',
      conceptTested: 'Asynchronous error boundaries & retry strategies',
    },
    {
      id: 'fe_state_flow',
      roleId: 'frontend',
      skillId: 'react_architecture',
      skillName: 'React & Component Architecture',
      question: 'In a deeply nested hierarchy, what is the recommended way to prevent "prop drilling" when state is consumed by distant leaf nodes?',
      scenario: 'A multi-step checkout workflow requires customer preference data across Step 1 and Step 4.',
      options: [
        {
          id: 'a',
          text: 'Pass props through 8 intermediary parent components manually.',
          isCorrect: false,
          explanation: 'Leads to fragile, brittle code where changes to intermediate components break consumers.',
        },
        {
          id: 'b',
          text: 'Store data on the window global object.',
          isCorrect: false,
          explanation: 'Bypasses React reactivity, creates memory leaks, and violates modular encapsulation.',
        },
        {
          id: 'c',
          text: 'Utilize a scoped React Context provider or specialized lightweight store hook (like Zustand).',
          isCorrect: true,
          explanation: 'Provides clean dependency injection to subtree consumers while preserving clean component signatures.',
        },
        {
          id: 'd',
          text: 'Force the child component to query the DOM directly using querySelector.',
          isCorrect: false,
          explanation: 'Violates declarative component paradigm and introduces severe timing bugs.',
        },
      ],
      difficulty: 'beginner',
      conceptTested: 'State flow architecture & context scoping',
    },
    {
      id: 'fe_a11y_problems',
      roleId: 'frontend',
      skillId: 'html_css_web',
      skillName: 'HTML5, Semantic Markup & CSS3',
      question: 'Which implementation of an interactive icon button conforms to WCAG accessibility standards?',
      scenario: 'Building a dark mode toggle button that only displays a sun/moon SVG icon.',
      options: [
        {
          id: 'a',
          text: '<div onClick={toggle}><svg>...</svg></div>',
          isCorrect: false,
          explanation: 'Non-semantic div is inaccessible to screen readers and cannot be navigated via standard keyboard Tab keys.',
        },
        {
          id: 'b',
          text: '<button type="button" aria-label="Toggle dark mode" onClick={toggle}><svg aria-hidden="true">...</svg></button>',
          isCorrect: true,
          explanation: 'Semantic button provides keyboard focus, Enter/Space actuation, explicit screen-reader label, and hides the raw SVG path.',
        },
        {
          id: 'c',
          text: '<span role="button" tabIndex={0}><svg>...</svg></span> without keydown handlers',
          isCorrect: false,
          explanation: 'Adding tabIndex allows focusing, but fails to handle Space or Enter keypresses natively.',
        },
        {
          id: 'd',
          text: '<a href="#" onClick={toggle}><svg>...</svg></a>',
          isCorrect: false,
          explanation: 'Using anchor links for non-navigational actions disrupts screen reader semantics and causes jumpy scroll behaviour.',
        },
      ],
      difficulty: 'intermediate',
      conceptTested: 'Web accessibility (a11y) & semantic HTML',
    },
    {
      id: 'fe_performance_optimization',
      roleId: 'frontend',
      skillId: 'web_performance',
      skillName: 'Web Performance & Core Web Vitals',
      question: 'Which strategy is most effective for improving Largest Contentful Paint (LCP) caused by a massive hero image?',
      scenario: 'Audit shows LCP takes 4.8 seconds because the main banner asset downloads late.',
      options: [
        {
          id: 'a',
          text: 'Add loading="lazy" to the above-the-fold hero image.',
          isCorrect: false,
          explanation: 'Lazy loading the primary hero image delays its fetch and worsens LCP drastically.',
        },
        {
          id: 'b',
          text: 'Preload the responsive WebP/AVIF hero image using <link rel="preload"> and apply fetchpriority="high".',
          isCorrect: true,
          explanation: 'Instructs the browser to prioritize the critical resource immediately during initial HTML streaming.',
        },
        {
          id: 'c',
          text: 'Convert the image to a base64 data string embedded in a CSS stylesheet.',
          isCorrect: false,
          explanation: 'Inflates CSS bundle size by ~33% and blocks first paint completely.',
        },
        {
          id: 'd',
          text: 'Animate opacity from 0 to 1 over 3 seconds.',
          isCorrect: false,
          explanation: 'Visual transitions do not resolve network transmission bottlenecks.',
        },
      ],
      difficulty: 'intermediate',
      conceptTested: 'Resource prioritization & Core Web Vitals',
    },
  ],

  // ==========================================
  // BACKEND DEVELOPER
  // ==========================================
  backend: [
    {
      id: 'be_db_indexing',
      roleId: 'backend',
      skillId: 'database_sql',
      skillName: 'Relational Databases & SQL Optimization',
      question: 'When should a compound index on (status, created_at) be preferred over single-column indexes on each?',
      scenario: 'Query: SELECT * FROM orders WHERE status = $1 ORDER BY created_at DESC LIMIT 50;',
      options: [
        {
          id: 'a',
          text: 'When queries frequently filter by status and immediately sort or slice by created_at.',
          isCorrect: true,
          explanation: 'Compound index satisfies both filtering and ordering without a slow in-memory filesort pass.',
        },
        {
          id: 'b',
          text: 'Compound indexes always take less disk space than single indexes regardless of use case.',
          isCorrect: false,
          explanation: 'Incorrect; multi-column indexes occupy more disk space and increase insert/update write amplification.',
        },
        {
          id: 'c',
          text: 'Only when every column in the table is an integer.',
          isCorrect: false,
          explanation: 'Data type does not restrict compound B-tree index applicability.',
        },
        {
          id: 'd',
          text: 'Never; Postgres automatically combines all separate indexes with zero overhead.',
          isCorrect: false,
          explanation: 'Bitmap index scans are slower than direct traversal of a pre-sorted composite index.',
        },
      ],
      difficulty: 'intermediate',
      conceptTested: 'Database index design & query execution plans',
    },
    {
      id: 'be_idempotency',
      roleId: 'backend',
      skillId: 'api_design_rest',
      skillName: 'RESTful API Architecture & Contracts',
      question: 'How do you guarantee payment idempotency when mobile clients submit charges over unstable connections?',
      scenario: 'A mobile user clicks "Pay" twice due to 3G network latency.',
      options: [
        {
          id: 'a',
          text: 'Rely on the client not clicking twice by disabling the button in JavaScript.',
          isCorrect: false,
          explanation: 'Client-side button state can be bypassed, reloaded, or submitted multiple times over flaky network sockets.',
        },
        {
          id: 'b',
          text: 'Require an Idempotency-Key header, storing and locking transaction states atomically in Redis/Postgres.',
          isCorrect: true,
          explanation: 'The backend ensures only one operation executes per unique key, returning the cached response on duplicate attempts.',
        },
        {
          id: 'c',
          text: 'Charge the card twice and issue an automated refund after 24 hours.',
          isCorrect: false,
          explanation: 'Incurs merchant fees, damages trust, and causes financial discrepancies.',
        },
        {
          id: 'd',
          text: 'Check if the user email has been used within the last 5 minutes.',
          isCorrect: false,
          explanation: 'Prevents valid successive purchases and fails when multiple family members share an account.',
        },
      ],
      difficulty: 'intermediate',
      conceptTested: 'Idempotency keys & distributed transaction safety',
    },
    {
      id: 'be_caching',
      roleId: 'backend',
      skillId: 'system_design_backend',
      skillName: 'System Design & Distributed Patterns',
      question: 'Which caching strategy prevents "Cache Stampede" (Thundering Herd) when a high-traffic cache key expires?',
      scenario: 'A hot trending article key expires while 10,000 requests per second are arriving.',
      options: [
        {
          id: 'a',
          text: 'Set cache TTL to 0 so data is never cached.',
          isCorrect: false,
          explanation: 'Crashes the primary database under high concurrent load.',
        },
        {
          id: 'b',
          text: 'Use probabilistic early expiration (XFetch) or distributed mutex locking on cache misses.',
          isCorrect: true,
          explanation: 'Ensures only one background worker regenerates the cache while remaining requests receive stale or queued responses.',
        },
        {
          id: 'c',
          text: 'Increase database connection pool to 50,000 connections.',
          isCorrect: false,
          explanation: 'Exhausts database RAM and CPU context-switching capacity.',
        },
        {
          id: 'd',
          text: 'Restart the backend servers whenever latency spikes.',
          isCorrect: false,
          explanation: 'Does not fix the architectural bottleneck and causes availability downtime.',
        },
      ],
      difficulty: 'advanced',
      conceptTested: 'Cache invalidation & thundering herd prevention',
    },
  ],

  // ==========================================
  // MECHANICAL ENGINEERING
  // ==========================================
  mech_design: [
    {
      id: 'mech_mfg_process',
      roleId: 'mech_design',
      skillId: 'cad_modeling',
      skillName: 'Manufacturing Process Selection',
      question: 'Which manufacturing process is most cost-effective for producing 50,000 complex aluminum heat sinks with thin cooling fins?',
      scenario: 'You are selecting the production methodology for high-volume automotive LED heat dissipation enclosures.',
      options: [
        {
          id: 'a',
          text: 'CNC 5-axis milling from solid billet aluminum.',
          isCorrect: false,
          explanation: 'CNC milling has high cycle times and material scrap, making it cost-prohibitive for 50,000 units.',
        },
        {
          id: 'b',
          text: 'Aluminum high-pressure die casting or continuous extrusion followed by cross-cutting.',
          isCorrect: true,
          explanation: 'Die casting and extrusion excel at high volume, intricate thin-wall geometry, and low per-part cycle times.',
        },
        {
          id: 'c',
          text: 'Direct Metal Laser Sintering (3D metal printing).',
          isCorrect: false,
          explanation: 'Additive manufacturing is suited for low-volume aerospace prototypes, not mass consumer volumes.',
        },
        {
          id: 'd',
          text: 'Manual sand casting with wood patterns.',
          isCorrect: false,
          explanation: 'Sand casting cannot produce thin cooling fin tolerances and requires excessive post-machining.',
        },
      ],
      difficulty: 'intermediate',
      conceptTested: 'Volume manufacturing selection & economics',
    },
    {
      id: 'mech_tolerance_fit',
      roleId: 'mech_design',
      skillId: 'engineering_drawings',
      skillName: 'Engineering Drawings & GD&T',
      question: 'What type of ISO fit is required when a hardened shaft must rotate continuously inside a bronze sleeve bearing without seizing?',
      scenario: 'Designing a bearing assembly for a conveyor drive motor operating under ambient factory temperatures.',
      options: [
        {
          id: 'a',
          text: 'Interference Fit (e.g., H7/p6).',
          isCorrect: false,
          explanation: 'Interference fit locks the shaft and bearing together rigidly, preventing any rotational motion.',
        },
        {
          id: 'b',
          text: 'Clearance Fit (e.g., H7/f7 or H7/e8).',
          isCorrect: true,
          explanation: 'Clearance fit guarantees positive space for a continuous hydrodynamic lubricant film to prevent seizure.',
        },
        {
          id: 'c',
          text: 'Transition Fit (e.g., H7/k6).',
          isCorrect: false,
          explanation: 'Transition fit may produce zero clearance or slight interference depending on manufacturing variation.',
        },
        {
          id: 'd',
          text: 'Press fit with anaerobic retaining compound.',
          isCorrect: false,
          explanation: 'Locks parts permanently and eliminates rotational freedom.',
        },
      ],
      difficulty: 'intermediate',
      conceptTested: 'Limits, fits, and hydrodynamic lubrication requirements',
    },
    {
      id: 'mech_stress_concentration',
      roleId: 'mech_design',
      skillId: 'fea_simulation',
      skillName: 'Stress Analysis & Mechanics',
      question: 'Why do engineers add generous transition fillets at steps on rotating drive shafts subjected to cyclic torsional loads?',
      scenario: 'Failure analysis shows a drive shaft snapped cleanly at a sharp 90-degree diameter transition.',
      options: [
        {
          id: 'a',
          text: 'To make the shaft look aesthetically polished.',
          isCorrect: false,
          explanation: 'Engineering geometry is driven by stress mechanics rather than superficial aesthetics.',
        },
        {
          id: 'b',
          text: 'To reduce the stress concentration factor (Kt) and prevent fatigue crack initiation.',
          isCorrect: true,
          explanation: 'Sharp interior corners focus peak localized stresses, leading to rapid cyclic fatigue failure.',
        },
        {
          id: 'c',
          text: 'To increase the rotational speed of the shaft.',
          isCorrect: false,
          explanation: 'Fillets do not alter drive RPM.',
        },
        {
          id: 'd',
          text: 'To allow the machine operator to hold the shaft by hand while running.',
          isCorrect: false,
          explanation: 'Operating rotating machinery by hand is an extreme safety hazard.',
        },
      ],
      difficulty: 'beginner',
      conceptTested: 'Stress concentration & fatigue failure mechanics',
    },
  ],

  // ==========================================
  // ELECTRICAL & ELECTRONICS
  // ==========================================
  vlsi_design: [
    {
      id: 'ee_control_loop',
      roleId: 'vlsi_design',
      skillId: 'circuit_analysis',
      skillName: 'Control Systems & Circuit Behavior',
      question: 'In a PID controller governing a DC motor speed, what is the primary consequence of setting the Integral gain (Ki) excessively high?',
      scenario: 'Tuning motor control parameters for a precision robotic arm.',
      options: [
        {
          id: 'a',
          text: 'Steady-state error decreases immediately to zero with zero overshoot.',
          isCorrect: false,
          explanation: 'Excessive integral gain introduces phase lag and severe overshoot.',
        },
        {
          id: 'b',
          text: 'The closed-loop system experiences oscillatory instability and potential integrator windup.',
          isCorrect: true,
          explanation: 'Excessive accumulated past error drives actuator saturation and oscillation.',
        },
        {
          id: 'c',
          text: 'The motor stops drawing any current from the power supply.',
          isCorrect: false,
          explanation: 'Gain tuning does not disconnect circuit power rails.',
        },
        {
          id: 'd',
          text: 'Sampling frequency drops to 1 Hz.',
          isCorrect: false,
          explanation: 'PID algorithm gains do not alter digital timer interrupt periods.',
        },
      ],
      difficulty: 'intermediate',
      conceptTested: 'Closed-loop stability & integrator dynamics',
    },
    {
      id: 'ee_sensor_selection',
      roleId: 'vlsi_design',
      skillId: 'embedded_sensors',
      skillName: 'Sensors & Signal Conditioning',
      question: 'Which temperature sensing solution is best suited for measuring high temperatures up to 800°C in an industrial furnace environment?',
      scenario: 'Selecting instrumentation for heat treatment furnace monitoring.',
      options: [
        {
          id: 'a',
          text: 'Standard commercial NTC thermistor.',
          isCorrect: false,
          explanation: 'NTC thermistors degrade and fail rapidly above 150°C.',
        },
        {
          id: 'b',
          text: 'Digital I2C temperature sensor (e.g., TMP117).',
          isCorrect: false,
          explanation: 'Silicon semiconductor sensors have absolute maximum limits around 125°C to 150°C.',
        },
        {
          id: 'c',
          text: 'Type-K mineral-insulated Thermocouple with cold-junction compensation.',
          isCorrect: true,
          explanation: 'Thermocouples operate reliably across wide temperature ranges up to 1100°C+.',
        },
        {
          id: 'd',
          text: 'Photoresistor (LDR).',
          isCorrect: false,
          explanation: 'LDR measures visible light intensity, not thermodynamic temperature.',
        },
      ],
      difficulty: 'intermediate',
      conceptTested: 'Transducer selection & physical operating limits',
    },
  ],

  // ==========================================
  // CIVIL & INFRASTRUCTURE
  // ==========================================
  structural_engineer: [
    {
      id: 'ce_foundation_selection',
      roleId: 'structural_engineer',
      skillId: 'geotechnical_eng',
      skillName: 'Foundation & Geotechnical Concepts',
      question: 'When soil investigation reveals a 12-meter layer of highly compressible marine clay with high water table, which foundation system is required for a 6-story building?',
      scenario: 'Site geotechnical survey shows standard bearing capacity (SBC) under 80 kPa at shallow depths.',
      options: [
        {
          id: 'a',
          text: 'Shallow isolated footings placed 1 meter below ground.',
          isCorrect: false,
          explanation: 'Weak clay under shallow footings would experience catastrophic differential settlement.',
        },
        {
          id: 'b',
          text: 'Deep pile foundation transferring superstructure loads down into competent rock or stiff strata.',
          isCorrect: true,
          explanation: 'Deep friction or end-bearing piles bypass soft compressible soil layers down to stable bedrock.',
        },
        {
          id: 'c',
          text: 'Simple rubble trench foundation with gravel backfill.',
          isCorrect: false,
          explanation: 'Unsuitable for multi-story load bearing on weak cohesive soils.',
        },
        {
          id: 'd',
          text: 'Constructing without foundation by laying structural slabs directly on turf.',
          isCorrect: false,
          explanation: 'Severe violation of building safety codes leading to structural failure.',
        },
      ],
      difficulty: 'intermediate',
      conceptTested: 'Geotechnical soil mechanics & deep foundation selection',
    },
    {
      id: 'ce_load_path',
      roleId: 'structural_engineer',
      skillId: 'structural_analysis',
      skillName: 'Structural Mechanics & Load Paths',
      question: 'In a conventional reinforced concrete framed structure, what is the sequence of gravity load transmission?',
      scenario: 'Traced during structural design audit of an educational building.',
      options: [
        {
          id: 'a',
          text: 'Slab → Beams → Columns → Footings → Supporting Soil.',
          isCorrect: true,
          explanation: 'Slabs distribute surface live/dead loads to beams; beams transfer shear to columns; columns transmit axial loads to footings.',
        },
        {
          id: 'b',
          text: 'Columns → Beams → Slab → Soil.',
          isCorrect: false,
          explanation: 'Inverted load path; columns cannot collect initial occupant surface loads.',
        },
        {
          id: 'c',
          text: 'Footings → Columns → Beams → Slab.',
          isCorrect: false,
          explanation: 'Gravity loads flow downward toward earth, not upward.',
        },
        {
          id: 'd',
          text: 'Slab directly to soil without beams or columns.',
          isCorrect: false,
          explanation: 'Only applicable to ground-bearing non-structural pavement slabs.',
        },
      ],
      difficulty: 'beginner',
      conceptTested: 'Gravity load path fundamentals in framed structures',
    },
  ],

  // ==========================================
  // DATA & MACHINE LEARNING
  // ==========================================
  data_analyst: [
    {
      id: 'data_sql_joins',
      roleId: 'data_analyst',
      skillId: 'sql_advanced',
      skillName: 'Advanced SQL & Data Analysis',
      question: 'Which JOIN returns all customers regardless of whether they have placed an order, but excludes orders without a valid customer ID?',
      scenario: 'You are reconciling an e-commerce customer registry against an orders table.',
      options: [
        {
          id: 'a',
          text: 'SELECT * FROM customers INNER JOIN orders ON customers.id = orders.customer_id;',
          isCorrect: false,
          explanation: 'INNER JOIN drops customers who have zero purchases.',
        },
        {
          id: 'b',
          text: 'SELECT * FROM customers LEFT JOIN orders ON customers.id = orders.customer_id;',
          isCorrect: true,
          explanation: 'LEFT JOIN preserves every row from the primary left table (customers) matching right table rows where present.',
        },
        {
          id: 'c',
          text: 'SELECT * FROM customers CROSS JOIN orders;',
          isCorrect: false,
          explanation: 'CROSS JOIN generates a Cartesian product multiplying all rows, corrupting aggregations.',
        },
        {
          id: 'd',
          text: 'SELECT * FROM orders RIGHT JOIN customers ON true;',
          isCorrect: false,
          explanation: 'Missing matching condition produces Cartesian join.',
        },
      ],
      difficulty: 'beginner',
      conceptTested: 'Relational algebra & SQL join semantics',
    },
    {
      id: 'data_metric_selection',
      roleId: 'data_analyst',
      skillId: 'statistics_analysis',
      skillName: 'Statistical Analysis & Metrics',
      question: 'When evaluating credit card fraud detection where 99.8% of transactions are legitimate, why is accuracy a misleading metric?',
      scenario: 'A dummy model predicts "Not Fraud" for every transaction and reports 99.8% accuracy.',
      options: [
        {
          id: 'a',
          text: 'Accuracy is only suitable for unsupervised clustering models.',
          isCorrect: false,
          explanation: 'Accuracy is a standard supervised metric, but fails on severe class imbalance.',
        },
        {
          id: 'b',
          text: 'A naive baseline predicting 100% legitimate transactions achieves 99.8% accuracy while catching zero fraud cases.',
          isCorrect: true,
          explanation: 'Class imbalance requires evaluating Precision, Recall, PR-AUC, or F1-Score rather than raw Accuracy.',
        },
        {
          id: 'c',
          text: 'Accuracy cannot be expressed as a percentage.',
          isCorrect: false,
          explanation: 'Accuracy is naturally a ratio between 0 and 1.',
        },
        {
          id: 'd',
          text: 'Fraud models must only be evaluated by query execution speed.',
          isCorrect: false,
          explanation: 'Operational latency is important, but statistical predictive power is paramount.',
        },
      ],
      difficulty: 'intermediate',
      conceptTested: 'Class imbalance & diagnostic metric selection',
    },
  ],
};

/**
 * Returns available diagnostic questions for a given role or defaults to frontend.
 */
export function getDiagnosticQuestionsForRole(roleId: string): DiagnosticQuestion[] {
  if (DIAGNOSTIC_QUESTIONS[roleId]) {
    return DIAGNOSTIC_QUESTIONS[roleId];
  }

  // Fallback mappings
  if (roleId.includes('data') || roleId.includes('analyst') || roleId.includes('ai') || roleId.includes('ml')) {
    return DIAGNOSTIC_QUESTIONS.data_analyst;
  }
  if (roleId.includes('backend') || roleId.includes('cloud') || roleId.includes('devops')) {
    return DIAGNOSTIC_QUESTIONS.backend;
  }
  if (roleId.includes('mech') || roleId.includes('robotics') || roleId.includes('auto')) {
    return DIAGNOSTIC_QUESTIONS.mech_design;
  }
  if (roleId.includes('civil') || roleId.includes('struct') || roleId.includes('bim')) {
    return DIAGNOSTIC_QUESTIONS.structural_engineer;
  }
  if (roleId.includes('elect') || roleId.includes('vlsi') || roleId.includes('embedded')) {
    return DIAGNOSTIC_QUESTIONS.vlsi_design;
  }

  return DIAGNOSTIC_QUESTIONS.frontend;
}

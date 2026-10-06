/**
 * SkillForge AI — Learning Resources & Project Blueprint Catalog
 * Grounded educational resources, official documentation links, and portfolio project specs.
 */

export interface LearningResource {
  id: string;
  skillId: string;
  title: string;
  resourceType: 'official_docs' | 'interactive_tutorial' | 'project_blueprint' | 'video_course' | 'spec_rfc';
  url: string;
  estimatedHours: number;
  description: string;
}

export const LEARNING_RESOURCES: LearningResource[] = [
  // Web & Frontend
  {
    id: 'res_html_css_mdn',
    skillId: 'html_css_web',
    title: 'MDN Web Docs: HTML & CSS Core Guidelines',
    resourceType: 'official_docs',
    url: 'https://developer.mozilla.org/en-US/docs/Learn',
    estimatedHours: 8,
    description: 'Definitive reference for semantic HTML5 elements, CSS Flexbox & Grid layouts, and WCAG accessibility standards.',
  },
  {
    id: 'res_js_info',
    skillId: 'javascript_typescript',
    title: 'The Modern JavaScript Tutorial (javascript.info)',
    resourceType: 'interactive_tutorial',
    url: 'https://javascript.info/',
    estimatedHours: 12,
    description: 'Deep dive into JavaScript closures, prototype inheritance, event loop, Promises, and async/await mechanics.',
  },
  {
    id: 'res_react_official',
    skillId: 'react_architecture',
    title: 'React Official Documentation & Interactive Playground',
    resourceType: 'official_docs',
    url: 'https://react.dev/',
    estimatedHours: 10,
    description: 'Component architecture, custom hooks design, state isolation, and UI rendering lifecycle.',
  },

  // Backend & Databases
  {
    id: 'res_node_official',
    skillId: 'node_express',
    title: 'Node.js Architecture & Asynchronous Event Loop Guides',
    resourceType: 'official_docs',
    url: 'https://nodejs.org/en/docs/guides/',
    estimatedHours: 6,
    description: 'Understanding non-blocking I/O, worker threads, stream pipelines, and REST server middleware best practices.',
  },
  {
    id: 'res_postgres_sql',
    skillId: 'sql_databases',
    title: 'PostgreSQL Official Documentation & Tutorial',
    resourceType: 'official_docs',
    url: 'https://www.postgresql.org/docs/current/tutorial.html',
    estimatedHours: 8,
    description: 'Relational schema design, ACID transactions, B-Tree indexes, and query execution plans (EXPLAIN ANALYZE).',
  },

  // AI & Data Science
  {
    id: 'res_pandas_docs',
    skillId: 'data_engineering_pandas',
    title: 'Pandas User Guide & Vectorized Operations',
    resourceType: 'official_docs',
    url: 'https://pandas.pydata.org/docs/user_guide/',
    estimatedHours: 7,
    description: 'Practical data cleaning, group-by aggregations, reshaping, and time-series manipulation.',
  },
  {
    id: 'res_scikit_learn',
    skillId: 'ml_fundamentals',
    title: 'Scikit-Learn Machine Learning in Python Guide',
    resourceType: 'official_docs',
    url: 'https://scikit-learn.org/stable/user_guide.html',
    estimatedHours: 12,
    description: 'Supervised and unsupervised models, cross-validation, feature preprocessing pipelines, and metric evaluations.',
  },
  {
    id: 'res_pytorch_tutorials',
    skillId: 'deep_learning_frameworks',
    title: 'PyTorch Deep Learning Zero-to-Mastery Tutorials',
    resourceType: 'interactive_tutorial',
    url: 'https://pytorch.org/tutorials/',
    estimatedHours: 14,
    description: 'Tensor operations, neural network modules, loss functions, autograd backpropagation, and CNN training.',
  },

  // Embedded & Hardware
  {
    id: 'res_freertos_guide',
    skillId: 'microcontrollers_rtos',
    title: 'FreeRTOS Official Kernel Guide & Reference',
    resourceType: 'official_docs',
    url: 'https://www.freertos.org/Documentation/RTOS_book.html',
    estimatedHours: 10,
    description: 'Preemptive multitasking, task queues, mutex priority inversion management, and real-time tick timers.',
  },
  {
    id: 'res_kicad_docs',
    skillId: 'pcb_design',
    title: 'KiCad Schematic & PCB Layout Manual',
    resourceType: 'official_docs',
    url: 'https://docs.kicad.org/',
    estimatedHours: 8,
    description: 'Schematic capture, footprint association, 2-layer and 4-layer trace routing, and design rule checks (DRC).',
  },

  // Mechanical & CAD
  {
    id: 'res_solidworks_gdandt',
    skillId: 'cad_3d_modeling',
    title: 'ASME Y14.5 Geometric Dimensioning and Tolerancing (GD&T)',
    resourceType: 'spec_rfc',
    url: 'https://www.asme.org/codes-standards',
    estimatedHours: 6,
    description: 'Datum reference frames, position tolerances, runout, flatness, and production manufacturing drawing standards.',
  },
  {
    id: 'res_ros2_docs',
    skillId: 'robotics_ros',
    title: 'ROS 2 Humble / Iron Official Documentation',
    resourceType: 'official_docs',
    url: 'https://docs.ros.org/en/humble/',
    estimatedHours: 12,
    description: 'Nodes, publishers, subscribers, services, URDF robot modeling, and Nav2 autonomous mobile navigation.',
  },

  // Civil & Structural
  {
    id: 'res_etabs_modeling',
    skillId: 'structural_analysis',
    title: 'CSI ETABS Structural Analysis & Design Manual',
    resourceType: 'official_docs',
    url: 'https://www.csiamerica.com/products/etabs',
    estimatedHours: 10,
    description: 'Frame analysis, finite element floor slabs, seismic lateral force response spectra, and reinforcement design.',
  },
  {
    id: 'res_autodesk_revit',
    skillId: 'bim_modeling',
    title: 'Autodesk Revit BIM Modeling & Clash Detection Guide',
    resourceType: 'official_docs',
    url: 'https://help.autodesk.com/view/RVT/2024/ENU/',
    estimatedHours: 8,
    description: '3D structural grids, parametric families, automated schedules, and Navisworks federated model coordination.',
  },

  // Chemical & Bio
  {
    id: 'res_aspen_process',
    skillId: 'chemical_process_design',
    title: 'Chemical Engineering Process Simulation Fundamentals',
    resourceType: 'official_docs',
    url: 'https://dwsim.org/wiki/index.php?title=Main_Page',
    estimatedHours: 8,
    description: 'Steady-state unit operations, mass and energy balances, thermodynamic flash calculations, and P&ID drafting.',
  },

  // DevOps & Cloud
  {
    id: 'res_docker_curriculum',
    skillId: 'docker_containerization',
    title: 'Docker Hands-On Curriculum & Best Practices',
    resourceType: 'interactive_tutorial',
    url: 'https://docs.docker.com/get-started/',
    estimatedHours: 5,
    description: 'Container architecture, Dockerfiles, caching layers, multi-container Compose, and network bridges.',
  },
  {
    id: 'res_git_pro',
    skillId: 'git_version_control',
    title: 'Pro Git Book (Scott Chacon & Ben Straub)',
    resourceType: 'official_docs',
    url: 'https://git-scm.com/book/en/v2',
    estimatedHours: 6,
    description: 'Under the hood Git objects (blobs, trees, commits), branching, interactive rebase, and submodules.',
  },
];

export function getResourcesForSkill(skillId: string): LearningResource[] {
  return LEARNING_RESOURCES.filter(r => r.skillId === skillId);
}

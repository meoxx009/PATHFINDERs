/**
 * SkillForge AI — Unified Engineering Career Taxonomy
 * 30+ Engineering branches with cascading streams, specializations, and roles.
 */

import { ROLES_CATALOG, getRoleById } from './roles';

export interface EngineeringSpecialization {
  id: string;
  name: string;
  description: string;
  roleIds: string[];
}

export interface EngineeringStream {
  id: string;
  name: string;
  description: string;
  specializations: EngineeringSpecialization[];
}

export interface EngineeringBranch {
  id: string;
  name: string;
  code: string;
  family: 
    | 'computing'
    | 'electrical_electronics'
    | 'mechanical_industrial'
    | 'civil_infrastructure'
    | 'chemical_materials_bio'
    | 'interdisciplinary'
    | 'other';
  streams: EngineeringStream[];
}

export const ENGINEERING_TAXONOMY: EngineeringBranch[] = [
  // 1. Computer Science and Engineering
  {
    id: 'cse',
    name: 'Computer Science and Engineering',
    code: 'CSE',
    family: 'computing',
    streams: [
      {
        id: 'cse_software',
        name: 'Software Systems & Web Architecture',
        description: 'Modern full-stack, distributed web systems, and mobile platforms.',
        specializations: [
          {
            id: 'web_dev',
            name: 'Web Applications & Cloud Architecture',
            description: 'Modern component-driven web user interfaces and microservice APIs.',
            roleIds: ['frontend', 'backend', 'fullstack'],
          },
          {
            id: 'cloud_devops',
            name: 'Cloud Computing & Infrastructure',
            description: 'Scalable cloud infrastructure, container orchestration, and reliability.',
            roleIds: ['devops', 'cloud', 'qa_automation'],
          },
          {
            id: 'cybersecurity_spec',
            name: 'Systems Security & Network Defense',
            description: 'Application security hardening, threat intelligence, and vulnerability auditing.',
            roleIds: ['cybersecurity'],
          },
        ],
      },
      {
        id: 'cse_ai_data',
        name: 'Intelligent Systems & Data Engineering',
        description: 'Machine learning pipelines, predictive analytics, and deep learning models.',
        specializations: [
          {
            id: 'ai_ml_spec',
            name: 'Applied Machine Learning & AI',
            description: 'Supervised/unsupervised models, deep neural networks, and generative AI systems.',
            roleIds: ['ml_engineer', 'ai_engineer'],
          },
          {
            id: 'data_engineering_spec',
            name: 'Data Architecture & Big Data Analytics',
            description: 'Large-scale database architecture, ETL workflows, and business intelligence.',
            roleIds: ['data_engineer', 'data_analyst'],
          },
        ],
      },
    ],
  },

  // 2. Information Technology
  {
    id: 'it',
    name: 'Information Technology',
    code: 'IT',
    family: 'computing',
    streams: [
      {
        id: 'it_enterprise',
        name: 'Enterprise Software & Solutions',
        description: 'Commercial web systems, database design, and cloud deployments.',
        specializations: [
          {
            id: 'it_web',
            name: 'Full-Stack Enterprise Applications',
            description: 'Building secure web workflows, databases, and responsive clients.',
            roleIds: ['fullstack', 'frontend', 'backend'],
          },
          {
            id: 'it_cloud',
            name: 'Cloud Operations & Quality Assurance',
            description: 'Managing reliable cloud setups and automated QA testing.',
            roleIds: ['cloud', 'qa_automation', 'devops'],
          },
        ],
      },
    ],
  },

  // 3. Software Engineering
  {
    id: 'se',
    name: 'Software Engineering',
    code: 'SE',
    family: 'computing',
    streams: [
      {
        id: 'se_product',
        name: 'Product Engineering & Systems Lifecycle',
        description: 'Software development methodologies, testing standards, and backend architectures.',
        specializations: [
          {
            id: 'se_backend',
            name: 'Backend Architecture & Distributed Systems',
            description: 'High-concurrency services, database schemas, and microservice communication.',
            roleIds: ['backend', 'fullstack'],
          },
          {
            id: 'se_quality',
            name: 'Test Automation & DevOps Integration',
            description: 'Automated CI/CD validation, end-to-end testing, and deployment pipelines.',
            roleIds: ['qa_automation', 'devops'],
          },
        ],
      },
    ],
  },

  // 4. Artificial Intelligence and Machine Learning
  {
    id: 'aiml',
    name: 'Artificial Intelligence and Machine Learning',
    code: 'AIML',
    family: 'computing',
    streams: [
      {
        id: 'aiml_core',
        name: 'Core Artificial Intelligence & Models',
        description: 'Deep neural networks, LLMs, computer vision, and cognitive systems.',
        specializations: [
          {
            id: 'aiml_engineering',
            name: 'Machine Learning & Predictive Systems',
            description: 'Statistical modeling, Scikit-learn pipelines, PyTorch training, and inference.',
            roleIds: ['ml_engineer', 'ai_engineer'],
          },
          {
            id: 'aiml_data',
            name: 'Data Science & Analytical Insights',
            description: 'Translating mathematical patterns into structured intelligence.',
            roleIds: ['data_analyst', 'data_engineer'],
          },
        ],
      },
    ],
  },

  // 5. Data Science and Analytics
  {
    id: 'dsa',
    name: 'Data Science and Analytics',
    code: 'DSA',
    family: 'computing',
    streams: [
      {
        id: 'dsa_core',
        name: 'Data Analytics & Pipeline Engineering',
        description: 'Data transformation, statistical hypothesis testing, and BI visual storytelling.',
        specializations: [
          {
            id: 'dsa_analyst',
            name: 'Business Intelligence & Exploratory Analytics',
            description: 'SQL queries, Pandas analysis, Tableau dashboards, and KPI tracking.',
            roleIds: ['data_analyst'],
          },
          {
            id: 'dsa_pipeline',
            name: 'Data Warehousing & ETL Pipelines',
            description: 'Constructing robust automated ETL pipelines and database star schemas.',
            roleIds: ['data_engineer', 'ml_engineer'],
          },
        ],
      },
    ],
  },

  // 6. Electronics and Communication Engineering
  {
    id: 'ece',
    name: 'Electronics and Communication Engineering',
    code: 'ECE',
    family: 'electrical_electronics',
    streams: [
      {
        id: 'ece_embedded_comm',
        name: 'Embedded Systems & Hardware Design',
        description: 'Microcontroller architecture, wireless protocols, and digital circuits.',
        specializations: [
          {
            id: 'ece_embedded',
            name: 'Microcontroller Firmware & RTOS',
            description: 'Bare-metal C, FreeRTOS tasks, peripheral protocols (I2C/SPI), and drivers.',
            roleIds: ['embedded_software'],
          },
          {
            id: 'ece_vlsi',
            name: 'VLSI Digital Logic & FPGA Synthesis',
            description: 'Verilog RTL, digital state machines, and hardware description simulation.',
            roleIds: ['vlsi_design', 'pcb_design_eng'],
          },
        ],
      },
    ],
  },

  // 7. Electrical Engineering
  {
    id: 'ee',
    name: 'Electrical Engineering',
    code: 'EE',
    family: 'electrical_electronics',
    streams: [
      {
        id: 'ee_power_control',
        name: 'Power Electronics & Control Systems',
        description: 'Power distribution, inverters, automated instrumentation, and grid control.',
        specializations: [
          {
            id: 'ee_embedded_control',
            name: 'Embedded Controllers & Automation',
            description: 'Embedded programming for power electronics and industrial automation.',
            roleIds: ['embedded_software', 'pcb_design_eng'],
          },
        ],
      },
    ],
  },

  // 8. Electrical and Electronics Engineering
  {
    id: 'eee',
    name: 'Electrical and Electronics Engineering',
    code: 'EEE',
    family: 'electrical_electronics',
    streams: [
      {
        id: 'eee_systems',
        name: 'Electrical Circuitry & Smart Systems',
        description: 'Hardware schematics, energy conversion, and microcontroller integration.',
        specializations: [
          {
            id: 'eee_hw_design',
            name: 'PCB Prototyping & Embedded Systems',
            description: 'Hardware layout, firmware development, and sensor interfaces.',
            roleIds: ['pcb_design_eng', 'embedded_software'],
          },
        ],
      },
    ],
  },

  // 9. Instrumentation and Control Engineering
  {
    id: 'ice',
    name: 'Instrumentation and Control Engineering',
    code: 'ICE',
    family: 'electrical_electronics',
    streams: [
      {
        id: 'ice_industrial',
        name: 'Process Instrumentation & Control',
        description: 'Sensors, transducers, feedback control loops, and PLCs.',
        specializations: [
          {
            id: 'ice_automation',
            name: 'Embedded Sensors & Industrial Telemetry',
            description: 'Real-time telemetry, microcontroller firmware, and data acquisition.',
            roleIds: ['embedded_software', 'pcb_design_eng'],
          },
        ],
      },
    ],
  },

  // 10. Embedded Systems Engineering
  {
    id: 'embedded',
    name: 'Embedded Systems Engineering',
    code: 'EMB',
    family: 'electrical_electronics',
    streams: [
      {
        id: 'emb_devices',
        name: 'Connected Devices & Firmware Architecture',
        description: 'Real-time embedded software, low-power IoT, and board bring-up.',
        specializations: [
          {
            id: 'emb_firmware',
            name: 'RTOS & Embedded Systems Firmware',
            description: 'C/C++ firmware, RTOS priority scheduling, and hardware drivers.',
            roleIds: ['embedded_software', 'pcb_design_eng'],
          },
        ],
      },
    ],
  },

  // 11. Mechanical Engineering
  {
    id: 'me',
    name: 'Mechanical Engineering',
    code: 'ME',
    family: 'mechanical_industrial',
    streams: [
      {
        id: 'me_design_mfg',
        name: 'Machine Design & Manufacturing Systems',
        description: '3D CAD, structural mechanics, tolerance stack-up, and manufacturing.',
        specializations: [
          {
            id: 'me_cad_design',
            name: '3D CAD & Mechanical Product Design',
            description: 'SolidWorks assemblies, GD&T tolerancing, FEA stress verification, and DFM.',
            roleIds: ['mech_design'],
          },
        ],
      },
    ],
  },

  // 12. Mechatronics Engineering
  {
    id: 'mechatronics',
    name: 'Mechatronics Engineering',
    code: 'MTR',
    family: 'mechanical_industrial',
    streams: [
      {
        id: 'mtr_systems',
        name: 'Electro-Mechanical & Robotic Systems',
        description: 'Synergy of mechanics, electronics, microcontrollers, and motion control.',
        specializations: [
          {
            id: 'mtr_robotics',
            name: 'Robotic Motion Control & Automation',
            description: 'Sensors, actuators, ROS2 navigation, and embedded control.',
            roleIds: ['robotics_engineer', 'mech_design', 'embedded_software'],
          },
        ],
      },
    ],
  },

  // 13. Robotics and Automation
  {
    id: 'robotics',
    name: 'Robotics and Automation',
    code: 'ROB',
    family: 'mechanical_industrial',
    streams: [
      {
        id: 'rob_autonomous',
        name: 'Autonomous Systems & Kinematics',
        description: 'Mobile robotics, kinematic manipulators, SLAM, and computer vision.',
        specializations: [
          {
            id: 'rob_ros',
            name: 'ROS2 & Autonomous Mobile Robotics',
            description: 'ROS nodes, URDF models, Gazebo simulation, and trajectory planning.',
            roleIds: ['robotics_engineer', 'embedded_software'],
          },
        ],
      },
    ],
  },

  // 14. Automobile Engineering
  {
    id: 'auto',
    name: 'Automobile Engineering',
    code: 'AUTO',
    family: 'mechanical_industrial',
    streams: [
      {
        id: 'auto_vehicles',
        name: 'Automotive & EV Mobility Systems',
        description: 'Chassis design, powertrain systems, CAN-bus networks, and electric vehicles.',
        specializations: [
          {
            id: 'auto_design',
            name: 'Automotive CAD & Mechanical Systems',
            description: 'Automotive component modeling, structural FEA, and packaging.',
            roleIds: ['mech_design', 'robotics_engineer'],
          },
        ],
      },
    ],
  },

  // 15. Aerospace Engineering
  {
    id: 'aero',
    name: 'Aerospace Engineering',
    code: 'AERO',
    family: 'mechanical_industrial',
    streams: [
      {
        id: 'aero_structures',
        name: 'Aerospace Structures & Flight Dynamics',
        description: 'Aerodynamic surfaces, lightweight composite design, and avionics control.',
        specializations: [
          {
            id: 'aero_cad_fea',
            name: 'Aerospace Structural Design & FEA',
            description: 'Structural stress analysis, CAD modeling, and thermal resistance.',
            roleIds: ['mech_design', 'embedded_software'],
          },
        ],
      },
    ],
  },

  // 16. Civil Engineering
  {
    id: 'ce',
    name: 'Civil Engineering',
    code: 'CE',
    family: 'civil_infrastructure',
    streams: [
      {
        id: 'ce_structures_infra',
        name: 'Structural Engineering & Digital Construction',
        description: 'RCC design, building codes, BIM coordination, and geotechnical analysis.',
        specializations: [
          {
            id: 'ce_structural',
            name: 'Structural Design & Code Compliance',
            description: 'ETABS/STAAD analysis, shear/moment calculation, and seismic safety.',
            roleIds: ['structural_engineer'],
          },
          {
            id: 'ce_bim',
            name: 'BIM & Construction Technology',
            description: 'Revit 3D modeling, clash detection, and quantity schedules.',
            roleIds: ['bim_engineer'],
          },
        ],
      },
    ],
  },

  // 17. Structural Engineering
  {
    id: 'structural',
    name: 'Structural Engineering',
    code: 'STR',
    family: 'civil_infrastructure',
    streams: [
      {
        id: 'str_analysis',
        name: 'Advanced Structural Mechanics & Bridges',
        description: 'Finite element structural models, concrete/steel building frameworks.',
        specializations: [
          {
            id: 'str_frames',
            name: 'High-Rise & Bridge Structural Design',
            description: 'Building analysis, foundation design, and structural safety codes.',
            roleIds: ['structural_engineer', 'bim_engineer'],
          },
        ],
      },
    ],
  },

  // 18. Environmental Engineering
  {
    id: 'env',
    name: 'Environmental Engineering',
    code: 'ENV',
    family: 'civil_infrastructure',
    streams: [
      {
        id: 'env_systems',
        name: 'Water Treatment & Environmental Safety',
        description: 'Waste management, water treatment plants, and sustainability compliance.',
        specializations: [
          {
            id: 'env_process',
            name: 'Water Treatment Infrastructure',
            description: 'Hydraulic modeling, pipeline networks, and environmental safety regulations.',
            roleIds: ['structural_engineer', 'process_engineer'],
          },
        ],
      },
    ],
  },

  // 19. Chemical Engineering
  {
    id: 'chem',
    name: 'Chemical Engineering',
    code: 'CHEM',
    family: 'chemical_materials_bio',
    streams: [
      {
        id: 'chem_process',
        name: 'Chemical Plant & Process Engineering',
        description: 'Thermodynamics, separation columns, reactors, and Aspen Plus simulations.',
        specializations: [
          {
            id: 'chem_simulation',
            name: 'Process Design & Plant Simulation',
            description: 'Aspen Plus mass/energy balances, P&ID creation, and HAZOP risk audits.',
            roleIds: ['process_engineer'],
          },
        ],
      },
    ],
  },

  // 20. Biotechnology
  {
    id: 'biotech',
    name: 'Biotechnology',
    code: 'BIOT',
    family: 'chemical_materials_bio',
    streams: [
      {
        id: 'biot_computational',
        name: 'Computational Biology & Bioprocessing',
        description: 'Genomic data science, sequence alignment, and fermentor modeling.',
        specializations: [
          {
            id: 'biot_bioinfo',
            name: 'Bioinformatics & Computational Genomics',
            description: 'BioPython pipelines, sequence alignment, and biological data analytics.',
            roleIds: ['bioinformatics_engineer', 'data_analyst'],
          },
        ],
      },
    ],
  },

  // 21. Biomedical Engineering
  {
    id: 'biomed',
    name: 'Biomedical Engineering',
    code: 'BMED',
    family: 'chemical_materials_bio',
    streams: [
      {
        id: 'bmed_devices',
        name: 'Medical Devices & Clinical Instrumentation',
        description: 'Physiological sensors, embedded biomedical monitors, and ISO 13485 compliance.',
        specializations: [
          {
            id: 'bmed_embedded',
            name: 'Medical Device Hardware & Sensors',
            description: 'Biomedical signal processing, microcontroller circuits, and firmware.',
            roleIds: ['embedded_software', 'pcb_design_eng'],
          },
        ],
      },
    ],
  },

  // 22. Materials and Metallurgical Engineering
  {
    id: 'materials',
    name: 'Materials and Metallurgical Engineering',
    code: 'MAT',
    family: 'chemical_materials_bio',
    streams: [
      {
        id: 'mat_alloys',
        name: 'Physical Metallurgy & Materials Characterization',
        description: 'Alloy development, heat treatments, phase diagrams, and failure analysis.',
        specializations: [
          {
            id: 'mat_testing',
            name: 'Materials Testing & Failure Analysis',
            description: 'XRD/SEM characterization, tensile testing, and DFM materials selection.',
            roleIds: ['mech_design', 'process_engineer'],
          },
        ],
      },
    ],
  },

  // 23. Mining Engineering
  {
    id: 'mining',
    name: 'Mining Engineering',
    code: 'MINE',
    family: 'interdisciplinary',
    streams: [
      {
        id: 'mine_ops',
        name: 'Mineral Extraction & Geotechnical Safety',
        description: 'Rock mechanics, site surveying, and automated equipment telemetry.',
        specializations: [
          {
            id: 'mine_survey',
            name: 'Mine Geotechnical & Structural Operations',
            description: 'Slope stability, geotechnical borehole analysis, and site safety.',
            roleIds: ['structural_engineer', 'process_engineer'],
          },
        ],
      },
    ],
  },

  // 24. Petroleum Engineering
  {
    id: 'petroleum',
    name: 'Petroleum Engineering',
    code: 'PET',
    family: 'chemical_materials_bio',
    streams: [
      {
        id: 'pet_refining',
        name: 'Hydrocarbon Processing & Transport',
        description: 'Reservoir simulation, pipeline hydraulics, and refinery distillation.',
        specializations: [
          {
            id: 'pet_process',
            name: 'Petroleum Refining & Process Design',
            description: 'Aspen Plus mass balances, heat exchangers, and safety valves.',
            roleIds: ['process_engineer'],
          },
        ],
      },
    ],
  },

  // 25. Production Engineering
  {
    id: 'production',
    name: 'Production Engineering',
    code: 'PROD',
    family: 'mechanical_industrial',
    streams: [
      {
        id: 'prod_mfg',
        name: 'Production Systems & Tooling',
        description: 'CNC toolpaths, factory scheduling, and lean quality controls.',
        specializations: [
          {
            id: 'prod_tooling',
            name: 'Manufacturing & Tooling Optimization',
            description: 'CAD/CAM modeling, CNC programming, and Six Sigma yield audits.',
            roleIds: ['mech_design', 'qa_automation'],
          },
        ],
      },
    ],
  },

  // 26. Industrial Engineering
  {
    id: 'industrial',
    name: 'Industrial Engineering',
    code: 'IND',
    family: 'mechanical_industrial',
    streams: [
      {
        id: 'ind_ops',
        name: 'Operations Research & Supply Chain Optimization',
        description: 'Queuing models, statistical process control, and facility layout planning.',
        specializations: [
          {
            id: 'ind_analytics',
            name: 'Operational Analytics & Workflow Engineering',
            description: 'Data analytics, optimization models, and dashboard performance metrics.',
            roleIds: ['data_analyst', 'qa_automation'],
          },
        ],
      },
    ],
  },

  // 27. Manufacturing Engineering
  {
    id: 'manufacturing',
    name: 'Manufacturing Engineering',
    code: 'MFG',
    family: 'mechanical_industrial',
    streams: [
      {
        id: 'mfg_process',
        name: 'Advanced Manufacturing & Automation',
        description: 'Additive manufacturing, industrial robotics, and automated assembly cells.',
        specializations: [
          {
            id: 'mfg_automation',
            name: 'Factory Automation & CAD Design',
            description: 'CAD models, automated CNC lines, and quality verification.',
            roleIds: ['mech_design', 'robotics_engineer'],
          },
        ],
      },
    ],
  },

  // 28. Engineering Physics
  {
    id: 'physics',
    name: 'Engineering Physics',
    code: 'PHYS',
    family: 'interdisciplinary',
    streams: [
      {
        id: 'phys_optics_semi',
        name: 'Semiconductor Physics & Computational Modeling',
        description: 'Optics, quantum devices, solid-state physics, and scientific computing.',
        specializations: [
          {
            id: 'phys_vlsi',
            name: 'Semiconductors & Device Simulation',
            description: 'Digital logic modeling, scientific Python scripting, and verification.',
            roleIds: ['vlsi_design', 'data_analyst'],
          },
        ],
      },
    ],
  },

  // 29. Renewable Energy Engineering
  {
    id: 'renewable',
    name: 'Renewable Energy Engineering',
    code: 'REN',
    family: 'electrical_electronics',
    streams: [
      {
        id: 'ren_solar_wind',
        name: 'Solar, Wind & Storage Energy Systems',
        description: 'Photovoltaics, battery storage management, and inverter control systems.',
        specializations: [
          {
            id: 'ren_embedded_power',
            name: 'Clean Energy Power Electronics & Control',
            description: 'Embedded microcontroller telemetry and power electronic circuit boards.',
            roleIds: ['embedded_software', 'pcb_design_eng'],
          },
        ],
      },
    ],
  },

  // 30. Agricultural Engineering
  {
    id: 'agri',
    name: 'Agricultural Engineering',
    code: 'AGRI',
    family: 'interdisciplinary',
    streams: [
      {
        id: 'agri_smart',
        name: 'Precision Agriculture & Farm Machinery',
        description: 'IoT soil sensors, autonomous tractors, and environmental data logging.',
        specializations: [
          {
            id: 'agri_iot',
            name: 'Agricultural IoT & Automation Sensors',
            description: 'Embedded sensor networks, remote wireless telemetry, and data insights.',
            roleIds: ['embedded_software', 'data_analyst'],
          },
        ],
      },
    ],
  },

  // 31. Other Engineering Branch (Extensible Fallback)
  {
    id: 'other',
    name: 'Other Engineering Discipline',
    code: 'OTHER',
    family: 'other',
    streams: [
      {
        id: 'other_general',
        name: 'Custom Engineering Track',
        description: 'Interdisciplinary, emerging, or tailored engineering academic curriculum.',
        specializations: [
          {
            id: 'other_custom',
            name: 'Custom Specialization',
            description: 'Tailored career preparation path for custom disciplines.',
            roleIds: ['fullstack', 'frontend', 'backend', 'data_analyst', 'embedded_software', 'mech_design', 'structural_engineer'],
          },
        ],
      },
    ],
  },
];

// Helper functions for data lookups
export function getBranchById(branchId: string): EngineeringBranch | undefined {
  return ENGINEERING_TAXONOMY.find(b => b.id === branchId);
}

export function getAllBranches(): EngineeringBranch[] {
  return ENGINEERING_TAXONOMY;
}

export function getStreamsForBranch(branchId: string): EngineeringStream[] {
  const branch = getBranchById(branchId);
  return branch ? branch.streams : [];
}

export function getSpecializationsForStream(branchId: string, streamId: string): EngineeringSpecialization[] {
  const streams = getStreamsForBranch(branchId);
  const stream = streams.find(s => s.id === streamId);
  return stream ? stream.specializations : [];
}

export function getRolesForSpecialization(branchId: string, streamId: string, specId: string) {
  const specs = getSpecializationsForStream(branchId, streamId);
  const spec = specs.find(s => s.id === specId);
  if (!spec) return [];
  return spec.roleIds
    .map(roleId => getRoleById(roleId))
    .filter(Boolean);
}

/**
 * Validates integrity of taxonomy data structures.
 * Verifies that all referenced roleIds exist in ROLES_CATALOG.
 */
export function validateTaxonomy(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  for (const branch of ENGINEERING_TAXONOMY) {
    for (const stream of branch.streams) {
      for (const spec of stream.specializations) {
        for (const roleId of spec.roleIds) {
          if (!ROLES_CATALOG[roleId]) {
            errors.push(`Branch [${branch.id}] stream [${stream.id}] spec [${spec.id}] references unknown role [${roleId}]`);
          }
        }
      }
    }
  }
  return {
    valid: errors.length === 0,
    errors,
  };
}

export const ENGINEERING_BRANCHES = ENGINEERING_TAXONOMY;

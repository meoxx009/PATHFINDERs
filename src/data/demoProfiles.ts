import type { UserCareerProfile } from '../types';

export interface DemoPreset {
  id: string;
  name: string;
  roleBadge: string;
  tagline: string;
  profile: UserCareerProfile;
}

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: 'prd_frontend_beginner',
    name: 'Frontend Developer Student',
    roleBadge: 'Frontend Developer',
    tagline: 'HTML, CSS, JS with 1 basic project • 6 hrs/wk • 14 days',
    profile: {
      targetRole: 'frontend',
      targetRoleTitle: 'Frontend Developer',
      experienceLevel: 'beginner',
      weeklyHours: 6,
      durationDays: 14,
      resumeText: `ALEX CHEN
alex.chen@email.com | github.com/alexchen-dev | linkedin.com/in/alexchen

OBJECTIVE
Motivated Computer Science sophomore seeking a Frontend Developer internship. Passionate about creating responsive, interactive user experiences.

EDUCATION
State University — B.S. in Computer Science (Expected May 2027)
Relevant Coursework: Web Development Fundamentals, Data Structures, Human-Computer Interaction

TECHNICAL SKILLS
Languages: HTML5, CSS3, JavaScript (ES6)
Frameworks/Libraries: React (Basics)
Tools: Git, GitHub, VS Code, Figma

PROJECTS
Interactive Task Tracker Web App | Personal Project
- Built a single-page task management dashboard using HTML5 semantic tags and CSS3 Flexbox.
- Implemented core task manipulation features (add, toggle complete, delete) using vanilla JavaScript DOM manipulation and localStorage for client-side state.
- Styled responsive layouts ensuring usability across mobile and desktop viewport breakpoints.

EXPERIENCE
Student Technology Lab Assistant | University IT Desk (Sep 2024 – Present)
- Assisted 50+ students weekly with campus lab computer logins, basic software troubleshooting, and hardware setup.
- Maintained lab hardware inventory records in Google Sheets.`,
    },
  },
  {
    id: 'data_analyst_intern',
    name: 'Data Analyst Student',
    roleBadge: 'Data Analyst',
    tagline: 'Python, SQL, Pandas & Tableau academic project • 8 hrs/wk • 14 days',
    profile: {
      targetRole: 'data_analyst',
      targetRoleTitle: 'Data Analyst',
      experienceLevel: 'intern',
      weeklyHours: 8,
      durationDays: 14,
      resumeText: `PRIYA SHARMA
priya.sharma@email.com | github.com/priyasharma-data | linkedin.com/in/priya-sharma

SUMMARY
Third-year Data Science student passionate about transforming raw data into business intelligence. Experienced in exploratory data analysis and dashboard storytelling.

EDUCATION
Institute of Technology — B.S. in Data Analytics & Statistics (Expected 2026)
GPA: 3.7/4.0

TECHNICAL SKILLS
Languages: SQL (PostgreSQL, MySQL), Python
Libraries: Pandas, NumPy, Matplotlib, Seaborn
Tools: Tableau Public, Excel (Pivot Tables, XLOOKUP), Jupyter Notebooks, Git

PROJECTS
E-Commerce Customer Retention & Churn Analysis
- Queried relational database containing 45,000+ orders using PostgreSQL JOINs, window functions, and subqueries.
- Conducted exploratory data analysis in Python using Pandas to detect customer drop-off bottlenecks.
- Designed an interactive Tableau dashboard visualizing Cohort Retention, Monthly Recurring Revenue, and churn trends.

UNIVERSITY EXPERIENCE
Math Department Peer Tutor (2024 – Present)
- Conducted weekly tutoring sessions for 20 students in Elementary Statistics and Probability.`,
    },
  },
  {
    id: 'backend_developer_student',
    name: 'Backend Developer Early-Career',
    roleBadge: 'Backend Developer',
    tagline: 'Node.js, Express, MongoDB REST API • 10 hrs/wk • 7 days',
    profile: {
      targetRole: 'backend',
      targetRoleTitle: 'Backend Developer',
      experienceLevel: 'entry_level',
      weeklyHours: 10,
      durationDays: 7,
      resumeText: `JORDAN LEE
jordan.lee@devmail.com | github.com/jordanlee-be | Portfolio: jordanlee.dev

SUMMARY
Recent Software Engineering graduate focusing on reliable backend architectures, RESTful API design, and database systems.

EDUCATION
Metropolitan University — B.S. in Software Engineering (Graduated Dec 2025)

TECHNICAL SKILLS
Languages: JavaScript, TypeScript, Python
Backend: Node.js, Express.js, REST APIs, JSON Web Tokens (JWT)
Databases: MongoDB (Mongoose), PostgreSQL
Tools: Postman, Git, Docker (Basic), Linux

PROJECTS
Campus Book Exchange REST API | Backend Lead
- Engineered a RESTful backend server using Node.js and Express.js supporting authentication, listings, and trade proposals.
- Implemented JWT authentication and bcrypt password hashing for secure user access control.
- Designed Mongoose schemas with indexing for 5,000+ textbook catalog items and user transaction logs.
- Wrote API documentation and test collections in Postman for frontend consumption.`,
    },
  },
];

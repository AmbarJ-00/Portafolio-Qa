export const en = {
  nav: {
    home: "Home",
    projects: "Projects",
    skills: "Skills",
    documentation: "QA Documentation",
    certifications: "Certifications",
    about: "About Me",
    contact: "Contact"
  },
  personal: {
    role: "Lead QA Engineer & Quality Advocate",
    tagline: "Ensuring software excellence through rigorous testing methodologies, automation, and proactive risk analysis.",
    availability_status: "Available for Relocation / Remote",
    work_mode_status: "Hybrid / Remote Full-time"
  },
  cta: {
    view_projects: "View Projects",
    view_docs: "View Documentation",
    send_message: "Send Message",
    sending: "Sending...",
    view_details: "Project Details",
    back_to_projects: "Back to Projects",
    visit_demo: "Live Demo",
    visit_repo: "Repository",
    close: "Close",
    copy_template: "Copy Template",
    template_copied: "Copied successfully"
  },
  home: {
    hero_title: "Hi, I am",
    hero_badge: "QA & Quality Control Specialist",
    philosophy_title: "My Quality Philosophy",
    philosophy_desc: "Quality is not a phase at the end of development; it is a mindset that guides the entire product lifecycle. My goal is to mitigate risks early, optimize test coverage, and guarantee reliable releases.",
    stat_bugs: "Critical Bugs Detected",
    stat_coverage: "Average Test Coverage",
    stat_projects: "Secured Projects",
    highlight_title: "QA Leadership Highlights",
    highlight_desc_1: "Designing end-to-end testing strategies for complex financial and healthcare platforms.",
    highlight_desc_2: "Mentoring development teams on writing high-quality unit and integration tests.",
    highlight_desc_3: "Reducing regression cycle times through intelligent automated test flows."
  },
  projects: {
    title: "QA Engineering Projects",
    subtitle: "Real-world case studies demonstrating risk mitigation, defect analysis, and QA optimization metrics.",
    metrics_title: "Software Quality Metrics",
    improvement: "Production Defect Reduction",
    coverage: "Code/Path Coverage",
    risk_coverage: "Risk Coverage",
    critical_findings: "Critical Findings",
    bugs_resolved: "Validated Defects",
    ambiguities: "Requirements Ambiguities Resolved",
    quality_impact: "Quality Impact",
    
    ecommerce: {
      title: "Multi-channel E-commerce Automation",
      description: "End-to-end automated regression testing suite for a commercial storefront with a complex payment gateway. Focused on critical checkouts and visual regression.",
      strategy_summary: "Hybrid strategy utilizing Playwright UI tests integrated into a CI/CD pipeline. Simulated high latency and backend API failures to verify system resilience.",
      risks: "1. Transaction package loss over high-latency networks.\n2. Cart loading failures under concurrent checkout loads.\n3. Safari iOS browser rendering issues.",
      bugs_detailed: "1. Duplicate purchase orders submitted due to double clicks on the 'Pay' button (Fix: Frontend throttling and backend idempotent validations).\n2. Memory leaks during shopping cart rendering (Fix: Event listener cleanup in component unmount)."
    },
    fintech: {
      title: "Fintech Microservices API Validation",
      description: "Comprehensive REST API security and integration testing using Postman & Newman. Focused on data encryption, SQL query optimizations, and DB schema assertions.",
      strategy_summary: "Automated execution of Postman collections checking JSON schemas on every endpoint. Integrates OWASP ZAP dynamic application security testing (DAST) on staging servers.",
      risks: "1. Exposure of Personal Identifiable Information (PII) in HTTP headers.\n2. SQL Injection risks in transaction search endpoints.\n3. API responses exceeding SLA limit of 2.5 seconds.",
      bugs_detailed: "1. Auth tokens leaking in application output logs (Fix: Authorization header masking in loggers).\n2. Precision rounding errors in multi-currency international transfers (Fix: Switched to fixed-point decimal arithmetic)."
    },
    healthcare: {
      title: "Healthcare Mobile App Quality Control",
      description: "Quality assurance for an iOS/Android application managing patient appointments and prescriptions. Highly focused on WCAG accessibility compliance and cross-platform UX consistency.",
      strategy_summary: "Functional testing on physical and simulator devices using Appium. Audits of accessibility screen readers (VoiceOver/TalkBack) and text resizing scaling.",
      risks: "1. Background prescription dosage alarms failing to trigger.\n2. Application crashes when network connection is dropped midway.\n3. Text rendering violations on light mode for visually impaired users.",
      bugs_detailed: "1. Screen reader skipped the critical 'Emergency Call' action button (Fix: Added explicit ARIA labels and unified locator ids).\n2. Infinite loading spinner when returning from sleep without active mobile data (Fix: Implemented timeouts and fallback toast warning)."
    }
  },
  skills: {
    title: "QA Technological Stack",
    subtitle: "Tools and methodologies leveraged to ensure software resilience, security, and exceptional user experience.",
    modal_title: "QA Competence Details",
    details_desc: "Skill Description",
    details_exp: "Years of Experience / Application",
    details_use_cases: "Applied Use Cases",
    details_tools: "Tools & Ecosystem",
    
    postman: {
      desc: "Advanced creation of collections for REST & SOAP APIs, writing pre-request and test assertion scripts, and running automation via Newman CLI.",
      exp: "4+ years designing automated API testing suites in agile environments.",
      use_cases: "OAuth2 authentication flows validation, API contract verification via JSON Schema, and mock server creation for frontend development."
    },
    sql: {
      desc: "Writing complex queries to validate data consistency, executing advanced joins, and performing forensic data analysis in databases.",
      exp: "5 years verifying backend data persistence.",
      use_cases: "Trigger and referential integrity audits, test data subset extraction, and corrupt data injection to test backend error handling."
    },
    dbeaver: {
      desc: "Universal database administration tool used to interface securely with relational and non-relational database management systems.",
      exp: "4 years of intensive daily usage.",
      use_cases: "Visual data-model analysis, exporting queries for auditing reports, and modifying transaction records for state simulation."
    },
    mysql: {
      desc: "Database administration and testing configurations of MySQL engines, indexing audits, and column type alignment verification.",
      exp: "4 years working in LAMP/MERN stack environments.",
      use_cases: "Spinning up local Dockerized MySQL databases for automated test scripts and analyzing slow query logs."
    },
    git: {
      desc: "Distributed version control for code versioning, collaboration, and repository maintenance of automated testing projects.",
      exp: "5 years using GitFlow and GitHub Flow.",
      use_cases: "Resolving complex merge conflicts on automation codebases, managing branch policies, and configuring commit webhooks."
    },
    jira: {
      desc: "Full incident lifecycle management, requirements traceability, and sprint tracking.",
      exp: "5 years setting up custom QA workflows on agile boards.",
      use_cases: "Writing complex JQL queries to generate quality audits and linking user stories to corresponding defect records."
    },
    azure_devops: {
      desc: "Test plan organization, requirements mapping, and CI/CD pipelines execution in Microsoft architectures.",
      exp: "3 years on enterprise projects.",
      use_cases: "Running manual and automated test suites directly traceable to target deployment builds."
    },
    html: {
      desc: "Semantic DOM layout analysis for writing robust locators and auditing compliance with screen reader guidelines.",
      exp: "5 years in frontend inspection.",
      use_cases: "XPath and CSS selector optimizations to eliminate test flakiness in Playwright and checking structural accessibility tags."
    },
    javascript: {
      desc: "Programming in JavaScript for developing test scripts, environment setup files, and test automation framework architecture.",
      exp: "4 years of writing ES6+ code in Node.js.",
      use_cases: "Developing custom helper functions for test data generation and implementing Page Object Model patterns."
    },
    scrum: {
      desc: "Active collaboration in Agile ceremonies to insert QA objectives into sprint backlogs from the very beginning.",
      exp: "5 years in cross-functional agile teams.",
      use_cases: "Collaborating with Product Owners to specify clear Definition of Done (DoD) and Definition of Ready (DoR) criteria."
    },
    agile: {
      desc: "Adopting Agile values to provide continuous feedback and adapt testing goals to evolving feature scopes.",
      exp: "6 years in fast-paced software projects.",
      use_cases: "Implementing Shift-Left testing methods (early requirement validation and mock-ups analysis)."
    },
    kanban: {
      desc: "Workflow visualization to detect QA bottlenecks and optimize lead times throughout the sprint cycle.",
      exp: "4 years in Kanban environments.",
      use_cases: "Managing Work In Progress (WIP) limits to optimize ticket transition speed between development and testing states."
    },
    jmeter: {
      desc: "Load testing script design and performance auditing for transactional backend endpoints.",
      exp: "3 years of non-functional testing.",
      use_cases: "Simulating 1000 concurrent user sessions on login microservices and computing latency percentiles (p95, p99)."
    },
    owasp_zap: {
      desc: "Security auditing tool for running static and dynamic vulnerability checks against common web security threats.",
      exp: "2 years running black-box security scanning.",
      use_cases: "Automating validation for missing CSP headers and testing input sanitization against Cross-Site Scripting (XSS)."
    },
    zephyr: {
      desc: "Jira plugin used for organizing test cycles, steps execution lists, and traceability metrics tracking.",
      exp: "4 years of daily application.",
      use_cases: "Structuring regression matrices for quarterly releases and exporting status reports for stakeholders."
    },
    xray: {
      desc: "Advanced test management tool integrated into Jira, ideal for teams applying Cucumber Gherkin BDD specifications.",
      exp: "3 years linking manual and automated testing.",
      use_cases: "Mapping automated Cucumber scenarios to user stories and monitoring QA pass ratios in real-time."
    }
  },
  documentation: {
    title: "QA Documentation & Templates",
    subtitle: "Standardized QA artifacts I use to guarantee transparency, thoroughness, and auditability throughout the testing lifecycle.",
    intro_methodologies: "Consistent documentation is critical for effective requirements analysis and quality reporting. Below are the interactive templates I frequently apply in my professional engagements.",
    methodology: "Application Methodology",
    parameters: "Standard Inputs / Structure",
    questions: "Key Requirements Questions",
    copy: "Copy Template",
    copied: "Copied",
    
    testplan: {
      title: "Master Test Plan (MTP)",
      desc: "Outlines the scope, testing strategy, resources, environment specifications, and schedule of planned testing activities. Identifies the modules under test and potential risk vectors.",
      method: "Authored during the software refinement/requirements phase and approved in collaboration with the Product Owner and Lead Architect."
    },
    bugreport: {
      title: "High-Quality Defect Report",
      desc: "A highly structured, reproducible document designed to minimize fix times for developers by providing essential logs, steps, and telemetry.",
      method: "Filed immediately upon finding a bug. Ticket severity and priority are objectively determined by business impact rules."
    },
    reqchecklist: {
      title: "Requirements Refinement Checklist",
      desc: "A Shift-Left audit tool used to analyze user stories before development, ensuring testability, edge case capture, and logical flow.",
      method: "Utilized during sprint planning/refinements to constructively challenge gaps in user stories and prevent late-cycle bugs."
    }
  },
  certifications: {
    title: "Professional Certifications",
    subtitle: "Validated academic and industry achievements supporting my competencies in processes, API testing, and agile management.",
    tools_learned: "Validated Tools",
    integrations_learned: "Quality Integrations",
    
    istqb: {
      title: "ISTQB Certified Tester - Foundation Level (CTFL)",
      desc: "Global validation of core testing principles, test case design techniques (black-box, white-box), and systematic defect lifecycle management."
    },
    postman: {
      title: "Postman API Test Automation Expert",
      desc: "Advanced credential in API testing scripts, automation suites, environments configuration, and continuous monitoring pipelines."
    },
    scrum: {
      title: "Professional Scrum Master I (PSM I)",
      desc: "Scrum framework certification validating knowledge in agile ceremonies facilitation, self-management, and empirical iterative software delivery."
    }
  },
  about: {
    title: "About Me & Quality Philosophy",
    subtitle: "My professional journey and my core principles for shipping stable, high-value digital products.",
    intro_1: "I am a QA Engineer with a passion for process excellence. My role is not simply to break software or report bugs at the end of the line; it's to prevent them from occurring in the first place by collaborating across teams starting at day one.",
    intro_2: "I believe development and QA are partners building bridges, not walls. My technical philosophy centers on writing efficient automated test code, deep-diving database validations, and keeping the end user's experience as the ultimate target.",
    values_title: "My Professional Pillars",
    value_1_title: "Prevention over Detection",
    value_1_desc: "Shift-left testing saves massive project costs. Spotting a logical bug in a prototype or API schema is infinitely cheaper than fixing it after it goes live.",
    value_2_title: "Purpose-driven Automation",
    value_2_desc: "Not everything should be automated. I automate high-risk, repetitive regression cycles so human intelligence can focus on high-impact exploratory testing.",
    value_3_title: "Constructive Communication",
    value_3_desc: "A defect ticket should be objective, clear, and rich in context. This maintains a collaborative, positive relationship with developers."
  },
  contact: {
    title: "Professional Contact",
    subtitle: "Let's connect to discuss collaboration opportunities, QA audits, or technical consulting.",
    form_title: "Send me a Message",
    info_title: "Contact Details",
    country_residence: "Country of Residence",
    email_label: "Professional Email",
    linkedin_label: "Professional LinkedIn",
    work_mode_label: "Preferred Work Mode",
    availability_label: "Availability",
    
    // Form fields
    field_name: "Full Name",
    field_email: "Email Address",
    field_message: "Detailed Message",
    field_query_type: "Query Type",
    field_phone: "Contact Number (Optional)",
    field_alt_contact: "Alternative Contact (Skype/Telegram/etc. Optional)",
    
    query_placeholder: "Select an option",
    query_recruitment: "Recruitment / Hiring",
    query_consulting: "QA Consulting / Audit",
    query_project: "Project Inquiries",
    query_other: "Other Business Matter",
    
    // Validation messages
    val_name_req: "Name is required",
    val_name_min: "Must be at least 3 characters",
    val_email_req: "Email is required",
    val_email_invalid: "Invalid email address",
    val_message_req: "Message is required",
    val_message_min: "Message must be at least 10 characters",
    val_query_req: "Query type is required",
    
    // Feedback
    success_title: "Message Sent Successfully",
    success_desc: "Thank you for reaching out! I will get back to you as soon as possible."
  },
  footer: {
    rights: "All rights reserved.",
    design: "Designed with QA guidelines, WCAG accessibility, and high performance."
  }
};

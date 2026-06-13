/**
 * central portfolio configuration and structured data.
 * All editable technical content is stored here.
 * Localization (text) keys map to translation dictionaries.
 */

export const portfolioConfig = {
  personal: {
    name: "Ambar Ramon",
    roleKey: "personal.role",
    taglineKey: "personal.tagline",
    location: "Republica dominicana, Santo domingo",
    email: "ambarJob007@gmail.com",
    github: "https://github.com/AmbarJ-00",
    linkedin: "https://www.linkedin.com/in/ambarrq/",
    availabilityKey: "personal.availability_status",
    workModeKey: "personal.work_mode_status",
  },
  skills: [
    {
      id: "postman",
      name: "Postman",
      icon: "Layers",
      level: 80,
      category: "API Testing",
      tools: ["Postman CLI", "Newman", "JavaScript", "HTMLextra"],
      translationKey: "skills.postman"
    },
    {
      id: "sql",
      name: "SQL",
      icon: "Database",
      level: 70,
      category: "Database",
      tools: ["DBeaver", "MySQL", "Consultas de datos", "Loki", "Verificacion y sanitizacion de datos"],
      translationKey: "skills.sql"
    },
    {
      id: "dbeaver",
      name: "DBeaver",
      icon: "Server",
      level: 85,
      category: "Database",
      tools: ["multi-conexion a BDs", "Exportacion e importacion de datos", "SQL edicion"],
      translationKey: "skills.dbeaver"
    },
    {
      id: "mysql",
      name: "MySQL",
      icon: "HardDrive",
      level: 90,
      category: "Database",
      tools: ["Vaalidacion de esquemas", "historial de procedimientos", "Indexes"],
      translationKey: "skills.mysql"
    },
    {
      id: "git",
      name: "Git",
      icon: "GitBranch",
      level: 70,
      category: "Version Control",
      tools: ["GitHub", "GitLab", "resolucion de conflictos de ramas"],
      translationKey: "skills.git"
    },
    {
      id: "jira",
      name: "Jira",
      icon: "Trello",
      level: 95,
      category: "Management",
      tools: ["monitoreo SLA", "tableros Kanban/Scrum", "JQL Queries", "Integracion con Xray y Zephyr", "Automatizacion de procesos internos y seguimiento de tickets"],
      translationKey: "skills.jira"
    },
    {
      id: "azure-devops",
      name: "Azure DevOps",
      icon: "Cloud",
      level: 80,
      category: "Management & CI/CD",
      tools: ["Pizarrra de Azure", "Plan de pruebas interno", "queries para busquedas optimizadas", "seguimiento de tareas y trrazabilidad de sprints"],
      translationKey: "skills.azure_devops"
    },
    {
      id: "html",
      name: "HTML5",
      icon: "Code",
      level: 100,
      category: "Frontend Basics",
      tools: ["estructura del DOM"],
      translationKey: "skills.html"
    },
    {
      id: "javascript",
      name: "JavaScript",
      icon: "FileCode",
      level: 85,
      category: "Programming",
      tools: ["ES6+", "Node.js", "Cypress", "Arquitectura", "patrones de diseño"],
      translationKey: "skills.javascript"
    },
    {
      id: "Patrones de diseño",
      name: "Patrones de diseño",
      icon: "Code",
      level: 75,
      category: "Testing",
      tools: ["POM (Page object model)", "Singleton", "Principios SOLID"],
      translationKey: "skills.patrones_de_diseno"
    },
    {
      id: "scrum",
      name: "Scrum",
      icon: "Users",
      level: 95,
      category: "Methodology",
      tools: ["Sprint Planning", "Daily Standups", "Retrospectivas", "Estimacion de Story Point", "Sprint Review"],
      translationKey: "skills.scrum"
    },
    {
      id: "agile",
      name: "Agile",
      icon: "Activity",
      level: 90,
      category: "Methodology",
      tools: ["Continuous Feedback", "Iterative Delivery", "Cross-functional Collaboration"],
      translationKey: "skills.agile"
    },
    {
      id: "kanban",
      name: "Kanban",
      icon: "Columns",
      level: 90,
      category: "Methodology",
      tools: ["WIP Limits", "Lead Time Optimization", "Cycle Time Track"],
      translationKey: "skills.kanban"
    },
    {
      id: "jmeter",
      name: "JMeter",
      icon: "TrendingUp",
      level: 60,
      category: "Performance Testing",
      tools: ["Pruebas de carga", "pruebas de estres", "Thread Groups", "Reportes HTML", "Integracion con loki y grafana", "integracion con grafana", "almacenamiento en contenedores de docker"],
      translationKey: "skills.jmeter"
    },
    {
      id: "owasp-zap",
      name: "OWASP ZAP",
      icon: "ShieldAlert",
      level: 75,
      category: "Security Testing",
      tools: ["Active Scanning", "Passive Scanning", "Spidering", "OWASP Top 10 Validation"],
      translationKey: "skills.owasp_zap"
    },
    {
      id: "zephyr",
      name: "Zephyr",
      icon: "FileCheck",
      level: 90,
      category: "Test Management",
      tools: ["Test Cycles", "Traceability Matrix", "Defect Linkage"],
      translationKey: "skills.zephyr"
    },
    {
      id: "xray",
      name: "Xray",
      icon: "FileSpreadsheet",
      level: 92,
      category: "Test Management",
      tools: ["Cucumber/Gherkin Sync", "Test Repository", "Test Execution Reports"],
      translationKey: "skills.xray"
    }
  ],
  projects: [
    {
      id: "e-commerce-automation",
      titleKey: "projects.ecommerce.title",
      category: "Web Automation & Performance",
      descriptionKey: "projects.ecommerce.description",
      demo: "https://ecommerce-demo.vercel.app",
      repository: "https://github.com/AmbarJ-00/ecommerce-test-automation",
      integrations: ["Playwright", "GitHub Actions", "Allure Reports", "Postman", "Slack Notifications"],
      metrics: {
        coverage: 94,
        improvements: 40,
        riskCoverage: 98,
        findingsCritical: 14,
        bugsResolved: 82,
        ambiguitiesFound: 9,
        qualityImpact: "A+"
      },
      enableMetrics: true, // Enables full metrics display
      translationKey: "projects.ecommerce"
    },
    {
      id: "financial-api-validation",
      titleKey: "projects.fintech.title",
      category: "API Testing & Security",
      descriptionKey: "projects.fintech.description",
      demo: "https://fintech-api-demo.vercel.app",
      repository: "https://github.com/AmbarJ-00/fintech-api-automation",
      integrations: ["Postman", "Newman", "NodeJS", "OWASP ZAP", "DBeaver", "SQL Server"],
      metrics: {
        coverage: 100,
        improvements: 65,
        riskCoverage: 100,
        findingsCritical: 8,
        bugsResolved: 45,
        ambiguitiesFound: 15,
        qualityImpact: "Critical Compliance"
      },
      enableMetrics: true,
      translationKey: "projects.fintech"
    },
    {
      id: "healthcare-mobile-qa",
      titleKey: "projects.healthcare.title",
      category: "Mobile & Accessibility QA",
      descriptionKey: "projects.healthcare.description",
      demo: "https://healthcare-app-demo.vercel.app",
      repository: "https://github.com/AmbarJ-00/healthcare-mobile-qa",
      integrations: ["Appium", "BrowserStack", "Axe Core Accessibility", "Jira", "Xray"],
      metrics: {
        coverage: 88,
        improvements: 25,
        riskCoverage: 95,
        findingsCritical: 22,
        bugsResolved: 110,
        ambiguitiesFound: 21,
        qualityImpact: "FDA Ready"
      },
      enableMetrics: true,
      translationKey: "projects.healthcare"
    }
  ],
  certifications: [
    {
      id: "istqb-ctfl",
      titleKey: "certifications.istqb.title",
      authority: "ISTQB (International Software Testing Qualifications Board)",
      image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=600", // Placeholder for actual certificate style, high res and clean
      tools: ["ISTQB Glossary", "Test Case Design", "Static Analysis", "Defect Management"],
      integrations: ["Standardized QA Terminology", "Waterfall & Agile Test Cycles"],
      translationKey: "certifications.istqb"
    },
    {
      id: "postman-api-expert",
      titleKey: "certifications.postman.title",
      authority: "Postman Academy",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600",
      tools: ["Newman", "API Mocking", "Postman Assertions", "Environment Variables"],
      integrations: ["CI/CD Integration", "Data-driven Testing"],
      translationKey: "certifications.postman"
    },
    {
      id: "scrum-master-psm",
      titleKey: "certifications.scrum.title",
      authority: "Scrum.org",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=600",
      tools: ["Sprint Backlogs", "Burndown Charts", "Retro Templates"],
      integrations: ["Jira Software", "Agile Scaling"],
      translationKey: "certifications.scrum"
    }
  ],
  documentation: {
    methodsKey: "documentation.intro_methodologies",
    templates: [
      {
        id: "doc-test-plan",
        titleKey: "documentation.testplan.title",
        descriptionKey: "documentation.testplan.desc",
        methodologyKey: "documentation.testplan.method",
        parameters: [
          "Scope of Testing",
          "Test Environment",
          "Schedule & Milestones",
          "Pass/Fail Criteria",
          "Suspension/Resumption Rules"
        ],
        questions: [
          "What are the out-of-scope system modules?",
          "Are third-party integrations stable in testing environments?",
          "What are the rollback procedures for release deployments?"
        ]
      },
      {
        id: "doc-bug-report",
        titleKey: "documentation.bugreport.title",
        descriptionKey: "documentation.bugreport.desc",
        methodologyKey: "documentation.bugreport.method",
        parameters: [
          "Steps to Reproduce",
          "Expected Result vs Actual Result",
          "Environment & OS Details",
          "Severity & Priority",
          "Logs/Evidence Attachment"
        ],
        questions: [
          "Is this bug intermittent or 100% reproducible?",
          "Does it affect multiple user roles or a single profile?",
          "Are there console errors or network traces available?"
        ]
      },
      {
        id: "doc-req-checklist",
        titleKey: "documentation.reqchecklist.title",
        descriptionKey: "documentation.reqchecklist.desc",
        methodologyKey: "documentation.reqchecklist.method",
        parameters: [
          "Requirement Uniqueness",
          "Measurability & Testability",
          "Edge Case Scope Identification",
          "Traceability Mapping"
        ],
        questions: [
          "Does this feature include undefined error state views?",
          "What is the system timeout behavior for API failures?",
          "Are data retention rules clearly specified?"
        ]
      }
    ]
  }
};

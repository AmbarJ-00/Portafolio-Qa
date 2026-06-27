export const es = {
  nav: {
    home: "Inicio",
    projects: "Proyectos",
    skills: "Habilidades",
    documentation: "Documentación QA",
    certifications: "Certificaciones",
    about: "Sobre mí",
    contact: "Contacto"
  },
  personal: {
    role: "Analista Qa & Qa Automatizado",
    tagline: "Garantizando la excelencia del software mediante metodologías de pruebas rigurosas, automatización y análisis de riesgos.",
    availability_status: "Disponible para Relocalización / Remoto",
    work_mode_status: "Híbrido / Remoto a tiempo completo"
  },
  cta: {
    view_projects: "Ver Proyectos",
    view_docs: "Ver Documentación",
    send_message: "Enviar Mensaje",
    sending: "Enviando...",
    view_details: "Detalles del Proyecto",
    back_to_projects: "Volver a Proyectos",
    visit_demo: "Ver Demo",
    visit_repo: "Ver Repositorio",
    close: "Cerrar",
    copy_template: "Copiar Plantilla",
    template_copied: "Copia exitosa"
  },
  home: {
    hero_title: "Hola, soy",
    hero_badge: "Especialista en QA & QA Automatizado",
    philosophy_title: "Mi Enfoque de Calidad",
    philosophy_desc: "La calidad no es una fase al final del desarrollo; es una mentalidad que guía todo el ciclo de vida del producto. Mi objetivo es mitigar riesgos de forma temprana, optimizar la cobertura y garantizar lanzamientos confiables.",
    stat_bugs: "Bugs Críticos Detectados",
    stat_coverage: "Cobertura de Pruebas Promedio",
    stat_projects: "Proyectos Aprobados",
    highlight_title: "Actividades de Liderazgo QA",
    highlight_desc_1: "Diseño de estrategias de pruebas de punta a punta para aplicaciones financieras y de salud.",
    highlight_desc_2: "Mentoría de equipos de desarrollo en la escritura de pruebas unitarias y de integración efectivas.",
    highlight_desc_3: "Reducción de tiempos de regresión mediante la automatización inteligente del flujo de pruebas."
  },
  projects: {
    title: "Proyectos Realizados",
    subtitle: "Estos casos de estudio reúnen experiencias reales donde el análisis de fallos, la mitigación de riesgos y la medición de resultados jugaron un papel clave para fortalecer la calidad, reducir incidencias y mejorar la experiencia del usuario.",
    metrics_title: "Métricas de Calidad de Software",
    improvement: "Reducción de Bugs en Produccion",
    coverage: "Cobertura de Código/Rutas",
    risk_coverage: "Cobertura de Riesgos",
    critical_findings: "Hallazgos Críticos",
    bugs_resolved: "Defectos Validados",
    ambiguities: "Ambigüedades de Requerimientos Detectadas",
    quality_impact: "Impacto en Calidad",
    
    ecommerce: {
      title: "Automatización E-commerce Multicanal",
      description: "Suite completa de pruebas de regresión automáticas para un portal de compras con pasarela de pagos compleja. Enfocado en flujos de compra críticos y consistencia visual.",
      strategy_summary: "Estrategia híbrida basada en pruebas de UI con Playwright integradas en el pipeline de CI/CD. Se simularon escenarios con alta latencia y fallos controlados del backend para verificar resiliencia.",
      risks: "1. Pérdida de paquetes de transacciones en la red.\n2. Fallo de carga de carrito de compras bajo concurrencia.\n3. Incompatibilidad de interfaz en navegadores Safari de iOS.",
      bugs_detailed: "1. Duplicación de órdenes de pago debido a doble clic en botón 'Pagar' (Solución: Throttling en cliente y validación idempotente en API).\n2. Fuga de memoria en el renderizado del carrito (Solución: Limpieza de listeners de eventos en desmontaje de componente)."
    },
    fintech: {
      title: "Validación de API de Microservicios Financieros",
      description: "Pruebas exhaustivas de API REST utilizando Postman y Newman, enfocadas en seguridad de transferencia de datos, optimización de queries y validación estricta de esquemas de bases de datos.",
      strategy_summary: "Ejecución automatizada de colecciones de Postman con validaciones de esquemas JSON en cada endpoint. Integración de análisis dinámico de vulnerabilidades web OWASP ZAP en los servidores intermedios.",
      risks: "1. Exposición de datos de identificación personal (PII) en encabezados HTTP.\n2. Inyección SQL mediante parámetros de búsqueda de transacciones.\n3. Respuestas de API lentas superiores a 2.5 segundos.",
      bugs_detailed: "1. Fuga de tokens de autenticación en logs del sistema (Solución: Enmascaramiento de cabeceras de autorización).\n2. Error de redondeo matemático en transferencias internacionales multimonedas (Solución: Cambio a cálculo decimal exacto de precisión fija)."
    },
    healthcare: {
      title: "Control de Calidad en Aplicación Móvil de Salud",
      description: "Pruebas de calidad en aplicación móvil iOS/Android para gestión de citas médicas y recetas. Estricto enfoque en accesibilidad WCAG y consistencia multiplataforma.",
      strategy_summary: "Pruebas funcionales en dispositivos físicos y simuladores mediante Appium. Verificación detallada de lectores de pantalla (VoiceOver/TalkBack) y escalabilidad de texto de interfaz.",
      risks: "1. Fallo al sincronizar alarmas de dosis de medicamentos en segundo plano.\n2. Bloqueo de la app cuando se pierde la conexión a internet de datos móviles.\n3. Texto ilegible para usuarios con visión limitada en modo claro.",
      bugs_detailed: "1. El lector de pantalla omitía el botón crítico de 'Llamada de Emergencia' (Solución: Adición de etiquetas de accesibilidad ARIA e identificadores unificados).\n2. La app entraba en bucle de carga infinito al reanudar de suspensión sin red activa (Solución: Implementación de timeout y aviso amigable)."
    }
  },
  skills: {
    title: "Stack Tecnológico QA",
    subtitle: "Explora cada skill para conocer las herramientas, metodologías y enfoques utilizados en la construcción de software robusto, seguro y centrado en el usuario. Haz clic en cualquier habilidad para ver más detalles.",
    modal_title: "Detalles de Competencia QA",
    details_desc: "Descripción de la Habilidad",
    details_exp: "Años de Experiencia / Aplicación",
    details_use_cases: "Casos de Uso Aplicados",
    details_tools: "Herramientas & Ecosistema",
    
    postman: {
      desc: "Creación de colecciones avanzadas para validación de servicios API REST y SOAP, scripts de pre-solicitud e integraciones Newman.",
      exp: "Más de 4 años diseñando suites automatizadas de API en entornos ágiles.",
      use_cases: "Validación de flujos de pago OAuth2, verificación de contratos de API mediante esquemas JSON y mockeo de dependencias externas para desarrollo."
    },
    sql: {
      desc: "Escritura de consultas complejas para validación de consistencia de datos, uniones avanzadas, y análisis forense de datos en base de datos.",
      exp: "5 años interactuando con bases de datos relacionales en la fase de prueba.",
      use_cases: "Verificación de triggers e integridad referencial, extracción de lotes de prueba, e inyección de escenarios de datos corruptos para pruebas de tolerancia a fallos."
    },
    dbeaver: {
      desc: "Consola de administración universal utilizada para optimizar la interacción con bases de datos relacionales y no relacionales de manera segura.",
      exp: "4 años de uso intensivo.",
      use_cases: "Análisis visual de modelos de datos, exportación de resultados para informes de auditoría QA y simulación de transacciones pendientes."
    },
    mysql: {
      desc: "Administración básica y validaciones específicas de motores de base de datos MySQL, índices y consistencia de tipos de columna.",
      exp: "4 años trabajando en entornos que usan LAMP/MERN stacks.",
      use_cases: "Configuración de bases de datos locales Dockerizadas para pruebas automatizadas y análisis de logs de consultas lentas."
    },
    git: {
      desc: "Control de versiones distribuido para la gestión y colaboración en repositorios de código de automatización.",
      exp: "5 años utilizando flujos como GitFlow y GitHub Flow.",
      use_cases: "Resolución de conflictos en ramas de automatización, configuración de webhooks y disparadores automáticos en CI/CD."
    },
    jira: {
      desc: "Administración integral del ciclo de vida de incidentes, trazabilidad de requerimientos y gestión de sprints.",
      exp: "5 años configurando tableros Kanban/Scrum de control de calidad.",
      use_cases: "Creación de filtros JQL complejos para auditorías de calidad de software y mapeo de historias de usuario con defectos asociados."
    },
    azure_devops: {
      desc: "Manejo de suites de pruebas dentro del ecosistema Microsoft, tableros de requerimientos y despliegues CI/CD pipelines.",
      exp: "3 años en proyectos corporativos a gran escala.",
      use_cases: "Ejecución de planes de pruebas manuales y automatizadas con trazabilidad directa a los commits de desarrollo."
    },
    html: {
      desc: "Análisis semántico del DOM para identificar localizadores robustos en la automatización y asegurar la accesibilidad.",
      exp: "5 años de uso en interacción con interfaces web.",
      use_cases: "Optimización de XPath y selectores CSS para evitar falsos positivos en Playwright/Selenium y auditoría de etiquetas HTML5."
    },
    javascript: {
      desc: "Programación en JS para desarrollo de scripts de prueba, configuraciones de entorno y manipulación de datos en frameworks modernos.",
      exp: "4 años escribiendo código en entornos Node.js.",
      use_cases: "Desarrollo de scripts utilitarios para generación de payloads falsos y estructuración de tests orientados a objetos con Page Object Model (POM)."
    },
    scrum: {
      desc: "Facilitador y participante activo de ceremonias de desarrollo ágil para asegurar la inclusión de criterios QA desde el sprint backlog.",
      exp: "5 años en equipos ágiles multidisciplinarios.",
      use_cases: "Colaboración con Product Owners para la definición clara de Criterios de Aceptación (DoD/DoR) de las tareas."
    },
    agile: {
      desc: "Adopción de valores ágiles para asegurar retroalimentación constante del software y adaptabilidad ante los cambios de requerimientos.",
      exp: "6 años en proyectos de tecnología dinámicos.",
      use_cases: "Implementación de Shift-Left Testing (pruebas tempranas en la etapa de análisis de requerimientos)."
    },
    kanban: {
      desc: "Visualización de flujo de trabajo para detectar cuellos de botella en la fase de revisión y optimizar los tiempos de entrega.",
      exp: "4 años administrando flujos visuales.",
      use_cases: "Ajuste de límites de trabajo en progreso (WIP) para balancear la carga de validación entre desarrolladores y QA."
    },
    patrones_de_diseno: {
      desc: "Uso de patrones de diseño para crear pruebas más robustas, mantenibles y reutilizables en bibliotecas de automatización.",
      exp: "4 años aplicando patrones de arquitectura en suites de testing y automatización.",
      use_cases: "Implementación de Page Object Model y Single Responsibility para reducir el mantenimiento de scripts de prueba."
    },
    jmeter: {
      desc: "Diseño de pruebas de carga concurrentes y análisis de métricas de rendimiento en endpoints transaccionales del servidor.",
      exp: "3 años realizando pruebas no funcionales.",
      use_cases: "Simulación de 1000 usuarios concurrentes en la pasarela de autenticación y cálculo de percentiles de tiempo de respuesta (p95, p99)."
    },
    owasp_zap: {
      desc: "Herramienta de seguridad para análisis estático y dinámico de vulnerabilidades web comunes.",
      exp: "2 años ejecutando pruebas básicas de seguridad de caja negra.",
      use_cases: "Escaneo automatizado de cabeceras de seguridad CSP ausentes y ataques simulados de scripting entre sitios (XSS)."
    },
    zephyr: {
      desc: "Plugin de Jira para estructuración de casos de prueba detallados, pasos de ejecución y métricas de trazabilidad de testing.",
      exp: "4 años de uso diario.",
      use_cases: "Generación de matrices de cobertura para entregas de regresión trimestrales y exportación de reportes de ejecución."
    },
    xray: {
      desc: "Gestor avanzado de pruebas integrado nativamente en Jira, ideal para flujos que usan especificaciones Gherkin BDD.",
      exp: "3 años integrando testing manual y automatizado.",
      use_cases: "Vinculación directa de automatización Cucumber con historias de usuario y reportes de cobertura en tiempo real."
    }
  },
  documentation: {
    title: "Documentación QA & Plantillas",
    subtitle: "Plantillas estandarizadas de artefactos que utilizo para garantizar la coherencia, exhaustividad y transparencia del proceso de pruebas.  A continuación se presentan las estructuras interactivas que utilizo frecuentemente en mis asignaciones profesionales.",
    intro_methodologies: "",
    methodology: "Metodología de Aplicación",
    parameters: "Parámetros Estándar de Entrada",
    questions: "Preguntas de Análisis Clave",
    copy: "Copiar Plantilla",
    copied: "Copiado",
    
    testplan: {
      title: "Plan de Pruebas Maestro (MTP)",
      desc: "Define el alcance, enfoque, recursos y cronograma de las actividades de prueba previstas. Identifica los elementos que se van a probar, las características que se van a probar y los riesgos asociados.",
      method: "Elaborado al inicio del ciclo de vida del software (fase de requerimientos) y aprobado en conjunto con el Product Owner y el Arquitecto de Software."
    },
    bugreport: {
      title: "Reporte de Defectos de Alta Calidad",
      desc: "Un documento detallado y reproducible diseñado para minimizar el tiempo de resolución por parte de desarrollo al proveer toda la información técnica indispensable.",
      method: "Registrado inmediatamente tras detectar un comportamiento inesperado. Se asigna una clasificación objetiva basada en la matriz de severidad e impacto del negocio."
    },
    reqchecklist: {
      title: "Lista de Control para Refinamiento de Requerimientos",
      desc: "Instrumento preventivo (Shift-Left) para auditar historias de usuario antes del inicio de la fase de desarrollo, buscando ambigüedades e inconsistencias de lógica.",
      method: "Utilizado durante las sesiones de refinamiento (Refinement) para desafiar constructivamente las propuestas de negocio y evitar costos de retrabajo en fases posteriores."
    }
  },
  certifications: {
    title: "Certificaciones Profesionales",
    subtitle: "Logros académicos y técnicos validados que respaldan mis competencias en procesos, seguridad y automatización.",
    tools_learned: "Herramientas Validadas",
    integrations_learned: "Integraciones de Calidad",
    
    istqb: {
      title: "ISTQB Certified Tester - Foundation Level (CTFL)",
      desc: "Validación global sobre principios fundamentales del testing, técnicas de diseño de pruebas de caja negra, caja blanca, y gestión sistemática del ciclo de vida del bug."
    },
    postman: {
      title: "Postman API Test Automation Expert",
      desc: "Acreditación avanzada en la creación de scripts de aserción dinámica, flujos de integración continua y optimización de monitoreo de APIs de backend."
    },
    scrum: {
      title: "Professional Scrum Master I (PSM I)",
      desc: "Certificación en el marco de trabajo Scrum, facilitación de ceremonias de desarrollo de software ágil, fomento del autoaprendizaje y el desarrollo iterativo empírico."
    }
  },
  about: {
    title: "Sobre Mí & Enfoque de Calidad",
    subtitle: "Mi historia en el desarrollo de software y mi filosofía para lograr productos estables y exitosos.",
    intro_1: "Soy una QA Engineer apasionada por la excelencia en los procesos. Mi labor va más allá de encontrar fallos al final del camino; me enfoco en evitar que ocurran mediante la colaboración multidisciplinaria desde el primer día.",
    intro_2: "Creo que un buen equipo de desarrollo y un buen equipo de QA trabajan juntos para construir puentes, no barreras. Mi filosofía técnica prioriza el diseño de pruebas automatizadas eficientes, la optimización de bases de datos y la búsqueda constante de mejoras en la experiencia de usuario final.",
    values_title: "Mis Pilares Profesionales",
    value_1_title: "Prevención sobre Detección",
    value_1_desc: "El Shift-Left testing ahorra tiempo y costes significativos. Detectar un fallo en un prototipo o diagrama de flujo de API es infinitamente más barato que corregirlo en producción.",
    value_2_title: "Automatización con Propósito",
    value_2_desc: "No todo debe automatizarse. Automatizo los flujos de regresión repetitivos y de alto riesgo para permitir que el talento humano se enfoque en pruebas exploratorias de alto valor.",
    value_3_title: "Comunicación Asertiva",
    value_3_desc: "El reporte de un defecto debe ser constructivo, objetivo y documentado técnicamente para facilitar la colaboración rápida y amable con el equipo de desarrollo."
  },
  contact: {
    title: "Contacto Profesional",
    subtitle: "Conectemos para discutir oportunidades de colaboración, auditorías de calidad o consultorías técnicas.",
    form_title: "Escríbeme un Mensaje",
    info_title: "Detalles de Contacto",
    country_residence: "País de Residencia",
    email_label: "Correo Electrónico",
    linkedin_label: "LinkedIn Profesional",
    work_mode_label: "Modalidad Preferida",
    availability_label: "Disponibilidad",
    
    // Form fields
    field_name: "Nombre Completo",
    field_email: "Correo Electrónico",
    field_message: "Mensaje detallado",
    field_query_type: "Tipo de Consulta",
    field_phone: "Número de Contacto (Opcional)",
    field_alt_contact: "Contacto Alternativo (Opcional)",
    
    query_placeholder: "Selecciona una opción",
    query_recruitment: "Reclutamiento / Empleo",
    query_consulting: "Consultoría / servicios independientes",
    query_project: "Desarrollo de Proyecto",
    query_other: "Otro asunto profesional",
    
    // Validation messages
    val_name_req: "El nombre es obligatorio",
    val_name_min: "Debe contener al menos 3 caracteres",
    val_email_req: "El correo es obligatorio",
    val_email_invalid: "Dirección de correo inválida",
    val_message_req: "El mensaje es obligatorio",
    val_message_min: "El mensaje debe contener al menos 10 caracteres",
    val_query_req: "El tipo de consulta es obligatorio",
    
    // Feedback
    success_title: "Mensaje Enviado con Éxito",
    success_desc: "Mensaje enviado correctamente. Nos pondremos en contacto contigo pronto.",
    error_desc: "No se pudo enviar el mensaje. Inténtalo nuevamente más tarde."
  },
  footer: {
    rights: "Todos los derechos reservados.",
    design: "Diseñado con criterios de QA, accesibilidad WCAG y alto rendimiento."
  }
};

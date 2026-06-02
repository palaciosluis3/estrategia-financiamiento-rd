// Global state management
let visualHistory = []; // Tracks messages rendered on screen (including banners)
let apiHistory = [];    // Tracks active context sent to the API
let isClearing = false; // Flag to handle confirmation state for clearing chat

// DOM Elements
const chatContainer = document.getElementById('chat-container');
const chatMessages = document.getElementById('chat-messages');
const welcomePanel = document.getElementById('welcome-panel');
const suggestionsGrid = document.getElementById('suggestions-grid');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const sourceSelector = document.getElementById('source-selector');
const clearChatBtn = document.getElementById('clear-chat-btn');
const clearConfirmText = document.getElementById('clear-confirm-text');
const exportHistoryBtn = document.getElementById('export-history-btn');
const scrollAnchor = document.getElementById('scroll-anchor');

// Tab Navigation Elements
const tabHome = document.getElementById('tab-home');
const tabAssistant = document.getElementById('tab-assistant');
const tabMindmap = document.getElementById('tab-mindmap');
const tabNotebook = document.getElementById('tab-notebook');
const homeView = document.getElementById('home-view');
const assistantView = document.getElementById('assistant-view');
const mindmapView = document.getElementById('mindmap-view');
const notebookView = document.getElementById('notebook-view');
const btnStartChat = document.getElementById('btn-start-chat');

// Mind Map DOM Elements
const mindmapChapterSelector = document.getElementById('mindmap-chapter-selector');
const mindmapViewport = document.getElementById('mindmap-viewport');
const mindmapCanvas = document.getElementById('mindmap-canvas');
const mindmapSVG = document.getElementById('mindmap-svg');
const mindmapTreeRoot = document.getElementById('mindmap-tree-root');

// Mind Map Control Buttons
const mindmapZoomOutBtn = document.getElementById('mindmap-zoom-out-btn');
const mindmapZoomInBtn = document.getElementById('mindmap-zoom-in-btn');
const mindmapZoomResetBtn = document.getElementById('mindmap-zoom-reset-btn');
const mindmapZoomIndicator = document.getElementById('mindmap-zoom-indicator');
const mindmapExpandAllBtn = document.getElementById('mindmap-expand-all-btn');
const mindmapCollapseAllBtn = document.getElementById('mindmap-collapse-all-btn');

// Mind Map States & Themes
let parsedMindMapData = null; 
let currentMindMapIndex = 0;   
let mindmapZoomScale = 1.0;     
let isDraggingMindmap = false;
let startDragX = 0;
let startDragY = 0;
let scrollLeftStart = 0;
let scrollTopStart = 0;

const chapterThemes = {
  0: { primary: '#002F6C', bg: '#eff6ff', border: '#bfdbfe', text: '#1e3a8a', line: '#002F6C', lightLine: 'rgba(0, 47, 108, 0.25)' }, // Blue
  1: { primary: '#CE1126', bg: '#fef2f2', border: '#fca5a5', text: '#991b1b', line: '#CE1126', lightLine: 'rgba(206, 17, 38, 0.25)' }, // Red
  2: { primary: '#D4AF37', bg: '#fffbeb', border: '#fde68a', text: '#78350f', line: '#D4AF37', lightLine: 'rgba(212, 175, 55, 0.25)' }, // Gold/Amber
  3: { primary: '#10B981', bg: '#ecfdf5', border: '#a7f3d0', text: '#065f46', line: '#10B981', lightLine: 'rgba(16, 185, 129, 0.25)' }, // Emerald
  4: { primary: '#6366F1', bg: '#e0e7ff', border: '#c7d2fe', text: '#3730a3', line: '#6366F1', lightLine: 'rgba(99, 102, 241, 0.25)' }, // Indigo
  5: { primary: '#14B8A6', bg: '#f0fdfa', border: '#99f6e4', text: '#0f766e', line: '#14B8A6', lightLine: 'rgba(20, 184, 166, 0.25)' }, // Teal
  6: { primary: '#64748B', bg: '#f8fafc', border: '#e2e8f0', text: '#1e293b', line: '#64748B', lightLine: 'rgba(100, 116, 139, 0.25)' }  // Slate
};

// Current application language state
let currentLanguage = 'es';

// Complete dictionary system for ES/EN hot-translation
const translations = {
  es: {
    sidebar_title: "Estrategia de Financiamiento",
    sidebar_subtitle: "República Dominicana",
    nav_label: "Navegación Portal",
    nav_home: "Inicio EFD",
    nav_assistant: "Asistente IA",
    nav_mindmap: "Mapas Conceptuales",
    nav_notebook: "Guía NotebookLM",
    source_label: "Fuente RAG Activa",
    opt_exec: "📋 Resumen Ejecutivo",
    opt_cap1: "📊 Cap. 1: Contexto Económico y Financiero",
    opt_cap2: "📈 Cap. 2: Finanzas Públicas Domésticas",
    opt_cap3: "🏛️ Cap. 3: Finanzas Públicas Internacionales",
    opt_cap4: "💼 Cap. 4: Financiamiento Privado Doméstico",
    opt_cap5: "🌎 Cap. 5: Financiamiento Privado Internacional",
    opt_cap6: "🔧 Cap. 6: Instrumentos Alternativos de Financiamiento",
    opt_cap7: "📋 Cap. 7: Gobernanza, Monitoreo y Evaluación",
    guide_title: "Guía de Operación",
    guide_body: "Este portal es un prototipo y está conectado a la base de conocimientos oficial de la Estrategia de Financiamiento para el Desarrollo de la República Dominicana. Las respuestas del modelo están limitadas estrictamente a los documentos cargados para evitar alucinaciones. El portal usa un LLM básico por estar en etapa de prueba. Si desea hacer consultas más complejas sobre la Estrategia, se recomienda seguir las instrucciones para usar NotebookLM.",
    creator_title: "Creador del Portal",
    creator_role: "Consultor Experto de Naciones Unidas",
    card_btn_consult: "Consultar Capítulo",
    btn_download_pdf: "Descargar PDF Original (Español)",
    btn_clear_chat: "Borrar Conversación",
    btn_clear_confirm: "¿Confirmar?",
    btn_export_chat: "Descargar Conversación",
    app_header_title: "Herramienta de Consulta con Inteligencia Artificial",
    app_header_status: "Conectado (Gemini-3.1-Flash-Lite)",
    app_header_active: "Sistema Activo",
    home_badge: "Documento Oficial",
    home_title: "Estrategia de Financiamiento para el Desarrollo de la República Dominicana",
    home_desc: "La Estrategia de Financiamiento para el Desarrollo (EFD) constituye un documento integrador de amplio espectro temático, que abarca desde las finanzas públicas domésticas hasta los mercados internacionales de capital, pasando por los sistemas de cooperación, los instrumentos de financiamiento alternativo y la arquitectura de gobernanza del propio proceso INFF.",
    home_pillars_title: "Estructura Analítica de la Estrategia",
    home_card1_title: "1. Contexto Económico y Financiero",
    home_card1_desc: "Establece la línea base del entorno macroeconómico, financiero y de riesgos de la nación, ofreciendo un diagnóstico riguroso para sostener políticas de financiamiento.",
    home_card_back_title: "Conceptos Clave",
    home_c1_b1: "Crecimiento económico",
    home_c1_b2: "PIB y estabilidad",
    home_c1_b3: "Mercado laboral",
    home_c1_b4: "Inflación",
    home_c1_b5: "Estrategia de Desarrollo",
    home_c1_b6: "Plan Plurianual",
    home_c1_b7: "Marco Fiscal Mediano Plazo",
    home_c1_b8: "Solvencia financiera",
    home_c1_b9: "Supervisión bancaria",
    home_c1_b10: "Riesgos para el desarrollo",
    home_c1_b11: "Pasivos contingentes",
    home_card2_title: "2. Finanzas Públicas Domésticas",
    home_card2_desc: "Analiza la movilización y asignación de recursos públicos internos para elevar la eficiencia del gasto público y la integridad de la recaudación fiscal.",
    home_c2_b1: "Marco Gasto Mediano Plazo",
    home_c2_b2: "Ingresos tributarios",
    home_c2_b3: "Presión tributaria",
    home_c2_b4: "Exenciones y Gasto fiscal",
    home_c2_b5: "Espacio fiscal",
    home_c2_b6: "Pacto Fiscal",
    home_c2_b7: "Responsabilidad Fiscal",
    home_c2_b8: "Déficit cuasi-fiscal eléctrico",
    home_c2_b9: "Inversión SNIP",
    home_c2_b10: "Flujos Ilícitos (FFI)",
    home_c2_b11: "Evasión y BEPS / QDMTT",
    home_card3_title: "3. Finanzas Públicas Internacionales",
    home_card3_desc: "Direcciona estratégicamente los recursos externos, la ayuda oficial y los fondos climáticos en mecanismos catalizadores de resiliencia y resguardo ambiental.",
    home_c3_b1: "SINACID y gobernanza",
    home_c3_b2: "Ayuda Oficial al Desarrollo",
    home_c3_b3: "Cooperación reembolsable",
    home_c3_b4: "Financiamiento mixto",
    home_c3_b5: "Cooperación Sur-Sur / CSSyT",
    home_c3_b6: "Oferta Dominicana",
    home_c3_b7: "Principios de Kampala y Busan",
    home_c3_b8: "Financiamiento Climático",
    home_c3_b9: "NDC y Taxonomía Verde",
    home_c3_b10: "Bonos Soberanos Temáticos",
    home_card4_title: "4. Financiamiento Privado Doméstico",
    home_card4_desc: "Traza estrategias para movilizar el ahorro nacional, banca comercial y capitales previsionales hacia el sector productivo y obras sostenibles.",
    home_c4_b1: "Competitividad MIPYMES",
    home_c4_b2: "Inclusión financiera",
    home_c4_b3: "Bancarización y Factoring",
    home_c4_b4: "Burocracia Cero",
    home_c4_b5: "Profundización financiera",
    home_c4_b6: "Mercado de valores local",
    home_c4_b7: "Fondos previsionales y pensiones",
    home_c4_b8: "Fideicomisos públicos",
    home_c4_b9: "Alianzas Público-Privadas (APP)",
    home_c4_b10: "Inversión de impacto y ESG",
    home_c4_b11: "Taxonomía Verde local",
    home_card5_title: "5. Financiamiento Privado Internacional",
    home_card5_desc: "Direcciona la inversión extranjera directa, créditos comerciales y remesas de la diáspora hacia el encadenamiento productivo y tecnológico nacional.",
    home_c5_b1: "Inversión Extranjera Directa (IED)",
    home_c5_b2: "Encadenamiento productivo",
    home_c5_b3: "Nearshoring y tecnología",
    home_c5_b4: "Pilar Dos OCDE / QDMTT",
    home_c5_b5: "Trade finance y exportaciones",
    home_c5_b6: "Ventanilla Única (VUCE)",
    home_c5_b7: "Finanzas de la diáspora",
    home_c5_b8: "Remesas e inclusión familiar",
    home_c5_b9: "Inversión de impacto global",
    home_c5_b10: "Estándares ESG (ISSB / GRI)",
    home_card6_title: "6. Instrumentos Alternativos",
    home_card6_desc: "Diversifica los recursos del Estado con mecanismos innovadores no tradicionales (bonos azules, catastróficos y canjes de deuda por naturaleza) respaldados por la CEPAL ante choques externos.",
    home_card7_title: "7. Gobernanza, Monitoreo y Evaluación de la EFD",
    home_card7_desc: "Estructura el marco institucional, las instancias de coordinación política intersectorial (público-privada) y los sistemas de seguimiento financiero requeridos para monitorear, evaluar y retroalimentar de manera continua la ejecución de toda la estrategia, garantizando transparencia y rendición de cuentas sistemática.",
    home_kpi_title: "Contexto Macroeconómico",
    home_kpi_subtitle: "Panorama macroeconómico 2025 - foto rápida",
    home_kpi_pib_title: "PIB",
    home_kpi_pib_desc: "Crecimiento real 2025",
    home_kpi_unemp_title: "Desempleo Fija",
    home_kpi_unemp_desc: "Diciembre 2025",
    home_kpi_inf_title: "Inflación",
    home_kpi_inf_desc: "Diciembre 2025",
    home_kpi_tpm_title: "Tasa de Política Monetaria (TPM)",
    home_kpi_tpm_desc: "Diciembre 2025",
    home_cta_title: "Asistente RAG con IA Oficial Integrado",
    home_cta_desc: "Consulte de forma interactiva cualquier capítulo, artículo o recomendación técnica oficial sin riesgo de alucinaciones usando el motor inteligente Gemini 3.1 Flash-Lite.",
    home_cta_btn: "Abrir Asistente IA",
    assistant_welcome_title: "Asistente Técnico de la Estrategia",
    assistant_welcome_desc: "Realice consultas sobre los diagnósticos, cuellos de botella y recomendaciones técnicas oficiales de la Estrategia de Financiamiento para el Desarrollo.",
    assistant_input_placeholder: "Pregunte acerca de la Estrategia de Financiamiento para el Desarrollo...",
    assistant_badge_engine: "Gemini 3.1 Flash-Lite Engine",
    assistant_badge_rag: "Búsqueda RAG Integrada",
    assistant_badge_lock: "Protección de API Key Servidor",
    mindmap_active_label: "Mapa Activo:",
    mindmap_opt_cap1: "📊 Cap. 1: Contexto Económico y Financiero",
    mindmap_opt_cap2: "📈 Cap. 2: Finanzas Públicas Domésticas",
    mindmap_opt_cap3: "🏛️ Cap. 3: Finanzas Públicas Internacionales",
    mindmap_opt_cap4: "💼 Cap. 4: Financiamiento Privado Doméstico",
    mindmap_opt_cap5: "🌎 Cap. 5: Financiamiento Privado Internacional",
    mindmap_opt_cap6: "🔧 Cap. 6: Instrumentos Alternativos",
    mindmap_opt_cap7: "📋 Cap. 7: Gobernanza y Monitoreo",
    mindmap_expand_all: "Expandir Todo",
    mindmap_collapse_all: "Colapsar Todo",
    notebook_badge: "Recurso de Revisión Avanzada",
    notebook_title: "NotebookLM como Asistente de Consulta",
    notebook_desc: "Como recurso complementario al estudio de la Estrategia de Financiamiento para el Desarrollo (EFD), recomendamos el uso de <strong>Google NotebookLM</strong>. Esta herramienta de inteligencia artificial gratuita permite cargar documentos completos y realizar consultas avanzadas en lenguaje natural sobre toda la base de conocimientos sin limitaciones.",
    notebook_guide_title: "Guía Paso a Paso para el Usuario",
    notebook_step1_title: "Acceso a la plataforma",
    notebook_step1_desc: "Ingrese a <a href=\"https://notebooklm.google.com\" target=\"_blank\" class=\"text-dominican-blue font-bold hover:underline\">notebooklm.google.com</a> desde cualquier navegador. La herramienta es totalmente gratuita y no requiere instalación alguna.",
    notebook_step2_title: "Inicio de sesión",
    notebook_step2_desc: "Inicie sesión utilizando su cuenta de Google (Gmail). Si no dispone de una cuenta, puede registrarse de forma gratuita y rápida en la plataforma de Google.",
    notebook_step3_title: "Crear Nuevo Cuaderno",
    notebook_step3_desc: "En la consola principal, presione el botón <strong>\"+ Nuevo cuaderno\"</strong> (o \"+ New notebook\" si se encuentra en inglés) para inicializar su entorno de consulta interactivo.",
    notebook_step4_title: "Cargar Archivos Markdown",
    notebook_step4_desc: "Haga clic en \"Agregar fuentes\" y arrastre todos los archivos Markdown de la estrategia (los cuales puede descargar en el botón inferior). Estos archivos están en Español. NotebookLM es plenamente capaz de procesar y responder consultas en inglés a partir de fuentes en español. Cada archivo soporta hasta 500,000 palabras.",
    notebook_step5_title: "Interactuar y Preguntar",
    notebook_step5_desc: "Escriba consultas en lenguaje natural en el chat. NotebookLM responderá usando exclusivamente las fuentes de la EFD, citando exactamente las secciones y capítulos consultados.",
    notebook_step6_title: "Filtros de Fuentes Activas",
    notebook_step6_desc: "Seleccione de manera manual cuáles capítulos o documentos específicos desea tener activos en el panel lateral para focalizar o elevar la precisión de sus búsquedas avanzadas.",
    notebook_faq_title: "Preguntas Recomendadas para NotebookLM",
    notebook_faq_item1: "¿Cuáles son las principales recomendaciones en materia de financiamiento verde y taxonomía nacional?",
    notebook_faq_item2: "¿Qué instituciones del sector público dominicano participan activamente en la gestión de la cooperación?",
    notebook_faq_item3: "¿Qué se entiende por estructuras de financiamiento mixto (blended finance) y qué rol tienen las APP?",
    notebook_faq_item4: "¿Cómo interactúa la baja presión tributaria con los retos de evasión y subsidio eléctrico en República Dominicana?",
    notebook_warn_title: "Aviso Importante",
    notebook_warn_desc: "NotebookLM es un recurso complementario y no sustituye el estudio directo del documento oficial. Se recomienda verificar los datos críticos y tablas en el PDF consolidado (el cual está disponible únicamente en Español).",
    notebook_warn_btn: "Ir a NotebookLM",
    notebook_zip_title: "Descargar Base de Conocimientos EFD en Markdown (Español)",
    notebook_zip_desc: "Obtenga un paquete ZIP que contiene todos los capítulos oficiales en formato Markdown. Este archivo está en Español y optimizado para ser subido directamente a su cuaderno en Google NotebookLM. Tenga en cuenta que NotebookLM es plenamente capaz de procesar y responder consultas en inglés a partir de fuentes en español.",
    notebook_zip_btn: "Descargar Capítulos (ZIP)"
  },
  en: {
    sidebar_title: "Financing Strategy",
    sidebar_subtitle: "Dominican Republic",
    nav_label: "Portal Navigation",
    nav_home: "DFS Home",
    nav_assistant: "AI Assistant",
    nav_mindmap: "Mind Maps",
    nav_notebook: "NotebookLM Guide",
    source_label: "Active RAG Source",
    opt_exec: "📋 Executive Summary",
    opt_cap1: "📊 Cap. 1: Economic & Financial Context",
    opt_cap2: "📈 Cap. 2: Domestic Public Finance",
    opt_cap3: "🏛️ Cap. 3: International Public Finance",
    opt_cap4: "💼 Cap. 4: Domestic Private Finance",
    opt_cap5: "🌎 Cap. 5: International Private Finance",
    opt_cap6: "🔧 Cap. 6: Alternative Financing Instruments",
    opt_cap7: "📋 Cap. 7: Governance, Monitoring & Evaluation",
    guide_title: "Operation Guide",
    guide_body: "This portal is a prototype and is connected to the official knowledge base of the Development Financing Strategy of the Dominican Republic. Model answers are strictly limited to the loaded documents to prevent hallucinations. The portal uses a basic LLM as it is in the testing phase. If you wish to make more complex queries about the Strategy, it is recommended to follow the instructions for using NotebookLM.",
    creator_title: "Portal Creator",
    creator_role: "United Nations Expert Consultant",
    card_btn_consult: "Query Chapter",
    btn_download_pdf: "Download Original PDF (In Spanish)",
    btn_clear_chat: "Clear Conversation",
    btn_clear_confirm: "Confirm?",
    btn_export_chat: "Download Conversation",
    app_header_title: "AI Consultation Tool",
    app_header_status: "Connected (Gemini-3.1-Flash-Lite)",
    app_header_active: "System Active",
    home_badge: "Official Document",
    home_title: "Development Financing Strategy of the Dominican Republic",
    home_desc: "The Development Financing Strategy (DFS) constitutes an integrating document of a broad thematic spectrum, which ranges from domestic public finances to international capital markets, through cooperation systems, alternative financing instruments and the governance architecture of the INFF process itself.",
    home_pillars_title: "Analytical Structure of the Strategy",
    home_card1_title: "1. Economic and Financial Context",
    home_card1_desc: "Establishes the baseline of the nation's macroeconomic, financial, and risk environment, offering a rigorous diagnosis to sustain financing policies.",
    home_card_back_title: "Key Concepts",
    home_c1_b1: "Economic growth",
    home_c1_b2: "GDP and stability",
    home_c1_b3: "Labor market",
    home_c1_b4: "Inflation",
    home_c1_b5: "Development Strategy",
    home_c1_b6: "Pluriannual Plan",
    home_c1_b7: "Medium-Term Fiscal Framework",
    home_c1_b8: "Financial solvency",
    home_c1_b9: "Banking supervision",
    home_c1_b10: "Development risks",
    home_c1_b11: "Contingent liabilities",
    home_card2_title: "2. Domestic Public Finance",
    home_card2_desc: "Analyzes the mobilization and allocation of domestic public resources to raise public spending efficiency and tax collection integrity.",
    home_c2_b1: "Medium-Term Expenditure Framework",
    home_c2_b2: "Tax revenues",
    home_c2_b3: "Tax pressure",
    home_c2_b4: "Exemptions & Tax expenditure",
    home_c2_b5: "Fiscal space",
    home_c2_b6: "Fiscal Pact",
    home_c2_b7: "Fiscal Responsibility",
    home_c2_b8: "Quasi-fiscal electricity deficit",
    home_c2_b9: "SNIP Investment",
    home_c2_b10: "Illicit Flows (IFF)",
    home_c2_b11: "Evasion & BEPS / QDMTT",
    home_card3_title: "3. International Public Finance",
    home_card3_desc: "Strategically directs external resources, official aid, and climate funds into catalyst mechanisms for resilience and environmental protection.",
    home_c3_b1: "SINACID and governance",
    home_c3_b2: "Official Development Assistance",
    home_c3_b3: "Reimbursable cooperation",
    home_c3_b4: "Blended finance",
    home_c3_b5: "South-South Cooperation / CSSyT",
    home_c3_b6: "Dominican Offer",
    home_c3_b7: "Kampala and Busan Principles",
    home_c3_b8: "Climate Financing",
    home_c3_b9: "NDC & Green Taxonomy",
    home_c3_b10: "Thematic Sovereign Bonds",
    home_card4_title: "4. Domestic Private Finance",
    home_card4_desc: "Lays out strategies to mobilize national savings, commercial banking, and pension capitals towards the productive sector and sustainable works.",
    home_c4_b1: "MSME Competitiveness",
    home_c4_b2: "Financial inclusion",
    home_c4_b3: "Banking access & Factoring",
    home_c4_b4: "Zero Bureaucracy",
    home_c4_b5: "Financial deepening",
    home_c4_b6: "Local stock market",
    home_c4_b7: "Pension funds",
    home_c4_b8: "Public trusts",
    home_c4_b9: "Public-Private Partnerships (PPP)",
    home_c4_b10: "Impact investment & ESG",
    home_c4_b11: "Local Green Taxonomy",
    home_card5_title: "5. International Private Finance",
    home_card5_desc: "Directs foreign direct investment, commercial credits, and diaspora remittances towards the national productive and technological linkages.",
    home_c5_b1: "Foreign Direct Investment (FDI)",
    home_c5_b2: "Productive linkages",
    home_c5_b3: "Nearshoring & technology",
    home_c5_b4: "OECD Pillar Two / QDMTT",
    home_c5_b5: "Trade finance & exports",
    home_c5_b6: "Single Window (VUCE)",
    home_c5_b7: "Diaspora finance",
    home_c5_b8: "Remittances & family inclusion",
    home_c5_b9: "Global impact investment",
    home_c5_b10: "ESG Standards (ISSB / GRI)",
    home_card6_title: "6. Alternative Instruments",
    home_card6_desc: "Diversifies State resources with innovative non-traditional mechanisms (blue, catastrophic bonds, and debt-for-nature swaps) backed by ECLAC against external shocks.",
    home_card7_title: "7. DFS Governance, Monitoring & Evaluation",
    home_card7_desc: "Structures the institutional framework, intersectoral coordination instances (public-private), and financial monitoring systems required to track, evaluate, and feed back the strategy continuously, guaranteeing transparency and systematic accountability.",
    home_kpi_title: "Macroeconomic Context",
    home_kpi_subtitle: "2025 Macroeconomic Outlook - Quick Snapshot",
    home_kpi_pib_title: "GDP",
    home_kpi_pib_desc: "2025 Real Growth",
    home_kpi_unemp_title: "Unemployment Rate",
    home_kpi_unemp_desc: "December 2025",
    home_kpi_inf_title: "Inflation",
    home_kpi_inf_desc: "December 2025",
    home_kpi_tpm_title: "Monetary Policy Rate (TPM)",
    home_kpi_tpm_desc: "December 2025",
    home_cta_title: "Official Integrated AI RAG Assistant",
    home_cta_desc: "Interactively query any official chapter, article, or technical recommendation without risk of hallucinations using the Gemini 3.1 Flash-Lite intelligent engine.",
    home_cta_btn: "Open AI Assistant",
    assistant_welcome_title: "Technical Assistant of the Strategy",
    assistant_welcome_desc: "Perform queries on the official diagnostics, bottlenecks, and technical recommendations of the Development Financing Strategy.",
    assistant_input_placeholder: "Ask about the Development Financing Strategy...",
    assistant_badge_engine: "Gemini 3.1 Flash-Lite Engine",
    assistant_badge_rag: "Integrated RAG Search",
    assistant_badge_lock: "Server API Key Protection",
    mindmap_active_label: "Active Map:",
    mindmap_opt_cap1: "📊 Cap. 1: Economic & Financial Context",
    mindmap_opt_cap2: "📈 Cap. 2: Domestic Public Finance",
    mindmap_opt_cap3: "🏛️ Cap. 3: International Public Finance",
    mindmap_opt_cap4: "💼 Cap. 4: Domestic Private Finance",
    mindmap_opt_cap5: "🌎 Cap. 5: International Private Finance",
    mindmap_opt_cap6: "🔧 Cap. 6: Alternative Instruments",
    mindmap_opt_cap7: "📋 Cap. 7: Governance & Monitoring",
    mindmap_expand_all: "Expand All",
    mindmap_collapse_all: "Collapse All",
    notebook_badge: "Advanced Review Resource",
    notebook_title: "NotebookLM as a Consultation Assistant",
    notebook_desc: "As a complementary resource for studying the Development Financing Strategy (DFS), we recommend using <strong>Google NotebookLM</strong>. This free AI tool allows you to upload entire documents and perform advanced queries in natural language across the entire knowledge base without limitations.",
    notebook_guide_title: "Step-by-Step Guide for the User",
    notebook_step1_title: "Access to the platform",
    notebook_step1_desc: "Go to <a href=\"https://notebooklm.google.com\" target=\"_blank\" class=\"text-dominican-blue font-bold hover:underline\">notebooklm.google.com</a> from any browser. The tool is completely free and requires no installation.",
    notebook_step2_title: "Sign in",
    notebook_step2_desc: "Sign in using your Google account (Gmail). If you do not have an account, you can register for free and quickly on the Google platform.",
    notebook_step3_title: "Create New Notebook",
    notebook_step3_desc: "On the main console, press the <strong>\"+ New notebook\"</strong> button (or \"+ Nuevo cuaderno\" if in Spanish) to initialize your interactive query environment.",
    notebook_step4_title: "Upload Markdown Files",
    notebook_step4_desc: "Click on \"Add sources\" and drag all the Strategy's Markdown files (which you can download from the button below). These files are in Spanish. NotebookLM is fully capable of processing and answering queries in English from sources in Spanish. Each file supports up to 500,000 words.",
    notebook_step5_title: "Interact and Ask",
    notebook_step5_desc: "Type queries in natural language in the chat. NotebookLM will respond using exclusively the DFS sources, citing exactly the sections and chapters consulted.",
    notebook_step6_title: "Active Source Filters",
    notebook_step6_desc: "Manually select which chapters or specific documents you want to keep active in the side panel to focus or raise the accuracy of your advanced searches.",
    notebook_faq_title: "Recommended Questions for NotebookLM",
    notebook_faq_item1: "What are the main recommendations regarding green financing and national taxonomy?",
    notebook_faq_item2: "Which Dominican public sector institutions actively participate in cooperation management?",
    notebook_faq_item3: "What is meant by blended finance structures and what role do PPPs play?",
    notebook_faq_item4: "How does the low tax pressure interact with evasion challenges and the electricity subsidy in the Dominican Republic?",
    notebook_warn_title: "Important Notice",
    notebook_warn_desc: "NotebookLM is a complementary resource and does not replace direct study of the official document. It is recommended to verify critical data and tables in the consolidated PDF (which is only available in Spanish).",
    notebook_warn_btn: "Go to NotebookLM",
    notebook_zip_title: "Download DFS Knowledge Base in Markdown (In Spanish)",
    notebook_zip_desc: "Get a ZIP package containing all official chapters in Markdown format. This archive is in Spanish and optimized to be uploaded directly to your Google NotebookLM notebook. Note that NotebookLM is fully capable of processing and answering queries in English from sources in Spanish.",
    notebook_zip_btn: "Download Chapters (ZIP)"
  }
};

// Strategic Questions mapping by Document Source in English
const suggestionsBySourceEN = {
  "all": [
    {
      title: "Fiscal Pact Challenges",
      desc: "Political barriers and urgency of raising the historically low tax burden.",
      text: "What are the political and social barriers that have delayed the achievement of a Fiscal Pact, and why is it urgent to raise the historically low tax pressure?",
      icon: "file-text",
      colorClass: "text-dominican-blue"
    },
    {
      title: "Green Financing",
      desc: "Dominican Green Taxonomy and the issuance of thematic sovereign bonds.",
      text: "What instruments make up the architecture of Dominican green financing (such as the Green Taxonomy and the issuance of thematic sovereign bonds) and what regulatory frameworks are still needed, such as the General Law on Climate Change?",
      icon: "leaf",
      colorClass: "text-emerald-600"
    },
    {
      title: "Pension Investment",
      desc: "Channeling the vast pension savings into productive and corporate projects.",
      text: "What regulatory and market restrictions currently limit the channeling of the vast savings of pension funds into productive and long-term corporate projects?",
      icon: "vault",
      colorClass: "text-dominican-blue"
    },
    {
      title: "FDI Reforms",
      desc: "Use of Performance Agreements to condition investment benefits.",
      text: "Why is it necessary to modify the investment incentives regime for Foreign Direct Investment (FDI), moving towards Performance Agreements that condition benefits on technology transfer and the creation of productive linkages?",
      icon: "globe",
      colorClass: "text-dominican-blue"
    }
  ],
  "Estrategia de financiamiento de Republica Dominicana - Resumen Ejecutivo.md": [
    {
      title: "Tax Burden and Evasion",
      desc: "Analysis of the structural fiscal challenges of the Dominican Republic and the electricity sector.",
      text: "How does the historically low tax burden interact with structural challenges such as tax evasion and the electricity sector deficit, limiting the State's capacity for action?",
      icon: "trending-down",
      colorClass: "text-dominican-blue"
    },
    {
      title: "International Cooperation",
      desc: "The registration of international official aid in the National Budget.",
      text: "What deficiencies exist in the current operational integration of international cooperation, considering that only 29% of aid to the public sector is registered in the National Budget?",
      icon: "globe",
      colorClass: "text-dominican-blue"
    },
    {
      title: "Private Financing",
      desc: "Diversification of the capital market and flexibilization of pension funds.",
      text: "Why does the domestic private sector urgently require the diversification of capital markets and the flexibilization of pension fund limits to finance their long-term productivity?",
      icon: "wallet",
      colorClass: "text-dominican-blue"
    },
    {
      title: "Foreign Direct Investment",
      desc: "Fiscal strategies (like the IMCD) to transform FDI into full integration.",
      text: "In what way can Foreign Direct Investment (FDI) be transformed from an 'enclave' model towards a full integration model, and what fiscal strategies (such as the IMCD) are proposed to achieve this?",
      icon: "building-2",
      colorClass: "text-dominican-blue"
    }
  ],
  "Estrategia de financiamiento de Republica Dominicana - Capítulo 1.md": [
    {
      title: "Growth and Reforms",
      desc: "Macroeconomic and historical drivers of Dominican stability.",
      text: "What have been the main drivers and structural reforms that have allowed the Dominican Republic to maintain constant economic growth and controlled inflation in recent decades?",
      icon: "activity",
      colorClass: "text-dominican-blue"
    },
    {
      title: "Target DR 2036 Plan",
      desc: "Second-generation reforms needed to double real GDP.",
      text: "How is the Target DR 2036 Plan designed and what are the second-generation reforms necessary to double the country's real GDP?",
      icon: "award",
      colorClass: "text-dominican-blue"
    },
    {
      title: "Liquidity Facilities",
      desc: "The impact of the Central Bank on the resilience and capitalization of the financial sector.",
      text: "In what way have the liquidity facilities provided by the Central Bank contributed to maintaining the resilience and capitalization of the domestic financial sector?",
      icon: "landmark",
      colorClass: "text-dominican-blue"
    },
    {
      title: "Risk Blocks",
      desc: "The 14 main external, climate, and internal threats to financing.",
      text: "What are the 14 main risk blocks (including external shocks, climate vulnerability, and electricity sector deficit) that threaten financing for development in the country?",
      icon: "alert-triangle",
      colorClass: "text-dominican-red"
    }
  ],
  "Estrategia de financiamiento de Republica Dominicana - Capítulo 2.md": [
    {
      title: "Fiscal Pact Challenges",
      desc: "Political and social barriers to raising tax revenue.",
      text: "What are the political and social barriers that have delayed the achievement of a Fiscal Pact, and why is it urgent to raise the historically low tax pressure?",
      icon: "file-text",
      colorClass: "text-dominican-blue"
    },
    {
      title: "Expenditure and Exemptions",
      desc: "The impact of Tax Expenditure and recommended measures for rationalization.",
      text: "In what way does the high volume of Tax Expenditure (tax exemptions) compromise State revenues and what measures are recommended for their rationalization?",
      icon: "scissors",
      colorClass: "text-dominican-blue"
    },
    {
      title: "Policy Priorities (IPP)",
      desc: "Inference methodology to detect public expenditure bottlenecks.",
      text: "What does the Policy Priorities Inference (PPI) methodology reveal about public expenditure efficiency, and how does it help identify bottlenecks in strategic sectors?",
      icon: "bar-chart-2",
      colorClass: "text-dominican-blue"
    },
    {
      title: "Evasion and Minimum Tax",
      desc: "Electronic invoicing and implementation of Pillar Two (Global Minimum Tax).",
      text: "How can internal and transnational tax evasion be combated through the technological integration of databases, electronic invoicing, and the implementation of the Global Minimum Tax (Pillar Two)?",
      icon: "shield-check",
      colorClass: "text-emerald-600"
    }
  ],
  "Estrategia de financiamiento de Republica Dominicana - Capítulo 3.md": [
    {
      title: "Evolution of ODA",
      desc: "Transition from grants to concessional loans from multilateral banks.",
      text: "How has the profile of Official Development Assistance (ODA) evolved in the country, especially in the transition from grants to concessional loans from multilateral banking?",
      icon: "line-chart",
      colorClass: "text-dominican-blue"
    },
    {
      title: "SINACID Weaknesses",
      desc: "Operational fragmentation between reimbursable and non-reimbursable cooperation.",
      text: "What weaknesses does the National System of International Cooperation (SINACID) present in the face of fragmentation between reimbursable and non-reimbursable cooperation?",
      icon: "git-branch",
      colorClass: "text-dominican-blue"
    },
    {
      title: "Blended Finance",
      desc: "How to use limited donations to structure pre-investment studies.",
      text: "How can the Dominican Republic take advantage of the blended finance scheme to transform limited grants into pre-investment studies that make large projects bankable?",
      icon: "combine",
      colorClass: "text-dominican-blue"
    },
    {
      title: "Green Financing",
      desc: "Green Taxonomy, thematic bonds, and the General Climate Change Law.",
      text: "What instruments make up the architecture of Dominican green financing (such as the Green Taxonomy and the issuance of thematic sovereign bonds) and what regulatory frameworks are still needed, such as the General Law on Climate Change?",
      icon: "leaf",
      colorClass: "text-emerald-600"
    }
  ],
  "Estrategia de financiamiento de Republica Dominicana - Capítulo 4.md": [
    {
      title: "MSMEs and Informality",
      desc: "Exclusion from commercial credit due to structural barriers of informality.",
      text: "Why does the high rate of informality in Dominican MSMEs act as a structural barrier that excludes them from commercial credit and condemns them to low-productivity markets?",
      icon: "store",
      colorClass: "text-dominican-blue"
    },
    {
      title: "Factoring and Confirming",
      desc: "Alleviation of working capital flow for small suppliers of the State.",
      text: "In what way can the approval of factoring legislation and a state confirming system alleviate the working capital squeeze of small suppliers of the State?",
      icon: "receipt",
      colorClass: "text-dominican-blue"
    },
    {
      title: "Pension Investment",
      desc: "Channeling pension savings funds into corporate projects.",
      text: "What regulatory and market restrictions currently limit the channeling of the vast savings of pension funds into productive and long-term corporate projects?",
      icon: "vault",
      colorClass: "text-dominican-blue"
    },
    {
      title: "PPP Challenges",
      desc: "Technical bottlenecks in Public-Private Partnerships under Law 47-20.",
      text: "What are the main technical and procedural bottlenecks that slow down the awarding of Public-Private Partnership (PPP) projects under Law No. 47-20?",
      icon: "hourglass",
      colorClass: "text-dominican-blue"
    }
  ],
  "Estrategia de financiamiento de Republica Dominicana - Capítulo 5.md": [
    {
      title: "FDI Reforms",
      desc: "Use of Performance Agreements to condition investment benefits.",
      text: "Why is it necessary to modify the investment incentives regime for Foreign Direct Investment (FDI), moving towards Performance Agreements that condition benefits on technology transfer and the creation of productive linkages?",
      icon: "globe",
      colorClass: "text-dominican-blue"
    },
    {
      title: "BANDEX Financing",
      desc: "Access to trade finance and instruments to mitigate costs.",
      text: "What type of innovative financial instruments can BANDEX deploy to mitigate the high cost and limited access to trade finance?",
      icon: "coins",
      colorClass: "text-dominican-blue"
    },
    {
      title: "Diaspora Remittances",
      desc: "Validation of remittance flows to facilitate access to mortgage credits.",
      text: "How can remittances from the diaspora be productively channeled by recognizing these flows as valid income for access to mortgage loans?",
      icon: "home",
      colorClass: "text-dominican-blue"
    },
    {
      title: "Impact Investment and ESG",
      desc: "Measurement and ESG reporting barriers limiting global capital entry.",
      text: "What institutional and measurement barriers (such as the lack of ESG reporting under global standards) currently limit the entry of capital from international impact investment funds?",
      icon: "bar-chart-2",
      colorClass: "text-dominican-blue"
    }
  ],
  "Estrategia de financiamiento de Republica Dominicana - Capítulo 6.md": [
    {
      title: "Catalog of 23 Mechanisms",
      desc: "The four functional families of alternative financing instruments.",
      text: "What is the Catalog of Alternative Financing Instruments and what are the four major functional families in which it groups its 23 proposed mechanisms?",
      icon: "layers",
      colorClass: "text-dominican-blue"
    },
    {
      title: "IPSI Sectoral Index",
      desc: "Prioritization of sectors (infrastructure, water) to channel instruments.",
      text: "How is the Integrated Sectoral Prioritization Index (IPSI) used to identify the sectors (such as agribusiness, water, and infrastructure) most suitable for channeling these new instruments?",
      icon: "target",
      colorClass: "text-dominican-blue"
    },
    {
      title: "SLB Bonds (Sustainability)",
      desc: "Alignment of financial incentives to measurable environmental and social goals.",
      text: "How do 'Performance and Results-Based' instruments (such as Sustainability-Linked Bonds - SLB) align financial incentives with the achievement of measurable environmental and social goals?",
      icon: "check-square",
      colorClass: "text-emerald-600"
    },
    {
      title: "Execution Sequence",
      desc: "Strategic implementation timeline of short, medium, and long term.",
      text: "Why is a phased execution sequence proposed, where instruments such as labeled bonds or factoring are short-term, and debt-for-nature swaps are long-term goals?",
      icon: "calendar",
      colorClass: "text-dominican-blue"
    }
  ],
  "Estrategia de financiamiento de Republica Dominicana - Capítulo 7.md": [
    {
      title: "Governance Ecosystem",
      desc: "Structure of the Steering Committee, Technical Committee, and Technical Secretariat.",
      text: "How is the governance ecosystem of the DFS operationally structured through a Steering Committee, a Technical Committee, and a Technical Secretariat?",
      icon: "users",
      colorClass: "text-dominican-blue"
    },
    {
      title: "Milestones and Budget Cycle",
      desc: "Coordination of strategic meetings in February and September of the cycle.",
      text: "Why is it vital that Steering Committee sessions are strategically aligned with the milestones of the Dominican budget cycle (February and September)?",
      icon: "clock",
      colorClass: "text-dominican-blue"
    },
    {
      title: "Monitoring Dimensions",
      desc: "Measurement of public financial progress, resource mobilization, and execution.",
      text: "What concrete dimensions (public financial execution, resource mobilization, and implementation) does the monitoring model address to measure the progress of the Strategy?",
      icon: "eye",
      colorClass: "text-dominican-blue"
    },
    {
      title: "Transparency and Accountability",
      desc: "Guarantees of systematic accountability to Congress and civil society.",
      text: "In what way will the DFS guarantee transparency and systematic accountability to the Executive Branch, the National Congress, and civil society?",
      icon: "shield",
      colorClass: "text-dominican-blue"
    }
  ]
};

// Strategic Questions mapping by Document Source in Spanish
const suggestionsBySource = {
  "all": [
    {
      title: "Retos del Pacto Fiscal",
      desc: "Barreras políticas y urgencia de elevar la históricamente baja presión tributaria.",
      text: "¿Cuáles son las barreras políticas y sociales que han retrasado la consecución de un Pacto Fiscal, y por qué es urgente para elevar la históricamente baja presión tributaria?",
      icon: "file-text",
      colorClass: "text-dominican-blue"
    },
    {
      title: "Financiamiento Verde",
      desc: "Taxonomía Verde dominicana y la emisión de bonos soberanos temáticos.",
      text: "¿Qué instrumentos componen la arquitectura del financiamiento verde dominicano (como la Taxonomía Verde y la emisión de bonos soberanos temáticos) y qué marcos regulatorios aún se necesitan, como la Ley General de Cambio Climático?",
      icon: "leaf",
      colorClass: "text-emerald-600"
    },
    {
      title: "Inversión de Pensiones",
      desc: "Canalización del vasto ahorro de pensiones hacia proyectos productivos y corporativos.",
      text: "¿Qué restricciones regulatorias y de mercado limitan actualmente la canalización del vasto ahorro de los fondos de pensiones hacia proyectos productivos y corporativos de largo plazo?",
      icon: "vault",
      colorClass: "text-dominican-blue"
    },
    {
      title: "Reformas de la IED",
      desc: "Uso de Acuerdos de Desempeño para condicionar los beneficios de inversión extranjera.",
      text: "¿Por qué es necesario modificar el régimen de incentivos a la Inversión Extranjera Directa (IED), transitando hacia Acuerdos de Desempeño que condicionen los beneficios a la transferencia tecnológica y la creación de encadenamientos productivos?",
      icon: "globe",
      colorClass: "text-dominican-blue"
    }
  ],
  "Estrategia de financiamiento de Republica Dominicana - Resumen Ejecutivo.md": [
    {
      title: "Presión Tributaria y Evasión",
      desc: "Análisis sobre los retos estructurales fiscales de República Dominicana y el sector eléctrico.",
      text: "¿Cómo interactúa la históricamente baja presión tributaria con retos estructurales como la evasión fiscal y el déficit del sector eléctrico, limitando la capacidad de acción del Estado?",
      icon: "trending-down",
      colorClass: "text-dominican-blue"
    },
    {
      title: "Cooperación Internacional",
      desc: "El registro de la ayuda oficial internacional en el Presupuesto Nacional.",
      text: "¿Qué deficiencias existen en la integración operativa actual de la cooperación internacional, considerando que solo el 29% de la ayuda al sector público se registra en el Presupuesto Nacional?",
      icon: "globe",
      colorClass: "text-dominican-blue"
    },
    {
      title: "Financiamiento Privado",
      desc: "Diversificación del mercado de capitales y flexibilización de fondos de pensiones.",
      text: "¿Por qué el sector privado doméstico requiere urgentemente la diversificación del mercado de capitales y la flexibilización de los límites de los fondos de pensiones para financiar su productividad a largo plazo?",
      icon: "wallet",
      colorClass: "text-dominican-blue"
    },
    {
      title: "Inversión Extranjera Directa",
      desc: "Estrategias fiscales (como el IMCD) para transformar la IED en integración plena.",
      text: "¿De qué manera la Inversión Extranjera Directa (IED) puede transformarse de un modelo de 'enclave' hacia un modelo de integración plena y qué estrategias fiscales (como el IMCD) se proponen para lograrlo?",
      icon: "building-2",
      colorClass: "text-dominican-blue"
    }
  ],
  "Estrategia de financiamiento de Republica Dominicana - Capítulo 1.md": [
    {
      title: "Crecimiento y Reformas",
      desc: "Motores macroeconómicos e históricos de la estabilidad dominicana.",
      text: "¿Cuáles han sido los principales motores y reformas estructurales que han permitido a la República Dominicana mantener un crecimiento económico constante y una inflación controlada en las últimas décadas?",
      icon: "activity",
      colorClass: "text-dominican-blue"
    },
    {
      title: "Plan Meta RD 2036",
      desc: "Reformas de segunda generación necesarias para duplicar el PIB real.",
      text: "¿Cómo está diseñado el Plan Meta RD 2036 y cuáles son las reformas de segunda generación necesarias para duplicar el PIB real del país?",
      icon: "award",
      colorClass: "text-dominican-blue"
    },
    {
      title: "Facilidades de Liquidez",
      desc: "El impacto del Banco Central en la resiliencia y capitalización del sector financiero.",
      text: "¿De qué manera las facilidades de liquidez provistas por el Banco Central han contribuido a mantener la resiliencia y capitalización del sector financiero doméstico?",
      icon: "landmark",
      colorClass: "text-dominican-blue"
    },
    {
      title: "Bloques de Riesgo",
      desc: "Las 14 principales amenazas externas, climáticas e internas al financiamiento.",
      text: "¿Cuáles son los 14 bloques de riesgos principales (incluyendo choques externos, vulnerabilidad climática y déficit del sector eléctrico) que amenazan el financiamiento para el desarrollo en el país?",
      icon: "alert-triangle",
      colorClass: "text-dominican-red"
    }
  ],
  "Estrategia de financiamiento de Republica Dominicana - Capítulo 2.md": [
    {
      title: "Retos del Pacto Fiscal",
      desc: "Barreras políticas y sociales para elevar la recaudación tributaria.",
      text: "¿Cuáles son las barreras políticas y sociales que han retrasado la consecución de un Pacto Fiscal, y por qué es urgente para elevar la históricamente baja presión tributaria?",
      icon: "file-text",
      colorClass: "text-dominican-blue"
    },
    {
      title: "Gasto y Exenciones",
      desc: "El impacto del Gasto Tributario y medidas recomendadas para su racionalización.",
      text: "¿De qué manera el alto volumen de Gasto Tributario (exenciones fiscales) compromete los ingresos del Estado y qué medidas se recomiendan para su racionalización?",
      icon: "scissors",
      colorClass: "text-dominican-blue"
    },
    {
      title: "Prioridades de Política (IPP)",
      desc: "Metodología de Inferencia para detectar cuellos de botella del gasto público.",
      text: "¿Qué revela la metodología de Inferencia de Prioridades de Política (IPP) sobre la eficiencia del gasto público y cómo ayuda a identificar cuellos de botella en sectores estratégicos?",
      icon: "bar-chart-2",
      colorClass: "text-dominican-blue"
    },
    {
      title: "Evasión e Impuesto Mínimo",
      desc: "Facturación electrónica e implementación del Pilar Dos (Impuesto Mínimo Global).",
      text: "¿Cómo pueden combatirse la evasión fiscal interna y transnacional mediante la integración tecnológica de bases de datos, facturación electrónica y la implementación del Impuesto Mínimo Global (Pilar Dos)?",
      icon: "shield-check",
      colorClass: "text-emerald-600"
    }
  ],
  "Estrategia de financiamiento de Republica Dominicana - Capítulo 3.md": [
    {
      title: "Evolución de la AOD",
      desc: "Transición de donaciones a préstamos concesionales de banca multilateral.",
      text: "¿Cómo ha evolucionado el perfil de la Ayuda Oficial al Desarrollo (AOD) en el país, especialmente en la transición de donaciones hacia préstamos concesionales de la banca multilateral?",
      icon: "line-chart",
      colorClass: "text-dominican-blue"
    },
    {
      title: "Debilidades del SINACID",
      desc: "Fragmentación operativa entre cooperación reembolsable y no reembolsable.",
      text: "¿Qué debilidades presenta el Sistema Nacional de Cooperación Internacional (SINACID) frente a la fragmentación entre la cooperación reembolsable y no reembolsable?",
      icon: "git-branch",
      colorClass: "text-dominican-blue"
    },
    {
      title: "Blended Finance (Mixto)",
      desc: "Cómo usar donaciones limitadas para estructurar estudios de preinversión.",
      text: "¿Cómo puede la República Dominicana aprovechar el esquema de blended finance (financiamiento mixto) para transformar las limitadas donaciones en estudios de preinversión que hagan bancables los grandes proyectos?",
      icon: "combine",
      colorClass: "text-dominican-blue"
    },
    {
      title: "Financiamiento Verde",
      desc: "Taxonomía Verde, bonos temáticos y la Ley General de Cambio Climático.",
      text: "¿Qué instrumentos componen la arquitectura del financiamiento verde dominicano (como la Taxonomía Verde y la emisión de bonos soberanos temáticos) y qué marcos regulatorios aún se necesitan, como la Ley General de Cambio Climático?",
      icon: "leaf",
      colorClass: "text-emerald-600"
    }
  ],
  "Estrategia de financiamiento de Republica Dominicana - Capítulo 4.md": [
    {
      title: "MIPYMES e Informalidad",
      desc: "Exclusión del crédito comercial debido a barreras estructurales de informalidad.",
      text: "¿Por qué la alta tasa de informalidad en las MIPYMES dominicanas actúa como una barrera estructural que las excluye del crédito comercial y las condena a mercados de baja productividad?",
      icon: "store",
      colorClass: "text-dominican-blue"
    },
    {
      title: "Factoring y Confirming",
      desc: "Alivio del flujo de capital de trabajo para proveedores pequeños del Estado.",
      text: "¿De qué manera la aprobación de una legislación de factoring y un sistema de confirming estatal puede aliviar la asfixia de capital de trabajo de los pequeños proveedores del Estado?",
      icon: "receipt",
      colorClass: "text-dominican-blue"
    },
    {
      title: "Inversión de Pensiones",
      desc: "Canalización de los fondos de ahorro previsional a proyectos corporativos.",
      text: "¿Qué restricciones regulatorias y de mercado limitan actualmente la canalización del vasto ahorro de los fondos de pensiones hacia proyectos productivos y corporativos de largo plazo?",
      icon: "vault",
      colorClass: "text-dominican-blue"
    },
    {
      title: "Desafíos de las APP",
      desc: "Cuellos de botella técnicos en Alianzas Público-Privadas bajo la Ley 47-20.",
      text: "¿Cuáles son los principales cuellos de botella técnicos y procedimentales que ralentizan la adjudicación de proyectos de Alianzas Público-Privadas (APP) bajo la Ley No. 47-20?",
      icon: "hourglass",
      colorClass: "text-dominican-blue"
    }
  ],
  "Estrategia de financiamiento de Republica Dominicana - Capítulo 5.md": [
    {
      title: "Reformas de la IED",
      desc: "Uso de Acuerdos de Desempeño para condicionar los beneficios de inversión.",
      text: "¿Por qué es necesario modificar el régimen de incentivos a la Inversión Extranjera Directa (IED), transitando hacia Acuerdos de Desempeño que condicionen los beneficios a la transferencia tecnológica y la creación de encadenamientos productivos?",
      icon: "globe",
      colorClass: "text-dominican-blue"
    },
    {
      title: "Financiamiento de BANDEX",
      desc: "Acceso al comercio exterior (trade finance) e instrumentos para mitigar costos.",
      text: "¿Qué tipo de instrumentos financieros innovadores puede desplegar BANDEX para mitigar el alto costo y el limitado acceso al financiamiento del comercio exterior (trade finance)?",
      icon: "coins",
      colorClass: "text-dominican-blue"
    },
    {
      title: "Remesas Diáspora",
      desc: "Validación de flujos de remesas para facilitar accesos a créditos hipotecarios.",
      text: "¿Cómo pueden canalizarse productivamente las remesas de la diáspora mediante el reconocimiento de estos flujos como ingresos válidos para el acceso a créditos hipotecarios?",
      icon: "home",
      colorClass: "text-dominican-blue"
    },
    {
      title: "Inversión de Impacto y ESG",
      desc: "Barreras de medición y reportes ESG que limitan la entrada de capital global.",
      text: "¿Qué barreras institucionales y de medición (como la falta de reportes ESG bajo estándares globales) limitan actualmente la entrada de capital de los fondos internacionales de inversión de impacto?",
      icon: "bar-chart-2",
      colorClass: "text-dominican-blue"
    }
  ],
  "Estrategia de financiamiento de Republica Dominicana - Capítulo 6.md": [
    {
      title: "Catálogo de 23 Mecanismos",
      desc: "Las cuatro familias funcionales de instrumentos alternativos de financiamiento.",
      text: "¿Qué es el Catálogo de Instrumentos Alternativos de Financiamiento y cuáles son las cuatro grandes familias funcionales en las que agrupa sus 23 mecanismos propuestos?",
      icon: "layers",
      colorClass: "text-dominican-blue"
    },
    {
      title: "Índice Sectorial IPSI",
      desc: "Priorización de sectores (infraestructura, agua) para canalizar instrumentos.",
      text: "¿Cómo se utiliza el Índice de Priorización Sectorial Integrado (IPSI) para identificar los sectores (como agroindustria, agua e infraestructura) más aptos para canalizar estos nuevos instrumentos?",
      icon: "target",
      colorClass: "text-dominican-blue"
    },
    {
      title: "Bonos SLB (Sostenibilidad)",
      desc: "Alineación de incentivos financieros a metas ambientales y sociales medibles.",
      text: "¿De qué forma los instrumentos 'Basados en Desempeño y Resultados' (como los Bonos Vinculados a la Sostenibilidad - SLB) alinean los incentivos financieros con el logro de metas ambientales y sociales medibles?",
      icon: "check-square",
      colorClass: "text-emerald-600"
    },
    {
      title: "Secuencia de Ejecución",
      desc: "Cronograma estratégico de ejecución de corto, mediano y largo plazo.",
      text: "¿Por qué se propone una secuencia de ejecución escalonada, donde instrumentos como los bonos etiquetados o el factoring sean de corto plazo y los canjes de deuda por naturaleza sean metas a largo plazo?",
      icon: "calendar",
      colorClass: "text-dominican-blue"
    }
  ],
  "Estrategia de financiamiento de Republica Dominicana - Capítulo 7.md": [
    {
      title: "Ecosistema de Gobernanza",
      desc: "Estructura del Comité Directivo, Comité Técnico y la Secretaría Técnica.",
      text: "¿Cómo se estructura operativamente el ecosistema de gobernanza de la EFD mediante un Comité Directivo, un Comité Técnico y una Secretaría Técnica?",
      icon: "users",
      colorClass: "text-dominican-blue"
    },
    {
      title: "Hitos y Ciclo Presupuestario",
      desc: "Coordinación de reuniones estratégicas en febrero y septiembre del ciclo.",
      text: "¿Por qué es vital que las sesiones del Comité Directivo se alineen estratégicamente con los hitos del ciclo presupuestario dominicano (febrero y septiembre)?",
      icon: "clock",
      colorClass: "text-dominican-blue"
    },
    {
      title: "Dimensiones de Monitoreo",
      desc: "Medición del avance financiero público, movilización de recursos y ejecución.",
      text: "¿Qué dimensiones concretas (ejecución financiera pública, movilización de recursos e implementación) aborda el modelo de monitoreo para medir el avance de la Estrategia?",
      icon: "eye",
      colorClass: "text-dominican-blue"
    },
    {
      title: "Transparencia y Rendición",
      desc: "Garantías de rendición sistemática de cuentas al Congreso y sociedad civil.",
      text: "¿De qué manera la EFD garantizará la transparencia y rendición de cuentas sistemática ante el Poder Ejecutivo, el Congreso Nacional y la sociedad civil?",
      icon: "shield",
      colorClass: "text-dominican-blue"
    }
  ]
};

// Helper: Render dynamic suggestions based on active source
function renderDynamicSuggestions(sourceKey) {
  if (!suggestionsGrid) return;

  const suggestionsSource = currentLanguage === 'en' ? suggestionsBySourceEN : suggestionsBySource;
  const suggestions = suggestionsSource[sourceKey] || suggestionsSource["all"];
  suggestionsGrid.innerHTML = '';

  suggestions.forEach(card => {
    // Escape single quotes inside question text to prevent onclick javascript breakage
    const escapedText = card.text.replace(/'/g, "\\'");

    const cardEl = document.createElement('button');
    cardEl.setAttribute('onclick', `prefillInput('${escapedText}')`);
    cardEl.className = 'text-left p-4 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-xl transition-all hover:scale-[1.01] hover:shadow-md group flex items-start gap-3 message-fade-in';

    cardEl.innerHTML = `
      <i data-lucide="${card.icon}" class="w-5 h-5 ${card.colorClass || 'text-dominican-blue'} mt-0.5 group-hover:scale-110 transition-transform flex-shrink-0"></i>
      <div>
        <h4 class="text-xs font-bold text-slate-700">${escapeHTML(card.title)}</h4>
        <p class="text-[11px] text-slate-500 mt-1 leading-relaxed">${escapeHTML(card.desc)}</p>
      </div>
    `;
    suggestionsGrid.appendChild(cardEl);
  });

  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

// Hot-translation function to update all data-i18n elements
function applyLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('preferredLanguage', lang);
  document.documentElement.lang = lang;

  // Toggle active styling and checkbox checked state
  const labelEs = document.getElementById('lang-label-es');
  const labelEn = document.getElementById('lang-label-en');
  const checkbox = document.getElementById('lang-toggle-checkbox');

  if (lang === 'en') {
    if (labelEs) labelEs.classList.remove('active');
    if (labelEn) labelEn.classList.add('active');
    if (checkbox) checkbox.checked = true;
  } else {
    if (labelEs) labelEs.classList.add('active');
    if (labelEn) labelEn.classList.remove('active');
    if (checkbox) checkbox.checked = false;
  }

  // Update DOM text
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translation = translations[lang] && translations[lang][key];
    if (translation !== undefined) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.setAttribute('placeholder', translation);
      } else {
        if (translation.includes('<') && translation.includes('>')) {
          el.innerHTML = translation;
        } else {
          el.textContent = translation;
        }
      }
    }
  });

  // Re-render recommendations
  if (sourceSelector) {
    renderDynamicSuggestions(sourceSelector.value);
  }

  // Fetch and draw localized mind map
  initMindMap();
}

// Initialize Lucide Icons, Language Preferences, and Suggestions
document.addEventListener('DOMContentLoaded', () => {
  // Bind change event to language switch toggle checkbox
  const langToggleCheckbox = document.getElementById('lang-toggle-checkbox');
  if (langToggleCheckbox) {
    langToggleCheckbox.addEventListener('change', (e) => {
      const selectedLang = e.target.checked ? 'en' : 'es';
      applyLanguage(selectedLang);
    });
  }

  // Load saved preference or default to Spanish (ES)
  const savedLang = localStorage.getItem('preferredLanguage') || 'es';
  applyLanguage(savedLang);

  // Bind Mobile Navigation Drawer events
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileSidebarClose = document.getElementById('mobile-sidebar-close');
  const mobileSidebarBackdrop = document.getElementById('mobile-sidebar-backdrop');

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', openMobileSidebar);
  }
  if (mobileSidebarClose) {
    mobileSidebarClose.addEventListener('click', closeMobileSidebar);
  }
  if (mobileSidebarBackdrop) {
    mobileSidebarBackdrop.addEventListener('click', closeMobileSidebar);
  }

  // Bind Mobile Card Flip Click support
  document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // If clicked on any action button, don't flip
      if (e.target.closest('.card-action-btn')) return;
      card.classList.toggle('flipped');
    });
  });

  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});

// Helper: Auto scroll to the bottom of the chat log
function scrollToBottom() {
  scrollAnchor.scrollIntoView({ behavior: 'smooth' });
}

// Helper: Prefill the chat input from a suggestion card and switch to the assistant tab
window.prefillInput = function (text) {
  switchTab('assistant');
  if (chatInput) {
    chatInput.value = text;
    setTimeout(() => {
      chatInput.focus();
    }, 100);
  }
};

// Helper: Select a specific chapter in the dropdown and navigate to the assistant tab
window.selectChapterAndNavigate = function (chapterFilename) {
  if (sourceSelector) {
    sourceSelector.value = chapterFilename;
    sourceSelector.dispatchEvent(new Event('change'));
  }
  switchTab('assistant');
};

// Helper: Copy bot responses to clipboard with visual micro-feedback
window.copyToClipboard = function (textBase64, btnElement) {
  try {
    const text = atob(textBase64);
    navigator.clipboard.writeText(text).then(() => {
      // Create inline feedback animation
      const originalHTML = btnElement.innerHTML;
      const copySuccess = currentLanguage === 'en' ? 'COPIED' : 'COPIADO';
      btnElement.innerHTML = `
        <i data-lucide="check" class="w-3.5 h-3.5 text-emerald-500"></i>
        <span class="text-[10px] font-bold text-emerald-500">${copySuccess}</span>
      `;
      if (typeof lucide !== 'undefined') lucide.createIcons();

      setTimeout(() => {
        btnElement.innerHTML = originalHTML;
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }, 1800);
    }).catch(err => {
      console.error("Error al acceder al portapapeles: ", err);
    });
  } catch (e) {
    console.error("Fallo al decodificar texto de portapapeles: ", e);
  }
};

// Event Listener: Dropdown Document Source Selection
sourceSelector.addEventListener('change', (e) => {
  const selectedOption = e.target.options[e.target.selectedIndex];
  const sourceName = selectedOption.text;
  const sourceValue = e.target.value;

  // 1. Clear API history strictly to isolate contexts and avoid hallucinating crossovers
  apiHistory = [];

  // 2. Check if there is an active conversation
  if (visualHistory.length > 0) {
    // Append visual full-width system banner to the chat log
    const bannerText = currentLanguage === 'en'
      ? `Connection changed to: ${sourceName}. New context session started.`
      : `Conexión cambiada a: ${sourceName}. Nueva sesión de contexto iniciada.`;
    appendSystemBanner(bannerText);

    // Save to visual history as a system notification
    visualHistory.push({
      role: 'system',
      text: `— ${bannerText} —`
    });

    // Ensure the welcome panel is hidden
    if (welcomePanel) {
      welcomePanel.classList.add('hidden');
    }
  } else {
    // If the chat history is empty, dynamically load the suggestions for the newly selected chapter without adding banners
    if (welcomePanel) {
      welcomePanel.classList.remove('hidden');
      renderDynamicSuggestions(sourceValue);
    }
  }

  scrollToBottom();
});

// Helper: Append a visual system notification banner to the UI
function appendSystemBanner(message) {
  const banner = document.createElement('div');
  banner.className = 'w-full flex justify-center py-2 message-fade-in';
  banner.innerHTML = `
    <div class="px-5 py-2 bg-slate-100 border border-slate-200/60 rounded-full flex items-center gap-2.5 shadow-sm text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
      <i data-lucide="refresh-cw" class="w-3.5 h-3.5 text-dominican-gold animate-spin-slow"></i>
      <span>— ${message} —</span>
    </div>
  `;
  chatMessages.appendChild(banner);
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Helper: Append a chat bubble (User or Bot)
function appendChatBubble(role, text) {
  const isUser = role === 'user';
  const bubbleWrapper = document.createElement('div');
  bubbleWrapper.className = `flex flex-col ${isUser ? 'items-end' : 'items-start'} gap-2 group message-fade-in`;

  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (isUser) {
    // User bubble markup
    const sentLabel = currentLanguage === 'en' ? 'Sent' : 'Enviado';
    bubbleWrapper.innerHTML = `
      <div class="bg-slate-200 text-slate-800 p-4 px-6 rounded-2xl rounded-tr-none max-w-[80%] shadow-sm group-hover:shadow-md transition-shadow">
        <p class="font-medium text-sm md:text-base whitespace-pre-wrap leading-relaxed">${escapeHTML(text)}</p>
      </div>
      <span class="text-[10px] font-bold text-slate-400 mr-2 flex items-center gap-1">
        ${timestamp} · ${sentLabel}
      </span>
    `;
  } else {
    // Bot RAG response markup with clipboard copy utilities and marked.js MD rendering
    const textBase64 = btoa(unescape(encodeURIComponent(text)));
    const parsedHTML = typeof marked !== 'undefined' ? marked.parse(text) : escapeHTML(text);
    const bubbleHeader = currentLanguage === 'en' ? 'Official AI Response' : 'Respuesta AI Institucional';
    const copyLabel = currentLanguage === 'en' ? 'COPY DATA' : 'COPIAR DATOS';
    const botLabel = currentLanguage === 'en' ? 'AI Assistant' : 'Asistente IA';

    bubbleWrapper.innerHTML = `
      <div class="bg-white border border-slate-200/60 p-6 md:p-8 rounded-2xl rounded-tl-none max-w-[90%] shadow-lg relative overflow-hidden group">
        <!-- Sidebar Gold/Blue Accent lines -->
        <div class="absolute top-0 left-0 w-1.5 h-full bg-dominican-blue"></div>
        
        <!-- Bubble Header Actions -->
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center gap-2">
            <i data-lucide="sparkles" class="w-4 h-4 text-dominican-gold"></i>
            <span class="text-[10px] font-bold text-dominican-blue uppercase tracking-widest">${bubbleHeader}</span>
          </div>
          <button onclick="copyToClipboard('${textBase64}', this)" class="p-2 hover:bg-slate-50 hover:border-slate-300 rounded-lg border border-slate-200/60 transition-all flex items-center gap-1.5 text-slate-500">
            <i data-lucide="copy" class="w-3.5 h-3.5"></i>
            <span class="text-[9px] font-bold">${copyLabel}</span>
          </button>
        </div>
        
        <!-- Rich Markdown Body Content -->
        <div class="prose-custom text-slate-600 leading-relaxed text-sm md:text-base space-y-4">
          ${parsedHTML}
        </div>
      </div>
      
      <span class="text-[10px] font-bold text-slate-400 ml-2">
        ${timestamp} · ${botLabel}
      </span>
    `;
  }

  chatMessages.appendChild(bubbleWrapper);
  if (typeof lucide !== 'undefined') lucide.createIcons();
  scrollToBottom();
}

// Helper: Escape HTML strings to guard against XSS on user inputs
function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Core: Send a message to the FastAPI serverless endpoint
async function handleSendMessage() {
  const message = chatInput.value.trim();
  if (!message) return;

  const activeSource = sourceSelector.value;

  // Hide welcome panel permanently on first message
  if (welcomePanel && !welcomePanel.classList.contains('hidden')) {
    welcomePanel.classList.add('hidden');
  }

  // Clear input
  chatInput.value = '';

  // Render user bubble
  appendChatBubble('user', message);
  visualHistory.push({ role: 'user', text: message });

  // Render a loading/typing indicator bubble
  const typingIndicator = document.createElement('div');
  typingIndicator.id = 'typing-indicator';
  typingIndicator.className = 'flex flex-col items-start gap-2 message-fade-in';
  const analyzingText = currentLanguage === 'en' ? 'Analyzing knowledge base...' : 'Analizando base de conocimientos...';
  typingIndicator.innerHTML = `
    <div class="bg-white border border-slate-200 p-4 px-6 rounded-2xl rounded-tl-none shadow-md flex items-center gap-2">
      <div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0s"></div>
      <div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.15s"></div>
      <div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.3s"></div>
      <span class="text-xs text-slate-400 font-semibold ml-2">${analyzingText}</span>
    </div>
  `;
  chatMessages.appendChild(typingIndicator);
  scrollToBottom();

  // Disable user input interaction during fetching
  toggleInputState(false);

  try {
    // Send post request to relative API route (rewritten to FastAPI in Vercel)
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: message,
        history: apiHistory,
        current_source: activeSource,
        language: currentLanguage
      })
    });

    // Remove typing indicator
    const indicatorEl = document.getElementById('typing-indicator');
    if (indicatorEl) indicatorEl.remove();

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || (currentLanguage === 'en' ? "Server communication failure." : "Fallo en la comunicación con el servidor."));
    }

    const data = await response.json();

    // Render the bot response
    appendChatBubble('bot', data.response);

    // Save to histories
    visualHistory.push({ role: 'bot', text: data.response });

    // Update API History (Map user/model role requirements)
    apiHistory.push({ role: 'user', text: message });
    apiHistory.push({ role: 'model', text: data.response });

  } catch (error) {
    // Remove typing indicator in case of early catch
    const indicatorEl = document.getElementById('typing-indicator');
    if (indicatorEl) indicatorEl.remove();

    console.error("Error en comunicación RAG:", error);

    // Render error card in chat
    const errorBubble = document.createElement('div');
    errorBubble.className = 'w-full max-w-xl bg-red-50 border border-red-200 p-4 rounded-xl text-red-700 flex gap-3 message-fade-in';
    const errorTitle = currentLanguage === 'en' ? 'Technical Connection Error' : 'Error Técnico de Conexión';
    const errorSubtitle = currentLanguage === 'en' 
      ? 'Please verify that the GEMINI_API_KEY environment variable is configured and try again.' 
      : 'Por favor verifica que la variable de entorno GEMINI_API_KEY esté configurada e intenta de nuevo.';
    errorBubble.innerHTML = `
      <i data-lucide="alert-triangle" class="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5"></i>
      <div class="space-y-1">
        <h4 class="text-xs font-bold uppercase tracking-wider">${errorTitle}</h4>
        <p class="text-xs leading-relaxed font-semibold">${escapeHTML(error.message)}</p>
        <span class="text-[10px] text-red-400 block mt-1">${errorSubtitle}</span>
      </div>
    `;
    chatMessages.appendChild(errorBubble);
    if (typeof lucide !== 'undefined') lucide.createIcons();
    scrollToBottom();
  } finally {
    toggleInputState(true);
    chatInput.focus();
  }
}

// Helper: Toggle inputs and buttons on/off during network operations
function toggleInputState(enable) {
  chatInput.disabled = !enable;
  sendBtn.disabled = !enable;
  sourceSelector.disabled = !enable;
  if (enable) {
    sendBtn.classList.remove('opacity-50', 'pointer-events-none');
  } else {
    sendBtn.classList.add('opacity-50', 'pointer-events-none');
  }
}

// Event Listeners: Trigger send on click or Enter key
sendBtn.addEventListener('click', handleSendMessage);
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    handleSendMessage();
  }
});

// Event Listener: Export Chat History to readable plain text
exportHistoryBtn.addEventListener('click', () => {
  if (visualHistory.length === 0) {
    alert(currentLanguage === 'en' ? "No messages in the conversation to export." : "No hay mensajes en la conversación para exportar.");
    return;
  }

  let txtContent = `=========================================================\n`;
  txtContent += currentLanguage === 'en'
    ? `DEVELOPMENT FINANCING STRATEGY - INTEGRATED NATIONAL FINANCING FRAMEWORK\n`
    : `ESTRATEGIA DE FINANCIAMIENTO PARA EL DESARROLLO - MARCO NACIONAL INTEGRADO DE FINANCIAMIENTO\n`;
  txtContent += currentLanguage === 'en'
    ? `CONSULTATION HISTORY\n`
    : `HISTORIAL DE CONSULTAS\n`;
  txtContent += `${currentLanguage === 'en' ? 'Generated on' : 'Generado el'}: ${new Date().toLocaleString()}\n`;
  txtContent += `=========================================================\n\n`;

  visualHistory.forEach((msg, index) => {
    if (msg.role === 'user') {
      txtContent += `[${currentLanguage === 'en' ? 'USER' : 'USUARIO'}]: ${msg.text}\n\n`;
    } else if (msg.role === 'bot') {
      txtContent += `[${currentLanguage === 'en' ? 'AI SYSTEM' : 'SISTEMA AI'}]:\n${msg.text}\n\n`;
      txtContent += `---------------------------------------------------------\n\n`;
    } else if (msg.role === 'system') {
      txtContent += `[${currentLanguage === 'en' ? 'NOTIFICATION' : 'NOTIFICACIÓN'}]: ${msg.text}\n\n`;
    }
  });

  txtContent += `=========================================================\n`;
  txtContent += currentLanguage === 'en' ? `End of exported document. INFF-DR.\n` : `Fin del documento exportado. INFF-RD.\n`;

  // Trigger file download
  const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const fileNamePrefix = currentLanguage === 'en' ? 'Consultation_history_DFS' : 'Historial_consultas_EFD';
  a.download = `${fileNamePrefix}_${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

// Event Listener: Clear Conversation with confirmation click tracking
clearChatBtn.addEventListener('click', () => {
  if (visualHistory.length === 0) {
    alert(currentLanguage === 'en' ? "The conversation is already empty." : "La conversación ya está vacía.");
    return;
  }

  if (!isClearing) {
    // Enter confirmation state
    isClearing = true;
    clearConfirmText.classList.remove('hidden');
    clearChatBtn.classList.add('border-dominican-red', 'bg-red-500/10');
    // Auto reset confirmation state in 3 seconds if not clicked again
    setTimeout(() => {
      resetClearState();
    }, 3000);
  } else {
    // Perform clear
    chatMessages.innerHTML = '';
    visualHistory = [];
    apiHistory = [];

    // Reveal welcome panel again with the correct dynamic suggestions based on the current dropdown value
    if (welcomePanel) {
      welcomePanel.classList.remove('hidden');
      renderDynamicSuggestions(sourceSelector.value);
    }

    resetClearState();
    scrollToBottom();
  }
});

// Helper: Reset Clear button states
function resetClearState() {
  isClearing = false;
  clearConfirmText.classList.add('hidden');
  clearChatBtn.classList.remove('border-dominican-red', 'bg-red-500/10');
}

// Drawer open/close controls for mobile
function openMobileSidebar() {
  const sidebar = document.querySelector('aside');
  const backdrop = document.getElementById('mobile-sidebar-backdrop');
  if (sidebar) {
    sidebar.classList.remove('-translate-x-full');
    sidebar.classList.add('translate-x-0');
  }
  if (backdrop) {
    backdrop.classList.remove('hidden');
    setTimeout(() => {
      backdrop.classList.remove('opacity-0');
      backdrop.classList.add('opacity-100');
    }, 10);
  }
}

function closeMobileSidebar() {
  const sidebar = document.querySelector('aside');
  const backdrop = document.getElementById('mobile-sidebar-backdrop');
  if (sidebar) {
    sidebar.classList.add('-translate-x-full');
    sidebar.classList.remove('translate-x-0');
  }
  if (backdrop) {
    backdrop.classList.remove('opacity-100');
    backdrop.classList.add('opacity-0');
    setTimeout(() => {
      backdrop.classList.add('hidden');
    }, 300);
  }
}

// Tab Switching Controller (Home Landing vs RAG Assistant vs Mind Maps vs NotebookLM Guide)
function switchTab(target) {
  // Auto-close mobile navigation drawer on switch
  closeMobileSidebar();

  if (target === 'home') {
    if (homeView) homeView.classList.remove('hidden');
    if (assistantView) assistantView.classList.add('hidden');
    if (mindmapView) mindmapView.classList.add('hidden');
    if (notebookView) notebookView.classList.add('hidden');

    // Update active tab styles
    if (tabHome) tabHome.className = "w-full flex items-center gap-3 px-4 py-3 bg-slate-800 text-slate-100 rounded-lg font-semibold text-xs transition-all border border-slate-700/50";
    if (tabAssistant) tabAssistant.className = "w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 rounded-lg font-semibold text-xs transition-all border border-transparent";
    if (tabMindmap) tabMindmap.className = "w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 rounded-lg font-semibold text-xs transition-all border border-transparent";
    if (tabNotebook) tabNotebook.className = "w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 rounded-lg font-semibold text-xs transition-all border border-transparent";
  } else if (target === 'assistant') {
    if (assistantView) assistantView.classList.remove('hidden');
    if (homeView) homeView.classList.add('hidden');
    if (mindmapView) mindmapView.classList.add('hidden');
    if (notebookView) notebookView.classList.add('hidden');

    // Update active tab styles
    if (tabAssistant) tabAssistant.className = "w-full flex items-center gap-3 px-4 py-3 bg-slate-800 text-slate-100 rounded-lg font-semibold text-xs transition-all border border-slate-700/50";
    if (tabHome) tabHome.className = "w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 rounded-lg font-semibold text-xs transition-all border border-transparent";
    if (tabMindmap) tabMindmap.className = "w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 rounded-lg font-semibold text-xs transition-all border border-transparent";
    if (tabNotebook) tabNotebook.className = "w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 rounded-lg font-semibold text-xs transition-all border border-transparent";

    // Refresh icons inside assistant and snap to bottom
    if (typeof lucide !== 'undefined') lucide.createIcons();
    scrollToBottom();
  } else if (target === 'mindmap') {
    if (mindmapView) mindmapView.classList.remove('hidden');
    if (homeView) homeView.classList.add('hidden');
    if (assistantView) assistantView.classList.add('hidden');
    if (notebookView) notebookView.classList.add('hidden');

    // Update active tab styles
    if (tabMindmap) tabMindmap.className = "w-full flex items-center gap-3 px-4 py-3 bg-slate-800 text-slate-100 rounded-lg font-semibold text-xs transition-all border border-slate-700/50";
    if (tabHome) tabHome.className = "w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 rounded-lg font-semibold text-xs transition-all border border-transparent";
    if (tabAssistant) tabAssistant.className = "w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 rounded-lg font-semibold text-xs transition-all border border-transparent";
    if (tabNotebook) tabNotebook.className = "w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 rounded-lg font-semibold text-xs transition-all border border-transparent";

    if (typeof lucide !== 'undefined') lucide.createIcons();
    
    // Draw connectors after layout finishes rendering
    setTimeout(() => {
      drawConnectors(currentMindMapIndex);
    }, 50);
  } else if (target === 'notebook') {
    if (notebookView) notebookView.classList.remove('hidden');
    if (homeView) homeView.classList.add('hidden');
    if (assistantView) assistantView.classList.add('hidden');
    if (mindmapView) mindmapView.classList.add('hidden');

    // Update active tab styles
    if (tabNotebook) tabNotebook.className = "w-full flex items-center gap-3 px-4 py-3 bg-slate-800 text-slate-100 rounded-lg font-semibold text-xs transition-all border border-slate-700/50";
    if (tabHome) tabHome.className = "w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 rounded-lg font-semibold text-xs transition-all border border-transparent";
    if (tabAssistant) tabAssistant.className = "w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 rounded-lg font-semibold text-xs transition-all border border-transparent";
    if (tabMindmap) tabMindmap.className = "w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 rounded-lg font-semibold text-xs transition-all border border-transparent";

    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
}

// Attach Tab Navigation Event Listeners
if (tabHome) tabHome.addEventListener('click', () => switchTab('home'));
if (tabAssistant) tabAssistant.addEventListener('click', () => switchTab('assistant'));
if (tabMindmap) tabMindmap.addEventListener('click', () => switchTab('mindmap'));
if (tabNotebook) tabNotebook.addEventListener('click', () => switchTab('notebook'));
if (btnStartChat) btnStartChat.addEventListener('click', () => switchTab('assistant'));

// =====================================================================
//   MIND MAP / MAPAS CONCEPTUALES MODULE
// =====================================================================

// Parser: Convert Markdown to JSON tree hierarchy
function parseMindMapMD(mdText) {
  const lines = mdText.split('\n');
  const chapters = [];
  let currentChapter = null;
  let currentSection = null;
  let currentTopic = null;

  for (let line of lines) {
    line = line.replace('\r', '').trimEnd();
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Detect Chapter: "## CAPÍTULO"
    if (trimmed.startsWith('## CAPÍTULO')) {
      const name = trimmed.replace('## CAPÍTULO', '').trim();
      currentChapter = {
        title: (currentLanguage === 'en' ? "Chapter " : "Capítulo ") + name,
        sections: [],
        expanded: true
      };
      chapters.push(currentChapter);
      currentSection = null;
      currentTopic = null;
    }
    // Detect Section: "### "
    else if (trimmed.startsWith('### ')) {
      if (!currentChapter) continue;
      const name = trimmed.replace('### ', '').trim();
      currentSection = {
        title: name,
        topics: [],
        expanded: false
      };
      currentChapter.sections.push(currentSection);
      currentTopic = null;
    }
    // Detect Topic (Starts with - or * with 0 spaces indent)
    else if ((line.startsWith('- ') || line.startsWith('* ')) && !line.startsWith('  ')) {
      if (!currentSection) continue;
      
      const content = trimmed.substring(2).trim();
      let title = content;
      let detailItem = null;

      // Extract **Title**: Detail if formatted
      if (content.startsWith('**')) {
        const doubleAsteriskIndex = content.indexOf('**', 2);
        if (doubleAsteriskIndex !== -1) {
          let rawTitle = content.substring(2, doubleAsteriskIndex).trim();
          let rawDetail = content.substring(doubleAsteriskIndex + 2).trim();
          
          if (rawTitle.endsWith(':')) {
            rawTitle = rawTitle.slice(0, -1).trim();
          }
          
          title = rawTitle;
          if (rawDetail) {
            detailItem = rawDetail;
          }
        }
      }
      
      currentTopic = {
        title: title,
        details: [],
        expanded: false
      };
      
      if (detailItem) {
        currentTopic.details.push(detailItem);
      }
      
      currentSection.topics.push(currentTopic);
    }
    // Detect Detail (Starts with 2+ spaces followed by - or *)
    else if (line.startsWith('  ') && (trimmed.startsWith('- ') || trimmed.startsWith('* '))) {
      if (!currentTopic) continue;
      let detail = trimmed.substring(2).trim();
      if (detail.startsWith('**') && detail.endsWith('**')) {
        detail = detail.substring(2, detail.length - 2).trim();
      }
      currentTopic.details.push(detail);
    }
  }
  return chapters;
}

// Render: Generate the recursive DOM structure of the map
function renderMindMap(chapterIndex) {
  if (!parsedMindMapData || !parsedMindMapData[chapterIndex]) return;
  const chapter = parsedMindMapData[chapterIndex];
  const theme = chapterThemes[chapterIndex] || chapterThemes[0];
  
  if (mindmapSVG) mindmapSVG.innerHTML = '';
  if (mindmapTreeRoot) mindmapTreeRoot.innerHTML = '';

  const treeHTML = buildTreeHTML(chapter, theme);
  if (mindmapTreeRoot) {
    mindmapTreeRoot.innerHTML = treeHTML;
  }

  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Draw curves after browser layout is computed
  setTimeout(() => {
    drawConnectors(chapterIndex);
  }, 50);
}

// HTML Builders
function buildTreeHTML(chapter, theme) {
  let html = `<div class="tree-node-container flex items-center">`;
  
  // Chapter Root card
  const rootLabel = currentLanguage === 'en' ? 'DFS Strategy' : 'Estrategia EFD';
  html += `
    <div id="node-root" class="mindmap-card mindmap-card-root" style="background: linear-gradient(135deg, ${theme.primary}, #001B44); border: 2px solid ${theme.border}; box-shadow: 0 10px 25px -5px ${theme.lightLine};">
      <div class="text-[10px] text-yellow-400 font-bold uppercase tracking-widest mb-1">${rootLabel}</div>
      <div class="text-xs md:text-sm font-extrabold uppercase leading-tight">${escapeHTML(chapter.title)}</div>
    </div>
  `;

  if (chapter.sections && chapter.sections.length > 0) {
    html += `<div class="tree-children">`;
    chapter.sections.forEach((sec, secIdx) => {
      html += buildSectionHTML(sec, secIdx, theme);
    });
    html += `</div>`;
  }

  html += `</div>`;
  return html;
}

function buildSectionHTML(section, secIdx, theme) {
  const hasChildren = section.topics && section.topics.length > 0;
  const isExpanded = section.expanded;
  
  let html = `<div class="tree-node-container flex items-center">`;
  const sectionLabel = currentLanguage === 'en' ? 'Section' : 'Sección';
  
  html += `
    <div id="node-sec-${secIdx}" class="mindmap-card mindmap-card-section bg-white text-slate-800" style="border-color: ${theme.border}; border-left-width: 4px; border-left-color: ${theme.primary};">
      <div class="text-[9px] font-bold uppercase tracking-wider mb-1" style="color: ${theme.primary};">${sectionLabel} ${secIdx + 1}</div>
      <div class="text-slate-800 leading-snug">${escapeHTML(section.title)}</div>
      ${hasChildren ? `
        <button class="node-toggle-btn" onclick="toggleNodeExpansion(event, 'sec', ${secIdx})" style="border-color: ${theme.border}; color: ${theme.primary};">
          ${isExpanded ? '−' : '＋'}
        </button>
      ` : ''}
    </div>
  `;

  if (hasChildren && isExpanded) {
    html += `<div class="tree-children">`;
    section.topics.forEach((topic, topicIdx) => {
      html += buildTopicHTML(topic, secIdx, topicIdx, theme);
    });
    html += `</div>`;
  }

  html += `</div>`;
  return html;
}

function buildTopicHTML(topic, secIdx, topicIdx, theme) {
  const hasChildren = topic.details && topic.details.length > 0;
  const isExpanded = topic.expanded;

  let html = `<div class="tree-node-container flex items-center">`;

  html += `
    <div id="node-sec-${secIdx}-topic-${topicIdx}" class="mindmap-card mindmap-card-topic bg-white text-slate-700" style="border-color: ${theme.border}; border-left-width: 3px; border-left-color: ${theme.primary};">
      <div class="leading-snug">${escapeHTML(topic.title)}</div>
      ${hasChildren ? `
        <button class="node-toggle-btn" onclick="toggleNodeExpansion(event, 'topic', ${secIdx}, ${topicIdx})" style="border-color: ${theme.border}; color: ${theme.primary};">
          ${isExpanded ? '−' : '＋'}
        </button>
      ` : ''}
    </div>
  `;

  if (hasChildren && isExpanded) {
    html += `<div class="tree-children">`;
    topic.details.forEach((detail, detIdx) => {
      html += buildDetailHTML(detail, secIdx, topicIdx, detIdx, theme);
    });
    html += `</div>`;
  }

  html += `</div>`;
  return html;
}

function buildDetailHTML(detail, secIdx, topicIdx, detIdx, theme) {
  let html = `<div class="tree-node-container flex items-center">`;
  
  html += `
    <div id="node-sec-${secIdx}-topic-${topicIdx}-det-${detIdx}" class="mindmap-card mindmap-card-detail bg-slate-50 text-slate-600" style="border-left-color: ${theme.primary};">
      <div class="leading-relaxed text-[11px]">${escapeHTML(detail)}</div>
    </div>
  `;

  html += `</div>`;
  return html;
}

// Draw Bezier connections between node cards
function drawConnectors(chapterIndex) {
  if (!mindmapSVG || !mindmapCanvas) return;
  
  const canvasRect = mindmapCanvas.getBoundingClientRect();
  const theme = chapterThemes[chapterIndex] || chapterThemes[0];
  let svgPathsHTML = '';

  const chapter = parsedMindMapData[chapterIndex];
  if (!chapter) return;

  const rootEl = document.getElementById('node-root');
  if (!rootEl) return;

  chapter.sections.forEach((sec, secIdx) => {
    const secEl = document.getElementById(`node-sec-${secIdx}`);
    if (secEl) {
      svgPathsHTML += drawCurveBetweenElements(rootEl, secEl, canvasRect, theme.line);
      
      if (sec.expanded) {
        sec.topics.forEach((topic, topicIdx) => {
          const topicEl = document.getElementById(`node-sec-${secIdx}-topic-${topicIdx}`);
          if (topicEl) {
            svgPathsHTML += drawCurveBetweenElements(secEl, topicEl, canvasRect, theme.line);
            
            if (topic.expanded) {
              topic.details.forEach((detail, detIdx) => {
                const detEl = document.getElementById(`node-sec-${secIdx}-topic-${topicIdx}-det-${detIdx}`);
                if (detEl) {
                  svgPathsHTML += drawCurveBetweenElements(topicEl, detEl, canvasRect, theme.line);
                }
              });
            }
          }
        });
      }
    }
  });

  mindmapSVG.innerHTML = svgPathsHTML;
}

function drawCurveBetweenElements(elStart, elEnd, canvasRect, strokeColor) {
  const elStartRect = elStart.getBoundingClientRect();
  const elEndRect = elEnd.getBoundingClientRect();

  // Cancel out CSS Zoom transform scale to get raw offsets relative to Canvas parent
  const px = (elStartRect.right - canvasRect.left) / mindmapZoomScale;
  const py = (elStartRect.top + elStartRect.height / 2 - canvasRect.top) / mindmapZoomScale;
  
  const cx = (elEndRect.left - canvasRect.left) / mindmapZoomScale;
  const cy = (elEndRect.top + elEndRect.height / 2 - canvasRect.top) / mindmapZoomScale;

  const dx = cx - px;
  const cp1x = px + dx * 0.4;
  const cp1y = py;
  const cp2x = px + dx * 0.6;
  const cp2y = cy;

  return `<path class="mindmap-connector-path" d="M ${px} ${py} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${cx} ${cy}" stroke="${strokeColor}" stroke-width="2.2" opacity="0.45" />`;
}

// Toggle expansion state dynamically
window.toggleNodeExpansion = function(event, type, secIdx, topicIdx) {
  if (event) event.stopPropagation();
  const chapter = parsedMindMapData[currentMindMapIndex];
  if (!chapter) return;

  if (type === 'sec') {
    chapter.sections[secIdx].expanded = !chapter.sections[secIdx].expanded;
  } else if (type === 'topic') {
    chapter.sections[secIdx].topics[topicIdx].expanded = !chapter.sections[secIdx].topics[topicIdx].expanded;
  }
  
  renderMindMap(currentMindMapIndex);
};

// Zoom logic
function updateZoom(newScale) {
  mindmapZoomScale = Math.max(0.4, Math.min(1.6, newScale));
  
  if (mindmapCanvas) {
    mindmapCanvas.style.transform = `scale(${mindmapZoomScale})`;
  }

  if (mindmapZoomIndicator) {
    mindmapZoomIndicator.textContent = `${Math.round(mindmapZoomScale * 100)}%`;
  }

  drawConnectors(currentMindMapIndex);
}

// Expand / Collapse All nodes at once
function expandAllNodes() {
  const chapter = parsedMindMapData[currentMindMapIndex];
  if (!chapter) return;

  chapter.sections.forEach(sec => {
    sec.expanded = true;
    sec.topics.forEach(topic => {
      topic.expanded = true;
    });
  });

  renderMindMap(currentMindMapIndex);
}

// Collapse All nodes at once
function collapseAllNodes() {
  const chapter = parsedMindMapData[currentMindMapIndex];
  if (!chapter) return;

  chapter.sections.forEach(sec => {
    sec.expanded = false;
    sec.topics.forEach(topic => {
      topic.expanded = false;
    });
  });

  renderMindMap(currentMindMapIndex);
}

// Drag to Scroll / Panning setup
if (mindmapViewport) {
  // Mouse-based drag panning
  mindmapViewport.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return; // Only drag on left click
    if (e.target.closest('.mindmap-card') || e.target.closest('button') || e.target.closest('select')) return;

    isDraggingMindmap = true;
    mindmapViewport.style.cursor = 'grabbing';
    startDragX = e.pageX - mindmapViewport.offsetLeft;
    startDragY = e.pageY - mindmapViewport.offsetTop;
    scrollLeftStart = mindmapViewport.scrollLeft;
    scrollTopStart = mindmapViewport.scrollTop;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDraggingMindmap) return;
    e.preventDefault();
    const x = e.pageX - mindmapViewport.offsetLeft;
    const y = e.pageY - mindmapViewport.offsetTop;
    const walkX = (x - startDragX);
    const walkY = (y - startDragY);
    mindmapViewport.scrollLeft = scrollLeftStart - walkX;
    mindmapViewport.scrollTop = scrollTopStart - walkY;
  });

  window.addEventListener('mouseup', () => {
    if (isDraggingMindmap) {
      isDraggingMindmap = false;
      if (mindmapViewport) {
        mindmapViewport.style.cursor = 'grab';
      }
    }
  });

  // Touch-based drag panning for mobile/tablet devices
  mindmapViewport.addEventListener('touchstart', (e) => {
    if (e.target.closest('.mindmap-card') || e.target.closest('button') || e.target.closest('select')) return;
    isDraggingMindmap = true;
    const touch = e.touches[0];
    startDragX = touch.pageX - mindmapViewport.offsetLeft;
    startDragY = touch.pageY - mindmapViewport.offsetTop;
    scrollLeftStart = mindmapViewport.scrollLeft;
    scrollTopStart = mindmapViewport.scrollTop;
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDraggingMindmap) return;
    const touch = e.touches[0];
    const x = touch.pageX - mindmapViewport.offsetLeft;
    const y = touch.pageY - mindmapViewport.offsetTop;
    const walkX = (x - startDragX);
    const walkY = (y - startDragY);
    mindmapViewport.scrollLeft = scrollLeftStart - walkX;
    mindmapViewport.scrollTop = scrollTopStart - walkY;
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDraggingMindmap = false;
  });
}

// Window resize connection drawing update
window.addEventListener('resize', () => {
  if (mindmapView && !mindmapView.classList.contains('hidden')) {
    drawConnectors(currentMindMapIndex);
  }
});

// Initialization
async function initMindMap() {
  try {
    const filename = currentLanguage === 'en' ? '/Mind Map_EFD_consolidado_en.md' : '/Mind Map_EFD_consolidado.md';
    const response = await fetch(filename);
    if (!response.ok) {
      const errorMsg = currentLanguage === 'en' 
        ? "Could not load the consolidated mind map file."
        : "No se pudo cargar el archivo consolidado de Mapas Conceptuales.";
      throw new Error(errorMsg);
    }
    const text = await response.text();
    parsedMindMapData = parseMindMapMD(text);
    
    // Select changed listener
    if (mindmapChapterSelector) {
      mindmapChapterSelector.addEventListener('change', (e) => {
        currentMindMapIndex = parseInt(e.target.value, 10);
        
        // Reset scale and scroll positions
        mindmapZoomScale = 1.0;
        if (mindmapCanvas) mindmapCanvas.style.transform = 'scale(1)';
        if (mindmapZoomIndicator) mindmapZoomIndicator.textContent = '100%';
        if (mindmapViewport) {
          mindmapViewport.scrollLeft = 0;
          mindmapViewport.scrollTop = 0;
        }
        
        renderMindMap(currentMindMapIndex);
      });
    }

    // Zoom Button Listeners
    if (mindmapZoomInBtn) mindmapZoomInBtn.addEventListener('click', () => updateZoom(mindmapZoomScale + 0.1));
    if (mindmapZoomOutBtn) mindmapZoomOutBtn.addEventListener('click', () => updateZoom(mindmapZoomScale - 0.1));
    if (mindmapZoomResetBtn) mindmapZoomResetBtn.addEventListener('click', () => {
      mindmapZoomScale = 1.0;
      if (mindmapCanvas) mindmapCanvas.style.transform = 'scale(1)';
      if (mindmapZoomIndicator) mindmapZoomIndicator.textContent = '100%';
      if (mindmapViewport) {
        mindmapViewport.scrollLeft = 0;
        mindmapViewport.scrollTop = 0;
      }
      drawConnectors(currentMindMapIndex);
    });

    // Expand / Collapse listeners
    if (mindmapExpandAllBtn) mindmapExpandAllBtn.addEventListener('click', expandAllNodes);
    if (mindmapCollapseAllBtn) mindmapCollapseAllBtn.addEventListener('click', collapseAllNodes);

    // Initial render
    renderMindMap(currentMindMapIndex);

  } catch (err) {
    console.error("Error al cargar los mapas conceptuales:", err);
    if (mindmapTreeRoot) {
      const errorTitle = currentLanguage === 'en' ? 'Load Error' : 'Error de Carga';
      const errorDesc = currentLanguage === 'en'
        ? 'Could not load or process the consolidated mind map on the server.'
        : 'No se pudo cargar o procesar el mapa conceptual consolidado en el servidor.';
      mindmapTreeRoot.innerHTML = `
        <div class="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl max-w-xl mx-auto mt-10">
          <h4 class="font-bold flex items-center gap-2"><i data-lucide="alert-triangle" class="w-5 h-5"></i> ${errorTitle}</h4>
          <p class="text-xs mt-2 leading-relaxed">${errorDesc}</p>
        </div>
      `;
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
  }
}

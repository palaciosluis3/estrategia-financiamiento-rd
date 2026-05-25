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
const tabNotebook = document.getElementById('tab-notebook');
const homeView = document.getElementById('home-view');
const assistantView = document.getElementById('assistant-view');
const notebookView = document.getElementById('notebook-view');
const btnStartChat = document.getElementById('btn-start-chat');

// Strategic Questions mapping by Document Source
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

  const suggestions = suggestionsBySource[sourceKey] || suggestionsBySource["all"];
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

// Initialize Lucide Icons and Dynamic Suggestions at startup
document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  // Render the initial suggestions based on the active selector value (usually 'all')
  if (sourceSelector) {
    renderDynamicSuggestions(sourceSelector.value);
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
      btnElement.innerHTML = `
        <i data-lucide="check" class="w-3.5 h-3.5 text-emerald-500"></i>
        <span class="text-[10px] font-bold text-emerald-500">COPIADO</span>
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
    appendSystemBanner(`Conexión cambiada a: ${sourceName}. Nueva sesión de contexto iniciada.`);

    // Save to visual history as a system notification
    visualHistory.push({
      role: 'system',
      text: `— Conexión cambiada a: ${sourceName}. Nueva sesión de contexto iniciada. —`
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
    bubbleWrapper.innerHTML = `
      <div class="bg-slate-200 text-slate-800 p-4 px-6 rounded-2xl rounded-tr-none max-w-[80%] shadow-sm group-hover:shadow-md transition-shadow">
        <p class="font-medium text-sm md:text-base whitespace-pre-wrap leading-relaxed">${escapeHTML(text)}</p>
      </div>
      <span class="text-[10px] font-bold text-slate-400 mr-2 flex items-center gap-1">
        ${timestamp} · Enviado
      </span>
    `;
  } else {
    // Bot RAG response markup with clipboard copy utilities and marked.js MD rendering
    const textBase64 = btoa(unescape(encodeURIComponent(text)));
    const parsedHTML = typeof marked !== 'undefined' ? marked.parse(text) : escapeHTML(text);

    bubbleWrapper.innerHTML = `
      <div class="bg-white border border-slate-200/60 p-6 md:p-8 rounded-2xl rounded-tl-none max-w-[90%] shadow-lg relative overflow-hidden group">
        <!-- Sidebar Gold/Blue Accent lines -->
        <div class="absolute top-0 left-0 w-1.5 h-full bg-dominican-blue"></div>
        
        <!-- Bubble Header Actions -->
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center gap-2">
            <i data-lucide="sparkles" class="w-4 h-4 text-dominican-gold"></i>
            <span class="text-[10px] font-bold text-dominican-blue uppercase tracking-widest">Respuesta AI Institucional</span>
          </div>
          <button onclick="copyToClipboard('${textBase64}', this)" class="p-2 hover:bg-slate-50 hover:border-slate-300 rounded-lg border border-slate-200/60 transition-all flex items-center gap-1.5 text-slate-500">
            <i data-lucide="copy" class="w-3.5 h-3.5"></i>
            <span class="text-[9px] font-bold">COPIAR DATOS</span>
          </button>
        </div>
        
        <!-- Rich Markdown Body Content -->
        <div class="prose-custom text-slate-600 leading-relaxed text-sm md:text-base space-y-4">
          ${parsedHTML}
        </div>
      </div>
      
      <span class="text-[10px] font-bold text-slate-400 ml-2">
        ${timestamp} · Asistente IA
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
  typingIndicator.innerHTML = `
    <div class="bg-white border border-slate-200 p-4 px-6 rounded-2xl rounded-tl-none shadow-md flex items-center gap-2">
      <div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0s"></div>
      <div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.15s"></div>
      <div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.3s"></div>
      <span class="text-xs text-slate-400 font-semibold ml-2">Analizando base de conocimientos...</span>
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
        current_source: activeSource
      })
    });

    // Remove typing indicator
    const indicatorEl = document.getElementById('typing-indicator');
    if (indicatorEl) indicatorEl.remove();

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Fallo en la comunicación con el servidor.");
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
    errorBubble.innerHTML = `
      <i data-lucide="alert-triangle" class="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5"></i>
      <div class="space-y-1">
        <h4 class="text-xs font-bold uppercase tracking-wider">Error Técnico de Conexión</h4>
        <p class="text-xs leading-relaxed font-semibold">${escapeHTML(error.message)}</p>
        <span class="text-[10px] text-red-400 block mt-1">Por favor verifica que la variable de entorno GEMINI_API_KEY esté configurada e intenta de nuevo.</span>
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
    alert("No hay mensajes en la conversación para exportar.");
    return;
  }

  let txtContent = `=========================================================\n`;
  txtContent += `ESTRATEGIA DE FINANCIAMIENTO PARA EL DESARROLLO - MARCO NACIONAL INTEGRADO DE FINANCIAMIENTO\n`;
  txtContent += `HISTORIAL DE CONSULTAS\n`;
  txtContent += `Generado el: ${new Date().toLocaleString()}\n`;
  txtContent += `=========================================================\n\n`;

  visualHistory.forEach((msg, index) => {
    if (msg.role === 'user') {
      txtContent += `[USUARIO]: ${msg.text}\n\n`;
    } else if (msg.role === 'bot') {
      txtContent += `[SISTEMA AI]:\n${msg.text}\n\n`;
      txtContent += `---------------------------------------------------------\n\n`;
    } else if (msg.role === 'system') {
      txtContent += `[NOTIFICACIÓN]: ${msg.text}\n\n`;
    }
  });

  txtContent += `=========================================================\n`;
  txtContent += `Fin del documento exportado. INFF-RD.\n`;

  // Trigger file download
  const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Historial_consultas_EFD_${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

// Event Listener: Clear Conversation with confirmation click tracking
clearChatBtn.addEventListener('click', () => {
  if (visualHistory.length === 0) {
    alert("La conversación ya está vacía.");
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

// Tab Switching Controller (Home Landing vs RAG Assistant vs NotebookLM Guide)
function switchTab(target) {
  if (target === 'home') {
    if (homeView) homeView.classList.remove('hidden');
    if (assistantView) assistantView.classList.add('hidden');
    if (notebookView) notebookView.classList.add('hidden');

    // Update active tab styles
    if (tabHome) tabHome.className = "w-full flex items-center gap-3 px-4 py-3 bg-slate-800 text-slate-100 rounded-lg font-semibold text-xs transition-all border border-slate-700/50";
    if (tabAssistant) tabAssistant.className = "w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 rounded-lg font-semibold text-xs transition-all border border-transparent";
    if (tabNotebook) tabNotebook.className = "w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 rounded-lg font-semibold text-xs transition-all border border-transparent";
  } else if (target === 'assistant') {
    if (assistantView) assistantView.classList.remove('hidden');
    if (homeView) homeView.classList.add('hidden');
    if (notebookView) notebookView.classList.add('hidden');

    // Update active tab styles
    if (tabAssistant) tabAssistant.className = "w-full flex items-center gap-3 px-4 py-3 bg-slate-800 text-slate-100 rounded-lg font-semibold text-xs transition-all border border-slate-700/50";
    if (tabHome) tabHome.className = "w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 rounded-lg font-semibold text-xs transition-all border border-transparent";
    if (tabNotebook) tabNotebook.className = "w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 rounded-lg font-semibold text-xs transition-all border border-transparent";

    // Refresh icons inside assistant and snap to bottom
    if (typeof lucide !== 'undefined') lucide.createIcons();
    scrollToBottom();
  } else if (target === 'notebook') {
    if (notebookView) notebookView.classList.remove('hidden');
    if (homeView) homeView.classList.add('hidden');
    if (assistantView) assistantView.classList.add('hidden');

    // Update active tab styles
    if (tabNotebook) tabNotebook.className = "w-full flex items-center gap-3 px-4 py-3 bg-slate-800 text-slate-100 rounded-lg font-semibold text-xs transition-all border border-slate-700/50";
    if (tabHome) tabHome.className = "w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 rounded-lg font-semibold text-xs transition-all border border-transparent";
    if (tabAssistant) tabAssistant.className = "w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 rounded-lg font-semibold text-xs transition-all border border-transparent";

    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
}

// Attach Tab Navigation Event Listeners
if (tabHome) tabHome.addEventListener('click', () => switchTab('home'));
if (tabAssistant) tabAssistant.addEventListener('click', () => switchTab('assistant'));
if (tabNotebook) tabNotebook.addEventListener('click', () => switchTab('notebook'));
if (btnStartChat) btnStartChat.addEventListener('click', () => switchTab('assistant'));

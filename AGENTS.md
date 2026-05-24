# 🤖 Manual de Contexto y Transferencia para Agentes de IA (AGENTS.md)

Este documento sirve como puente de contexto para cualquier agente de IA (Antigravity o similar) que retome el desarrollo, mantenimiento o escalabilidad de este portal en futuras sesiones.

---

## 📋 Resumen del Proyecto
* **Nombre**: Portal Web de Consulta de la Estrategia de Financiamiento para el Desarrollo (EFD) - República Dominicana.
* **Propósito**: Herramienta interactiva e institucional que combina un landing informativo con un asistente virtual inteligente dotado de arquitectura RAG local para responder consultas oficiales basándose estrictamente en los documentos del marco normativo nacional sin riesgo de alucinaciones.

---

## 🛠️ Stack Tecnológico y Arquitectura

La aplicación está diseñada como una arquitectura híbrida integrada sumamente ligera y eficiente para facilitar su despliegue y portabilidad:

### 1. Frontend (Cliente)
* **Core**: HTML5 semántico e interactivo.
* **Estilos**: Vanilla CSS personalizado (`style.css`) combinado con **Tailwind CSS** (vía CDN) para un diseño de interfaz altamente premium, pulido y responsive.
* **Iconografía**: **Lucide Icons** (cargado vía CDN de forma dinámica mediante JavaScript).
* **Renderizador de Texto**: **Marked.js** (CDN) para parsear y renderizar las respuestas institucionales del chatbot en formato Markdown de manera impecable y legible (prose-custom).
* **Navegación**: Sistema de pestaña única SPA (Single Page Application) de tres paneles controlada por estados JS (`home-view`, `assistant-view` y `notebook-view`) para alternar al instante sin recargas de página.
* **Interactividad 3D**: Tarjetas animadas con giro 3D tridimensional en la cuadrícula de capítulos de la home, con reversos conteniendo badges responsivos para los conceptos clave.

### 2. Backend (Servidor de Inferencia RAG)
* **Core**: **FastAPI** (Python 3) estructurado en `api/index.py` preparado para ejecución serverless (en Vercel) o ejecución local con **Uvicorn**.
* **Motor AI**: API oficial de Google Gemini, configurada actualmente con el modelo económico, rápido y de amplio contexto: **`gemini-2.5-flash`** (o `gemini-3.1-flash-lite` según disponibilidad).
* **Aislamiento**: Las credenciales (`GEMINI_API_KEY`) se cargan de forma segura desde el archivo local `.env` aislado en el servidor backend, de modo que el cliente web nunca está expuesto.

---

## 📂 Estructura de la Base de Conocimientos (RAG local)

Los documentos oficiales de la estrategia están almacenados en formato Markdown dentro del directorio `/content`:
1. `Estrategia de financiamiento de Republica Dominicana - Índice.md`
2. `Estrategia de financiamiento de Republica Dominicana - Resumen Ejecutivo.md`
3. `Estrategia de financiamiento de Republica Dominicana - Capítulo 1.md` (Entorno Macroeconómico)
4. `Estrategia de financiamiento de Republica Dominicana - Capítulo 2.md` (Finanzas Públicas Domésticas)
5. `Estrategia de financiamiento de Republica Dominicana - Capítulo 3.md` (Finanzas Públicas Internacionales)
6. `Estrategia de financiamiento de Republica Dominicana - Capítulo 4.md` (Financiamiento Privado Doméstico)
7. `Estrategia de financiamiento de Republica Dominicana - Capítulo 5.md` (Financiamiento Privado Internacional)
8. `Estrategia de financiamiento de Republica Dominicana - Capítulo 6.md` (Instrumentos Alternativos)
9. `Estrategia de financiamiento de Republica Dominicana - Capítulo 7.md` (Gobernanza y Monitoreo)

> [!IMPORTANT]
> **Filtro del compilador en RAG ("Todo el documento")**:
> En `api/index.py`, cuando la fuente RAG activa seleccionada es `"all"` (Todo el documento), el backend compila el contenido de todos los capítulos en un solo contexto gigante para Gemini. Sin embargo, por diseño y lógica de negocio, **excluye explícitamente el `Resumen Ejecutivo` y el `Índice`** de esta concatenación para evitar solapamientos e redundancia de información.

---

## ⚡ Reglas de Flujo y Reactividad en el Frontend (`script.js`)

Si editas el comportamiento interactivo del chat o los componentes en `script.js`, ten en cuenta estas cuatro reglas críticas de diseño:

1. **Aislamiento del Historial de Chat (`visualHistory`)**:
   El estado dinámico del panel de bienvenida (`welcome-panel`) se controla en función de la longitud del historial visual (`visualHistory.length === 0`).
2. **Exploración Limpia (Sin Banners en Chat Vacío)**:
   Al cambiar de capítulo en el selector desplegable:
   * **Si el chat está vacío**: El panel se mantiene en pantalla y las sugerencias correspondientes al capítulo seleccionado se cargan instantáneamente de forma interactiva y limpia. **No** se inyecta ningún banner de sistema acumulado en el log.
   * **Si el chat tiene mensajes activos**: Se limpian de forma segura los contextos de la API, se oculta el panel de bienvenida y se inserta de forma transparente el aviso visual de cambio de conexión e inicio de nueva sesión.
3. **Estandarización de Lucide Icons**:
   Para prevenir iconos invisibles o rotos debido a incompatibilidades de versiones del CDN, mantén estrictamente los nombres universales de Lucide implementados:
   * **Correcto**: `bar-chart-2` (No `bar-chart-3` ni `bar-chart-horizontal`).
   * **Correcto**: `vault` (No `safe`).
   * **Correcto**: `globe` (No `globe-2`).
   * **Correcto**: `leaf`, `file-text`, `award`, `landmark`, `activity`, `trending-up`, `book-open`, `user`, `mail`, `combine`.
4. **Interactividad 3D y Evitación de Solapamientos**:
   * Las tarjetas en la cuadrícula del `home-view` (Capítulos 1-5) usan animaciones 3D. Para asegurar un renderizado exacto, las caras frontal y posterior del elemento `.flip-card-inner` deben tener ancladas sus posiciones con `top: 0; left: 0;` en `style.css`.
   * Para evitar que la rotación sea tapada por tarjetas vecinas de la cuadrícula inferior, el elemento `.flip-card` activo debe levantar dinámicamente su capa de apilamiento a `z-index: 30` en estado `:hover`.
   * El Capítulo 7 está diseñado como un banner horizontal de rejilla completa (`md:col-span-2 lg:col-span-3`) para equilibrar visualmente la maquetación.
   * La pestaña **Guía NotebookLM** (`notebook-view`) integra un botón CTA para descargar de forma unificada los capítulos comprimidos en `public/Capitulos_EFD_Markdown.zip` optimizados para cargarse directamente en la plataforma externa.

---

## 🚀 Puesta en Marcha Local (Windows)

El portal cuenta con un iniciador automatizado en la raíz del proyecto:

```bash
.\run.bat
```

* **Acción**: Instala y actualiza automáticamente los requisitos (`FastAPI`, `Uvicorn`, `google-genai`, etc.), detecta el archivo `.env` cargando la API Key de Gemini y arranca el portal de forma unificada (servidor de estáticos y API RAG en el mismo socket).
* **Dirección Local de Operación**:
  👉 Portal Web UI: **`http://127.0.0.1:3080`**
  👉 Health check del Backend: **`http://127.0.0.1:3080/api/health`**

---

## 🔮 Futuras Mejoras Planificadas

Si eres el agente de IA que retoma este proyecto, considera las siguientes sugerencias para próximas fases:
* **Fase 4 - Historial Persistente**: Integrar LocalStorage o SQLite local para persistir conversaciones guardadas.
* **Fase 5 - Carga de PDF**: Habilitar un parser de carga para que el usuario pueda añadir/actualizar PDFs dinámicos en la UI.
* **Fase 6 - Gráficas Interactivas**: Utilizar un CDN de Chart.js para renderizar los KPIs en tiempo real a partir de las respuestas del modelo.

# Estrategia de Financiamiento para el Desarrollo - República Dominicana

Una aplicación web interactiva que proporciona acceso a la Estrategia de Financiamiento para el Desarrollo de la República Dominicana, con capacidades de búsqueda inteligente mediante IA.

## 📋 Descripción del Proyecto

Este proyecto es un portal RAG (Retrieval-Augmented Generation) que permite a los usuarios explorar y consultar el contenido completo de la Estrategia de Financiamiento para el Desarrollo de República Dominicana a través de una interfaz conversacional impulsada por Google Gemini AI.

## ✨ Características Principales

- **Interfaz Web Moderna**: Diseño responsive construido con Tailwind CSS
- **Chat Inteligente**: Asistente conversacional basado en IA para responder preguntas sobre el documento
- **Contenido Estructurado**: 7 capítulos más resumen ejecutivo e índice en formato Markdown
- **Búsqueda Contextual**: El sistema recupera información relevante del contenido para generar respuestas precisas
- **Descargas Disponibles**: PDF completo del documento y archivos Markdown por capítulo

## 🏗️ Estructura del Proyecto

```
/workspace
├── index.html              # Página principal de la aplicación
├── style.css               # Estilos personalizados
├── script.js               # Lógica del frontend y comunicación con la API
├── favicon.ico/png/svg     # Iconos de la aplicación
├── requirements.txt        # Dependencias de Python
├── vercel.json            # Configuración de despliegue en Vercel
├── api/
│   └── index.py           # Backend FastAPI con integración Gemini AI
├── content/
│   ├── Índice.md
│   ├── Resumen Ejecutivo.md
│   ├── Capítulo 1.md - Capítulo 7.md
│   └── ...                # Contenido markdown de la estrategia
└── downloads/
    ├── Estrategia de financiamiento RD.pdf
    └── Capitulos_EFD_Markdown.zip
```

## 🚀 Despliegue en Vercel

Este proyecto está configurado para desplegarse en [Vercel](https://vercel.com):

1. Conecta tu repositorio a Vercel
2. Configura la variable de entorno `GEMINI_API_KEY` con tu clave de API de Google Gemini
3. Despliega automáticamente

### Variables de Entorno Requeridas

| Variable | Descripción |
|----------|-------------|
| `GEMINI_API_KEY` | Clave de API de Google Gemini para el servicio de IA |

## 🛠️ Desarrollo Local

### Prerrequisitos

- Python 3.8+
- Node.js (opcional, solo para servir el frontend estático)
- Cuenta de Google AI Studio para obtener una API Key

### Instalación del Backend

```bash
# Instalar dependencias de Python
pip install -r requirements.txt

# Establecer la variable de entorno
export GEMINI_API_KEY="tu-clave-api-aqui"

# Ejecutar el servidor localmente (para testing)
uvicorn api.index:app --reload
```

### Ejecutar el Frontend

Puedes abrir directamente `index.html` en tu navegador o usar un servidor local:

```bash
# Usando Python
python -m http.server 8000

# O usando Node.js
npx serve .
```

Accede a la aplicación en `http://localhost:8000`

## 📦 Dependencias

### Backend (Python)
- **FastAPI**: Framework web asíncrono
- **Mangum**: Adaptador para ejecutar FastAPI en serverless (AWS Lambda/Vercel)
- **google-genai**: SDK de Google para integración con Gemini AI
- **Pydantic**: Validación de datos y configuración
- **Uvicorn**: Servidor ASGI

### Frontend
- **Tailwind CSS**: Framework de estilos utilitarios
- **Lucide Icons**: Biblioteca de iconos
- **Marked.js**: Parser de Markdown
- **Google Fonts**: Fuentes Inter y Outfit

## 🔌 API Endpoints

### GET `/api/health`
Verifica el estado del servicio y la configuración de la API key.

**Respuesta:**
```json
{
  "status": "healthy",
  "api_key_configured": true,
  "content_files": ["Capítulo 1.md", "Capítulo 2.md", ...]
}
```

### POST `/api/chat`
Envía una pregunta al asistente IA y recibe una respuesta basada en el contenido.

**Request:**
```json
{
  "message": "¿Cuál es el objetivo principal de la estrategia?",
  "history": [],
  "current_source": "all"
}
```

**Response:**
```json
{
  "response": "El objetivo principal es...",
  "source_used": "Resumen Ejecutivo"
}
```

## 📄 Contenido

El documento completo incluye:

- **Índice**: Navegación estructurada del contenido
- **Resumen Ejecutivo**: Visión general de la estrategia
- **Capítulo 1**: [Título del capítulo]
- **Capítulo 2**: [Título del capítulo]
- **Capítulo 3**: [Título del capítulo]
- **Capítulo 4**: [Título del capítulo]
- **Capítulo 5**: [Título del capítulo]
- **Capítulo 6**: [Título del capítulo]
- **Capítulo 7**: [Título del capítulo]

## 📥 Descargas

- **PDF Completo**: `downloads/Estrategia de financiamiento RD.pdf`
- **Archivos Markdown**: `downloads/Capitulos_EFD_Markdown.zip`

## 🔒 Consideraciones de Seguridad

- La API key de Gemini debe mantenerse segura y nunca exponerse en el frontend
- El CORS está configurado para permitir todas las origins en desarrollo; ajustar para producción
- Las solicitudes a la API están validadas mediante modelos Pydantic

## 📝 Licencia

[Información de licencia si aplica]

## 👥 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Para preguntas o soporte técnico, por favor abre un issue en el repositorio.

---

**Nota**: Este proyecto utiliza la API de Google Gemini. Asegúrate de revisar los términos de uso y límites de la API en [Google AI Studio](https://aistudio.google.com/).

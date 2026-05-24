@echo off
title Soberania Fiscal AI - Local Development
cls

echo ====================================================================
echo   SOBERANIA FISCAL AI - ESTRATEGIA DE FINANCIAMIENTO RD
echo   Iniciador Automatizado de Entorno Local (Windows - 100%% Python)
echo ====================================================================
echo.

:: 1. Check if GEMINI_API_KEY is already set in the current shell environment
if defined GEMINI_API_KEY (
    echo [OK] Detectado GEMINI_API_KEY en las variables de entorno del sistema.
    goto check_python
)

:: 2. Check if a local .env file exists and parse it
if exist "%~dp0.env" (
    echo [INFO] Analizando archivo .env local...
    for /f "usebackq tokens=1,2 delims==" %%i in ("%~dp0.env") do (
        if "%%i"=="GEMINI_API_KEY" (
            set "GEMINI_API_KEY=%%j"
            echo [OK] GEMINI_API_KEY cargado exitosamente desde .env.
            goto check_python
        )
    )
)

:: 3. If not set, prompt the user to input the key
echo [ALERTA] No se detecto ninguna API Key de Gemini configurada.
echo.
set /p GEMINI_API_KEY="Por favor, introduzca su GEMINI_API_KEY: "
echo.

:: Clean up optional quotes from user input safely
if defined GEMINI_API_KEY (
    set "GEMINI_API_KEY=%GEMINI_API_KEY:"=%"
)

if not defined GEMINI_API_KEY (
    echo [ERROR] La clave de la API es obligatoria para el funcionamiento de RAG.
    echo Cancelando inicio local.
    echo.
    pause
    exit /b 1
)

:: Create a .env file so they don't have to write it again next time
setlocal enabledelayedexpansion
(echo GEMINI_API_KEY=!GEMINI_API_KEY!)> "%~dp0.env"
endlocal
echo [INFO] Se ha creado un archivo .env local para recordar su clave en el futuro.
echo.

:check_python
:: 4. Verify if Python is installed in the system PATH
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Python no se encuentra instalado o no esta en su variable de entorno PATH.
    echo Este servidor RAG local requiere Python 3.9+ para ejecutarse.
    echo.
    echo SUGERENCIAS DE RESOLUCION:
    echo 1. Instale Python desde la tienda oficial de Windows o desde https://www.python.org/
    echo 2. ASEGURESE de marcar la casilla "Add Python to PATH" durante la instalacion.
    echo 3. Cierre y vuelva a abrir esta consola e intente de nuevo.
    echo.
    pause
    exit /b 1
)

echo [OK] Detectado interprete de Python en el sistema.

:: 5. Install dependencies automatically via pip
echo [INFO] Verificando e instalando dependencias de Python (requirements.txt)...
echo [INFO] Por favor, espere. Esto tomara solo unos segundos...
echo.
call python -m pip install --quiet --upgrade pip
call python -m pip install -r "%~dp0requirements.txt"
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Ocurrio un error al instalar las dependencias con pip.
    echo Por favor, intente ejecutar en su consola: pip install -r requirements.txt
    echo.
    pause
    exit /b 1
)

echo [OK] Dependencias instaladas y actualizadas correctamente.
echo.

:: 6. Launch the Python uvicorn server directly
echo ====================================================================
echo   INICIANDO PORTAL DE DESARROLLO FISCAL RAG (NATIVO)...
echo   - Portal Web disponible en:  http://127.0.0.1:3080
echo   - Endpoint API en:           http://127.0.0.1:3080/api/chat
echo ====================================================================
echo.

call python "%~dp0api/index.py"

pause

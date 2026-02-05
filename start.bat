@echo off
echo Iniciando Detox 7Pro...
echo.
echo [1/2] Iniciando Servidor Backend (Porta 5000)...
start "Detox 7Pro - Backend" cmd /k "npm run server"

echo [2/2] Iniciando Frontend Vite (Porta 5173)...
start "Detox 7Pro - Frontend" cmd /k "npm run dev"

echo.
echo Tudo iniciado! O navegador deve abrir em instantes.
echo.
pause

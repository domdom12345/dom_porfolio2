@echo off
title Dominic Blancaflor - Portfolio Dev Server
echo ========================================================
echo   Starting Portfolio Dev Server on http://localhost:3000
echo ========================================================
start http://localhost:3000
powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1" -Port 3000
pause

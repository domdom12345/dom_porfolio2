@echo off
title Dominic Blancaflor - Custom Domain Launcher
echo ======================================================================
echo   Starting Dominic's Portfolio on Custom Domain:
echo   https://dominicblancaflor.loca.lt
echo ======================================================================
echo 1. Starting local universal web server...
start /min powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1" -Port 3000

echo 2. Launching custom domain: https://dominicblancaflor.loca.lt
echo (If prompted for a password by localtunnel, enter your IP: 136.158.70.96)
start https://dominicblancaflor.loca.lt
"C:\Program Files\nodejs\npx.cmd" localtunnel --port 3000 --subdomain dominicblancaflor
pause

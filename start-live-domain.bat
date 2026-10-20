@echo off
title Dominic Blancaflor - Live Cloudflare Domain Tunnel
echo ======================================================================
echo   Starting Dominic's Portfolio on a Live Public Cloudflare Domain
echo ======================================================================
echo 1. Starting local web server in background...
start /min powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1" -Port 3000

echo 2. Launching Cloudflare Tunnel for live domain...
"C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel --url http://localhost:3000
pause

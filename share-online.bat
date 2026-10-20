@echo off
title Dominic Blancaflor - Portfolio Instant Public Domain
echo ======================================================================
echo   Creating Instant Public HTTPS Domain for Dominic's Portfolio...
echo   (Make sure your local server is running on localhost:3000 first)
echo ======================================================================
ssh -o StrictHostKeyChecking=no -R 80:localhost:3000 nokey@localhost.run
pause

@echo off
setlocal enabledelayedexpansion
title Deploy Dominic's Portfolio to GitHub Pages
echo ======================================================================
echo      Deploy Dominic M. Blancaflor Portfolio to GitHub Pages
echo ======================================================================
echo.

set "GH_PATH=C:\Program Files\GitHub CLI\gh.exe"

if not exist "%GH_PATH%" (
    echo Error: GitHub CLI not found at "%GH_PATH%".
    echo Please install it or use standard git push.
    pause
    exit /b 1
)

echo [1/3] Checking GitHub login status...
"%GH_PATH%" auth status >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo.
    echo ------------------------------------------------------------------
    echo  [ACTION REQUIRED] Log in to GitHub (One-Time Setup)
    echo  A code will appear below and a browser window will open.
    echo  Simply paste the one-time code and click "Authorize".
    echo ------------------------------------------------------------------
    echo.
    "%GH_PATH%" auth login --web -h github.com -p https
)

echo.
echo [2/3] Repository Configuration
echo ------------------------------------------------------------------
echo Press ENTER to use the default name [dominic-portfolio]
echo Or type a custom name (e.g. yourusername.github.io)
echo ------------------------------------------------------------------
set /p REPO_NAME="Repository Name [dominic-portfolio]: "
if "%REPO_NAME%"=="" set REPO_NAME=dominic-portfolio

echo.
echo [3/3] Creating repository and pushing code to GitHub...
"%GH_PATH%" repo create %REPO_NAME% --public --source=. --remote=origin --push

if %ERRORLEVEL% neq 0 (
    echo.
    echo Notice: If the remote origin already existed, pushing updates...
    git push -u origin main
)

echo.
echo Enabling automated GitHub Pages deployment...
"%GH_PATH%" api -X POST "repos/{owner}/%REPO_NAME%/pages" -f build_type=workflow >nul 2>&1

echo.
echo ======================================================================
echo   DEPLOYMENT COMPLETE!
echo ======================================================================
echo.
echo Your portfolio will be live 24/7 on your permanent GitHub Pages domain!
echo Check your live deployment progress under the "Actions" tab on GitHub.
echo.
pause

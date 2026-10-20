@echo off
title Push Dominic's Portfolio to GitHub
echo ======================================================================
echo   Pushing Portfolio to https://github.com/domdom12345/dominic-portfolio
echo ======================================================================
echo.
echo If a GitHub Sign-in window pops up, click "Sign in with your browser"
echo to authorize.
echo.

git push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ======================================================================
    echo   SUCCESS! All files have been pushed to GitHub!
    echo ======================================================================
    echo.
    echo Final Step: Enable GitHub Pages
    echo 1. Opening your GitHub Pages settings in your browser...
    start https://github.com/domdom12345/dominic-portfolio/settings/pages
    echo 2. Under "Build and deployment" ^> "Source", select "GitHub Actions".
    echo.
    echo Your permanent live domain will be:
    echo https://domdom12345.github.io/dominic-portfolio/
    echo.
) else (
    echo.
    echo Push encountered an error or was canceled.
    echo If prompted to authenticate, please complete the browser sign-in.
)

pause

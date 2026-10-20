# Dominic M. Blancaflor - Interactive Portfolio & Resume Website

A modern, technology-themed, single-page interactive portfolio and resume website designed and developed for **Dominic M. Blancaflor** using HTML, React, and Tailwind CSS.

## 🚀 Features

- **Cyber-Tech Aesthetic**: Deep navy/slate background with electric cyan, neon emerald accents, glassmorphic panels, and interactive particle constellation canvas.
- **Profile Showcase**: High-resolution profile portrait with holographic tech HUD frames, status badges, and quick bio statistics.
- **Interactive AI Chatbot ("DominicBot")**:
  - Trained on Dominic's full background, education, IT troubleshooting skills, and Computer Science fundamentals.
  - Interactive prompt suggestions for visitors to test questions instantly.
  - Natural conversation simulation, typing indicator, and sound effects.
- **Interactive IT Troubleshooting Lab**: Real-world interactive simulation demonstrating Dominic's step-by-step diagnostic methodology for web UI bugs, DNS/network failures, and software crash triage.
- **Print / Export to PDF Toggle**:
  - Dedicated executive resume modal with one-click print/save as PDF trigger (`window.print()`).
  - Specially tailored `@media print` CSS delivering a clean, high-contrast, professional A4 resume.
- **Interactive Audio Effects**: Modern Web Audio API sound synthesizer with one-click mute/unmute toggle in the navigation bar.
- **Comprehensive Sections**:
  - Header & Sticky Navbar with Quick Action Pills
  - Hero Section with Dominic's portrait and fast stats
  - About & Methodology
  - Skills & Competencies with interactive category filters and animated meters
  - Practical IT Troubleshooting Simulator
  - Education Timeline (STI College Lucena & Maryhill College)
  - Direct Contact Section with copy-to-clipboard phone & email, social buttons, and live message form.

## 📁 Project Structure

```
dominic-portfolio/
├── index.html        # Main HTML shell loading React, Tailwind, fonts, and canvas
├── app.jsx           # Full React application logic, chatbot engine, and modals
├── styles.css        # Cyber-tech theme styles, animations, and @media print rules
├── deploy-to-github.bat # 1-click automated GitHub Pages deployment script
├── server.ps1        # Native Windows PowerShell development HTTP server
├── run-dev.bat       # Double-click launcher to preview locally
├── start-live-domain.bat # Launch Cloudflare public domain tunnel
├── start-dominicblancaflor-domain.bat # Launch custom domain tunnel
├── README.md         # Documentation
└── assets/
    └── dominic.jpg   # Dominic's profile photo
```

## 💻 How to Run the Development Server

### Option 1: Double-Click Launcher
Double-click `run-dev.bat` in the project directory. It will start the server and automatically open your default browser to `http://localhost:3000`.

### Option 2: PowerShell Command
```powershell
powershell -ExecutionPolicy Bypass -File .\server.ps1 -Port 3000
```
Open your browser and navigate to:
```
http://localhost:3000
```

## 📄 Personal Details Configured
- **Name**: Dominic M. Blancaflor
- **Birthdate**: May 20, 2004
- **Education**: 
  - Maryhill College (Elementary, High School, Senior High School)
  - STI College Lucena (1st Year to 4th Year College — BS in Computer Science)
- **Skills**: Simple Troubleshooting, HTML/CSS for UI Design, Web Application Testing, System Configuration, End-User Assistance
- **Contact**: 
  - Phone: `09602081080`
  - Email: `dominicblancaflor5@gmail.com`
  - Social: Dominic M. Blancaflor

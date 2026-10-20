const { useState, useEffect, useRef } = React;

// --- Sound Synthesizer Utility (Web Audio API) ---
class SoundManager {
  constructor() {
    this.ctx = null;
    this.enabled = false;
  }
  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }
  toggle() {
    this.init();
    this.enabled = !this.enabled;
    if (this.enabled && this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.enabled;
  }
  playBeep(freq = 440, type = 'sine', duration = 0.08, volume = 0.05) {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  }
  click() {
    this.playBeep(600, 'triangle', 0.04, 0.03);
  }
  pop() {
    this.playBeep(850, 'sine', 0.06, 0.04);
  }
  success() {
    this.playBeep(520, 'sine', 0.08, 0.04);
    setTimeout(() => this.playBeep(780, 'sine', 0.12, 0.05), 80);
  }
}

const sounds = new SoundManager();

// --- SVG Icons (Self-Contained & Crisp) ---
const Icons = {
  Terminal: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Cpu: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
    </svg>
  ),
  Wrench: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Code: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  GraduationCap: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
  ),
  Printer: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
    </svg>
  ),
  Bot: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Phone: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  Mail: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Check: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  Copy: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  ExternalLink: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  ),
  Sparkles: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  Volume: ({ enabled }) => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      {enabled ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zM17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
      )}
    </svg>
  ),
  Send: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  ),
  Close: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Download: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  )
};

// --- Personal Profile Data ---
const PROFILE = {
  name: "Dominic M. Blancaflor",
  title: "Computer Science Student & IT Support Specialist",
  birthdate: "May 20, 2004",
  age: "22",
  location: "Lucena City, Quezon, Philippines",
  phone: "09602081080",
  email: "dominicblancaflor5@gmail.com",
  facebook: "Dominic M. Blancaflor",
  instagram: "@dominicblancaflor",
  photo: "assets/dominic.jpg",
  summary:
    "Computer Science student with experience in software troubleshooting, web application testing, and end-user assistance. Adept at diagnosing software bugs, resolving system configuration issues, and communicating complex technical solutions to non-technical users. Dedicated to delivering fast, efficient, and reliable IT support.",
  skills: [
    { name: "Simple Troubleshooting", category: "support", level: 92, desc: "Diagnosing hardware/software conflicts, system repair, and bug identification." },
    { name: "HTML/CSS for UI Design", category: "web", level: 88, desc: "Crafting modern, accessible, responsive interfaces using HTML5 and modern CSS/Tailwind." },
    { name: "Web Application Testing", category: "testing", level: 86, desc: "Functionality testing, cross-browser validation, UI edge cases, and QA reporting." },
    { name: "System Configuration", category: "support", level: 89, desc: "OS setup, service configurations, environment variables, driver installations." },
    { name: "End-User Technical Assistance", category: "communication", level: 95, desc: "Translating technical concepts into simple, actionable steps for users." },
    { name: "Bug Diagnosis & Isolation", category: "testing", level: 87, desc: "Systematic reproduction of errors and root cause analysis in web & desktop apps." },
    { name: "Network Basics (DNS, IP, Wi-Fi)", category: "support", level: 83, desc: "Resolving connectivity drops, ping/tracert tests, adapter resets, DNS flushing." },
    { name: "Responsive UI Layouts", category: "web", level: 85, desc: "Mobile-first layouts, flexbox, CSS grid, and modern styling techniques." }
  ],
  education: [
    {
      school: "STI College Lucena",
      level: "College (1st Year to 4th Year)",
      program: "Bachelor of Science in Computer Science",
      status: "Currently Enrolled / Senior CS Student",
      period: "College Years 1 - 4",
      highlights: [
        "In-depth studies in Software Troubleshooting, Algorithms, and System Architecture",
        "Web Application Development & UI Testing methodologies",
        "Practical laboratory testing on system hardware, networking, and database structures",
        "Collaborative team projects focused on resolving software and configuration defects"
      ]
    },
    {
      school: "Maryhill College",
      level: "Elementary, High School, Senior High School",
      program: "Basic Education & Senior High School (STEM / ICT Foundation)",
      status: "Alumnus",
      period: "Elementary to Senior High School",
      highlights: [
        "Solid academic and ethical foundation rooted in discipline and excellence",
        "Early discovery and hands-on exposure to computer systems and digital technologies",
        "Active participation in school technology fairs and academic collaborative activities"
      ]
    }
  ],
  troubleshootingCases: [
    {
      id: "case-ui",
      title: "Web App UI Component Broken on Mobile Viewport",
      tag: "UI & Web Testing",
      severity: "Medium",
      symptom: "Customer reported navigation buttons overlapping and text clipping on mobile screens.",
      diagnosis: "Inspected element using Chrome DevTools device mode. Identified fixed pixel width (`width: 780px`) instead of fluid responsive containers, and an unset `overflow: hidden` on the parent flex element.",
      resolution: "Refactored CSS with Tailwind classes: converted to `w-full max-w-4xl px-4` with responsive breakpoints (`md:flex-row flex-col`). Verified responsive behavior on iOS Safari & Android Chrome.",
      result: "100% responsive layout across screen widths from 320px to 4K."
    },
    {
      id: "case-net",
      title: "Workstation Cannot Access Local Web Server / DNS Failure",
      tag: "System & Network Support",
      severity: "High",
      symptom: "User encountered 'Server Not Found' error when accessing the internal testing server, while other team members were connected.",
      diagnosis: "Ran `ipconfig /all` and `ping 192.168.1.1`. Gateway was reachable, but DNS resolution failed for the internal host due to a stale cached DNS entry and incorrect secondary DNS.",
      resolution: "Executed `ipconfig /flushdns`, checked Windows hosts file for conflicting manual overrides, and updated adapter DNS to match local DHCP server. Verified with `nslookup`.",
      result: "Instant connectivity restored without requiring full computer restart."
    },
    {
      id: "case-app",
      title: "Software Crashing on Launch Due to Corrupt User Cache",
      tag: "Software Troubleshooting",
      severity: "Critical",
      symptom: "Application terminated unexpectedly 3 seconds after opening with generic error code.",
      diagnosis: "Examined Windows Event Viewer (Application Log). Found Event ID 1000 pointing to access violation when reading corrupted SQLite cache in `%APPDATA%`.",
      resolution: "Safely backed up user preferences, purged the corrupted local cache database, restarted the application to allow healthy schema re-generation, and confirmed stability.",
      result: "App launched in under 2 seconds with zero data loss."
    }
  ]
};

// --- AI Chatbot Knowledge Base & Matcher ---
function getChatbotResponse(input) {
  const query = input.toLowerCase().trim();

  // Greetings
  if (/^(hi|hello|hey|greetings|sup|yo|kumusta|magandang araw)\b/.test(query)) {
    return "Hello! I am Dominic's AI assistant. How can I help you today? You can ask about Dominic's skills, education at STI College Lucena, troubleshooting experience, or get his contact info!";
  }

  // Who is Dominic / Background
  if (query.includes("who is") || query.includes("about") || query.includes("background") || query.includes("introduce") || query.includes("tell me about dominic")) {
    return `Dominic M. Blancaflor is a dedicated Computer Science student (born May 20, 2004) studying at STI College Lucena. He specializes in software troubleshooting, web application testing, and end-user IT support. He is passionate about diagnosing bugs, resolving system configuration issues, and communicating solutions clearly to users.`;
  }

  // Age / Birthday
  if (query.includes("birthday") || query.includes("birthdate") || query.includes("age") || query.includes("born") || query.includes("old")) {
    return `Dominic was born on May 20, 2004. He is currently 22 years old and is completing his Computer Science degree at STI College Lucena.`;
  }

  // Skills
  if (query.includes("skill") || query.includes("tech stack") || query.includes("what can he do") || query.includes("technologies") || query.includes("troubleshoot")) {
    return `Dominic's primary skills include:\n• Simple Troubleshooting & System Diagnostics (Hardware/Software)\n• HTML/CSS for Modern UI Design (Responsive, Semantic, Tailwind CSS)\n• Web Application Testing & QA (Bug reproduction, UX verification)\n• System Configuration & Windows Maintenance\n• End-User Assistance & Patient Technical Communication\n• Network Basics (DNS, IP configuration, connectivity testing).`;
  }

  // Education / Schools
  if (query.includes("education") || query.includes("school") || query.includes("college") || query.includes("sti") || query.includes("maryhill") || query.includes("study") || query.includes("degree")) {
    return `Dominic's Educational Background:\n1. STI College Lucena: 1st Year to 4th Year College — Bachelor of Science in Computer Science.\n2. Maryhill College: Elementary, High School, and Senior High School education.`;
  }

  // Contact details
  if (query.includes("contact") || query.includes("phone") || query.includes("email") || query.includes("hire") || query.includes("facebook") || query.includes("instagram") || query.includes("reach") || query.includes("call")) {
    return `You can reach Dominic directly via:\n• Phone: 09602081080\n• Email: dominicblancaflor5@gmail.com\n• Facebook: Dominic M. Blancaflor\n• Instagram: Dominic M. Blancaflor\nHe is actively open to IT support, QA testing, and web UI roles!`;
  }

  // Troubleshooting methodology / Questions
  if (query.includes("how do you troubleshoot") || query.includes("troubleshooting process") || query.includes("fix") || query.includes("diagnose")) {
    return `Dominic's 4-Step Troubleshooting Framework:\n1. Triage & Replicate: Listen to the user, gather symptoms, and reproduce the issue under controlled conditions.\n2. Isolate Root Cause: Inspect Event Viewer, DevTools console, network status, or config files.\n3. Implement Targeted Fix: Apply configuration patch, fix CSS layout, or reset corrupted state with minimal disruption.\n4. Validate & Document: Verify with the user that the solution is 100% working, and document prevention tips.`;
  }

  // Web design / HTML CSS
  if (query.includes("html") || query.includes("css") || query.includes("ui") || query.includes("web design") || query.includes("tailwind")) {
    return `Dominic uses HTML5 and modern CSS (including Tailwind CSS) to build clean, responsive, and accessible user interfaces. He emphasizes mobile-first design, fluid layouts, visual hierarchy, and cross-browser consistency.`;
  }

  // General CS question: DNS
  if (query.includes("dns") || query.includes("ip address")) {
    return `In Computer Science, an IP address is a numerical label identifying a device on a network, while DNS (Domain Name System) acts as the 'phonebook of the Internet', translating human-readable names (like example.com) into numerical IP addresses (like 192.0.2.1). When web pages fail to load, running 'ipconfig /flushdns' or checking DNS servers is one of Dominic's common troubleshooting steps!`;
  }

  // General CS question: 404 vs 500
  if (query.includes("404") || query.includes("500") || query.includes("http error")) {
    return `HTTP 404 is a 'Client-Side Error' meaning the requested resource could not be found on the server (often broken link or typo). HTTP 500 is a 'Server-Side Internal Error' indicating the server encountered an unexpected condition that prevented it from fulfilling the request (such as a database timeout or unhandled code exception).`;
  }

  // Why Hire Dominic
  if (query.includes("why hire") || query.includes("why choose") || query.includes("strengths") || query.includes("value")) {
    return `Why hire Dominic M. Blancaflor?\n1. Strong diagnostic mindset: He doesn't guess; he traces bugs systematically.\n2. Bridge between tech and users: Can explain complex technical fixes in simple, reassuring language.\n3. Versatile skill mix: Combines hands-on IT troubleshooting with modern HTML/CSS UI design and QA testing.\n4. Reliable work ethic: Senior CS student at STI College Lucena with a fast, dedicated response time.`;
  }

  // Default Fallback
  return `Thank you for your question! As Dominic's AI assistant, I can share information about Dominic M. Blancaflor's qualifications, education at STI College Lucena & Maryhill College, IT troubleshooting skills, HTML/CSS UI design, or contact details (Phone: 09602081080 | dominicblancaflor5@gmail.com). What would you like to know?`;
}

// --- Main App Component ---
function App() {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [activeSkillTab, setActiveSkillTab] = useState('all');
  const [selectedCase, setSelectedCase] = useState(PROFILE.troubleshootingCases[0].id);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "👋 Hi! I'm Dominic's AI Portfolio Assistant. Ask me anything about Dominic's IT troubleshooting experience, HTML/CSS design, education at STI College & Maryhill College, or how to contact him!",
      time: 'Just now'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [formSent, setFormSent] = useState(false);
  
  const chatBottomRef = useRef(null);

  // Auto scroll chat
  useEffect(() => {
    if (chatOpen && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, chatOpen, isTyping]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    sounds.pop();
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSoundToggle = () => {
    const next = sounds.toggle();
    setSoundEnabled(next);
    triggerToast(next ? "Sound Effects: ON" : "Sound Effects: MUTED");
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    triggerToast(`Copied ${label} to clipboard!`);
    sounds.click();
  };

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    sounds.click();
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    const prompt = chatInput;
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      const replyText = getChatbotResponse(prompt);
      setIsTyping(false);
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      sounds.pop();
    }, 600);
  };

  const handlePromptChipClick = (promptText) => {
    sounds.click();
    setChatInput(promptText);
    setTimeout(() => {
      const userMsg = {
        id: Date.now(),
        sender: 'user',
        text: promptText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);
      setTimeout(() => {
        const replyText = getChatbotResponse(promptText);
        setIsTyping(false);
        setChatMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'bot',
            text: replyText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        sounds.pop();
      }, 500);
    }, 50);
  };

  const handlePrint = () => {
    sounds.click();
    window.print();
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    sounds.success();
    setFormSent(true);
    triggerToast("Message sent to Dominic! Thank you.");
    setTimeout(() => {
      setContactForm({ name: '', email: '', subject: '', message: '' });
      setFormSent(false);
    }, 4000);
  };

  const filteredSkills = activeSkillTab === 'all'
    ? PROFILE.skills
    : PROFILE.skills.filter(s => s.category === activeSkillTab);

  const activeCaseObj = PROFILE.troubleshootingCases.find(c => c.id === selectedCase) || PROFILE.troubleshootingCases[0];

  return (
    <div className="relative min-h-screen text-slate-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900/95 border border-cyan-500/50 text-cyan-300 px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-3 backdrop-blur-md animate-bounce">
          <Icons.Check />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* --- Sticky Navigation Bar --- */}
      <nav className="sticky top-0 z-40 bg-[#070b14]/85 backdrop-blur-xl border-b border-cyan-500/15 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo & Status */}
          <div className="flex items-center space-x-4">
            <a href="#" className="flex items-center space-x-3 group" onClick={() => sounds.click()}>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 p-[1.5px] shadow-[0_0_15px_rgba(0,242,254,0.3)]">
                <div className="w-full h-full bg-[#070b14] rounded-[10px] flex items-center justify-center font-mono font-bold text-cyan-400 group-hover:text-white transition">
                  DB
                </div>
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight text-white block group-hover:text-cyan-300 transition">
                  Dominic M. Blancaflor
                </span>
                <span className="text-xs font-mono text-cyan-400/80 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block"></span>
                  <span>AVAILABLE FOR IT & WEB ROLES</span>
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <a href="#about" onClick={() => sounds.click()} className="text-slate-300 hover:text-cyan-400 transition">About</a>
            <a href="#skills" onClick={() => sounds.click()} className="text-slate-300 hover:text-cyan-400 transition">Skills</a>
            <a href="#lab" onClick={() => sounds.click()} className="text-slate-300 hover:text-cyan-400 transition">IT Troubleshooting Lab</a>
            <a href="#education" onClick={() => sounds.click()} className="text-slate-300 hover:text-cyan-400 transition">Education</a>
            <a href="#contact" onClick={() => sounds.click()} className="text-slate-300 hover:text-cyan-400 transition">Contact</a>
          </div>

          {/* Nav Quick Actions */}
          <div className="flex items-center space-x-3">
            {/* Audio Toggle */}
            <button
              onClick={handleSoundToggle}
              title={soundEnabled ? "Mute Sound Effects" : "Enable Sound Effects"}
              className="p-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 border border-slate-700 transition"
            >
              <Icons.Volume enabled={soundEnabled} />
            </button>

            {/* Print / PDF Resume Button */}
            <button
              onClick={() => {
                sounds.click();
                setShowPrintModal(true);
              }}
              className="hidden sm:flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-slate-800/90 hover:bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:border-cyan-400 transition text-sm font-medium"
            >
              <Icons.Printer />
              <span>Resume PDF</span>
            </button>

            {/* AI Chatbot Trigger Pill */}
            <button
              onClick={() => {
                sounds.click();
                setChatOpen(!chatOpen);
              }}
              className="relative flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold shadow-[0_0_20px_rgba(0,242,254,0.3)] transition transform active:scale-95 text-sm"
            >
              <Icons.Bot />
              <span className="hidden sm:inline">Ask AI Assistant</span>
              <span className="sm:hidden">AI</span>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Tech Badge */}
              <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-mono shimmer-badge">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>SYSTEM ID: DOMINIC-M-BLANCAFLOR // CS-2026</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Hi, I'm <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent glow-text-cyan">Dominic M. Blancaflor</span>
              </h1>

              {/* Subtitle / Role */}
              <p className="text-xl sm:text-2xl font-mono text-cyan-300 font-medium">
                {">"} Computer Science Student & IT Support Specialist
              </p>

              {/* Summary Description */}
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
                {PROFILE.summary}
              </p>

              {/* Key Competency Pills */}
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="px-3 py-1 rounded-lg bg-slate-800/80 border border-cyan-500/20 text-cyan-300 text-xs font-mono flex items-center space-x-1.5">
                  <Icons.Wrench />
                  <span>Software Troubleshooting</span>
                </span>
                <span className="px-3 py-1 rounded-lg bg-slate-800/80 border border-emerald-500/20 text-emerald-300 text-xs font-mono flex items-center space-x-1.5">
                  <Icons.Code />
                  <span>HTML/CSS UI Design</span>
                </span>
                <span className="px-3 py-1 rounded-lg bg-slate-800/80 border border-blue-500/20 text-blue-300 text-xs font-mono flex items-center space-x-1.5">
                  <Icons.Cpu />
                  <span>Web App Testing & QA</span>
                </span>
                <span className="px-3 py-1 rounded-lg bg-slate-800/80 border border-purple-500/20 text-purple-300 text-xs font-mono flex items-center space-x-1.5">
                  <Icons.GraduationCap />
                  <span>STI College Lucena</span>
                </span>
              </div>

              {/* Call to Actions */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  onClick={() => {
                    sounds.pop();
                    setChatOpen(true);
                  }}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold shadow-[0_0_25px_rgba(0,242,254,0.35)] flex items-center space-x-2.5 transition transform active:scale-95"
                >
                  <Icons.Bot />
                  <span>Chat with My AI Assistant</span>
                </button>

                <button
                  onClick={() => {
                    sounds.click();
                    setShowPrintModal(true);
                  }}
                  className="px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 font-semibold flex items-center space-x-2.5 transition"
                >
                  <Icons.Printer />
                  <span>Print / Export PDF Resume</span>
                </button>

                <a
                  href="#contact"
                  onClick={() => sounds.click()}
                  className="px-5 py-3.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/50 font-medium transition text-sm flex items-center space-x-1.5"
                >
                  <span>Contact Me</span>
                  <Icons.ExternalLink />
                </a>
              </div>

              {/* Fast Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800">
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
                  <span className="block text-2xl font-bold font-mono text-cyan-400">4th Yr</span>
                  <span className="text-xs text-slate-400">BS Computer Science</span>
                </div>
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
                  <span className="block text-2xl font-bold font-mono text-emerald-400">100%</span>
                  <span className="text-xs text-slate-400">Dedicated Support</span>
                </div>
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
                  <span className="block text-2xl font-bold font-mono text-sky-400">22 yrs</span>
                  <span className="text-xs text-slate-400">Born May 20, 2004</span>
                </div>
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
                  <span className="block text-2xl font-bold font-mono text-purple-400">{"< 1 hr"}</span>
                  <span className="text-xs text-slate-400">Quick Response Time</span>
                </div>
              </div>

            </div>

            {/* Right Photo & Tech Frame */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-72 sm:w-88 md:w-96 max-w-full">
                
                {/* Outer Rotating Radar Ring */}
                <div className="absolute -inset-4 rounded-3xl border border-cyan-500/20 pointer-events-none animate-pulse"></div>
                <div className="absolute -inset-8 rounded-3xl border border-dashed border-cyan-500/10 pointer-events-none"></div>

                {/* Cyber Card Container */}
                <div className="relative rounded-2xl overflow-hidden p-1.5 bg-gradient-to-b from-cyan-500/40 via-blue-600/20 to-transparent shadow-[0_0_40px_rgba(0,242,254,0.2)]">
                  
                  {/* Photo Frame */}
                  <div className="relative rounded-xl overflow-hidden bg-slate-950 aspect-[4/5] group">
                    <img
                      src={PROFILE.photo}
                      alt="Dominic M. Blancaflor"
                      className="w-full h-full object-cover object-center filter contrast-105 group-hover:scale-105 transition duration-700 ease-out"
                    />

                    {/* Tech HUD Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-transparent to-transparent opacity-80"></div>
                    
                    {/* Top HUD Tag */}
                    <div className="absolute top-3 left-3 bg-[#070b14]/90 backdrop-blur-md px-3 py-1 rounded-md border border-cyan-500/30 font-mono text-[11px] text-cyan-300">
                      ID: DMB-20040520
                    </div>

                    {/* Bottom Status Info */}
                    <div className="absolute bottom-4 left-4 right-4 bg-[#070b14]/90 backdrop-blur-md p-3.5 rounded-xl border border-cyan-500/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-white text-sm">Dominic M. Blancaflor</div>
                          <div className="text-xs text-cyan-400 font-mono">STI College Lucena</div>
                        </div>
                        <span className="px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-mono rounded-full">
                          ONLINE
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Tech Badge Left */}
                <div className="absolute -left-6 top-1/4 bg-slate-900/90 backdrop-blur-md border border-cyan-500/30 rounded-xl p-3 shadow-xl hidden sm:flex items-center space-x-3 animate-float">
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <Icons.Wrench />
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-white">Diagnostics Ready</div>
                    <div className="text-slate-400">Bug & Config Triage</div>
                  </div>
                </div>

                {/* Floating Tech Badge Right */}
                <div className="absolute -right-6 bottom-16 bg-slate-900/90 backdrop-blur-md border border-emerald-500/30 rounded-xl p-3 shadow-xl hidden sm:flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Icons.Code />
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-white">UI Designer</div>
                    <div className="text-slate-400">Modern HTML & CSS</div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- ABOUT & PROFESSIONAL BACKGROUND --- */}
      <section id="about" className="py-20 bg-slate-950/60 border-y border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">
              // 01. PROFILE & METHODOLOGY
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
              About Dominic M. Blancaflor
            </h3>
            <p className="mt-4 text-slate-400">
              Passionate Computer Science student with practical experience in diagnosing software defects, testing user interfaces, and providing empathetic technical guidance to non-technical end users.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Technical Troubleshooting */}
            <div className="glow-card rounded-2xl p-6 sm:p-8">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6">
                <Icons.Wrench />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Software Troubleshooting</h4>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Adept at isolating tricky software bugs, handling OS runtime glitches, inspecting Windows Event logs, and configuring services to restore mission-critical systems smoothly.
              </p>
              <ul className="text-xs font-mono text-cyan-300/80 space-y-1.5">
                <li>+ Event Viewer & Log Analysis</li>
                <li>+ Windows & App Configuration</li>
                <li>+ Dependency & Cache Repair</li>
              </ul>
            </div>

            {/* Card 2: Web Testing & UI Design */}
            <div className="glow-card rounded-2xl p-6 sm:p-8">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6">
                <Icons.Code />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">HTML/CSS & UI Testing</h4>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Skilled in crafting clean, accessible HTML structures and modern CSS/Tailwind layouts. Actively conducts cross-browser UI testing to ensure responsive behavior across devices.
              </p>
              <ul className="text-xs font-mono text-emerald-300/80 space-y-1.5">
                <li>+ Responsive Mobile & Desktop Layouts</li>
                <li>+ Browser DevTools Inspection</li>
                <li>+ Bug Reproduction & Edge-Case QA</li>
              </ul>
            </div>

            {/* Card 3: End-User Assistance */}
            <div className="glow-card rounded-2xl p-6 sm:p-8">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-6">
                <Icons.Terminal />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">User-Centric IT Support</h4>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Passionate about communicating complex technical concepts in plain, approachable language. Believes that patient guidance and rapid turnaround build trust with users.
              </p>
              <ul className="text-xs font-mono text-blue-300/80 space-y-1.5">
                <li>+ Empathetic Tech Support & Helpdesk</li>
                <li>+ Clear Step-by-Step Documentation</li>
                <li>+ Rapid Issue Triage & Escalation</li>
              </ul>
            </div>

          </div>

          {/* Personal Bio Details Bar */}
          <div className="mt-12 p-6 rounded-2xl bg-slate-900/60 border border-cyan-500/20 backdrop-blur-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="text-xs font-mono text-slate-400">FULL NAME</div>
              <div className="text-sm font-semibold text-white mt-1">Dominic M. Blancaflor</div>
            </div>
            <div>
              <div className="text-xs font-mono text-slate-400">BIRTHDATE</div>
              <div className="text-sm font-semibold text-cyan-300 mt-1">May 20, 2004 (22 yrs old)</div>
            </div>
            <div>
              <div className="text-xs font-mono text-slate-400">CURRENT DEGREE</div>
              <div className="text-sm font-semibold text-white mt-1">BS Computer Science (STI College)</div>
            </div>
            <div>
              <div className="text-xs font-mono text-slate-400">PRIMARY FOCUS</div>
              <div className="text-sm font-semibold text-emerald-300 mt-1">IT Support & Web QA Testing</div>
            </div>
          </div>

        </div>
      </section>

      {/* --- SKILLS & COMPETENCIES SECTION --- */}
      <section id="skills" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">
                // 02. TECHNICAL CAPABILITIES
              </h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
                Skills & Core Competencies
              </h3>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mt-6 md:mt-0">
              {[
                { id: 'all', label: 'All Capabilities' },
                { id: 'support', label: 'IT & Troubleshooting' },
                { id: 'web', label: 'HTML/CSS UI' },
                { id: 'testing', label: 'Testing & QA' },
                { id: 'communication', label: 'User Assistance' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    sounds.click();
                    setActiveSkillTab(tab.id);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition ${
                    activeSkillTab === tab.id
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(0,242,254,0.4)]'
                      : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Skill Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSkills.map((skill, idx) => (
              <div key={idx} className="glow-card rounded-xl p-6 transition duration-300">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-base font-bold text-white flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    <span>{skill.name}</span>
                  </h4>
                  <span className="text-xs font-mono font-bold text-cyan-400">{skill.level}%</span>
                </div>
                
                <p className="text-xs text-slate-400 mb-4">{skill.desc}</p>
                
                {/* Progress Bar */}
                <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden p-[1px]">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Tool Arsenal Pills */}
          <div className="mt-12 p-6 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs font-mono text-cyan-300 flex items-center space-x-2">
              <Icons.Terminal />
              <span>HANDS-ON TOOLKIT & ENVIRONMENTS:</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                "Windows OS Diagnostics",
                "Chrome & Edge DevTools",
                "HTML5 Semantic Markup",
                "CSS3 Flexbox & Grid",
                "Tailwind CSS",
                "System Event Viewer",
                "Command Prompt & PowerShell",
                "Network Config (ipconfig/ping/DNS)",
                "Bug Tracking Documentation",
                "End-User Helpdesk Procedures"
              ].map((badge, bidx) => (
                <span
                  key={bidx}
                  className="px-3 py-1 rounded-md bg-slate-800/90 text-slate-300 border border-slate-700 text-xs font-mono"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* --- INTERACTIVE IT TROUBLESHOOTING LAB --- */}
      <section id="lab" className="py-20 bg-slate-950/80 border-y border-slate-800 relative interactive-lab">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-2">
              // 03. PRACTICAL SIMULATOR
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
              Interactive IT Troubleshooting Lab
            </h3>
            <p className="mt-4 text-slate-400">
              Explore how Dominic systematically investigates, isolates, and resolves real-world IT issues and web defects. Click any scenario below to view the diagnostic trace.
            </p>
          </div>

          {/* Scenario Selector Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {PROFILE.troubleshootingCases.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  sounds.click();
                  setSelectedCase(c.id);
                }}
                className={`text-left p-5 rounded-xl border transition ${
                  selectedCase === c.id
                    ? 'bg-slate-900 border-cyan-400 shadow-[0_0_20px_rgba(0,242,254,0.15)] ring-1 ring-cyan-400'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                    {c.tag}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Severity: {c.severity}</span>
                </div>
                <h4 className="font-bold text-sm text-white line-clamp-2">{c.title}</h4>
              </button>
            ))}
          </div>

          {/* Active Scenario Inspector Terminal */}
          <div className="rounded-2xl bg-slate-900/90 border border-cyan-500/30 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden font-mono text-sm">
            
            {/* Terminal Window Bar */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block"></span>
                <span className="text-xs text-slate-400 ml-2">diagnostic-console // {activeCaseObj.id}</span>
              </div>
              <span className="text-xs text-emerald-400 font-bold flex items-center space-x-1">
                <Icons.Check />
                <span>RESOLVED & VERIFIED</span>
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-sans">
              
              {/* Problem Statement & Symptoms */}
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-mono text-cyan-400 block mb-1">STAGE 01: REPORTED SYMPTOM</span>
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300 text-sm">
                    {activeCaseObj.symptom}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-mono text-yellow-400 block mb-1">STAGE 02: DIAGNOSTIC TRACE</span>
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300 text-sm">
                    {activeCaseObj.diagnosis}
                  </div>
                </div>
              </div>

              {/* Resolution & Outcome */}
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-mono text-emerald-400 block mb-1">STAGE 03: APPLIED RESOLUTION</span>
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300 text-sm">
                    {activeCaseObj.resolution}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-mono text-sky-400 block mb-1">STAGE 04: VERIFIED OUTCOME</span>
                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 text-sm font-semibold flex items-center space-x-2">
                    <Icons.Check />
                    <span>{activeCaseObj.result}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* --- EDUCATION JOURNEY --- */}
      <section id="education" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">
              // 04. ACADEMIC FOUNDATION
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
              Education Timeline
            </h3>
            <p className="mt-4 text-slate-400">
              Dominic's formal Computer Science journey and foundational educational background.
            </p>
          </div>

          <div className="space-y-8 max-w-4xl mx-auto">
            {PROFILE.education.map((edu, idx) => (
              <div key={idx} className="glow-card rounded-2xl p-6 sm:p-8 relative">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-2">
                  <div>
                    <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">{edu.level}</span>
                    <h4 className="text-2xl font-bold text-white mt-1">{edu.school}</h4>
                    <p className="text-sm text-slate-300 font-medium">{edu.program}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="inline-block px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-xs font-mono">
                      {edu.period}
                    </span>
                    <div className="text-xs text-emerald-400 font-mono mt-1">{edu.status}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-mono text-slate-400">KEY HIGHLIGHTS:</div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-300">
                    {edu.highlights.map((h, hidx) => (
                      <li key={hidx} className="flex items-start space-x-2">
                        <span className="text-cyan-400 mt-1 flex-shrink-0">▹</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* --- CONTACT & GET IN TOUCH SECTION --- */}
      <section id="contact" className="py-20 bg-slate-950/70 border-t border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">
              // 05. DIRECT COMMUNICATIONS
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
              Get in Touch with Dominic
            </h3>
            <p className="mt-4 text-slate-400">
              Have an IT support requirement, web QA opportunity, or questions about my background? Feel free to reach out directly or send a message.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Contact Direct Cards */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Phone Card */}
              <div className="glow-card rounded-xl p-5 flex items-center justify-between group">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Icons.Phone />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-slate-400">PHONE & MOBILE</div>
                    <a href={`tel:${PROFILE.phone}`} className="text-base font-bold text-white hover:text-cyan-400 transition">
                      {PROFILE.phone}
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(PROFILE.phone, 'Phone number')}
                  title="Copy Phone Number"
                  className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                >
                  <Icons.Copy />
                </button>
              </div>

              {/* Email Card */}
              <div className="glow-card rounded-xl p-5 flex items-center justify-between group">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Icons.Mail />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-slate-400">EMAIL ADDRESS</div>
                    <a href={`mailto:${PROFILE.email}`} className="text-base font-bold text-white hover:text-emerald-400 transition break-all">
                      {PROFILE.email}
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(PROFILE.email, 'Email address')}
                  title="Copy Email Address"
                  className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                >
                  <Icons.Copy />
                </button>
              </div>

              {/* Facebook Card */}
              <a
                href={`https://www.facebook.com/search/top?q=${encodeURIComponent(PROFILE.facebook)}`}
                target="_blank"
                rel="noreferrer"
                className="glow-card rounded-xl p-5 flex items-center justify-between group block"
                onClick={() => sounds.click()}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold font-mono">
                    fb
                  </div>
                  <div>
                    <div className="text-xs font-mono text-slate-400">FACEBOOK</div>
                    <div className="text-base font-bold text-white group-hover:text-blue-400 transition">
                      {PROFILE.facebook}
                    </div>
                  </div>
                </div>
                <div className="text-slate-500 group-hover:text-cyan-400 transition">
                  <Icons.ExternalLink />
                </div>
              </a>

              {/* Instagram Card */}
              <a
                href={`https://www.instagram.com/`}
                target="_blank"
                rel="noreferrer"
                className="glow-card rounded-xl p-5 flex items-center justify-between group block"
                onClick={() => sounds.click()}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-pink-600/10 border border-pink-500/30 flex items-center justify-center text-pink-400 font-bold font-mono">
                    ig
                  </div>
                  <div>
                    <div className="text-xs font-mono text-slate-400">INSTAGRAM</div>
                    <div className="text-base font-bold text-white group-hover:text-pink-400 transition">
                      {PROFILE.facebook}
                    </div>
                  </div>
                </div>
                <div className="text-slate-500 group-hover:text-cyan-400 transition">
                  <Icons.ExternalLink />
                </div>
              </a>

            </div>

            {/* Quick Interactive Message Form */}
            <div className="lg:col-span-7">
              <div className="glow-card rounded-2xl p-6 sm:p-8">
                <h4 className="text-xl font-bold text-white mb-2">Send Dominic a Direct Message</h4>
                <p className="text-xs text-slate-400 mb-6 font-mono">
                  // FAST RESPONSE TIME GUARANTEED
                </p>

                {formSent ? (
                  <div className="p-8 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                      <Icons.Check />
                    </div>
                    <div className="text-lg font-bold text-white">Message Delivered Successfully!</div>
                    <p className="text-sm text-slate-300">
                      Thank you for getting in touch. Dominic will review your note and respond as soon as possible.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">YOUR NAME</label>
                        <input
                          type="text"
                          required
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          placeholder="e.g. Alex Santos"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">YOUR EMAIL</label>
                        <input
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          placeholder="alex@example.com"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">SUBJECT / TOPIC</label>
                      <input
                        type="text"
                        required
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        placeholder="e.g. IT Support Opportunity / Software Troubleshooting Request"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">MESSAGE</label>
                      <textarea
                        rows={4}
                        required
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        placeholder="Describe your project, IT support requirement, or question..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 transition resize-none"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold transition flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(0,242,254,0.25)]"
                    >
                      <Icons.Send />
                      <span>Transmit Message to Dominic</span>
                    </button>
                  </form>
                )}

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 bg-[#040711] border-t border-slate-900 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <div className="flex items-center justify-center space-x-3 text-slate-400 font-mono">
            <span>Dominic M. Blancaflor</span>
            <span>•</span>
            <span>STI College Lucena</span>
            <span>•</span>
            <span>BS Computer Science</span>
          </div>
          <p>© {new Date().getFullYear()} Dominic M. Blancaflor. All rights reserved.</p>
          <div className="flex justify-center space-x-4 pt-2">
            <button
              onClick={() => {
                sounds.click();
                setShowPrintModal(true);
              }}
              className="text-cyan-400 hover:underline font-mono"
            >
              [Print / Export PDF Resume]
            </button>
            <button
              onClick={() => {
                sounds.click();
                setChatOpen(true);
              }}
              className="text-emerald-400 hover:underline font-mono"
            >
              [Ask AI Assistant]
            </button>
          </div>
        </div>
      </footer>

      {/* --- DOCKED / FLOATING INTERACTIVE AI CHATBOT --- */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 no-print ${chatOpen ? 'w-full max-w-md' : 'w-auto'}`}>
        {!chatOpen ? (
          <button
            onClick={() => {
              sounds.pop();
              setChatOpen(true);
            }}
            className="flex items-center space-x-3 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-[0_0_25px_rgba(0,242,254,0.45)] hover:scale-105 transition transform active:scale-95"
          >
            <div className="relative">
              <Icons.Bot />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            </div>
            <span>Chat with AI</span>
          </button>
        ) : (
          <div className="bg-[#0b1120] border border-cyan-500/40 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col h-[560px] max-h-[85vh] backdrop-blur-2xl">
            
            {/* Chatbot Header */}
            <div className="px-5 py-4 bg-slate-900 border-b border-cyan-500/20 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Icons.Bot />
                </div>
                <div>
                  <div className="text-sm font-bold text-white flex items-center space-x-1.5">
                    <span>Dominic AI Assistant</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  </div>
                  <div className="text-[11px] text-cyan-400 font-mono">Trained on CS & Dominic's Background</div>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => {
                    sounds.click();
                    setChatMessages([
                      {
                        id: 1,
                        sender: 'bot',
                        text: "Conversation reset. What would you like to know about Dominic?",
                        time: 'Just now'
                      }
                    ]);
                  }}
                  title="Clear Conversation"
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 text-xs"
                >
                  Clear
                </button>
                <button
                  onClick={() => {
                    sounds.click();
                    setChatOpen(false);
                  }}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <Icons.Close />
                </button>
              </div>
            </div>

            {/* Quick Prompt Chips */}
            <div className="px-4 py-2.5 bg-slate-950/70 border-b border-slate-800/80 flex gap-2 overflow-x-auto scrollbar-none text-xs">
              {[
                "Who is Dominic?",
                "What are his skills?",
                "Where did he study?",
                "How to contact Dominic?",
                "Why hire Dominic?",
                "Troubleshooting methodology"
              ].map((chip, cidx) => (
                <button
                  key={cidx}
                  onClick={() => handlePromptChipClick(chip)}
                  className="whitespace-nowrap px-2.5 py-1 rounded-md bg-slate-800/80 text-cyan-300 hover:bg-cyan-500/20 border border-cyan-500/20 transition font-mono text-[11px]"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans text-sm">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-medium'
                        : 'bg-slate-800/90 border border-slate-700/80 text-slate-200'
                    }`}
                  >
                    <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                    <div className={`text-[10px] mt-1 text-right ${msg.sender === 'user' ? 'text-slate-900/70' : 'text-slate-400'}`}>
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-800/80 border border-slate-700 rounded-2xl px-4 py-3 flex items-center space-x-1.5 text-cyan-400">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
              <div ref={chatBottomRef}></div>
            </div>

            {/* Message Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about Dominic or CS concepts..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition flex items-center justify-center"
              >
                <Icons.Send />
              </button>
            </form>

          </div>
        )}
      </div>

      {/* --- FORMAL PRINT / EXPORT PDF MODAL --- */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto no-print">
          <div className="bg-[#0b1120] border border-cyan-500/30 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Icons.Printer />
                  <span>Resume Print / PDF Export Preview</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Formatted in executive A4 format. Click 'Print / Save as PDF' below to open the native browser print dialog.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm flex items-center space-x-2 shadow-[0_0_15px_rgba(0,242,254,0.3)] transition"
                >
                  <Icons.Printer />
                  <span>Print / Save as PDF</span>
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <Icons.Close />
                </button>
              </div>
            </div>

            {/* Document Preview Area (Formatted Clean Resume) */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-white text-slate-900 font-sans">
              
              {/* Resume Header */}
              <div className="border-b-2 border-slate-900 pb-5 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 uppercase">
                    {PROFILE.name}
                  </h1>
                  <p className="text-sm font-semibold text-slate-700 mt-1 uppercase tracking-wider">
                    {PROFILE.title}
                  </p>
                </div>
                <div className="mt-3 sm:mt-0 text-xs text-slate-600 sm:text-right space-y-0.5 font-mono">
                  <div><strong>Phone:</strong> {PROFILE.phone}</div>
                  <div><strong>Email:</strong> {PROFILE.email}</div>
                  <div><strong>Birthdate:</strong> {PROFILE.birthdate}</div>
                  <div><strong>Social:</strong> {PROFILE.facebook}</div>
                </div>
              </div>

              {/* Summary */}
              <div className="mb-6">
                <h2 className="text-xs font-bold font-mono tracking-widest text-slate-950 uppercase border-b border-slate-300 pb-1 mb-2">
                  Professional Summary
                </h2>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {PROFILE.summary}
                </p>
              </div>

              {/* Education */}
              <div className="mb-6">
                <h2 className="text-xs font-bold font-mono tracking-widest text-slate-950 uppercase border-b border-slate-300 pb-1 mb-3">
                  Education
                </h2>
                <div className="space-y-4">
                  {PROFILE.education.map((edu, idx) => (
                    <div key={idx} className="text-xs">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{edu.school}</span>
                        <span className="font-mono">{edu.period}</span>
                      </div>
                      <div className="text-slate-600 italic">{edu.program} ({edu.level})</div>
                      <ul className="list-disc list-inside mt-1.5 space-y-0.5 text-slate-700">
                        {edu.highlights.map((h, hidx) => (
                          <li key={hidx}>{h}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Skills & Competencies */}
              <div className="mb-6">
                <h2 className="text-xs font-bold font-mono tracking-widest text-slate-950 uppercase border-b border-slate-300 pb-1 mb-3">
                  Core Skills & Technical Competencies
                </h2>
                <div className="grid grid-cols-2 gap-4 text-xs text-slate-700">
                  <div>
                    <strong>IT Support & Troubleshooting:</strong>
                    <p className="mt-1">Hardware/software diagnostics, system repair, Event Viewer log analysis, OS configuration, network connectivity troubleshooting (DNS, IP).</p>
                  </div>
                  <div>
                    <strong>Web Design & Quality Assurance:</strong>
                    <p className="mt-1">HTML5 semantic markup, CSS3 styling, responsive layouts, web application bug reproduction, DevTools inspection, user acceptance testing.</p>
                  </div>
                  <div>
                    <strong>End-User Communication:</strong>
                    <p className="mt-1">Clear technical explanation for non-technical users, empathetic support, ticket documentation, fast incident triage.</p>
                  </div>
                  <div>
                    <strong>Environments & Tools:</strong>
                    <p className="mt-1">Windows OS, PowerShell, Command Line, Web Browser DevTools, Tailwind CSS, Helpdesk Ticketing.</p>
                  </div>
                </div>
              </div>

              {/* Practical Troubleshooting Cases */}
              <div>
                <h2 className="text-xs font-bold font-mono tracking-widest text-slate-950 uppercase border-b border-slate-300 pb-1 mb-3">
                  Selected Practical Troubleshooting Experience
                </h2>
                <div className="space-y-3 text-xs text-slate-700">
                  {PROFILE.troubleshootingCases.map((c, idx) => (
                    <div key={idx} className="border-l-2 border-slate-400 pl-3">
                      <div className="font-bold text-slate-900">{c.title} ({c.tag})</div>
                      <div className="text-slate-600 mt-0.5"><span className="font-semibold">Action:</span> {c.resolution}</div>
                      <div className="text-slate-800 font-semibold mt-0.5"><span className="text-slate-600 font-normal">Result:</span> {c.result}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Bottom Actions */}
            <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-end space-x-3">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 rounded-xl text-slate-300 hover:bg-slate-800 text-sm"
              >
                Close Preview
              </button>
              <button
                onClick={handlePrint}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm flex items-center space-x-2 shadow-[0_0_15px_rgba(0,242,254,0.3)]"
              >
                <Icons.Printer />
                <span>Launch Print Dialog</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- HIDDEN PRINT-ONLY RESUME CONTAINER (Directly invoked when user does Ctrl+P or window.print()) --- */}
      <div className="hidden print-only p-8 text-black bg-white max-w-4xl mx-auto">
        <div className="border-b-2 border-black pb-4 mb-4">
          <h1 className="text-2xl font-bold uppercase">{PROFILE.name}</h1>
          <p className="text-sm font-semibold">{PROFILE.title}</p>
          <p className="text-xs text-gray-700 mt-1">
            Phone: {PROFILE.phone} | Email: {PROFILE.email} | Birthdate: {PROFILE.birthdate} | Social: {PROFILE.facebook}
          </p>
        </div>

        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase border-b border-gray-400 pb-0.5 mb-1">Professional Summary</h2>
          <p className="text-xs text-gray-800 leading-normal">{PROFILE.summary}</p>
        </div>

        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase border-b border-gray-400 pb-0.5 mb-1">Education</h2>
          {PROFILE.education.map((edu, i) => (
            <div key={i} className="text-xs mb-2">
              <div className="font-bold flex justify-between">
                <span>{edu.school}</span>
                <span>{edu.period}</span>
              </div>
              <div className="italic text-gray-600">{edu.program} ({edu.level})</div>
              <ul className="list-disc list-inside mt-0.5 text-gray-700">
                {edu.highlights.map((h, hi) => (
                  <li key={hi}>{h}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase border-b border-gray-400 pb-0.5 mb-1">Technical Skills & Competencies</h2>
          <div className="text-xs text-gray-800 space-y-1">
            <div><strong>IT Troubleshooting:</strong> Simple Troubleshooting, Hardware & Software Diagnostics, System Configuration, Network Basics (DNS/IP).</div>
            <div><strong>Web & UI Design:</strong> HTML/CSS for UI Design, Modern Tailwind CSS, Responsive Mobile Layouts.</div>
            <div><strong>Testing & Quality Assurance:</strong> Web Application Testing, Bug Diagnostics, Edge-Case Verification.</div>
            <div><strong>End-User Support:</strong> Non-Technical User Communication, Step-by-Step Resolution, High Reliability.</div>
          </div>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase border-b border-gray-400 pb-0.5 mb-1">Practical Troubleshooting Highlights</h2>
          {PROFILE.troubleshootingCases.map((c, i) => (
            <div key={i} className="text-xs mb-2">
              <div className="font-bold">{c.title}</div>
              <div className="text-gray-700"><span className="font-semibold">Resolution:</span> {c.resolution}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

// Render the application into root
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}

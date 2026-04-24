import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Download, Edit3, Briefcase, FileText, Search, ExternalLink, Sparkles, Loader2, CheckCircle2, Wand2, RotateCcw, Plus, Check, Save, X, Link, Clipboard, LayoutGrid, List, Calendar, MapPin, Building2, User, DollarSign, Target, MessageSquare, AlertCircle, Trash2, ChevronRight, ChevronDown, LogIn, LogOut, Settings, HelpCircle, Upload, Brain, Mail, RefreshCw } from 'lucide-react';
import * as pdfjs from 'pdfjs-dist';
import * as mammoth from 'mammoth';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { useGoogleLogin } from '@react-oauth/google';

// Set PDF.js worker using local Vite import
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
import { GoogleGenAI, Type, ThinkingLevel, GenerateContentResponse } from "@google/genai";

// Add type declaration for AI Studio global functions
declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

interface CvData {
  firstName: string;
  lastName: string;
  location: string;
  address: string;
  phone: string;
  email: string;
  linkedin: string;
  summary: string;
  experience: {
    company: string;
    role: string;
    period: string;
    location: string;
    bullets: string[];
  }[];
  skills: {
    category: string;
    items: string[];
  }[];
  sectionTitles: {
    summary: string;
    experience: string;
    skills: string;
    education: string;
    certifications: string;
  };
  education: string[];
  certifications: string[];
}

const BLANK_TEMPLATE: CvData = {
  firstName: "Alejandro",
  lastName: "Angel Duque",
  location: "Bogotá, Colombia",
  address: "",
  phone: "+57 3174117571",
  email: "aangeldu@gmail.com",
  linkedin: "linkedin.com/in/aangeldu/",
  summary: "Strategic and data-driven Business Development & Strategy Leader with over 8 years of experience scaling operations, driving revenue growth, and leading cross-functional teams in fast-paced, matrixed environments (including top-tier Fintech and Telecom). Proven track record of owning P&L, formulating Go-to-Market (GTM) strategies, and negotiating high-impact partnerships to unlock new business opportunities. Adept at translating complex data into actionable strategic initiatives that optimize operational efficiency, maximize ROI, and accelerate market expansion. Certified PMP® and Six Sigma Black Belt, blending rigorous project management with process optimization. Fluent in English, Spanish, and Portuguese.",
  experience: [
    {
      company: "Nubank",
      role: "Lead of Strategy and Planning",
      period: "January 2026 – March 2026",
      location: "Bogotá, Colombia",
      bullets: [
        "Spearheaded strategic planning and OKR definition: Partnered with executive leadership to formulate quarterly and annual business strategies, aligning Product, Finance, and Operations to ensure cohesive execution of company-wide goals.",
        "Drove business development & market expansion: Identified and evaluated new business opportunities through rigorous market analysis, financial modeling, and competitive benchmarking, directly informing Go-to-Market (GTM) strategies for new financial products.",
        "Optimized cross-functional operations: Designed and implemented data-driven performance tracking frameworks to monitor business health, identifying bottlenecks and deploying strategic interventions that improved operational efficiency and accelerated time-to-market."
      ]
    },
    {
      company: "Liberty Caribbean",
      role: "BMC Operations Manager (Contractor)",
      period: "November 2025 – January 2026",
      location: "Bogotá, Colombia",
      bullets: [
        "Led operational strategy: Orchestrated the end-to-end business management process, collaborating with regional stakeholders to streamline operations, reduce cost-to-serve, and improve overall service delivery.",
        "Performance & KPI management: Developed comprehensive business dashboards and tracking mechanisms to monitor key performance indicators (KPIs), translating complex operational data into actionable executive insights.",
        "Executed strategic cost-reduction initiatives: Identified operational inefficiencies and led cross-functional task forces to implement process improvements, significantly optimizing budget allocation and protecting bottom-line margins."
      ]
    },
    {
      company: "Ikonico (Panabel Group)",
      role: "General Manager",
      period: "May 2021 – March 2025",
      location: "Bogota, Colombia",
      bullets: [
        "P&L Ownership & Revenue Growth: Held full P&L responsibility for a portfolio of premium consumer brands (Montblanc, Bvlgari), driving 47% YoY revenue growth and achieving a 353% ROI through strategic resource allocation and business mix optimization.",
        "Strategic Partnerships & Business Development: Negotiated and launched high-impact B2B2C partnerships and co-branded campaigns with key financial players (Banco de Occidente, Rappicard), successfully scaling the user base and reducing Customer Acquisition Cost (CAC).",
        "Omnichannel GTM Strategy: Spearheaded a large-scale omnichannel expansion initiative, integrating digital touchpoints into the physical user journey to capture new market segments and boost brand resonance.",
        "Cross-Functional Leadership: Directed a matrixed team across Sales, Product, and Finance to execute core strategic initiatives, including a full ERP implementation that unlocked an 11% operational cost reduction."
      ]
    },
    {
      company: "Joyerías Bauer",
      role: "Head of eCommerce & Digital Strategy",
      period: "June 2019 – May 2021",
      location: "Bogota, Colombia",
      bullets: [
        "Official Rolex Distributor: Formulated and executed the Go-to-Market strategy for a new mobile-first e-commerce platform, driving user acquisition and retention efforts that resulted in 211% YoY sales growth.",
        "Market Expansion: Managed the launch and scaling of digital operations in a new LATAM market (Ecuador), overseeing end-to-end strategic execution and demonstrating the ability to manage complex, fast-paced international projects.",
        "Global-to-Local Strategy Adaptation: Adapted global corporate guidelines for prestigious brands (Rolex, Patek Philippe) to ensure local market relevance, leading to the operation being recognized by Rolex as a regional success story for best-in-class execution."
      ]
    },
    {
      company: "Linio",
      role: "Key Account Manager",
      period: "July 2017 – August 2018",
      location: "Bogota, Colombia",
      bullets: [
        "Rocket Internet / Falabella: Developed and executed joint business plans and partnership initiatives for major global brands (Adidas, Nike, Hasbro), resulting in 74% sales growth (from $5M to $8.7M USD) for the managed portfolio.",
        "Data-Driven Business Growth: Utilized market insights and internal data to inform product specialization strategies, successfully increasing Average Order Value (AOV) and market share."
      ]
    }
  ],
  skills: [
    {
      category: "Strategic Leadership",
      items: ["Corporate Strategy", "Go-to-Market (GTM)", "Strategic Partnerships", "P&L Management", "OKR Framework", "Market Expansion", "Financial Modeling"]
    },
    {
      category: "Operations & Management",
      items: ["Cross-Functional Leadership", "Stakeholder Management", "Process Optimization", "Agile Methodologies", "Project Management", "Change Management"]
    },
    {
      category: "Data & Digital Strategy",
      items: ["Data-Driven Decision Making", "E-commerce Strategy", "Digital Marketing", "ROI Optimization", "Business Intelligence", "Power BI", "SQL"]
    },
    {
      category: "Languages",
      items: ["Spanish (Native)", "English (C1 - Fluent/Advanced)", "Portuguese (B2 - Upper-Intermediate)"]
    }
  ],
  sectionTitles: {
    summary: "Professional Summary",
    experience: "Professional Experience",
    skills: "Key Skills",
    education: "Education",
    certifications: "Certifications & Additional Info"
  },
  education: [
    "Bachelor's Degree in Economics | Universidad del Rosario, Bogotá, Colombia | January 2013 – December 2018 | Academic Excellence Scholarship",
    "Data Science Career Program | Acamica (IBM & Globant Institution), Bogotá, Colombia | September 2019 – May 2020"
  ],
  certifications: [
    "Project Management Professional Certification (PMP)® - PMI",
    "Six Sigma Black Belt Certification - The Council for Six Sigma Certification",
    "Generative AI Leader (Google)",
    "Scrum Professional Certificates: Product Owner (SPOPC™), Master (SMPC®), Developer (SDPC™), Foundations (SFPC™)",
    "President of the Student Council, Faculty of Economics (Universidad del Rosario, 2016)",
    "Project Leader at Fundación Con Las Manos (Coordinated 30 volunteers)",
    "Media Coverage: Featured in [Portafolio (2025)](https://portafolio.co/negocios/empresas/esta-empresa-apuesta-por-liderar-el-segmento-de-perfumes-y-belleza-625271) regarding Ikonico's strategic positioning to lead the beauty and fragrance segment."
  ]
};

const GUEST_TEMPLATE: CvData = {
  firstName: "John",
  lastName: "Doe",
  location: "City, Country",
  address: "123 Main St, ZIP 12345",
  phone: "+1 234 567 8900",
  email: "john.doe@example.com",
  linkedin: "linkedin.com/in/johndoe",
  summary: "A brief summary of your professional background, key achievements, and career goals. Highlight your most relevant skills and what value you bring to a potential employer.",
  experience: [
    { 
      company: "Company Name", 
      role: "Job Title", 
      period: "Month YYYY – Present",
      location: "City, Country",
      bullets: [
        "Key achievement or responsibility in this role.",
        "Quantifiable result or impact you had on the business.",
        "Specific skill or tool used to accomplish a task."
      ]
    },
    { 
      company: "Previous Company", 
      role: "Previous Job Title", 
      period: "Month YYYY – Month YYYY",
      location: "City, Country",
      bullets: [
        "Key achievement or responsibility in this role.",
        "Quantifiable result or impact you had on the business.",
        "Specific skill or tool used to accomplish a task."
      ]
    }
  ],
  skills: [
    { 
      category: "Technical Skills", 
      items: ["Skill 1", "Skill 2", "Skill 3"] 
    },
    { 
      category: "Soft Skills", 
      items: ["Communication", "Leadership", "Problem Solving"] 
    }
  ],
  sectionTitles: {
    summary: "Professional Summary",
    experience: "Professional Experience",
    skills: "Skills & Expertise",
    education: "Education",
    certifications: "Certifications"
  },
  education: ["Degree Name, University Name, Year"],
  certifications: ["Certification Name, Issuing Organization, Year"]
};

interface JobMatch {
  title: string;
  company: string;
  location: string;
  link: string;
  platform?: string;
  matchScore: number;
  reason: string;
  customPitch: string;
  postedDate?: string;
  applicantCount?: number;
  tags?: string[];
  isTopOpportunity?: boolean;
}

interface FitAnalysis {
  originalScore: number;
  optimizedScore: number;
  improvement: string;
  keyChanges: string[];
}

type ApplicationStatus = 'IDENTIFIED' | 'RESEARCHING' | 'APPLIED' | 'SCREENING' | 'INTERVIEW' | 'ASSESSMENT' | 'OFFER' | 'REJECTED' | 'ACCEPTED';

interface Application {
  id?: string;
  companyName: string;
  jobTitle: string;
  seniorityLevel?: string;
  location?: string;
  workMode?: string;
  source?: string;
  deadline?: string;
  dateApplied?: string;
  status: ApplicationStatus;
  jobUrl?: string;
  logoUrl?: string;
  cvVersion?: string;
  salaryRange?: string;
  salaryExpectation?: string;
  recruiterName?: string;
  internalConnection?: boolean;
  referralSource?: string;
  fitScore?: number;
  priorityTier?: 'A' | 'B' | 'C';
  nextAction?: string;
  nextActionDate?: string;
  notes?: string;
  uid: string;
  createdAt: any;
  updatedAt: any;
}

const CompanyLogo = ({ companyName, jobUrl, logoUrl }: { companyName: string, jobUrl?: string, logoUrl?: string }) => {
  const [sources, setSources] = useState<string[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    let active = true;
    setCurrentIdx(0);
    
    // Build an array of valid image sources to eagerly fall back through.
    const resolveDomainAndImage = async () => {
      let officialJobBoardSlug = '';
      let officialJobBoardDomain = '';
      
      // 1. Try to extract specific company identifiers directly from the official Job Board URL
      if (jobUrl) {
        try {
          const url = new URL(jobUrl.startsWith('http') ? jobUrl : `https://${jobUrl}`);
          const host = url.hostname.replace('www.', '');
          const pathParts = url.pathname.split('/').filter(Boolean);

          if (host.includes('linkedin.com')) {
            if (pathParts[0] === 'company' && pathParts[1]) {
              officialJobBoardSlug = pathParts[1];
            } else if (pathParts[0] === 'jobs' && pathParts[1] === 'view' && pathParts[2]) {
              const jobSlug = pathParts[2];
              const atIndex = jobSlug.indexOf('-at-');
              if (atIndex !== -1) {
                const afterAt = jobSlug.substring(atIndex + 4);
                const match = afterAt.match(/^([a-zA-Z0-9\-]+?)(?:-\d{8,})?$/);
                if (match) officialJobBoardSlug = match[1];
              }
            }
          } else if (host.includes('boards.greenhouse.io') || host.includes('job-boards.greenhouse.io')) {
            if (pathParts[0]) officialJobBoardSlug = pathParts[0];
          } else if (host.includes('jobs.lever.co')) {
            if (pathParts[0]) officialJobBoardSlug = pathParts[0];
          } else if (host.includes('jobs.ashbyhq.com')) {
            if (pathParts[0]) officialJobBoardSlug = pathParts[0];
          } else if (host.includes('myworkdayjobs.com') || host.includes('breezy.hr') || host.includes('bamboohr.com') || host.includes('applytojob.com')) {
            officialJobBoardSlug = host.split('.')[0];
          } else if (host.includes('smartrecruiters.com') || host.includes('apply.workable.com')) {
            if (pathParts[0]) officialJobBoardSlug = pathParts[0];
          } else {
            // Not a known generic aggregator, meaning this IS the official company website directly!
            officialJobBoardDomain = host;
          }
        } catch (e) {
          // ignore invalid URLs
        }
      }

      // 2. Brandfetch Search API (Open/No-Key API) for true domain mapping and context extraction
      // Prioritize the official slug extracted from the job board if it exists, otherwise use user input
      const queryName = officialJobBoardSlug ? officialJobBoardSlug.replace(/-/g, ' ') : companyName;
      let brandfetchSearchDomain = '';
      try {
        const res = await fetch(`https://api.brandfetch.io/v2/search/${encodeURIComponent(queryName)}`);
        if (res.ok) {
          const data = await res.json();
          // Smarter matching to prevent false positives (e.g. "Belvo" returning "Belvoir.co.uk")
          const normalizeString = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, '');
          const normalizedInput = normalizeString(companyName);
          const inputWords = companyName.toLowerCase().split(/[ \-]/).map(w => w.replace(/[^a-z0-9]/g, '')).filter(Boolean);

          let bestMatch = null;
          
          if (data && data.length > 0) {
            // Sort by API's native quality score first to put highest certainty results on top
            data.sort((a: any, b: any) => (b.qualityScore || 0) - (a.qualityScore || 0));
            
            // 1. Try exact match (strips accents so Nuiteé matches Nuitee) ALWAYS, regardless of Job Slug
            bestMatch = data.find((d: any) => d.name && normalizeString(d.name) === normalizedInput);
            
            // 2. Try strict subset match
            if (!bestMatch) {
              bestMatch = data.find((d: any) => {
                if (!d.name) return false;
                const normalizedD = normalizeString(d.name);
                const dWords = d.name.toLowerCase().split(/[ \-]/).map((w: string) => w.replace(/[^a-z0-9]/g, '')).filter(Boolean);
                // "American Express" matching "American Express Saudi Arabia"
                // Or if it's the absolute highest quality score result according to Brandfetch's strict contextual AI
                return ((normalizedD.includes(normalizedInput) || normalizedInput.includes(normalizedD)) && dWords[0] === inputWords[0]) || (d.qualityScore > 0.8 && dWords[0] === inputWords[0]);
              });
            }
          }
          // If we had a job board slug but the strict matching failed, trust the Slug completely
          if (!bestMatch && officialJobBoardSlug && data && data.length > 0) {
             bestMatch = data[0]; 
          }
          
          if (bestMatch) {
            brandfetchSearchDomain = bestMatch.domain;
          }
        }
      } catch(e) {
        // fetch failed or blocked
      }

      const allSources: string[] = [];
      const normalizedName = companyName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, '');

      // User Overrides: If the user provided a logoUrl, check if it's a domain name vs an image URL
      let userProvidedDomain = '';
      if (logoUrl) {
        const isLikelyDomain = !logoUrl.includes('/') && logoUrl.includes('.');
        if (isLikelyDomain) {
          userProvidedDomain = logoUrl.trim();
        } else {
          allSources.push(logoUrl);
        }
      }

      // Rank 1: Specific Company Logo Overrides to fix User Edge Cases
      const EXACT_LOGO_OVERRIDES: Record<string, string> = {
        'addi': 'https://framerusercontent.com/images/XXRZUDdqOep3u1GAluGAr9GbzFE.png',
        'sharkninja': 'https://www.sharkninja.com/on/demandware.static/Sites-US-SharkNinja-Site/-/default/dw8654a995/images/favicons/favicon-196x196.png',
        'yuno': 'https://cdn.prod.website-files.com/65e210a414fae2cb8054a995/684b515ecc97de62e21a1de1_android-chrome-256x256.png',
        'numerator': 'https://www.numerator.com/wp-content/uploads/2023/09/favicon.svg',
        'electronicarts': 'https://media.contentapi.ea.com/content/dam/ea/EA_logo.png',
        'ea': 'https://media.contentapi.ea.com/content/dam/ea/EA_logo.png',
        'arq': 'https://www.arqfinance.com/favicon.svg',
        'arqfinance': 'https://www.arqfinance.com/favicon.svg',
        'dollarapp': 'https://www.arqfinance.com/favicon.svg',
        'tiktok': 'https://sf-tb-sg.ibytedtos.com/obj/eden-sg/uhtyvueh7nulogpouzhm/tiktok-icon2.png',
        'dyson': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Dyson_logo.svg/1280px-Dyson_logo.svg.png',
        'fendi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Fendi_logo.svg/1280px-Fendi_logo.svg.png',
        'brigardurrutia': 'https://www.bu.com.co/themes/custom/brigard/img/logo.svg' // direct svg from their site
      };
      
      if (EXACT_LOGO_OVERRIDES[normalizedName]) {
        allSources.push(EXACT_LOGO_OVERRIDES[normalizedName]);
      }

      const EXACT_DOMAIN_OVERRIDES: Record<string, string> = {
        'addi': 'co.addi.com',
        'sharkninja': 'sharkninja.com',
        'yuno': 'y.uno',
        'arq': 'arqfinance.com',
        'arqgroup': 'arqfinance.com',
        'numerator': 'numerator.com',
        'ea': 'ea.com',
        'electronicarts': 'ea.com',
        'tiktok': 'tiktok.com',
        'dyson': 'dyson.com',
        'fendi': 'fendi.com',
        'brigardurrutia': 'bu.com.co',
        'pluxee': 'pluxeegroup.com', // Correct global domain for Pluxee.
        'belvo': 'belvo.com',
        'americanexpress': 'americanexpress.com',
        'amex': 'americanexpress.com',
        'nuitee': 'nuitee.com',
        'spacex': 'spacex.com',
        'stripe': 'stripe.com',
        'apple': 'apple.com'
      };

      // Create prioritized set of domains to check against robust providers
      const domainsToTry = new Set<string>();
      if (userProvidedDomain) domainsToTry.add(userProvidedDomain);
      if (EXACT_DOMAIN_OVERRIDES[normalizedName]) domainsToTry.add(EXACT_DOMAIN_OVERRIDES[normalizedName]);
      if (officialJobBoardDomain) domainsToTry.add(officialJobBoardDomain);
      if (brandfetchSearchDomain) domainsToTry.add(brandfetchSearchDomain);
      
      if (normalizedName) {
        domainsToTry.add(`${normalizedName}.com`);
      }

      // Rank 1B: Brandfetch Logo API (Much higher rate limits than the Brand API JSON endpoints)
      // We push the direct image URLs into our waterfall array instead of making a JSON fetch block.
      // The <img> element will automatically test these and fall through on 404s/403s.
      const brandfetchApiKey = import.meta.env.VITE_BRANDFETCH_API_KEY;
      if (brandfetchApiKey && domainsToTry.size > 0) {
        // Build an array of Brandfetch Logo API URLs for our candidate domains.
        // We reverse the Set so 'unshift' applies them in the correct priority (best at index 0).
        const candidateDomains = Array.from(domainsToTry).reverse();
        for (const dom of candidateDomains) {
           // We prefer 'icon' for our circular avatars, if it fails, we fall back to generic Favicons
           allSources.unshift(`https://asset.brandfetch.io/${dom}/logo?c=${brandfetchApiKey}`);
           allSources.unshift(`https://asset.brandfetch.io/${dom}/icon?c=${brandfetchApiKey}`);
        }
      }

      // Rank 2: Google Favicons V2 (Almost always high res 256x256, NEVER blocked by ad-blockers)
      // NOTE: Removed fallback_opts=TYPE,SIZE,URL so that if a site has no favicon, it returns a 404 instead of a generic blue globe.
      domainsToTry.forEach(d => {
        allSources.push(`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&url=http://${d}&size=256`);
      });

      // Rank 3: DuckDuckGo icons (16x16 pixelated, acts as a last-resort image safety net because they never 404)
      domainsToTry.forEach(d => {
        allSources.push(`https://icons.duckduckgo.com/ip3/${d}.ico`);
      });
      
      // Rank 5: UI avatars (absolute final fallback if everything fails to load)
      allSources.push(`https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=random&color=fff&size=128&bold=true&font-size=0.4`);
      
      const uniqueSources = Array.from(new Set(allSources)).filter(Boolean);

      if (active) {
        setSources(uniqueSources);
      }
    };

    resolveDomainAndImage();

    return () => { active = false; };
  }, [companyName, jobUrl, logoUrl]);

  if (sources.length === 0) return <span className="text-gray-400 flex items-center justify-center w-full h-full"><Briefcase size={20} /></span>;

  return (
    <img 
      src={sources[currentIdx]} 
      alt={companyName} 
      className="w-full h-full object-contain bg-white rounded"
      onError={() => {
        if (currentIdx < sources.length - 1) {
          setCurrentIdx(prev => prev + 1);
        }
      }}
    />
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'cv' | 'hunter' | 'optimizer' | 'tracker' | 'settings'>('cv');
  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem('applications');
    return saved ? JSON.parse(saved) : [];
  });
  const [isSavingApp, setIsSavingApp] = useState(false);
  const [isSavingCv, setIsSavingCv] = useState(false);
  const [isCvLoading, setIsCvLoading] = useState(false);
  const [showAiGenModal, setShowAiGenModal] = useState(false);
  const [isGeneratingBase, setIsGeneratingBase] = useState(false);
  const [aiGenAnswers, setAiGenAnswers] = useState({
    targetRole: '',
    achievements: '',
    skills: '',
    recentRole: '',
    education: ''
  });
  const [trackerFilter, setTrackerFilter] = useState<ApplicationStatus | 'ALL'>('ALL');
  const [trackerSort, setTrackerSort] = useState<'date' | 'company' | 'status'>('date');
  const [trackerSearch, setTrackerSearch] = useState('');
  const [showAppModal, setShowAppModal] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  
  // Gmail Auto-Sync State
  const [gmailToken, setGmailToken] = useState<string | null>(null);
  const [isSyncingGmail, setIsSyncingGmail] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(() => {
    const saved = localStorage.getItem('lastGmailSyncTime');
    return saved ? new Date(saved) : null;
  });
  const [autoSyncEnabled, setAutoSyncEnabled] = useState<boolean>(() => {
    return localStorage.getItem('gmailAutoSyncEnabled') === 'true';
  });

  const [isSearchingManual, setIsSearchingManual] = useState(false);
  const [isSearchingAi, setIsSearchingAi] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isExtractingCv, setIsExtractingCv] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [jobResults, setJobResults] = useState<JobMatch[]>([]);
  const [isSearchingMore, setIsSearchingMore] = useState(false);
  const [searchPage, setSearchPage] = useState(1);
  const [searchRecency, setSearchRecency] = useState<'24h' | '7d' | '30d'>('7d');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('Colombia');
  const [searchJobType, setSearchJobType] = useState<'all' | 'full-time' | 'contract' | 'internship'>('all');
  const [searchRemote, setSearchRemote] = useState<'all' | 'remote' | 'on-site' | 'hybrid'>('all');
  const [searchExpLevel, setSearchExpLevel] = useState<'all' | 'entry' | 'mid' | 'senior' | 'executive'>('all');
  const [jobDescription, setJobDescription] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [targetAts, setTargetAts] = useState('Workday');
  const [atsOptions, setAtsOptions] = useState(['Workday', 'Greenhouse', 'Lever', 'Taleo', 'SuccessFactors', 'Eightfold AI', 'SmartRecruiters', 'iCIMS', 'BambooHR', 'Jobvite', 'Other']);
  const [targetLanguage, setTargetLanguage] = useState('English');
  const [jobPostingUrl, setJobPostingUrl] = useState('');
  const [lastExtractedUrl, setLastExtractedUrl] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractProgress, setExtractProgress] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [cvDataState, setCvDataState] = useState<CvData>(() => {
    const saved = localStorage.getItem('cvDataProfile_v4');
    return saved ? JSON.parse(saved) : BLANK_TEMPLATE;
  });
  const [optimizedCv, setOptimizedCv] = useState<CvData | null>(null);
  const [fitAnalysis, setFitAnalysis] = useState<FitAnalysis | null>(null);
  const [useOptimized, setUseOptimized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [optimizeProgress, setOptimizeProgress] = useState(0);

  // Sync Applications to LocalStorage
  useEffect(() => {
    localStorage.setItem('applications', JSON.stringify(applications));
  }, [applications]);

  // Sync Base CV to LocalStorage
  useEffect(() => {
    localStorage.setItem('cvDataProfile_v4', JSON.stringify(cvDataState));
  }, [cvDataState]);

  const generateBaseCv = async () => {
    setIsGeneratingBase(true);
    setError(null);
    try {
      const ai = await getAiInstance();
      const prompt = `You are an expert career coach. Based on the following answers, generate a comprehensive, professional, and ATS-friendly base CV in JSON format.
      
      ANSWERS:
      - Target Role: ${aiGenAnswers.targetRole}
      - Top Achievements: ${aiGenAnswers.achievements}
      - Core Skills: ${aiGenAnswers.skills}
      - Recent Role: ${aiGenAnswers.recentRole}
      - Education: ${aiGenAnswers.education}
      
      The output MUST be a JSON object following this structure:
      {
        "firstName": "John",
        "lastName": "Doe",
        "location": "City, Country",
        "address": "Address details",
        "phone": "Phone number",
        "email": "email@example.com",
        "linkedin": "linkedin.com/in/username",
        "summary": "A powerful professional summary...",
        "experience": [
          { "company": "Company Name", "role": "Role Name", "period": "Dates", "location": "Location", "bullets": ["Achievement 1", "Achievement 2"] }
        ],
        "skills": [
          { "category": "Technical", "items": ["Skill 1", "Skill 2"] }
        ],
        "sectionTitles": { "summary": "Professional Summary", "experience": "Experience", "skills": "Skills", "education": "Education", "certifications": "Certifications" },
        "education": ["Degree, University, Year"],
        "certifications": ["Cert 1", "Cert 2"]
      }
      
      Ensure the content is professional, impactful, and uses strong action verbs.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      if (!response.text) throw new Error("Failed to generate CV content.");
      
      let result;
      try {
        result = JSON.parse(response.text);
      } catch (e) {
        const jsonMatch = response.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) result = JSON.parse(jsonMatch[0]);
        else throw e;
      }

      setCvDataState(result);
      setShowAiGenModal(false);
      
      // Auto-save to profile
      await saveBaseCv(result);
      
    } catch (err: any) {
      console.error("AI Generation Error:", err);
      setError("Failed to generate CV. Please try again.");
    } finally {
      setIsGeneratingBase(false);
    }
  };

  const extractCvFromFile = async (file: File) => {
    setIsExtractingCv(true);
    setError(null);
    try {
      console.log("Starting extraction for file:", file.name, file.type);
      let text = '';
      
      if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        
        // Ensure worker is set correctly
        pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
        
        const loadingTask = pdfjs.getDocument({ 
          data: arrayBuffer,
          useWorkerFetch: false,
          isEvalSupported: false
        });
        
        const pdf = await loadingTask.promise;
        console.log("PDF loaded, pages:", pdf.numPages);
        
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map((item: any) => item.str).join(' ');
          fullText += pageText + '\n';
        }
        text = fullText;
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } else if (file.type === 'application/msword' || file.name.endsWith('.doc')) {
        // Basic fallback for .doc (mammoth only supports .docx)
        text = await file.text();
      } else {
        text = await file.text();
      }

      console.log("Extracted text length:", text.length);
      if (!text.trim()) throw new Error("Could not extract text from file.");

      const ai = await getAiInstance();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Extract the following information from this CV text and return it as a JSON object matching this structure. 
        If a field is not found, leave it as an empty string. 
        For experience, extract as many roles as possible.
        
        Structure:
        {
          "firstName": "string",
          "lastName": "string",
          "location": "string",
          "address": "string",
          "phone": "string",
          "email": "string",
          "linkedin": "string",
          "summary": "string",
          "experience": [{"company": "string", "role": "string", "period": "string", "location": "string", "bullets": ["string"]}],
          "education": ["string"],
          "certifications": ["string"],
          "skills": [{"category": "string", "items": ["string"]}]
        }

        CV Text:
        ${text}`,
        config: { 
          responseMimeType: "application/json",
          systemInstruction: "You are a professional CV parser. Extract data accurately into the requested JSON format."
        }
      });

      console.log("AI Response received");
      const extractedData = JSON.parse(response.text);
      
      // Update state with extracted data
      setCvDataState(prev => ({
        ...prev,
        ...extractedData,
        sectionTitles: prev.sectionTitles
      }));
      
    } catch (err: any) {
      console.error("Extraction error details:", err);
      setError(`Failed to extract data from CV: ${err.message || 'Unknown error'}. Please try another file or fill manually.`);
    } finally {
      setIsExtractingCv(false);
    }
  };

  const saveBaseCv = async (data: CvData) => {
    if (!data.firstName.trim() || !data.lastName.trim()) {
      setError("First name and Last name are required to save your CV.");
      return;
    }

    setIsSavingCv(true);
    try {
      setCvDataState(data);
    } catch (err: any) {
      setError(`Failed to save CV to profile: ${err.message}`);
    } finally {
      setIsSavingCv(false);
    }
  };

  const saveApplication = async (appData: Partial<Application>) => {
    setIsSavingApp(true);
    try {
      const now = new Date().toISOString();
      if (appData.id) {
        setApplications(prev => prev.map(app => 
          app.id === appData.id ? { ...app, ...appData, updatedAt: now } as Application : app
        ));
      } else {
        const newApp: Application = {
          ...appData as any,
          id: Date.now().toString(),
          uid: 'local',
          status: appData.status || 'IDENTIFIED',
          createdAt: now,
          updatedAt: now
        };
        setApplications(prev => [newApp, ...prev]);
      }
      setShowAppModal(false);
      setEditingApp(null);
    } catch (err) {
      console.error("Save Application Error:", err);
      setError("Failed to save application.");
    } finally {
      setIsSavingApp(false);
    }
  };

  const deleteApplication = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;
    try {
      setApplications(prev => prev.filter(app => app.id !== id));
    } catch (err) {
      console.error("Delete Error:", err);
      setError("Failed to delete application.");
    }
  };

  const updateFirstName = (value: string) => {
    if (useOptimized && optimizedCv) {
      setOptimizedCv(prev => prev ? { ...prev, firstName: value } : null);
    } else {
      setCvDataState(prev => ({ ...prev, firstName: value }));
    }
  };

  const updateLastName = (value: string) => {
    if (useOptimized && optimizedCv) {
      setOptimizedCv(prev => prev ? { ...prev, lastName: value } : null);
    } else {
      setCvDataState(prev => ({ ...prev, lastName: value }));
    }
  };

  const updateLocation = (value: string) => {
    if (useOptimized && optimizedCv) {
      setOptimizedCv(prev => prev ? { ...prev, location: value } : null);
    } else {
      setCvDataState(prev => ({ ...prev, location: value }));
    }
  };

  const updateAddress = (value: string) => {
    if (useOptimized && optimizedCv) {
      setOptimizedCv(prev => prev ? { ...prev, address: value } : null);
    } else {
      setCvDataState(prev => ({ ...prev, address: value }));
    }
  };

  const updateSectionTitle = (key: keyof CvData['sectionTitles'], value: string) => {
    if (useOptimized && optimizedCv) {
      setOptimizedCv(prev => prev ? { ...prev, sectionTitles: { ...prev.sectionTitles, [key]: value } } : null);
    } else {
      setCvDataState(prev => ({ ...prev, sectionTitles: { ...prev.sectionTitles, [key]: value } }));
    }
  };

  const updateSummary = (value: string) => {
    if (useOptimized && optimizedCv) {
      setOptimizedCv(prev => prev ? { ...prev, summary: value } : null);
    } else {
      setCvDataState(prev => ({ ...prev, summary: value }));
    }
  };

  const updateExperienceBullet = (expIdx: number, bulletIdx: number, value: string) => {
    if (useOptimized && optimizedCv) {
      setOptimizedCv(prev => {
        if (!prev) return null;
        const newExp = [...prev.experience];
        newExp[expIdx] = { ...newExp[expIdx], bullets: [...newExp[expIdx].bullets] };
        newExp[expIdx].bullets[bulletIdx] = value;
        return { ...prev, experience: newExp };
      });
    } else {
      setCvDataState(prev => {
        const newExp = [...prev.experience];
        newExp[expIdx] = { ...newExp[expIdx], bullets: [...newExp[expIdx].bullets] };
        newExp[expIdx].bullets[bulletIdx] = value;
        return { ...prev, experience: newExp };
      });
    }
  };

  const updateExperienceField = (expIdx: number, field: keyof CvData['experience'][0], value: string) => {
    if (useOptimized && optimizedCv) {
      setOptimizedCv(prev => {
        if (!prev) return null;
        const newExp = [...prev.experience];
        newExp[expIdx] = { ...newExp[expIdx], [field]: value };
        return { ...prev, experience: newExp };
      });
    } else {
      setCvDataState(prev => {
        const newExp = [...prev.experience];
        newExp[expIdx] = { ...newExp[expIdx], [field]: value };
        return { ...prev, experience: newExp };
      });
    }
  };

  const updateEducationItem = (idx: number, value: string) => {
    if (useOptimized && optimizedCv) {
      setOptimizedCv(prev => {
        if (!prev) return null;
        const newEdu = [...prev.education];
        newEdu[idx] = value;
        return { ...prev, education: newEdu };
      });
    } else {
      setCvDataState(prev => {
        const newEdu = [...prev.education];
        newEdu[idx] = value;
        return { ...prev, education: newEdu };
      });
    }
  };

  const updateCertificationItem = (idx: number, value: string) => {
    if (useOptimized && optimizedCv) {
      setOptimizedCv(prev => {
        if (!prev) return null;
        const newCert = [...prev.certifications];
        newCert[idx] = value;
        return { ...prev, certifications: newCert };
      });
    } else {
      setCvDataState(prev => {
        const newCert = [...prev.certifications];
        newCert[idx] = value;
        return { ...prev, certifications: newCert };
      });
    }
  };
  const [searchProgress, setSearchProgress] = useState(0);
  const [searchReasoning, setSearchReasoning] = useState('');

  const REASONING_PHRASES = [
    "Analyzing your profile for the best fit...",
    "Scanning LinkedIn for direct job postings...",
    "Checking Indeed for active vacancies...",
    "Verifying source authority and website reputation...",
    "Performing deep link validation to avoid 404s...",
    "Filtering out catalogs and search result pages...",
    "Matching your skills with top-tier opportunities...",
    "Ensuring direct access to application pages...",
    "Ranking opportunities by match score...",
    "Finalizing your personalized job matches..."
  ];

  useEffect(() => {
    let interval: any;
    if (isSearching) {
      setSearchProgress(0);
      let phraseIndex = 0;
      setSearchReasoning(REASONING_PHRASES[0]);
      
      interval = setInterval(() => {
        setSearchProgress(prev => {
          if (prev >= 95) return prev;
          return prev + (100 - prev) * 0.1;
        });
        
        phraseIndex = (phraseIndex + 1) % REASONING_PHRASES.length;
        setSearchReasoning(REASONING_PHRASES[phraseIndex]);
      }, 3000);
    } else {
      setSearchProgress(0);
      setSearchReasoning('');
    }
    return () => clearInterval(interval);
  }, [isSearching]);

  useEffect(() => {
    let interval: any;
    if (isExtracting) {
      setExtractProgress(0);
      interval = setInterval(() => {
        setExtractProgress(prev => {
          if (prev >= 99) return prev;
          // Linear-ish up to 85%, then slow down significantly
          if (prev < 85) return prev + (85 - prev) * 0.1 + 0.5;
          const remaining = 100 - prev;
          const increment = remaining * 0.03;
          return prev + increment;
        });
      }, 500);
    } else {
      setExtractProgress(0);
    }
    return () => clearInterval(interval);
  }, [isExtracting]);

  useEffect(() => {
    let interval: any;
    if (isOptimizing) {
      setOptimizeProgress(0);
      interval = setInterval(() => {
        setOptimizeProgress(prev => {
          if (prev >= 95) return prev;
          return prev + (100 - prev) * 0.08;
        });
      }, 500);
    } else {
      setOptimizeProgress(0);
    }
    return () => clearInterval(interval);
  }, [isOptimizing]);

  const getAiInstance = async () => {
    let apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey && window.aistudio) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await window.aistudio.openSelectKey();
      }
      apiKey = process.env.GEMINI_API_KEY;
    }
    
    if (!apiKey) {
      throw new Error("No Gemini API key available");
    }
    
    return new GoogleGenAI({ apiKey });
  };

  const loginGmail = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setGmailToken(tokenResponse.access_token);
      syncGmailWithToken(tokenResponse.access_token);
    },
    scope: 'https://www.googleapis.com/auth/gmail.readonly',
    onError: () => setError('Google Login Failed')
  });

  const syncGmailWithToken = async (token: string) => {
    setIsSyncingGmail(true);
    try {
      const activeApps = applications.filter(a => !['REJECTED', 'ACCEPTED', 'OFFER'].includes(a.status));
      if (activeApps.length === 0) {
        setIsSyncingGmail(false);
        return;
      }

      // Query Gmail for recent emails relating to active applications
      let anyUpdates = false;
      let newAppsState = [...applications];

      for (let app of activeApps) {
        // Find emails in the last 14 days mentioning the company
        const query = `"${app.companyName}" (interview OR action OR update OR application OR status OR offer) newer_than:14d`;
        const res = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}&maxResults=3`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!res.ok) {
          if (res.status === 401) {
            setGmailToken(null);
            throw new Error("Gmail token expired. Please reconnect.");
          }
          continue;
        }

        const data = await res.json();
        if (!data.messages || data.messages.length === 0) continue;

        // Fetch actual message content for the most recent email on this topic
        const msgRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${data.messages[0].id}?format=full`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const msgData = await msgRes.json();
        
        // Extract basic text body (very simplified for snippet)
        let emailBody = '';
        if (msgData.payload?.parts) {
          const textPart = msgData.payload.parts.find((p: any) => p.mimeType === 'text/plain');
          if (textPart?.body?.data) {
             emailBody = atob(textPart.body.data.replace(/-/g, '+').replace(/_/g, '/'));
          }
        } else if (msgData.payload?.body?.data) {
           emailBody = atob(msgData.payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
        }
        
        if (!emailBody) continue;

        // Use AI to extract status
        const ai = await getAiInstance();
        const prompt = `You are reading an email from "${app.companyName}" regarding a job application for "${app.jobTitle}".
        
Email content snippet (first 1500 chars):
${emailBody.substring(0, 1500)}

Determine if this email implies a clear status change for the candidate. 
The possible statuses are:
- REJECTED
- OFFER
- INTERVIEW (an interview is being scheduled)
- SCREENING (asking for an assessment, test, or pre-screen call)
- APPLIED (just a confirmation of application)
- UNCHANGED (this is mostly marketing, generic newsletter, or doesn't change the status from '${app.status}')

Return ONLY a JSON object:
{
  "newStatus": "STATUS_NAME",
  "reason": "Brief one sentence explanation"
}`;

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                newStatus: { type: Type.STRING },
                reason: { type: Type.STRING }
              },
              required: ["newStatus", "reason"]
            }
          }
        });

        if (response.text) {
          const result = JSON.parse(response.text);
          if (result.newStatus && result.newStatus !== 'UNCHANGED' && result.newStatus !== app.status) {
            // Update app
            const updatedApp = {
              ...app,
              status: result.newStatus as ApplicationStatus,
              notes: app.notes ? `${app.notes}\n\n[Auto-Sync ${new Date().toLocaleDateString()}]: Changed to ${result.newStatus} based on email. ${result.reason}` : `[Auto-Sync ${new Date().toLocaleDateString()}]: Changed to ${result.newStatus} based on email. ${result.reason}`,
              updatedAt: new Date().toISOString()
            };
            newAppsState = newAppsState.map(a => a.id === app.id ? updatedApp : a);
            anyUpdates = true;
          }
        }
      }

      if (anyUpdates) {
        setApplications(newAppsState);
        localStorage.setItem('applications', JSON.stringify(newAppsState));
      }
      
      const now = new Date();
      setLastSyncTime(now);
      localStorage.setItem('lastGmailSyncTime', now.toISOString());

    } catch(err: any) {
      console.error(err);
      setError(err.message || "Failed to sync Gmail.");
    } finally {
      setIsSyncingGmail(false);
    }
  };

  useEffect(() => {
    let interval: any;
    if (autoSyncEnabled && gmailToken) {
      // Run every hour
      interval = setInterval(() => {
        syncGmailWithToken(gmailToken);
      }, 60 * 60 * 1000);
    }
    return () => clearInterval(interval);
  }, [autoSyncEnabled, gmailToken]);

  const evaluateFitScore = async (app: Application) => {
    setIsSavingApp(true);
    try {
      const ai = await getAiInstance();
      const prompt = `You are an expert HR Talent Acquisition Specialist evaluating a candidate's probability of securing an offer at ${app.companyName} for the role of "${app.jobTitle}".
      
      Using the following parameters, calculate a realistic probabilistic Fit Score (0-100%) for the candidate:
      1. Candidate Profile: Assess the overall fit based on the CV. (Reference Profile: ${cvDataState.summary.substring(0, 1000)}...)
      2. Status Advance: The application is currently in the '${app.status}' stage. (Higher stages like INTERVIEW or OFFER drastically increase probability. IDENTIFIED limits it).
      3. Company Competitiveness: Consider how difficult it is to pass ${app.companyName}'s selection process based on general Internet knowledge and forums (e.g., passing FAANG is sub-1%, local startup is higher).
      4. Cultural Fit: How well does the candidate's profile align with ${app.companyName}'s typical hires & culture?
      
      Return ONLY a valid JSON object with:
      {
        "score": number (0-100),
        "reason": "One sentence explaining why you assigned this specific probability score considering all factors."
      }`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              reason: { type: Type.STRING }
            },
            required: ["score", "reason"]
          }
        }
      });
      
      if(response.text) {
        const result = JSON.parse(response.text);
        saveApplication({
          ...app,
          fitScore: result.score,
          notes: app.notes ? `${app.notes}\n\n[AI Probability Evaluation]: ${result.reason}` : `[AI Probability Evaluation]: ${result.reason}`
        });
      }
    } catch(err) {
      console.error(err);
      setError("Failed to evaluate probabilty score.");
    } finally {
      setIsSavingApp(false);
    }
  };

  const currentCvData = useOptimized && optimizedCv ? optimizedCv : cvDataState;

  const handlePrint = () => {
    window.print();
  };

  const extractJobDetails = async (url: string) => {
    if (!url || url === lastExtractedUrl) return;
    setIsExtracting(true);
    setError(null);
    try {
      // Step 1: Use a dedicated scraping API (Jina Reader) to extract clean markdown from the URL
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 second timeout
      
      let scrapeResponse;
      try {
        scrapeResponse = await fetch(`https://r.jina.ai/${encodeURIComponent(url)}`, {
          signal: controller.signal,
          headers: {
            'X-Timeout': '20' // Tell Jina to timeout after 20s
          }
        });
      } catch (e: any) {
        if (e.name === 'AbortError') {
          throw new Error("The scraping API timed out while trying to read the page. The site might be too slow or blocking bots.");
        }
        throw e;
      } finally {
        clearTimeout(timeoutId);
      }

      if (scrapeResponse.status === 429) {
        throw new Error("The scraping API limit has been reached. Please try again in a few minutes.");
      }

      if (scrapeResponse.status === 403) {
        throw new Error("The scraping API was blocked by the target site. This often happens with highly protected sites like LinkedIn.");
      }

      if (!scrapeResponse.ok) {
        throw new Error("The scraping API could not access this URL. It might be protected against bots or the URL is invalid.");
      }
      const scrapedText = await scrapeResponse.text();

      if (scrapedText.length < 500 && (scrapedText.toLowerCase().includes("forbidden") || scrapedText.toLowerCase().includes("access denied") || scrapedText.toLowerCase().includes("robot") || scrapedText.toLowerCase().includes("captcha"))) {
        throw new Error("The site is blocking the scraping attempt. This often happens with highly protected sites or when bot protection is triggered.");
      }

      // Pre-clean for AI: Remove large JSON blocks and noise that Jina often includes for SPAs (like Eightfold)
      const cleanedForAi = scrapedText
        .replace(/`\{[\s\S]*?\}`/g, '[JSON Block]') 
        .replace(/\{"themeOptions"[\s\S]*?\}/g, '[Theme JSON]')
        .replace(/\{"props"[\s\S]*?\}/g, '[Props JSON]')
        .replace(/\{"state"[\s\S]*?\}/g, '[State JSON]')
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/\n{3,}/g, '\n\n') // Collapse multiple newlines
        .substring(0, 20000); // 20k chars is plenty for metadata extraction

      // Step 2: Use the cheaper Flash model to parse ONLY the metadata
      const ai = await getAiInstance();
      const aiPromise = ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are an expert data extractor. I have scraped the text content of a job posting.
        
        Here is the scraped text:
        ---
        ${cleanedForAi}
        ---
        
        CRITICAL INSTRUCTIONS:
        1. DO NOT hallucinate or guess information.
        2. Extract the company name, job title, ATS, and language.
        3. To help me extract the exact job description quickly, provide the EXACT first 7 words of the actual job description as \`descriptionStartSnippet\`, and the EXACT last 7 words of the actual job description as \`descriptionEndSnippet\`.
        - Ignore website navigation, headers, login prompts, "Sign in to access", "Similar jobs", "People also viewed", etc.
        - The start snippet should be the very beginning of the role overview or about the company section.
        - The end snippet should be the very end of the requirements, benefits, or location section, right before the website footer or similar jobs section.
        
        Return a JSON object with:
        - company: The exact hiring company name.
        - role: The exact job title.
        - ats: The ATS system used (if identifiable from the URL or text, e.g. Workday, Greenhouse, Lever, Taleo, SuccessFactors, Eightfold AI, SmartRecruiters, iCIMS, or "Other").
        - language: The language the job is posted in (e.g., "English", "Spanish").
        - descriptionStartSnippet: The exact first 7 words of the job description.
        - descriptionEndSnippet: The exact last 7 words of the job description.`,
        config: {
          temperature: 0,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              company: { type: Type.STRING },
              role: { type: Type.STRING },
              ats: { type: Type.STRING },
              language: { type: Type.STRING },
              descriptionStartSnippet: { type: Type.STRING },
              descriptionEndSnippet: { type: Type.STRING }
            },
            required: ["company", "role", "ats", "language", "descriptionStartSnippet", "descriptionEndSnippet"]
          }
        }
      });

      const aiTimeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("The AI model took too long to respond. Please try again.")), 45000));
      const response = await Promise.race([aiPromise, aiTimeoutPromise]) as GenerateContentResponse;

      const data = JSON.parse(response.text || '{}');
      if (data.company) setTargetCompany(data.company);
      if (data.role) setTargetRole(data.role);
      if (data.ats) {
        setTargetAts(data.ats);
        // If the AI found an ATS not in our list, add it dynamically
        setAtsOptions(prev => {
          if (!prev.includes(data.ats) && data.ats !== "Other") {
            // Insert before "Other"
            const newList = [...prev];
            const otherIndex = newList.indexOf("Other");
            if (otherIndex > -1) {
              newList.splice(otherIndex, 0, data.ats);
            } else {
              newList.push(data.ats);
            }
            return newList;
          }
          return prev;
        });
      }
      if (data.language) setTargetLanguage(data.language);
      
      let finalJobDescription = scrapedText;
      
      // Try to extract the exact job description block
      const buildRegex = (snippet: string) => {
        // Strip markdown symbols to match words only
        const words = snippet.replace(/[*#_[\]()>-]/g, '').trim().split(/\s+/).filter((w: string) => w.length > 0).slice(0, 10);
        if (words.length === 0) return null;
        // Match words separated by any whitespace or markdown symbols
        // We use a non-greedy wildcard to be more flexible and avoid ReDoS
        const regexStr = words.map((w: string) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('[\\s*#_\\[\\]()>-]{1,50}');
        try {
          return new RegExp(regexStr, 'i');
        } catch (e) {
          console.error("Invalid regex generated:", regexStr);
          return null;
        }
      };

      if (data.descriptionStartSnippet) {
        try {
          const startRegex = buildRegex(data.descriptionStartSnippet);
          if (startRegex) {
            const startMatch = finalJobDescription.match(startRegex);
            if (startMatch && startMatch.index !== undefined) {
              finalJobDescription = finalJobDescription.substring(startMatch.index);
            }
          }
        } catch (e) {
          console.warn("Start snippet matching failed:", e);
        }
      }

      if (data.descriptionEndSnippet) {
        try {
          const endRegex = buildRegex(data.descriptionEndSnippet);
          if (endRegex) {
            const endMatch = finalJobDescription.match(endRegex);
            if (endMatch && endMatch.index !== undefined) {
              finalJobDescription = finalJobDescription.substring(0, endMatch.index + endMatch[0].length);
            }
          }
        } catch (e) {
          console.warn("End snippet matching failed:", e);
        }
      }

      // Fallback if it's still too long and seems to have LinkedIn headers
      if (finalJobDescription.length === scrapedText.length) {
         const aboutMatch = finalJobDescription.match(/(About the job|Job description|Acerca del empleo|Descripción del empleo)/i);
         if (aboutMatch && aboutMatch.index !== undefined) {
             finalJobDescription = finalJobDescription.substring(aboutMatch.index);
         }
      }

      // Aggressive Markdown Cleanup
      // 1. Remove images: ![alt](url)
      finalJobDescription = finalJobDescription.replace(/!\[.*?\]\([^)]*\)/g, '');
      // 2. Remove links: [text](url) -> text
      finalJobDescription = finalJobDescription.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
      // Run twice for nested links like [![alt](url)](url) which became [](url)
      finalJobDescription = finalJobDescription.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
      // 3. Remove empty brackets
      finalJobDescription = finalJobDescription.replace(/\[\]/g, '');

      // 4. Remove typical LinkedIn footer junk if it's there
      const footerJunk = [
        "Explore top content on LinkedIn", 
        "Sign in to see who you already know", 
        "Sign in to set job alerts", 
        "Similar jobs", 
        "People also viewed", 
        "Show more jobs like this",
        "Sign in / Join now",
        "Sign in\nJoin now",
        "Join now\nSign in",
        "About Help Center",
        "Privacy & Terms",
        "Ad Choices",
        "Advertising",
        "Business Services",
        "Get the LinkedIn app",
        "More...",
        "© 2026 LinkedIn",
        "© 2025 LinkedIn",
        "© 2024 LinkedIn"
      ];
      for (const junk of footerJunk) {
         const junkIndex = finalJobDescription.indexOf(junk);
         if (junkIndex > -1) {
             finalJobDescription = finalJobDescription.substring(0, junkIndex);
         }
      }

      // 5. Clean up multiple newlines
      finalJobDescription = finalJobDescription.replace(/\n{3,}/g, '\n\n').trim();

      // 6. Final check: if it still contains "Sign in" or "Join now" at the very beginning, strip it
      if (finalJobDescription.startsWith("Sign in") || finalJobDescription.startsWith("Join now")) {
          const firstNewline = finalJobDescription.indexOf('\n');
          if (firstNewline > -1 && firstNewline < 100) {
              finalJobDescription = finalJobDescription.substring(firstNewline).trim();
          }
      }

      setJobDescription(finalJobDescription);
      
      setLastExtractedUrl(url);
    } catch (err: any) {
      console.error("Extraction error:", err);
      const errorMessage = err.message || String(err);
      
      if (errorMessage.includes("API Key is missing")) {
        setError(errorMessage);
      } else if (errorMessage.includes("scraping API")) {
        setError(errorMessage);
      } else if (errorMessage.includes("RESOURCE_EXHAUSTED") || errorMessage.includes("spending cap")) {
        setError("AI Quota Exceeded: Your Google Cloud project has reached its spending cap or rate limit. Please check your billing settings in Google AI Studio.");
      } else if (errorMessage.includes("Unexpected token")) {
        setError("The AI returned an invalid response. Please try again.");
      } else {
        setError(`Extraction failed: ${errorMessage.substring(0, 150)}. Please ensure the URL is valid.`);
      }
    } finally {
      setIsExtracting(false);
    }
  };

  const optimizeCv = async () => {
    if (!jobDescription.trim()) return;
    setIsOptimizing(true);
    setError(null);

    try {
      const ai = await getAiInstance();
      const prompt = `You are an expert ATS optimizer and career coach. 
      Tailor the following CV data to match this specific job opportunity, ensuring the output sounds natural and not overtly AI-generated. 
      
      CRITICAL: DO NOT mention the target company name ("${targetCompany}") anywhere in the CV content (summary, bullets, etc.). 
      The CV should be a record of the candidate's achievements, not a direct letter to the company.
      
      Avoid directly copying phrases from the job description. Focus on strategic alignment.
      
      TARGET COMPANY: ${targetCompany || 'Not specified'}
      TARGET ROLE: ${targetRole || 'Not specified'}
      TARGET ATS SYSTEM: ${targetAts || 'Workday'}
      TARGET LANGUAGE: ${targetLanguage}
      
      JOB DESCRIPTION:
      ${jobDescription}
      
      ORIGINAL CV DATA:
      ${JSON.stringify(cvDataState)}
      
      INSTRUCTIONS:
      1. Rewrite the 'summary' to emphasize relevant experience for this specific job. Focus on solving the problems mentioned in the job description, using natural language. 
         - AVOID AI cliches like "I am a...", "With a proven track record of...", "Passionate about...". 
         - START with direct, high-impact statements.
         - MANDATORY: If the candidate possesses key certifications (e.g., PMP®, Six Sigma, Scrum) that are highly relevant to the target role, elegantly weave them into the new summary.
      2. For each 'experience' item, rewrite the 'bullets' to highlight achievements and skills that match the job description. Ensure the language is subtle and professional.
         - MANDATORY: Keep the 'period' (dates) in a strict "Month YYYY – Month YYYY" or "Month YYYY – Present" format. This is critical for ATS parsing.
      3. Use universal, ATS-friendly terminology for skills and achievements. Translate ALL content, including section titles (e.g., 'Professional Summary', 'Experience', 'Skills', 'Education', 'Certifications'), to the target language.
      4. DO NOT change names, dates, companies, or roles.
      5. The tone should be professional, strategic, and subtle—avoiding obvious keyword stuffing or sounding like a direct copy-paste.
      6. Ensure the structure is highly readable for the specified ATS system (${targetAts}).
      7. IMPORTANT: Translate the entire CV content (summary, experience bullets, skill categories, SECTION TITLES, education items, and certification items) into ${targetLanguage}. 
         - MANDATORY: Every single item in the 'education' and 'certifications' arrays MUST be translated into ${targetLanguage}. 
         - This includes translating labels like "Certifications:", "Languages:", "Media Coverage:", etc., and the content following them.
         - Do not leave any item in English if the target language is different.
         - Make sure translated section titles are accurate and natural-sounding in ${targetLanguage}.
      8. MANDATORY: DO NOT include the name of the target company ("${targetCompany}") in the summary or any other part of the CV. This is a major AI giveaway.
      9. CRITICAL LINK PRESERVATION: If any text in the original CV contains Markdown hyperlinks (e.g., \`[Portafolio (2025)](https://portafolio.co/...)\`), you MUST preserve the EXACT hyperlink syntax and URL in the optimized/translated output. Do NOT remove or break active markdown links.
      
      Return a JSON object with two fields:
      - 'cv': The updated CV data matching the original structure, with all content and titles translated.
      - 'fitAnalysis': An object with:
        - 'originalScore': (0-100) How well the original CV matched.
        - 'optimizedScore': (0-100) How well the optimized CV matches.
        - 'improvement': A brief explanation of the key improvements made, focusing on natural integration.
        - 'keyChanges': An array of the top 3-4 strategic changes made, explaining *why* they enhance the CV's fit subtly.
      
      The 'cv' object MUST include:
      - firstName, lastName, location, address, phone, email, linkedin, summary
      - experience (array of objects with company, role, period, location, bullets)
      - skills (array of objects with category, items)
      - sectionTitles (object with summary, experience, skills, education, certifications)
      - education (array of strings)
      - certifications (array of strings)`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              cv: {
                type: Type.OBJECT,
                properties: {
                  firstName: { type: Type.STRING },
                  lastName: { type: Type.STRING },
                  location: { type: Type.STRING },
                  address: { type: Type.STRING },
                  phone: { type: Type.STRING },
                  email: { type: Type.STRING },
                  linkedin: { type: Type.STRING },
                  summary: { type: Type.STRING },
                  experience: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        company: { type: Type.STRING },
                        role: { type: Type.STRING },
                        period: { type: Type.STRING },
                        location: { type: Type.STRING },
                        bullets: { type: Type.ARRAY, items: { type: Type.STRING } }
                      },
                      required: ["company", "role", "period", "location", "bullets"]
                    }
                  },
                  skills: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        category: { type: Type.STRING },
                        items: { type: Type.ARRAY, items: { type: Type.STRING } }
                      },
                      required: ["category", "items"]
                    }
                  },
                  sectionTitles: {
                    type: Type.OBJECT,
                    properties: {
                      summary: { type: Type.STRING },
                      experience: { type: Type.STRING },
                      skills: { type: Type.STRING },
                      education: { type: Type.STRING },
                      certifications: { type: Type.STRING }
                    },
                    required: ["summary", "experience", "skills", "education", "certifications"]
                  },
                  education: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  certifications: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["firstName", "lastName", "location", "address", "phone", "email", "linkedin", "summary", "experience", "skills", "sectionTitles", "education", "certifications"]
              },
              fitAnalysis: {
                type: Type.OBJECT,
                properties: {
                  originalScore: { type: Type.NUMBER },
                  optimizedScore: { type: Type.NUMBER },
                  improvement: { type: Type.STRING },
                  keyChanges: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["originalScore", "optimizedScore", "improvement", "keyChanges"]
              }
            },
            required: ["cv", "fitAnalysis"]
          }
        }
      });

      if (!response.text) throw new Error("Failed to optimize CV.");
      
      let result;
      try {
        result = JSON.parse(response.text);
      } catch (e) {
        const jsonMatch = response.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0]);
        } else {
          throw e;
        }
      }
      
      setOptimizedCv(result.cv);
      setFitAnalysis(result.fitAnalysis);
      setUseOptimized(true);
      setActiveTab('cv');
    } catch (err: any) {
      console.error("Optimization error:", err);
      const errorMessage = err.message || String(err);
      if (errorMessage.includes("429") || errorMessage.includes("RESOURCE_EXHAUSTED") || errorMessage.includes("quota")) {
        setError("You have exceeded your Gemini API quota. This usually means you've made too many requests in a short period on a free-tier key. Please wait a minute and try again, or check your billing settings at ai.google.dev.");
      } else {
        setError(errorMessage || "Failed to optimize CV. Please try again.");
      }
    } finally {
      setIsOptimizing(false);
    }
  };

  const findJobs = async (isAiSelection = false, isLoadMore = false) => {
    if (isLoadMore) {
      setIsSearchingMore(true);
    } else {
      setIsSearching(true);
      if (isAiSelection) setIsSearchingAi(true);
      else setIsSearchingManual(true);
      setJobResults([]);
      setSearchPage(1);
    }
    
    setError(null);
    const currentPage = isLoadMore ? searchPage + 1 : 1;
    
    try {
      const ai = await getAiInstance();
      
      let searchPrompt = "";
      const filterContext = `
        - Job Type: ${searchJobType === 'all' ? 'Any' : searchJobType}
        - Remote Status: ${searchRemote === 'all' ? 'Any' : searchRemote}
        - Experience Level: ${searchExpLevel === 'all' ? 'Any' : searchExpLevel}
      `;

      if (isAiSelection) {
        searchPrompt = `You are a Senior Executive Recruiter. Your task is to find the absolute BEST matching job opportunities for this candidate currently available on the internet. DO NOT return generic matches. Only return listings where the candidate has a HIGH PROBABILITY of success (85%+ match).
        
        Analyze this candidate's profile to extract their exact seniority, core technical stack, and primary industry experience:
        - Name: ${cvDataState.firstName} ${cvDataState.lastName}
        - Summary: ${cvDataState.summary}
        - Key Experience: ${cvDataState.experience.map(e => `${e.role} at ${e.company}`).join(', ')}
        - Skills: ${cvDataState.skills.map(s => s.items.join(', ')).join(', ')}
        
        Using Google Search, find *specific, real, actively hiring* job postings located in or allowing remote work in "${searchLocation}".
        Filters:
        ${filterContext}
        
        Focus on finding the most recent opportunities from the last ${searchRecency === '24h' ? '24 hours' : searchRecency === '7d' ? '7 days' : '30 days'}.
        This is page ${currentPage} of results. DO NOT repeat results from previous searches.`;
      } else {
        searchPrompt = `Search for real, active job postings for "${searchQuery}" in "${searchLocation}" across major global and local job boards (LinkedIn, Indeed, Glassdoor, Computrabajo, El Empleo, etc.). 
        Filters:
        ${filterContext}
        
        Focus on finding the most recent opportunities from the last ${searchRecency === '24h' ? '24 hours' : searchRecency === '7d' ? '7 days' : '30 days'}.
        This is page ${currentPage} of results. Find different results than previous searches.`;
      }

      const prompt = `${searchPrompt}
      
      CRITICAL SEARCH STRATEGY:
      - YOU MUST USE GOOGLE SEARCH to find actual, real, currently open job listings online that match these filters.
      - DO NOT generate fake roles. ALL JOBS MUST BE REAL. 
      - The 'link' field MUST be the exact, real, verified URL to the job posting that you found in your search.
      - Ensure the jobs are highly relevant to the candidate's core skills and target seniority. Ignore irrelevant roles.
      
      CANDIDATE PROFILE:
      - Summary: ${currentCvData.summary}
      - Skills: ${currentCvData.skills.join(', ')}
      - Experience: ${currentCvData.experience.map(e => `${e.role} at ${e.company}`).join('; ')}
      
      After finding the real jobs via web search, analyze them against the candidate's profile to calculate a realistic matchScore.
      
      Return exactly a JSON array of objects with these fields. 
      - title, company, location, platform (e.g. "LinkedIn", "Indeed", "Company Website"), matchScore (0-100), reason (why it matches), customPitch (2-sentence application pitch).
      - link (MUST be the REAL working URL from your web search)
      - postedDate: (e.g. "2 days ago", "Today")
      - applicantCount: (estimated number of applicants if available, or 0)
      - tags: (array of strings like "Top Company", "Verified Source", "Startup")
      - isTopOpportunity: (boolean, true if matchScore > 85 and company is highly reputable)
      
      Sort results with the highest matchScore and most relevant first.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-preview", 
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          tools: [{ googleSearch: {} }],
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                company: { type: Type.STRING },
                location: { type: Type.STRING },
                link: { type: Type.STRING },
                platform: { type: Type.STRING },
                matchScore: { type: Type.NUMBER },
                reason: { type: Type.STRING },
                customPitch: { type: Type.STRING },
                postedDate: { type: Type.STRING },
                applicantCount: { type: Type.NUMBER },
                tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                isTopOpportunity: { type: Type.BOOLEAN }
              },
              required: ["title", "company", "location", "link", "platform", "matchScore", "reason", "customPitch"]
            }
          }
        }
      });

      if (!response.text) {
        throw new Error("The AI couldn't find any specific job results at this moment. Please try a different role or location.");
      }

      let results: any[] = [];
      try {
        results = JSON.parse(response.text);
      } catch (e) {
        const jsonMatch = response.text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          results = JSON.parse(jsonMatch[0]);
        } else {
          throw e;
        }
      }
      
      // Fix hallucinated links using Google Search grounding metadata
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      console.log("Grounding Metadata:", response.candidates?.[0]?.groundingMetadata);
      if (chunks && Array.isArray(chunks)) {
        results = results.map(job => {
          // Find the best matching chunk for this job
          const match = chunks.find(c => {
            if (!c.web || !c.web.uri) return false;
            const chunkTitle = c.web.title?.toLowerCase() || '';
            const jobTitle = job.title.toLowerCase();
            const jobCompany = job.company.toLowerCase();
            
            // Check if the chunk title contains the company or job title
            return chunkTitle.includes(jobCompany) && 
                   (chunkTitle.includes(jobTitle.split(' ')[0]) || jobCompany.length > 2);
          });
          
          if (match && match.web && match.web.uri) {
            // Replace the hallucinated link with the real, verified Google Search link
            return { ...job, link: match.web.uri, tags: [...(job.tags || []), 'Verified Link'] };
          }
          return job;
        });
      }
      
      // Strict filter: Remove jobs that have blatantly fake link patterns often hallucinated by LLMs
      results = results.filter(job => {
        const link = job.link.toLowerCase();
        // Allow valid links, reject obvious placeholders
        return !link.includes('example.com') && 
               !link.includes('yourcompany.com') && 
               !link.includes('company.com') &&
               link.startsWith('http');
      });
      
      if (results.length === 0) {
        throw new Error("No matching jobs were found for your search criteria. Try broadening your search terms.");
      }
      
      if (isLoadMore) {
        setJobResults(prev => [...prev, ...results]);
        setSearchPage(currentPage);
      } else {
        setJobResults(results);
      }
    } catch (err: any) {
      console.error("Error finding jobs:", err);
      const errorMessage = err.message || String(err);
      if (errorMessage.includes("429") || errorMessage.includes("RESOURCE_EXHAUSTED") || errorMessage.includes("quota")) {
        setError("You have exceeded your Gemini API quota. This usually means you've made too many requests in a short period on a free-tier key. Please wait a minute and try again, or check your billing settings at ai.google.dev.");
      } else {
        setError(errorMessage || "An unexpected error occurred while searching for jobs. Please try again.");
      }
    } finally {
      setIsSearching(false);
      setIsSearchingManual(false);
      setIsSearchingAi(false);
      setIsSearchingMore(false);
    }
  };

  const getAtsDates = (period: string) => {
    const monthMap: { [key: string]: string } = {
      'January': '01', 'February': '02', 'March': '03', 'April': '04', 'May': '05', 'June': '06',
      'July': '07', 'August': '08', 'September': '09', 'October': '10', 'November': '11', 'December': '12'
    };
    
    const parts = period.split(/ – | - /);
    return parts.map(part => {
      const match = part.match(/([a-zA-Z]+)\s+(\d{4})/);
      if (match) {
        const month = monthMap[match[1]] || '01';
        return `${match[2]}-${month}`;
      }
      return part;
    }).join(' to ');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hidden File Input for CV Import - Moved here to be always accessible */}
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) extractCvFromFile(file);
          // Reset input so same file can be selected again
          e.target.value = '';
        }}
        accept=".pdf,.txt,.doc,.docx"
        className="hidden"
      />

      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 print:hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('cv')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activeTab === 'cv' 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileText className="mr-2" size={18} />
                CV Designer
              </button>
              <button
                onClick={() => setActiveTab('hunter')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activeTab === 'hunter' 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Briefcase className="mr-2" size={18} />
                Smart Job Hunter
                <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-blue-100 text-blue-700 rounded-full font-bold uppercase tracking-wider">AI</span>
              </button>
              <button
                onClick={() => setActiveTab('optimizer')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activeTab === 'optimizer' 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Wand2 className="mr-2" size={18} />
                ATS Tailor
              </button>
              <button 
                onClick={() => setActiveTab('tracker')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activeTab === 'tracker' 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <LayoutGrid className="mr-2" size={18} />
                Application Tracker
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activeTab === 'settings' 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Settings className="mr-2" size={18} />
                Settings
              </button>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold text-white bg-indigo-600 px-2 py-0.5 rounded-full">BETA</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto mb-8 print:hidden">
          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg text-red-700 text-xs flex items-start gap-2 animate-in fade-in slide-in-from-top-1">
              <span className="font-bold">System Alert:</span>
              <span>{error}</span>
            </div>
          )}
        </div>

        {activeTab === 'tracker' ? (
          <div className="max-w-6xl mx-auto">
            {/* Tracker Header & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Active Applications</p>
                <p className="text-2xl font-black text-gray-900">{applications.filter(a => !['REJECTED', 'ACCEPTED'].includes(a.status)).length}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Interviews</p>
                <p className="text-2xl font-black text-blue-600">{applications.filter(a => a.status === 'INTERVIEW').length}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Offers</p>
                <p className="text-2xl font-black text-green-600">{applications.filter(a => a.status === 'OFFER').length}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Success Rate</p>
                <p className="text-2xl font-black text-indigo-600">
                  {applications.length > 0 
                    ? Math.round((applications.filter(a => ['SCREENING', 'INTERVIEW', 'OFFER', 'ACCEPTED'].includes(a.status)).length / applications.length) * 100) 
                    : 0}%
                </p>
              </div>
            </div>

            {/* Gmail Auto-Sync Control Bar */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${gmailToken ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 leading-tight">Gmail Auto-Sync</h3>
                  <p className="text-xs text-gray-500">Automatically check for status updates & rejections.</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 w-full md:w-auto">
                {gmailToken ? (
                  <>
                    <div className="text-right hidden sm:block mr-2">
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Last Sync</p>
                       <p className="text-xs text-gray-700">{lastSyncTime ? lastSyncTime.toLocaleTimeString() : 'Never'}</p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer mr-2">
                      <div className="relative">
                        <input type="checkbox" className="sr-only" checked={autoSyncEnabled} onChange={(e) => {
                          setAutoSyncEnabled(e.target.checked);
                          localStorage.setItem('gmailAutoSyncEnabled', String(e.target.checked));
                        }} />
                        <div className={`block w-10 h-6 rounded-full transition-colors ${autoSyncEnabled ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${autoSyncEnabled ? 'transform translate-x-4' : ''}`}></div>
                      </div>
                      <span className="text-xs font-bold text-gray-700">Hourly</span>
                    </label>
                    <button 
                      onClick={() => syncGmailWithToken(gmailToken)}
                      disabled={isSyncingGmail}
                      className="px-3 py-1.5 flex items-center gap-2 bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-100 font-bold text-xs disabled:opacity-50 transition-colors"
                    >
                      {isSyncingGmail ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />} 
                      <span className="hidden sm:inline">Sync Now</span>
                    </button>
                    <button 
                      onClick={() => { setGmailToken(null); setAutoSyncEnabled(false); localStorage.removeItem('gmailAutoSyncEnabled'); }}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-50 rounded-lg transition-colors"
                      title="Disconnect Gmail"
                    >
                      <LogOut size={16} />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => loginGmail()}
                    className="w-full md:w-auto px-4 py-2 flex items-center justify-center gap-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold text-sm shadow-sm transition-colors"
                  >
                    <Mail size={16} /> Connect Gmail
                  </button>
                )}
              </div>
            </div>

            {/* Tracker Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
              <div className="flex flex-1 gap-2 w-full">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search applications..." 
                    value={trackerSearch}
                    onChange={(e) => setTrackerSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>
                <select 
                  value={trackerFilter}
                  onChange={(e) => setTrackerFilter(e.target.value as any)}
                  className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">All Stages</option>
                  <option value="IDENTIFIED">Identified</option>
                  <option value="RESEARCHING">Researching</option>
                  <option value="APPLIED">Applied</option>
                  <option value="SCREENING">Screening</option>
                  <option value="INTERVIEW">Interview</option>
                  <option value="ASSESSMENT">Assessment</option>
                  <option value="OFFER">Offer</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="ACCEPTED">Accepted</option>
                </select>
              </div>
              <button 
                onClick={() => { setEditingApp(null); setShowAppModal(true); }}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-bold text-sm shadow-sm"
              >
                <Plus size={18} /> Add Application
              </button>
            </div>

            {/* Applications List */}
            <div className="space-y-3">
              {applications
                .filter(app => {
                  const matchesSearch = app.companyName.toLowerCase().includes(trackerSearch.toLowerCase()) || 
                                      app.jobTitle.toLowerCase().includes(trackerSearch.toLowerCase());
                  const matchesFilter = trackerFilter === 'ALL' || app.status === trackerFilter;
                  return matchesSearch && matchesFilter;
                })
                .map(app => (
                  <div key={app.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-1 rounded-lg flex items-center justify-center overflow-hidden w-12 h-12 flex-shrink-0 ${
                        app.status === 'REJECTED' ? 'bg-red-50 text-red-600' :
                        app.status === 'ACCEPTED' ? 'bg-green-50 text-green-600' :
                        app.status === 'OFFER' ? 'bg-yellow-50 text-yellow-600' :
                        'bg-blue-50 text-blue-600'
                      }`}>
                        <CompanyLogo companyName={app.companyName || 'Unknown Company'} jobUrl={app.jobUrl} logoUrl={app.logoUrl} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 leading-tight">{app.jobTitle}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Building2 size={14} /> {app.companyName}
                          {app.location && <span className="flex items-center gap-1 ml-2"><MapPin size={14} /> {app.location}</span>}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <select
                            value={app.status}
                            onChange={(e) => saveApplication({ ...app, status: e.target.value as ApplicationStatus })}
                            className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded cursor-pointer border-0 outline-none focus:ring-1 focus:ring-blue-500 appearance-none text-center ${
                              app.status === 'REJECTED' ? 'bg-red-100 text-red-700 hover:bg-red-200' :
                              app.status === 'ACCEPTED' ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                              app.status === 'OFFER' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' :
                              'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }`}
                            title="Edit Status"
                          >
                            <option value="IDENTIFIED">IDENTIFIED</option>
                            <option value="RESEARCHING">RESEARCHING</option>
                            <option value="APPLIED">APPLIED</option>
                            <option value="SCREENING">SCREENING</option>
                            <option value="INTERVIEW">INTERVIEW</option>
                            <option value="ASSESSMENT">ASSESSMENT</option>
                            <option value="OFFER">OFFER</option>
                            <option value="REJECTED">REJECTED</option>
                            <option value="ACCEPTED">ACCEPTED</option>
                          </select>
                          <select
                            value={app.priorityTier || 'B'}
                            onChange={(e) => saveApplication({ ...app, priorityTier: e.target.value as 'A'|'B'|'C' })}
                            className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer rounded border-0 outline-none focus:ring-1 focus:ring-blue-500 appearance-none text-center"
                            title="Edit Priority Tier"
                          >
                            <option value="A">TIER A</option>
                            <option value="B">TIER B</option>
                            <option value="C">TIER C</option>
                          </select>
                          {app.fitScore != null && (
                            <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded">
                              <Sparkles size={10} />
                              {app.fitScore}% FIT
                            </span>
                          )}
                          <button
                            onClick={() => evaluateFitScore(app)}
                            disabled={isSavingApp}
                            title="Calculate Advanced Probabilistic Fit Score using AI"
                            className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-100 rounded hover:bg-purple-100 transition-colors flex items-center gap-1 disabled:opacity-50"
                          >
                            <Brain size={10} /> Predict
                          </button>
                          <a 
                            href={`https://mail.google.com/mail/u/0/#search/${encodeURIComponent(`"${app.companyName}" (interview OR application OR applied OR update OR status OR rejected OR offer OR candidate OR role OR next steps OR action required)`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-red-50 text-red-600 border border-red-100 rounded hover:bg-red-100 transition-colors flex items-center gap-1"
                            title="Search Gmail for updates related to this company"
                          >
                            <Mail size={10} /> Check Gmail
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 justify-end">
                      <div className="text-right hidden md:block">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Last Update</p>
                        <p className="text-xs text-gray-600">
                          {app.updatedAt?.toDate ? app.updatedAt.toDate().toLocaleDateString() : 'Just now'}
                        </p>
                      </div>
                      <button 
                        onClick={() => { setEditingApp(app); setShowAppModal(true); }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => deleteApplication(app.id!)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              
              {applications.length === 0 && (
                <div className="bg-white p-12 rounded-2xl border-2 border-dashed border-gray-200 text-center">
                  <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <LayoutGrid className="text-gray-300" size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">No applications tracked yet</h3>
                  <p className="text-gray-500 text-sm mb-6">Start tracking your job search progress here.</p>
                  <button 
                    onClick={() => { setEditingApp(null); setShowAppModal(true); }}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-all font-bold shadow-md"
                  >
                    <Plus size={20} /> Add Your First Application
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'settings' ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <Settings size={24} />
                      Account & CV Settings
                    </h2>
                    <p className="text-gray-300 mt-1">Manage your core profile information and base CV data.</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isExtractingCv}
                      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all text-sm font-bold border border-white/20"
                    >
                      {isExtractingCv ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                      Import from Existing CV
                    </button>
                    <p className="text-[10px] text-gray-400">PDF, Word or Text files supported</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 space-y-8">
                {/* Personal Info Section */}
                <section>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="text-blue-600" size={20} />
                    Core Identity
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">First Name</label>
                      <input 
                        type="text" 
                        value={currentCvData.firstName} 
                        onChange={(e) => updateFirstName(e.target.value)}
                        placeholder="e.g. John"
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Last Name</label>
                      <input 
                        type="text" 
                        value={currentCvData.lastName} 
                        onChange={(e) => updateLastName(e.target.value)}
                        placeholder="e.g. Doe"
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300"
                      />
                    </div>
                  </div>
                </section>

                {/* Contact Info Section */}
                <section>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Link className="text-blue-600" size={20} />
                    Contact & Social
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                      <input 
                        type="email" 
                        value={currentCvData.email} 
                        onChange={(e) => setCvDataState(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="e.g. john.doe@example.com"
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Phone Number</label>
                      <input 
                        type="text" 
                        value={currentCvData.phone} 
                        onChange={(e) => setCvDataState(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="e.g. +1 234 567 8900"
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300"
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">LinkedIn Profile</label>
                      <input 
                        type="text" 
                        value={currentCvData.linkedin} 
                        onChange={(e) => setCvDataState(prev => ({ ...prev, linkedin: e.target.value }))}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300"
                        placeholder="linkedin.com/in/username"
                      />
                    </div>
                  </div>
                </section>

                {/* Location Section */}
                <section>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin className="text-blue-600" size={20} />
                    Location Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">City, Country</label>
                      <input 
                        type="text" 
                        value={currentCvData.location} 
                        onChange={(e) => updateLocation(e.target.value)}
                        placeholder="e.g. San Francisco, USA"
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Full Address (Optional)</label>
                      <input 
                        type="text" 
                        value={currentCvData.address} 
                        onChange={(e) => updateAddress(e.target.value)}
                        placeholder="e.g. 123 Main St, ZIP 12345"
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300"
                      />
                    </div>
                  </div>
                </section>

                {/* Education & Certs Section */}
                <section>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="text-blue-600" size={20} />
                    Education & Certifications
                  </h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Education (One per line)</label>
                      <textarea 
                        value={currentCvData.education.join('\n')} 
                        onChange={(e) => setCvDataState(prev => ({ ...prev, education: e.target.value.split('\n') }))}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-sm placeholder:text-gray-300"
                        rows={3}
                        placeholder="e.g. BS in Computer Science, Stanford University, 2020"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Certifications (One per line)</label>
                      <textarea 
                        value={currentCvData.certifications.join('\n')} 
                        onChange={(e) => setCvDataState(prev => ({ ...prev, certifications: e.target.value.split('\n') }))}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-sm placeholder:text-gray-300"
                        rows={3}
                        placeholder="e.g. AWS Certified Solutions Architect, 2023"
                      />
                    </div>
                  </div>
                </section>

                <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                  <div className="text-xs text-gray-500 italic">
                    * Changes here update your current CV and can be saved as your primary base CV.
                  </div>
                  <button 
                    onClick={() => saveBaseCv(cvDataState)}
                    disabled={isSavingCv}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-all font-bold shadow-md disabled:opacity-50"
                  >
                    {isSavingCv ? <Loader2 className="animate-spin" size={20} /> : <Target size={20} />}
                    Create your Primary Base CV
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'cv' ? (
          <div className="max-w-[850px] mx-auto">
            <style>
              {`
                @page {
                  size: letter;
                  margin: 0.75in;
                }
              `}
            </style>
            
            {/* Header with Download Button (Hidden on Print) */}
            <div className="flex flex-col gap-4 mb-8 print:hidden">
              <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg border border-blue-100 shadow-sm">
                <div className="flex items-start gap-3 text-blue-800">
                  <Edit3 className="mt-1 flex-shrink-0" size={18} />
                  <p className="text-sm">
                    <strong>Ready to apply?</strong> This CV is optimized for ATS. Open this app in a <strong>new tab</strong> to enable the PDF export.
                  </p>
                </div>
                <button 
                  onClick={handlePrint}
                  className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-md hover:bg-blue-700 transition-colors font-medium shadow-sm flex-shrink-0"
                >
                  <Download size={18} />
                  Save as PDF
                </button>
              </div>

              {fitAnalysis && (
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      <Sparkles className="text-indigo-600" size={20} />
                      AI Fit Analysis
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-xs text-gray-500 uppercase font-bold">Original</div>
                        <div className="text-lg font-bold text-gray-400">{fitAnalysis.originalScore}%</div>
                      </div>
                      <div className="text-2xl font-light text-gray-300">→</div>
                      <div className="text-center">
                        <div className="text-xs text-indigo-600 uppercase font-bold">Optimized</div>
                        <div className="text-2xl font-black text-indigo-600">{fitAnalysis.optimizedScore}%</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                    <strong>Improvement:</strong> {fitAnalysis.improvement}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {fitAnalysis.keyChanges.map((change, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-100">
                        <CheckCircle2 className="text-green-500 mt-0.5" size={14} />
                        {change}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {optimizedCv && (
                <div className="flex items-center justify-between bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                  <div className="flex items-center gap-2 text-indigo-900 font-medium text-sm">
                    <Sparkles className="text-indigo-600" size={18} />
                    {useOptimized ? "Viewing Tailored Version (ATS Optimized)" : "Viewing Original CV"}
                  </div>
                  <div className="flex gap-2">
                    {(() => {
                      const existingApp = applications.find(app =>
                        (jobPostingUrl && app.jobUrl === jobPostingUrl) ||
                        (targetCompany && targetRole && app.companyName === targetCompany && app.jobTitle === targetRole)
                      );
                      const isCurrentlyApplied = !!existingApp;
                      
                      return (
                        <button 
                          onClick={() => {
                            if (isCurrentlyApplied && existingApp) {
                              setApplications(prev => prev.filter(app => app.id !== existingApp.id));
                            } else {
                              saveApplication({
                                companyName: targetCompany || 'Unknown Company',
                                jobTitle: targetRole || 'Unknown Role',
                                jobUrl: jobPostingUrl,
                                status: 'APPLIED',
                                dateApplied: new Date().toISOString().split('T')[0],
                                cvVersion: `Tailored for ${targetCompany} - ${targetRole}`,
                                fitScore: fitAnalysis?.optimizedScore || 0
                              });
                            }
                          }}
                          disabled={isSavingApp}
                          className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded transition-colors flex items-center gap-2 disabled:opacity-50 ${isCurrentlyApplied ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                        >
                          {isSavingApp ? <Loader2 className="animate-spin" size={14} /> : isCurrentlyApplied ? <Check size={14} /> : <div className="w-3.5 h-3.5 rounded-sm border-2 border-gray-400"></div>}
                          {isCurrentlyApplied ? 'Applied to this offer' : 'Mark as Applied'}
                        </button>
                      );
                    })()}
                    <button 
                      onClick={() => setIsEditing(!isEditing)}
                      className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded transition-colors flex items-center gap-1 ${isEditing ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-100'}`}
                    >
                      {isEditing ? <><Check size={12} /> Save Changes</> : <><Edit3 size={12} /> Manual Edit</>}
                    </button>
                    <button 
                      onClick={() => setUseOptimized(!useOptimized)}
                      className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 bg-white border border-indigo-200 text-indigo-700 rounded hover:bg-indigo-100 transition-colors"
                    >
                      Switch to {useOptimized ? "Original" : "Tailored"}
                    </button>
                    <button 
                      onClick={() => { 
                        setOptimizedCv(null); 
                        setFitAnalysis(null); 
                        setUseOptimized(false); 
                        setIsEditing(false); 
                        setCvDataState(BLANK_TEMPLATE);
                      }}
                      className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 text-red-600 hover:bg-red-50 rounded transition-colors flex items-center gap-1"
                    >
                      <RotateCcw size={12} /> Reset
                    </button>
                  </div>
                </div>
              )}
              {!optimizedCv && (
                <div className="flex justify-end">
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded transition-colors flex items-center gap-1 ${isEditing ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                  >
                    {isEditing ? <><Check size={12} /> Save Changes</> : <><Edit3 size={12} /> Manual Edit</>}
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white p-12 shadow-xl print:shadow-none print:p-0">
              {/* CV Content */}
              <div className="font-sans text-gray-900 leading-relaxed">
                
                {/* Header */}
                <header className="text-center border-b-2 border-gray-900 pb-5 mb-5 relative">
                  {/* Hidden ATS Metadata */}
                  <div className="absolute top-0 left-0 text-[1px] text-white opacity-0 select-none pointer-events-none h-0 overflow-hidden" aria-hidden="true">
                    First Name: {currentCvData.firstName} | 
                    Given Name: {currentCvData.firstName} | 
                    Last Name: {currentCvData.lastName} | 
                    Surname: {currentCvData.lastName} | 
                    Family Name: {currentCvData.lastName} | 
                    Full Name: {currentCvData.firstName} {currentCvData.lastName} | 
                    Location: {currentCvData.location} | 
                    Address: {currentCvData.address} | 
                    {currentCvData.experience.map((exp, idx) => (
                      ` Experience ${idx + 1}: Company: ${exp.company} | Job Title: ${exp.role} | Dates: ${exp.period} | Standardized Dates: ${getAtsDates(exp.period)} | Location: ${exp.location} | `
                    ))}
                    Skills: {currentCvData.skills.map(s => `${s.category}: ${s.items.join(', ')}`).join(' | ')} |
                    Education: {currentCvData.education.join(' | ')} |
                    Certifications: {currentCvData.certifications.join(' | ')} |
                  </div>

                  <h1 className="text-3xl font-bold tracking-wider mb-2">
                    {isEditing ? (
                      <div className="flex justify-center gap-2">
                        <input 
                          type="text" 
                          value={currentCvData.firstName} 
                          onChange={(e) => updateFirstName(e.target.value)}
                          className="bg-gray-50 border-none p-0 focus:ring-0 font-bold text-center w-1/4"
                          placeholder="First Name"
                        />
                        <input 
                          type="text" 
                          value={currentCvData.lastName} 
                          onChange={(e) => updateLastName(e.target.value)}
                          className="bg-gray-50 border-none p-0 focus:ring-0 font-bold text-center w-1/4"
                          placeholder="Last Name"
                        />
                      </div>
                    ) : (
                      <>{currentCvData.firstName} {currentCvData.lastName}</>
                    )}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {isEditing ? (
                      <div className="flex justify-center gap-2">
                        <input 
                          type="text" 
                          value={currentCvData.phone} 
                          onChange={(e) => setCvDataState(prev => ({ ...prev, phone: e.target.value }))}
                          className="bg-gray-50 border-none p-0 focus:ring-0 text-center text-sm"
                          placeholder="Phone"
                        />
                        <span>|</span>
                        <input 
                          type="text" 
                          value={currentCvData.email} 
                          onChange={(e) => setCvDataState(prev => ({ ...prev, email: e.target.value }))}
                          className="bg-gray-50 border-none p-0 focus:ring-0 text-center text-sm"
                          placeholder="Email"
                        />
                        <span>|</span>
                        <input 
                          type="text" 
                          value={currentCvData.linkedin} 
                          onChange={(e) => setCvDataState(prev => ({ ...prev, linkedin: e.target.value }))}
                          className="bg-gray-50 border-none p-0 focus:ring-0 text-center text-sm"
                          placeholder="LinkedIn"
                        />
                      </div>
                    ) : (
                      <>{currentCvData.phone} | {currentCvData.email} | {currentCvData.linkedin}</>
                    )}
                  </p>
                </header>

                {/* Summary */}
                <section className="mb-5">
                  <h2 className="text-md font-bold uppercase border-b border-gray-300 mb-2 pb-1 text-gray-800 tracking-wide">
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={currentCvData.sectionTitles.summary} 
                        onChange={(e) => updateSectionTitle('summary', e.target.value)}
                        className="w-full bg-gray-50 border-none p-0 focus:ring-0 font-bold uppercase"
                      />
                    ) : currentCvData.sectionTitles.summary}
                  </h2>
                  {isEditing ? (
                    <textarea 
                      value={currentCvData.summary}
                      onChange={(e) => updateSummary(e.target.value)}
                      className="w-full text-[13px] text-justify text-gray-800 leading-snug bg-gray-50 border border-gray-200 rounded p-2 focus:ring-1 focus:ring-indigo-500 outline-none"
                      rows={4}
                    />
                  ) : (
                    <p 
                      className="text-[13px] text-justify text-gray-800 leading-snug"
                      dangerouslySetInnerHTML={{ __html: currentCvData.summary
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">$1</a>')
                      }}
                    />
                  )}
                </section>

                {/* Experience */}
                <section className="mb-5">
                  <h2 className="text-md font-bold uppercase border-b border-gray-300 mb-3 pb-1 text-gray-800 tracking-wide">
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={currentCvData.sectionTitles.experience} 
                        onChange={(e) => updateSectionTitle('experience', e.target.value)}
                        className="w-full bg-gray-50 border-none p-0 focus:ring-0 font-bold uppercase"
                      />
                    ) : currentCvData.sectionTitles.experience}
                  </h2>

                  {currentCvData.experience.map((exp, idx) => (
                    <div key={idx} className="mb-4">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <div className="flex-1">
                          {isEditing ? (
                            <div className="flex gap-2 mb-1">
                              <input 
                                type="text" 
                                value={exp.company} 
                                onChange={(e) => updateExperienceField(idx, 'company', e.target.value)}
                                className="font-bold text-[14px] bg-gray-50 border border-gray-200 rounded px-1"
                              />
                              <span className="text-gray-400">|</span>
                              <input 
                                type="text" 
                                value={exp.location} 
                                onChange={(e) => updateExperienceField(idx, 'location', e.target.value)}
                                className="font-normal text-gray-600 text-[14px] bg-gray-50 border border-gray-200 rounded px-1"
                              />
                            </div>
                          ) : (
                            <h3 className="font-bold text-[14px]">{exp.company} <span className="font-normal text-gray-600">| {exp.location}</span></h3>
                          )}
                        </div>
                        {isEditing ? (
                          <input 
                            type="text" 
                            value={exp.period} 
                            onChange={(e) => updateExperienceField(idx, 'period', e.target.value)}
                            className="text-[13px] font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded px-1 text-right"
                          />
                        ) : (
                          <span className="text-[13px] font-medium text-gray-700">{exp.period}</span>
                        )}
                      </div>
                      {isEditing ? (
                        <input 
                          type="text" 
                          value={exp.role} 
                          onChange={(e) => updateExperienceField(idx, 'role', e.target.value)}
                          className="italic text-[13px] mb-1.5 font-medium text-gray-800 bg-gray-50 border border-gray-200 rounded px-1 w-full"
                        />
                      ) : (
                        <div className="italic text-[13px] mb-1.5 font-medium text-gray-800">{exp.role}</div>
                      )}
                      <ul className="list-disc list-outside ml-4 text-[13px] space-y-1 text-gray-800 leading-snug">
                        {exp.bullets.map((bullet, bIdx) => (
                          <li key={bIdx}>
                            {isEditing ? (
                              <textarea 
                                value={bullet}
                                onChange={(e) => updateExperienceBullet(idx, bIdx, e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded p-1 focus:ring-1 focus:ring-indigo-500 outline-none mt-1"
                                rows={2}
                              />
                            ) : (
                              <span dangerouslySetInnerHTML={{ __html: bullet
                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">$1</a>')
                              }} />
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </section>

                {/* Skills */}
                <section className="mb-5">
                  <h2 className="text-md font-bold uppercase border-b border-gray-300 mb-2 pb-1 text-gray-800 tracking-wide">
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={currentCvData.sectionTitles.skills} 
                        onChange={(e) => updateSectionTitle('skills', e.target.value)}
                        className="w-full bg-gray-50 border-none p-0 focus:ring-0 font-bold uppercase"
                      />
                    ) : currentCvData.sectionTitles.skills}
                  </h2>
                  <ul className="list-disc list-outside ml-4 text-[13px] space-y-1 text-gray-800 leading-snug">
                    {currentCvData.skills.map((skillGroup, idx) => (
                      <li key={idx}><strong>{skillGroup.category}:</strong> {skillGroup.items.join(', ')}.</li>
                    ))}
                  </ul>
                </section>

                {/* Education */}
                <section className="mb-5">
                  <h2 className="text-md font-bold uppercase border-b border-gray-300 mb-2 pb-1 text-gray-800 tracking-wide">
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={currentCvData.sectionTitles.education} 
                        onChange={(e) => updateSectionTitle('education', e.target.value)}
                        className="w-full bg-gray-50 border-none p-0 focus:ring-0 font-bold uppercase"
                      />
                    ) : currentCvData.sectionTitles.education}
                  </h2>
                  <ul className="list-disc list-outside ml-4 text-[13px] space-y-1 text-gray-800 leading-snug">
                    {currentCvData.education.map((edu, idx) => (
                      <li key={idx}>
                        {isEditing ? (
                          <textarea 
                            value={edu}
                            onChange={(e) => updateEducationItem(idx, e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded px-1 mt-1"
                            rows={2}
                          />
                        ) : (
                          <span dangerouslySetInnerHTML={{ __html: edu
                            .replace(/\|/g, '<span class="text-gray-400 mx-1">|</span>')
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\*(.*?)\*/g, '<em>$1</em>')
                            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">$1</a>')
                          }} />
                        )}
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Certifications & Additional Info */}
                <section>
                  <h2 className="text-md font-bold uppercase border-b border-gray-300 mb-2 pb-1 text-gray-800 tracking-wide">
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={currentCvData.sectionTitles.certifications} 
                        onChange={(e) => updateSectionTitle('certifications', e.target.value)}
                        className="w-full bg-gray-50 border-none p-0 focus:ring-0 font-bold uppercase"
                      />
                    ) : currentCvData.sectionTitles.certifications}
                  </h2>
                  <ul className="list-disc list-outside ml-4 text-[13px] space-y-1 text-gray-800 leading-snug">
                    {currentCvData.certifications.map((cert, idx) => (
                      <li key={idx}>
                        {isEditing ? (
                          <textarea 
                            value={cert}
                            onChange={(e) => updateCertificationItem(idx, e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded px-1 mt-1"
                            rows={2}
                          />
                        ) : (
                          <span dangerouslySetInnerHTML={{ __html: cert
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\*(.*?)\*/g, '<em>$1</em>')
                            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-indigo-600 print:text-black hover:underline">$1</a>')
                          }} />
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </div>
          </div>
        ) : activeTab === 'hunter' ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Sparkles size={24} />
                  Smart Job Hunter
                </h2>
                <p className="text-blue-100 mt-1">AI-powered job matching for your specific profile.</p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Role</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="Search by role, industry, or keywords (e.g. 'Fintech Strategy' or 'Product Lead')"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input 
                      type="text" 
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="e.g. Colombia"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                    <select 
                      value={searchJobType}
                      onChange={(e) => setSearchJobType(e.target.value as any)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                    >
                      <option value="all">All Types</option>
                      <option value="full-time">Full-time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Remote Status</label>
                    <select 
                      value={searchRemote}
                      onChange={(e) => setSearchRemote(e.target.value as any)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                    >
                      <option value="all">Any Status</option>
                      <option value="remote">Remote Only</option>
                      <option value="on-site">On-site</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                    <select 
                      value={searchExpLevel}
                      onChange={(e) => setSearchExpLevel(e.target.value as any)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                    >
                      <option value="all">Any Level</option>
                      <option value="entry">Entry Level</option>
                      <option value="mid">Mid Level</option>
                      <option value="senior">Senior Level</option>
                      <option value="executive">Executive</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Posting Date</label>
                  <div className="flex gap-2">
                    {(['24h', '7d', '30d'] as const).map((period) => (
                      <button
                        key={period}
                        onClick={() => setSearchRecency(period)}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all border ${
                          searchRecency === period 
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                            : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        {period === '24h' ? 'Last 24 Hours' : period === '7d' ? 'Last 7 Days' : 'Last 30 Days'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => findJobs(false)}
                    disabled={isSearching}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  >
                    {isSearchingManual ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Searching {Math.round(searchProgress)}%
                      </>
                    ) : (
                      <>
                        <Search size={20} />
                        Find Matches
                      </>
                    )}
                  </button>
                  <button 
                    onClick={() => findJobs(true)}
                    disabled={isSearching}
                    className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  >
                    {isSearchingAi ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        AI Selection {Math.round(searchProgress)}%
                      </>
                    ) : (
                      <>
                        <Sparkles size={20} />
                        AI Selection
                      </>
                    )}
                  </button>
                </div>

                {isSearching && (
                  <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-blue-700 uppercase tracking-wider flex items-center gap-2">
                        <Loader2 className="animate-spin" size={16} />
                        AI Search in Progress
                      </span>
                      <span className="text-sm font-bold text-blue-600">{Math.round(searchProgress)}%</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2.5 mb-4 overflow-hidden shadow-inner">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out shadow-sm" 
                        style={{ width: `${searchProgress}%` }}
                      ></div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-1 bg-blue-100 rounded-full">
                        <Wand2 size={14} className="text-blue-600" />
                      </div>
                      <p className="text-sm text-blue-800 font-medium italic animate-pulse">
                        {searchReasoning}
                      </p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg text-red-700 text-sm flex items-start gap-2">
                    <span className="font-bold">Error:</span>
                    <span>{error}</span>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Search Tips</h4>
                  <ul className="space-y-2 text-xs text-gray-500">
                    <li className="flex gap-2">
                      <span className="text-blue-500">•</span>
                      Use specific job titles and apply filters (Job Type, Remote, Level) to narrow down results.
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-500">•</span>
                      The AI searches across LinkedIn, Indeed, Glassdoor, Computrabajo, El Empleo, and major company career pages.
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-500">•</span>
                      The AI searches real-time web data. This uses more API quota than standard tasks.
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-500">•</span>
                      If you hit quota limits, wait 60 seconds for the free-tier reset.
                    </li>
                  </ul>
                </div>
              </div>

              {jobResults.length > 0 && (
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="text-green-500" size={20} />
                    Top AI-Matched Opportunities
                  </h3>
                  <div className="space-y-4">
                    {jobResults.map((job, idx) => (
                      <div key={idx} className={`bg-white p-5 rounded-xl border transition-all shadow-sm hover:shadow-md ${job.isTopOpportunity ? 'border-indigo-200 ring-1 ring-indigo-50' : 'border-gray-200'}`}>
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-grow">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-lg text-gray-900 leading-tight">{job.title}</h4>
                              {job.isTopOpportunity && (
                                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-tighter rounded flex items-center gap-1">
                                  <Sparkles size={10} /> Top Opportunity
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 font-medium text-sm">{job.company} • {job.location}</p>
                            <div className="flex flex-wrap gap-2 mt-2 items-center">
                              {job.platform && (
                                <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter rounded flex items-center gap-1 ${
                                  job.platform.toLowerCase().includes('linkedin') ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                  job.platform.toLowerCase().includes('indeed') ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' :
                                  'bg-gray-100 text-gray-600 border border-gray-200'
                                }`}>
                                  {job.platform} {['linkedin', 'indeed'].some(p => job.platform.toLowerCase().includes(p)) && '✓'}
                                </span>
                              )}
                              {job.postedDate && (
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{job.postedDate}</span>
                              )}
                              {job.applicantCount !== undefined && (
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">• {job.applicantCount} applicants</span>
                              )}
                              {job.tags?.map((tag, i) => (
                                <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded uppercase tracking-tighter">{tag}</span>
                              ))}
                            </div>
                          </div>
                          <div className="flex flex-col items-end flex-shrink-0">
                            <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                              job.matchScore >= 90 ? 'bg-green-100 text-green-700' :
                              job.matchScore >= 75 ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {job.matchScore}% Match
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-sm text-gray-700 italic border-l-4 border-blue-200 pl-3 mb-2">
                            "{job.reason}"
                          </p>
                          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                            <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">AI-Generated Pitch:</p>
                            <p className="text-sm text-blue-900 leading-relaxed">
                              {job.customPitch}
                            </p>
                          </div>
                        </div>

                        <a 
                          href={job.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800 transition-colors text-sm"
                        >
                          View on {job.platform || 'Platform'} <ExternalLink size={14} />
                        </a>
                      </div>
                    ))}
                  </div>

                  {jobResults.length > 0 && jobResults.length < 100 && (
                    <div className="mt-8 flex justify-center pb-8 px-6">
                      <button
                        onClick={() => findJobs(isSearchingAi, true)}
                        disabled={isSearching || isSearchingMore}
                        className="w-full sm:w-auto px-8 py-3 bg-white border-2 border-indigo-600 text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
                      >
                        {isSearchingMore ? (
                          <>
                            <Loader2 className="animate-spin" size={20} />
                            Finding More Matches...
                          </>
                        ) : (
                          <>
                            <Plus size={20} />
                            Load More Opportunities
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {!isSearching && jobResults.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                  <Briefcase size={48} className="mx-auto mb-4 opacity-20" />
                  <p>Search for a role to see AI-matched opportunities.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Wand2 size={24} />
                  ATS Tailor & Optimizer
                </h2>
                <p className="text-indigo-100 mt-1">Paste a job description to subtly optimize your CV for HR and ATS systems.</p>
              </div>
              
              <div className="p-6">
                <div className="mb-6 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-indigo-900 flex items-center gap-2">
                      <Link size={16} />
                      Job Posting Link
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="url" 
                      value={jobPostingUrl}
                      onChange={(e) => setJobPostingUrl(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                      placeholder="Paste the job posting URL here (e.g. LinkedIn, Indeed...)"
                    />
                    <button 
                      onClick={async () => {
                        try {
                          const text = await navigator.clipboard.readText();
                          if (text) setJobPostingUrl(text);
                        } catch (err) {
                          console.error('Failed to paste:', err);
                        }
                      }}
                      title="Paste link from clipboard"
                      className="px-3 py-2 border border-gray-300 rounded-lg text-gray-500 hover:text-indigo-600 hover:border-indigo-600 transition-all"
                    >
                      <Clipboard size={16} />
                    </button>
                    <button 
                      onClick={() => extractJobDetails(jobPostingUrl)}
                      disabled={isExtracting || !jobPostingUrl.trim()}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 min-w-[120px] justify-center"
                    >
                      {isExtracting ? (
                        <>
                          <Loader2 className="animate-spin" size={16} />
                          {Math.round(extractProgress)}%
                        </>
                      ) : (
                        <>
                          <Wand2 size={16} />
                          Extract
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] text-indigo-700 italic">
                    * Paste a link and click Extract to automatically fill the company, role, ATS, and job description fields.
                  </p>
                  {isExtracting && extractProgress > 75 && (
                    <p className="text-[10px] text-amber-600 font-medium mt-1 animate-pulse">
                      {extractProgress > 95 
                        ? "Almost there... cleaning up the job description..." 
                        : "Some sites (Workday, Eightfold) require a full browser render and may take 15-25 seconds. Please wait..."}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Company</label>
                    <input 
                      type="text" 
                      value={targetCompany}
                      onChange={(e) => setTargetCompany(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                      placeholder="e.g. Google"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Role</label>
                    <input 
                      type="text" 
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                      placeholder="e.g. Strategy Lead"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target ATS</label>
                    <select 
                      value={targetAts}
                      onChange={(e) => setTargetAts(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                    >
                      {atsOptions.map(option => (
                        <option key={option} value={option}>{option === "Other" ? "Other / Generic" : option}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Output Language</label>
                    <select 
                      value={targetLanguage}
                      onChange={(e) => setTargetLanguage(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="Portuguese">Portuguese</option>
                      <option value="German">German</option>
                      <option value="French">French</option>
                      <option value="Italian">Italian</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Job Description</label>
                    <button 
                      onClick={async () => {
                        try {
                          const text = await navigator.clipboard.readText();
                          if (text) {
                            setJobDescription(text);
                            if (error) setError(null);
                          }
                        } catch (err) {
                          console.error('Failed to paste:', err);
                        }
                      }}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
                      title="Paste job description from clipboard"
                    >
                      <Clipboard size={14} />
                      Paste Description
                    </button>
                  </div>
                  <textarea 
                    value={jobDescription}
                    onChange={(e) => {
                      setJobDescription(e.target.value);
                      if (error) setError(null);
                    }}
                    className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-mono"
                    placeholder="Paste the full job description here..."
                  />
                </div>

                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-lg text-red-700 text-sm flex items-start gap-2">
                    <span className="font-bold">Error:</span>
                    <span>{error}</span>
                  </div>
                )}

                <button 
                  onClick={optimizeCv}
                  disabled={isOptimizing || !jobDescription.trim()}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {isOptimizing ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Optimizing {Math.round(optimizeProgress)}%
                    </>
                  ) : (
                    <>
                      <Wand2 size={20} />
                      Tailor My CV
                    </>
                  )}
                </button>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                    <h4 className="text-indigo-900 font-bold text-sm mb-2">Subtle Optimization</h4>
                    <p className="text-xs text-indigo-800 leading-relaxed">We rewrite your summary and bullet points to emphasize relevant achievements without changing the facts.</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <h4 className="text-purple-900 font-bold text-sm mb-2">ATS Friendly</h4>
                    <p className="text-xs text-purple-800 leading-relaxed">The AI ensures key terminology from the job description is naturally integrated into your experience.</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-blue-900 font-bold text-sm mb-2">Structure Preserved</h4>
                    <p className="text-xs text-blue-800 leading-relaxed">Your professional history remains intact. We only adjust the "how" to make your value proposition clearer.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {showAiGenModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-auto animate-in fade-in zoom-in-95 duration-300 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-600 to-purple-700 text-white relative">
                <h2 className="text-2xl font-black flex items-center gap-2">
                  <Sparkles size={24} />
                  AI CV Architect
                </h2>
                <p className="text-indigo-100 text-sm mt-1">Answer a few questions to build your professional base CV from scratch, or import an existing one.</p>
                <button onClick={() => setShowAiGenModal(false)} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X size={20} className="text-white" />
                </button>
              </div>
              
              <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-indigo-100 rounded-2xl bg-indigo-50/30 mb-4">
                  <div className="bg-indigo-100 p-3 rounded-full mb-3">
                    <Upload className="text-indigo-600" size={24} />
                  </div>
                  <h4 className="font-bold text-indigo-900 mb-1">Have an existing CV?</h4>
                  <p className="text-xs text-indigo-600 mb-4">Import it to skip the questions below.</p>
                  <button 
                    onClick={() => {
                      setShowAiGenModal(false);
                      fileInputRef.current?.click();
                    }}
                    className="bg-white text-indigo-600 px-6 py-2 rounded-xl font-bold text-sm border border-indigo-200 hover:bg-indigo-50 transition-all shadow-sm"
                  >
                    Attach my CV
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">OR ANSWER QUESTIONS</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">1. What is your target job title?</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Senior Product Manager, Full Stack Developer..."
                      value={aiGenAnswers.targetRole}
                      onChange={(e) => setAiGenAnswers(prev => ({ ...prev, targetRole: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">2. What are your top 3 professional achievements?</label>
                    <textarea 
                      placeholder="e.g. Led a team of 10 to launch X, Increased revenue by 20%, Optimized Y process..."
                      value={aiGenAnswers.achievements}
                      onChange={(e) => setAiGenAnswers(prev => ({ ...prev, achievements: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">3. What are your core technical or soft skills?</label>
                    <textarea 
                      placeholder="e.g. React, Python, Project Management, Strategic Planning..."
                      value={aiGenAnswers.skills}
                      onChange={(e) => setAiGenAnswers(prev => ({ ...prev, skills: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">4. Briefly describe your most recent role.</label>
                    <textarea 
                      placeholder="Company name, key responsibilities, and impact..."
                      value={aiGenAnswers.recentRole}
                      onChange={(e) => setAiGenAnswers(prev => ({ ...prev, recentRole: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">5. What is your educational background?</label>
                    <input 
                      type="text" 
                      placeholder="e.g. BS in Computer Science, Stanford University, 2020"
                      value={aiGenAnswers.education}
                      onChange={(e) => setAiGenAnswers(prev => ({ ...prev, education: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-4">
                <button 
                  onClick={() => setShowAiGenModal(false)}
                  className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-white transition-all shadow-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={generateBaseCv}
                  disabled={isGeneratingBase || !aiGenAnswers.targetRole}
                  className="flex-[2] py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                  {isGeneratingBase ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Architecting Your CV...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      Generate Base CV
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
        {showAppModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-auto animate-in fade-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  {editingApp ? <Edit3 className="text-blue-600" /> : <Plus className="text-blue-600" />}
                  {editingApp ? 'Edit Application' : 'Add New Application'}
                </h2>
                <button onClick={() => setShowAppModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={20} className="text-gray-400" />
                </button>
              </div>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const data: any = {
                  companyName: formData.get('companyName'),
                  jobTitle: formData.get('jobTitle'),
                  status: formData.get('status'),
                  location: formData.get('location'),
                  workMode: formData.get('workMode'),
                  source: formData.get('source'),
                  jobUrl: formData.get('jobUrl'),
                  logoUrl: formData.get('logoUrl'),
                  priorityTier: formData.get('priorityTier'),
                  fitScore: parseInt(formData.get('fitScore') as string) || 0,
                  notes: formData.get('notes'),
                  nextAction: formData.get('nextAction'),
                };
                if (editingApp) data.id = editingApp.id;
                saveApplication(data);
              }} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Company Name *</label>
                    <input name="companyName" defaultValue={editingApp?.companyName} required className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Job Title *</label>
                    <input name="jobTitle" defaultValue={editingApp?.jobTitle} required className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</label>
                    <select name="status" defaultValue={editingApp?.status || 'IDENTIFIED'} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm">
                      <option value="IDENTIFIED">Identified</option>
                      <option value="RESEARCHING">Researching</option>
                      <option value="APPLIED">Applied</option>
                      <option value="SCREENING">Screening</option>
                      <option value="INTERVIEW">Interview</option>
                      <option value="ASSESSMENT">Assessment</option>
                      <option value="OFFER">Offer</option>
                      <option value="REJECTED">Rejected</option>
                      <option value="ACCEPTED">Accepted</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Priority Tier</label>
                    <select name="priorityTier" defaultValue={editingApp?.priorityTier || 'B'} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm">
                      <option value="A">A - Dream Role</option>
                      <option value="B">B - Strong Fit</option>
                      <option value="C">C - Backup</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Location</label>
                    <input name="location" defaultValue={editingApp?.location} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Work Mode</label>
                    <select name="workMode" defaultValue={editingApp?.workMode || 'Remote'} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm">
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="On-site">On-site</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fit Score (%)</label>
                    <input name="fitScore" type="number" min="0" max="100" defaultValue={editingApp?.fitScore || 0} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Job URL</label>
                  <input name="jobUrl" defaultValue={editingApp?.jobUrl} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Company Website or Custom Logo URL (Optional)</label>
                  <input name="logoUrl" defaultValue={editingApp?.logoUrl} placeholder="e.g. ea.com OR https://.../logo.png" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Next Action</label>
                  <input name="nextAction" defaultValue={editingApp?.nextAction} placeholder="e.g., Prepare for interview, Send follow-up..." className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Notes</label>
                  <textarea name="notes" defaultValue={editingApp?.notes} rows={3} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setShowAppModal(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors">Cancel</button>
                  <button type="submit" disabled={isSavingApp} className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    {isSavingApp ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {editingApp ? 'Update Application' : 'Save Application'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Download, Edit3, Briefcase, FileText, Search, ExternalLink, Sparkles, Loader2, CheckCircle2, Wand2, RotateCcw, Plus, Check, Save, X, Link, Clipboard } from 'lucide-react';
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";

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

const CV_DATA: CvData = {
  firstName: "Alejandro",
  lastName: "Angel Duque",
  location: "Bogotá, Colombia",
  address: "CLL 101 16 50 PO 110111",
  summary: "Strategic and data-driven Business Development & Strategy Leader with over 8 years of experience scaling operations, driving revenue growth, and leading cross-functional teams in fast-paced, matrixed environments (including top-tier Fintech and Telecom). Proven track record of owning P&L, formulating Go-to-Market (GTM) strategies, and negotiating high-impact partnerships to unlock new business opportunities. Adept at translating complex data into actionable strategic initiatives that optimize operational efficiency, maximize ROI, and accelerate market expansion. Fluent in English, Spanish, and Portuguese.",
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
    { category: "Strategic Leadership", items: ["Corporate Strategy", "Go-to-Market (GTM)", "Strategic Partnerships", "P&L Management", "OKR Framework", "Market Expansion", "Financial Modeling"] },
    { category: "Operations & Management", items: ["Cross-Functional Leadership", "Stakeholder Management", "Process Optimization", "Agile Methodologies", "Project Management", "Change Management"] },
    { category: "Data & Digital Strategy", items: ["Data-Driven Decision Making", "E-commerce Strategy", "Digital Marketing", "ROI Optimization", "Business Intelligence", "Power BI", "SQL"] }
  ],
  sectionTitles: {
    summary: "Professional Summary",
    experience: "Professional Experience",
    skills: "Key Skills",
    education: "Education",
    certifications: "Certifications & Additional Info"
  },
  education: [
    "Bachelor's Degree in Economics | Universidad del Rosario, Bogotá, Colombia | January 2013 – December 2018 | GPA: 3.99/5.0 (Academic Excellence Scholarship)",
    "Data Science Career Program | Acamica (IBM & Globant Institution), Bogotá, Colombia | September 2019 – May 2020"
  ],
  certifications: [
    "Certifications: Generative AI Leader (Google), AI-Powered Performance Ads (Google), Google Analytics, Scrum Master (SMPC), Scrum Product Owner (SPOPC).",
    "Languages: Spanish (Native), English (C1 - Fluent/Advanced), Portuguese (B2 - Upper-Intermediate).",
    "Leadership & Social Impact: President of the Student Council, Faculty of Economics (Universidad del Rosario, 2016); Project Leader at Fundación Con Las Manos (Coordinated 30 volunteers).",
    "Media Coverage: Featured in Portafolio (2025) regarding Ikonico's strategic positioning to lead the beauty and fragrance segment."
  ]
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

export default function App() {
  const [activeTab, setActiveTab] = useState<'cv' | 'hunter' | 'optimizer'>('cv');
  const [isSearchingManual, setIsSearchingManual] = useState(false);
  const [isSearchingAi, setIsSearchingAi] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
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
  const [targetLanguage, setTargetLanguage] = useState('English');
  const [jobPostingUrl, setJobPostingUrl] = useState('');
  const [lastExtractedUrl, setLastExtractedUrl] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractProgress, setExtractProgress] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [cvDataState, setCvDataState] = useState<CvData>(CV_DATA);
  const [optimizedCv, setOptimizedCv] = useState<CvData | null>(null);
  const [fitAnalysis, setFitAnalysis] = useState<FitAnalysis | null>(null);
  const [useOptimized, setUseOptimized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [optimizeProgress, setOptimizeProgress] = useState(0);

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
          if (prev >= 95) return prev;
          return prev + (100 - prev) * 0.15;
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

  const getAiInstance = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("API Key is missing. Please check your environment settings.");
    return new GoogleGenAI({ apiKey });
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
      const scrapeResponse = await fetch(`https://r.jina.ai/${encodeURIComponent(url)}`);
      if (!scrapeResponse.ok) {
        throw new Error("The scraping API could not access this URL. It might be protected against bots.");
      }
      const scrapedText = await scrapeResponse.text();

      // Step 2: Use the cheaper Flash model to parse ONLY the metadata
      const ai = getAiInstance();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are an expert data extractor. I have scraped the text content of a job posting.
        
        Here is the scraped text:
        ---
        ${scrapedText.substring(0, 15000)}
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
        - ats: The ATS system used (if identifiable from the URL or text, e.g. Workday, Greenhouse, Lever, Taleo, SuccessFactors, or "Other").
        - language: The language the job is posted in (e.g., "English", "Spanish").
        - descriptionStartSnippet: The exact first 7 words of the job description.
        - descriptionEndSnippet: The exact last 7 words of the job description.`,
        config: {
          temperature: 0,
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

      const data = JSON.parse(response.text || '{}');
      if (data.company) setTargetCompany(data.company);
      if (data.role) setTargetRole(data.role);
      if (data.ats) setTargetAts(data.ats);
      if (data.language) setTargetLanguage(data.language);
      
      let finalJobDescription = scrapedText;
      
      // Try to extract the exact job description block
      if (data.descriptionStartSnippet && data.descriptionEndSnippet) {
        const buildRegex = (snippet: string) => {
          const words = snippet.trim().split(/\s+/).filter((w: string) => w.length > 0);
          if (words.length === 0) return null;
          // Escape regex chars and join with whitespace matcher
          const regexStr = words.map((w: string) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\s+');
          return new RegExp(regexStr, 'i');
        };
        
        const startRegex = buildRegex(data.descriptionStartSnippet);
        const endRegex = buildRegex(data.descriptionEndSnippet);
        
        if (startRegex && endRegex) {
          const startMatch = scrapedText.match(startRegex);
          if (startMatch && startMatch.index !== undefined) {
            const startIndex = startMatch.index;
            const remainingText = scrapedText.substring(startIndex);
            const endMatch = remainingText.match(endRegex);
            if (endMatch && endMatch.index !== undefined) {
              const endIndex = startIndex + endMatch.index + endMatch[0].length;
              finalJobDescription = scrapedText.substring(startIndex, endIndex);
            } else {
              finalJobDescription = scrapedText.substring(startIndex);
            }
          }
        }
      }

      // Clean up markdown images: ![alt](url)
      finalJobDescription = finalJobDescription.replace(/!\[.*?\]\(.*?\)/g, '');
      // Clean up markdown links: [text](url) -> text
      finalJobDescription = finalJobDescription.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
      // Clean up multiple newlines
      finalJobDescription = finalJobDescription.replace(/\n{3,}/g, '\n\n').trim();

      setJobDescription(finalJobDescription);
      
      setLastExtractedUrl(url);
    } catch (err: any) {
      console.error("Extraction error:", err);
      const errorMessage = err.message || String(err);
      if (errorMessage.includes("API Key is missing")) {
        setError(errorMessage);
      } else {
        setError("Failed to extract job details. Please ensure the URL is valid and accessible.");
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
      const ai = getAiInstance();
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
      
      Return a JSON object with two fields:
      - 'cv': The updated CV data matching the original structure, with all content and titles translated.
      - 'fitAnalysis': An object with:
        - 'originalScore': (0-100) How well the original CV matched.
        - 'optimizedScore': (0-100) How well the optimized CV matches.
        - 'improvement': A brief explanation of the key improvements made, focusing on natural integration.
        - 'keyChanges': An array of the top 3-4 strategic changes made, explaining *why* they enhance the CV's fit subtly.
      
      The 'cv' object MUST include:
      - firstName, lastName, location, address, summary
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
                required: ["firstName", "lastName", "location", "address", "summary", "experience", "skills", "sectionTitles", "education", "certifications"]
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
      const ai = getAiInstance();
      
      let searchPrompt = "";
      const filterContext = `
        - Job Type: ${searchJobType === 'all' ? 'Any' : searchJobType}
        - Remote Status: ${searchRemote === 'all' ? 'Any' : searchRemote}
        - Experience Level: ${searchExpLevel === 'all' ? 'Any' : searchExpLevel}
      `;

      if (isAiSelection) {
        searchPrompt = `Analyze this candidate's profile and find the best matching job opportunities across major global and local job boards (LinkedIn, Indeed, Glassdoor, Computrabajo, El Empleo, etc.):
        - Name: ${cvDataState.firstName} ${cvDataState.lastName}
        - Summary: ${cvDataState.summary}
        - Key Experience: ${cvDataState.experience.map(e => `${e.role} at ${e.company}`).join(', ')}
        - Skills: ${cvDataState.skills.map(s => s.items.join(', ')).join(', ')}
        
        Search for real, active job postings in "${searchLocation}".
        Filters:
        ${filterContext}
        
        Focus on finding the most recent opportunities from the last ${searchRecency === '24h' ? '24 hours' : searchRecency === '7d' ? '7 days' : '30 days'}.
        This is page ${currentPage} of results. Find different results than previous searches.`;
      } else {
        searchPrompt = `Search for real, active job postings for "${searchQuery}" in "${searchLocation}" across major global and local job boards (LinkedIn, Indeed, Glassdoor, Computrabajo, El Empleo, etc.). 
        Filters:
        ${filterContext}
        
        Focus on finding the most recent opportunities from the last ${searchRecency === '24h' ? '24 hours' : searchRecency === '7d' ? '7 days' : '30 days'}.
        This is page ${currentPage} of results. Find different results than previous searches.`;
      }

      const prompt = `${searchPrompt}
      
      After finding the jobs, analyze them against the candidate's profile.
      
      CRITICAL SEARCH STRATEGY (AUTHORITY & COST EFFICIENCY):
      - Use the googleSearch tool with MANDATORY site operators to find jobs ONLY on HIGH-AUTHORITY platforms.
      - STEP 1: Search LinkedIn (site:linkedin.com/jobs/view)
      - STEP 2: Search Indeed (site:indeed.com/viewjob)
      - STEP 3: Search Glassdoor (site:glassdoor.com/job-listing)
      - ONLY if results are insufficient, search local leaders (site:computrabajo.com.co, site:elempleo.com).
      - Use the 'tbs=qdr:${searchRecency === '24h' ? 'd' : searchRecency === '7d' ? 'w' : 'm'}' parameter.
      
      ZERO TOLERANCE FOR BROKEN LINKS, CATALOGS & REDIRECTS:
      - CRITICAL BUG FIX: You have a tendency to hallucinate job URLs (e.g. inventing 'https://jobs.ashbyhq.com/arq/general-manager-colombia' instead of the real 'https://jobs.ashbyhq.com/arq/f7f0d1b6-8ce8-4f8b-959f-9cda1f3020c0'). You MUST copy the EXACT, raw URL from the Google Search results. Do NOT construct or guess URLs.
      - DISCARD any link containing "/jobs/search", "/jobs/collections", "/jobs/index", "/jobs/catalog", "/jobs/all", or "/jobs/list".
      - DISCARD any link that leads to a list of jobs or a search results page.
      - The link MUST be a direct "view" URL for a single job (e.g., linkedin.com/jobs/view/..., indeed.com/viewjob?jk=...).
      - NEVER provide a link to a company's general career portal or a "Join our talent community" page.
      - NEVER guess or hallucinate a URL. If you cannot find a direct link, do not include the job.
      - CRITICAL: Ensure the URL is complete and properly formatted. Do not truncate URLs.
      
      SOURCE AUTHORITY & HIERARCHY:
      - Prioritize LinkedIn and Indeed above all else. They are the gold standard for direct links.
      - Discard results from obscure "job aggregator" sites (e.g., jooble, ziprecruiter, talent.com, etc.) as they often lead to 404s or are low quality.
      - Ensure the "platform" field accurately reflects where the job was found.
      
      QUANTITY: Return 10-15 HIGH-QUALITY, VERIFIED matches. Quality over quantity.
      
      Return the results as a JSON array of objects with these fields:
      - title, company, location, link (EXACT VERIFIED URL), platform (e.g. "LinkedIn", "Indeed", "Computrabajo"), matchScore (0-100), reason (why it matches), customPitch (2-sentence application pitch).
      - postedDate: (e.g. "2 days ago", "Today")
      - applicantCount: (estimated number of applicants if available)
      - tags: (array of strings like "Top Company", "Verified Source", "Fortune 500")
      - isTopOpportunity: (boolean, true if matchScore > 85 and company is reputable)
      
      Sort results by matchScore (descending).`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          toolConfig: { includeServerSideToolInvocations: true },
          responseMimeType: "application/json",
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
      if (chunks && Array.isArray(chunks)) {
        results = results.map(job => {
          // Find the best matching chunk for this job
          const match = chunks.find(c => {
            if (!c.web || !c.web.uri) return false;
            const chunkTitle = c.web.title.toLowerCase();
            const jobTitle = job.title.toLowerCase();
            const jobCompany = job.company.toLowerCase();
            
            // Check if the chunk title contains the job title or company
            return chunkTitle.includes(jobTitle) || 
                   chunkTitle.includes(jobCompany) || 
                   jobTitle.includes(chunkTitle);
          });
          
          if (match && match.web && match.web.uri) {
            // Replace the hallucinated link with the real, verified Google Search link
            return { ...job, link: match.web.uri };
          }
          return job;
        });
      }
      
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
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

        {activeTab === 'cv' ? (
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
                        setCvDataState(CV_DATA);
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
                    Last Name: {currentCvData.lastName} | 
                    Middle Name: None | 
                    Father Last Name: Angel | 
                    Mother Last Name: Duque | 
                    Location: {currentCvData.location} | 
                    Address: {currentCvData.address} | 
                    Postal Code: 110111 | 
                    Country Code: +57 | 
                    Phone Number: 3174117571 | 
                    Email: aangeldu@gmail.com | 
                    Education 1: Universidad del Rosario (Bogotá, Colombia) (January 2013 – December 2018) GPA: 3.99/5.0 | 
                    Education 2: Acamica (Bogotá, Colombia) (September 2019 – May 2020) |
                    {currentCvData.experience.map((exp, idx) => (
                      ` Experience ${idx + 1}: Company: ${exp.company} | Job Title: ${exp.role} | Dates: ${exp.period} | Location: ${exp.location} | `
                    ))}
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
                    +57 3174117571 | aangeldu@gmail.com | <a href="https://linkedin.com/in/aangeldu/" className="text-blue-600 print:text-gray-900 print:no-underline">linkedin.com/in/aangeldu/</a>
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
                    <p className="text-[13px] text-justify text-gray-800 leading-snug">
                      {currentCvData.summary}
                    </p>
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
                            ) : bullet}
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
                          <span dangerouslySetInnerHTML={{ __html: edu.replace(/\|/g, '<span class="text-gray-400 mx-1">|</span>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') }} />
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
                          <span dangerouslySetInnerHTML={{ __html: cert.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') }} />
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
                      onClick={() => {
                        navigator.clipboard.writeText(jobPostingUrl);
                        // Optional: show some feedback
                      }}
                      title="Copy link to clipboard"
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
                      <option value="Workday">Workday</option>
                      <option value="Greenhouse">Greenhouse</option>
                      <option value="Lever">Lever</option>
                      <option value="Taleo">Taleo</option>
                      <option value="SuccessFactors">SuccessFactors</option>
                      <option value="Other">Other / Generic</option>
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
                      onClick={() => navigator.clipboard.writeText(jobDescription)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
                      title="Copy job description to clipboard"
                    >
                      <Clipboard size={14} />
                      Copy Description
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
      </main>
    </div>
  );
}

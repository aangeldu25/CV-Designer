import { GoogleGenAI, Type } from "@google/genai";
import fs from 'fs';

async function test() {
  const url = 'https://kimberlyclark.wd1.myworkdayjobs.com/es/GLOBAL/job/Colombia--Bogota/Lder-de-Ejecucin-Retail_883672?source=linkedin';
  const res = await fetch(`https://r.jina.ai/${encodeURIComponent(url)}`);
  const scrapedText = await res.text();
  
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  console.log('Starting Gemini...');
  const startTime = Date.now();
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
  console.log('Gemini finished in', Date.now() - startTime, 'ms');
  console.log(response.text);
}

test();

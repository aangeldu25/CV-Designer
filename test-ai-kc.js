import { GoogleGenAI, Type } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const text = `Title: Líder de Ejecución Retail

URL Source: https://kimberlyclark.wd1.myworkdayjobs.com/es/GLOBAL/job/Colombia--Bogota/Lder-de-Ejecucin-Retail_883672?source=linkedin

Markdown Content:
Líder de Ejecución Retail

## **Job Description**

No eres la persona que se conformará con cualquier función. Tampoco nosotros. Porque estamos dispuestos a crear una mejor atención para un mundo mejor, y eso requiere un cierto tipo de persona y equipos que se preocupan por marcar la diferencia. Aquí, aportarás`;

const start = Date.now();
ai.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: `You are an expert data extractor... (truncated for test)
  Here is the scraped text:
  ---
  ${text}
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
}).then(res => {
  console.log("Time:", Date.now() - start);
  console.log(res.text);
}).catch(err => console.error(err));

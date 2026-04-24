import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "API key not configured on server" });
    }

    const ai = new GoogleGenAI({ apiKey });
    const { model, contents, config } = req.body;

    const response = await ai.models.generateContent({
      model: model || "gemini-3-flash-preview",
      contents,
      config
    });

    res.status(200).json({
      ...response,
      text: response.text
    });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate content" });
  }
}

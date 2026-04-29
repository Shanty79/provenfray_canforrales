import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ text: "Error: Falta la API Key en Vercel." });
  }

  // FUERZA LA VERSIÓN ESTABLE AQUÍ
  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    // Usamos el nombre del modelo sin el "-latest" para mayor estabilidad en v1
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const userPrompt = body.prompt || "Hola";

    // Generamos el contenido
    const result = await model.generateContent("Eres un experto en bádminton para niños. Responde de forma breve: " + userPrompt);
    const response = await result.response;
    const text = response.text();
    
    return res.status(200).json({ text: text });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ text: "Error de la API: " + error.message });
  }
}

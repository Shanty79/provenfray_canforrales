import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Usamos el nombre de variable que configuraste en Vercel
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ text: "Error: Falta la API Key en Vercel." });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    // Intentamos obtener el prompt de varias formas según cómo lo envíe el navegador
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const userPrompt = body.prompt || "Hola";

    const result = await model.generateContent("Eres un experto en bádminton para niños. Responde de forma breve: " + userPrompt);
    const response = await result.response;
    
    return res.status(200).json({ text: response.text() });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ text: "Error de la API: " + error.message });
  }
}

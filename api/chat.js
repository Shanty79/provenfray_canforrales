import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    // Parseamos el cuerpo si viene como string
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { prompt } = body;

    const result = await model.generateContent("Eres un experto en bádminton para niños. Responde de forma clara: " + prompt);
    const response = await result.response;
    const text = response.text();
    
    res.status(200).json({ text: text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

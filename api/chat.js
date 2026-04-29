import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Vercel leerá automáticamente la clave que configuraste en Settings
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const { prompt } = JSON.parse(req.body);
    const result = await model.generateContent("Eres un experto en bádminton para niños. " + prompt);
    const response = await result.response;
    res.status(200).json({ text: response.text() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

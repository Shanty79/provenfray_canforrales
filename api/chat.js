const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  // Usamos la nueva API KEY que has generado
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

  // IMPORTANTE: Usamos el modelo que aparece en tu panel de control
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const userPrompt = req.body.prompt || req.body.message || "Hola";

  try {
    const result = await model.generateContent("Eres Fray-Smash, entrenador de bádminton. Responde: " + userPrompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ text: text });

  } catch (error) {
    console.error("Error en Fray-Smash:", error);
    // Si da error 429, avisamos que es por la cuota de Google
    const msg = error.message.includes("429") 
      ? "Google me tiene en el banquillo por exceso de peticiones. Intenta en un minuto." 
      : error.message;
      
    res.status(200).json({ text: "Fray-Smash dice: " + msg });
  }
};

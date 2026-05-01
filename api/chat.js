const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

  // PROBAMOS CON EL MODELO FLASH 8B (Es el que mejor funciona desde Vercel)
  // Este modelo suele tener las cuotas más altas y menos bloqueos por región
  const model = genAI.getGenerativeModel(
    { model: "gemini-1.5-flash-8b" }, 
    { apiVersion: 'v1' }
  );

  const userPrompt = req.body.prompt || req.body.message || "Hola";

  try {
    const result = await model.generateContent("Eres Fray-Smash, entrenador de bádminton. Responde: " + userPrompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ text: text });

  } catch (error) {
    console.error("Error detallado:", error);
    
    // Si este falla, el error nos dirá exactamente qué nombre de modelo prefiere Google
    res.status(200).json({ 
      text: "Fray-Smash está recuperando el aliento... (Error: " + error.message + ")" 
    });
  }
};

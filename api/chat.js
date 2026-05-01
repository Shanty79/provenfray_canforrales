const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

  // ESTE ES EL MODELO QUE TIENE LOS 1.500 MENSAJES (1.5K RPD)
  // Usamos el ID técnico 'gemini-2.5-pro' y la versión 'v1beta'
  const model = genAI.getGenerativeModel(
    { model: "gemini-2.5-pro" },
    { apiVersion: 'v1beta' }
  );

  const userPrompt = req.body.prompt || req.body.message || "Hola";

  try {
    const result = await model.generateContent("Eres Fray-Smash, entrenador de bádminton. Responde: " + userPrompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ text: text });

  } catch (error) {
    console.error("Error detallado:", error);
    
    // Si este falla, el error nos dirá el nombre exacto que falta
    res.status(200).json({ 
      text: "Fray-Smash está ajustando la tensión de la raqueta... (Error: " + error.message + ")" 
    });
  }
};

const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  // Inicializamos la IA con tu clave (la que configuraste en Vercel)
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

  // Seleccionamos el modelo Gemini 2.0 Flash (el mismo que te funciona en AI Studio)
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Capturamos lo que el usuario escribe en tu web
  const userPrompt = req.body.prompt || req.body.message || "Hola";

  try {
    // Generamos la respuesta con la personalidad de Fray-Smash
    const result = await model.generateContent("Eres Fray-Smash, entrenador de bádminton. Responde: " + userPrompt);
    const response = await result.response;
    const text = response.text();

    // Enviamos la respuesta de vuelta a tu página web
    res.status(200).json({ text: text });

  } catch (error) {
    console.error("Error detallado:", error);
    res.status(200).json({ 
      text: "Fray-Smash tiene un problema de conexión: " + error.message 
    });
  }
};

const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

  // USAMOS EL MODELO DE 500 MENSAJES (Gemini 3.1 Flash Lite)
  // Forzamos apiVersion: 'v1' para que no de error 404
  const model = genAI.getGenerativeModel(
    { model: "gemini-3.1-flash-lite" },
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
    
    // Mensaje amigable si fallara algo
    let mensaje = "Fray-Smash está recogiendo los volantes... (Error de conexión)";
    if (error.message.includes("429")) {
      mensaje = "¡Increíble! Hemos agotado los 500 entrenamientos de hoy. Fray-Smash tiene que descansar.";
    }

    res.status(200).json({ text: mensaje });
  }
};

const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

  // Usamos Gemini 2.5, que es el que te da 1500 peticiones gratis según tu panel
  const model = genAI.getGenerativeModel(
    { model: "gemini-2.5" }
  );

  const userPrompt = req.body.prompt || req.body.message || "Hola";

  try {
    const result = await model.generateContent("Eres Fray-Smash, entrenador de bádminton. Responde: " + userPrompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ text: text });

  } catch (error) {
    console.error("Error en Fray-Smash:", error);
    
    // Si llegas al límite de 1500, este mensaje te lo confirmará
    const mensajeError = error.message.includes("429") 
      ? "¡Uff! Hemos agotado los 1.500 entrenamientos de hoy. Fray-Smash necesita descansar."
      : "Error de conexión: " + error.message;

    res.status(200).json({ text: mensajeError });
  }
};

const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

  const model = genAI.getGenerativeModel(
    { 
      model: "gemma-4-31b-it",
      systemInstruction: "Eres Airi Sense · ProvenFray, una experta entrenadora de bádminton. Tu tono es motivador, profesional y enérgico. Responde directamente al usuario en español, de forma concisa y usando términos de bádminton. No incluyas metadatos ni introducciones técnicas."
    },
    { apiVersion: 'v1beta' }
  );

  const userPrompt = req.body.prompt || req.body.message || "Hola";

  try {
    // Usamos generateContent simple, que es más estable para respuestas directas
    const result = await model.generateContent(userPrompt);
    const response = await result.response;
    const text = response.text();

    // Enviamos el texto tal cual llega, confiando en la nueva instrucción
    res.status(200).json({ text: text });

  } catch (error) {
    console.error("Error:", error);
    res.status(200).json({ 
      text: "Airi Sense · ProvenFray está ajustando la red... ¡Prueba de nuevo!" 
    });
  }
};

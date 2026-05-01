const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

  // CAMBIO CRUCIAL: Pasamos de 'v1' a 'v1beta'
  // Los modelos Gemma 4 "Nuevos" siempre debutan en la v1beta
  const model = genAI.getGenerativeModel(
    { model: "gemma-4-31b-it" },
    { apiVersion: 'v1beta' } 
  );

  const userPrompt = req.body.prompt || req.body.message || "Hola";

  try {
    const result = await model.generateContent("Eres Fray-Smash, entrenador de bádminton experto. Responde de forma motivadora: " + userPrompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ text: text });

  } catch (error) {
    console.error("Error en el saque:", error);
    res.status(200).json({ 
      text: "Fray-Smash está analizando la jugada... (Error: " + error.message + ")" 
    });
  }
};

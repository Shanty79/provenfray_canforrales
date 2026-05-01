const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

  // MIGRACIÓN EXITOSA A GEMMA 4 31B
  const model = genAI.getGenerativeModel(
    { model: "gemma-4-31b-it" },
    { apiVersion: 'v1' }
  );

  const userPrompt = req.body.prompt || req.body.message || "Hola";

  try {
    // Le damos la instrucción de personalidad a este nuevo modelo "pensante"
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

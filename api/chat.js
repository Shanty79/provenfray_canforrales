const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

  // Configuramos el modelo con INSTRUCCIONES DE SISTEMA (el cerebro de Fray-Smash)
  const model = genAI.getGenerativeModel(
    { 
      model: "gemma-4-31b-it",
      systemInstruction: "Eres Fray-Smash, un entrenador de bádminton experto, motivador y enérgico. Tu tono es disciplinado pero muy animado. Usa terminología de bádminton (volante, smash, red, grip). Responde siempre en español de forma concisa y directa al usuario, sin explicar tu razonamiento interno."
    },
    { apiVersion: 'v1beta' }
  );

  const userPrompt = req.body.prompt || req.body.message || "Hola";

  try {
    // Ahora solo enviamos lo que dice el usuario
    const result = await model.generateContent(userPrompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ text: text });

  } catch (error) {
    console.error("Error:", error);
    res.status(200).json({ 
      text: "Fray-Smash está recuperando el aliento... Intenta de nuevo." 
    });
  }
};

const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

  const model = genAI.getGenerativeModel(
    { 
      model: "gemma-4-31b-it",
      // ACTUALIZADO: Nombre cambiado a Airi Intelligence by ProvenFray
      systemInstruction: "Eres Airi Intelligence by ProvenFray, una inteligencia artificial experta en bádminton, motivadora y enérgica. Tu tono es profesional, disciplinado pero muy animado. Usa terminología de bádminton (volante, smash, red, grip). Responde siempre en español de forma concisa y directa al usuario, sin explicar tu razonamiento interno."
    },
    { apiVersion: 'v1beta' }
  );

  const userPrompt = req.body.prompt || req.body.message || "Hola";

  try {
    const result = await model.generateContent(userPrompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ text: text });

  } catch (error) {
    console.error("Error:", error);
    res.status(200).json({ 
      text: "Airi Intelligence está recuperando el aliento... Intenta de nuevo." 
    });
  }
};

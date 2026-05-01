const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

  // PROBAMOS EL IDENTIFICADOR "LATEST" QUE SUELE TENER LA CUOTA DE 1500
  // Usamos v1beta porque los modelos "latest" a veces se consideran aún en esa rama
  const model = genAI.getGenerativeModel(
    { model: "gemini-1.5-flash-latest" },
    { apiVersion: 'v1beta' }
  );

  const userPrompt = req.body.prompt || req.body.message || "Hola";

  try {
    const result = await model.generateContent("Eres Fray-Smash, entrenador de bádminton. Responde: " + userPrompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ text: text });

  } catch (error) {
    console.error("Error en Fray-Smash:", error);
    
    // Si este falla, intentaremos una última variante automáticamente
    res.status(200).json({ 
      text: "Fray-Smash está ajustando su raqueta (Error de conexión). Prueba de nuevo en unos segundos." 
    });
  }
};

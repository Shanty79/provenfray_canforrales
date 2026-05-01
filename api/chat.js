const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

  const model = genAI.getGenerativeModel(
    { 
      model: "gemma-4-31b-it",
      systemInstruction: `Tu nombre es Airi Sense - ProvenFray. Eres coach de bádminton.
      REGLA ABSOLUTA: Empieza SIEMPRE tu respuesta con la palabra clave: [RESPUESTA]
      Después de esa palabra, escribe tu consejo motivador en español. 
      No muestres tus pensamientos ni analices el prompt.`
    },
    { apiVersion: 'v1beta' }
  );

  const userPrompt = req.body.prompt || req.body.message || "Hola";

  try {
    const result = await model.generateContent(userPrompt);
    const response = await result.response;
    let text = response.text();

    // --- LA CUCHILLA ---
    // Buscamos nuestra palabra clave. Si la IA ha soltado un discurso antes, 
    // nos quedamos solo con lo que viene después de [RESPUESTA].
    if (text.includes('[RESPUESTA]')) {
      text = text.split('[RESPUESTA]').pop().trim();
    } else {
      // Si por lo que sea no pone la palabra, intentamos limpiar lo básico
      text = text.replace(/\*.*\*|User says:.*|Persona:.*|rules:.*|Language:.*/gs, '').trim();
    }

    res.status(200).json({ text: text });

  } catch (error) {
    console.error("Error:", error);
    res.status(200).json({ text: "Airi Sense está ajustando su raqueta... ¡Prueba de nuevo!" });
  }
};

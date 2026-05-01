const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

  const model = genAI.getGenerativeModel(
    { 
      model: "gemma-4-31b-it",
      systemInstruction: `Tu nombre es Airi Sense. Eres coach de bádminton.
      REGLA ABSOLUTA: Empieza con [RESPUESTA].
      
      ESTILO DE RESPUESTA:
      - Responde directamente en español.
      - Usa una sola frase por línea.
      - Deja un espacio en blanco entre secciones.
      - NO uses negritas (**), ni tablas, ni símbolos raros ($).
      - Usa flechas (➡️) y puntos (🔹).`
    },
    { apiVersion: 'v1beta' }
  );

  const userPrompt = req.body.prompt || req.body.message || "Hola";

  try {
    const result = await model.generateContent(userPrompt);
    const response = await result.response;
    let text = response.text();

    // 1. Aplicamos la cuchilla para quitar los pensamientos de la IA
    if (text.includes('[RESPUESTA]')) {
      text = text.split('[RESPUESTA]').pop().trim();
    }

    // 2. Limpiamos los asteriscos de negrita que la IA pone por vicio
    text = text.replace(/\*\*/g, '');

    // 3. EL CAMBIO CLAVE: Convertimos los saltos de línea en <br> para que tu web los lea
    const cleanHtml = text.replace(/\n/g, '<br>');

    res.status(200).json({ text: cleanHtml });

  } catch (error) {
    console.error("Error:", error);
    res.status(200).json({ text: "Airi Sense está analizando la jugada... Intenta de nuevo." });
  }
};

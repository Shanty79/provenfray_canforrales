const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

  // CAMBIAMOS A FLASH PARA VELOCIDAD (2s vs 25s)
  const model = genAI.getGenerativeModel(
    { 
      model: "gemini-1.5-flash", 
      systemInstruction: `Tu nombre es Airi Sense. Eres coach de bádminton.
      REGLA DE ORO: Empieza con [RESPUESTA].
      
      ESTILO DE RESPUESTA:
      - Escribe como si fuera un telegrama: UNA IDEA POR LÍNEA.
      - Usa flechas (➡️) y puntos (🔹).
      - Deja SIEMPRE un espacio en blanco entre secciones.
      - NO escribas párrafos, solo frases cortas.`
    },
    { apiVersion: 'v1' }
  );

  const userPrompt = req.body.prompt || req.body.message || "Hola";

  try {
    const result = await model.generateContent(userPrompt);
    const response = await result.response;
    let text = response.text();

    if (text.includes('[RESPUESTA]')) {
      text = text.split('[RESPUESTA]').pop().trim();
    }

    // --- EL TRUCO MAESTRO PARA EL DISEÑO ---
    // Esta línea convierte los "Enters" que pone la IA en saltos de línea reales para tu web (<br>)
    const htmlText = text.replace(/\n/g, '<br>');

    res.status(200).json({ text: htmlText });

  } catch (error) {
    res.status(200).json({ text: "Airi Sense está ajustando la red... ¡Prueba de nuevo!" });
  }
};

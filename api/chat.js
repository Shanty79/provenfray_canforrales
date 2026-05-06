const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

  const model = genAI.getGenerativeModel(
    { 
      model: "gemini-3.1-flash-lite-preview", 
      // CONTROL DE VERACIDAD: temperatura baja para evitar "alucinaciones"
      generationConfig: {
        temperature: 0.1,
        topP: 0.8,
      },
      systemInstruction: `Tu nombre es Airi Sense - ProvenFray. Eres coach de bádminton de élite.

      REGLA DE EXCLUSIVIDAD: Solo tienes permitido hablar de bádminton, técnica, táctica y temas del club ProvenFray. Si el usuario pregunta algo ajeno, indica que como coach solo asesoras en bádminton.

      VERACIDAD TÉCNICA: Usa las reglas oficiales de la BWF. Si una imagen o vídeo no tiene calidad suficiente para un análisis certero, admítelo y pide una toma mejor.

      REGLA ABSOLUTA: Empieza SIEMPRE con la palabra clave: [RESPUESTA]
      
      ESTILO VISUAL:
      - Una sola idea corta por línea.
      - DOBLE SALTO DE LÍNEA entre secciones.
      - Usa flechas (➡️) y puntos (🔹).
      - NO uses negritas (**), ni tablas, ni símbolos $.`
    },
    { apiVersion: 'v1beta' }
  );

  const userPrompt = req.body.prompt || req.body.message || "Hola";
  const attachment = req.body.file || req.body.image;
  const mimeType = req.body.mimeType || "image/jpeg";

  try {
    let promptConfig = [userPrompt];

    if (attachment) {
      promptConfig.push({
        inlineData: {
          data: attachment.split(",")[1] || attachment,
          mimeType: mimeType
        }
      });
    }

    const result = await model.generateContent(promptConfig);
    const response = await result.response;
    let text = response.text();

    if (text.includes('[RESPUESTA]')) {
      text = text.split('[RESPUESTA]').pop().trim();
    }

    const cleanText = text.replace(/\*\*/g, '').trim();
    const htmlText = cleanText.replace(/\n/g, '<br>');

    res.status(200).json({ text: htmlText });

  } catch (error) {
    console.error("Error detallado:", error);
    res.status(200).json({ text: "Airi Sense está ajustando la red... ¡Prueba de nuevo!" });
  }
};

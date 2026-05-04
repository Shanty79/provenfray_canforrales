const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

  const model = genAI.getGenerativeModel(
    { 
      // HEMOS AÑADIDO "-preview" AL FINAL
      model: "gemini-3.1-flash-lite-preview", 
      systemInstruction: `Tu nombre es Airi Sense - ProvenFray. Eres coach de bádminton de élite.
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
  const imageBase64 = req.body.image;

  try {
    let promptConfig = [userPrompt];

    if (imageBase64) {
      promptConfig.push({
        inlineData: {
          data: imageBase64.split(",")[1] || imageBase64,
          mimeType: "image/jpeg"
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

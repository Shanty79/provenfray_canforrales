const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

  // 1. CONFIGURACIÓN DEL MODELO 3.1 FLASH LITE
  const model = genAI.getGenerativeModel(
    { 
      model: "gemini-3.1-flash-lite", 
      systemInstruction: `Tu nombre es Airi Sense - ProvenFray. Eres coach de bádminton de élite.
      REGLA ABSOLUTA: Empieza SIEMPRE con la palabra clave: [RESPUESTA]
      
      ESTILO VISUAL (HIGIENE):
      - Una sola idea corta por línea.
      - DOBLE SALTO DE LÍNEA entre secciones.
      - Usa flechas (➡️) y puntos (🔹).
      - NO uses negritas (**), ni tablas de markdown, ni símbolos $.
      - Si analizas una imagen, sé directo y técnico.`
    },
    { apiVersion: 'v1beta' } // Versión necesaria para los modelos 3.1
  );

  const userPrompt = req.body.prompt || req.body.message || "Hola";
  const imageBase64 = req.body.image; // Para cuando añadas el botón de subir fotos

  try {
    let promptConfig = [userPrompt];

    // Si el usuario envía una imagen, la añadimos al mensaje
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

    // LA CUCHILLA: Limpiamos metadatos
    if (text.includes('[RESPUESTA]')) {
      text = text.split('[RESPUESTA]').pop().trim();
    }

    // Limpieza final de asteriscos y saltos de línea HTML
    const cleanText = text.replace(/\*\*/g, '').trim();
    const htmlText = cleanText.replace(/\n/g, '<br>');

    res.status(200).json({ text: htmlText });

  } catch (error) {
    console.error("Error:", error);
    res.status(200).json({ text: "Airi Sense está analizando la jugada... ¡Prueba de nuevo!" });
  }
};

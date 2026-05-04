const { GoogleGenerativeAI } = require("@google/generative-ai");

// Inicialización del motor de Airi Sense
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

module.exports = async (req, res) => {
  // Solo permitimos peticiones POST para seguridad
  if (req.method !== 'POST') return res.status(405).send('Método no permitido');

  const { prompt, file, mimeType } = req.body;

  try {
    // CAMBIO CLAVE: Usamos gemini-1.5-flash (compatible con texto, imagen y vídeo)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const promptPrincipal = prompt || "Analiza técnicamente este contenido de bádminton.";
    const displayParts = [promptPrincipal];

    // Lógica para adjuntos (Fotos o Vídeos)
    if (file && mimeType) {
      // Limpiamos el base64 por si acaso
      const base64Data = file.includes(',') ? file.split(',')[1] : file;
      
      displayParts.push({
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      });
    }

    // Generar respuesta
    const result = await model.generateContent(displayParts);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ text: text });

  } catch (error) {
    console.error("Error técnico en Airi:", error);
    // Mensaje de error detallado para saber qué falla exactamente
    return res.status(500).json({ 
      text: "Airi ha tenido un problema técnico: " + error.message + ". Por favor, inténtalo de nuevo." 
    });
  }
};

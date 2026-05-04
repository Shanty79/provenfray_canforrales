const { GoogleGenerativeAI } = require("@google/generative-ai");

// Inicialización segura del motor
const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Solo POST');

  // Si la API Key no está configurada en Vercel
  if (!genAI) {
    return res.status(500).json({ 
      text: "⚠️ **Error de Configuración**: No he encontrado la API Key en el servidor. Revisa las variables de entorno en Vercel." 
    });
  }

  const { prompt, file, mimeType } = req.body;

  try {
    // Usamos el modelo Flash para velocidad y análisis visual
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const promptPrincipal = prompt || "Analiza este contenido de bádminton.";
    const displayParts = [promptPrincipal];

    // Procesamiento de archivos (Imagen o Vídeo)
    if (file && mimeType) {
      const base64Data = file.split(',')[1] || file;
      displayParts.push({
        inlineData: { data: base64Data, mimeType: mimeType }
      });
    }

    const result = await model.generateContent(displayParts);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ text: text });

  } catch (error) {
    console.error("Error en Airi Core:", error);
    // Error específico si el archivo es demasiado grande o la API falla
    return res.status(500).json({ 
      text: "Airi ha tenido un problema técnico al procesar esto. ¿Podrías intentar enviarlo de nuevo o revisar si el archivo es muy pesado?" 
    });
  }
};

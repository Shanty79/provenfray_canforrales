const { GoogleGenerativeAI } = require("@google/generative-ai");

// Inicializamos el motor de Airi
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Solo POST');

  const { prompt, file, mimeType } = req.body;

  try {
    // Usamos Gemini 3 Flash: Multimodal nativo (Texto, Imagen, Vídeo)
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash" });

    const promptPrincipal = prompt || "Analiza técnicamente este contenido de bádminton.";
    const displayParts = [promptPrincipal];

    // Si hay un archivo (Foto o Vídeo), lo preparamos como parte del mensaje
    if (file && mimeType) {
      // El archivo viene en Base64, quitamos el prefijo si existe
      const base64Data = file.split(',')[1] || file;
      
      displayParts.push({
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      });
    }

    // Generamos la respuesta técnica
    const result = await model.generateContent(displayParts);
    const response = await result.response;
    const text = response.text();

    // Enviamos el análisis a la interfaz
    return res.status(200).json({ text: text });

  } catch (error) {
    console.error("Error en Airi Core:", error);
    return res.status(500).json({ 
      text: "Lo siento, mi sistema de análisis visual ha tenido un tropiezo. ¿Puedes intentar subir el archivo de nuevo?" 
    });
  }
};

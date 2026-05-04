const { GoogleGenerativeAI } = require("@google/generative-ai");

// Ahora usamos el nombre exacto que tienes en Vercel
const apiKey = process.env.GOOGLE_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Solo POST');

  if (!genAI) {
    return res.status(500).json({ 
      text: "⚠️ **Error**: No se encuentra la llave 'GOOGLE_API_KEY' en Vercel." 
    });
  }

  const { prompt, file, mimeType } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const promptPrincipal = prompt || "Analiza técnicamente este contenido de bádminton.";
    const displayParts = [promptPrincipal];

    if (file && mimeType) {
      const base64Data = file.includes(',') ? file.split(',')[1] : file;
      displayParts.push({
        inlineData: { data: base64Data, mimeType: mimeType }
      });
    }

    const result = await model.generateContent(displayParts);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ text: text });

  } catch (error) {
    console.error("Error en Airi:", error);
    return res.status(500).json({ 
      text: "Airi ha tenido un problema técnico: " + error.message
    });
  }
};

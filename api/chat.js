export default async function handler(req, res) {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ text: "Error: No hay API Key." });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const prompt = body.prompt || "Hola";

    // Llamamos directamente a la URL de Google sin usar librerías intermedias
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Eres un experto en bádminton. " + prompt }] }]
        })
      }
    );

    const data = await response.json();

    // Si Google nos da un error, lo mostramos
    if (data.error) {
      return res.status(500).json({ text: "Error de Google: " + data.error.message });
    }

    // Extraemos el texto de la respuesta
    const botText = data.candidates[0].content.parts[0].text;
    res.status(200).json({ text: botText });

  } catch (error) {
    res.status(500).json({ text: "Error de conexión: " + error.message });
  }
}

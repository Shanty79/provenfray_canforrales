export default async function handler(req, res) {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ text: "Error: No hay API Key en Vercel." });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const prompt = body.prompt || "Hola";

    // CAMBIO CLAVE: Usamos 'v1' en lugar de 'v1beta'
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: "Eres un entrenador experto en bádminton para niños. Responde a: " + prompt }]
        }]
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ text: "Error de Google: " + data.error.message });
    }

    // Respuesta segura
    if (data.candidates && data.candidates[0].content) {
      const botText = data.candidates[0].content.parts[0].text;
      res.status(200).json({ text: botText });
    } else {
      res.status(500).json({ text: "Google no devolvió una respuesta válida." });
    }

  } catch (error) {
    res.status(500).json({ text: "Error de conexión: " + error.message });
  }
}

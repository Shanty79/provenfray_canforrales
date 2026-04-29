export default async function handler(req, res) {
  const apiKey = process.env.GOOGLE_API_KEY;
  
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const prompt = body.prompt || "Hola";

    // Usamos la URL que Google garantiza para el nivel gratuito
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    
    if (data.candidates && data.candidates[0].content) {
      return res.status(200).json({ text: data.candidates[0].content.parts[0].text });
    } else {
      return res.status(500).json({ text: "Error: " + (data.error ? data.error.message : "Respuesta vacía") });
    }
  } catch (error) {
    return res.status(500).json({ text: "Error de red: " + error.message });
  }
}

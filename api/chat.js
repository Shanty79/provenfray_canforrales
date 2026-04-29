export default async function handler(req, res) {
  const apiKey = process.env.GOOGLE_API_KEY;
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Eres un experto en bádminton. Responde breve: " + body.prompt }] }]
        })
      }
    );

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Lo siento, no pude procesar eso.";
    res.status(200).json({ text });
  } catch (error) {
    res.status(500).json({ text: "Error de conexión con el entrenador." });
  }
}

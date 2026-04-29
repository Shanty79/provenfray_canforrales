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
          contents: [{ parts: [{ text: "Responde como entrenador de bádminton brevemente: " + body.prompt }] }]
        })
      }
    );

    const data = await response.json();
    
    // Si Google responde con un error, lo mostramos directamente para saber qué es
    if (data.error) {
      return res.status(200).json({ text: "Error de Google: " + data.error.message });
    }

    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Respuesta vacía de la IA.";
    res.status(200).json({ text: resultText });

  } catch (error) {
    res.status(500).json({ text: "Error de conexión: " + error.message });
  }
}

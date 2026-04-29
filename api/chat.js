export default async function handler(req, res) {
  const apiKey = process.env.GOOGLE_API_KEY;
  const body = req.body;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Eres un entrenador de bádminton experto. Responde de forma clara y breve a esto: " + body.prompt }] }]
        })
      }
    );

    const data = await response.json();
    
    // Mejoramos la captura del texto para evitar el "No pude procesar eso"
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "La IA recibió el mensaje pero no generó texto. Revisa tu cuota en Google Cloud.";
    
    res.status(200).json({ text });
  } catch (error) {
    res.status(500).json({ text: "Error en la conexión con el servidor de bádminton." });
  }
}

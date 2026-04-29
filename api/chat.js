export default async function handler(req, res) {
  const apiKey = process.env.GOOGLE_API_KEY;
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

  try {
    // Cambiamos a gemini-1.5-pro y versión v1 estable
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ 
              text: "Eres Fray-Smash, asistente del Club ProvenFray. Responde corto: " + body.prompt 
            }] 
          }]
        })
      }
    );

    const data = await response.json();
    
    // Esto nos dirá el error real si falla
    if (data.error) {
      return res.status(200).json({ text: "Error real: " + data.error.message });
    }

    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sin respuesta.";
    res.status(200).json({ text: resultText });

  } catch (error) {
    res.status(500).json({ text: "Error de red: " + error.message });
  }
}

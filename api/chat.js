export default async function handler(req, res) {
  const apiKey = process.env.GOOGLE_API_KEY;
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

  try {
    // Cambiamos a v1beta que es la que admite gemini-1.5-flash sin problemas
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ 
              text: "Tu nombre es Fray-Smash: Asistente IA. Eres el experto entrenador del Club ProvenFray Canforrales. Responde de forma muy breve y motivadora. Pregunta: " + body.prompt 
            }] 
          }]
        })
      }
    );

    const data = await response.json();
    
    if (data.error) {
      return res.status(200).json({ text: "Aviso técnico: " + data.error.message });
    }

    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || "¡Fallo en el servicio! ¿Repetimos el punto?";
    res.status(200).json({ text: resultText });

  } catch (error) {
    res.status(500).json({ text: "Error de conexión: " + error.message });
  }
}

export default async function handler(req, res) {
  const apiKey = process.env.GOOGLE_API_KEY;
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ 
              text: "Tu nombre es Fray-Smash: Asistente IA. Eres el experto entrenador del Club ProvenFray Canforrales. Responde de forma breve y motivadora a esta pregunta sobre bádminton: " + body.prompt 
            }] 
          }]
        })
      }
    );

    const data = await response.json();
    
    // Capturamos la respuesta de texto de Google
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "¡Fallo en el servicio! No pude procesar el golpe. ¿Repetimos el punto?";
    
    res.status(200).json({ text });
  } catch (error) {
    res.status(500).json({ text: "Error crítico en los servidores de Fray-Smash." });
  }
}

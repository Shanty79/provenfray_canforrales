export default async function handler(req, res) {
  const apiKey = process.env.GOOGLE_API_KEY;
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

  try {
    // Usamos v1 como tú comprobaste que funcionaba
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ 
              text: "Tu nombre es Fray-Smash: Asistente IA. Eres el experto entrenador del Club ProvenFray Canforrales. Responde de forma breve y motivadora a: " + body.prompt 
            }] 
          }]
        })
      }
    );

    const data = await response.json();
    
    // Si hay respuesta, la extraemos; si no, damos el aviso de bádminton
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || "¡Fallo en el servicio! No pude procesar el golpe. ¿Repetimos el punto?";
    
    res.status(200).json({ text: resultText });
  } catch (error) {
    res.status(500).json({ text: "Error crítico en el servidor de Fray-Smash." });
  }
}

export default async function handler(req, res) {
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ text: "Falta la API Key en Vercel." });
  }

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
              text: "Tu nombre es Fray-Smash: Asistente IA. Eres el experto entrenador del Club ProvenFray Canforrales. Responde de forma breve y motivadora. Pregunta: " + body.prompt 
            }] 
          }]
        })
      }
    );

    const data = await response.json();
    
    // Si Google devuelve un error, lo capturamos aquí
    if (data.error) {
      console.error("Error de Google:", data.error);
      return res.status(200).json({ text: "¡Ouch! Mi conexión con la red ha fallado. Revisa la API Key." });
    }

    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No he podido procesar ese golpe, ¿repetimos?";
    res.status(200).json({ text: resultText });

  } catch (error) {
    res.status(500).json({ text: "Error crítico en los servidores de Fray-Smash." });
  }
}

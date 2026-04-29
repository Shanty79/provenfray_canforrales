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
              text: "Tu nombre es Fray-Smash: Asistente IA. Eres el experto entrenador virtual del Club de Bádminton ProvenFray Canforrales. Tus respuestas deben ser motivadoras, profesionales y breves. Usa términos de bádminton (saque, mate, dejarada, etc.) cuando sea apropiado. Pregunta: " + body.prompt 
            }] 
          }]
        })
      }
    );

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || "¡Fallo en el servicio! No pude procesar el golpe. ¿Repetimos el punto?";
    
    res.status(200).json({ text: resultText });
  } catch (error) {
    res.status(500).json({ text: "Error en el servidor central de ProvenFray." });
  }
}

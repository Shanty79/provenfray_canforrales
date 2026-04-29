export default async function handler(req, res) {
  const apiKey = process.env.GOOGLE_API_KEY;
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

  try {
    // Usamos 'gemini-1.5-flash-latest' que es la versión más compatible actualmente
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ 
              text: "Eres Fray-Smash, asistente del Club ProvenFray. Responde de forma breve: " + body.prompt 
            }] 
          }]
        })
      }
    );

    const data = await response.json();
    
    if (data.error) {
      return res.status(200).json({ text: "Aviso: " + data.error.message });
    }

    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No pude responder, intenta otra vez.";
    res.status(200).json({ text: resultText });

  } catch (error) {
    res.status(500).json({ text: "Error de red: " + error.message });
  }
}

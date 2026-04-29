export default async function handler(req, res) {
  const apiKey = process.env.GOOGLE_API_KEY;
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

  try {
    // Usamos el modelo 'gemini-pro' (v1.0), que es el que tiene máxima compatibilidad
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ 
              text: "Eres Fray-Smash, el asistente oficial del Club ProvenFray. Responde de forma muy breve y motivadora: " + body.prompt 
            }] 
          }]
        })
      }
    );

    const data = await response.json();
    
    // Si Google nos da un error, esta vez sabremos exactamente qué palabra falla
    if (data.error) {
      return res.status(200).json({ text: "Nota técnica: " + data.error.message });
    }

    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || "¡Fallo en el saque! Intenta preguntar de nuevo.";
    res.status(200).json({ text: resultText });

  } catch (error) {
    res.status(500).json({ text: "Error de conexión: " + error.message });
  }
}

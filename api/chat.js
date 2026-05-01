module.exports = async (req, res) => {
  const apiKey = process.env.GOOGLE_API_KEY;
  const userPrompt = req.body.prompt || req.body.message || "Hola, preséntate";

  try {
    const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ text: "Eres Fray-Smash, entrenador de bádminton. Responde a: " + userPrompt }] 
          }]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(200).json({ text: "Google dice: " + (data.error?.message || "Error desconocido") });
    }

    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No tengo respuesta.";
    res.status(200).json({ text: resultText });

  } catch (error) {
    res.status(200).json({ text: "Error de conexión: " + error.message });
  }
};

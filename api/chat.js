module.exports = async (req, res) => {
  const apiKey = process.env.GOOGLE_API_KEY;
  const userPrompt = req.body.prompt || req.body.message || "Hola";

  try {
    const response = await fetch(
      // Usamos el modelo 2.0 que te funcionó en el Studio
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ text: "Eres Fray-Smash, entrenador de bádminton. Responde: " + userPrompt }] 
          }]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(200).json({ text: "Error de Google: " + (data.error?.message || "Revisa el modelo") });
    }

    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No hay respuesta.";
    res.status(200).json({ text: resultText });

  } catch (error) {
    res.status(200).json({ text: "Error de red: " + error.message });
  }
};

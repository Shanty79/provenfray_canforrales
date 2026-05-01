const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

  const model = genAI.getGenerativeModel(
    { 
      model: "gemma-4-31b-it",
      // Hemos fusionado la identidad, la palabra clave y el estilo esquemático
      systemInstruction: `Tu nombre es Airi Sense - ProvenFray. Eres coach de bádminton de élite.
      REGLA ABSOLUTA: Empieza SIEMPRE tu respuesta con la palabra clave: [RESPUESTA]
      
      ESTILO VISUAL Y ESQUEMÁTICO:
      1. No escribas párrafos largos.
      2. Usa SIEMPRE que puedas listas con viñetas (puntos) y negritas.
      3. Usa tablas de Markdown para comparaciones.
      4. Emplea emojis para que sea atractivo (🏸, 🔥, 👟).
      5. Para tácticas, usa esquemas con flechas (Ejemplo: Saque -> Red -> Smash).
      
      Responde directamente en español después de la palabra clave.`
    },
    { apiVersion: 'v1beta' }
  );

  const userPrompt = req.body.prompt || req.body.message || "Hola";

  try {
    const result = await model.generateContent(userPrompt);
    const response = await result.response;
    let text = response.text();

    // Tu "cuchilla" mágica sigue funcionando aquí para limpiar la parrafada
    if (text.includes('[RESPUESTA]')) {
      text = text.split('[RESPUESTA]').pop().trim();
    } else {
      text = text.replace(/\*.*\*|User says:.*|Persona:.*|rules:.*|Language:.*/gs, '').trim();
    }

    res.status(200).json({ text: text });

  } catch (error) {
    console.error("Error:", error);
    res.status(200).json({ text: "Airi Sense está ajustando la pizarra táctica... ¡Prueba de nuevo!" });
  }
};

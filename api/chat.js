const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

  const model = genAI.getGenerativeModel(
    { 
      model: "gemma-4-31b-it",
      systemInstruction: `Tu nombre es Airi Sense - ProvenFray. Eres una coach de bádminton de élite.
      REGLA CRÍTICA: No expliques tu razonamiento ni des opciones. 
      Escribe tu respuesta final directamente. No uses etiquetas de metadatos.`
    },
    { apiVersion: 'v1beta' }
  );

  const userPrompt = req.body.prompt || req.body.message || "Hola";

  try {
    const result = await model.generateContent(userPrompt);
    const response = await result.response;
    let text = response.text();

    // --- FILTRO DE LIMPIEZA DEFINITIVO ---
    // Si la IA se pone a divagar y pone "Option 1", "User says", etc., 
    // este código intenta quedarse solo con la última frase o la parte más relevante.
    if (text.includes('Option 3:')) {
      text = text.split('Option 3:').pop();
    } else if (text.includes('¡Hola')) {
       // Si hay varios "¡Hola!", nos quedamos con el último que suele ser la respuesta final
       const parts = text.split('¡Hola');
       text = '¡Hola' + parts.pop();
    }
    
    // Limpieza final de posibles asteriscos o restos de etiquetas
    const cleanText = text.replace(/\* My persona:.*|\* Tone:.*|\* User says:.*/gs, '').trim();

    res.status(200).json({ text: cleanText || "¡Hola! Soy Airi Sense. ¿En qué entrenamos hoy?" });

  } catch (error) {
    console.error("Error:", error);
    res.status(200).json({ text: "Airi Sense está analizando la jugada... Intenta de nuevo." });
  }
};

const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

  const model = genAI.getGenerativeModel(
    { 
      model: "gemma-4-31b-it",
      systemInstruction: `Tu nombre es Airi Sense. Eres coach de bádminton.
      REGLA ABSOLUTA: Empieza con [RESPUESTA].
      
      FORMATO DE TEXTO (MUY IMPORTANTE):
      1. NO USES TABLAS DE MARKDOWN (tu web no las lee).
      2. NO USES NEGRILLAS CON ASTERISCOS (**).
      3. NO USES LATEX ni símbolos como $ o \\.
      4. USA SIEMPRE DOBLE SALTO DE LÍNEA entre cada punto para que no salga todo junto.
      5. USA EMOJIS para las flechas (➡️) y puntos (🔹).
      
      Ejemplo de estructura:
      TITULO EN MAYÚSCULAS
      
      🔹 Punto uno...
      
      🔹 Punto dos...
      
      CONSEJO FINAL.`
    },
    { apiVersion: 'v1beta' }
  );

  const userPrompt = req.body.prompt || req.body.message || "Hola";

  try {
    const result = await model.generateContent(userPrompt);
    const response = await result.response;
    let text = response.text();

    if (text.includes('[RESPUESTA]')) {
      text = text.split('[RESPUESTA]').pop().trim();
    }

    // Eliminamos manualmente cualquier residuo de asteriscos que la IA ponga por costumbre
    const finalCleanText = text.replace(/\*\*/g, '').trim();

    res.status(200).json({ text: finalCleanText });

  } catch (error) {
    res.status(200).json({ text: "Airi Sense está ajustando la red... ¡Prueba de nuevo!" });
  }
};

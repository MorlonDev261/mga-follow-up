import db from '@/lib/db';

export const POST = async (req: Request) => {
  try {
    const { message } = await req.json();

    if (!message?.trim()) {
      return Response.json({ answer: "Veuillez saisir un message." }, { status: 400 });
    }

    const all = await db.assistantContext.findMany();
    if (!all || all.length === 0) {
      return Response.json({ answer: "Aucun contexte trouvé. Veuillez ajouter des questions et réponses." }, { status: 500 });
    }

    const context = all.map(item => `Q: ${item.question}\nR: ${item.answer}`).join("\n\n");

    const systemPrompt = `
      You are Degany, a virtual assistant for the MGA Follow UP app, developed by Morlon.
      You should only respond using the official knowledge base provided below.

      ---

      AUTHORIZED KNOWLEDGE:
      ${context}

      ---

      STRICT INSTRUCTIONS:
      - Use existing answers if a match is found.
      - If no match is found, respond with: "I'm really sorry, I don’t have that information right now, but I was created by Morlon to assist with the MGA Follow UP app. Let me know if I can help with anything else!" Feel free to adjust this sentence to make it sound more friendly or natural.
      - Always respond in the same language as the user.
      - Do not offer solutions outside of the knowledge base or share personal opinions.`;
    

    const response = await fetch("https://api.together.xyz/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.TOGETHER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistralai/Mistral-7B-Instruct-v0.1",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Erreur API Together: ${response.status}`);
    }

    const data = await response.json();
    const answer = data?.choices?.[0]?.message?.content || "Je suis développé par MGA Follow UP pour vous assister uniquement.";
    console.log("Réponse de l'API Together:", answer);
    return Response.json({ answer });

  } catch (error) {
    console.error('Erreur:', error);
    return Response.json({ answer: "Une erreur est survenue. Veuillez réessayer plus tard." }, { status: 500 });
  }
};

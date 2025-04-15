import { getSimilarContext } from '@/utils/vectorizer';

export const POST = async (req: Request) => {
  const { message } = await req.json();
  const context = await getSimilarContext(message);

  if (!process.env.TOGETHER_API_KEY) {
    return new Response("Clé API manquante", { status: 500 });
  }

  const response = await fetch("https://api.together.xyz/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.TOGETHER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "mistralai/Mistral-7B-Instruct-v0.1",
      messages: [
        {
          role: "system",
          content: `Tu es Degany, l'assistant officiel de l'application MGA Follow Up.
Tu réponds uniquement selon ce contexte :

${context}

Si ce n’est pas pertinent, tu dis : “Je suis développé par MGA Follow UP pour vous assister uniquement dans le cadre de l’application. Alors, que puis-je faire pour vous à propos de MGA Follow UP ?”

Termine toujours ta réponse par : “— Degany, votre assistant MGA”`
        },
        { role: "user", content: message }
      ]
    })
  });

  const data = await response.json();
  const answer = data?.choices?.[0]?.message?.content?.trim() || "Je ne suis pas autorisé à répondre à cela.";
  return Response.json({ answer });
};

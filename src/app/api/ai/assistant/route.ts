import { getSimilarContext } from '@/utils/vectorizer';

export const POST = async (req: Request) => {
  const { message } = await req.json();
  const context = await getSimilarContext(message);

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
          content: `Tu es Degany, assistant de l'app MGA Follow Up. Tu réponds uniquement selon ce contexte :\n${context}\n\nSi ce n’est pas pertinent, dis : “Je ne suis pas autorisé à répondre à cela.” Termine toujours par “— Degany, votre assistant MGA”.`
        },
        { role: "user", content: message }
      ]
    })
  });

  const data = await response.json();
  const answer = data.choices?.[0]?.message?.content || "Je ne suis pas autorisé à répondre à cela.";
  return Response.json({ answer });
};

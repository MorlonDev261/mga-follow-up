import db from '@/lib/db';

export const POST = async (req: Request) => {
  const { message } = await req.json();
  const all = await db.assistantContext.findMany();

  const context = all
    .map(item => `Q: ${item.question}\nR: ${item.answer}`)
    .join("\n\n");

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
          content: `Tu es Degany, assistant de l’application MGA Follow UP. Voici les connaissances que tu peux utiliser :\n${context}\n\nTu réponds uniquement selon cela. Termine chaque réponse par “— Degany, votre assistant MGA”.`
        },
        { role: "user", content: message }
      ]
    })
  });

  const data = await response.json();
  const answer = data.choices?.[0]?.message?.content || "Je suis développé par MGA Follow UP pour vous assister seulement,  alors que puis-je faire pour à propos de l’app MGA Follow UP ?";
  return Response.json({ answer });
};

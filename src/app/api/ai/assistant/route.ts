export const POST = async (req: Request) => {
  const { message } = await req.json();

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
          content: `
Tu es Degany, l’assistant exclusif de l’application MGA Follow Up.
Tu n’as accès qu’aux informations fournies dans ce contexte. Tu ne connais pas le monde extérieur.
Si une question sort du cadre de l’application, tu réponds : “Je ne suis pas autorisé à répondre à cela.”
Ton ton est professionnel, calme, empathique et clair.
Termine toujours tes réponses par : “— Degany, votre assistant MGA”.
          `
        },
        {
          role: "user",
          content: message
        }
      ]
    })
  });

  const data = await response.json();
  const answer = data.choices?.[0]?.message?.content || "Je ne suis pas autorisé à répondre à cela.";

  return Response.json({ answer });
};

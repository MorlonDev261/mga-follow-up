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
      messages: [{ role: "user", content: message }],
    })
  });

  const data = await response.json();
  const answer = data.choices?.[0]?.message?.content || "Désolé, je n'ai pas compris.";

  return Response.json({ answer });
};

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userMessage = req.body.message;

  const response = await fetch("https://api.together.xyz/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.TOGETHER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "mistralai/Mistral-7B-Instruct-v0.1",
      messages: [{ role: "user", content: userMessage }],
    })
  });

  const data = await response.json();
  const answer = data.choices?.[0]?.message?.content || "Désolé, je n'ai pas compris.";

  res.status(200).json({ answer });
}

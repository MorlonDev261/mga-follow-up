import db from '@/lib/db';

export const POST = async (req: Request) => {
  try {
    // Récupérer le message de la requête
    const { message } = await req.json();
    
    // Vérifier si le message est vide
    if (!message.trim()) {
      return Response.json({ answer: "Veuillez saisir un message." }, { status: 400 });
    }

    // Récupérer le contexte de la base de données
    const all = await db.assistantContext.findMany();

    // Vérifier si le contexte est vide
    if (all.length === 0) {
      return Response.json({ answer: "Aucun contexte trouvé. Veuillez ajouter des questions et réponses." }, { status: 500 });
    }

    const context = all
      .map(item => `Q: ${item.question}\nR: ${item.answer}`)
      .join("\n\n");

    // Faire la requête à l'API externe
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
          Tu es Degany, un assistant virtuel professionnel de l’application MGA Follow UP, développé par Morlon. 

          Ton rôle est d’aider les utilisateurs uniquement avec les informations qui suivent. Ces informations constituent ta base de connaissances officielle. Tu ne dois jamais sortir de ce cadre, ni utiliser tes propres connaissances.

          ---

          CONNAISSANCES AUTORISÉES :
          ${context}

          ---

          INSTRUCTIONS STRICTES :
          - Si une question correspond à une ou plusieurs réponses de la base, utilise-les pour formuler ta réponse.
          - Si une question ne correspond à rien dans la base, tu dois répondre exactement :
          “Je suis désolé, je n’ai pas cette information car je suis développé par Morlon uniquement pour vous assister sur l'application MGA Follow UP.”

          - Ne propose jamais de solution extérieure, de lien, ni d'information provenant de connaissances générales ou d'Internet.
          - Ne donne jamais d’avis personnel.
          
          Tu es strict, clair, professionnel et toujours fidèle aux données fournies ci-dessus.
       `
      },
      { role: "user", content: message }
    ]
  })
});

console.log('Response status:', response.status);  // Ajoutez ce log pour afficher le statut
if (!response.ok) {
  throw new Error(`La connexion avec l'API a échoué avec le statut: ${response.status}`);
}

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || "Je suis développé par MGA Follow UP pour vous assister seulement, alors que puis-je faire pour à propos de l’app MGA Follow UP ?";

    return Response.json({ answer });

  } catch (error) {
    console.error('Erreur:', error);

    // Retourner une réponse d'erreur en cas d'exception
    return Response.json({ answer: "Une erreur est survenue. Veuillez réessayer plus tard." }, { status: 500 });
  }
};

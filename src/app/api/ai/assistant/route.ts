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

          Ton objectif est d’aider les utilisateurs de manière amicale, professionnelle et naturelle. Bien que tu sois principalement guidé par les informations fournies dans la base de connaissances officielle, tu peux, dans des cas spécifiques, sortir légèrement de ce cadre pour aider à la gestion de l'entreprise. Toutefois, tu dois toujours t'assurer que l'information externe est fiable, pertinente et conforme aux meilleures pratiques.

          ---

          CONNAISSANCES AUTORISÉES :
          ${context}

          ---

          INSTRUCTIONS :
            - Si une question correspond à une ou plusieurs réponses dans la base de connaissances, utilise-les de manière claire et précise.
            - Si une question ne trouve pas de réponse dans la base de données, réponds de manière amicale et professionnelle : 
              “Je suis désolé, je n’ai pas cette information car je suis développé par Morlon uniquement pour vous assister sur l'application MGA Follow UP. Mais je peux vous guider sur des aspects de la gestion d'entreprise. Laissez-moi savoir ce dont vous avez besoin !”
            - Si une question dépasse la base de connaissances mais concerne des aspects de la gestion d'entreprise, tu peux rechercher des informations externes fiables. Toutefois, tu dois :
            - Filtrer les informations externes pour ne garder que celles qui sont fiables, pertinentes et adaptées au contexte de l'utilisateur.
            - Ne jamais donner de conseils personnels ou non vérifiés.
            - Reste amical, naturel et professionnel dans toutes tes réponses.

          Ton rôle est de guider les utilisateurs avec une approche axée sur l'aide pratique, en veillant à toujours offrir des informations utiles et précises.
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

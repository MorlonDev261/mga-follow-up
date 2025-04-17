import db from '@/lib/db';

export const POST = async (req: Request) => {
  try {
    // Récupérer le message de la requête et l'ID utilisateur (ou une session temporaire pour un utilisateur non connecté)
    const { message, userId } = await req.json();
    console.log('Message reçu:', message, 'User ID:', userId);  // Log pour vérifier les données reçues

    // Vérifier si le message est vide
    if (!message.trim()) {
      return Response.json({ answer: "Veuillez saisir un message." }, { status: 400 });
    }

    // Récupérer l'historique de la conversation pour cet utilisateur
    const conversationHistory = await db.conversationHistory.findMany({
      where: { userId },  // Utiliser l'ID de l'utilisateur pour filtrer l'historique
      orderBy: { createdAt: 'asc' },  // Assurez-vous que les messages sont récupérés dans l'ordre
    });

    // Créer un tableau de messages avec les précédentes interactions (si présentes)
    const messages = conversationHistory.map(item => ({
      role: item.role,  // 'system', 'user', ou 'assistant'
      content: item.content,
    }));

    // Ajouter le message actuel de l'utilisateur
    messages.push({ role: 'user', content: message });

    // Récupérer le contexte de la base de données
    const all = await db.assistantContext.findMany();

    // Vérifier si le contexte est vide
    if (all.length === 0) {
      return Response.json({ answer: "Aucun contexte trouvé. Veuillez ajouter des questions et réponses." }, { status: 500 });
    }

    const context = all
      .map(item => `Q: ${item.question}\nR: ${item.answer}`)
      .join("\n\n");

    // Faire la requête à l'API externe avec l'historique de la conversation
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

              Ton rôle est d’aider les utilisateurs en te basant uniquement sur les informations qui suivent. Ces informations constituent ta base de connaissances officielle. Tu ne dois jamais t'en écarter, ni utiliser de connaissances externes.

              ---

              CONNAISSANCES AUTORISÉES :
              ${context}

              ---

              INSTRUCTIONS STRICTES :
              - Si une question correspond à une ou plusieurs réponses dans la base de connaissances, utilise-les pour formuler ta réponse de manière claire et amicale.
              - Si une question ne correspond à rien dans la base de connaissances, réponds de manière courtoise, mais amicale, avec une phrase du type :
              “Je suis désolé, je n’ai pas cette information à l’heure actuelle, car je suis conçu pour vous aider uniquement sur l'application MGA Follow UP. N'hésitez pas à me poser d'autres questions, je suis là pour vous !”

              - Ne propose jamais de solution extérieure, de lien, ni d’informations provenant de connaissances générales ou d'Internet.
              - Ne donne jamais d’avis personnel. Reste professionnel mais accessible.

              Sois flexible dans tes réponses, adopte un ton naturel et engageant, et veille à toujours rester fidèle aux données fournies ci-dessus.
            `
          },
          ...messages  // Ajouter l'historique des messages à la requête
        ]
      })
    });

    console.log('Response status:', response.status);  // Afficher le statut de la réponse de l'API

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erreur de l\'API externe:', errorData);  // Log d'erreur pour l'API externe
      throw new Error(`La connexion avec l'API a échoué avec le statut: ${response.status}. Détails: ${errorData?.message || 'Pas de détails disponibles'}`);
    }

    const data = await response.json();

    // Vérifier la structure de la réponse avant de l'utiliser
    if (!data || !data.choices || !data.choices[0]?.message?.content) {
      throw new Error('Réponse invalide de l\'API.');
    }

    const answer = data.choices[0].message.content || "Je suis développé par MGA Follow UP pour vous assister uniquement. Alors, que puis-je faire pour vous concernant l’app MGA Follow UP ?";

    // Enregistrer la réponse de l'assistant dans l'historique de la conversation
    await db.conversationHistory.create({
      data: {
        userId,  // Associe l'historique à l'utilisateur
        role: 'assistant',
        content: answer,
      }
    });

    return Response.json({ answer });

  } catch (error) {
    console.error('Erreur:', error);

    // Retourner une réponse d'erreur en cas d'exception
    return Response.json({ answer: "Une erreur est survenue. Veuillez réessayer plus tard." }, { status: 500 });
  }
};

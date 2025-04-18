import db from '@/lib/db';
import { auth } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  try {
    // Authentification de l'utilisateur
    const session = await auth();
    const existingCookie = req.cookies.get('userId')?.value;
    let userId = session?.user?.id || existingCookie;

    // Génération d'un nouveau userId si nécessaire
    if (!userId) {
      userId = uuidv4();
    }

    // Récupération du message de la requête
    const { message } = await req.json();

    // Validation du message
    if (!message.trim()) {
      return NextResponse.json({ answer: "Veuillez saisir un message." }, { status: 400 });
    }

    // Récupération des contextes d'assistant depuis la base de données
    const all = await db.assistantContext.findMany();
    if (all.length === 0) {
      return NextResponse.json({ answer: "Aucun contexte trouvé. Veuillez ajouter des questions et réponses." }, { status: 500 });
    }

    // Construction du contexte pour l'assistant
    const context = all
      .map(item => `Q: ${item.question}\nR: ${item.answer}`)
      .join("\n\n");

    // Appel à l'API de chat pour obtenir une réponse de l'assistant
    const response = await fetch("https://api.together.xyz/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
        "Content-Type": "application/json",
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
          { role: "user", content: message },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`La connexion avec l'API a échoué avec le statut: ${response.status}`);
    }

    // Traitement de la réponse de l'API
    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content ||
                   "Je suis développé par MGA Follow UP pour vous assister seulement, alors que puis-je faire pour à propos de l’app MGA Follow UP ?";

    // Enregistrement de l'historique de la conversation dans la base de données
     await db.conversationHistory.createMany({
      data: [
        { userId, role: "user", content: message },
        { userId, role: "assistant", content: answer },
      ],
    });

    // Réponse à l'utilisateur avec la réponse de l'assistant
    const res = NextResponse.json({ answer });

    // Définir le cookie si c'était un nouveau userId
    if (!session?.user?.id && !existingCookie) {
      res.cookies.set('userId', userId, {
        path: '/',
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 365,
      });
    }

    return res;
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ answer: "Une erreur est survenue. Veuillez réessayer plus tard." }, { status: 500 });
  }
};

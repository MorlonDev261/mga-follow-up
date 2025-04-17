import { auth } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';
import db from '@/lib/db';
import * as cookie from 'cookie';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  try {
    // Récupérer la session NextAuth de l'utilisateur
    const session = await auth();

    // Si l'utilisateur est authentifié, utiliser son `userId`
    let userId = session?.user?.id;

    // Si l'utilisateur n'est pas authentifié (session absente ou ID manquant), générer un UUID
    if (!userId) {
      userId = uuidv4();  // Générer un identifiant unique
      // Ajouter le cookie avec l'ID utilisateur
      const response = NextResponse.next();  // Utiliser NextResponse pour créer la réponse
      response.cookies.set('userId', userId, { path: '/', httpOnly: true, maxAge: 60 * 60 * 24 * 365 }); // 1 an
      console.log(`Utilisateur non authentifié, ID généré: ${userId}`);
    }

    // Récupérer le message de la requête
    const { message } = await req.json();

    // Vérifier si le message est vide
    if (!message.trim()) {
      return NextResponse.json({ answer: "Veuillez saisir un message." }, { status: 400 });
    }

    // Récupérer l'historique de la conversation pour cet utilisateur
    const conversationHistory = await db.conversationHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });

    // Créer un tableau de messages avec les précédentes interactions (si présentes)
    const messages = conversationHistory.map(item => ({
      role: item.role,
      content: item.content,
    }));

    messages.push({ role: 'user', content: message });

    // Récupérer le contexte de la base de données
    const all = await db.assistantContext.findMany();
    if (all.length === 0) {
      return NextResponse.json({ answer: "Aucun contexte trouvé. Veuillez ajouter des questions et réponses." }, { status: 500 });
    }

    const context = all.map(item => `Q: ${item.question}\nR: ${item.answer}`).join("\n\n");

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
              - Si une question ne correspond à rien dans la base de connaissances, réponds de manière courtoise, mais amicale.
            `
          },
          ...messages  // Ajouter l'historique des messages à la requête
        ]
      })
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erreur API externe:', errorData);
      throw new Error(`La connexion avec l'API a échoué avec le statut: ${response.status}. Détails: ${errorData?.message || 'Pas de détails disponibles'}`);
    }

    const data = await response.json();
    if (!data || !data.choices || !data.choices[0]?.message?.content) {
      throw new Error('Réponse invalide de l\'API externe.');
    }

    const answer = data.choices[0].message.content || "Je suis ici pour vous assister dans l'application MGA Follow UP.";

    // Enregistrer la réponse dans l'historique de la conversation pour l'utilisateur
    await db.conversationHistory.create({
      data: {
        userId,  // Associe l'historique à l'utilisateur
        role: 'assistant',
        content: answer,
      }
    });

    return NextResponse.json({ answer });

  } catch (error) {
    console.error('Erreur:', error);

    // Retourner une réponse d'erreur en cas d'exception
    return NextResponse.json({ answer: `Une erreur est survenue. Détails : ${error.message}` }, { status: 500 });
  }
};

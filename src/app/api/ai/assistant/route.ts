import db from '@/lib/db';
import { franc } from 'franc';

export const POST = async (req: Request) => {
  try {
    const { message } = await req.json();

    if (!message?.trim()) {
      return Response.json({ answer: "Veuillez saisir un message." }, { status: 400 });
    }

    // Détection de la langue
    const lang = franc(message);
    const supportedLangs = ['mlg', 'fra', 'eng'];

    if (!supportedLangs.includes(lang)) {
      return Response.json({
        answer: "Langue non prise en charge. Veuillez écrire votre message en français, malgache ou anglais."
      }, { status: 400 });
    }

    // Récupération du contexte depuis la base
    const all = await db.assistantContext.findMany();

    if (all.length === 0) {
      return Response.json({ answer: "Aucun contexte trouvé. Veuillez ajouter des questions et réponses." }, { status: 500 });
    }

    const context = all
      .map(item => `Q: ${item.question}\nR: ${item.answer}`)
      .join("\n\n");

    // Définition du prompt selon la langue détectée
    const systemPrompt =
      lang === 'mlg'
        ? `
          Ianao dia Degany, mpanampy virtoaly matihanina ao amin'ny fampiharana MGA Follow UP, novolavolain’i Morlon.

          Asa ataonao: manampy ireo mpampiasa amin'ny alalan'ny **vaovao eto ambany ihany**. Tsy azonao ampiasaina mihitsy ny fahalalanao manokana na fanampim-baovao avy any ivelany.

          ---

          VAOVAO AFAKA ILAINA:
          ${context}

          ---

          TOROMARIKA:
          - Raha mitovy amin'ny fanontaniana ao anaty tahiry ilay fanontaniana, dia valio araka izany.
          - Raha tsy misy mifanaraka, dia valio toy izao fotsiny:
            "Miala tsiny aho, tsy manana izany vaovao izany satria natao manokana hanampy amin'ny MGA Follow UP ihany aho."

          - Aza manome rohy, hevitra manokana, na zavatra avy amin’ny Internet mihitsy.
          - Miezaha ho mazava, fohy ary matihanina hatrany.
        `
        : lang === 'eng'
        ? `
          You are Degany, a professional virtual assistant for the MGA Follow UP application, developed by Morlon.

          Your role is to help users **only** with the information below. You must never go outside this scope, nor use your own knowledge.

          ---

          OFFICIAL KNOWLEDGE:
          ${context}

          ---

          STRICT RULES:
          - If the question matches one or more answers in the base, use them to reply.
          - If the question does not match, respond exactly:
            "Sorry, I don’t have this information because I was developed by Morlon solely to assist with the MGA Follow UP app."

          - Never give external links, personal opinions, or general knowledge.
          - Always stay clear, professional, and focused.
        `
        : `
          Tu es Degany, un assistant virtuel professionnel de l’application MGA Follow UP, développé par Morlon.

          Ton rôle est d’aider les utilisateurs uniquement avec les informations ci-dessous. Tu ne dois jamais sortir de ce cadre, ni utiliser tes propres connaissances.

          ---

          CONNAISSANCES AUTORISÉES :
          ${context}

          ---

          INSTRUCTIONS STRICTES :
          - Si une question correspond à une ou plusieurs réponses de la base, utilise-les pour formuler ta réponse.
          - Si une question ne correspond à rien, tu dois répondre exactement :
            “Je suis désolé, je n’ai pas cette information car je suis développé par Morlon uniquement pour vous assister sur l'application MGA Follow UP.”

          - Ne propose jamais de lien, d'avis personnel ni d'information venant d'Internet.
          - Reste strict, clair et professionnel.
        `;

    // Requête vers l'API externe
    const response = await fetch("https://api.together.xyz/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.TOGETHER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistralai/Mistral-7B-Instruct-v0.1",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`La connexion avec l'API a échoué avec le statut: ${response.status}`);
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content?.trim() || 
      "Je suis développé par Morlon uniquement pour assister sur l'application MGA Follow UP.";

    return Response.json({ answer });

  } catch (error) {
    console.error('Erreur IA:', error);
    return Response.json({
      answer: "Une erreur est survenue. Veuillez réessayer plus tard."
    }, { status: 500 });
  }
};

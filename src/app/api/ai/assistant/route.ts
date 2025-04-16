import db from '@/lib/db';
import { detect } from 'langdetect';
import translate from '@vitalets/google-translate-api';

export const POST = async (req: Request) => {
  try {
    const { message } = await req.json();

    if (!message.trim()) {
      return Response.json({ answer: "Veuillez saisir un message." }, { status: 400 });
    }

    const detectedLang = detect(message);
    const supportedLanguages = ['fr', 'en', 'mg'];

    if (!supportedLanguages.includes(detectedLang)) {
      return Response.json({
        answer: "Langue non prise en charge. Veuillez écrire votre message en français, malgache ou anglais."
      }, { status: 400 });
    }

    // Traduire en français si ce n'est pas déjà
    const inputMessage = detectedLang === 'fr'
      ? message
      : (await translate(message, { to: 'fr' })).text;

    const all = await db.assistantContext.findMany();

    if (all.length === 0) {
      return Response.json({
        answer: "Aucun contexte trouvé. Veuillez ajouter des questions et réponses."
      }, { status: 500 });
    }

    const context = all.map(item => `Q: ${item.question}\nR: ${item.answer}`).join("\n\n");

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
Ton rôle est d’aider les utilisateurs uniquement avec les informations suivantes :

---

CONNAISSANCES AUTORISÉES :
${context}

---

INSTRUCTIONS STRICTES :
- Si une question correspond à une ou plusieurs réponses de la base, utilise-les pour formuler ta réponse.
- Si une question ne correspond à rien dans la base, réponds :
“Je suis désolé, je n’ai pas cette information car je suis développé par Morlon uniquement pour vous assister sur l'application MGA Follow UP.”
- Ne propose jamais de solution extérieure, lien ou connaissance générale.
- Sois strict, clair et fidèle aux données ci-dessus.
`
          },
          { role: "user", content: inputMessage }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`La connexion avec l'API a échoué : ${response.status}`);
    }

    const data = await response.json();
    let answer = data.choices?.[0]?.message?.content || "Je suis développé par MGA Follow UP pour vous assister seulement.";

    // Traduire la réponse dans la langue détectée
    if (detectedLang !== 'fr') {
      const translated = await translate(answer, { to: detectedLang });
      answer = translated.text;
    }

    return Response.json({ answer });

  } catch (error) {
    console.error('Erreur:', error);
    return Response.json({ answer: "Une erreur est survenue. Veuillez réessayer plus tard." }, { status: 500 });
  }
};

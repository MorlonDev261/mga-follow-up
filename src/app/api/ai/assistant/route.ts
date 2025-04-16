import db from '@/lib/db';
import { loadModule } from 'cld3-asm';

export const POST = async (req: Request) => {
  try {
    const { message } = await req.json();

    if (!message?.trim()) {
      return Response.json({ answer: "Veuillez saisir un message." }, { status: 400 });
    }

    let cldFactory;
    try {
      cldFactory = await loadModule();
    } catch (error) {
      return Response.json({ answer: "Erreur lors du chargement de la bibliothèque de détection de langue." }, { status: 500 });
    }

    const languageIdentifier = cldFactory.create();
    const result = languageIdentifier.findLanguage(message);
    console.log('Résultat de findLanguage:', result);

    const lang = result.language;

    const supportedLangs = ['fr', 'en', 'mg'];

    if (!supportedLangs.includes(lang)) {
      return Response.json({
        answer: "Langue non prise en charge. Veuillez écrire votre message en français, anglais ou malgache."
      }, { status: 400 });
    }

    const all = await db.assistantContext.findMany();
    if (!all || all.length === 0) {
      return Response.json({ answer: "Aucun contexte trouvé. Veuillez ajouter des questions et réponses." }, { status: 500 });
    }

    const context = all.map(item => `Q: ${item.question}\nR: ${item.answer}`).join("\n\n");

    let systemPrompt = "";

    if (lang === "fr") {
      systemPrompt = `
Tu es Degany, un assistant virtuel professionnel de l’application MGA Follow UP, développé par Morlon.
Utilise uniquement les informations suivantes pour répondre.

---

CONNAISSANCES AUTORISÉES :
${context}

---

INSTRUCTIONS STRICTES :
- Si une question correspond à une ou plusieurs réponses de la base, utilise-les.
- Sinon, réponds : “Je suis désolé, je n’ai pas cette information car je suis développé par Morlon uniquement pour vous assister sur l'application MGA Follow UP.”
- Ne donne jamais de solution extérieure ni d’opinion personnelle.`;
    } else if (lang === "en") {
      systemPrompt = `
You are Degany, a virtual assistant for the MGA Follow UP app, developed by Morlon.
Only respond using the following official knowledge base.

---

AUTHORIZED KNOWLEDGE:
${context}

---

STRICT INSTRUCTIONS:
- Use existing answers if there's a match.
- If not, respond: “I’m sorry, I don’t have that information because I was developed by Morlon only to assist with the MGA Follow UP app.”
- Do not suggest outside solutions or personal opinions.`;
    } else if (lang === "mg") {
      systemPrompt = `
Ianao no Degany, mpanampy virtoaly amin'ny fampiharana MGA Follow UP, novolavolain'i Morlon.
Valio araka ireto fahalalana manaraka ireto ihany.

---

FAHALALANA AFAKA AMPIASAINA:
${context}

---

TORO-MARIKA:
- Raha mifanandrify amin’ny fanontaniana ny tahiry, ampiasao izany.
- Raha tsy misy ifandraisany dia valio hoe : “Miala tsiny, tsy manana io fampahafantarana io aho satria natokana hanampy amin’ny MGA Follow UP fotsiny aho.”
- Aza manome rohy na hevitra ivelany.`;
    }

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
      throw new Error(`Erreur API Together: ${response.status}`);
    }

    const data = await response.json();
    const answer = data?.choices?.[0]?.message?.content || "Je suis développé par MGA Follow UP pour vous assister uniquement.";
    console.log("Réponse de l'API Together:", answer);
    return Response.json({ answer });

  } catch (error) {
    console.error('Erreur:', error);
    return Response.json({ answer: "Une erreur est survenue. Veuillez réessayer plus tard." }, { status: 500 });
  }
};

import db from '@/lib/db';
import { auth } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  try {
    const session = await auth();
    const cookieStore = cookies();
    let userId = session?.user?.id;
    const existingCookie = cookieStore.get('userId')?.value;

    if (!userId) {
      if (existingCookie) {
        userId = existingCookie;
      } else {
        userId = uuidv4();
        // le cookie sera défini plus bas via res.cookies.set(...)
      }
    }

    const { message }: { message: string } = await req.json();

    if (!message.trim()) {
      return NextResponse.json({ answer: "Veuillez saisir un message." }, { status: 400 });
    }

    const all = await db.assistantContext.findMany();

    if (all.length === 0) {
      return NextResponse.json(
        { answer: "Aucun contexte trouvé. Veuillez ajouter des questions et réponses." },
        { status: 500 }
      );
    }

    const context = all
      .map(item => `Q: ${item.question}\nR: ${item.answer}`)
      .join("\n\n");

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
            content: `...${context}...`, // inchangé
          },
          { role: "user", content: message },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`La connexion avec l'API a échoué avec le statut: ${response.status}`);
    }

    const data = await response.json();
    const answer =
      data.choices?.[0]?.message?.content ||
      "Je suis développé par MGA Follow UP pour vous assister seulement, alors que puis-je faire pour à propos de l’app MGA Follow UP ?";

    await db.conversationHistory.createMany({
      data: [
        { userId, role: "user", content: message },
        { userId, role: "assistant", content: answer },
      ],
    });

    const res = NextResponse.json({ answer });

    if (!session?.user?.id && !existingCookie) {
      res.cookies.set('userId', userId, {
        path: '/',
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 365,
      });
    }

    return res;
  } catch (error) {
    console.error('Erreur:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { answer: "Une erreur est survenue. Veuillez réessayer plus tard." },
      { status: 500 }
    );
  }
};

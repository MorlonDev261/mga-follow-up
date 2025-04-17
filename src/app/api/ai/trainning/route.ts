import db from '@/lib/db';

export const POST = async (req: Request) => {
  try {
    const { question, answer } = await req.json();

    // Validation des données
    if (!question || !answer) {
      return new Response(
        JSON.stringify({ error: 'La question et la réponse sont obligatoires' }),
        { status: 400 }
      );
    }

    // Enregistrement des données dans la base de données
    const saved = await db.assistantContext.create({
      data: { question, answer },
    });

    return Response.json(saved);
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Une erreur est survenue lors de l\'enregistrement' }),
      { status: 500 }
    );
  }
};

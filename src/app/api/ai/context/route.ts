import db from '@/lib/db';

export const POST = async (req: Request) => {
  const { question, answer } = await req.json();
  const saved = await db.assistantContext.create({ data: { question, answer } });
  return Response.json(saved);
};

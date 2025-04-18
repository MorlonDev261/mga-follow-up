import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ messages: [] }, { status: 401 });
  }

  const history = await db.conversationHistory.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
  });

  const grouped = [];
  for (let i = 0; i < history.length; i++) {
    const msg = history[i];
    const next = history[i + 1];
    if (msg.role === 'user' && next?.role === 'assistant') {
      grouped.push({ user: msg.content, bot: next.content });
      i++; // skip next
    }
  }

  return NextResponse.json({ messages: grouped });
}

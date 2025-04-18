import { auth } from '@/lib/auth';
import db from '@/lib/db';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  // D'abord, on tente de récupérer la session
  const session = await auth();
  let userId = session?.user?.id;

  // Si l'utilisateur n'est pas connecté, on récupère l'ID utilisateur à partir du cookie
  if (!userId) {
    const cookieStore = await cookies();  // Utilisez await ici
    userId = cookieStore.get('userId')?.value;  // Récupérez la valeur du cookie 'userId'
  }

  // Si aucun userId n'est trouvé, on retourne une erreur 401
  if (!userId) {
    return NextResponse.json({ messages: [] }, { status: 401 });
  }

  try {
    // Query conversation history
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
  } catch (error) {
    console.error('Error retrieving conversation history:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

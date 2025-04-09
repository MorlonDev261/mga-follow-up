import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET USER
export async function GET(
  _req: Request,
  context: { params: { userId: string } }
) {
  try {
    const { userId } = context.params;

    if (!userId) {
      return NextResponse.json({ error: 'ID utilisateur manquant' }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        coverPicture: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('[GET USER]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// UPDATE USER
export async function PUT(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const body = await req.json();
    const { name, image, coverPicture } = body;

    if (!userId) {
      return NextResponse.json({ error: 'ID utilisateur manquant' }, { status: 400 });
    }

    const user = await db.user.update({
      where: { id: userId },
      data: {
        name,
        image,
        coverPicture,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('[PUT USER]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

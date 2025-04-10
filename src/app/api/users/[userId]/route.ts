import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// GET user by ID
export async function GET(req: NextRequest) {
  const url = new URL(req.nextUrl);
  const segments = url.pathname.split('/');
  const userId = segments[segments.length - 1];

  try {
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

    return user
      ? NextResponse.json(user)
      : NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
  } catch (error) {
    console.error('[GET USER]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PUT update user by ID
export async function PUT(req: NextRequest) {
  const url = new URL(req.nextUrl);
  const segments = url.pathname.split('/');
  const userId = segments[segments.length - 1];

  try {
    const body = await req.json();
    const { name, image, coverPicture } = body;

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { name, image, coverPicture },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('[UPDATE USER]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

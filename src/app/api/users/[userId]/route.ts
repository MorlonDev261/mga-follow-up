import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { z } from 'zod';

// Schema de validation pour PUT
const updateUserSchema = z.object({
  name: z.string().optional(),
  image: z.string().url().optional(),
  coverPicture: z.string().url().optional(),
});

export async function GET(req: NextRequest) {
  const url = new URL(req.nextUrl);
  const segments = url.pathname.split('/');
  const userId = segments[segments.length - 1];

  if (!userId) return NextResponse.json({ error: 'ID invalide' }, { status: 400 });

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

    if (!user) return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    return NextResponse.json(user);
  } catch (error) {
    console.error('[GET USER]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const url = new URL(req.nextUrl);
  const segments = url.pathname.split('/');
  const userId = segments[segments.length - 1];

  if (!userId) return NextResponse.json({ error: 'ID invalide' }, { status: 400 });

  try {
    const body = await req.json();
    const parsed = updateUserSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Données invalides', issues: parsed.error.flatten() }, { status: 400 });
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: parsed.data,
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('[UPDATE USER]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.nextUrl);
  const segments = url.pathname.split('/');
  const userId = segments[segments.length - 1];

  if (!userId) return NextResponse.json({ error: 'ID invalide' }, { status: 400 });

  try {
    await db.user.delete({ where: { id: userId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DELETE USER]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

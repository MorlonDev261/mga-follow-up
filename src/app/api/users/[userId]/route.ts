import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { z } from 'zod';

type Params = {
  params: { userId: string };
};

// Schéma de validation avec Zod
const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  image: z.string().url().optional(),
  coverPicture: z.string().url().optional(),
});

// GET user by ID
export async function GET(_: Request, { params }: Params) {
  const { userId } = params;

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

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('[GET USER]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PUT update user by ID
export async function PUT(req: Request, { params }: Params) {
  const { userId } = params;

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

// DELETE user by ID
export async function DELETE(_: Request, { params }: Params) {
  const { userId } = params;

  try {
    await db.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DELETE USER]', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
  }
}

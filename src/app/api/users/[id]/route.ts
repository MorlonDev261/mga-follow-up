import { NextResponse } from 'next/server';
import db from '@/lib/db';

type Params = {
  params: {
    id: string;
  };
};

// GET USER
export async function GET({ params }: Params) {
  try {
    const allParams = await params;
    const userId = allParams?.id;


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

// UPDATE USER
export async function PUT({ params }: Params) {
  try {
    const allParams = await params;
    const userId = allParams?.id;
    const { name, image, coverPicture } = await req.json();

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { name, image, coverPicture },
    });

    return NextResponse.json(updatedUser);
    
  } catch (error) {
    console.error('[PUT USER]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

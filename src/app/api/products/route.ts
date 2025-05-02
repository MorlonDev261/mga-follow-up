import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { auth } from '@/lib/auth';
import { z } from 'zod';

// Schéma de validation simplifié
const productSchema = z
  .object({
    arrival: z.number(),
    stockDate: z.number(),
    productId: z.string().cuid(),
    qty: z.number().int().nonnegative(),
    identifiers: z.array(
      z.object({
        id: z.number().int(),
        comment: z.string().max(255),
      })
    ),
  })
  .refine((data) => data.identifiers.length === data.qty, {
    message: 'Le nombre d’identifiants doit correspondre à la quantité',
    path: ['identifiers'],
  });

export async function POST(req: NextRequest) {
  // Vérifie la session utilisateur
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Analyse et validation du payload
  let payload;
  try {
    payload = productSchema.parse(await req.json());
  } catch (error) {
    console.error('[Product API] Validation Error:', error);
    return NextResponse.json(
      { error: 'Données invalides', details: error instanceof z.ZodError ? error.errors : undefined },
      { status: 400 }
    );
  }

  try {
    // Création de l'enregistrement dans la table StockEntry
    const record = await db.stockEntry.create({
      data: {
        arrival: new Date(payload.arrival),
        stockDate: new Date(payload.stockDate),
        qty: payload.qty,
        product: { connect: { id: payload.productId } },
        identifiers: {
          create: payload.identifiers.map((item) => ({
            identifier: item.id,
            comment: item.comment,
          })),
        },
      },
      include: { identifiers: true },
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error('[Product API] Database Error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { auth } from '@/lib/auth';
import { z } from 'zod';

// Schéma de validation
const productSchema = z
  .object({
    arrival: z.number(),
    stockDate: z.number(),
    productId: z.string().cuid(),
    qty: z.number().int().positive(),
    identifiers: z.array(
      z.object({
        identifier: z.number().int(),
        comment: z.string().trim().max(255),
      })
    ),
  })
  .refine((data) => data.identifiers.length === data.qty, {
    message: 'Le nombre d’identifiants doit correspondre à la quantité',
    path: ['identifiers'],
  });

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

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
    const created = await db.$transaction(
      payload.identifiers.map((entry) =>
        db.stockEntry.create({
          data: {
            arrival: new Date(payload.arrival),
            stockDate: new Date(payload.stockDate),
            productId: payload.productId,
            identifier: entry.identifier,
            comment: entry.comment,
          },
        })
      )
    );

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('[Product API] Database Error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

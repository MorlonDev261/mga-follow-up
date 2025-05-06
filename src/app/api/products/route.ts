import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { auth } from '@/lib/auth';
import { z } from 'zod';

// Schéma de validation avec identifiants uniques
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
  })
  .refine(
    (data) =>
      new Set(data.identifiers.map((i) => i.identifier)).size === data.identifiers.length,
    {
      message: 'Les identifiants doivent être uniques',
      path: ['identifiers'],
    }
  );

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
  }

  let payload;
  try {
    const body = await req.json();
    payload = productSchema.parse(body);
  } catch (error) {
    console.error('[Product API] Erreur de validation:', error);
    return NextResponse.json(
      {
        error: 'Données invalides',
        details: error instanceof z.ZodError ? error.errors : undefined,
      },
      { status: 400 }
    );
  }

  const arrivalDate = new Date(payload.arrival);
  const stockDate = new Date(payload.stockDate);

  if (isNaN(arrivalDate.getTime()) || isNaN(stockDate.getTime())) {
    return NextResponse.json({ error: 'Dates invalides' }, { status: 400 });
  }

  try {
    const created = await db.$transaction(async (tx) => {
      const results = [];

      for (const entry of payload.identifiers) {
        const createdEntry = await tx.stockEntry.create({
          data: {
            arrival: arrivalDate,
            stockDate: stockDate,
            productId: payload.productId,
            identifier: entry.identifier,
            comment: entry.comment,
          },
        });
        results.push(createdEntry);
      }

      return results;
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('[Product API] Erreur base de données:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

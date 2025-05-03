// src/app/api/stock/[companyId]/route.ts
import { NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: { companyId: string } }
) {
  try {
    const { companyId } = params

    if (!companyId) {
      return NextResponse.json(
        { message: 'companyId manquant dans l’URL' },
        { status: 400 }
      )
    }

    // Correction ici : Ajout de la parenthèse manquante
    const products = await db.product.findMany({
      where: { companyId },
      include: { 
        entries: { 
          include: { 
            identifiers: true 
          } 
        } 
      }, // ← Parenthèse fermante ajoutée
    })

    return NextResponse.json(products)

  } catch (error) {
    return NextResponse.json(
      { 
        message: 'Erreur serveur', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

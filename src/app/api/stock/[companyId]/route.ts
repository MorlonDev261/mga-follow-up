// src/app/api/stock/[companyId]/route.ts
import { NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: { companyId: string } } // Correction du type des params
) {
  try {
    const companyId = params.companyId; // Accès direct au paramètre

    if (!companyId) {
      return NextResponse.json(
        { message: 'companyId manquant dans l’URL' },
        { status: 400 }
      )
    }

    const products = await db.product.findMany({
      where: { companyId },
      include: { 
        entries: { 
          include: { 
            identifiers: true 
          } 
        } 
      }
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

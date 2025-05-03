import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET(
  request: NextRequest,
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

    const products = await db.product.findMany({
      where: { companyId },
      include: { entries: { include: { identifiers: true } } },
    })

    return NextResponse.json(products || [])
    
  } catch (error) {
    return NextResponse.json(
      { message: 'Erreur serveur', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

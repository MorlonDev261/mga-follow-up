import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { companyId: string } }
) {
  const { companyId } = params

  // Vérification basique
  if (!companyId) {
    return NextResponse.json(
      { message: 'companyId manquant dans l’URL' },
      { status: 400 }
    )
  }

  try {
    // Requête Prisma pour récupérer tous les produits de l’entreprise
    const products = await db.product.findMany({
      where: { companyId },
      include: {
        entries: {
          include: {
            identifiers: true,
          },
        },
      },
    })

    if (products.length === 0) {
      return NextResponse.json(
        { message: 'Aucun produit trouvé pour cette entreprise' },
        { status: 404 }
      )
    }

    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json(
      { message: 'Erreur serveur', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

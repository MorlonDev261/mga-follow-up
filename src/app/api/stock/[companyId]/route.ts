import { NextResponse, NextRequest } from 'next/server'
import db from '@/lib/db'

export async function GET(req: NextRequest) {
  const { companyId } = req.query

  // Vérification basique
  if (!companyId) {
    return NextResponse.json(
      { message: 'companyId manquant dans l’URL' },
      { status: 400 }
    )
  }

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
}

import { NextResponse } from 'next/server'
import db from '@/lib/db'

interface Params {
  params: {
    companyId: string
  }
}

export async function GET(
  request: Request,
  { params }: Params
) {
  const { companyId } = params

  // 1. (Optionnel) Vérifier que companyId est un UUID ou un cuid valide
  if (!companyId || typeof companyId !== 'string') {
    return NextResponse.json(
      { message: 'Paramètre companyId invalide' },
      { status: 400 }
    )
  }

  // 2. Récupérer tous les produits de cette entreprise
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

  // 3. Si vous voulez renvoyer une 404 quand il n'y a **aucun** produit :
  if (products.length === 0) {
    return NextResponse.json(
      { message: 'Aucun produit trouvé pour cette entreprise' },
      { status: 404 }
    )
  }

  // 4. Retourner le JSON
  return NextResponse.json(products)
}

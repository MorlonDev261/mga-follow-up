// src/app/api/stock/[companyId]/route.ts
import { NextResponse } from 'next/server'
import db from '@/lib/db'
import { getProductsByCompany } from '@/actions'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ companyId: string }> }
) {
  try {
    const { companyId } = await params

    if (!companyId) {
      return NextResponse.json(
        { message: 'companyId manquant dans l’URL' },
        { status: 400 }
      )
    }

    const products = await getProductsByCompany(companyId);

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

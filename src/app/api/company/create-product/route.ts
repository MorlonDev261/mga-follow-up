import { createProduct } from '@/actions'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  try {
    const product = await createProduct(body)
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

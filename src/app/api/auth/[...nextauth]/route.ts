import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const res = await NextAuth(req, authOptions)
  return NextResponse.json(res)
}

export async function POST(req: Request) {
  const res = await NextAuth(req, authOptions)
  return NextResponse.json(res)
}

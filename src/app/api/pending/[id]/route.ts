import { NextResponse } from "next/server"

type Payment = {
  id: string
  date: string
  customer: string
  designation: string
  price: number
}

const payments: Payment[] = [
  { id: "bhqecj4p", date: "23-02-25", customer: "Shop Cell", designation: "iPhone 7plus", price: 10034 },
]

export async function GET() {
  return NextResponse.json(payments, { status: 200 })
}

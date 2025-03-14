import { NextResponse } from "next/server"

type Payment = {
  id: string
  date: string
  comments: string
  amount: number
  caisse: string
}

const payments: Payment[] = [
  { id: "m5gr84i9", date: "23/01/25", comments: "Dépôt MVola Ergit", amount: 316, caisse: "Payment le 11" },
  { id: "3u1reuv4", date: "24/01/25", comments: "Nividy sonnerie antragno", amount: -242, caisse: "Payment le 16" },
  { id: "derv1ws0", date: "26/01/25", comments: "Échange Josepha", amount: -837, caisse: "Payment le 01" },
  { id: "5kma53ae", date: "29/01/25", comments: "Google pixel 2pcs", amount: 874, caisse: "Payment le 06" },
  { id: "bhqecj4p", date: "31/01/25", comments: "Volan'ny forfait", amount: -21, caisse: "Payment le 30" },
]

export async function GET() {
  return NextResponse.json(payments, { status: 200 })
}

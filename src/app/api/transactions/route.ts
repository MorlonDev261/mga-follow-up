import { NextResponse } from "next/server"

type Payment = {
  id: string
  date: string
  comments: string
  amount: number
  caisseId: string
}

const payments: Payment[] = [
  { id: "m5gr84i9", date: "23/01/25", comments: "Dépôt MVola Ergit", amount: -316, caisseId: "uzRt253" },
  { id: "m5gr8491", date: "23/01/25", comments: "Dépôt MVola Ergit", amount: -690, caisseId: "uzRt253" },
  { id: "m5gr8492", date: "23/01/25", comments: "Dépôt MVola Ergit", amount: -786, caisseId: "uzRt253" },
  { id: "m5gr8493", date: "23/01/25", comments: "Dépôt MVola Ergit", amount: -874, caisseId: "uzRt253" },
  { id: "3u1reuv4", date: "24/01/25", comments: "Nividy sonnerie antragno", amount: -242, caisseId: "7264Yehf" },
  { id: "derv1ws0", date: "26/01/25", comments: "Échange Josepha", amount: -837, caisseId: "jdjbe59Jz" },
  { id: "5kma53ae", date: "29/01/25", comments: "Google pixel 2pcs", amount: 874, caisseId: "7uet357eH" },
  { id: "bhqecj4p", date: "31/01/25", comments: "Volan'ny forfait", amount: -21, caisseId: "7uet357eH" },
]

export async function GET() {
  return NextResponse.json(payments, { status: 200 })
}

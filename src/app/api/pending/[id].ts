import { NextResponse } from "next/server";

type Payment = {
  id: string
  date: string
  customer: string
  designation: string
  price: number
}

const payments: Payment[] = [
  { id: "1", date: "2023-10-01", customer: "John Doe", designation: "Website Design", price: 500 },
  { id: "2", date: "2023-10-02", customer: "Jane Smith", designation: "SEO Optimization", price: 300 },
];

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const payment = payments.find((p) => p.id === params.id);

  if (!payment) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  return NextResponse.json(payment);
}

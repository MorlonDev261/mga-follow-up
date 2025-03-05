import { NextResponse } from "next/server";

type Payment = {
  id: string;
  date: string;
  customer: string;
  designation: string;
  price: number;
};

const payments: Payment[] = [
  { id: "m5gr84i9", date: "23-01-25", customer: "Kiady", designation: "iPhone 8", price: 316 },
  { id: "3u1reuv4", date: "01-02-25", customer: "Mr Tanjona", designation: "iPhone 11pro 64", price: 316 },
  { id: "derv1ws0", date: "12-01-25", customer: "Top Mada", designation: "Moto G 128", price: 316 },
  { id: "5kma53ae", date: "04-02-25", customer: "Kiady", designation: "iPhone Xs", price: 316 },
  { id: "bhqecj4p", date: "23-02-25", customer: "Shop Cell", designation: "iPhone 7plus", price: 10034 },
];

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const payment = payments.find((p) => p.id === params.id);

  if (!payment) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  return NextResponse.json(payment);
}

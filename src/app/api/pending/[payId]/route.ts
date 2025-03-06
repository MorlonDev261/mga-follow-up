import { NextRequest, NextResponse } from "next/server";

type Payment = {
  id: string;
  date: string;
  customer: string;
  designation: string;
  price: number;
};

const payments: Payment[] = [
  { id: "m5gr84i9", date: "2025-01-23", customer: "Kiady", designation: "iPhone 8", price: 316 },
  { id: "3u1reuv4", date: "2025-02-01", customer: "Mr Tanjona", designation: "iPhone 11pro 64", price: 316 },
  { id: "derv1ws0", date: "2025-01-12", customer: "Top Mada", designation: "Moto G 128", price: 316 },
  { id: "5kma53ae", date: "2025-02-04", customer: "Kiady", designation: "iPhone Xs", price: 316 },
  { id: "bhqecj4p", date: "2025-02-23", customer: "Shop Cell", designation: "iPhone 7plus", price: 10034 },
];

 // eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(req: NextRequest, { params }: { params: any }) {
  const { payId } = params;

  const payment = payments.find((p) => p.id === payId);

  if (!payment) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  return NextResponse.json(payment, { status: 200 });
}

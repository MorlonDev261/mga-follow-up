import { NextRequest, NextResponse } from "next/server";

// Simuler une base de données
const payments = [
  { id: "1", date: "2025-03-01", customer: "John Doe", designation: "Service A", price: 50000 },
  { id: "2", date: "2025-03-02", customer: "Jane Smith", designation: "Product B", price: 75000 },
  { id: "3", date: "2025-03-03", customer: "Alice Johnson", designation: "Subscription C", price: 100000 },
];

// GET /api/pending/[id]
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  if (!params || !params.id) {
    return NextResponse.json({ error: "Missing ID parameter" }, { status: 400 });
  }

  const payment = payments.find((p) => p.id === params.id);

  if (!payment) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  return NextResponse.json(payment);
}

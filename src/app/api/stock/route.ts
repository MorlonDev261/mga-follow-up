import { NextResponse } from "next/server";
import { getProductsByCompany } from "@/actions";

export type Product = {
  id: string;
  date: string;
  Qte?: number;
  designation: string;
  idProduct: string;
  comments: string;
  amount: number;
  total?: number;
};

export async function GET() {
  const companyId = "cma5mvy3i0000l504izi8zb2i";
  const data: Product[] = await getProductsByCompany(companyId);

  return NextResponse.json(data);
}

import { NextResponse } from "next/server";
import { getProductsByCompany } from "@/actions";

export type Product = {
  id: number;
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
  const rawProducts = await getProductsByCompany(companyId);

  const products: Product[] = [];

  for (const product of rawProducts) {
    for (const entry of product.entries) {
      for (const identifier of entry.identifiers) {
        products.push({
          id: identifier.id,
          date: entry.date.toISOString().split("T")[0], // format YYYY-MM-DD
          designation: product.designation,
          idProduct: product.id,
          comments: identifier.comments || "",
          amount: entry.amount,
        });
      }
    }
  }

  return NextResponse.json(products);
}

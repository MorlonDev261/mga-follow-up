import { NextResponse } from "next/server";
import { getProductsByCompany } from "@/actions";
import type { Product } from "@/types";
import moment from "moment";

// Type local si tu n'as pas de fichier partagé
export type Product = {
  id: number;
  date: string;
  Qte?: number;
  designation: string;
  productId: string;
  comments: string;
  amount: number;
  total?: number;
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId");
    const date = searchParams.get("date"); // format YYYY-MM-DD optionnel

    if (!companyId) {
      return NextResponse.json(
        { error: "Le paramètre 'companyId' est requis." },
        { status: 400 }
      );
    }

    const rawProducts = await getProductsByCompany(companyId, date || undefined);

    const products: Product[] = [];

    for (const product of rawProducts) {
      for (const entry of product.entries) {
        for (const identifier of entry.identifiers) {
          products.push({
            id: identifier.id,
            date: moment(entry.date).format("YYYY-MM-DD"),
            designation: product.designation,
            productId: product.id,
            comments: identifier.comments || "",
            amount: entry.amount,
          });
        }
      }
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error("Erreur API GET /products:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération des produits." },
      { status: 500 }
    );
  }
}

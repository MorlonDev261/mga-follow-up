import { NextRequest, NextResponse } from "next/server";

// Simulons une base de données
const data = [
  { id: "1", name: "Produit A", price: 100 },
  { id: "2", name: "Produit B", price: 200 },
  { id: "3", name: "Produit C", price: 300 },
];

// Fonction GET pour récupérer les données d'un `id`
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // Recherche des données par `id`
  const item = data.find((product) => product.id === id);

  if (!item) {
    return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 });
  }

  return NextResponse.json(item, { status: 200 });
}

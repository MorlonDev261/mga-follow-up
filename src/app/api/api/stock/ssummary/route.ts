import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import moment from "moment";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.selectedCompany) {
      return NextResponse.json(
        { error: "Aucune entreprise sélectionnée." },
        { status: 400 }
      );
    }

    const summary = await db.stockEntry.groupBy({
      by: ["stockDate"],
      where: {
        product: {
          companyId: session.selectedCompany,
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        stockDate: "desc",
      },
    });

    const formatted = summary.map((item) => {
      const formattedDate = moment(item.stockDate).format("DD-MM-YYYY");
      return {
        id: formattedDate,
        name: `Stock du ${formattedDate}`,
        value: item._count.id,
      };
    });

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Erreur API /stocks/summary:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors du résumé des stocks." },
      { status: 500 }
    );
  }
}

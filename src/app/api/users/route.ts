import { NextResponse } from "next/server";
import db from "@/lib/db";
import type { NextRequest } from "next/server";

export async function GET(_req: NextRequest) {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        password: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("[GET /api/users]", error);
    return NextResponse.json(
      {
        message: "Erreur de récupération des utilisateurs",
        errorCode: "DB_FETCH_ERROR",
      },
      { status: 500 }
    );
  }
}

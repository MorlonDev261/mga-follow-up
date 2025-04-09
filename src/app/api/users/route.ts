import { NextResponse } from "next/server";
import db from "@/lib/db";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const authToken = req.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!authToken) {
      return NextResponse.json(
        { message: "Authentification requise", errorCode: "MISSING_TOKEN" },
        { status: 401, headers: securityHeaders() }
      );
    }

    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        password: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(users, { headers: securityHeaders() });

  } catch (error) {
    console.error("[GET /api/users]", error);
    return NextResponse.json(
      { message: "Erreur de récupération des utilisateurs", errorCode: "DB_FETCH_ERROR" },
      { status: 500, headers: securityHeaders() }
    );
  }
}

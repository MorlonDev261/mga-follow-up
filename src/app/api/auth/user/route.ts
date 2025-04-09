import { NextResponse } from "next/server";
import db from "@/lib/db";
import { hash } from "bcryptjs";
import { z } from "zod";
import type { NextRequest } from "next/server";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "5mb",
    },
  },
};

const userSchema = z.object({
  email: z.string().email("Format d'email invalide").max(100),
  password: z.string()
    .min(8, "Minimum 8 caractères")
    .regex(/[A-Z]/, "Au moins une majuscule")
    .regex(/[0-9]/, "Au moins un chiffre"),
});

// Correction : Déplacer l'interface avant son utilisation
interface ErrorDetail {
  field: string;
  message: string;
}

const formatZodError = (error: z.ZodError): ErrorDetail[] => {
  return error.issues.map(issue => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));
};

const securityHeaders = () => {
  const headers = new Headers();
  headers.set('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline'; " +
    "style-src 'self' 'unsafe-inline'"
  );
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  return headers;
};

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('Content-Type');
    
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { message: "Format de données non supporté", errorCode: "INVALID_CONTENT_TYPE" },
        { status: 415, headers: securityHeaders() }
      );
    }

    const body = await req.json();
    const validation = userSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Données invalides",
          details: formatZodError(validation.error),
          errorCode: "VALIDATION_ERROR"
        },
        { status: 400, headers: securityHeaders() }
      );
    }

    const { email, password, ...userData } = validation.data;

    const existingUser = await db.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Un compte existe déjà avec cet email", errorCode: "EMAIL_CONFLICT" },
        { status: 409, headers: securityHeaders() }
      );
    }

    const hashedPassword = await hash(password, 12);

    const newUser = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        ...userData,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { message: "Compte créé avec succès", data: newUser },
      { status: 201, headers: securityHeaders() }
    );

  } catch (error) {
    console.error("[POST /api/users]", error);

    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { message: "Un compte existe déjà avec cet email", errorCode: "EMAIL_CONFLICT" },
        { status: 409, headers: securityHeaders() }
      );
    }

    return NextResponse.json(
      { message: "Erreur lors de la création du compte", errorCode: "SERVER_ERROR" },
      { status: 500, headers: securityHeaders() }
    );
  }
}

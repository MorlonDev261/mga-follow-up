// api/users/route.ts
import { NextResponse } from "next/server";
import db from "@/lib/db";
import { hash } from "bcryptjs";
import { z } from "zod";
import type { NextRequest } from "next/server";

// Configuration sécurité
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};

// Schéma de validation amélioré
const userSchema = z.object({
  contact: z.string().email("Format d'email invalide").max(100),
  password: z.string()
    .min(8, "Minimum 8 caractères")
    .regex(/[A-Z]/, "Au moins une majuscule")
    .regex(/[0-9]/, "Au moins un chiffre")
    .regex(/[!@#$%^&*]/, "Au moins un caractère spécial"),
  firstName: z.string()
    .min(2, "Minimum 2 caractères")
    .max(50, "Maximum 50 caractères")
    .regex(/^[a-zA-ZÀ-ÿ -]+$/, "Caractères non autorisés"),
  lastName: z.string()
    .min(2, "Minimum 2 caractères")
    .max(50, "Maximum 50 caractères")
    .regex(/^[a-zA-ZÀ-ÿ -]+$/, "Caractères non autorisés"),
  profilePicture: z.string()
    .url("URL invalide")
    .regex(/\.(jpeg|jpg|png|webp)$/i, "Format d'image non supporté")
    .optional()
    .or(z.literal("")),
  coverPicture: z.string()
    .url("URL invalide")
    .regex(/\.(jpeg|jpg|png|webp)$/i, "Format d'image non supporté")
    .optional()
    .or(z.literal("")),
});

type ApiResponse = {
  message: string;
  details?: any;
  errorCode?: string;
};

// Formatter les erreurs Zod
const formatZodError = (error: z.ZodError) => {
  return error.issues.map(issue => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));
};

export async function GET(req: NextRequest) {
  try {
    // Vérifier l'authentification
    const authToken = req.headers.get('Authorization');
    if (!authToken?.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: "Authentification requise" } as ApiResponse,
        { status: 401 }
      );
    }

    // Récupération sécurisée des utilisateurs
    const users = await db.user.findMany({
      select: {
        id: true,
        contact: true,
        firstName: true,
        lastName: true,
        profilePicture: true,
        coverPicture: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(users, {
      headers: securityHeaders(),
    });

  } catch (error) {
    console.error("[GET /api/users]", error);
    return NextResponse.json(
      {
        message: "Erreur de récupération des utilisateurs",
        errorCode: "DB_FETCH_ERROR"
      } as ApiResponse,
      { status: 500, headers: securityHeaders() }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Validation du Content-Type
    const contentType = req.headers.get('Content-Type');
    if (contentType !== 'application/json') {
      return NextResponse.json(
        { message: "Format de données non supporté" } as ApiResponse,
        { status: 415, headers: securityHeaders() }
      );
    }

    const body = await req.json();

    // Validation Zod
    const validation = userSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Données invalides",
          details: formatZodError(validation.error),
          errorCode: "VALIDATION_ERROR"
        } as ApiResponse,
        { status: 400, headers: securityHeaders() }
      );
    }

    const { contact, password, ...userData } = validation.data;

    // Vérification doublon
    const existingUser = await db.user.findUnique({
      where: { contact },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message: "Un compte existe déjà avec cet email",
          errorCode: "EMAIL_CONFLICT"
        } as ApiResponse,
        { status: 409, headers: securityHeaders() }
      );
    }

    // Hachage mot de passe
    const hashedPassword = await hash(password, 12);

    // Création utilisateur
    const newUser = await db.user.create({
      data: {
        contact,
        password: hashedPassword,
        ...userData,
        profilePicture: userData.profilePicture || null,
        coverPicture: userData.coverPicture || null,
      },
      select: {
        id: true,
        contact: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { message: "Compte créé avec succès", data: newUser },
      { status: 201, headers: securityHeaders() }
    );

  } catch (error) {
    console.error("[POST /api/users]", error);

    // Gestion des erreurs de base de données
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        {
          message: "Un compte existe déjà avec cet email",
          errorCode: "EMAIL_CONFLICT"
        } as ApiResponse,
        { status: 409, headers: securityHeaders() }
      );
    }

    return NextResponse.json(
      {
        message: "Erreur lors de la création du compte",
        errorCode: "SERVER_ERROR"
      } as ApiResponse,
      { status: 500, headers: securityHeaders() }
    );
  }
}

// Headers de sécurité
const securityHeaders = () => {
  const headers = new Headers();
  headers.set('Content-Security-Policy', "default-src 'self'");
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  return headers;
};

import { NextResponse } from "next/server";
import db from "@/lib/db";
import { hash } from "bcryptjs";
import { z } from "zod";

// Schéma de validation Zod
const userSchema = z.object({
  contact: z.string().email("Format d'email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  profilePicture: z.string().url("URL de photo de profil invalide").optional().or(z.literal("")),
  coverPicture: z.string().url("URL de photo de couverture invalide").optional().or(z.literal("")),
});

// Type TypeScript dérivé du schéma Zod
type UserData = z.infer<typeof userSchema>;

// Récupérer tous les utilisateurs (sécurisé)
export async function GET() {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        contact: true,
        firstName: true,
        lastName: true,
        profilePicture: true,
        coverPicture: true,
        createdAt: true,
      }
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("[GET /api/users]", error);
    return NextResponse.json(
      { error: "Échec de la récupération des utilisateurs" },
      { status: 500 }
    );
  }
}

// Créer un nouvel utilisateur
export async function POST(req: Request) {
  try {
    const body: UserData = await req.json();
    
    // Validation avec Zod
    const validationResult = userSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Données invalides", details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { contact, password, firstName, lastName, profilePicture, coverPicture } = validationResult.data;

    // Vérifier l'existence de l'utilisateur
    const existingUser = await db.user.findUnique({
      where: { contact },
      select: { id: true }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Un utilisateur avec cet email existe déjà" },
        { status: 409 }
      );
    }

    // Hachage du mot de passe
    const hashedPassword = await hash(password, 12);

    // Création de l'utilisateur
    const newUser = await db.user.create({
      data: {
        contact,
        password: hashedPassword,
        firstName,
        lastName,
        profilePicture: profilePicture || null,
        coverPicture: coverPicture || null,
      },
      select: {
        id: true,
        contact: true,
        firstName: true,
        lastName: true,
        profilePicture: true,
        coverPicture: true,
        createdAt: true
      }
    });

    return NextResponse.json(
      { user: newUser, message: "Compte créé avec succès" },
      { status: 201 }
    );

  } catch (error) {
    console.error("[POST /api/users]", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

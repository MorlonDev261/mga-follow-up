import { NextResponse } from "next/server";
import db from "@/lib/db";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

// Schéma de validation Zod
const loginSchema = z.object({
  contact: z.string().email("Format d'email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

// Clé secrète pour le token JWT (à mettre dans les variables d'environnement)
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Fonction de connexion
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validation des données
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Données invalides", details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { contact, password } = validationResult.data;

    // Vérifier si l'utilisateur existe
    const user = await db.user.findUnique({
      where: { contact },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    // Vérifier le mot de passe
    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    // Générer un token JWT
    const token = jwt.sign(
      { userId: user.id, contact: user.contact },
      JWT_SECRET,
      { expiresIn: "7d" } // Expiration du token : 7 jours
    );

    return NextResponse.json(
      { message: "Connexion réussie", token },
      { status: 200 }
    );
  } catch (error) {
    console.error("[POST /api/auth/login]", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

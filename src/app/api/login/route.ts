import { NextResponse } from "next/server";
import db from "@/lib/db";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

// Schéma de validation des entrées
const loginSchema = z.object({
  contact: z.string().email("Format d'email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

// Clé secrète pour le JWT (stockée dans les variables d'environnement)
const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRATION = "7d"; // Expiration du token

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    const { contact, password } = validation.data;

    // Vérifier si l'utilisateur existe
    const user = await db.user.findUnique({
      where: { contact },
      select: { id: true, password: true, firstName: true, lastName: true }
    });

    if (!user) {
      return NextResponse.json({ error: "Identifiants incorrects" }, { status: 401 });
    }

    // Vérifier le mot de passe
    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: "Identifiants incorrects" }, { status: 401 });
    }

    // Générer un token JWT sécurisé
    const token = jwt.sign(
      { id: user.id, contact: user.contact, name: `${user.firstName} ${user.lastName}` },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );

    return NextResponse.json({ token, message: "Connexion réussie" }, { status: 200 });

  } catch (error) {
    console.error("[POST /api/auth/login]", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { serialize } from "cookie";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Remplace par ta vraie clé secrète (à mettre en variable d'environnement)
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

// Schéma de validation
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    const { email, password } = body;

    // Simulation d'une récupération utilisateur (remplace par une requête à ta base)
    const user = { id: "123", email, passwordHash: bcrypt.hashSync("password123", 10) };

    // Vérification du mot de passe
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return NextResponse.json({ error: "Identifiants incorrects" }, { status: 401 });
    }

    // Génération du token JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

    // Création du cookie sécurisé
    const cookie = serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return NextResponse.json(
      { message: "Connexion réussie" },
      { status: 200, headers: { "Set-Cookie": cookie } }
    );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import db from "@/lib/db";
import { hash } from "bcrypt";

// Récupérer tous les utilisateurs
export async function GET() {
  try {
    const users = await db.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la récupération des utilisateurs" }, { status: 500 });
  }
}

// Ajouter un nouvel utilisateur
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { contact, password, firstName, lastName, pdp, pdc } = body;

    // Vérifier si les champs obligatoires sont fournis
    if (!contact || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "Tous les champs obligatoires doivent être remplis" }, { status: 400 });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await db.user.findUnique({
      where: { contact }
    });

    if (existingUser) {
      return NextResponse.json({ error: "Ce compte est déjà enregistré" }, { status: 409 });
    }

    // Hasher le mot de passe
    const hashedPassword = await hash(password, 10);

    // Créer le nouvel utilisateur
    const newUser = await db.user.create({
      data: {
        contact,
        password: hashedPassword,
        firstName,
        lastName,
        pdp,
        pdc,
      }
    });

    // Exclure le mot de passe avant de renvoyer l'utilisateur
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({ user: userWithoutPassword, message: "Utilisateur créé avec succès" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la création de l'utilisateur" }, { status: 500 });
  }
}

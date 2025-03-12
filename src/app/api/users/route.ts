import { NextResponse } from "next/server";
import db from "@/lib/db";
import { User } from "@/lib/db";
import { nanoid } from "nanoid";

// Récupérer tous les utilisateurs
export async function GET() {
  await db.read();
  return NextResponse.json(db.data.users);
}

// Ajouter un nouvel utilisateur
export async function POST(req: Request) {
  await db.read();
  const { name, avatar } = await req.json();

  if (!name) {
    return NextResponse.json({ error: "Le nom est obligatoire" }, { status: 400 });
  }

  const newUser: User = {
    id: nanoid(),
    name,
    avatar,
    isOnline: true,
  };

  db.data.users.push(newUser);
  await db.write();

  return NextResponse.json(newUser, { status: 201 });
}

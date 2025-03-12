import { NextResponse } from "next/server";
import db from "@/lib/db";
import { Chat } from "@/lib/db";
import { nanoid } from "nanoid";

// Récupérer toutes les discussions
export async function GET() {
  await db.read();
  return NextResponse.json(db.data.chats);
}

// Créer une discussion
export async function POST(req: Request) {
  await db.read();
  const { name, avatar } = await req.json();

  if (!name || !avatar) {
    return NextResponse.json({ error: "Nom et avatar requis" }, { status: 400 });
  }

  const newChat: Chat = {
    id: nanoid(),
    name,
    avatar,
    lastMessage: "",
    lastMessageTimestamp: Date.now(),
    unread: 0,
  };

  db.data.chats.push(newChat);
  await db.write();

  return NextResponse.json(newChat, { status: 201 });
}

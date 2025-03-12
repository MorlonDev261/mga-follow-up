import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { Message } from "@/models/message";

export async function POST(req: NextRequest) {
  try {
    const { senderId, chatId, text, isOwn, avatar } = await req.json();

    if (!senderId || !chatId || !text) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newMessage: Message = {
      id: uuidv4(),
      text,
      timestamp: Date.now() - 1000 * 60 * 2,
      isOwn,
      senderId,
      chatId,
      read: false,
      avatar,
    };

    db.data.messages.push(newMessage);
    await db.write();

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

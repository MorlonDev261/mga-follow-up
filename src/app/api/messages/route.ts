import { NextRequest, NextResponse } from "next/server";

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
      timestamp: new Date(),
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

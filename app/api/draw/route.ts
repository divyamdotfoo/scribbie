import { pusher } from "@/pusher";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.json();
  await pusher.trigger(`presence-${data.roomId}`, "draw", data);
  return NextResponse.json({ message: "ok" }, { status: 200 });
}

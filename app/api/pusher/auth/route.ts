import { pusher } from "@/pusher";
import { PlayerInfo } from "@/store";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = (await req.text()).split("&");
  const socketId = data[0].split("=")[1];
  const channelName = data[1].split("=")[1];
  console.log(socketId, channelName);
  if (req.headers.has("user")) {
    const userInfo: PlayerInfo = JSON.parse(req.headers.get("user")!);
    const presenceData = {
      user_id: userInfo.id,
      user_info: userInfo,
    };
    const authResponse = pusher.authorizeChannel(
      socketId,
      channelName,
      presenceData
    );
    return NextResponse.json(authResponse, { status: 200 });
  } else {
    return NextResponse.json({}, { status: 404 });
  }
}

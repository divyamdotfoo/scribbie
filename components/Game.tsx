"use client";
import Pusher from "pusher-js";
import { useEffect } from "react";
import { Message, PlayerInfo, UserState, useChannel, useUser } from "@/store";
import Canvas from "./Canvas";
import UserList from "./UserList";
import ChatList from "./ChatList";
const selector = (state: UserState) => ({
  user: state.user,
  allPlayers: state.allPlayers,
  setPlayers: state.setPlayers,
  setActivePlayer: state.setActivePlayer,
});
export default function Game({ roomId }: { roomId: string }) {
  const { user, allPlayers, setPlayers, setActivePlayer } = useUser(selector);
  const setChannel = useChannel((s) => s.setChannel);
  const setTrigger = useChannel((s) => s.setTrigger);
  const setMessages = useUser((s) => s.setMessages);
  useEffect(() => {
    const pusher = new Pusher("7078b58bb4546fda36e1", {
      cluster: "ap2",
      channelAuthorization: {
        endpoint: "/api/pusher/auth",
        transport: "ajax",
        headers: {
          user: JSON.stringify(user),
        },
      },
    });
    const channel = pusher.subscribe(`presence-${roomId}`);
    setChannel(channel);
    channel.bind("pusher:subscription_succeeded", (data: any) => {
      const members = Object.values(data.members) as PlayerInfo[];
      setPlayers(members);
      setTrigger(true);
    });

    channel.bind("pusher:member_added", (data: any) => {
      const member = data.info as PlayerInfo;
      setPlayers(member);
    });
    channel.bind("pusher:member_removed", (data: any) => {
      // console.log(data);
      // const members = allPlayers.filter((p) => p.id !== data.id);
      // setPlayers(members);
    });
    channel.bind("client-message", (data: { message: Message }) => {
      setMessages(data.message);
    });
    channel.bind("client-choosen-player", (data: PlayerInfo) => {
      console.log(data);
      setActivePlayer(data);
    });

    return () => pusher.disconnect();
  }, []);
  return (
    <div className=" w-screen h-screen grid grid-cols-4 gap-2">
      <Canvas />
      <div className=" col-start-4 col-end-5 p-2">
        <UserList />
        <ChatList />
      </div>
    </div>
  );
}

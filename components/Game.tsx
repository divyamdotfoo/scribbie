"use client";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import {
  Message,
  PlayerInfo,
  UserState,
  useCanvas,
  useChannel,
  useGame,
  useUser,
} from "@/store";
import Canvas from "./Canvas";
import UserList from "./UserList";
import ChatList from "./ChatList";
import { ChoiceModal } from "./ChoiceModal";
import { Button } from "./ui/button";
import StartGame from "./StartGame";
import ScoreCard from "./ScoreCard";
import { drawLine } from "@/lib/canvas";
const selector = (state: UserState) => ({
  user: state.user,
  allPlayers: state.allPlayers,
  setPlayers: state.setPlayers,
  setActivePlayer: state.setActivePlayer,
  setMessages: state.setMessages,
  setCurrentWord: state.setCurrentWord,
  updatePlayerScore: state.updatePlayerScore,
});
export default function Game({ roomId }: { roomId: string }) {
  const {
    user,
    allPlayers,
    setPlayers,
    setActivePlayer,
    setMessages,
    setCurrentWord,
    updatePlayerScore,
  } = useUser(selector);
  const ctx = useCanvas((s) => s.ctx);
  const { setChannel, setTrigger } = useChannel((s) => ({
    setChannel: s.setChannel,
    setTrigger: s.setTrigger,
  }));
  const [showModal, setModal] = useState(false);
  const [showScore, setShowScore] = useState(false);
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
    channel.bind(
      "pusher:member_removed",
      (data: { id: string; info: PlayerInfo }) => {
        console.log(data);
        const members = useUser
          .getState()
          .allPlayers.filter((p) => p.id !== data.info.id);
        setPlayers(members);
      }
    );
    channel.bind("client-message", (data: { message: Message }) => {
      setMessages(data.message);
    });
    channel.bind("client-choosen-player", (data: PlayerInfo) => {
      console.log(data);
      setActivePlayer(data);
      if (data.id === user?.id) {
        setModal(true);
      }
    });
    channel.bind(
      "client-choose-word",
      (data: { word: string; user: PlayerInfo }) => {
        const { word, user } = data;
        word && setCurrentWord(word);
      }
    );
    channel.bind("client-guess-right", (data: { user: PlayerInfo }) => {
      const { user } = data;
      updatePlayerScore(user.id);
    });
    channel.bind("draw", (data: any) => {
      if (data.userId === user?.id) {
        console.log("host");
        return;
      }
      console.log(data);
      drawLine(ctx, data.lx, data.ly, data.x, data.y, data.color);
    });
    return () => pusher.disconnect();
  }, []);

  return (
    <div className="grid grid-cols-4 relative">
      <ChoiceModal showModal={showModal} setModal={setModal} />
      {/* <StartGame setModal={setModal} setShowScore={setShowScore} /> */}
      <ScoreCard setShowScore={setShowScore} showScore={showScore} />
      {/* <Button
        className=" absolute top-20 left-8 z-30"
        onClick={() => updatePlayerScore("id")}
      >
        control
      </Button> */}
      <Canvas />
      <div className="col-start-4 col-end-5 h-screen px-2 pt-2 pb-4">
        <UserList />
        <ChatList />
      </div>
    </div>
  );
}

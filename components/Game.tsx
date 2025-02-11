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
import ScoreCard from "./ScoreCard";
import { drawLine } from "@/lib/canvas";
import { Hint, Status } from "./Status";
import { useToast } from "./ui/use-toast";
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
  const { toast } = useToast();
  const { setCountdown, setStatus, countDown } = useGame((s) => ({
    setCountdown: s.setCountdown,
    setStatus: s.setStatus,
    countDown: s.countdown,
  }));
  const { setChannel, setTrigger } = useChannel((s) => ({
    setChannel: s.setChannel,
    setTrigger: s.setTrigger,
  }));
  const [showModal, setModal] = useState(false);
  const [showScore, setShowScore] = useState(false);
  useEffect(() => {
    const pusher = new Pusher("1cd7fc6be5392cf6c3e3", {
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
      toast({
        title: `${member.name} joined the room`,
        description: "Say hi 👋",
      });
    });
    channel.bind(
      "pusher:member_removed",
      (data: { id: string; info: PlayerInfo }) => {
        toast({
          title: `${data.info.name} left the room`,
          description: "Say bye 😂",
        });
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
      setActivePlayer(data);
      setCountdown(false);
      if (data.id === user?.id) {
        setModal(true);
      }
      setStatus(`${data.name} is choosing a word`);
    });
    channel.bind(
      "client-choose-word",
      (data: { word: string; user: PlayerInfo }) => {
        const { word, user } = data;
        setCurrentWord(word);
        setStatus(`${user.name} is currently drawing`);
        setCountdown(true);
      }
    );
    channel.bind("client-guess-right", (data: { user: PlayerInfo }) => {
      const { user } = data;
      updatePlayerScore(user.id);
    });
    channel.bind("draw", (data: any) => {
      if (data.userId === user?.id) {
        return;
      }
      drawLine(
        useCanvas.getState().ctx,
        data.lx,
        data.ly,
        data.x,
        data.y,
        data.color
      );
    });
    channel.bind("client-show-score", (data: any) => {
      setShowScore(true);
      setTimeout(() => setShowScore(false), 3800);
    });
    return () => pusher.disconnect();
  }, []);

  return (
    <div className="flex relative w-screen h-screen">
      <ChoiceModal showModal={showModal} setModal={setModal} />
      <div className="absolute w-3/4 px-8 top-4 z-50 flex items-center justify-between text-primary font-semibold ">
        <Status />
        <Hint />
      </div>
      <ScoreCard setShowScore={setShowScore} showScore={showScore} />
      <Canvas />
      <div className=" w-1/4 h-screen px-2 pt-2 pb-4">
        <UserList setModal={setModal} setShowScore={setShowScore} />
        <ChatList />
      </div>
    </div>
  );
}

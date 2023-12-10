import { Message, useChannel, useUser } from "@/store";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { SendHorizonal } from "lucide-react";
import { useState } from "react";
import { nanoid } from "nanoid";

export function Message({ message }: { message: Message }) {
  const user = useUser((s) => s.user);
  return (
    <div
      className={`flex gap-2 rounded-md p-2 mb-2 ${
        user?.id === message.id
          ? " bg-primary text-primary-foreground"
          : " bg-accent text-accent-foreground"
      }`}
    >
      <Avatar>
        <AvatarImage
          src={message.avatar}
          className={`border-1 rounded-full p-1${
            user?.id === message.id ? "border-accent" : "border-primary"
          }`}
        />
      </Avatar>
      <div className=" flex flex-col gap-1">
        <p className=" text-sm font-medium opacity-90">{message.name}</p>
        <p className=" text-base">{message.message}</p>
      </div>
    </div>
  );
}

export default function ChatList() {
  const messages = useUser((s) => s.allMessages);
  return (
    <div className=" lg:h-[380px] flex flex-col justify-between bg-card text-card-foreground rounded-md p-2 shadow-sm w-full gap-2">
      <ScrollArea className=" w-full h-full relative">
        {messages.length ? (
          messages.map((z) => <Message message={z} key={z.messageId} />)
        ) : (
          <p className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-semibold opacity-80">
            No messages right now
          </p>
        )}
      </ScrollArea>
      <SendMessage />
    </div>
  );
}

export function SendMessage() {
  const [text, setText] = useState("");
  const user = useUser((s) => s.user);
  const channel = useChannel((s) => s.channel);
  const canTrigger = useChannel((s) => s.canTrigger);
  const handler = () => {
    if (!text || !canTrigger || !channel) return;
    const message: Message = {
      avatar: user?.avatar!,
      host: user?.host!,
      id: user?.id!,
      message: text,
      messageId: nanoid(),
      name: user?.name!,
      score: user?.score!,
      time: Date.now(),
    };
    channel.trigger("client-message", {
      message,
    });
  };
  return (
    <div className=" flex gap-2">
      <Input
        type="text"
        value={text}
        placeholder="Say hi to your friends"
        onChange={(e) => setText(e.target.value)}
      />
      <Button variant={"default"} size={"icon"} onClick={handler}>
        <SendHorizonal size={16} />
      </Button>
    </div>
  );
}
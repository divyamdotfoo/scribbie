import { type Message, useChannel, useUser } from "@/store";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { SendHorizonal } from "lucide-react";
import { useState } from "react";
import { nanoid } from "nanoid";
import { patrick } from "@/app/fonts";
import { useToast } from "./ui/use-toast";
export function Message({ message }: { message: Message }) {
  const { currentWord, user } = useUser((s) => ({
    user: s.user,
    currentWord: s.currentWord,
  }));
  return (
    <p className={patrick.className}>
      <span style={{ color: message.color }}>
        {message.id === user?.id
          ? "You : "
          : `${message.name.toLowerCase()} : `}
      </span>
      <span className=" opacity-70">{message.message}</span>
    </p>
  );
}

export default function ChatList() {
  const messages = useUser((s) => s.allMessages);
  return (
    <div className=" h-2/3 bg-card text-card-foreground rounded-md p-4 shadow-sm flex flex-col items-center justify-center">
      <ScrollArea className="w-full h-full relative p-1">
        {messages.length ? (
          messages.map((z) => <Message message={z} key={z.messageId} />)
        ) : (
          <p className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-semibold opacity-80">
            No messages
          </p>
        )}
      </ScrollArea>
      <SendMessage />
    </div>
  );
}

export function SendMessage() {
  const [text, setText] = useState("");
  const { toast } = useToast();
  const { user, currentWord, setMessages, updateScore } = useUser((s) => ({
    user: s.user,
    setMessages: s.setMessages,
    currentWord: s.currentWord,
    updateScore: s.updatePlayerScore,
  }));

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
      color: user?.color!,
    };
    channel.trigger("client-message", {
      message: {
        ...message,
        message:
          text.toLowerCase() === currentWord?.toLowerCase()
            ? `${user?.name} guessed the answer`
            : text,
      },
    });
    setMessages(message);
    setText("");
    if (text.toLowerCase() === currentWord?.toLowerCase()) {
      channel.trigger("client-guess-right", {
        user,
      });
      if (user) updateScore(user?.id);
    }
  };
  return (
    <div className=" w-full relative pt-2">
      <Input
        type="text"
        value={text}
        placeholder="Say hi to your friends"
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handler();
          }
        }}
      />
      <button
        onClick={handler}
        disabled={text.length > 25}
        className="absolute right-3 top-1/2 -translate-y-1"
      >
        <SendHorizonal size={16} className="text-primary" />
      </button>
    </div>
  );
}

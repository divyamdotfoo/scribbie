import { motion, AnimatePresence } from "framer-motion";
import { PlayerInfo, useUser } from "@/store";
import { Avatar } from "./ui/avatar";
import { AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { Skeleton } from "./ui/skeleton";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Button } from "./ui/button";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function UserList() {
  const users = useUser((s) => s.allPlayers);
  return (
    <ScrollArea className="p-2 bg-card text-card-foreground rounded-md shadow-sm h-1/3 mb-2 ">
      <div className=" flex items-center justify-between w-full pb-1 px-2">
        <p className=" text-sm font-semibold text-primary">Players</p>
        <Invite />
      </div>
      <div className=" grid grid-cols-4 gap-2">
        <AnimatePresence>
          {users.map((u) => (
            <User user={u} key={u.id} />
          ))}
        </AnimatePresence>
      </div>
    </ScrollArea>
  );
}
export function User({ user }: { user: PlayerInfo }) {
  return (
    <motion.div
      key={user.id}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      className=" flex flex-col items-center justify-center rounded-lg p-3 cursor-pointer bg-background hover:bg-accent transition-all"
    >
      <Avatar className=" w-8 h-8">
        <AvatarFallback>{user.name[0]}</AvatarFallback>
        <AvatarImage src={user.avatar} />
      </Avatar>
      <p className=" text-xs opacity-70 pt-[2px]">{user.name}</p>
    </motion.div>
  );
}

function Invite() {
  const [click, setClick] = useState(false);
  const path = usePathname().split("/");
  const handler = () => {
    setClick(true);
    const id = path[path.length - 1];
    window.navigator.clipboard.writeText(
      ` ${window.location.origin}/room/${id}`
    );
    setTimeout(() => setClick(false), 2000);
  };
  return (
    <Button
      onClick={handler}
      variant={"link"}
      size={"sm"}
      className="flex items-center gap-1"
    >
      <span>Invite</span> {click ? <Check size={12} /> : <Copy size={12} />}
    </Button>
  );
}

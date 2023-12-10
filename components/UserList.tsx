import { PlayerInfo, useUser } from "@/store";
import { Avatar } from "./ui/avatar";
import { AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { Skeleton } from "./ui/skeleton";

export default function UserList() {
  const users = useUser((s) => s.allPlayers);
  return (
    <ScrollArea className=" p-4 bg-card text-card-foreground rounded-md shadow-sm w-full lg:h-[240px] mb-4">
      {users.length ? (
        users.map((z) => <User user={z} key={z.id} />)
      ) : (
        <div className=" flex flex-col gap-3">
          <Skeleton className=" w-full h-16 rounded-lg" />
          <Skeleton className=" w-full h-16 rounded-lg" />
          <Skeleton className=" w-full h-16 rounded-lg" />
          <Skeleton className=" w-full h-16 rounded-lg" />
        </div>
      )}
    </ScrollArea>
  );
}
export function User({ user }: { user: PlayerInfo }) {
  return (
    <div className=" flex justify-between items-center bg-accent text-accent-foreground mb-2 rounded-lg p-2">
      <div className=" flex items-center gap-2">
        <Avatar>
          <AvatarImage
            src={user.avatar}
            className=" border-2 border-primary rounded-full p-[2px]"
          />
        </Avatar>
        <p className=" text-sm font-semibold opacity-90">{user.name}</p>
      </div>
      <p className=" pr-4 text-primary font-bold opacity-90">{user.score}</p>
    </div>
  );
}

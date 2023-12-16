"use client";
import Game from "@/components/Game";
import { useUser } from "@/store";
import { usePathname, useRouter } from "next/navigation";

export default function Page({ params }: { params: { roomId: string } }) {
  const roomId = params.roomId;
  const user = useUser((s) => s.user);
  const router = useRouter();
  const path = usePathname().split("/");
  if (!user) {
    router.push(`/?tab=join&id=${path[path.length - 1]}`);
    return <div className=" w-screen h-screen bg-background"></div>;
  }
  return (
    <div className="relative">
      <Game roomId={roomId} />
    </div>
  );
}

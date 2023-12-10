"use client";
import Pusher from "pusher-js";
import { useEffect } from "react";
import { generateUserId } from "@/lib";
import { PlayerInfo, UserState, useUser } from "@/store";
const selector = (state: UserState) => ({
  user: state.user,
  allPlayers: state.allPlayers,
  setPlayers: state.setPlayers,
});
export default function Game({ roomId }: { roomId: string }) {
  const { user, allPlayers, setPlayers } = useUser(selector);

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
    channel.bind("pusher:subscription_succeeded", (data: any) => {
      const members = Object.values(data.members) as PlayerInfo[];
      setPlayers(members);
    });

    channel.bind("pusher:member_added", (data: any) => {
      const member = data.info as PlayerInfo;
      setPlayers(member);
    });
    channel.bind("pusher:member_removed", (data: any) => {
      console.log(data);
      const members = allPlayers.filter((p) => p.id !== data.id);
      setPlayers(members);
    });
    return () => pusher.disconnect();
  }, []);
  return (
    <div>
      {allPlayers.map((z) => (
        <p>{z.name}</p>
      ))}
    </div>
  );
}

/**
 * 
 * 
 * 
 * {
    "members": {
        "NUKvgLh6": {
            "id": "NUKvgLh6",
            "avatar": "https://api.dicebear.com/7.x/lorelei/svg?seed=kyunPG02",
            "name": "divyam",
            "score": 0,
            "host": true
        },
        "kkJ1_PyL": {
            "id": "kkJ1_PyL",
            "avatar": "https://api.dicebear.com/7.x/lorelei/svg?seed=lbVSj_QC",
            "name": "gupta",
            "score": 0,
            "host": false
        }
    },
    "count": 2,
    "myID": "kkJ1_PyL",
    "me": {
        "id": "kkJ1_PyL",
        "info": {
            "id": "kkJ1_PyL",
            "avatar": "https://api.dicebear.com/7.x/lorelei/svg?seed=lbVSj_QC",
            "name": "gupta",
            "score": 0,
            "host": false
        }
    }
}
 */

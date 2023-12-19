import { Game, PlayerInfo, useChannel, useGame, useUser } from "@/store";
import { Button } from "./ui/button";
import { Dispatch, SetStateAction } from "react";
import { setRequestMeta } from "next/dist/server/request-meta";
import { Timer } from "./Timer";
const selector = (s: Game) => ({
  setGame: s.setGame,
  setCountdown: s.setCountdown,
  started: s.started,
  playedPlayers: s.playedPlayers,
  setPlayedPlayers: s.setPlayedPlayers,
  empty: s.emptyPlayed,
});
export default function StartGame({
  setModal,
  setShowScore,
}: {
  setModal: Dispatch<SetStateAction<boolean>>;
  setShowScore: Dispatch<SetStateAction<boolean>>;
}) {
  const {
    setCountdown,
    setGame,
    started,
    playedPlayers,
    setPlayedPlayers,
    empty,
  } = useGame(selector);
  const { allPlayers, user, setActivePlayer } = useUser((s) => ({
    user: s.user,
    allPlayers: s.allPlayers,
    setActivePlayer: s.setActivePlayer,
  }));
  const { canTrigger, channel } = useChannel((s) => ({
    channel: s.channel,
    canTrigger: s.canTrigger,
  }));
  const { setStatus } = useGame((s) => ({ setStatus: s.setStatus }));
  //not showing the start game btn to players other than host
  if (!user?.host) return <Timer />;

  const choosePlayer = (
    played: PlayerInfo[]
  ): {
    choosen: PlayerInfo;
  } => {
    let choosen: PlayerInfo;
    if (allPlayers.length === played.length) {
      empty();
      choosen = allPlayers[Math.floor(Math.random() * allPlayers.length)];
      setPlayedPlayers(choosen);
    } else {
      const list = allPlayers.filter((p) => {
        return played.findIndex((z) => z.id === p.id) < 0;
      });
      choosen = list[Math.floor(Math.random() * list.length)];
      setPlayedPlayers(choosen);
    }
    if (choosen.id === user.id) {
      setActivePlayer(choosen);
      setModal(true);
      setStatus("");
    } else {
      setStatus(`${choosen.name} is choosing a word`);
    }

    channel?.trigger("client-choosen-player", choosen);
    setCountdown(false);
    setTimeout(() => {
      setShowScore(true);
      channel?.trigger("client-show-score", {});
      setTimeout(() => {
        setShowScore(false);
        choosePlayer(useGame.getState().playedPlayers);
      }, 4000);
    }, 30000);
    return { choosen };
  };

  const handler = () => {
    setStatus("");
    choosePlayer(useGame.getState().playedPlayers);
    setGame();
    channel?.trigger("client-game-start", {
      message: "start",
    });
  };

  if (!started) {
    return (
      <Button onClick={handler} className=" w-1/2" size={"sm"}>
        Start
      </Button>
    );
  } else return <Timer />;
}

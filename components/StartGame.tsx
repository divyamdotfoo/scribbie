import { Game, PlayerInfo, useChannel, useGame, useUser } from "@/store";
import { Button } from "./ui/button";
import Timer from "./Timer";
import { Dispatch, SetStateAction } from "react";
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

  if (!user?.host) return null;

  const choosePlayer = (
    played: PlayerInfo[]
  ): {
    choosen: PlayerInfo;
  } => {
    let choosen: PlayerInfo;
    if (allPlayers.length === played.length) {
      console.log("length same");
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
    console.log(choosen.name);
    if (choosen.id === user.id) {
      setActivePlayer(choosen);
      setModal(true);
    }
    channel?.trigger("client-choosen-player", choosen);
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
    choosePlayer(useGame.getState().playedPlayers);
    // setGame();
    channel?.trigger("client-game-start", {
      message: "start",
    });
    setCountdown(true);
  };

  if (!started) {
    return (
      <Button onClick={handler} className="absolute top-4 left-4 z-50">
        Start
      </Button>
    );
  } else return <Timer />;
}

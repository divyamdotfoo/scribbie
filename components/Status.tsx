import { useGame, useUser } from "@/store";
export function Status() {
  const { started, status } = useGame((s) => ({
    started: s.started,
    status: s.status,
  }));

  return (
    <p className="text-primary font-bold">{status || "Game not started yet"}</p>
  );
}

export function Hint() {
  const word = useUser((s) => s.currentWord);
  if (!word) {
    return (
      <div className=" flex items-center gap-2">
        {"Scribble".split("").map((z) => (
          <p className=" w-2 border-b-2 font-bold border-primary">{z}</p>
        ))}
      </div>
    );
  }
  return (
    <div className=" flex items-baseline gap-2">
      {word.split("").map((z) => (
        <div className=" w-3 h-[2px] rounded-sm bg-primary"></div>
      ))}
      <p className=" text-primary font-bold">({word.length})</p>
    </div>
  );
}

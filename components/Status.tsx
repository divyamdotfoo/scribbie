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
        {"Scribble".split("").map((z, i) => (
          <p className=" w-2 border-b-2 font-bold border-primary" key={i}>
            {z}
          </p>
        ))}
      </div>
    );
  }
  return (
    <div className=" flex items-baseline gap-2">
      {word.split("").map((z, i) => (
        <div className=" w-3 h-[2px] rounded-sm bg-primary" key={i}></div>
      ))}
      <p className=" text-primary font-bold">({word.length})</p>
    </div>
  );
}

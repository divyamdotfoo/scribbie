import { useGame } from "@/store";
import { useEffect, useState } from "react";

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
  const { word } = useGame((s) => ({
    word: s.currentWord,
  }));
  if (word?.length) {
    return (
      <div className=" flex items-baseline gap-2">
        {word.split("").map((z) => (
          <div className=" w-3 h-[2px] rounded-sm bg-primary"></div>
        ))}
        <p className=" text-primary font-bold">({word.length})</p>
      </div>
    );
  } else {
    return (
      <div className=" flex items-center gap-2">
        {"Scribble".split("").map((s) => (
          <p className=" text-primary border-b-2 border-primary w-2">{s}</p>
        ))}
      </div>
    );
  }
}

export function Timer() {
  return <p>Timer</p>;
}
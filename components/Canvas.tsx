import { useEffect, useRef, useState } from "react";
import StartGame from "./StartGame";
import { useUser } from "@/store";

export default function Canvas() {
  const [parentContainer, setParent] = useState<HTMLDivElement | null>();
  const parentContainerRef = useRef<HTMLDivElement | null>(null);
  const activePlayer = useUser((s) => s.activePlayer);
  useEffect(() => {
    setParent(parentContainerRef.current);
  }, []);
  return (
    <div
      ref={parentContainerRef}
      className="relative col-start-1 col-end-4 flex items-center justify-center"
    >
      <StartGame />
      <p className=" absolute top-10 left-4 text-black text-xl z-30">{`currently active player: ${activePlayer?.name}`}</p>
      <canvas
        className=" bg-white opacity-90 w-full h-full z-0"
        // width={parentContainer?.clientWidth}
        // height={parentContainer?.clientHeight}
      ></canvas>
    </div>
  );
}

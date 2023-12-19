import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import StartGame from "./StartGame";
import { useCanvas, useGame, useUser } from "@/store";
import { drawLine, getCoordinates } from "@/lib/canvas";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Canvas() {
  const { activePlayer, user } = useUser((s) => ({
    activePlayer: s.activePlayer,
    user: s.user,
  }));
  const { started } = useGame((s) => ({ started: s.started }));
  const path = usePathname().split("/");
  const roomId = path[path.length - 1];
  const canvasEl = useRef<HTMLCanvasElement | null>(null);
  const { ctx, draw, lx, ly, sLx, sLy, setCtx, setDraw } = useCanvas((s) => ({
    ctx: s.ctx,
    draw: s.canDraw,
    setCtx: s.setCtx,
    lx: s.lx,
    ly: s.ly,
    sLx: s.setLx,
    sLy: s.setLy,
    setDraw: s.setDraw,
  }));
  useEffect(() => {
    if (!ctx && canvasEl.current) {
      setCtx(canvasEl.current?.getContext("2d"));
    }
  }, []);
  return (
    <div className="relative w-3/4 flex items-center justify-center p-2">
      <canvas
        ref={canvasEl}
        className={`bg-slate-200 opacity-90 z-0 rounded-md w-full h-full`}
        onMouseMove={(e) => {
          if (draw && ctx) {
            const { x, y } = getCoordinates(
              canvasEl.current,
              e.clientX,
              e.clientY
            );
            drawLine(ctx, lx, ly, x, y, "black");
            fetch("/api/draw", {
              method: "POST",
              body: JSON.stringify({
                lx,
                ly,
                x,
                y,
                color: "black",
                roomId,
                userId: user?.id,
              }),
            });
            sLx(x);
            sLy(y);
          }
        }}
        onMouseDown={(e) => {
          if (!started) setDraw(true);
          else if (activePlayer?.id === user?.id) setDraw(true);
          else setDraw(false);
          const { x, y } = getCoordinates(
            canvasEl.current,
            e.clientX,
            e.clientY
          );
          sLx(x);
          sLy(y);
        }}
        onMouseUp={(e) => {
          setDraw(false);
        }}
        width={canvasEl.current?.parentElement?.clientWidth}
        height={canvasEl.current?.parentElement?.clientHeight}
      />
      {/* <CanvasControl /> */}
    </div>
  );
}

function CanvasControl() {
  return (
    <div className="absolute flex flex-col gap-2 top-1/2 left-3 -translate-y-1/2">
      <ColorBtn color="black" />
      <ColorBtn color="purple" />
      <ColorBtn color="green" />
      <ColorBtn color="red" />
    </div>
  );
}

function ColorBtn({ color }: { color: string }) {
  const setColor = useCanvas((s) => s.setColor);
  return (
    <motion.button
      onClick={() => setColor(color)}
      className={`-rotate-45 rounded-lg w-4 h-8 ${color}`}
    ></motion.button>
  );
}

import { useGame } from "@/store";
import { useEffect, useState } from "react";

export function Timer() {
  const { show } = useGame((s) => ({ show: s.countdown }));
  const { time } = useTimer(show);
  if (!show) return null;
  return <p className=" text-primary font-bold text-xl">{time}s</p>;
}

function useTimer(show: boolean) {
  const [time, setTime] = useState(30);
  useEffect(() => {
    let id: NodeJS.Timeout;
    if (show) {
      id = setInterval(() => {
        setTime((s) => s - 1);
      }, 1000);
      setTimeout(() => {
        clearInterval(id);
      }, 30000);
    } else {
      setTime(30);
    }
    return () => clearInterval(id);
  }, [show]);
  return { time };
}

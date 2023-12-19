import { useUser } from "@/store";
import { AnimatePresence, motion } from "framer-motion";
import { Dispatch, SetStateAction, useEffect } from "react";
import { Avatar, AvatarImage } from "./ui/avatar";

export default function ScoreCard({
  showScore,
  setShowScore,
}: {
  showScore: boolean;
  setShowScore: Dispatch<SetStateAction<boolean>>;
}) {
  const players = useUser((s) => s.allPlayers).sort(
    (a, b) => b.score - a.score
  );
  return (
    <AnimatePresence>
      {showScore && (
        <motion.div
          initial={{ opacity: 0, y: 300, scale: 0 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -300, scale: 0 }}
          className="bg-card text-card-foreground p-3 rounded-md shadow-sm shadow-black flex flex-col gap-3 z-30 w-96 backdrop-blur-sm absolute top-1/3 left-1/4"
        >
          <motion.div
            className=" absolute top-0 h-1 bg-primary rounded-md"
            initial={{ width: 384 }}
            animate={{ width: 0 }}
            transition={{ duration: 4 }}
          ></motion.div>
          <p className="text-primary text-xl font-bold opacity-90  self-center">
            Scorecard
          </p>
          <div className="p-2 flex flex-col gap-2">
            {players.map((p, i) => (
              <motion.div
                key={p.id}
                transition={{ delay: i * 0.2 }}
                initial={{ y: -10 }}
                animate={{ y: 0 }}
                className={` flex w-full rounded-md justify-between items-center px-3 py-1 gap-12 ${
                  i === 0 ? " bg-amber-500" : "bg-accent"
                }`}
              >
                <div className=" flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={p.avatar} />
                  </Avatar>
                  <p
                    className={`${
                      i === 0 ? "text-primary font-bold text-lg" : ""
                    }`}
                  >
                    {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
                  </p>
                </div>
                <p>{p.score}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

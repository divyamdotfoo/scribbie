"use client";
import { useChannel, useGame, useUser } from "@/store";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./ui/button";
import { Dispatch, SetStateAction } from "react";
export function ChoiceModal({
  showModal,
  setModal,
}: {
  showModal: boolean;
  setModal: Dispatch<SetStateAction<boolean>>;
}) {
  const words = useGame((s) => s.allWords);
  const choosenWords = words.sort((z) => Math.random() - 0.5).slice(0, 3);
  const user = useUser((s) => s.user);
  const channel = useChannel((s) => s.channel);
  const handler = (word: string) => {
    setModal(false);
    const data = {
      user,
      word,
    };
    if (channel) {
      channel.trigger("client-choose-word", data);
    }
  };

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          className="p-6 rounded-lg shadow-sm bg-card text-card-foreground absolute z-20 top-1/2"
          initial={{ scale: 0, opacity: 0, y: -10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0, opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-primary font-semibold pb-2 text-xl">
            Its your chance
          </p>
          <p className=" text-sm font-medium opacity-70 pb-8">
            Choose any one word to draw.
          </p>
          <div className=" flex items-center justify-between gap-2">
            {choosenWords.map((z) => (
              <Button onClick={() => handler(z)} key={z}>
                {z}
              </Button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

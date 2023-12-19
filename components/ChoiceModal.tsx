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
  const { words, setTimer } = useGame((s) => ({
    words: s.allWords,
    setTimer: s.setCountdown,
  }));
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
          className="p-6 rounded-lg shadow-sm shadow-black bg-card text-card-foreground absolute z-20 top-1/3 left-1/4"
          initial={{ scale: 0, opacity: 0, y: 200 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0, opacity: 0, y: -200 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className=" absolute top-0 h-1 bg-primary rounded-md"
            initial={{ width: 250 }}
            animate={{ width: 0 }}
            transition={{ duration: 8 }}
          ></motion.div>
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

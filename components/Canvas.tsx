import { useEffect, useRef, useState } from "react";

export default function Canvas() {
  const [parentContainer, setParent] = useState<HTMLDivElement | null>();
  const parentContainerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    setParent(parentContainerRef.current);
  }, []);
  return (
    <div
      ref={parentContainerRef}
      className="relative col-start-1 col-end-4 flex items-center justify-center"
    >
      <canvas
        className=" bg-white opacity-90 w-full h-full"
        // width={parentContainer?.clientWidth}
        // height={parentContainer?.clientHeight}
      ></canvas>
    </div>
  );
}

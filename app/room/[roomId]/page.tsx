import Game from "@/components/Game";

export default function Page({ params }: { params: { roomId: string } }) {
  const roomId = params.roomId;
  return (
    <div>
      <Game roomId={roomId} />
    </div>
  );
}

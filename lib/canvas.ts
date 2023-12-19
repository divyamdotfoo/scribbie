export function drawLine(
  ctx: CanvasRenderingContext2D | null | undefined,
  lastX: number,
  lastY: number,
  clientX: number,
  clientY: number,
  color: string
) {
  if (!ctx) {
    return;
  }
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(clientX, clientY);
  ctx.strokeStyle = "black";
  ctx.stroke();
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.lineWidth = 2;
  return "success";
}
export function getCoordinates(
  canvas: HTMLCanvasElement | null,
  x: number,
  y: number
) {
  if (!canvas) return { x: 0, y: 0 };
  const rec = canvas.getBoundingClientRect();
  return {
    x: x - rec.left,
    y: y - rec.top,
  };
}

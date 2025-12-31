import { useEffect, useRef } from "react";

export default function FloorPlanCanvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // Child position (normalized 0–1)
    const child = { x: 0.48, y: 0.52 };

    // Room labels (manual placement for accuracy)
    const rooms = [
        { name: "Living Room", x: 140, y: 160 },
        { name: "Kitchen", x: 140, y: 350 },
        { name: "Bedroom", x: 140, y: 470 },
        { name: "Hall", x: 260, y: 280 },
        { name: "Bathroom", x: 380, y: 430 },
        { name: "Restricted Area", x: 360, y: 120, restricted: true },
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let frameId: number;

        /* ---------------- WALLS ---------------- */
        const drawWalls = () => {
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 4;
            ctx.lineCap = "round";

            ctx.beginPath();

            // Outer walls
            ctx.moveTo(80, 40);
            ctx.lineTo(420, 40);
            ctx.lineTo(420, 520);
            ctx.lineTo(80, 520);
            ctx.lineTo(80, 40);

            // Inner vertical wall
            ctx.moveTo(220, 40);
            ctx.lineTo(220, 300);

            ctx.moveTo(220, 360);
            ctx.lineTo(220, 520);

            // Inner horizontal wall with door gap
            ctx.moveTo(80, 300);
            ctx.lineTo(160, 300); // door gap
            ctx.moveTo(260, 300);
            ctx.lineTo(420, 300);

            ctx.stroke();
        };

        /* ---------------- ROOM LABELS ---------------- */
        const drawRoomLabels = () => {
            ctx.font = "14px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            rooms.forEach(room => {
                ctx.fillStyle = room.restricted ? "#b91c1c" : "#111";
                ctx.fillText(room.name, room.x, room.y);
            });
        };

        /* ---------------- CHILD ---------------- */
        const drawChild = () => {
            const cx = child.x * canvas.width;
            const cy = child.y * canvas.height;

            // Pulsing ring
            const pulse = 20 + Math.sin(Date.now() / 180) * 5;

            ctx.beginPath();
            ctx.arc(cx, cy, pulse, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(37,99,235,0.6)";
            ctx.lineWidth = 3;
            ctx.stroke();

            // Solid ring
            ctx.beginPath();
            ctx.arc(cx, cy, 16, 0, Math.PI * 2);
            ctx.strokeStyle = "#2563eb";
            ctx.lineWidth = 4;
            ctx.stroke();

            // Center dot
            ctx.beginPath();
            ctx.arc(cx, cy, 6, 0, Math.PI * 2);
            ctx.fillStyle = "#2563eb";
            ctx.fill();
        };

        /* ---------------- TOP TEXT ---------------- */
        const drawHeader = () => {
            ctx.fillStyle = "#111";
            ctx.font = "16px sans-serif";
            ctx.textAlign = "left";
            ctx.fillText("Child – Living Room", 20, 25);
        };

        /* ---------------- PARTIAL RESTRICTED AREA ---------------- */
const drawRestrictedArea = () =>
{
  ctx.fillStyle = "rgba(255, 0, 0, 0.12)";

  ctx.beginPath();

  // Small restricted zone INSIDE the room (top-right corner)
  ctx.rect(280,45,135,150);

  ctx.fill();
};


        /* ---------------- MAIN LOOP ---------------- */
        const loop = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Background
            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            drawWalls();
            drawRoomLabels();
            drawChild();
            drawHeader();
            drawRestrictedArea()

            frameId = requestAnimationFrame(loop);
        };

        loop();

        return () => cancelAnimationFrame(frameId);
    }, []);

    return (
        <div>
            <canvas
                ref={canvasRef}
                width={500}
                height={560}
            />
        </div>
    );
}

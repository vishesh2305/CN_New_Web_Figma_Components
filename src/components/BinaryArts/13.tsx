"use client";

import React, { useEffect, useRef } from "react";

const Thirdteenascii: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = width * 0.45;

    let time = 0;

    const draw = () => {
      // Clear canvas
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);

      // Draw concentric waves
      for (let r = 5; r < maxRadius; r += 4) {
        ctx.beginPath();
        let firstPoint = true;

        for (let angle = 0; angle < Math.PI * 2; angle += 0.03) {
          const wave = Math.sin(angle * 8 + r * 0.1 + time) * 2;
          const x = centerX + (r + wave) * Math.cos(angle);
          const y = centerY + (r + wave) * Math.sin(angle);

          if (firstPoint) {
            ctx.moveTo(x, y);
            firstPoint = false;
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }

      // Yin-Yang background circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, maxRadius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = "#000000";
      ctx.fill();

      // White half
      ctx.beginPath();
      ctx.arc(centerX, centerY, maxRadius * 0.6, -Math.PI / 2, Math.PI / 2, false);
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      // Small top circle (white inside black)
      ctx.beginPath();
      ctx.arc(centerX, centerY - maxRadius * 0.3, maxRadius * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      // Small bottom circle (black inside white)
      ctx.beginPath();
      ctx.arc(centerX, centerY + maxRadius * 0.3, maxRadius * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = "#000000";
      ctx.fill();

      // Small dots
      ctx.beginPath();
      ctx.arc(centerX, centerY - maxRadius * 0.3, maxRadius * 0.1, 0, Math.PI * 2);
      ctx.fillStyle = "#000000";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(centerX, centerY + maxRadius * 0.3, maxRadius * 0.1, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      // Animate
      time += 0.015;
      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      ctx.clearRect(0, 0, width, height);
    };
  }, []);

  return (
    <div
      style={{
        margin: "50px auto",
        background: "#ffffff",
        overflow: "hidden",
        fontFamily: "monospace",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "600px",
        width: "600px", 
        border: "1px solid #ccc",
        borderRadius: "10px",
      }}
    >
      <canvas ref={canvasRef} width={600} height={600} />
    </div>
  );
};

export default Thirdteenascii;
"use client"; 

import React, { useEffect, useRef } from 'react';

const Fiveascii: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = width * 0.45;

    let time = 0;

    const draw = () => {
      ctx.fillStyle = '#ffffff'; 
      ctx.fillRect(0, 0, width, height);

      for (let r = 5; r < maxRadius; r += 3) {
        ctx.beginPath();
        ctx.lineWidth = 0.6;

        for (let angle = 0; angle < Math.PI * 2; angle += 0.02) {
          const wave = Math.sin(angle * 8 + r * 0.1 + time) * 2;
          const x = centerX + (r + wave) * Math.cos(angle);
          const y = centerY + (r + wave) * Math.sin(angle);

          ctx.strokeStyle = '#000000'; 
          ctx.lineTo(x, y);
        }

        ctx.stroke();
      }

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
    <div style={{
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
    }}>
      <canvas
        ref={canvasRef}
        width={600}
        height={600}
      />
    </div>
  );
};

export default Fiveascii;

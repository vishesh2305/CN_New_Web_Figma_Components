"use client";

import React, { useEffect, useRef } from "react";

const Elevenascii: React.FC = () => {
  const canvasRef = useRef<HTMLPreElement>(null);
  const animationRef = useRef<number | null>(null);

useEffect(() => {
  const width = 65;
  const height = 65;

  let grid: string[][] = [];
  let time = 0;

  // Capture ref locally
  const canvas = canvasRef.current;

  const initGrid = () => {
    grid = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => " ")
    );
  };

  const render = () => {
    if (!canvas) return;
    let text = "";
    for (let y = 0; y < height; y++) {
      text += grid[y].join("") + "\n";
    }
    canvas.textContent = text;
  };

  const update = () => {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        grid[y][x] = " ";
      }
    }

    const blockSize = 30;
    const blockX = Math.floor(width / 2 - blockSize / 2);
    const blockY = Math.floor(height / 2 - blockSize / 2);
    const t = time * 0.005;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (
          x >= blockX &&
          x < blockX + blockSize &&
          y >= blockY &&
          y < blockY + blockSize
        ) {
          const innerDist = Math.min(
            x - blockX,
            blockX + blockSize - x,
            y - blockY,
            blockY + blockSize - y
          );
          const erosion = (time * 0.0067) % blockSize;
          grid[y][x] = innerDist > erosion ? "1" : Math.random() > 0.8 ? "1" : "0";
        } else {
          const dx = x - width / 2;
          const dy = y - height / 2;
          const angle = Math.atan2(dy, dx);
          const dist = Math.sqrt(dx * dx + dy * dy);

          const wave = Math.sin(dist * 0.2 - t + angle * 1.5);
          const flow = Math.sin(x * 0.08 + y * 0.04 + t * 0.4);

          if (flow + wave > 0.4) grid[y][x] = "0";
          else if (flow + wave < -0.4) grid[y][x] = "~";
        }
      }
    }

    for (let i = 0; i < 5; i++) {
      let cx = blockX + Math.floor(Math.random() * blockSize);
      let cy = blockY + Math.floor(Math.random() * blockSize);
      const length = Math.floor(Math.random() * 10) + 5;

      for (let j = 0; j < length; j++) {
        if (cx >= 0 && cx < width && cy >= 0 && cy < height) {
          grid[cy][cx] = "0";
        }
        cx += Math.floor(Math.random() * 3) - 1;
        cy += Math.floor(Math.random() * 3) - 1;
      }
    }

    time++;
  };

  const animate = () => {
    update();
    render();
    animationRef.current = requestAnimationFrame(animate);
  };

  initGrid();
  animate();

  return () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (canvas) canvas.textContent = "";
    grid = [];
    time = 0;
  };
}, []);


  return (
    <div
      style={{
        margin: "50px auto",
        background: "#ffffff",
        overflow: "hidden",
        fontFamily: "monospace",
        fontSize: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "600px",
        width: "600px",
        border: "1px solid #ccc",
        borderRadius: "10px",
      }}
    >
      <pre
        ref={canvasRef}
        style={{
          margin: 0,
          lineHeight: "0.85",
          letterSpacing: "0.05em",
          color: "#000000",
          userSelect: "none",
        }}
      />
    </div>
  );
};

export default Elevenascii;
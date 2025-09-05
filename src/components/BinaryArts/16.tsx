"use client";

import React, { useEffect, useRef } from "react";

const Sixteenthascii: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = 65;
    const height = 65;

    let grid: string[][] = [];
    let time = 0;
    let animationFrameId: number;

    const initGrid = () => {
      grid = Array.from({ length: height }, () =>
        Array.from({ length: width }, () => " ")
      );
    };

    const render = () => {
      if (!canvas) return;
      let html = "";
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          html += grid[y][x];
        }
        html += "<br>";
      }
      canvas.innerHTML = html;
    };

    const update = () => {
      initGrid();

      const t = time * 0.007;
      const centerX = width / 2;
      const centerY = height / 2;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const dx = x - centerX;
          const dy = y - centerY;
          
          const hexX = dx * 0.866 - dy * 0.5;
          const hexY = dy;
          
          const cellX = Math.floor(hexX / 8);
          const cellY = Math.floor(hexY / 8);
          
          const cellPhase = (cellX + cellY * 1.618 + t) * 2;
          const cellValue = Math.sin(cellPhase);
          
          const localX = hexX - cellX * 8;
          const localY = hexY - cellY * 8;
          const localDist = Math.sqrt(localX * localX + localY * localY);
          
          const breathing = Math.sin(t * 0.5 + cellX + cellY) * 2 + 3;
          
          if (localDist < breathing && cellValue > 0) {
            grid[y][x] = "1";
          } else if (localDist < breathing && cellValue <= 0) {
            grid[y][x] = "0";
          } else if (localDist < breathing + 1) {
            grid[y][x] = Math.random() > 0.8 ? "." : " ";
          }
        }
      }

      const scanLine = Math.floor((Math.sin(t * 0.8) + 1) * height / 2);
      for (let x = 0; x < width; x++) {
        if (scanLine >= 0 && scanLine < height) {
          grid[scanLine][x] = x % 2 === 0 ? "=" : "-";
        }
      }

      const pulseX = Math.floor((Math.cos(t * 0.6) + 1) * width / 2);
      for (let y = 0; y < height; y++) {
        if (pulseX >= 0 && pulseX < width) {
          grid[y][pulseX] = y % 2 === 0 ? "|" : "!";
        }
      }

      time++;
    };

    const animate = () => {
      update();
      render();
      animationFrameId = requestAnimationFrame(animate);
    };

    initGrid();
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (canvas) canvas.innerHTML = "";
      grid = [];
      time = 0;
    };
  }, []);

  return (
    <div
      style={{
        margin: "50px auto", 
        overflow: "hidden",
        fontFamily: "monospace",
        fontSize: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "600px", 
        width: "600px",  
        borderRadius: "10px", 
      }}
    >
      <div
        style={{
          padding: "20px",
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          ref={canvasRef}
          style={{
            lineHeight: "0.85",
            letterSpacing: "0.05em",
            color: "#ffffff", 
            userSelect: "none",
            width: "100%",
            height: "100%",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        />
      </div>
    </div>
  );
};

export default Sixteenthascii;
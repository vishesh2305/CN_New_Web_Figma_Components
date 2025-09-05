"use client";

import React, { useEffect, useRef } from "react";

const Fourteenthascii: React.FC = () => {
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

      const centerX = width / 2;
      const centerY = height / 2;
      const t = time * 0.008;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const dx = x - centerX;
          const dy = y - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx);
          
          const spiral = Math.sin(dist * 0.3 - t * 2 + angle * 3);
          const pulse = Math.sin(dist * 0.15 - t);
          
          if (spiral + pulse > 0.3) {
            grid[y][x] = "1";
          } else if (spiral + pulse < -0.3) {
            grid[y][x] = "0";
          } else {
            grid[y][x] = Math.random() > 0.7 ? "." : " ";
          }
        }
      }

      for (let arm = 0; arm < 4; arm++) {
        const armAngle = (arm * Math.PI / 2) + t;
        for (let r = 5; r < 25; r++) {
          const x = Math.floor(centerX + Math.cos(armAngle) * r);
          const y = Math.floor(centerY + Math.sin(armAngle) * r);
          if (x >= 0 && x < width && y >= 0 && y < height) {
            grid[y][x] = r % 3 === 0 ? "1" : "0";
          }
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
            color: "#FFFFFF", 
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

export default Fourteenthascii;
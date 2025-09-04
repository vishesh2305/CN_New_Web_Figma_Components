"use client";

import React, { useEffect, useRef } from 'react';

const Twoascii: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = 80;
    const height = 40;
    let grid: string[][] = [];
    let time = 0;
    let animationFrameId: number;

    function initGrid() {
      grid = [];
      for (let y = 0; y < height; y++) {
        const row: string[] = [];
        for (let x = 0; x < width; x++) {
          row.push(' ');
        }
        grid.push(row);
      }
    }

    function render() {
      let html = '';
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          html += grid[y][x];
        }
        html += '<br>';
      }
      canvasRef.current!.innerHTML = html;
    }

    function update() {
      initGrid();
      const t = time * 0.008;
      const centerY = height / 2;

      for (let x = 0; x < width; x++) {
        const wave1 = Math.sin(x * 0.15 + t) * 8;
        const wave2 = Math.cos(x * 0.12 - t * 1.2) * 6;

        const y1 = Math.floor(centerY + wave1);
        const y2 = Math.floor(centerY + wave2);

        for (let y = 0; y < height; y++) {
          const dist1 = Math.abs(y - y1);
          const dist2 = Math.abs(y - y2);

          if (dist1 <= 1) {
            grid[y][x] = dist1 === 0 ? '~' : wave1 > 0 ? '∴' : '∵';
          }

          if (dist2 <= 1 && grid[y][x] === ' ') {
            grid[y][x] = dist2 === 0 ? '≈' : wave2 > 0 ? '·' : '∘';
          }

          if (dist1 <= 1 && dist2 <= 1) {
            grid[y][x] = '◦';
          }
        }

        const particleY = Math.floor(centerY + (wave1 + wave2) / 3);
        if (particleY >= 0 && particleY < height && Math.random() > 0.7) {
          if (grid[particleY][x] === ' ') {
            grid[particleY][x] = '•';
          }
        }
      }

      for (let x = 0; x < width; x++) {
        if (grid[Math.floor(centerY)][x] === ' ') {
          if (x % 8 === Math.floor(time / 3) % 8) {
            grid[Math.floor(centerY)][x] = '─';
          }
        }
      }

      time++;
    }

    function animate() {
      update();
      render();
      animationFrameId = requestAnimationFrame(animate);
    }

    initGrid();
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
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
      <div
        ref={canvasRef}
        style={{
          lineHeight: "1.2",
          letterSpacing: "0.1em",
          color: "#000000", 
          userSelect: "none",
          fontSize: "10px",
        }}
      />
    </div>
  );
};

export default Twoascii;

"use client";

import React, { useEffect, useRef } from "react";

interface RibbonSegment {
  x: number;
  y: number;
  angle: number;
  width: number;
  height: number;
  depth: number;
}

class RibbonStrip {
  canvas: HTMLCanvasElement;
  segments: RibbonSegment[] = [];
  segmentCount = 30;
  width = 100;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.initialize();
  }

  initialize() {
    this.segments = [];
    for (let i = 0; i < this.segmentCount; i++) {
      this.segments.push({
        x: 0,
        y: 0,
        angle: 0,
        width: this.width,
        height: 20,
        depth: 0,
      });
    }
  }

  update(time: number) {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    for (let i = 0; i < this.segments.length; i++) {
      const t = i / (this.segments.length - 1);
      const segment = this.segments[i];
      const smoothTime = time * 0.25;
      const baseAngle = t * Math.PI * 6 + smoothTime;
      const foldPhase = Math.sin(smoothTime * 0.01 + t * Math.PI * 4);
      const heightPhase = Math.cos(smoothTime * 0.00375 + t * Math.PI * 3);
      const radius = 120 + foldPhase * 60;

      segment.x = centerX + Math.cos(baseAngle) * radius;
      segment.y = centerY + Math.sin(baseAngle) * radius + heightPhase * 30;
      segment.angle = baseAngle + foldPhase * Math.PI * 0.5;
      segment.width = this.width * (1 + foldPhase * 0.3);
      segment.depth = Math.sin(baseAngle + time * 0.15);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = 1.5;
    ctx.setLineDash([2, 2]);

    const sortedSegments = [...this.segments].sort((a, b) => {
      const threshold = 0.1;
      return Math.abs(a.depth - b.depth) > threshold ? a.depth - b.depth : 0;
    });

    for (let i = 0; i < sortedSegments.length - 1; i++) {
      const current = sortedSegments[i];
      const next = sortedSegments[i + 1];

      ctx.save();
      ctx.beginPath();

      const cos1 = Math.cos(current.angle);
      const sin1 = Math.sin(current.angle);
      const cos2 = Math.cos(next.angle);
      const sin2 = Math.sin(next.angle);

      const p1 = {
        x: current.x - (sin1 * current.width) / 2,
        y: current.y + (cos1 * current.width) / 2,
      };
      const p2 = {
        x: current.x + (sin1 * current.width) / 2,
        y: current.y - (cos1 * current.width) / 2,
      };
      const p3 = {
        x: next.x + (sin2 * next.width) / 2,
        y: next.y - (cos2 * next.width) / 2,
      };
      const p4 = {
        x: next.x - (sin2 * next.width) / 2,
        y: next.y + (cos2 * next.width) / 2,
      };

      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.lineTo(p4.x, p4.y);
      ctx.closePath();

      const depthFactor = (current.depth + 1) * 0.5;
      const opacity = 0.6 + depthFactor * 0.4;

      ctx.strokeStyle = `rgba(40, 40, 40, ${opacity})`;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(p2.x, p2.y);
      ctx.lineTo(p4.x, p4.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(current.x, current.y);
      ctx.lineTo(next.x, next.y);
      ctx.strokeStyle = `rgba(80, 80, 80, ${opacity * 0.7})`;
      ctx.stroke();

      ctx.restore();
    }

    for (let i = 0; i < sortedSegments.length; i++) {
      const segment = sortedSegments[i];
      const cos = Math.cos(segment.angle);
      const sin = Math.sin(segment.angle);

      const p1 = {
        x: segment.x - (sin * segment.width) / 2,
        y: segment.y + (cos * segment.width) / 2,
      };
      const p2 = {
        x: segment.x + (sin * segment.width) / 2,
        y: segment.y - (cos * segment.width) / 2,
      };

      const depthFactor = (segment.depth + 1) * 0.5;
      const opacity = 0.7 + depthFactor * 0.3;

      ctx.beginPath();
      ctx.arc(p1.x, p1.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p2.x, p2.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(segment.x, segment.y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(40, 40, 40, ${opacity})`;
      ctx.fill();
    }

    ctx.setLineDash([]);
  }
}

const Tenthascii: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 550;
    canvas.height = 550;

    const ribbon = new RibbonStrip(canvas);
    let time = 0;
    let animationFrameId: number;

    const animate = () => {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.00125;
      ribbon.update(time);
      ribbon.draw(ctx);

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, []);

  return (
    <div
    style={{
    margin: "50px auto",
    background: "#FFFFFF",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "600px",
    width: "600px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    position: "relative",
    }}

    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "550px",
          height: "550px",
        }}
      />
    </div>
  );
};

export default Tenthascii;
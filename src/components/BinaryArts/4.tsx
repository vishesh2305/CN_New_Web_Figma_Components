"use client";

import React, { useEffect, useRef } from 'react';

const Fourascii: React.FC = () => {
    const canvasRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const width = 90;
        const height = 45;
        let grid: string[][] = [];
        let time = 0;
        let animationFrameId: number;
        
        const bambooStems = [
            { x: 15, height: 35, phase: 0 },
            { x: 25, height: 40, phase: 0.5 },
            { x: 40, height: 32, phase: 1.2 },
            { x: 52, height: 38, phase: 2.1 },
            { x: 65, height: 36, phase: 0.8 },
            { x: 75, height: 33, phase: 1.7 }
        ];
        
        function initGrid() {
            grid = [];
            for (let y = 0; y < height; y++) {
                const row = [];
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
            
            const t = time * 0.004;
            const windStrength = Math.sin(t * 2) * 0.5 + Math.cos(t * 1.3) * 0.3;
            
            bambooStems.forEach(stem => {
                const baseX = stem.x;
                const stemHeight = stem.height;
                
                for (let segment = 0; segment < stemHeight; segment++) {
                    const y = height - 1 - segment;
                    const flexibility = segment / stemHeight;
                    const sway = Math.sin(t * 1.5 + stem.phase) * windStrength * flexibility * 8;
                    const x = Math.floor(baseX + sway);
                    
                    if (x >= 0 && x < width && y >= 0 && y < height) {
                        if (segment === 0) {
                            grid[y][x] = '▓'; 
                        } else if (segment % 8 === 0) {
                            grid[y][x] = '◆'; 
                        } else if (flexibility > 0.8) {
                            grid[y][x] = sway > 0 ? '/' : (sway < -0.5 ? '\\' : '|');
                        } else if (flexibility > 0.5) {
                            grid[y][x] = Math.abs(sway) > 1 ? (sway > 0 ? '/' : '\\') : '│';
                        } else {
                            grid[y][x] = '║';
                        }
                    }
                    
                    if (segment > stemHeight * 0.6 && segment % 3 === 0) {
                        const leafSway = sway + Math.sin(t * 3 + segment) * 2;
                        const leafX = Math.floor(x + leafSway);
                        if (leafX >= 0 && leafX < width - 1) {
                            if (Math.random() > 0.3) {
                                grid[y][leafX + (leafSway > 0 ? 1 : -1)] = leafSway > 0 ? '>' : '<';
                            }
                        }
                    }
                }
            });
            
            for (let i = 0; i < 30; i++) {
                const x = Math.floor((time * 2 + i * 10) % (width + 20)) - 10;
                const y = Math.floor(Math.random() * height * 0.6);
                const windPhase = (x + time) * 0.1;
                
                if (x >= 0 && x < width && y >= 0 && y < height) {
                    if (Math.sin(windPhase) > 0.7 && grid[y][x] === ' ') {
                        grid[y][x] = '·';
                    } else if (Math.sin(windPhase) > 0.5 && grid[y][x] === ' ') {
                        grid[y][x] = '˙';
                    }
                }
            }
            
            for (let x = 0; x < width; x++) {
                if (grid[height - 1][x] === ' ') {
                    grid[height - 1][x] = Math.random() > 0.7 ? '▪' : '▫';
                }
            }
            
            if (Math.floor(time / 200) % 2 === 0 && time % 200 > 50 && time % 200 < 150) {
                const message = "bend but never break";
                const startX = Math.floor((width - message.length) / 2);
                const y = 5;
                for (let i = 0; i < message.length; i++) {
                    if (startX + i >= 0 && startX + i < width && grid[y][startX + i] === ' ') {
                        grid[y][startX + i] = message[i];
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
        <div style={{ 
            margin: "50px auto", 
            background: '#ffffff', 
            overflow: 'hidden',
            fontFamily: 'monospace',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '600px',
            width: '600px', 
            border: "1px solid #ccc",
            borderRadius: "10px"
        }}>
            <div 
                ref={canvasRef}
                style={{
                    lineHeight: '1.1',
                    letterSpacing: '0.06em',
                    color: '#000000',
                    userSelect: 'none',
                    fontSize: '10px'
                }}
            />
        </div>
    );
};

export default Fourascii;

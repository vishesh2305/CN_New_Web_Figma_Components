"use client";

import React, { useEffect, useRef } from 'react';

const Threeascii: React.FC = () => {
    const canvasRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const width = 70;
        const height = 50;
        let grid: string[][] = [];
        let time = 0;
        let animationFrameId: number;
        
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
            
            const t = time * 0.006;
            const centerX = width / 2;
            const centerY = height / 2;
            
            for (let arm = 0; arm < 3; arm++) {
                const armOffset = (arm * Math.PI * 2) / 3;
                
                for (let i = 0; i < 200; i++) {
                    const radius = i * 0.2;
                    const angle = i * 0.15 + t + armOffset;
                    
                    const x = Math.floor(centerX + Math.cos(angle) * radius);
                    const y = Math.floor(centerY + Math.sin(angle) * radius * 0.6);
                    
                    if (x >= 0 && x < width && y >= 0 && y < height) {
                        let symbol = ' ';
                        const distFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
                        
                        if (distFromCenter < 3) {
                            symbol = '◯'; 
                        } else if (distFromCenter < 8) {
                            symbol = '○';
                        } else if (distFromCenter < 15) {
                            symbol = Math.random() > 0.3 ? '∘' : '·';
                        } else if (distFromCenter < 22) {
                            symbol = Math.random() > 0.4 ? '.' : '∶';
                        } else {
                            symbol = Math.random() > 0.7 ? '⋅' : ' ';
                        }
                        
                        const ageFactor = (i + time) % 100;
                        if (ageFactor > 80) {
                            symbol = Math.random() > 0.6 ? symbol : ' ';
                        }
                        
                        grid[y][x] = symbol;
                    }
                }
            }
            
            for (let i = 0; i < 20; i++) {
                const x = Math.floor(Math.random() * width);
                const y = Math.floor(Math.random() * height);
                const phase = (x + y + time) * 0.1;
                
                if (Math.sin(phase) > 0.8 && grid[y][x] === ' ') {
                    grid[y][x] = '✦';
                } else if (Math.sin(phase) > 0.6 && grid[y][x] === ' ') {
                    grid[y][x] = '∗';
                }
            }
            
            const cx = Math.floor(centerX);
            const cy = Math.floor(centerY);
            if (cx >= 0 && cx < width && cy >= 0 && cy < height) {
                grid[cy][cx] = '⦿';
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
                    lineHeight: '1.0',
                    letterSpacing: '0.08em',
                    color: '#000000', 
                    userSelect: 'none',
                    fontSize: '10px'
                }}
            />
        </div>
    );
};

export default Threeascii;

"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Tenthascii: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    const dpr = window.devicePixelRatio || 1;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setPixelRatio(Math.min(dpr, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0xffffff);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x404040);
    const directionalLight = new THREE.DirectionalLight(0x808080, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(ambientLight, directionalLight);

    const material = new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.6 });

    const createCircuitBoard = (): THREE.LineSegments => {
      const geometry = new THREE.BufferGeometry();
      const vertices: number[] = [];
      const boardSize = 8;

      vertices.push(
        -boardSize/2, 0, -boardSize/2, boardSize/2, 0, -boardSize/2,
        boardSize/2, 0, -boardSize/2, boardSize/2, 0, boardSize/2,
        boardSize/2, 0, boardSize/2, -boardSize/2, 0, boardSize/2,
        -boardSize/2, 0, boardSize/2, -boardSize/2, 0, -boardSize/2
      );

      for (let i = -3; i <= 3; i++) {
        vertices.push(-boardSize/2 + 1, 0.1, i, boardSize/2 - 1, 0.1, i);
        vertices.push(i, 0.1, -boardSize/2 + 1, i, 0.1, boardSize/2 - 1);
      }

      const addIC = (x: number, z: number, width: number, height: number, componentHeight: number) => {
        vertices.push(
          x - width/2, 0, z - height/2, x + width/2, 0, z - height/2,
          x + width/2, 0, z - height/2, x + width/2, 0, z + height/2,
          x + width/2, 0, z + height/2, x - width/2, 0, z + height/2,
          x - width/2, 0, z + height/2, x - width/2, 0, z - height/2,

          x - width/2, 0, z - height/2, x - width/2, componentHeight, z - height/2,
          x + width/2, 0, z - height/2, x + width/2, componentHeight, z - height/2,
          x + width/2, 0, z + height/2, x + width/2, componentHeight, z + height/2,
          x - width/2, 0, z + height/2, x - width/2, componentHeight, z + height/2,

          x - width/2, componentHeight, z - height/2, x + width/2, componentHeight, z - height/2,
          x + width/2, componentHeight, z - height/2, x + width/2, componentHeight, z + height/2,
          x + width/2, componentHeight, z + height/2, x - width/2, componentHeight, z + height/2,
          x - width/2, componentHeight, z + height/2, x - width/2, componentHeight, z - height/2
        );
      };

      addIC(0, 0, 2, 2, 0.5);  
      addIC(-2.5, -2.5, 1, 1.5, 0.3);  
      addIC(2.5, -2.5, 1, 1.5, 0.3);   
      addIC(-2.5, 2.5, 1.5, 1, 0.3);   
      addIC(2.5, 2.5, 1.5, 1, 0.3);    

      const addCapacitor = (x: number, z: number) => {
        const segments = 8;
        const radius = 0.2;
        const height = 0.8;
        for (let i = 0; i < segments; i++) {
          const angle1 = (i / segments) * Math.PI * 2;
          const angle2 = ((i + 1) / segments) * Math.PI * 2;
          vertices.push(
            x + Math.cos(angle1) * radius, 0, z + Math.sin(angle1) * radius,
            x + Math.cos(angle2) * radius, 0, z + Math.sin(angle2) * radius,
            x + Math.cos(angle1) * radius, 0, z + Math.sin(angle1) * radius,
            x + Math.cos(angle1) * radius, height, z + Math.sin(angle1) * radius
          );
        }
      };

      addCapacitor(-1.5, 0.5);
      addCapacitor(1.5, 0.5);
      addCapacitor(-1.5, -0.5);
      addCapacitor(1.5, -0.5);

      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      return new THREE.LineSegments(geometry, material);
    };

    const circuitBoard = createCircuitBoard();
    scene.add(circuitBoard);

    camera.position.set(8, 8, 8);
    camera.lookAt(0, 0, 0);

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      circuitBoard.rotation.y += 0.004;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      scene.traverse((object) => {
        if ((object as THREE.Mesh).geometry) (object as THREE.Mesh).geometry.dispose();
        if ((object as THREE.Mesh).material) {
          const mat = (object as THREE.Mesh).material;
          if (Array.isArray(mat)) mat.forEach(m => m.dispose());
          else mat.dispose();
        }
      });
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        margin: 0,
        background: '#FFFFFF',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '550px',
        width: '550px',
        position: 'relative',
      }}
    />
  );
};

export default Tenthascii;
"use client"; 

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';


const Sixascii: React.FC = () => {
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

    const createWheel = (): THREE.LineSegments => {
      const geometry = new THREE.BufferGeometry();
      const vertices: number[] = [];
      const spokes = 30;
      const radius = 8;
      const hubRadius = 1;

      for (let i = 0; i < spokes; i++) {
        const angle = (i / spokes) * Math.PI * 2;
        const nextAngle = ((i + 1) / spokes) * Math.PI * 2;

        vertices.push(
          Math.cos(angle) * hubRadius, 0, Math.sin(angle) * hubRadius,
          Math.cos(nextAngle) * hubRadius, 0, Math.sin(nextAngle) * hubRadius
        );

        vertices.push(
          Math.cos(angle) * hubRadius, 0, Math.sin(angle) * hubRadius,
          Math.cos(angle) * radius, 0, Math.sin(angle) * radius
        );
      }

      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      return new THREE.LineSegments(geometry, material);
    };

    const createVessel = (): THREE.LineSegments => {
      const geometry = new THREE.BufferGeometry();
      const vertices: number[] = [];
      const layers = 20;
      const pointsPerLayer = 16;

      for (let i = 0; i <= layers; i++) {
        const y = i - layers / 2;
        const radius = 3 * Math.sin(Math.PI * (i / layers));

        for (let j = 0; j < pointsPerLayer; j++) {
          const angle1 = (j / pointsPerLayer) * Math.PI * 2;
          const angle2 = ((j + 1) / pointsPerLayer) * Math.PI * 2;

          vertices.push(
            Math.cos(angle1) * radius, y, Math.sin(angle1) * radius,
            Math.cos(angle2) * radius, y, Math.sin(angle2) * radius
          );

          if (i < layers) {
            vertices.push(
              Math.cos(angle1) * radius, y, Math.sin(angle1) * radius,
              Math.cos(angle1) * radius, y + 1, Math.sin(angle1) * radius
            );
          }
        }
      }

      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      return new THREE.LineSegments(geometry, material);
    };

    const createRoom = (): THREE.LineSegments => {
      const geometry = new THREE.BufferGeometry();
      const vertices: number[] = [];
      const size = 6;
      const height = 8;

      const basePoints = [
        [-size, 0, -size], [size, 0, -size], [size, 0, size], [-size, 0, size],
        [-size, height, -size], [size, height, -size], [size, height, size], [-size, height, size]
      ];

      for (let i = 0; i < 4; i++) {
        vertices.push(...basePoints[i], ...basePoints[(i + 1) % 4]);
        vertices.push(...basePoints[i + 4], ...basePoints[((i + 1) % 4) + 4]);
        vertices.push(...basePoints[i], ...basePoints[i + 4]);
      }

      const doorWidth = 2;
      const doorHeight = 4;
      vertices.push(
        -doorWidth / 2, 0, -size, -doorWidth / 2, doorHeight, -size,
        doorWidth / 2, 0, -size, doorWidth / 2, doorHeight, -size,
        -doorWidth / 2, doorHeight, -size, doorWidth / 2, doorHeight, -size
      );

      const windowSize = 1.5;
      const windowHeight = 5;
      const addWindow = (x: number, z: number) => {
        vertices.push(
          x - windowSize, windowHeight - windowSize, z,
          x + windowSize, windowHeight - windowSize, z,
          x + windowSize, windowHeight + windowSize, z,
          x - windowSize, windowHeight + windowSize, z,
          x - windowSize, windowHeight - windowSize, z
        );
      };

      addWindow(-size, 0);
      addWindow(size, 0);

      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      return new THREE.LineSegments(geometry, material);
    };

    const wheel = createWheel();
    const vessel = createVessel();
    const room = createRoom();

    wheel.position.set(-12, 0, 0);
    vessel.position.set(12, 0, 0);
    room.position.set(0, -4, 0);

    scene.add(wheel, vessel, room);

    camera.position.set(15, 15, 25);
    camera.lookAt(0, 0, 0);

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      wheel.rotation.y += 0.002;
      vessel.rotation.y += 0.001;
      room.rotation.y += 0.0005;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      const dpr = window.devicePixelRatio || 1;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(dpr, 2));
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

export default Sixascii;
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function Earth() {
  const meshRef = useRef();
  const lightRef = useRef();

  useFrame(({ clock }) => {
    meshRef.current.rotation.y = clock.getElapsedTime() * 0.12;
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight ref={lightRef} position={[5, 3, 5]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-5, -3, -5]} intensity={0.3} color="#3050ff" />
      {/* Earth sphere */}
      <Sphere ref={meshRef} args={[1.8, 64, 64]}>
        <meshStandardMaterial
          color="#1a6b3a"
          roughness={0.7}
          metalness={0.1}
          emissive="#0a2e15"
          emissiveIntensity={0.2}
        />
      </Sphere>
      {/* Atmosphere glow */}
      <Sphere args={[1.9, 32, 32]}>
        <meshStandardMaterial
          color="#4488ff"
          roughness={1}
          metalness={0}
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </Sphere>
      {/* Cloud layer */}
      <Sphere args={[1.85, 32, 32]}>
        <MeshDistortMaterial
          color="#ffffff"
          distort={0.15}
          speed={0.3}
          transparent
          opacity={0.25}
          roughness={1}
        />
      </Sphere>
    </>
  );
}

export default function EarthCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true }}
    >
      <Earth />
    </Canvas>
  );
}

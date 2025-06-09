"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

const EarthSphere = () => {
  const sphereRef = useRef();
  const cloudRef = useRef();
  const atmosphereRef = useRef();

  const [dayTexture, nightTexture, cloudTexture] = useTexture([
    "/earth.jpeg",
    "/nightEarth.jpeg",
    "/clouds.jpeg",
  ]);

  cloudTexture.colorSpace = THREE.NoColorSpace;
  cloudTexture.flipY = false;

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const initialSpeed = -3.9;
    const targetSpeed = -0.1;
    const duration = 2.2;
    let t = Math.min(time / duration, 1);
    let currentSpeed = initialSpeed + (targetSpeed - initialSpeed) * t;

    if (sphereRef.current) sphereRef.current.rotation.y += currentSpeed * 0.016;
    if (cloudRef.current) cloudRef.current.rotation.y += (currentSpeed * 2) * 0.016;
    if (atmosphereRef.current) atmosphereRef.current.rotation.y += currentSpeed * 0.016;
  });

  return (
    <group>
      <mesh ref={sphereRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          map={dayTexture}
          color={new THREE.Color(0.3, 0.7, 0.3)}
          emissiveMap={nightTexture}
          emissiveIntensity={4.5}
          emissive={new THREE.Color(0.1, 0.9, 0.4)}
          roughness={0.9}
          metalness={1.2}
        />
      </mesh>

      <mesh ref={cloudRef}>
        <sphereGeometry args={[2.005, 64, 64]} />
        <meshStandardMaterial
          map={cloudTexture}
          alphaMap={cloudTexture}
          transparent
          opacity={1.5}
          roughness={0.85}
          metalness={0.5}
        />
      </mesh>

      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[2.01, 64, 64]} />
        <meshStandardMaterial
          color={"#339966"}
          transparent
          opacity={0.1}
          emissive={new THREE.Color(0.1, 0.8, 0.4)}
          emissiveIntensity={0.3}
          roughness={1}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[2.15, 64, 64]} />
        <meshBasicMaterial color={"#88ffaa"} transparent opacity={0.01} />
      </mesh>
    </group>
  );
};

const Crosshair = () => {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.3) * 0.05;
    }
  });

  const crosshairColor = new THREE.Color("#00ff99");

  // Create circular ring geometry
  const ringGeometry = new THREE.RingGeometry(2.5, 2.21, 52);
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: crosshairColor,
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide,
  });

  // Create small T-shaped corner lines using thin boxes
  const lineMat = new THREE.MeshBasicMaterial({ color: crosshairColor });
  const hLine = new THREE.BoxGeometry(0.5, 0.015, 0.01);
  const vLine = new THREE.BoxGeometry(0.015, 0.5, 0.01);

  const offset = 2.45;

  return (
    <group ref={ref}>
      {/* Circular ring */}
      <mesh geometry={ringGeometry} material={ringMaterial} />

      {/* Corner crosshair targets */}
      {/* Top */}
      <mesh position={[0, offset, 0]} geometry={hLine} material={lineMat} />
      <mesh position={[0, offset + 0.25, 0]} geometry={vLine} material={lineMat} />

      {/* Bottom */}
      <mesh position={[0, -offset, 0]} geometry={hLine} material={lineMat} />
      <mesh position={[0, -offset - 0.25, 0]} geometry={vLine} material={lineMat} />

      {/* Left */}
      <mesh position={[-offset, 0, 0]} geometry={vLine} material={lineMat} />
      <mesh position={[-offset - 0.25, 0, 0]} geometry={hLine} material={lineMat} />

      {/* Right */}
      <mesh position={[offset, 0, 0]} geometry={vLine} material={lineMat} />
      <mesh position={[offset + 0.25, 0, 0]} geometry={hLine} material={lineMat} />
    </group>
  );
};

export const ThreeBackground = () => {
  return (
    <Canvas   camera={{ position: [0, 0, 4.2] }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 3, 3]} intensity={1} color={"#88ffbb"} />
      <group scale={1.15}>
        <EarthSphere />
        <Crosshair />
      </group>
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
};

export const OtherBackground = () => {
  return (
    <Canvas camera={{ position: [0, 0, 50] }} style={{ height: "100vh", width: "100%" }}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 3, 3]} intensity={1} color={"#ffffff"} />
      <OrbitControls enableZoom={false} enableRotate={false} />
    </Canvas>
  );
};

"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, useTexture } from "@react-three/drei";
import { useRef,useMemo } from "react";
import * as THREE from "three";

const EarthSphere = () => {
    const sphereRef = useRef();
    const cloudRef = useRef();
    const atmosphereRef = useRef();

    // Load textures
    const [dayTexture, nightTexture, specularCloudsTexture] = useTexture([
        "/earth.jpeg",    
        "/nightEarth.jpeg",  
        "/clouds.jpeg"
    ]);

    specularCloudsTexture.colorSpace = THREE.NoColorSpace;
    specularCloudsTexture.flipY = false;
    useFrame(({ clock }) => {
        const time = clock.getElapsedTime();
    
        // Initial and target speed
        const initialSpeed = -3.90;
        const targetSpeed = -0.1;
    
        // Duration over which to slow down
        const duration = 2.2;
    
        // Ensure a smooth transition using a clamped interpolation
        let t = Math.min(time / duration, 1); // Clamps between 0 and 1
        let currentSpeed = initialSpeed + (targetSpeed - initialSpeed) * t;
    
        // Apply the speed to the rotation
        if (sphereRef.current) {
            sphereRef.current.rotation.y += currentSpeed * 0.016; // Frame time approximation (60 FPS)
        }
        if (cloudRef.current) {
            cloudRef.current.rotation.y += (currentSpeed * 2) * 0.016;
        }
        if (atmosphereRef.current) {
            atmosphereRef.current.rotation.y += currentSpeed * 0.016;
        }
    });
    
    

    return (
        <group>
            {/* Earth */}
            <mesh ref={sphereRef}>
                <sphereGeometry args={[2, 64, 64]} />
                <meshStandardMaterial
                    map={dayTexture}
                    emissiveMap={nightTexture}
                    emissiveIntensity={1.9}
                    emissive={new THREE.Color(0.2, 0.2, 0.2)}
                    roughness={0.8}
                    metalness={0.9}
                />
            </mesh>

            {/* Cloud Layer */}
            <mesh ref={cloudRef}>
                <sphereGeometry args={[2.005, 64, 64]} />
                <meshStandardMaterial
                    map={specularCloudsTexture}
                    alphaMap={specularCloudsTexture}
                    transparent
                    opacity={2}
                    roughness={0.9}
                    metalness={0.6}
                />
            </mesh>

            {/* Atmosphere Layer */}
            <mesh ref={atmosphereRef}>
                <sphereGeometry args={[2.009, 64, 64]} />
                <meshStandardMaterial
                    color={"#3399ff"}
                    transparent
                    opacity={0.1} // Faint blue glow
                    emissive={new THREE.Color(0.1, 0.3, 0.8)}
                    emissiveIntensity={0.2}
                    roughness={1}
                />
            </mesh>

            {/* Haze Effect */}
            <mesh>
                <sphereGeometry args={[2.15, 64, 64]} />
                <meshBasicMaterial
                    color={"#6699ff"}
                    transparent
                    opacity={0.006} // Fainter outer glow
                />
            </mesh>
        </group>
    );
};
const HyperspaceStars = () => {
    const numStars = 500; // Number of stars
    const starsRef = useRef();
    const speedRef = useRef(0.2); // Initial slow speed

    // Generate random star positions and trails
    const stars = useMemo(() => {
        const positions = new Float32Array(numStars * 6); // Each star has 2 points (start & end of trail)
        for (let i = 0; i < numStars; i++) {
            let x = (Math.random() - 0.5) * 400; // Spread in X
            let y = (Math.random() - 0.5) * 200; // Spread in Y
            let z = Math.random() * -500; // Depth
            positions.set([x, y, z, x, y, z], i * 6);
        }
        return positions;
    }, []);

    useFrame(({ clock }) => {
        if (starsRef.current) {
            const positions = starsRef.current.geometry.attributes.position.array;
            let time = clock.getElapsedTime();

            // Gradually increase speed over 5 seconds (mimicking hyperspace acceleration)
            speedRef.current = Math.min(0.2 + time * 1.5, 1); // Max speed cap at 50

            for (let i = 0; i < positions.length; i += 6) {
                positions[i + 2] += speedRef.current; // Move star forward (start position)
                positions[i + 5] += speedRef.current * 1.2; // Move end of trail further (exaggerating streak)

                // Reset star when it gets too close
                if (positions[i + 2] > 10) {
                    let x = (Math.random() - 0.5) * 400;
                    let y = (Math.random() - 0.5) * 200;
                    let z = -500;
                    positions.set([x, y, z, x, y, z], i);
                }
            }
            starsRef.current.geometry.attributes.position.needsUpdate = true;
        }
    });

    return (
        <lineSegments ref={starsRef}>
            <bufferGeometry attach="geometry">
                <bufferAttribute
                    attach="attributes-position"
                    array={stars}
                    itemSize={3}
                    count={stars.length / 3}
                />
            </bufferGeometry>
            <lineBasicMaterial attach="material" color="white" linewidth={2} />
        </lineSegments>
    );
};
export const ThreeBackground = () => {
    return (
        <Canvas camera={{ position: [0, 0, 5] }}>
            {/* Sunlight */}
            <directionalLight position={[5, 3, 3]} intensity={1.5} color={"#ffffff"} />
            <ambientLight intensity={1} />
            <Stars radius={150} depth={50} count={5000} factor={4} />
            <EarthSphere />
            <OrbitControls enableZoom={false} />
        </Canvas>
    );
};

export const OtherBackground = () => {
    return (
        <Canvas camera={{ position: [0, 0, 50] }} style={{ height: "100vh", width: "100%" }}>
            <ambientLight intensity={0.3} />
            <directionalLight position={[5, 3, 3]} intensity={1} color={"#ffffff"} />

            {/* Hyperspace Jump Effect */}
            <HyperspaceStars />

            {/* Disable rotation to keep straight movement */}
            <OrbitControls enableZoom={false} enableRotate={false} />
        </Canvas>
    );
};
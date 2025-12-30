import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, MeshDistortMaterial, RoundedBox, MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { STAGES, DEALS, type Deal } from '../data/pipelineData';
import { THEME } from '../theme';

const DealMesh: React.FC<{ deal: Deal; index: number }> = ({ deal, index }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const stage = STAGES.find(s => s.id === deal.stageId) || STAGES[0];

    // Random offset for visual variety within a stage
    const offset = useMemo(() => [
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 8 - 4, // Spread vertically
        (Math.random() - 0.5) * 2
    ], []);

    useFrame((state) => {
        if (!meshRef.current) return;
        const t = state.clock.getElapsedTime();
        meshRef.current.position.y += Math.sin(t + index) * 0.005;
        meshRef.current.rotation.x = Math.sin(t * 0.5 + index) * 0.1;
        meshRef.current.rotation.z = Math.cos(t * 0.5 + index) * 0.1;
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh
                ref={meshRef}
                position={[
                    stage.position[0] + offset[0],
                    stage.position[1] + offset[1],
                    stage.position[2] + offset[2]
                ]}
            >
                <boxGeometry args={[1.5, 1.5, 1.5]} />
                <MeshDistortMaterial
                    color={stage.color}
                    speed={2}
                    distort={0.3}
                    radius={1}
                    emissive={stage.color}
                    emissiveIntensity={0.5}
                />
                <Text
                    position={[0, 1.5, 0]}
                    fontSize={0.4}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                >
                    {deal.name}
                </Text>
            </mesh>
        </Float>
    );
};

const SalesPipeline: React.FC = () => {
    return (
        <group position={[-20, 0, 0]}>
            {STAGES.map((stage) => (
                <group key={stage.id} position={stage.position}>
                    {/* Stage Panel */}
                    <RoundedBox args={[8, 12, 0.5]} radius={0.1} smoothness={4}>
                        <meshPhysicalMaterial
                            transparent
                            opacity={0.1}
                            roughness={0}
                            metalness={0.1}
                            transmission={0.5}
                            thickness={2}
                            color={stage.color}
                        />
                    </RoundedBox>

                    {/* Stage Border */}
                    <mesh>
                        <boxGeometry args={[8.1, 12.1, 0.51]} />
                        <meshBasicMaterial color={stage.color} wireframe opacity={0.3} transparent />
                    </mesh>

                    {/* Stage Label */}
                    <Text
                        position={[0, 6.5, 0]}
                        fontSize={1.2}
                        fontWeight="bold"
                        color={stage.color}
                        anchorX="center"
                        anchorY="middle"
                    >
                        {stage.name.toUpperCase()}
                    </Text>

                    {/* Value Summary (Optional) */}
                    <Text
                        position={[0, -6.5, 0]}
                        fontSize={0.6}
                        color="white"
                        opacity={0.6}
                        anchorX="center"
                        anchorY="middle"
                    >
                        {`Rs. ${DEALS.filter(d => d.stageId === stage.id).reduce((acc, d) => acc + d.value, 0).toLocaleString()}`}
                    </Text>
                </group>
            ))}

            {DEALS.map((deal, index) => (
                <DealMesh key={deal.id} deal={deal} index={index} />
            ))}

            {/* Connecting Lines/Flow */}
            {STAGES.slice(0, -1).map((stage, i) => (
                <mesh key={`connector-${i}`} position={[stage.position[0] + 5, 0, 0]}>
                    <boxGeometry args={[2, 0.1, 0.1]} />
                    <meshBasicMaterial color="white" transparent opacity={0.2} />
                </mesh>
            ))}

            {/* Reflective Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[10, -8, 0]}>
                <planeGeometry args={[150, 150]} />
                <MeshReflectorMaterial
                    blur={[300, 100]}
                    resolution={1024}
                    mixBlur={1}
                    mixStrength={40}
                    roughness={1}
                    depthScale={1.2}
                    minDepthThreshold={0.4}
                    maxDepthThreshold={1.4}
                    color="#101010"
                    metalness={0.5}
                    mirror={0} // Using mirror=0 but high mixStrength/mixBlur for a subtle glassy look
                />
            </mesh>
        </group>
    );
};

export default SalesPipeline;

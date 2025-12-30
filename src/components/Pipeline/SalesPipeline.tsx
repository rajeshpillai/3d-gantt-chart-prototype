import React, { useMemo, useRef, useState, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox, MeshReflectorMaterial, Html } from '@react-three/drei';
import * as THREE from 'three';
import { STAGES, DEALS, type DealSource } from '../../data/pipelineData';
import { useTheme } from '../../ThemeContext';

const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();

const SalesPipeline: React.FC = () => {
    const { colors } = useTheme();
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const SOURCE_COLORS: Record<DealSource, string> = {
        'india-mart': colors.tertiary,
        'web': colors.primary,
        'internal': colors.secondary
    };

    // Memoize random offsets and phases for animation
    const dealMetadata = useMemo(() => {
        return DEALS.map(() => ({
            offset: [
                (Math.random() - 0.5) * 5,
                (Math.random() - 0.5) * 8 - 4,
                (Math.random() - 0.5) * 2
            ],
            phase: Math.random() * Math.PI * 2,
            speed: 0.5 + Math.random() * 0.5
        }));
    }, []);

    // Initial positioning and coloring
    useLayoutEffect(() => {
        if (!meshRef.current) return;

        DEALS.forEach((deal, i) => {
            const stage = STAGES.find(s => s.id === deal.stageId) || STAGES[0];
            const meta = dealMetadata[i];

            tempObject.position.set(
                stage.position[0] + meta.offset[0],
                stage.position[1] + meta.offset[1],
                stage.position[2] + meta.offset[2]
            );
            tempObject.updateMatrix();
            meshRef.current?.setMatrixAt(i, tempObject.matrix);

            tempColor.set(SOURCE_COLORS[deal.source]);
            meshRef.current?.setColorAt(i, tempColor);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    }, [dealMetadata]);

    // Animation loop
    useFrame((state) => {
        if (!meshRef.current) return;
        const t = state.clock.getElapsedTime();

        DEALS.forEach((deal, i) => {
            const stage = STAGES.find(s => s.id === deal.stageId) || STAGES[0];
            const meta = dealMetadata[i];

            // Subtle floating and rotation
            const yOffset = Math.sin(t * meta.speed + meta.phase) * 0.2;
            const rotX = Math.sin(t * 0.5 + meta.phase) * 0.1;
            const rotZ = Math.cos(t * 0.5 + meta.phase) * 0.1;

            tempObject.position.set(
                stage.position[0] + meta.offset[0],
                stage.position[1] + meta.offset[1] + yOffset,
                stage.position[2] + meta.offset[2]
            );
            tempObject.rotation.set(rotX, 0, rotZ);
            tempObject.updateMatrix();
            meshRef.current?.setMatrixAt(i, tempObject.matrix);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    const onPointerMove = (e: any) => {
        e.stopPropagation();
        if (e.instanceId !== undefined) {
            setHoveredIndex(e.instanceId);
            document.body.style.cursor = 'pointer';
        }
    };

    const onPointerOut = () => {
        setHoveredIndex(null);
        document.body.style.cursor = 'auto';
    };

    const hoveredDeal = hoveredIndex !== null ? DEALS[hoveredIndex] : null;
    const hoveredMeta = hoveredIndex !== null ? dealMetadata[hoveredIndex] : null;

    return (
        <group position={[-20, 0, 0]}>
            {/* Pipeline Stages */}
            {STAGES.map((stage) => (
                <group key={stage.id} position={stage.position}>
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

                    <mesh>
                        <boxGeometry args={[8.1, 12.1, 0.51]} />
                        <meshBasicMaterial color={stage.color} wireframe opacity={0.3} transparent />
                    </mesh>

                    <Text
                        position={[0, 8, 0]}
                        fontSize={1.2}
                        fontWeight="bold"
                        color={colors.text.main}
                        anchorX="center"
                        anchorY="middle"
                    >
                        {stage.name.toUpperCase()}
                    </Text>

                    <Text
                        position={[0, -6.5, 0]}
                        fontSize={0.6}
                        color="white"
                        material-transparent
                        material-opacity={0.6}
                        anchorX="center"
                        anchorY="middle"
                    >
                        {`Rs. ${DEALS.filter(d => d.stageId === stage.id).reduce((acc, d) => acc + d.value, 0).toLocaleString()}`}
                    </Text>
                </group>
            ))}

            {/* Instanced Deals */}
            <instancedMesh
                ref={meshRef}
                args={[undefined, undefined, DEALS.length]}
                onPointerMove={onPointerMove}
                onPointerOut={onPointerOut}
            >
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial roughness={0.1} metalness={0.5} emissiveIntensity={0.5} />
            </instancedMesh>

            {/* Hover Label */}
            {hoveredDeal && hoveredMeta && (
                <Html
                    position={[
                        STAGES.find(s => s.id === hoveredDeal.stageId)!.position[0] + hoveredMeta.offset[0],
                        STAGES.find(s => s.id === hoveredDeal.stageId)!.position[1] + hoveredMeta.offset[1] + 1.5,
                        hoveredMeta.offset[2]
                    ]}
                    center
                    style={{ pointerEvents: 'none', zIndex: 100 }}
                >
                    <div style={{
                        background: 'rgba(0,0,0,0.85)',
                        color: 'white',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        whiteSpace: 'nowrap',
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${SOURCE_COLORS[hoveredDeal.source]}`,
                        fontSize: '0.9rem',
                        fontFamily: 'Inter, sans-serif'
                    }}>
                        <div style={{ fontWeight: 'bold' }}>{hoveredDeal.name}</div>
                        <div style={{ color: '#ccc', fontSize: '0.8rem' }}>{hoveredDeal.company}</div>
                        <div style={{ color: SOURCE_COLORS[hoveredDeal.source], fontSize: '0.8rem', marginTop: '4px' }}>
                            Source: {hoveredDeal.source.replace('-', ' ').toUpperCase()}
                        </div>
                        <div style={{ fontWeight: 'bold', marginTop: '4px' }}>Rs. {hoveredDeal.value.toLocaleString()}</div>
                    </div>
                </Html>
            )}

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
                    color={colors.background}
                    metalness={0.5}
                    mirror={0}
                />
            </mesh>

            {/* Connector Lines */}
            {STAGES.slice(0, -1).map((stage, i) => (
                <mesh key={`connector-${i}`} position={[stage.position[0] + 5, 0, 0]}>
                    <boxGeometry args={[2, 0.1, 0.1]} />
                    <meshBasicMaterial color="white" transparent opacity={0.2} />
                </mesh>
            ))}
        </group>
    );
};

export default SalesPipeline;

import React, { useMemo, useState, useRef } from 'react';
import { Sphere, Text, Line, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MOCK_DATA } from '../../mockData';
import { useTheme } from '../../ThemeContext';

const NODE_COUNT = 30;
const RADIUS = 20;

interface DependencyNode {
    id: string;
    name: string;
    position: THREE.Vector3;
    status: string;
    dependencies: string[];
    isCritical: boolean;
}

const DependencyGalaxy: React.FC = () => {
    const { colors } = useTheme();
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Generate nodes and random dependencies
    const graph = useMemo(() => {
        const nodes: DependencyNode[] = MOCK_DATA.slice(0, NODE_COUNT).map((task, i) => {
            // Position nodes in a spherical cloud
            const phi = Math.acos(-1 + (2 * i) / NODE_COUNT);
            const theta = Math.sqrt(NODE_COUNT * Math.PI) * phi;

            return {
                id: task.id,
                name: task.name,
                status: task.status,
                isCritical: i % 7 === 0 || task.status === 'delayed', // Mark every 7th and all delayed as critical
                position: new THREE.Vector3(
                    RADIUS * Math.cos(theta) * Math.sin(phi),
                    RADIUS * Math.sin(theta) * Math.sin(phi),
                    RADIUS * Math.cos(phi)
                ),
                dependencies: []
            };
        });

        // Create some random dependencies for visual interest
        nodes.forEach((node, i) => {
            if (i > 0) {
                const depCount = Math.floor(Math.random() * 2) + 1;
                for (let j = 0; j < depCount; j++) {
                    const targetIdx = Math.floor(Math.random() * i);
                    if (!node.dependencies.includes(nodes[targetIdx].id)) {
                        node.dependencies.push(nodes[targetIdx].id);
                    }
                }
            }
        });

        return nodes;
    }, []);

    // Calculate the "Bloodline" (reachable nodes in both directions)
    const bloodlineIds = useMemo(() => {
        if (!selectedId) return new Set<string>();

        const reachable = new Set<string>();
        reachable.add(selectedId);

        // 1. Upstream: Find all nodes that the selected node depends on
        const findUpstream = (id: string) => {
            const node = graph.find(n => n.id === id);
            if (!node) return;
            node.dependencies.forEach(depId => {
                if (!reachable.has(depId)) {
                    reachable.add(depId);
                    findUpstream(depId);
                }
            });
        };

        // 2. Downstream: Find all nodes that depend on the selected node
        const findDownstream = (id: string) => {
            graph.forEach(node => {
                if (node.dependencies.includes(id) && !reachable.has(node.id)) {
                    reachable.add(node.id);
                    findDownstream(node.id);
                }
            });
        };

        findUpstream(selectedId);
        findDownstream(selectedId);

        return reachable;
    }, [selectedId, graph]);

    const groupRef = useRef<THREE.Group>(null);
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += 0.001;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Ambient dust/stars */}
            <points>
                <sphereGeometry args={[RADIUS * 2, 32, 32]} />
                <pointsMaterial size={0.05} color="#555" transparent opacity={0.3} />
            </points>

            {/* Nodes */}
            {graph.map((node) => {
                const isSelected = selectedId === node.id;
                const isInBloodline = bloodlineIds.has(node.id);
                const opacity = !selectedId ? 0.8 : (isInBloodline ? 1.0 : 0.1);

                // Critical nodes are slightly larger and glow more
                const scale = isSelected ? 1.8 :
                    (node.isCritical ? 1.4 : (isInBloodline ? 1.2 : 1.0));

                const color = node.status === 'delayed' ? colors.danger :
                    node.status === 'done' ? colors.success : colors.primary;

                return (
                    <group key={node.id} position={node.position}>
                        <Sphere
                            args={[0.6, 16, 16]}
                            scale={scale}
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedId(selectedId === node.id ? null : node.id);
                            }}
                        >
                            <meshStandardMaterial
                                color={color}
                                emissive={color}
                                emissiveIntensity={isSelected || isInBloodline ? 3 : (node.isCritical ? 1.5 : 0.4)}
                                transparent
                                opacity={opacity}
                            />
                        </Sphere>

                        {(isInBloodline || !selectedId) && (
                            <Text
                                position={[0, 1.2, 0]}
                                fontSize={0.5}
                                color="white"
                                outlineColor="black"
                                outlineWidth={0.05}
                                fillOpacity={opacity}
                            >
                                {node.name.split(' ')[0]}
                            </Text>
                        )}
                    </group>
                );
            })}

            {/* Edges (Beams of Light) */}
            {graph.map((node) =>
                node.dependencies.map((depId) => {
                    const target = graph.find(n => n.id === depId);
                    if (!target) return null;

                    const isInBloodline = bloodlineIds.has(node.id) && bloodlineIds.has(target.id);
                    const opacity = !selectedId ? 0.2 : (isInBloodline ? 0.6 : 0.02);
                    const color = isInBloodline ? colors.success : colors.grid;

                    return (
                        <Line
                            key={`${node.id}-${depId}`}
                            points={[node.position, target.position]}
                            color={color}
                            lineWidth={isInBloodline ? 2 : 1}
                            transparent
                            opacity={opacity}
                        />
                    );
                })
            )}

            {/* Interaction hint */}
            <Html position={[0, -25, 0]} center>
                <div style={{
                    color: colors.text.main,
                    background: colors.background,
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    border: `1px solid ${colors.glassHigh}`
                }}>
                    {selectedId ? "Viewing Task Bloodline • Click again to reset" : "Critical Tasks glow intensely • Select one to see its Bloodline"}
                </div>
            </Html>
        </group>
    );
};

export default DependencyGalaxy;

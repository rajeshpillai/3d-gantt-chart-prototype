import React, { useMemo } from 'react';
import { Text, Float, MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { MOCK_DATA } from '../../mockData';
import { THEME } from '../../theme';

const LAYER_COUNT = 4;
const LAYER_SPACING = 8; // Increased for better card visibility
const LAYER_WIDTH = 40;
const LAYER_HEIGHT = 25;

const AuditLayer: React.FC<{ index: number; opacity: number; label: string }> = ({ index, opacity, label }) => {
    const y = index * LAYER_SPACING;

    // Simulate different snapshots by filtering/modifying data based on index
    const snapshotTasks = useMemo(() => {
        return MOCK_DATA.slice(0, 15).map((task, i) => ({
            ...task,
            // Vary progress/status slightly per layer to simulate "history"
            progress: Math.min(100, task.progress + (index - LAYER_COUNT + 1) * 10),
            status: index < 2 && i % 3 === 0 ? 'delayed' : task.status
        }));
    }, [index]);

    return (
        <group position={[0, y, 0]}>
            {/* The Glass Plane */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[LAYER_WIDTH, LAYER_HEIGHT]} />
                <meshPhysicalMaterial
                    color="#222"
                    transparent
                    opacity={opacity}
                    transmission={0.5}
                    thickness={0.5}
                    roughness={0.1}
                    metalness={0.2}
                />
            </mesh>

            <Text
                position={[-LAYER_WIDTH / 2 + 2, 0.5, LAYER_HEIGHT / 2 - 2]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={1}
                color="white"
                anchorX="left"
                opacity={0.8}
            >
                {label}
            </Text>

            {/* Snapshot Tasks */}
            {snapshotTasks.map((task, i) => {
                const tx = (i % 5) * 7 - 14;
                const tz = Math.floor(i / 5) * 5 - 5;
                const barWidth = 4;
                const progressWidth = (task.progress / 100) * barWidth;

                return (
                    <group key={`${task.id}-${index}`} position={[tx, 0.2, tz]}>
                        {/* Background Bar */}
                        <mesh rotation={[-Math.PI / 2, 0, 0]}>
                            <planeGeometry args={[barWidth, 0.6]} />
                            <meshBasicMaterial color="#444" transparent opacity={0.3} />
                        </mesh>

                        {/* Progress Bar */}
                        <mesh position={[(progressWidth - barWidth) / 2, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                            <planeGeometry args={[progressWidth, 0.6]} />
                            <meshBasicMaterial
                                color={task.status === 'delayed' ? '#ff4444' : '#00ff88'}
                                transparent
                                opacity={0.8}
                            />
                        </mesh>

                        <Text
                            position={[0, 0.4, 0]}
                            rotation={[-Math.PI / 2, 0, 0]}
                            fontSize={0.3}
                            color="white"
                        >
                            {task.name.split(' ')[0]}
                        </Text>

                        {/* Drift Connection (to layer below) */}
                        {index > 0 && (
                            <mesh position={[0, -LAYER_SPACING / 2, 0]}>
                                <cylinderGeometry args={[0.02, 0.02, LAYER_SPACING, 8]} />
                                <meshBasicMaterial
                                    color={task.status === 'delayed' ? '#ff4444' : '#555'}
                                    transparent
                                    opacity={task.status === 'delayed' ? 0.6 : 0.1}
                                />
                            </mesh>
                        )}
                    </group>
                );
            })}

            {/* Layer Insights Card */}
            <group position={[LAYER_WIDTH / 2 + 5, 2, 0]}>
                <mesh>
                    <planeGeometry args={[8, 6]} />
                    <meshBasicMaterial color="#111" transparent opacity={0.8} />
                </mesh>
                <Text position={[0, 2, 0.1]} fontSize={0.8} color="white" fontWeight="bold">INSIGHTS</Text>
                <Text position={[-3, 0.5, 0.1]} fontSize={0.5} color="#00ff88" anchorX="left">
                    {`• Efficiency: ${Math.round(85 + index * 3)}%`}
                </Text>
                <Text position={[-3, -0.5, 0.1]} fontSize={0.5} color={index > 1 ? "#ffcc00" : "#00ff88"} anchorX="left">
                    {`• Status: ${index > 2 ? 'On Track' : 'Baseline'}`}
                </Text>
                <Text position={[-3, -1.5, 0.1]} fontSize={0.5} color="#ff4444" anchorX="left">
                    {`• Variance: ${index * 2} days`}
                </Text>
            </group>
        </group>
    );
};

const TimeTravelAudit: React.FC = () => {
    const snapshots = [
        "Q1 Baseline",
        "Mid-Year Review",
        "Current Status",
        "Forecasted End"
    ];

    return (
        <group position={[0, -5, 0]}>
            {snapshots.map((label, i) => (
                <AuditLayer
                    key={label}
                    index={i}
                    label={label}
                    opacity={0.2 + (i * 0.1)}
                />
            ))}

            {/* Connection Lines simulation */}
            <mesh position={[0, (LAYER_COUNT * LAYER_SPACING) / 2 - 2, 0]}>
                <boxGeometry args={[0.05, LAYER_COUNT * LAYER_SPACING, 0.05]} />
                <meshBasicMaterial color="#00ff88" transparent opacity={0.2} />
            </mesh>

            {/* Bottom Reflector for extra depth */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
                <planeGeometry args={[100, 100]} />
                <MeshReflectorMaterial
                    blur={[300, 100]}
                    resolution={1024}
                    mixBlur={1}
                    mixStrength={60}
                    roughness={1}
                    depthScale={1.2}
                    minDepthThreshold={0.4}
                    maxDepthThreshold={1.4}
                    color="#050505"
                    metalness={0.5}
                    mirror={0}
                />
            </mesh>
        </group>
    );
};

export default TimeTravelAudit;

import React, { useMemo } from 'react';
import { Text, RoundedBox, Html } from '@react-three/drei';
import * as THREE from 'three';
import { THEME } from '../theme';

const TEAM_MEMBERS = ['Rajesh', 'Amit', 'Sriya', 'Vikram', 'Ananya', 'Kevin'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

const GRID_SIZE_X = MONTHS.length;
const GRID_SIZE_Z = TEAM_MEMBERS.length;
const PILLAR_GAP = 5;

const ResourcePillar: React.FC<{ x: number; z: number; count: number; member: string; month: string }> = ({ x, z, count, member, month }) => {
    // Heatmap color logic: Cyan (low) -> Yellow (mid) -> Red (high)
    const color = useMemo(() => {
        if (count < 3) return '#00d4ff'; // Cool
        if (count < 6) return '#ffcc00'; // Warning
        return '#ff4444'; // Burnout
    }, [count]);

    const height = count * 2;

    return (
        <group position={[x * PILLAR_GAP, height / 2, z * PILLAR_GAP]}>
            <RoundedBox args={[2, height, 2]} radius={0.1}>
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={0.2}
                    metalness={0.5}
                    roughness={0.2}
                />
            </RoundedBox>

            {/* Value Label on Top */}
            <Text
                position={[0, height / 2 + 0.5, 0]}
                fontSize={0.6}
                color="white"
                anchorY="bottom"
            >
                {count}
            </Text>
        </group>
    );
};

const ResourceTopology: React.FC = () => {
    // Mock workload data [memberIdx][monthIdx]
    const workloadData = useMemo(() => {
        return TEAM_MEMBERS.map(() =>
            MONTHS.map(() => Math.floor(Math.random() * 9) + 1)
        );
    }, []);

    return (
        <group position={[-PILLAR_GAP * 2.5, 0, -PILLAR_GAP * 2.5]}>
            {/* Grid Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[PILLAR_GAP * 2.5, -0.1, PILLAR_GAP * 2.5]}>
                <planeGeometry args={[PILLAR_GAP * 8, PILLAR_GAP * 8]} />
                <meshStandardMaterial color="#111" transparent opacity={0.5} metalness={0.8} />
            </mesh>

            {/* Labels - X Axis (Months) */}
            {MONTHS.map((month, i) => (
                <Text
                    key={month}
                    position={[i * PILLAR_GAP, 0.5, PILLAR_GAP * GRID_SIZE_Z]}
                    fontSize={1}
                    color="white"
                    rotation={[-Math.PI / 2, 0, 0]}
                >
                    {month}
                </Text>
            ))}

            {/* Labels - Z Axis (Team Members) */}
            {TEAM_MEMBERS.map((member, i) => (
                <Text
                    key={member}
                    position={[-4, 0.5, i * PILLAR_GAP]}
                    fontSize={1}
                    color="white"
                    rotation={[-Math.PI / 2, 0, 0]}
                    anchorX="right"
                >
                    {member}
                </Text>
            ))}

            {/* Pillars */}
            {workloadData.map((row, zIndex) =>
                row.map((count, xIndex) => (
                    <ResourcePillar
                        key={`${zIndex}-${xIndex}`}
                        x={xIndex}
                        z={zIndex}
                        count={count}
                        member={TEAM_MEMBERS[zIndex]}
                        month={MONTHS[xIndex]}
                    />
                ))
            )}

            {/* Perspective Guide Lines */}
            <gridHelper args={[PILLAR_GAP * 10, 10, 0x444444, 0x222222]} position={[PILLAR_GAP * 2.5, 0, PILLAR_GAP * 2.5]} />
        </group>
    );
};

export default ResourceTopology;

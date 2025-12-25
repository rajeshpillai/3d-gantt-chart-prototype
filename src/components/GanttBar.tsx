import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox, Html } from '@react-three/drei';
import * as THREE from 'three';
import { THEME } from '../theme';
import type { GanttTask } from '../mockData';

interface GanttBarProps {
    task: GanttTask;
    index: number;
}

const GanttBar: React.FC<GanttBarProps> = ({ task, index }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);

    const width = task.duration * THEME.metrics.dayWidth;
    const height = THEME.metrics.barHeight;
    const depth = THEME.metrics.barDepth;

    // X position: startDay * dayWidth + half width (since mesh is centered)
    const x = (task.startDay * THEME.metrics.dayWidth) + (width / 2);
    // Y position: index * rowHeight (negative to go down)
    const y = -(index * THEME.metrics.rowHeight);
    const z = 0;

    const color =
        task.status === 'done' ? THEME.colors.success :
            task.status === 'in-progress' ? THEME.colors.warning :
                task.status === 'delayed' ? THEME.colors.danger :
                    THEME.colors.primary;

    useFrame((_, delta) => {
        if (meshRef.current) {
            // Subtle hover animation
            const targetScale = hovered ? 1.05 : 1;
            meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 10);
        }
    });

    return (
        <group position={[x, y, z]}>
            {/* The Bar */}
            <RoundedBox
                ref={meshRef}
                args={[width, height, depth]} // Width, Height, Depth
                radius={0.1} // Radius of the rounded corners
                smoothness={4} // The number of curve segments
                onPointerOver={() => { document.body.style.cursor = 'pointer'; setHovered(true); }}
                onPointerOut={() => { document.body.style.cursor = 'auto'; setHovered(false); }}
            >
                <meshPhysicalMaterial
                    color={color}
                    transparent
                    opacity={0.8}
                    roughness={0.2}
                    metalness={0.5}
                    clearcoat={1}
                    clearcoatRoughness={0.1}
                    emissive={color}
                    emissiveIntensity={hovered ? 0.4 : 0.1}
                />
            </RoundedBox>

            {/* Label above/on the bar */}
            <Text
                position={[-width / 2 + 0.2, height / 2 + 0.3, 0]}
                fontSize={THEME.metrics.textScale}
                color={THEME.colors.text.main}
                anchorX="left"
                anchorY="bottom"
            >
                {task.name}
            </Text>

            {/* Owner Avatar/Text (Simplified for now) */}
            <Text
                position={[width / 2 - 0.2, 0, depth / 2 + 0.01]}
                fontSize={0.2}
                color="white"
                anchorX="right"
                anchorY="middle"
            >
                {task.owner}
            </Text>

            {/* Tooltip on Hover */}
            {hovered && (
                <Html position={[0, height, 0]} center style={{ pointerEvents: 'none' }}>
                    <div style={{
                        background: 'rgba(0,0,0,0.8)',
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        whiteSpace: 'nowrap',
                        backdropFilter: 'blur(5px)',
                        border: `1px solid ${THEME.colors.glassHigh}`
                    }}>
                        <div style={{ fontWeight: 'bold' }}>{task.name}</div>
                        <div style={{ fontSize: '0.8em', color: '#ccc' }}>{task.duration} days</div>
                        <div style={{ fontSize: '0.8em', color: color, textTransform: 'capitalize' }}>{task.status}</div>
                    </div>
                </Html>
            )}
        </group>
    );
};

export default GanttBar;

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
    const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
    const [hovered, setHovered] = useState(false);

    const width = task.duration * THEME.metrics.dayWidth;
    const height = THEME.metrics.barHeight;
    const depth = THEME.metrics.barDepth;

    // X position
    const x = (task.startDay * THEME.metrics.dayWidth) + (width / 2);
    // Y position
    const y = -(index * THEME.metrics.rowHeight);
    const z = 0;

    const color =
        task.status === 'done' ? THEME.colors.success :
            task.status === 'in-progress' ? THEME.colors.warning :
                task.status === 'delayed' ? THEME.colors.danger :
                    THEME.colors.primary;

    useFrame((state, delta) => {
        if (meshRef.current) {
            // Hover scale
            const targetScale = hovered ? 1.05 : 1;
            meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 10);
        }

        // Pulsing effect for in-progress tasks
        if (materialRef.current && task.status === 'in-progress') {
            // Sine wave for pulsating emissive intensity
            // Time * speed + offset
            const time = state.clock.getElapsedTime();
            const pulse = (Math.sin(time * 3) + 1) * 0.5; // 0 to 1
            const minIntensity = 0.2;
            const maxIntensity = 1.0; // Very bright for neon feel

            materialRef.current.emissiveIntensity = minIntensity + (pulse * (maxIntensity - minIntensity));

            // Also slightly bobble position?
            // meshRef.current.position.y = y + Math.sin(time * 2) * 0.05; 
        }
    });

    return (
        <group position={[x, y, z]}>
            <RoundedBox
                ref={meshRef}
                args={[width, height, depth]}
                radius={0.1}
                smoothness={4}
                onPointerOver={() => { document.body.style.cursor = 'pointer'; setHovered(true); }}
                onPointerOut={() => { document.body.style.cursor = 'auto'; setHovered(false); }}
            >
                <meshPhysicalMaterial
                    ref={materialRef}
                    color={color}
                    transparent
                    opacity={0.9} // Higher opacity for better bloom
                    roughness={0.2}
                    metalness={0.1}
                    clearcoat={1}
                    clearcoatRoughness={0.1}
                    emissive={color}
                    emissiveIntensity={hovered ? 0.8 : (task.status === 'in-progress' ? 0.5 : 0.2)}
                    toneMapped={false} // Crucial for bloom to exceed 1.0
                />
            </RoundedBox>

            {/* Label */}
            <Text
                position={[-width / 2 + 0.2, height / 2 + 0.3, 0]}
                fontSize={THEME.metrics.textScale}
                color={THEME.colors.text.main}
                anchorX="left"
                anchorY="bottom"
            >
                {task.name}
            </Text>

            {/* Tooltip */}
            {hovered && (
                <Html position={[0, height, 0]} center style={{ pointerEvents: 'none', zIndex: 100 }}>
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

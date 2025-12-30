import React, { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox, Html, Float } from '@react-three/drei';
import * as THREE from 'three';
import { MOCK_DATA, type GanttTask } from '../../mockData';
import { THEME } from '../../theme';

const RADIUS = 15;
const CARD_WIDTH = 4;
const CARD_HEIGHT = 2.5;

const KanbanCard: React.FC<{ task: GanttTask; angle: number; y: number }> = ({ task, angle, y }) => {
    const [hovered, setHover] = useState(false);

    // Add tiny random jitter to prevent Z-fighting
    const jitter = useMemo(() => (Math.random() - 0.5) * 0.1, []);

    const pos = useMemo(() => {
        return [
            Math.sin(angle) * (RADIUS + (hovered ? 1 : 0) + jitter),
            y + jitter,
            Math.cos(angle) * (RADIUS + (hovered ? 1 : 0) + jitter)
        ] as [number, number, number];
    }, [angle, y, hovered, jitter]);

    const color =
        task.status === 'done' ? THEME.colors.success :
            task.status === 'in-progress' ? THEME.colors.warning :
                task.status === 'delayed' ? THEME.colors.danger :
                    THEME.colors.primary;

    return (
        <group position={pos} rotation={[0, angle, 0]}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
                <RoundedBox
                    args={[CARD_WIDTH, CARD_HEIGHT, 0.2]}
                    radius={0.05}
                    onPointerOver={() => { setHover(true); document.body.style.cursor = 'pointer'; }}
                    onPointerOut={() => { setHover(false); document.body.style.cursor = 'auto'; }}
                >
                    <meshStandardMaterial
                        color={color}
                        roughness={0.5}
                        metalness={0.1}
                    />
                </RoundedBox>

                <Text
                    position={[0, 0.4, 0.15]}
                    fontSize={0.25}
                    fontWeight="normal"
                    color="white"
                    maxWidth={CARD_WIDTH - 0.5}
                    anchorX="center"
                    anchorY="middle"
                >
                    {task.name}
                </Text>

                <Text
                    position={[0, -0.4, 0.15]}
                    fontSize={0.18}
                    color="white"
                    fillOpacity={0.7}
                    anchorX="center"
                    anchorY="middle"
                >
                    {task.category || 'General'}
                </Text>
            </Float>

            {hovered && (
                <Html position={[0, 1.5, 0]} center style={{ pointerEvents: 'none' }}>
                    <div style={{
                        background: 'rgba(0,0,0,0.9)',
                        color: 'white',
                        padding: '10px',
                        borderRadius: '8px',
                        border: `1px solid ${color}`,
                        backdropFilter: 'blur(10px)',
                        fontSize: '0.8rem',
                        minWidth: '150px'
                    }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{task.name}</div>
                        <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>Status: {task.status.toUpperCase()}</div>
                        <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>Owner: {task.owner || 'Unassigned'}</div>
                    </div>
                </Html>
            )}
        </group>
    );
};

const CircularKanban: React.FC = () => {
    const groupRef = useRef<THREE.Group>(null);

    // Group tasks by status
    const groupedTasks = useMemo(() => {
        const groups: Record<string, GanttTask[]> = {
            'todo': [],
            'in-progress': [],
            'done': [],
            'delayed': []
        };
        MOCK_DATA.slice(0, 50).forEach(task => { // Limit for performance/visual clarity
            if (groups[task.status]) groups[task.status].push(task);
            else groups['todo'].push(task);
        });
        return groups;
    }, []);

    const statuses = ['todo', 'in-progress', 'done', 'delayed'];

    useFrame(() => {
        if (groupRef.current) {
            // Auto rotation is disabled, use OrbitControls to move
            // groupRef.current.rotation.y += 0.001; 
        }
    });

    return (
        <group ref={groupRef}>
            {statuses.map((status, sIndex) => {
                const startAngle = (sIndex / statuses.length) * Math.PI * 2;
                const endAngle = ((sIndex + 1) / statuses.length) * Math.PI * 2;
                const centerAngle = (startAngle + endAngle) / 2;
                const tasks = groupedTasks[status];

                // Status Column Backdrop (Curved)
                return (
                    <group key={status}>
                        {/* Column Header */}
                        <Text
                            position={[
                                Math.sin(centerAngle) * (RADIUS + 2),
                                8.5,
                                Math.cos(centerAngle) * (RADIUS + 2)
                            ]}
                            rotation={[0, centerAngle, 0]}
                            fontSize={1.5}
                            fontWeight="normal"
                            color={
                                status === 'done' ? '#00cc6a' :
                                    status === 'in-progress' ? '#d4ac0d' :
                                        status === 'delayed' ? '#c0392b' :
                                            '#2980b9'
                            }
                        >
                            {status.toUpperCase()}
                        </Text>

                        {/* Task Cards in this column */}
                        {tasks.map((task, tIndex) => {
                            // Lay out cards in a grid on the circular surface
                            const row = Math.floor(tIndex / 2);
                            const col = tIndex % 2;
                            const localAngle = centerAngle + (col - 0.5) * 0.22; // Slightly tighter columns
                            const y = 6.0 - (row * 3.0); // Reduced margin: Header @ 8.5, Cards start @ 6.0

                            return (
                                <KanbanCard
                                    key={task.id}
                                    task={task}
                                    angle={localAngle}
                                    y={y}
                                />
                            );
                        })}
                    </group>
                );
            })}

            {/* Central Pillar or Floor? */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -8, 0]}>
                <circleGeometry args={[30, 64]} />
                <meshStandardMaterial color="#050505" roughness={0.5} />
            </mesh>

            <mesh position={[0, -4, 0]}>
                <cylinderGeometry args={[2, 2, 12, 32]} />
                <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} transparent opacity={0.5} />
            </mesh>
        </group>
    );
};

export default CircularKanban;

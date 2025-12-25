import React, { useMemo, useRef, useState, useLayoutEffect } from 'react';
import { type ThreeElements } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { MOCK_DATA } from '../mockData';
import { THEME } from '../theme';

const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();

const GanttChart: React.FC<ThreeElements['group']> = (props) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const [hoveredId, setHover] = useState<string | null>(null);

    // Render all data
    const tasks = MOCK_DATA;
    const count = tasks.length;

    useLayoutEffect(() => {
        if (!meshRef.current) return;

        // Set positions and colors
        tasks.forEach((task, index) => {
            const width = task.duration * THEME.metrics.dayWidth;
            const height = THEME.metrics.barHeight;
            const depth = THEME.metrics.barDepth;

            const x = (task.startDay * THEME.metrics.dayWidth) + (width / 2);
            const y = -(index * THEME.metrics.rowHeight);
            const z = 0;

            tempObject.position.set(x, y, z);
            tempObject.scale.set(width, height, depth);
            tempObject.updateMatrix();

            meshRef.current!.setMatrixAt(index, tempObject.matrix);

            // Color
            const color =
                task.status === 'done' ? THEME.colors.success :
                    task.status === 'in-progress' ? THEME.colors.warning :
                        task.status === 'delayed' ? THEME.colors.danger :
                            THEME.colors.primary;

            tempColor.set(color);
            meshRef.current!.setColorAt(index, tempColor);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    }, [tasks]);

    // Hover Logic
    const onMove = (e: any) => {
        e.stopPropagation();
        if (e.instanceId !== undefined) {
            const task = tasks[e.instanceId];
            if (task && task.id !== hoveredId) {
                setHover(task.id);
                document.body.style.cursor = 'pointer';
            }
        }
    };

    const onOut = () => {
        setHover(null);
        document.body.style.cursor = 'auto';
    };

    // Find hovered task for Label
    const hoveredTask = useMemo(() => tasks.find(t => t.id === hoveredId), [hoveredId, tasks]);
    const hoveredIndex = useMemo(() => tasks.findIndex(t => t.id === hoveredId), [hoveredId, tasks]);

    // Calculate hover label position
    const labelPos = useMemo(() => {
        if (!hoveredTask || hoveredIndex === -1) return [0, 0, 0];
        const width = hoveredTask.duration * THEME.metrics.dayWidth;
        const x = (hoveredTask.startDay * THEME.metrics.dayWidth) + (width / 2);
        const y = -(hoveredIndex * THEME.metrics.rowHeight);
        return [x, y, 0];
    }, [hoveredTask, hoveredIndex]);


    return (
        <group {...props}>
            <instancedMesh
                ref={meshRef}
                args={[undefined, undefined, count]}
                onPointerMove={onMove}
                onPointerOut={onOut}
            >
                <boxGeometry args={[1, 1, 1]} />
                <meshPhysicalMaterial
                    transparent
                    opacity={0.9}
                    roughness={0.2}
                    metalness={0.1}
                    clearcoat={1}
                    toneMapped={false}
                />
            </instancedMesh>

            {/* Single Label for Hovered Item */}
            {hoveredTask && (
                <group position={labelPos as [number, number, number]}>
                    <mesh>
                        <boxGeometry args={[hoveredTask.duration * THEME.metrics.dayWidth + 0.2, THEME.metrics.barHeight + 0.2, THEME.metrics.barDepth + 0.2]} />
                        <meshBasicMaterial color="white" wireframe />
                    </mesh>

                    <Html position={[0, 1, 0]} center style={{ pointerEvents: 'none', zIndex: 100 }}>
                        <div style={{
                            background: 'rgba(0,0,0,0.8)',
                            color: 'white',
                            padding: '5px 10px',
                            borderRadius: '5px',
                            whiteSpace: 'nowrap',
                            backdropFilter: 'blur(5px)',
                            border: `1px solid ${THEME.colors.glassHigh}`
                        }}>
                            <div style={{ fontWeight: 'bold' }}>{hoveredTask.name}</div>
                            <div style={{ fontSize: '0.8em', color: '#ccc' }}>{hoveredTask.duration} days</div>
                            {hoveredTask.startDate && hoveredTask.endDate && (
                                <div style={{ fontSize: '0.7em', color: '#aaa' }}>{hoveredTask.startDate} - {hoveredTask.endDate}</div>
                            )}
                            <div style={{ fontSize: '0.8em', textTransform: 'capitalize' }}>{hoveredTask.status}</div>
                        </div>
                    </Html>
                </group>
            )}

            <gridHelper
                args={[100, 100, THEME.colors.grid, THEME.colors.grid]}
                rotation={[Math.PI / 2, 0, 0]}
                position={[25, -count * THEME.metrics.rowHeight / 2, -0.5]}
            />
        </group>
    );
};

export default GanttChart;

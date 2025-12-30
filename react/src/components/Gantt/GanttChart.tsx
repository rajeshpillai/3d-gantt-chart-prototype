import React, { useMemo, useRef, useState, useLayoutEffect } from 'react';
import { type ThreeElements } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { MOCK_DATA } from '../../mockData';
import { useVirtualWindow } from '../../hooks/useVirtualWindow';
import { useTheme } from '../../ThemeContext';

const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();

const GanttChart: React.FC<ThreeElements['group']> = (props) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const [hoveredId, setHover] = useState<string | null>(null);
    const { colors, metrics } = useTheme();

    // Virtualization Hook
    const { start, end } = useVirtualWindow(MOCK_DATA.length);

    // We render a fixed pool of instances equal to the window size
    // For this prototype, we'll try to just render the 'slice' of instances.
    // However, InstancedMesh args cannot change size easily without recreating buffer.
    // Better strategy: Create a pool of standard size (e.g. 500) and recycling them?
    // Actually, React-Three-Fiber handles count updates reasonably well if strictly limited.
    // But 'args={[undefined, undefined, count]}' re-instantiates geometry if 'count' changes drastically.
    // 'useVirtualWindow' returns a stable-ish size POOL_SIZE (500).
    const count = end - start;

    useLayoutEffect(() => {
        if (!meshRef.current) return;

        // Update the instances to represent the data in [start, end]
        for (let i = 0; i < count; i++) {
            const dataIndex = start + i;
            const task = MOCK_DATA[dataIndex];

            if (task) {
                const width = task.duration * metrics.dayWidth;
                const height = metrics.barHeight;
                const depth = metrics.barDepth;

                const x = (task.startDay * metrics.dayWidth) + (width / 2);
                const y = -(dataIndex * metrics.rowHeight);
                const z = 0;

                tempObject.position.set(x, y, z);
                tempObject.scale.set(width, height, depth);
                tempObject.updateMatrix();

                meshRef.current.setMatrixAt(i, tempObject.matrix);

                // Color
                const color =
                    task.status === 'done' ? colors.success :
                        task.status === 'in-progress' ? colors.warning :
                            task.status === 'delayed' ? colors.danger :
                                colors.primary;

                tempColor.set(color);
                meshRef.current.setColorAt(i, tempColor);
            } else {
                // Out of bounds (shouldn't happen with correct logic)
                tempObject.scale.set(0, 0, 0);
                tempObject.updateMatrix();
                meshRef.current.setMatrixAt(i, tempObject.matrix);
            }
        }

        meshRef.current.count = count;
        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;

    }, [start, end, count, colors, metrics]); // Re-run when window slides or theme changes

    // Hover Logic (adapted for virtual index)
    const onMove = (e: any) => {
        e.stopPropagation();
        if (e.instanceId !== undefined) {
            const realIndex = start + e.instanceId;
            const task = MOCK_DATA[realIndex];
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
    const hoveredTask = useMemo(() => MOCK_DATA.find(t => t.id === hoveredId), [hoveredId]);
    const hoveredIndex = useMemo(() => MOCK_DATA.findIndex(t => t.id === hoveredId), [hoveredId]);

    // Calculate hover label position
    const labelPos = useMemo(() => {
        if (!hoveredTask || hoveredIndex === -1) return [0, 0, 0];
        const width = hoveredTask.duration * metrics.dayWidth;
        const x = (hoveredTask.startDay * metrics.dayWidth) + (width / 2);
        const y = -(hoveredIndex * metrics.rowHeight);
        return [x, y, 0];
    }, [hoveredTask, hoveredIndex, metrics]);


    return (
        <group {...props}>
            <instancedMesh
                ref={meshRef}
                args={[undefined, undefined, 1000]} // Max buffer size
                onPointerMove={onMove}
                onPointerOut={onOut}
                frustumCulled={false}
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
                        <boxGeometry args={[hoveredTask.duration * metrics.dayWidth + 0.2, metrics.barHeight + 0.2, metrics.barDepth + 0.2]} />
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
                            border: `1px solid ${colors.glassHigh}`
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
                args={[100, 100, colors.grid, colors.grid]}
                rotation={[Math.PI / 2, 0, 0]}
                position={[25, -MOCK_DATA.length * metrics.rowHeight / 2, -0.5]}
            />
        </group>
    );
};

export default GanttChart;

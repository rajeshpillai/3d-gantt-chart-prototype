import React, { useMemo } from 'react';
import type { ThreeElements } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { MOCK_DATA } from '../mockData';
import GanttBar from './GanttBar';
import { THEME } from '../theme';

const GanttChart: React.FC<ThreeElements['group']> = (props) => {
    // Calculate dependencies lines
    const dependencyLines = useMemo(() => {
        const lines: React.ReactElement[] = [];
        MOCK_DATA.forEach((task, index) => {
            if (task.dependencies) {
                task.dependencies.forEach((depId) => {
                    const depTask = MOCK_DATA.find(t => t.id === depId);
                    const depIndex = MOCK_DATA.findIndex(t => t.id === depId);

                    if (depTask && depIndex !== -1) {
                        // Calculate start and end points
                        // Start: End of dependency task
                        const startX = (depTask.startDay + depTask.duration) * THEME.metrics.dayWidth;
                        const startY = -(depIndex * THEME.metrics.rowHeight);
                        const startZ = 0;

                        // End: Start of current task
                        const endX = (task.startDay) * THEME.metrics.dayWidth;
                        const endY = -(index * THEME.metrics.rowHeight);
                        const endZ = 0;

                        // Simple Bezier curve points or straight line
                        // We'll use a multi-segment line for a "circuit" look

                        const midX = (startX + endX) / 2;

                        const points = [
                            new THREE.Vector3(startX, startY, startZ),
                            new THREE.Vector3(midX, startY, startZ),
                            new THREE.Vector3(midX, endY, endZ),
                            new THREE.Vector3(endX, endY, endZ)
                        ];

                        lines.push(
                            <Line
                                key={`${depId}-${task.id}`}
                                points={points}
                                color={THEME.colors.text.muted}
                                lineWidth={1}
                                transparent
                                opacity={0.3}
                            />
                        );
                    }
                });
            }
        });
        return lines;
    }, []);

    return (
        <group {...props}>
            {MOCK_DATA.map((task, index) => (
                <GanttBar key={task.id} task={task} index={index} />
            ))}

            {/* Render Dependencies */}
            {dependencyLines}

            {/* Background Grid Lines (Optional) */}
            <gridHelper
                args={[100, 100, THEME.colors.grid, THEME.colors.grid]}
                rotation={[Math.PI / 2, 0, 0]}
                position={[25, -5, -0.5]}
            />
        </group>
    );
};

export default GanttChart;

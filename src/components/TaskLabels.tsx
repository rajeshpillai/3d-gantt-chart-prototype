import React, { useMemo } from 'react';
import { Text } from '@react-three/drei';
import { MOCK_DATA } from '../mockData';
import { THEME } from '../theme';

const TaskLabels: React.FC = () => {
    // Filter for "Major" tasks to avoid performance bottleneck
    // Only show text for tasks longer than 15 days
    const visibleLabels = useMemo(() => {
        return MOCK_DATA.filter(task => task.duration > 15);
    }, []);

    return (
        <group>
            {visibleLabels.map((task) => {
                const index = MOCK_DATA.findIndex(t => t.id === task.id); // Need original index for Y position

                const width = task.duration * THEME.metrics.dayWidth;
                const x = (task.startDay * THEME.metrics.dayWidth);
                const y = -(index * THEME.metrics.rowHeight);
                const z = 0.6; // Slightly in front of the bar

                return (
                    <Text
                        key={task.id}
                        position={[x + 1, y, z]} // Offset X slightly
                        fontSize={0.6}
                        maxWidth={width - 2} // Truncate if too long (simple clamp)
                        color="white"
                        anchorX="left"
                        anchorY="middle"
                        outlineWidth={0.05}
                        outlineColor="#000000"
                    >
                        {task.name}
                    </Text>
                );
            })}
        </group>
    );
};

export default TaskLabels;

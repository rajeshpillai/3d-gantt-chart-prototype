import React, { useMemo } from 'react';
import { Text } from '@react-three/drei';
import { MOCK_DATA } from '../mockData';
import { THEME } from '../theme';
import { useVirtualWindow } from '../hooks/useVirtualWindow';

const TaskLabels: React.FC = () => {
    const { start, end } = useVirtualWindow(MOCK_DATA.length);

    // Get the slice of data currently in view
    const visibleData = useMemo(() => {
        return MOCK_DATA.slice(start, end);
    }, [start, end]);

    return (
        <group>
            {visibleData.map((task, i) => {
                const globalIndex = start + i;

                const width = task.duration * THEME.metrics.dayWidth;
                const x = (task.startDay * THEME.metrics.dayWidth);
                const y = -(globalIndex * THEME.metrics.rowHeight);
                const z = 0.6;

                return (
                    <Text
                        key={task.id}
                        position={[x + 1, y, z]}
                        fontSize={0.6}
                        maxWidth={width - 2}
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

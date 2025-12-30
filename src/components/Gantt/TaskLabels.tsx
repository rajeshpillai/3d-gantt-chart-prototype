import React, { useMemo } from 'react';
import { Text } from '@react-three/drei';
import { MOCK_DATA } from '../../mockData';
import { THEME } from '../../theme';
import { useVirtualWindow } from '../../hooks/useVirtualWindow';
import { useTheme } from '../../ThemeContext';

const TaskLabels: React.FC = () => {
    const { colors, metrics } = useTheme();
    const { start, end } = useVirtualWindow(MOCK_DATA.length);

    // Get the slice of data currently in view
    const visibleData = useMemo(() => {
        return MOCK_DATA.slice(start, end);
    }, [start, end]);

    return (
        <group>
            {visibleData.map((task, i) => {
                const globalIndex = start + i;

                const width = task.duration * metrics.dayWidth;
                const x = (task.startDay * metrics.dayWidth);
                const y = -(globalIndex * metrics.rowHeight);
                const z = 0.6;

                return (
                    <Text
                        key={task.id}
                        position={[x + 1, y, z]}
                        fontSize={0.6}
                        maxWidth={width - 2}
                        color={colors.text.main}
                        anchorX="left"
                        anchorY="middle"
                        outlineWidth={0.05}
                        outlineColor={colors.background}
                    >
                        {task.name}
                    </Text>
                );
            })}
        </group>
    );
};

export default TaskLabels;

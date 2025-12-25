import React, { useMemo } from 'react';
import { Text } from '@react-three/drei';
import { THEME } from '../theme';

const TimeAxis: React.FC = () => {
    // Range: Apr 1, 2025 to Mar 30, 2026
    // We'll generate ticks for each month start

    const startDate = new Date('2025-04-01');
    const labels = useMemo(() => {
        const items = [];
        const current = new Date(startDate);

        // Generate for 14 months to be safe (cover full range + buffer)
        for (let i = 0; i < 14; i++) {
            const dateStr = current.toLocaleString('default', { month: 'short', year: 'numeric' });

            // Calculate days from project start
            const diffTime = current.getTime() - startDate.getTime();
            const diffDays = diffTime / (1000 * 60 * 60 * 24);

            items.push({
                label: dateStr,
                x: diffDays * THEME.metrics.dayWidth
            });

            // Move to next month
            current.setMonth(current.getMonth() + 1);
        }
        return items;
    }, []);

    const axisY = 10; // Height above the chart
    const gridBottom = -10000 * THEME.metrics.rowHeight; // Extend down far enough for 10k items

    return (
        <group>
            {labels.map((item, index) => (
                <group key={index} position={[item.x, 0, 0]}>
                    {/* Label */}
                    <Text
                        position={[0, axisY, 0]}
                        fontSize={2}
                        color={THEME.colors.text.main}
                        anchorX="left"
                        anchorY="bottom"
                    >
                        {item.label}
                    </Text>

                    {/* Vertical Grid Line */}
                    <mesh position={[0, gridBottom / 2 + axisY / 2, -0.5]}>
                        {/* Height is roughly absolute value of gridBottom */}
                        <planeGeometry args={[0.2, Math.abs(gridBottom) + axisY]} />
                        <meshBasicMaterial color={THEME.colors.glassHigh} transparent opacity={0.3} />
                    </mesh>
                </group>
            ))}
        </group>
    );
};

export default TimeAxis;

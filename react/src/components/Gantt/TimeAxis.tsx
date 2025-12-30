import React, { useMemo } from 'react';
import { Text } from '@react-three/drei';
import { useTheme } from '../../ThemeContext';

const TimeAxis: React.FC = () => {
    const { colors, metrics } = useTheme();
    // Range: Apr 1, 2025 to Mar 30, 2026
    const startDate = new Date('2025-04-01');

    const { months, weeks, days } = useMemo(() => {
        const monthsArr = [];
        const weeksArr = [];
        const daysArr = [];

        const current = new Date(startDate);

        for (let i = 0; i < 380; i++) {
            const date = new Date(current);
            const dom = date.getDate();
            const dayOfWeek = date.getDay();

            const x = i * metrics.dayWidth;

            daysArr.push({
                label: dom.toString(),
                x: x
            });

            if (dayOfWeek === 1) {
                const weekNum = Math.floor(i / 7) + 1;
                weeksArr.push({
                    label: `W${weekNum}`,
                    x: x
                });
            }

            if (dom === 1) {
                const monthStr = date.toLocaleString('default', { month: 'short', year: 'numeric' });
                monthsArr.push({
                    label: monthStr,
                    x: x
                });
            }

            current.setDate(current.getDate() + 1);
        }

        return { months: monthsArr, weeks: weeksArr, days: daysArr };
    }, [metrics]);

    const axisY = 12;
    const gridBottom = -100000 * metrics.rowHeight;

    return (
        <group>
            {/* MONTHS (Top) */}
            {months.map((item, index) => (
                <group key={`m-${index}`} position={[item.x, 0, 0]}>
                    <Text
                        position={[0, axisY, 0]}
                        fontSize={1.8}
                        color={colors.text.main}
                        anchorX="left"
                        anchorY="bottom"
                    >
                        {item.label}
                    </Text>
                    {/* Month Divider (Thick) */}
                    <mesh position={[0, gridBottom / 2 + axisY / 2, -0.6]}>
                        <planeGeometry args={[0.3, Math.abs(gridBottom) + axisY]} />
                        <meshBasicMaterial color={colors.text.main} transparent opacity={0.5} />
                    </mesh>
                </group>
            ))}

            {/* WEEKS (Middle) */}
            {weeks.map((item, index) => (
                <group key={`w-${index}`} position={[item.x, 0, 0]}>
                    <Text
                        position={[0, axisY - 2, 0]}
                        fontSize={1}
                        color={colors.text.muted}
                        anchorX="left"
                        anchorY="bottom"
                    >
                        {item.label}
                    </Text>
                    {/* Week Divider (Thin) */}
                    <mesh position={[0, gridBottom / 2 + axisY / 2, -0.55]}>
                        <planeGeometry args={[0.1, Math.abs(gridBottom) + axisY]} />
                        <meshBasicMaterial color={colors.text.main} transparent opacity={0.2} />
                    </mesh>
                </group>
            ))}

            {/* DAYS (Bottom) */}
            {days.map((item, index) => (
                <group key={`d-${index}`} position={[item.x, 0, 0]}>
                    <Text
                        position={[0.4, axisY - 3.5, 0]}
                        fontSize={0.4}
                        color={colors.text.muted}
                        anchorX="center"
                        anchorY="bottom"
                    >
                        {item.label}
                    </Text>
                    {/* Day Divider (Very Faint) */}
                    <mesh position={[0, gridBottom / 2 + axisY / 2, -0.5]}>
                        <planeGeometry args={[0.02, Math.abs(gridBottom) + axisY]} />
                        <meshBasicMaterial color={colors.text.main} transparent opacity={0.1} />
                    </mesh>
                </group>
            ))}
        </group>
    );
};

export default TimeAxis;

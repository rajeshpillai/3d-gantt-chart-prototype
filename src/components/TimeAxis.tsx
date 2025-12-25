import React, { useMemo } from 'react';
import { Text } from '@react-three/drei';
import { THEME } from '../theme';

const TimeAxis: React.FC = () => {
    // Range: Apr 1, 2025 to Mar 30, 2026
    const startDate = new Date('2025-04-01');

    const { months, weeks, days } = useMemo(() => {
        const monthsArr = [];
        const weeksArr = [];
        const daysArr = [];

        const current = new Date(startDate);
        // Approx 14 months * 30 days = 420 iterations. safe.
        // Let's iterate day by day to capture everything accurately.

        // We'll run for 380 days (approx 1 year + buffer)
        for (let i = 0; i < 380; i++) {
            // Copy current date state
            const date = new Date(current);
            const dom = date.getDate(); // Day of Month (1-31)
            const dayOfWeek = date.getDay(); // 0=Sun, 1=Mon...

            // X position
            const x = i * THEME.metrics.dayWidth;

            // 1. Days (Every day)
            // Show only numeric date? "01", "05", etc.
            // optimization: maybe show every other day if zoomed out?
            // For now, render all. Font size small.
            daysArr.push({
                label: dom.toString(),
                x: x
            });

            // 2. Weeks (Mondays)
            if (dayOfWeek === 1) { // Monday
                // Get Week Number (rough approx or use library)
                // Minimalist: just "W" + count? or ISO week?
                // Let's just create a sequential week from project start for simplicity "W1", "W2"...
                const weekNum = Math.floor(i / 7) + 1;
                weeksArr.push({
                    label: `W${weekNum}`,
                    x: x
                });
            }

            // 3. Months (1st of month)
            if (dom === 1) {
                const monthStr = date.toLocaleString('default', { month: 'short', year: 'numeric' });
                monthsArr.push({
                    label: monthStr,
                    x: x
                });
            }

            // Increment
            current.setDate(current.getDate() + 1);
        }

        return { months: monthsArr, weeks: weeksArr, days: daysArr };
    }, []);

    const axisY = 12; // Base Height above chart
    const gridBottom = -100000 * THEME.metrics.rowHeight; // Extend deep

    return (
        <group>
            {/* MONTHS (Top) */}
            {months.map((item, index) => (
                <group key={`m-${index}`} position={[item.x, 0, 0]}>
                    <Text
                        position={[0, axisY, 0]}
                        fontSize={1.8}
                        color={THEME.colors.text.main}
                        anchorX="left"
                        anchorY="bottom"
                    >
                        {item.label}
                    </Text>
                    {/* Month Divider (Thick) */}
                    <mesh position={[0, gridBottom / 2 + axisY / 2, -0.6]}>
                        <planeGeometry args={[0.3, Math.abs(gridBottom) + axisY]} />
                        <meshBasicMaterial color={THEME.colors.glassHigh} transparent opacity={0.5} />
                    </mesh>
                </group>
            ))}

            {/* WEEKS (Middle) */}
            {weeks.map((item, index) => (
                <group key={`w-${index}`} position={[item.x, 0, 0]}>
                    <Text
                        position={[0, axisY - 2, 0]}
                        fontSize={1}
                        color="#aaa"
                        anchorX="left"
                        anchorY="bottom"
                    >
                        {item.label}
                    </Text>
                    {/* Week Divider (Thin) */}
                    <mesh position={[0, gridBottom / 2 + axisY / 2, -0.55]}>
                        <planeGeometry args={[0.1, Math.abs(gridBottom) + axisY]} />
                        <meshBasicMaterial color={THEME.colors.glassHigh} transparent opacity={0.2} />
                    </mesh>
                </group>
            ))}

            {/* DAYS (Bottom) */}
            {days.map((item, index) => (
                <group key={`d-${index}`} position={[item.x, 0, 0]}>
                    <Text
                        position={[0.4, axisY - 3.5, 0]} // Offset slightly to center in column
                        fontSize={0.4}
                        color="#666"
                        anchorX="center"
                        anchorY="bottom"
                    >
                        {item.label}
                    </Text>
                    {/* Day Divider (Very Faint) */}
                    <mesh position={[0, gridBottom / 2 + axisY / 2, -0.5]}>
                        <planeGeometry args={[0.02, Math.abs(gridBottom) + axisY]} />
                        <meshBasicMaterial color={THEME.colors.glassHigh} transparent opacity={0.05} />
                    </mesh>
                </group>
            ))}
        </group>
    );
};

export default TimeAxis;
